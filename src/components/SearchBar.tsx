import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={22} color={COLORS.white} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Buscar histórias..."
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 8,
  },
});

export default SearchBar; 