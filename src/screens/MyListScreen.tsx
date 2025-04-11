import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/colors';
import { Story } from '../types';
import StoryCard from '../components/StoryCard';
import SectionHeader from '../components/SectionHeader';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const MyListScreen: React.FC = () => {
  const [favoriteStories, setFavoriteStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Aqui seria implementada a lógica real para buscar as histórias favoritas do usuário
    // Como ainda não temos autenticação, mostraremos algumas histórias aleatórias
    const fetchFavoriteStories = async () => {
      try {
        setLoading(true);
        const storiesRef = collection(db, 'livros');
        const q = query(storiesRef);
        const querySnapshot = await getDocs(q);
        
        const stories: Story[] = [];
        querySnapshot.forEach((doc) => {
          const storyData = doc.data() as Omit<Story, 'id'>;
          // Simulação de favoritos - na realidade, isso viria do banco de dados do usuário
          if (Math.random() > 0.7) {
            stories.push({
              id: doc.id,
              ...storyData,
            });
          }
        });
        
        setFavoriteStories(stories);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching favorite stories:', err);
        setError('Erro ao buscar histórias favoritas. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchFavoriteStories();
  }, []);

  const renderItem = ({ item }: { item: Story }) => (
    <StoryCard story={item} size="large" />
  );

  return (
    <View style={styles.container}>
      <SectionHeader title="Minha Lista" />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : favoriteStories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Você ainda não adicionou nenhuma história à sua lista de favoritos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteStories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default MyListScreen; 