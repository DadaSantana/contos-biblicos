import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface OfflineBannerProps {
  visible: boolean;
}

const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline" size={16} color={COLORS.white} />
      <Text style={styles.text}>
        Usando dados locais temporariamente
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    width: '100%',
  },
  text: {
    color: COLORS.white,
    marginLeft: 6,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OfflineBanner; 