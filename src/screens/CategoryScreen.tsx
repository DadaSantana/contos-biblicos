import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { RootStackParamList, Story } from '../types';
import StoryCard from '../components/StoryCard';
import OfflineBanner from '../components/OfflineBanner';
import { useStories } from '../hooks/useStories';

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;

const getCategoryTitle = (categoryId: string): string => {
  switch (categoryId) {
    case 'love':
      return 'Histórias de Amor';
    case 'heroes':
      return 'Heróis';
    case 'animals':
      return 'Animais';
    case 'miracles':
      return 'Milagres de Jesus';
    default:
      return 'Categoria';
  }
};

const CategoryScreen: React.FC = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation();
  const { category } = route.params;
  const { stories, loading, error, usingFallback } = useStories(category);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: Story }) => (
    <StoryCard story={item} size="large" />
  );

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <OfflineBanner visible={usingFallback} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{getCategoryTitle(category)}</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          numColumns={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});

export default CategoryScreen; 