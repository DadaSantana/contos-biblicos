import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, checkFirestoreAvailability, tryReconnectFirestore } from './firebase';

// Singleton para gerenciar o estado da conectividade do aplicativo
class ConnectivityManager {
  private static instance: ConnectivityManager;
  private isConnected: boolean = true;
  private retryCount: number = 0;
  private maxRetries: number = 3;
  private connectionListeners: (() => void)[] = [];
  private unsubscribeNetInfo: (() => void) | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.setupNetworkListener();
  }

  // Obter instância singleton
  public static getInstance(): ConnectivityManager {
    if (!ConnectivityManager.instance) {
      ConnectivityManager.instance = new ConnectivityManager();
    }
    return ConnectivityManager.instance;
  }

  // Configurar listener para mudanças na conectividade
  private setupNetworkListener(): void {
    this.unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
      const wasConnected = this.isConnected;
      this.isConnected = Boolean(state.isConnected);
      
      // Se a conexão foi restaurada
      if (!wasConnected && this.isConnected) {
        console.log('Conexão restaurada. Sincronizando dados...');
        this.handleConnectionRestored();
      } 
      // Se a conexão foi perdida
      else if (wasConnected && !this.isConnected) {
        console.log('Conexão perdida. Entrando em modo offline.');
        this.handleConnectionLost();
      }
    });
  }

  // Quando a conexão é perdida
  private handleConnectionLost(): void {
    // Limpar qualquer tentativa de reconexão pendente
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  // Quando a conexão é restaurada
  private handleConnectionRestored(): void {
    this.retryCount = 0;
    this.retryFirebaseConnection();
    
    // Notificar todos os listeners registrados
    this.connectionListeners.forEach(listener => listener());
  }

  // Tentar reconectar ao Firebase
  private retryFirebaseConnection(): void {
    if (this.retryCount >= this.maxRetries) {
      console.log('Número máximo de tentativas de reconexão atingido.');
      return;
    }

    this.retryCount++;
    
    // Cancelar qualquer timeout existente
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    // Usar a nova função de reconexão
    tryReconnectFirestore()
      .then(isConnected => {
        if (isConnected) {
          console.log('Conexão com Firebase restaurada com sucesso!');
          Alert.alert(
            'Conexão Restaurada',
            'Sua conexão com a internet foi restaurada. Os dados estão sendo sincronizados.',
            [{ text: 'OK' }]
          );
        } else if (this.isConnected && this.retryCount < this.maxRetries) {
          // Se ainda estamos conectados com a internet mas o Firebase falhou,
          // tenta novamente após um atraso
          console.log(`Falha na tentativa ${this.retryCount}. Tentando novamente...`);
          this.reconnectTimeout = setTimeout(
            () => this.retryFirebaseConnection(), 
            2000 * this.retryCount
          );
        }
      })
      .catch(error => {
        console.error('Erro ao tentar reconectar ao Firebase:', error);
        if (this.isConnected && this.retryCount < this.maxRetries) {
          this.reconnectTimeout = setTimeout(
            () => this.retryFirebaseConnection(), 
            2000 * this.retryCount
          );
        }
      });
  }

  // Forçar verificação da conexão manualmente (para botão de atualização)
  public async checkConnection(): Promise<boolean> {
    // Primeiro verificar a conectividade de rede
    const netInfoState = await NetInfo.fetch();
    this.isConnected = Boolean(netInfoState.isConnected);
    
    if (!this.isConnected) {
      return false;
    }
    
    // Depois verificar a conectividade com o Firestore
    return await checkFirestoreAvailability();
  }

  // Registrar um callback para ser chamado quando a conexão for restaurada
  public addConnectionListener(listener: () => void): () => void {
    this.connectionListeners.push(listener);
    
    // Retorna uma função para remover o listener
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  // Verificar status atual da conexão
  public isOnline(): boolean {
    return this.isConnected;
  }

  // Iniciar processo de reconexão manualmente
  public reconnect(): void {
    if (this.isConnected) {
      this.retryCount = 0;
      this.retryFirebaseConnection();
    } else {
      console.log('Sem conexão de rede. Impossível reconectar ao Firebase.');
      Alert.alert(
        'Sem Conexão',
        'Não foi possível detectar uma conexão com a internet. Verifique sua rede e tente novamente.',
        [{ text: 'OK' }]
      );
    }
  }

  // Liberar recursos ao desmontar o app
  public cleanup(): void {
    if (this.unsubscribeNetInfo) {
      this.unsubscribeNetInfo();
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    
    this.connectionListeners = [];
  }
}

export default ConnectivityManager.getInstance(); 