import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const ProfileScreen: React.FC = () => {
  // Na implementação real, esses dados viriam de um contexto de autenticação
  const user = {
    name: 'Usuário',
    isPremium: false,
  };

  const menuItems = [
    {
      id: 'account',
      title: 'Minha Conta',
      icon: 'person-outline',
      onPress: () => console.log('Minha Conta'),
    },
    {
      id: 'premium',
      title: 'Assinar Premium',
      icon: 'star-outline',
      onPress: () => console.log('Assinar Premium'),
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: 'settings-outline',
      onPress: () => console.log('Configurações'),
    },
    {
      id: 'help',
      title: 'Ajuda e Suporte',
      icon: 'help-circle-outline',
      onPress: () => console.log('Ajuda e Suporte'),
    },
    {
      id: 'about',
      title: 'Sobre o App',
      icon: 'information-circle-outline',
      onPress: () => console.log('Sobre o App'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>

        <View style={styles.userInfoContainer}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={40} color={COLORS.white} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userPlan}>
              {user.isPremium ? 'Plano Premium' : 'Plano Gratuito'}
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={24} color={COLORS.white} />
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Versão 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  userAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  userPlan: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: COLORS.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 10,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  version: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default ProfileScreen; 