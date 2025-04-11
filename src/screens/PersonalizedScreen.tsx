import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import SectionHeader from '../components/SectionHeader';
import StoryCard from '../components/StoryCard';
import { useStories, usePremiumStories } from '../hooks/useStories';

const PersonalizedScreen: React.FC = () => {
  const { stories: allStories, loading: allLoading } = useStories();
  const { stories: premiumStories, loading: premiumLoading } = usePremiumStories();

  // Função simulando recomendações personalizadas
  const getRecommendedStories = () => {
    return allStories.filter(() => Math.random() > 0.6).slice(0, 4);
  };

  // Função simulando histórias populares
  const getPopularStories = () => {
    return allStories.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  // Função simulando histórias recentes
  const getRecentStories = () => {
    return premiumStories.sort(() => Math.random() - 0.5).slice(0, 4);
  };

  if (allLoading || premiumLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Personalizado</Text>
          <Text style={styles.subtitle}>
            Conteúdo recomendado com base no seu histórico
          </Text>
        </View>

        <SectionHeader title="Recomendados para Você" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        >
          {getRecommendedStories().map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </ScrollView>

        <SectionHeader title="Populares" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        >
          {getPopularStories().map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </ScrollView>

        <SectionHeader title="Adicionados Recentemente" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storyList}
        >
          {getRecentStories().map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  storyList: {
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 20,
  },
});

export default PersonalizedScreen; 