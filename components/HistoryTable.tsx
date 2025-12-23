import React from 'react';
import { Review, CategoryType } from '../types';

interface HistoryTableProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}

const CategoryBadge: React.FC<{ category: CategoryType }> = ({ category }) => {
  const styles = {
    'Web': 'text-accent-web bg-accent-web/10',
    'Cloud': 'text-accent-cloud bg-accent-cloud/10',
    'DevOps': 'text-accent-devops bg-accent-devops/10',
    'Security': 'text-accent-sec bg-accent-sec/10',
    'IA': 'text-accent-ia bg-accent-ia/10',
    'Mix': 'text-slate-400 bg-slate-700/30',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[category]}`}>
      {category}
    </span>
  );
};

const HistoryTable: React.FC<HistoryTableProps> = ({ reviews, onSelectReview }) => {
  if (reviews.length === 0) return <div className="text-center py-8 text-slate-500">Aucune donnée disponible.</div>;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700 bg-dark-800/30 backdrop-blur">
      <table className="w-full text-left text-sm text-slate-400">
        <thead className="bg-dark-800/80 text-xs uppercase text-slate-200 font-mono">
          <tr>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Publié par</th>
            <th className="px-6 py-4">Dominante</th>
            <th className="px-6 py-4 text-center">News</th>
            <th className="px-6 py-4 text-right">Génération</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {reviews.map((review) => (
            <tr key={review.metadata.id} className="hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">
                {new Date(review.metadata.date).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white font-bold">
                     {review.metadata.username.charAt(0).toUpperCase()}
                   </div>
                   {review.metadata.username}
                </div>
              </td>
              <td className="px-6 py-4">
                <CategoryBadge category={review.metadata.dominantCategory} />
              </td>
              <td className="px-6 py-4 text-center font-mono">
                {review.metadata.newsCount}
              </td>
              <td className="px-6 py-4 text-right font-mono text-xs">
                {review.metadata.generationTime}s
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => onSelectReview(review)}
                  className="text-primary hover:text-primary-hover font-medium text-xs border border-primary/30 px-3 py-1 rounded hover:bg-primary/10 transition-colors"
                >
                  Lire
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
