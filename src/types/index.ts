// Tipos para as categorias de histórias
export type StoryCategory = 'all' | 'love' | 'animals' | 'heroes' | 'miracles';

// Tipo para as páginas de uma história
export interface StoryPage {
  pageNumber: number;
  imageUrl: string | null;
  content: string;
}

// Tipo para as histórias bíblicas
export interface Story {
  id: string;
  title: string;
  category: string;
  views: number;
  favorites: number;
  isPremium: boolean;
  coverImageUrl: string;
  createdAt: string;
  description?: string;
  content?: string;
  synopsis?: string;
  author?: string;
  pages?: StoryPage[];
}

// Tipo para os resultados da busca
export interface SearchResult {
  stories: Story[];
  loading: boolean;
  error: string | null;
}

// Tipos de navegação
export type RootStackParamList = {
  Home: undefined;
  StoryDetail: { storyId: string };
  Category: { category: StoryCategory };
  ReadStory: { storyId: string };
  MyList: undefined;
  Personalized: undefined;
  Profile: undefined;
}; 