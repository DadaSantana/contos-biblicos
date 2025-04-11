import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [statusChecked, setStatusChecked] = useState(false);

  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkConnection();
      }
    };

    const checkConnection = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
        setStatusChecked(true);
      } catch (error) {
        console.error('Failed to check network status:', error);
        setIsConnected(false);
        setStatusChecked(true);
      }
    };

    // Verifica a conexão inicial
    checkConnection();

    // Inscrever para atualizações de estado de conexão
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setIsConnected(state.isConnected);
      setStatusChecked(true);
    });

    // Monitorar alterações de estado da aplicação
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribe();
      appStateSubscription.remove();
    };
  }, []);

  return { 
    isConnected, 
    statusChecked,
    isOffline: statusChecked && !isConnected
  };
}; 