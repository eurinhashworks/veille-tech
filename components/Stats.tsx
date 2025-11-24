import React, { useState, useEffect } from 'react';
import { Review, CategoryType } from '../types';

interface StatsProps {
  reviews: Review[];
}

const Stats: React.FC<StatsProps> = ({ reviews }) => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalNews: 0,
    avgGenerationTime: 0,
    categoryDistribution: {} as Record<string, number>,
    topCategory: 'Mix',
  });

  useEffect(() => {
    const loadStats = async () => {
      const { getStatistics } = await import('../services/apiService');
      const statistics = await getStatistics();
      setStats(statistics);
    };
    loadStats();
  }, [reviews]);

  const totalReviews = stats.totalReviews;
  const totalNews = stats.totalNews;
  const distribution = stats.categoryDistribution;
  const maxVal = Math.max(...Object.values(distribution).map(v => Number(v) || 0), 1);

  return (
    <div className="space-y-8">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700">
           <p className="text-slate-400 text-xs font-mono uppercase">Total Revues</p>
           <p className="text-3xl font-bold text-white mt-1">{totalReviews}</p>
        </div>
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700">
           <p className="text-slate-400 text-xs font-mono uppercase">News Traitées</p>
           <p className="text-3xl font-bold text-primary mt-1">{totalNews}</p>
        </div>
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700">
           <p className="text-slate-400 text-xs font-mono uppercase">Temps Moyen</p>
           <p className="text-3xl font-bold text-accent-devops mt-1">
             {stats.avgGenerationTime}s
           </p>
        </div>
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700">
           <p className="text-slate-400 text-xs font-mono uppercase">Top Catégorie</p>
           <p className="text-2xl font-bold text-accent-ia mt-2 truncate">
             {stats.topCategory}
           </p>
        </div>
      </div>

      {/* Bar Chart (CSS only) */}
      <div className="bg-dark-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-slate-200 font-semibold mb-6">Répartition par thématique</h3>
        <div className="flex items-end justify-between h-48 gap-2 md:gap-4">
          {Object.entries(distribution).map(([cat, count]) => {
            const numCount = Number(count) || 0;
            const height = maxVal > 0 ? (numCount / maxVal) * 100 : 0;
            const colors: any = {
                'Web': 'bg-accent-web',
                'Cloud': 'bg-accent-cloud',
                'DevOps': 'bg-accent-devops',
                'Security': 'bg-accent-sec',
                'IA': 'bg-accent-ia',
                'Mix': 'bg-accent-mix',
            }
            return (
              <div key={cat} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center h-full items-end">
                   <div 
                    style={{ height: `${height}%` }} 
                    className={`w-full max-w-[40px] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all ${colors[cat]}`}
                   ></div>
                   <span className="absolute -top-6 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{Number(count) || 0}</span>
                </div>
                <span className="text-[10px] md:text-xs text-slate-400 mt-2 font-mono uppercase">{cat.substring(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stats;
