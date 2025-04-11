import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLORS } from '../constants/colors';
import { RootStackParamList } from '../types';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StoryDetailScreen from '../screens/StoryDetailScreen';
import CategoryScreen from '../screens/CategoryScreen';
import MyListScreen from '../screens/MyListScreen';
import PersonalizedScreen from '../screens/PersonalizedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ReadStoryScreen from '../screens/ReadStoryScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'myList':
        return <MyListScreen />;
      case 'personalized':
        return <PersonalizedScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="Home">
            {() => (
              <View style={styles.mainContainer}>
                {renderScreen()}
                <View style={styles.tabBarContainer}>
                  <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab('home')}
                  >
                    <Ionicons
                      name="home"
                      size={24}
                      color={activeTab === 'home' ? COLORS.tabActive : COLORS.tabInactive}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: activeTab === 'home' ? COLORS.tabActive : COLORS.tabInactive },
                      ]}
                    >
                      Inicial
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab('myList')}
                  >
                    <Ionicons
                      name="heart"
                      size={24}
                      color={activeTab === 'myList' ? COLORS.tabActive : COLORS.tabInactive}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        { color: activeTab === 'myList' ? COLORS.tabActive : COLORS.tabInactive },
                      ]}
                    >
                      Minha Lista
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab('personalized')}
                  >
                    <Ionicons
                      name="book"
                      size={24}
                      color={
                        activeTab === 'personalized' ? COLORS.tabActive : COLORS.tabInactive
                      }
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color:
                            activeTab === 'personalized'
                              ? COLORS.tabActive
                              : COLORS.tabInactive,
                        },
                      ]}
                    >
                      Personalizado
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.tabItem}
                    onPress={() => setActiveTab('profile')}
                  >
                    <Ionicons
                      name="person"
                      size={24}
                      color={
                        activeTab === 'profile' ? COLORS.tabActive : COLORS.tabInactive
                      }
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color:
                            activeTab === 'profile' ? COLORS.tabActive : COLORS.tabInactive,
                        },
                      ]}
                    >
                      Perfil
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Stack.Screen>
          <Stack.Screen name="StoryDetail" component={StoryDetailScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="ReadStory" component={ReadStoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: COLORS.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default AppNavigator; 