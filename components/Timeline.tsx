import React from 'react';
import { Review, CategoryType } from '../types/types';

interface TimelineProps {
  reviews: Review[];
  onSelectReview: (review: Review) => void;
}

const categoryColors: Record<CategoryType, string> = {
  'Web': 'bg-accent-web',
  'Cloud': 'bg-accent-cloud',
  'DevOps': 'bg-accent-devops',
  'Security': 'bg-accent-sec',
  'IA': 'bg-accent-ia',
  'Mix': 'bg-accent-mix',
};

const categoryBorderColors: Record<CategoryType, string> = {
  'Web': 'border-accent-web',
  'Cloud': 'border-accent-cloud',
  'DevOps': 'border-accent-devops',
  'Security': 'border-accent-sec',
  'IA': 'border-accent-ia',
  'Mix': 'border-accent-mix',
};

const Timeline: React.FC<TimelineProps> = ({ reviews, onSelectReview }) => {
  if (reviews.length === 0) {
    return <div className="text-center py-10 text-slate-500 font-mono">Aucune revue dans l'historique public.</div>;
  }

  // Sort by date desc
  const sortedReviews = [...reviews].sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);

  return (
    <div className="relative border-l-2 border-primary ml-4 md:ml-8 space-y-8 py-4">
      {sortedReviews.map((review) => {
        const cat = review.metadata.dominantCategory;
        const colorClass = categoryColors[cat];
        const borderClass = categoryBorderColors[cat];

        return (
          <div key={review.metadata.id} className="relative pl-8 md:pl-12 group">
            {/* Node Dot */}
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-dark-900 ${colorClass} shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-125`}></div>
            
            <div 
              onClick={() => onSelectReview(review)}
              className="bg-dark-800/50 hover:bg-dark-800 border border-slate-700/50 hover:border-slate-600 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${colorClass}`}>
                    {cat.toUpperCase()}
                  </span>
                  <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">
                    {review.metadata.formattedDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>par <span className="text-slate-300 font-semibold">{review.metadata.username}</span></span>
                </div>
              </div>

              <h3 className="text-slate-200 font-semibold mb-2 line-clamp-1">{review.metadata.flashSummary}</h3>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {review.metadata.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-1 rounded bg-slate-700/50 text-slate-400 font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
