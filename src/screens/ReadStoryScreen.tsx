import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLORS } from '../constants/colors';
import { RootStackParamList, Story, StoryPage } from '../types';
import OfflineBanner from '../components/OfflineBanner';

// Dados locais para fallback caso o Firebase falhe
const FALLBACK_STORIES: Record<string, Story> = {
  '1': {
    id: '1',
    title: 'O Messias Prometido',
    category: 'love',
    views: 1200,
    favorites: 300,
    isPremium: true,
    coverImageUrl: 'https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2F39c34716-eaec-4fb3-acb1-967ddfdd5e22%2Fcover?alt=media&token=b378fa25-745e-4900-b92e-ed414884c9bb',
    createdAt: '2025-01-01',
    synopsis: 'No humilde vilarejo de Belém, nasce Jesus, o Filho de Deus. Sua vida é um testemunho de amor, milagres e ensino transformador. Mas seu destino o leva à cruz, onde, ao entregar sua vida, ele redime a humanidade. Três dias depois, a tumba vazia confirma sua vitória sobre a morte, trazendo esperança eterna para todos os que creem.',
    author: 'Autor desconhecido',
    pages: [
      {
        pageNumber: 1,
        imageUrl: null,
        content: 'No humilde vilarejo de Belém, nasce Jesus, o Filho de Deus. Sua vida é um testemunho de amor, milagres e ensino transformador. Mas seu destino o leva à cruz, onde, ao entregar sua vida, ele redime a humanidade. Três dias depois, a tumba vazia confirma sua vitória sobre a morte, trazendo esperança eterna para todos os que creem.'
      }
    ]
  }
};

type ReadStoryScreenRouteProp = RouteProp<RootStackParamList, 'ReadStory'>;

const ReadStoryScreen: React.FC = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  
  const route = useRoute<ReadStoryScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { storyId } = route.params;

  useEffect(() => {
    const fetchCompleteStory = async () => {
      try {
        setLoading(true);
        
        // Buscar história completa do Firebase
        const storyRef = doc(db, 'livros', storyId);
        const storySnap = await getDoc(storyRef);

        if (storySnap.exists()) {
          const data = storySnap.data();
          setStory({
            id: storySnap.id,
            title: data.title,
            category: data.category,
            views: data.views || 0,
            favorites: data.favorites || 0,
            isPremium: data.isPremium || false,
            coverImageUrl: data.coverImageUrl,
            createdAt: data.createdAt,
            description: data.description || '',
            content: data.content || '',
            author: data.author || 'Autor desconhecido',
            synopsis: data.synopsis || '',
            pages: data.pages || [],
          });
          setUsingFallback(false);
          console.log('História completa obtida do Firebase:', storySnap.id);
        } else {
          // Se não encontrar no Firebase, tentar usar o fallback
          if (FALLBACK_STORIES[storyId]) {
            console.warn('História não encontrada no Firestore, usando dados locais');
            setStory(FALLBACK_STORIES[storyId]);
            setUsingFallback(true);
          } else {
            setError('História não encontrada');
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar história completa:', err);
        
        // Em caso de erro, tentar usar dados locais
        if (FALLBACK_STORIES[storyId]) {
          console.warn('Erro ao buscar do Firestore, usando dados locais');
          setStory(FALLBACK_STORIES[storyId]);
          setUsingFallback(true);
          setLoading(false);
        } else {
          setError('Erro ao buscar história. Tente novamente mais tarde.');
          setLoading(false);
        }
      }
    };

    fetchCompleteStory();
  }, [storyId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const nextPage = () => {
    if (story?.pages && currentPage < story.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  if (error || !story) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Algo deu errado'}</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Se não tiver páginas, mostrar o conteúdo em uma única página
  const pages = story.pages && story.pages.length > 0 ? story.pages : [
    { pageNumber: 1, imageUrl: null, content: story.synopsis || story.description || 'Conteúdo não disponível.' }
  ];

  const currentPageContent = pages[currentPage];

  return (
    <View style={styles.container}>
      <OfflineBanner visible={usingFallback} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{story.title}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.pageNumber}>Página {currentPageContent.pageNumber} de {pages.length}</Text>
        
        {currentPageContent.imageUrl && (
          <Image 
            source={{ uri: currentPageContent.imageUrl }} 
            style={styles.pageImage} 
            resizeMode="contain"
          />
        )}
        
        <Text style={styles.content}>
          {currentPageContent.content}
        </Text>
      </ScrollView>
      
      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, currentPage === 0 && styles.navButtonDisabled]}
          onPress={previousPage}
          disabled={currentPage === 0}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentPage === 0 ? COLORS.tabInactive : COLORS.white} 
          />
          <Text style={[styles.navText, currentPage === 0 && styles.navTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.pageIndicator}>
          {currentPage + 1}/{pages.length}
        </Text>
        
        <TouchableOpacity 
          style={[styles.navButton, currentPage === pages.length - 1 && styles.navButtonDisabled]}
          onPress={nextPage}
          disabled={currentPage === pages.length - 1}
        >
          <Text style={[styles.navText, currentPage === pages.length - 1 && styles.navTextDisabled]}>
            Próxima
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={currentPage === pages.length - 1 ? COLORS.tabInactive : COLORS.white} 
          />
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  errorText: {
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  placeholder: {
    width: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  pageNumber: {
    color: COLORS.tabInactive,
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  pageImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  content: {
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'justify',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: COLORS.primary,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  navTextDisabled: {
    color: COLORS.tabInactive,
  },
  pageIndicator: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default ReadStoryScreen; 