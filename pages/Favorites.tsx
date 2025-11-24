import React, { useState, useEffect } from 'react';
import { Star, Trash2, FolderOpen } from 'lucide-react';
import { Review } from '../types';
import Timeline from '../components/Timeline';

interface FavoritesProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ reviews, onSelectReview }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const { getUserFavorites } = await import('../services/storageService');
      // TODO: Récupérer le vrai userId depuis le contexte utilisateur
      const favs = await getUserFavorites('anonymous');
      setFavorites(favs);
    };
    loadFavorites();
  }, []);

  const favoriteReviews = reviews.filter(r => favorites.includes(r.metadata.id));

  const handleRemoveFavorite = async (id: string) => {
    const { removeFromFavorites } = await import('../services/storageService');
    // TODO: Récupérer le vrai userId depuis le contexte utilisateur
    await removeFromFavorites('anonymous', id);
    setFavorites(prev => prev.filter(fav => fav !== id));
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Favoris</h1>
          <p className="text-slate-400 text-sm">{favoriteReviews.length} revue{favoriteReviews.length > 1 ? 's' : ''} sauvegardée{favoriteReviews.length > 1 ? 's' : ''}</p>
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
