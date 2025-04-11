import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS } from '../constants/colors';
import { Story, RootStackParamList } from '../types';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45;

interface StoryCardProps {
  story: Story;
  size?: 'normal' | 'large';
}

const StoryCard: React.FC<StoryCardProps> = ({ story, size = 'normal' }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const handlePress = () => {
    navigation.navigate('StoryDetail', { storyId: story.id });
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <TouchableOpacity
      style={[styles.container, size === 'large' && styles.largeContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.secondary} />
          </View>
        )}
        <Image 
          source={{ uri: story.coverImageUrl }} 
          style={styles.image} 
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {story.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
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
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {story.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  largeContainer: {
    width: width - 40,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#2c3e50', // Cor de fundo escura para quando a imagem estiver carregando
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.premium,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    zIndex: 2,
  },
  premiumText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    zIndex: 2,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    padding: 10,
  },
});

export default StoryCard; 