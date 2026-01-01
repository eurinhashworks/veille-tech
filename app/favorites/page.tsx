'use client';

import { useState } from 'react';
import { Star, Trash2, FolderPlus, Edit, Share2 } from 'lucide-react';

const mockFavorites = [
  { id: '1', title: 'Analyse des tendances IA - T4 2024', collection: 'Rapports IA', date: '2024-12-15', note: 'Très pertinent pour la stratégie 2025.' },
  { id: '2', title: 'Le futur du Cloud Computing', collection: 'Veille Cloud', date: '2024-11-20', note: '' },
  { id: '3', title: 'Sécurité des applications Web Modernes', collection: 'Sécurité', date: '2024-10-05', note: 'Partager avec l équipe front-end.' },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const collections = [...new Set(favorites.map(f => f.collection))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Favoris</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
          <FolderPlus className="w-4 h-4" />
          Nouvelle collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Collections Sidebar */}
        <div className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-4 text-slate-300">Collections</h2>
          <nav className="space-y-2">
            <a href="#" className="flex justify-between items-center p-3 rounded-lg bg-dark-800 text-white">
              <span>Toutes</span>
              <span className="text-xs bg-primary/80 text-white rounded-full px-2 py-0.5">{favorites.length}</span>
            </a>
            {collections.map(collection => (
              <a key={collection} href="#" className="flex justify-between items-center p-3 rounded-lg hover:bg-dark-800 text-slate-400">
                <span>{collection}</span>
                <span className="text-xs bg-slate-700 text-slate-300 rounded-full px-2 py-0.5">{favorites.filter(f => f.collection === collection).length}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Favorites List */}
        <div className="md:col-span-3">
          <ul className="space-y-4">
            {favorites.map(fav => (
              <li key={fav.id} className="p-4 bg-dark-800 border border-slate-700 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                     <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <h3 className="font-semibold text-white">{fav.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 ml-8">{fav.collection} • {fav.date}</p>
                  {fav.note && <p className="text-sm text-slate-300 mt-2 ml-8 bg-dark-900 p-2 rounded italic">"{fav.note}"</p>}
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                   <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors" title="Ajouter/Modifier la note">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors" title="Partager">
                        <Share2 className="w-4 h-4" />
                    </button>
                  <button className="p-2 text-red-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors" title="Supprimer des favoris">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
             {favorites.length === 0 && (
                 <div className="text-center py-16 px-6 bg-dark-800 border border-dashed border-slate-700 rounded-lg">
                    <p className="text-slate-400">Vous n avez pas encore de favoris.</p>
                    <p className="text-sm text-slate-500 mt-2">Cliquez sur l étoile d une revue pour l ajouter.</p>
                </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}