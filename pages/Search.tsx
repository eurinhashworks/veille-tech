import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, Filter, X, Calendar, Tag, User, TrendingUp } from 'lucide-react';
import { Review, CategoryType } from '../types';
import Timeline from '../components/Timeline';

interface SearchProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}

const Search: React.FC<SearchProps> = ({ reviews, onSelectReview }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    reviews.forEach(review => {
      review.metadata.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [reviews]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    const results = reviews.filter(review => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchContent = review.content.toLowerCase().includes(query);
        const matchSummary = review.metadata.flashSummary.toLowerCase().includes(query);
        const matchTags = review.metadata.tags.some(tag => tag.toLowerCase().includes(query));
        const matchUsername = review.metadata.username.toLowerCase().includes(query);
        
        if (!matchContent && !matchSummary && !matchTags && !matchUsername) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all' && review.metadata.dominantCategory !== selectedCategory) {
        return false;
      }

      // Tags filter
      if (selectedTags.length > 0) {
        const hasTag = selectedTags.some(tag => review.metadata.tags.includes(tag));
        if (!hasTag) return false;
      }

      // Date range filter
      if (dateFrom && review.metadata.date < dateFrom) return false;
      if (dateTo && review.metadata.date > dateTo) return false;

      return true;
    });
    
    // Sauvegarder l'historique de recherche si une recherche est effectuée
    if (searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || dateFrom || dateTo) {
      import('../services/storageService').then(({ saveSearch }) => {
        // TODO: Récupérer le vrai userId depuis le contexte utilisateur
        saveSearch('anonymous', searchQuery, {
          category: selectedCategory,
          tags: selectedTags,
          dateFrom,
          dateTo,
        }, results.length);
      });
    }
    
    return results;
  }, [reviews, searchQuery, selectedCategory, selectedTags, dateFrom, dateTo]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setDateFrom('');
    setDateTo('');
  };

  const categories: (CategoryType | 'all')[] = ['all', 'Web', 'Cloud', 'DevOps', 'Security', 'IA', 'Mix'];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <SearchIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">Recherche Avancée</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans les revues, tags, auteurs..."
            className="w-full pl-12 pr-4 py-4 bg-dark-800 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-primary focus:border-primary placeholder-slate-500 text-lg"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-primary transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filtres avancés
            {(selectedCategory !== 'all' || selectedTags.length > 0 || dateFrom || dateTo) && (
              <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {[
                  selectedCategory !== 'all' ? 1 : 0,
                  selectedTags.length,
                  dateFrom ? 1 : 0,
                  dateTo ? 1 : 0
                ].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          {(searchQuery || selectedCategory !== 'all' || selectedTags.length > 0 || dateFrom || dateTo) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-dark-800 border border-slate-700 rounded-xl p-6 mb-6 space-y-6">
            {/* Category Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <TrendingUp className="w-4 h-4" />
                Catégorie
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'Toutes' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Tag className="w-4 h-4" />
                Tags ({selectedTags.length} sélectionné{selectedTags.length > 1 ? 's' : ''})
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-dark-900 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                <Calendar className="w-4 h-4" />
                Période
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Du</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 text-white text-sm rounded-lg p-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Au</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-dark-900 border border-slate-700 text-white text-sm rounded-lg p-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 px-4">
          <p className="text-slate-400 text-sm">
            <span className="text-white font-semibold">{filteredReviews.length}</span> résultat{filteredReviews.length > 1 ? 's' : ''} trouvé{filteredReviews.length > 1 ? 's' : ''}
          </p>
          {searchQuery && (
            <p className="text-slate-500 text-xs">
              Recherche: "<span className="text-primary">{searchQuery}</span>"
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredReviews.length > 0 ? (
        <Timeline reviews={filteredReviews} onSelectReview={onSelectReview} />
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Aucun résultat</h3>
          <p className="text-slate-500 text-sm">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
