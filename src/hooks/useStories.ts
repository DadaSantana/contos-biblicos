import { useState, useEffect, useCallback } from 'react';
import { Story, StoryCategory } from '../types';

// Dados fornecidos
const MOCKED_STORIES: Story[] = [
  {
    "id": "ApjcnJsT3LqQ4KetHGpa",
    "title": "O Messias Prometido",
    "category": "love",
    "views": 0,
    "favorites": 0,
    "isPremium": true,
    "coverImageUrl": "https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2F39c34716-eaec-4fb3-acb1-967ddfdd5e22%2Fcover?alt=media&token=b378fa25-745e-4900-b92e-ed414884c9bb",
    "createdAt": "2025-04-04"
  },
  {
    "id": "NvioPCuWjyWdi22Jqe8o",
    "title": " O Rei Escolhido Davi",
    "category": "heroes",
    "views": 0,
    "favorites": 0,
    "isPremium": false,
    "coverImageUrl": "https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2F42bf71f4-0b67-40f3-82cb-014c016b42d9%2Fcover?alt=media&token=f1905979-1763-437f-a3da-8f74d616c5af",
    "createdAt": "2025-04-04"
  },
  {
    "id": "UbmEks15s0fF9K0xIVko",
    "title": "Elden Ring Tarnished Edition",
    "category": "other",
    "views": 0,
    "favorites": 0,
    "isPremium": true,
    "coverImageUrl": "https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2Fc4fdabf4-c570-48b1-978f-6ab1c9829f4c%2Fcover?alt=media&token=00bb943b-546c-42c8-9c94-f97038767b19",
    "createdAt": "2025-04-04"
  },
  {
    "id": "WPxxlcL6Wgp3waifVsk7",
    "title": "O Chamado de Abraão",
    "category": "parables",
    "views": 0,
    "favorites": 0,
    "isPremium": true,
    "coverImageUrl": "https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2Fd6f2388c-20dc-466e-9b33-a200d85eba45%2Fcover?alt=media&token=8b737cfd-baba-42dd-a470-66cb97efd417",
    "createdAt": "2025-04-04"
  },
  {
    "id": "g25c4O9SPTsjo6Ve0gyU",
    "title": "O Libertador de IsraelMoisés",
    "category": "heroes",
    "views": 0,
    "favorites": 0,
    "isPremium": false,
    "coverImageUrl": "https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2F066d8aa8-8dd5-4dc4-b6d3-6c95b67a574c%2Fcover?alt=media&token=49e250a0-a33d-4842-a6e6-093740c64f62",
    "createdAt": "2025-04-04"
  },
  {
    "id": "uGLU3m1IxQlGyJMAkawv",
    "title": "O Apocalipse de João",
    "category": "parables",
    "views": 0,
    "favorites": 0,
    "isPremium": false,
    "coverImageUrl": "https://firebasestorage.googleapis.com/v0/b/contos-celestiais.firebasestorage.app/o/livros%2Fbab48dac-758c-4e15-b16a-a18086e8958e%2Fcover?alt=media&token=8f030c67-2053-408d-819b-25184e6772c6",
    "createdAt": "2025-04-04"
  }
];

export const useStories = (category?: StoryCategory) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    setLoading(true);
    
    // Filtrar histórias por categoria se necessário
    let filteredStories = [...MOCKED_STORIES];
    if (category && category !== 'all') {
      filteredStories = MOCKED_STORIES.filter(story => story.category === category);
    }
    
    // Simular carregamento de dados
    setTimeout(() => {
      setStories(filteredStories);
      setLoading(false);
    }, 500);
    
  }, [category, refreshCounter]);

  // Função para forçar uma atualização
  const refetch = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  return { stories, loading, error, usingFallback, refetch };
};

export const usePremiumStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    setLoading(true);
    
    // Filtrar para obter apenas histórias premium
    const premiumStories = MOCKED_STORIES.filter(story => story.isPremium);
    
    // Simular carregamento de dados
    setTimeout(() => {
      setStories(premiumStories);
      setLoading(false);
    }, 500);
    
  }, [refreshCounter]);

  // Função para forçar uma atualização
  const refetch = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  return { stories, loading, error, usingFallback, refetch };
}; 