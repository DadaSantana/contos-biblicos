import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface TabItem {
  key: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface BottomTabBarProps {
  tabs: TabItem[];
  activeTab: string;
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ tabs, activeTab }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={tab.onPress}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.key ? COLORS.tabActive : COLORS.tabInactive}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === tab.key ? COLORS.tabActive : COLORS.tabInactive },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default BottomTabBar; 