import React, { useState, useEffect } from 'react';
import { Star, Trash2, FolderOpen } from 'lucide-react';
import { Review } from '../types';
import Timeline from '../components/Timeline';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface FavoritesProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}

// Données d'exemple pour les anciennes recherches persistantes
const sampleFavorites: Review[] = [
  {
    metadata: {
      id: 'sample1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      formattedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      username: 'Utilisateur Exemple',
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      generationTime: 4.2,
      tags: ['IA', 'Innovation', 'Technologie'],
      dominantCategory: 'IA',
      newsCount: 12,
      flashSummary: 'Les dernières avancées en intelligence artificielle',
      aiAnalysis: 'L\'IA continue de révolutionner l\'industrie technologique...',
      isPublic: true
    },
    content: '# Revue Tech - Intelligence Artificielle\n\n> L\'IA continue de révolutionner l\'industrie technologique...\n\n## Résumé Flash\nLes dernières avancées en intelligence artificielle montrent une adoption croissante dans les entreprises.',
    sources: [
      { title: 'Google AI Blog', uri: 'https://ai.googleblog.com' },
      { title: 'OpenAI Research', uri: 'https://openai.com/research' }
    ]
  },
  {
    metadata: {
      id: 'sample2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      formattedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      username: 'Utilisateur Exemple',
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      generationTime: 3.8,
      tags: ['Cloud', 'Infrastructure', 'DevOps'],
      dominantCategory: 'Cloud',
      newsCount: 8,
      flashSummary: 'Tendances du Cloud Computing en 2025',
      aiAnalysis: 'Le cloud hybride devient la norme pour les grandes entreprises...',
      isPublic: true
    },
    content: '# Revue Tech - Cloud Computing\n\n> Le cloud hybride devient la norme pour les grandes entreprises...\n\n## Résumé Flash\nLes tendances du Cloud Computing montrent une adoption croissante des solutions hybrides.',
    sources: [
      { title: 'AWS Blog', uri: 'https://aws.amazon.com/blogs' },
      { title: 'Microsoft Azure Updates', uri: 'https://azure.microsoft.com/blog' }
    ]
  }
];

const Favorites: React.FC<FavoritesProps> = ({ reviews, onSelectReview }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteReviews, setFavoriteReviews] = useState<Review[]>([]);
  const { user, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    const loadFavorites = async () => {
      // Charger les favoris même si l'utilisateur n'est pas connecté
      if (userLoading) return;
      
      try {
        if (user) {
          const { getUserFavorites } = await import('../services/storageService');
          const favs = await getUserFavorites(user.id);
          setFavorites(favs);
          
          // Filtrer les revues favorites
          const favReviews = reviews.filter(r => favs.includes(r.metadata.id));
          setFavoriteReviews(favReviews);
        } else {
          // Afficher les anciennes recherches persistantes pour les nouveaux utilisateurs
          setFavoriteReviews(sampleFavorites);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des favoris:', error);
        // En cas d'erreur, afficher les anciennes recherches persistantes
        setFavoriteReviews(sampleFavorites);
      }
    };
    loadFavorites();
  }, [user, userLoading, reviews]);

  const handleRemoveFavorite = async (id: string) => {
    if (!user) return;
    
    const { removeFromFavorites } = await import('../services/storageService');
    await removeFromFavorites(user.id, id);
    setFavorites(prev => prev.filter(fav => fav !== id));
    setFavoriteReviews(prev => prev.filter(review => review.metadata.id !== id));
  };

  if (userLoading) {
    return <div className="text-center py-8 text-slate-500">Chargement...</div>;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Favoris</h1>
          <p className="text-slate-400 text-sm">
            {user ? 
              `${favoriteReviews.length} revue${favoriteReviews.length > 1 ? 's' : ''} sauvegardée${favoriteReviews.length > 1 ? 's' : ''}` : 
              'Exemples de revues populaires'}
          </p>
        </div>
      </div>

      {favoriteReviews.length > 0 ? (
        <Timeline reviews={favoriteReviews} onSelectReview={onSelectReview} />
      ) : (
        <div className="text-center py-16 bg-dark-800 border border-slate-700 rounded-xl">
          <Star className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Aucun favori</h3>
          <p className="text-slate-500 text-sm">
            Ajoutez des revues à vos favoris pour les retrouver facilement
          </p>
        </div>
      )}
    </div>
  );
};

export default Favorites;