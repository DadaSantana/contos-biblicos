import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogBox } from 'react-native';
import { COLORS } from './src/constants/colors';
import AppNavigator from './src/navigation/AppNavigator';

// Ignorar warnings específicos para desenvolvimento
LogBox.ignoreLogs([
  'Setting a timer',
  'AsyncStorage has been extracted',
  'VirtualizedLists should never be nested', // Temporário - será corrigido com uma melhor estrutura
  'FirebaseError', // Erros de Firebase serão tratados pela nossa lógica de fallback
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor={COLORS.primary} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
