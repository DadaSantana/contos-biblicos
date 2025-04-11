import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { StoryCategory } from '../types';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CategorySelector from '../components/CategorySelector';
import StoryCard from '../components/StoryCard';
import SectionHeader from '../components/SectionHeader';
import OfflineBanner from '../components/OfflineBanner';
import { useStories, usePremiumStories } from '../hooks/useStories';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>('all');
  const { stories, loading, usingFallback: storiesFallback, refetch: refetchStories } = useStories();
  const { stories: premiumStories, usingFallback: premiumFallback, refetch: refetchPremium } = usePremiumStories();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // Verificar se estamos usando dados offline em algum dos hooks
  const isOffline = storiesFallback || premiumFallback;

  const handleSeeAllFeatured = useCallback(() => {
    // Navegar para todas as histórias em destaque
  }, []);

  const handleSeeAllPremium = useCallback(() => {
    // Navegar para todas as histórias premium
  }, []);

  const handleCategorySelect = useCallback((category: StoryCategory) => {
    setSelectedCategory(category);
    if (category !== 'all') {
      navigation.navigate('Category', { category });
    }
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    refetchStories();
    refetchPremium();
  }, [refetchStories, refetchPremium]);

  // Filtragem de histórias baseada na categoria selecionada e busca
  const filteredStories = stories.filter(story => {
    if (selectedCategory !== 'all' && story.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const renderStoryItem = ({ item }: { item: any }) => (
    <StoryCard story={item} />
  );

  return (
    <View style={styles.container}>
      <OfflineBanner visible={isOffline} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {isOffline && (
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Ionicons name="refresh" size={16} color={COLORS.white} />
            <Text style={styles.refreshText}>Tentar reconectar</Text>
          </TouchableOpacity>
        )}

        <SectionHeader title="Histórias em destaque" onSeeAll={handleSeeAllFeatured} />
        <FlatList
          data={filteredStories.slice(0, 4)}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        />

        <SectionHeader title="Conteúdo Premium" onSeeAll={handleSeeAllPremium} />
        <FlatList
          data={premiumStories.slice(0, 4)}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  storyList: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 20,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshText: {
    color: COLORS.white,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 