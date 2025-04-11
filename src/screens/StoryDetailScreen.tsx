import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Share } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { COLORS } from '../constants/colors';
import { RootStackParamList, Story } from '../types';
import OfflineBanner from '../components/OfflineBanner';
import { StackNavigationProp } from '@react-navigation/stack';

// Dados locais para fallback caso o Firebase falhe
const FALLBACK_STORIES: Record<string, Story> = {
  '1': {
    id: '1',
    title: 'Adão e Eva no Jardim do Éden',
    category: 'love',
    views: 1200,
    favorites: 300,
    isPremium: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyZGVufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    createdAt: '2025-01-01',
    description: 'A história do primeiro casal no Jardim do Éden e como eles desobedeceram a Deus.'
  },
  '2': {
    id: '2',
    title: 'Os Dez Mandamentos de Moisés',
    category: 'heroes',
    views: 980,
    favorites: 250,
    isPremium: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1518783211485-10fd3bfb2ce2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80',
    createdAt: '2025-01-02',
    description: 'Depois de libertar o povo de Israel da escravidão no Egito, Moisés subiu ao Monte Sinai para receber de Deus os Dez Mandamentos. Estes mandamentos se tornaram a base moral e ética para o povo de Deus e continuam sendo importantes até hoje.'
  },
  '3': {
    id: '3',
    title: 'A Arca de Noé',
    category: 'animals',
    views: 1050,
    favorites: 280,
    isPremium: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1552410260-0fd9b577afa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=992&q=80',
    createdAt: '2025-01-03',
    description: 'Noé constrói uma arca para salvar sua família e os animais do grande dilúvio.'
  },
  '4': {
    id: '4',
    title: 'Daniel na Cova dos Leões',
    category: 'heroes',
    views: 890,
    favorites: 210,
    isPremium: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1614027164847-1b28a7c59e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=972&q=80',
    createdAt: '2025-01-04',
    description: 'Daniel é jogado na cova dos leões por orar a Deus, mas é salvo milagrosamente.'
  },
  '5': {
    id: '5',
    title: 'A Mensagem de João Batista',
    category: 'heroes',
    views: 760,
    favorites: 180,
    isPremium: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1551775820-5b3e35a60c30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
    createdAt: '2025-01-05',
    description: 'João Batista prepara o caminho para Jesus, pregando arrependimento e batizando no rio Jordão.'
  },
  '6': {
    id: '6',
    title: 'Jesus e a Multiplicação dos Pães',
    category: 'miracles',
    views: 1300,
    favorites: 320,
    isPremium: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1573053009372-3dd4b0514b91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80',
    createdAt: '2025-01-06',
    description: 'Jesus alimenta mais de cinco mil pessoas com apenas cinco pães e dois peixes.'
  }
};

type StoryDetailScreenRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

const StoryDetailScreen: React.FC = () => {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  
  const route = useRoute<StoryDetailScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { storyId } = route.params;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        
        // Tentar buscar do Firebase
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
          });
          setUsingFallback(false);
          console.log('História obtida do Firebase:', storySnap.id);
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
        console.error('Erro ao buscar história:', err);
        
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

    fetchStory();
  }, [storyId]);

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (story) {
      try {
        await Share.share({
          message: `Confira esta história bíblica: ${story.title}`,
        });
      } catch (error) {
        console.error('Error sharing story:', error);
      }
    }
  };

  const handleReadStory = () => {
    navigation.navigate('ReadStory', { storyId: storyId });
  };

  const handleImageLoad = () => {
    setImageLoading(false);
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

  return (
    <View style={styles.container}>
      <OfflineBanner visible={usingFallback} />
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: story.coverImageUrl }}
            style={styles.coverImage}
            resizeMode="cover"
            onLoad={handleImageLoad}
          />
          {imageLoading && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="large" color={COLORS.secondary} />
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{story.title}</Text>
          
          <View style={styles.categoryContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {story.category === 'love'
                  ? 'Histórias de Amor'
                  : story.category === 'heroes'
                  ? 'Heróis'
                  : story.category === 'animals'
                  ? 'Animais'
                  : story.category === 'miracles'
                  ? 'Milagres de Jesus'
                  : ''}
              </Text>
            </View>
            {story.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.description}>
            {story.description || 'Depois de libertar o povo de Israel da escravidão no Egito, Moisés subiu ao Monte Sinai para receber de Deus os Dez Mandamentos. Estes mandamentos se tornaram a base moral e ética para o povo de Deus e continuam sendo importantes até hoje.'}
          </Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavorite ? COLORS.secondary : COLORS.white}
              />
              <Text style={styles.actionText}>Favoritar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={28} color={COLORS.white} />
              <Text style={styles.actionText}>Compartilhar</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.readButton} onPress={handleReadStory}>
            <Ionicons name="book-outline" size={24} color={COLORS.white} style={styles.readButtonIcon} />
            <Text style={styles.readButtonText}>Ler história</Text>
          </TouchableOpacity>
        </View>
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
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: '#1e293b',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 14,
  },
  premiumBadge: {
    backgroundColor: COLORS.premium,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white,
    marginBottom: 30,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: COLORS.white,
    marginTop: 5,
  },
  readButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readButtonIcon: {
    marginRight: 10,
  },
  readButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoryDetailScreen; 