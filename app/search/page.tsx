'use client';

import { useState } from 'react';
import { Search, Calendar, Tag, User, ChevronsUpDown, X } from 'lucide-react';

const categories = ['Cloud', 'DevOps', 'IA', 'Web', 'Security', 'Mix'];
const sortOptions = ['Pertinence', 'Date', 'Popularité'];

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [date, setDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState('');
  const [author, setAuthor] = useState('');
  const [sortBy, setSortBy] = useState(sortOptions[0]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setKeyword('');
    setDate('');
    setSelectedCategories([]);
    setTags('');
    setAuthor('');
    setSortBy(sortOptions[0]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Recherche Avancée</h1>

      <div className="space-y-6">
        {/* Keyword Search */}
        <div className="relative">
          <label htmlFor="keyword" className="sr-only">Mots-clés</label>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-slate-500" />
          </div>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="block w-full p-3 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary placeholder-slate-500"
            placeholder="Rechercher par mots-clés dans le contenu..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Date Search */}
          <div className="relative">
            <label htmlFor="date" className="sr-only">Date</label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Calendar className="w-5 h-5 text-slate-500" />
            </div>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full p-3 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Tags Search */}
          <div className="relative">
            <label htmlFor="tags" className="sr-only">Tags</label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Tag className="w-5 h-5 text-slate-500" />
            </div>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="block w-full p-3 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary placeholder-slate-500"
              placeholder="Filtrer par tags (ex: react,nextjs)"
            />
          </div>

          {/* Author Search */}
          <div className="relative">
            <label htmlFor="author" className="sr-only">Auteur</label>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="block w-full p-3 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary placeholder-slate-500"
              placeholder="Filtrer par auteur"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Catégories</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-primary border-primary text-white'
                    : 'bg-dark-800 border-slate-700 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort and Reset */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-auto">
                <label htmlFor="sort" className="sr-only">Trier par</label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <ChevronsUpDown className="w-5 h-5 text-slate-500" />
                </div>
                <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="block w-full p-3 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary"
                >
                    {sortOptions.map(option => <option key={option}>{option}</option>)}
                </select>
            </div>
            <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 bg-dark-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors w-full md:w-auto"
            >
                <X className="w-4 h-4" />
                Réinitialiser les filtres
            </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-white">Résultats</h2>
        <div className="text-center py-16 px-6 bg-dark-800 border border-dashed border-slate-700 rounded-lg">
            <p className="text-slate-400">Lancez une recherche pour afficher les résultats.</p>
        </div>
      </div>
    </div>
  );
}