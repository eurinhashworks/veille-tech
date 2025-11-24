import React, { useState, useEffect } from 'react';
import { Clock, Search, Trash2 } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';

interface SearchHistoryItem {
  id: string;
  query: string;
  createdAt: string;
  results: number;
}

// Données d'exemple pour les anciennes recherches persistantes
const sampleHistory: SearchHistoryItem[] = [
  {
    id: '1',
    query: 'Intelligence Artificielle 2025',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    results: 12
  },
  {
    id: '2',
    query: 'Cloud Computing tendances',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    results: 8
  },
  {
    id: '3',
    query: 'Sécurité informatique',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    results: 15
  },
  {
    id: '4',
    query: 'Développement Web',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    results: 10
  },
  {
    id: '5',
    query: 'DevOps outils',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    results: 7
  }
];

const History: React.FC = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: userLoading } = useCurrentUser();

  useEffect(() => {
    const loadHistory = async () => {
      // Charger l'historique même si l'utilisateur n'est pas connecté
      try {
        if (user) {
          const { getSearchHistory } = await import('../services/storageService');
          const historyData = await getSearchHistory(user.id, 50);
          setHistory(historyData);
        } else {
          // Afficher les anciennes recherches persistantes pour les nouveaux utilisateurs
          setHistory(sampleHistory);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
        // En cas d'erreur, afficher les anciennes recherches persistantes
        setHistory(sampleHistory);
        setLoading(false);
      }
    };
    
    loadHistory();
  }, [user, userLoading]);

  const handleClearHistory = async () => {
    if (!user) return;
    
    try {
      const { clearSearchHistory } = await import('../services/databaseService');
      await clearSearchHistory(user.id);
      setHistory([]);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
    }
  };

  if (userLoading) {
    return <div className="text-center py-8 text-slate-500">Chargement...</div>;
  }

  if (loading) {
    return <div className="text-center py-8 text-slate-500">Chargement de l'historique...</div>;
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Historique</h1>
            <p className="text-slate-400 text-sm">{history.length} recherche{history.length > 1 ? 's' : ''} récente{history.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {history.length > 0 && user && (
          <button 
            onClick={handleClearHistory}
            className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 rounded-lg text-sm font-medium border border-red-800/50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Vider l'historique
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="bg-dark-800/30 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="divide-y divide-slate-700/30">
            {history.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-slate-500" />
                      <span className="text-white font-medium">{item.query}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{new Date(item.createdAt).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                      <span>{item.results} résultat{item.results > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-dark-800 border border-slate-700 rounded-xl">
          <Clock className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Aucun historique</h3>
          <p className="text-slate-500 text-sm">
            Vos recherches récentes apparaîtront ici
          </p>
        </div>
      )}
    </div>
  );
};

export default History;