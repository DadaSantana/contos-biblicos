import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { StoryCategory } from '../types';

interface CategorySelectorProps {
  selectedCategory: StoryCategory;
  onSelectCategory: (category: StoryCategory) => void;
}

const categories: { id: StoryCategory; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'love', label: 'Histórias de Amor' },
  { id: 'animals', label: 'Animais' },
  { id: 'heroes', label: 'Heróis' },
  { id: 'miracles', label: 'Milagres de Jesus' },
];

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category.id)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectedCategory: {
    backgroundColor: COLORS.secondary,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 16,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
});

export default CategorySelector; 