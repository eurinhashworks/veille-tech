import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, Search, Calendar, Users, Eye } from 'lucide-react';
import { Review } from '../types';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Spinner from './Spinner';

interface StatsProps {
  reviews: Review[];
}

interface ExtendedStats {
  totalReviews: number;
  totalNews: number;
  avgGenerationTime: number;
  categoryDistribution: Record<string, number>;
  topCategory: string;
  searchesToday: number;
  searchesThisWeek: number;
  searchesThisMonth: number;
  totalSearches: number;
  reviewsThisWeek: number;
  reviewsThisMonth: number;
  avgNewsPerReview: number;
  mostActiveDay: string;
  tagDistribution: Record<string, number>;
  // Statistiques des visiteurs
  dailyVisitors: number;
  totalVisitors: number;
  currentVisitors: number;
}

const Stats: React.FC<StatsProps> = ({ reviews }) => {
  const [stats, setStats] = useState<ExtendedStats>({
    totalReviews: 0,
    totalNews: 0,
    avgGenerationTime: 0,
    categoryDistribution: {},
    topCategory: 'Mix',
    searchesToday: 0,
    searchesThisWeek: 0,
    searchesThisMonth: 0,
    totalSearches: 0,
    reviewsThisWeek: 0,
    reviewsThisMonth: 0,
    avgNewsPerReview: 0,
    mostActiveDay: '-',
    tagDistribution: {},
    dailyVisitors: 0,
    totalVisitors: 0,
    currentVisitors: 0
  });
  
  // Utiliser le hook utilisateur pour obtenir l'utilisateur courant
  const { user, loading: userLoading } = useCurrentUser();
  
  // État de chargement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      // Ne charger les stats que si l'utilisateur est disponible
      if (userLoading || !user) return;
      
      try {
        setLoading(true);
        
        const { getStatistics } = await import('../services/storageService');
        const { getSearchHistory } = await import('../services/storageService');
        
        // Charger les statistiques de base
        const baseStats: any = await getStatistics();
        
        // Charger l'historique de recherche pour l'utilisateur courant
        const searchHistory = await getSearchHistory(user.id, 1000);
        
        // Calculer les statistiques de recherche
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const searchesToday = searchHistory.filter((s: any) => 
          new Date(s.timestamp || s.createdAt).toDateString() === today
        ).length;
        
        const searchesThisWeek = searchHistory.filter((s: any) => 
          new Date(s.timestamp || s.createdAt) >= weekAgo
        ).length;
        
        const searchesThisMonth = searchHistory.filter((s: any) => 
          new Date(s.timestamp || s.createdAt) >= monthAgo
        ).length;
        
        // Calculer les revues récentes
        const reviewsThisWeek = reviews.filter(r => 
          new Date(r.metadata.date) >= weekAgo
        ).length;
        
        const reviewsThisMonth = reviews.filter(r => 
          new Date(r.metadata.date) >= monthAgo
        ).length;
        
        // Calculer la moyenne de news par revue
        const avgNewsPerReview = reviews.length > 0 
          ? Math.round(reviews.reduce((sum, r) => sum + r.metadata.newsCount, 0) / reviews.length)
          : 0;
        
        // Trouver le jour le plus actif
        const dayCount: Record<string, number> = {};
        reviews.forEach(r => {
          const day = new Date(r.metadata.date).toLocaleDateString('fr-FR', { weekday: 'long' });
          dayCount[day] = (dayCount[day] || 0) + 1;
        });
        const mostActiveDay = Object.entries(dayCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
        
        // Distribution des tags
        const tagDist: Record<string, number> = {};
        reviews.forEach(r => {
          r.metadata.tags.forEach(tag => {
            tagDist[tag] = (tagDist[tag] || 0) + 1;
          });
        });
        
        // Charger les statistiques des visiteurs
        const { getDailyVisitorStats, getTotalVisitors, getCurrentVisitors } = await import('../services/visitorService');
        const dailyStats = await getDailyVisitorStats();
        const totalVisitors = await getTotalVisitors();
        const currentVisitors = await getCurrentVisitors();
        
        setStats({
          totalReviews: baseStats.totalReviews,
          totalNews: baseStats.totalNews,
          avgGenerationTime: baseStats.avgGenerationTime,
          categoryDistribution: baseStats.categoryDistribution,
          topCategory: baseStats.topCategory,
          searchesToday,
          searchesThisWeek,
          searchesThisMonth,
          totalSearches: searchHistory.length,
          reviewsThisWeek,
          reviewsThisMonth,
          avgNewsPerReview,
          mostActiveDay,
          tagDistribution: tagDist,
          dailyVisitors: dailyStats?.count || 0,
          totalVisitors,
          currentVisitors
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [reviews, user, userLoading]);

  const totalReviews = stats.totalReviews;
  const totalNews = stats.totalNews;
  const distribution = stats.categoryDistribution;
  const maxVal = Math.max(...Object.values(distribution).map(v => Number(v) || 0), 1);

  // Top 5 tags
  const topTags = Object.entries(stats.tagDistribution)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5);

  if (loading || userLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spinner size="lg" color="primary" />
        <p className="text-slate-400 mt-4">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="bg-gradient-to-r from-primary/10 to-accent-ia/10 border border-primary/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Activity className="w-6 h-6 text-primary" />
          Vue d'ensemble
        </h2>
        <p className="text-slate-300 text-sm">Statistiques globales de votre activité de veille technologique</p>
      </div>

      {/* Métriques Principales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700 hover:border-primary/50 transition-colors">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-400 text-xs font-mono uppercase">Total Revues</p>
             <TrendingUp className="w-4 h-4 text-green-500" />
           </div>
           <p className="text-3xl font-bold text-white">{stats.totalReviews}</p>
           <p className="text-xs text-slate-500 mt-1">{stats.reviewsThisMonth} ce mois</p>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700 hover:border-primary/50 transition-colors">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-400 text-xs font-mono uppercase">News Traitées</p>
             <Activity className="w-4 h-4 text-primary" />
           </div>
           <p className="text-3xl font-bold text-primary">{stats.totalNews}</p>
           <p className="text-xs text-slate-500 mt-1">~{stats.avgNewsPerReview} par revue</p>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700 hover:border-primary/50 transition-colors">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-400 text-xs font-mono uppercase">Temps Moyen</p>
             <Clock className="w-4 h-4 text-accent-devops" />
           </div>
           <p className="text-3xl font-bold text-accent-devops">{stats.avgGenerationTime}s</p>
           <p className="text-xs text-slate-500 mt-1">Génération IA</p>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700 hover:border-primary/50 transition-colors">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-400 text-xs font-mono uppercase">Top Catégorie</p>
             <TrendingUp className="w-4 h-4 text-accent-ia" />
           </div>
           <p className="text-2xl font-bold text-accent-ia mt-1">{stats.topCategory}</p>
           <p className="text-xs text-slate-500 mt-1">Plus fréquente</p>
        </div>
        
        <div className="bg-dark-800 p-4 rounded-xl border border-slate-700 hover:border-primary/50 transition-colors">
           <div className="flex items-center justify-between mb-2">
             <p className="text-slate-400 text-xs font-mono uppercase">Visiteurs</p>
             <Users className="w-4 h-4 text-purple-500" />
           </div>
           <p className="text-2xl font-bold text-purple-500">{stats.currentVisitors}</p>
           <p className="text-xs text-slate-500 mt-1">en ligne</p>
        </div>
      </div>

      {/* Statistiques de Recherche */}
      <div className="bg-dark-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          Activité de Recherche
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-2xl font-bold text-white">{stats.searchesToday}</p>
            <p className="text-xs text-slate-400 mt-1">Aujourd'hui</p>
          </div>
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-2xl font-bold text-primary">{stats.searchesThisWeek}</p>
            <p className="text-xs text-slate-400 mt-1">Cette semaine</p>
          </div>
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-2xl font-bold text-accent-ia">{stats.searchesThisMonth}</p>
            <p className="text-xs text-slate-400 mt-1">Ce mois</p>
          </div>
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-2xl font-bold text-accent-devops">{stats.totalSearches}</p>
            <p className="text-xs text-slate-400 mt-1">Total</p>
          </div>
        </div>
      </div>

      {/* Statistiques des Visiteurs */}
      <div className="bg-dark-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-purple-500" />
          Statistiques des Visiteurs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-3xl font-bold text-purple-500">{stats.dailyVisitors}</p>
            <p className="text-xs text-slate-400 mt-1">Visiteurs aujourd'hui</p>
          </div>
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-3xl font-bold text-indigo-500">{stats.totalVisitors}</p>
            <p className="text-xs text-slate-400 mt-1">Total visiteurs</p>
          </div>
          <div className="text-center p-4 bg-dark-900/50 rounded-lg border border-slate-700/50">
            <p className="text-3xl font-bold text-pink-500">{stats.currentVisitors}</p>
            <p className="text-xs text-slate-400 mt-1">Actuellement en ligne</p>
          </div>
        </div>
      </div>

      {/* Activité Récente */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-dark-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Activité Récente
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg">
              <span className="text-sm text-slate-300">Cette semaine</span>
              <span className="text-lg font-bold text-primary">{stats.reviewsThisWeek} revues</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg">
              <span className="text-sm text-slate-300">Ce mois</span>
              <span className="text-lg font-bold text-accent-ia">{stats.reviewsThisMonth} revues</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-dark-900/50 rounded-lg">
              <span className="text-sm text-slate-300">Jour le plus actif</span>
              <span className="text-lg font-bold text-accent-devops capitalize">{stats.mostActiveDay}</span>
            </div>
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-dark-800/50 p-6 rounded-xl border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Tags Populaires</h3>
          <div className="space-y-2">
            {topTags.map(([tag, count], idx) => {
              const maxCount = topTags[0]?.[1] || 1;
              const percentage = ((count as number) / (maxCount as number)) * 100;
              return (
                <div key={tag} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">#{tag}</span>
                    <span className="text-slate-500 font-mono">{count}</span>
                  </div>
                  <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent-ia transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {topTags.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">Aucun tag disponible</p>
            )}
          </div>
        </div>
      </div>

      {/* Distribution par Catégorie */}
      <div className="bg-dark-800/50 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Répartition par Thématique
        </h3>
        <div className="flex items-end justify-between h-56 gap-2 md:gap-4 mb-4">
          {Object.entries(stats.categoryDistribution).map(([cat, count]) => {
            const numCount = Number(count) || 0;
            const maxVal = Math.max(...Object.values(stats.categoryDistribution).map(v => Number(v) || 0), 1);
            const height = maxVal > 0 ? (numCount / maxVal) * 100 : 0;
            const colors: any = {
                'Web': 'bg-accent-web',
                'Cloud': 'bg-accent-cloud',
                'DevOps': 'bg-accent-devops',
                'Security': 'bg-accent-sec',
                'IA': 'bg-accent-ia',
                'Mix': 'bg-accent-mix',
            };
            const textColors: any = {
                'Web': 'text-accent-web',
                'Cloud': 'text-accent-cloud',
                'DevOps': 'text-accent-devops',
                'Security': 'text-accent-sec',
                'IA': 'text-accent-ia',
                'Mix': 'text-accent-mix',
            };
            return (
              <div key={cat} className="flex flex-col items-center flex-1 group">
                <div className="relative w-full flex justify-center h-full items-end">
                   <div 
                    style={{ height: `${height}%` }} 
                    className={`w-full max-w-[50px] rounded-t-lg opacity-80 group-hover:opacity-100 transition-all ${colors[cat]} shadow-lg`}
                   ></div>
                   <span className="absolute -top-8 text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900 px-2 py-1 rounded">
                     {numCount}
                   </span>
                </div>
                <div className="mt-3 text-center">
                  <span className={`text-xs md:text-sm font-bold ${textColors[cat]}`}>{cat}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {stats.totalReviews > 0 ? Math.round((numCount / stats.totalReviews) * 100) : 0}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Insights
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
            <p className="text-slate-300">
              Vous avez généré <span className="text-white font-semibold">{stats.totalReviews} revues</span> couvrant{' '}
              <span className="text-primary font-semibold">{stats.totalNews} actualités</span> technologiques.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-ia mt-1.5" />
            <p className="text-slate-300">
              Votre catégorie favorite est <span className="text-accent-ia font-semibold">{stats.topCategory}</span>,{' '}
              avec une moyenne de <span className="text-white font-semibold">{stats.avgNewsPerReview} news</span> par revue.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-devops mt-1.5" />
            <p className="text-slate-300">
              Temps moyen de génération: <span className="text-accent-devops font-semibold">{stats.avgGenerationTime}s</span>,{' '}
              optimisé par l'IA Gemini.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
            <p className="text-slate-300">
              <span className="text-purple-500 font-semibold">{stats.dailyVisitors} visiteurs</span> aujourd'hui,{' '}
              pour un total de <span className="text-indigo-500 font-semibold">{stats.totalVisitors} visiteurs</span> depuis le début.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;