import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, Search, Calendar, Users, Eye, BarChart3, FolderOpen, Star } from 'lucide-react';
import { Review } from '../types';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Spinner from './Spinner';

// Composant StatCard
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-dark-800 border border-slate-700 rounded-xl p-5 hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text', 'bg')}/20`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

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
  totalFavorites: number; // Ajout du nombre de favoris
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
    currentVisitors: 0,
    totalFavorites: 0 // Initialisation du nombre de favoris
  });

  // Utiliser le hook utilisateur pour obtenir l'utilisateur courant
  const { user, loading: userLoading } = useCurrentUser();

  // État de chargement
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);

        const { getStatistics } = await import('../services/storageService');
        const { getSearchHistory } = await import('../services/storageService');
        const { getUserFavorites } = await import('../services/storageService');

        // Charger les statistiques de base (disponibles pour tous les utilisateurs)
        const baseStats = await getStatistics() as Record<string, any>;

        // Charger l'historique de recherche global (pour tous les utilisateurs)
        // Si l'utilisateur est connecté, charger aussi son historique personnel
        let searchHistory = [];
        if (user) {
          searchHistory = await getSearchHistory(user.id, 1000);
        }

        // Charger les favoris de l'utilisateur (si connecté)
        let userFavorites = [];
        if (user) {
          userFavorites = await getUserFavorites(user.id);
        }

        // Calculer les statistiques de recherche
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const searchesToday = searchHistory.filter((s: { timestamp?: number | string; createdAt?: string | number }) =>
          new Date(Number(s.timestamp) || Number(s.createdAt) || 0).toDateString() === today
        ).length;

        const searchesThisWeek = searchHistory.filter((s: { timestamp?: number | string; createdAt?: string | number }) =>
          new Date(Number(s.timestamp) || Number(s.createdAt) || 0) >= weekAgo
        ).length;

        const searchesThisMonth = searchHistory.filter((s: { timestamp?: number | string; createdAt?: string | number }) =>
          new Date(Number(s.timestamp) || Number(s.createdAt) || 0) >= monthAgo
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
          currentVisitors,
          totalFavorites: userFavorites.length // Ajout du nombre de favoris
        });
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [reviews, user]);

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
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white">Statistiques</h1>
      </div>

      {loading || userLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size="lg" color="primary" />
          <p className="text-slate-400 mt-4">Chargement des statistiques...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revues"
            value={stats.totalReviews}
            icon={<FolderOpen className="w-5 h-5" />}
            color="text-blue-400"
          />
          <StatCard
            title="Total Actualités"
            value={stats.totalNews}
            icon={<TrendingUp className="w-5 h-5" />}
            color="text-green-400"
          />
          <StatCard
            title="Favoris"
            value={stats.totalFavorites}
            icon={<Star className="w-5 h-5" />}
            color="text-yellow-400"
          />
          <StatCard
            title="Temps Moyen"
            value={`${stats.avgGenerationTime}s`}
            icon={<Clock className="w-5 h-5" />}
            color="text-purple-400"
          />
        </div>
      )}

      {/* Vue d'ensemble */}
      <div className="bg-gradient-to-r from-primary/10 to-accent-ia/10 border border-primary/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Vue d'ensemble
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-dark-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-slate-300">Recherches</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Aujourd'hui</span>
                <span className="text-white font-medium">{stats.searchesToday}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Cette semaine</span>
                <span className="text-white font-medium">{stats.searchesThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Ce mois</span>
                <span className="text-white font-medium">{stats.searchesThisMonth}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Total</span>
                <span className="text-white font-medium">{stats.totalSearches}</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-slate-300">Générations</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Cette semaine</span>
                <span className="text-white font-medium">{stats.reviewsThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Ce mois</span>
                <span className="text-white font-medium">{stats.reviewsThisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Moyenne/jour</span>
                <span className="text-white font-medium">
                  {totalReviews > 0 ? (totalReviews / Math.max(1, Math.floor((new Date().getTime() - new Date(reviews[reviews.length - 1]?.metadata.timestamp || 0).getTime()) / (1000 * 60 * 60 * 24)))).toFixed(1) : 0}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Actualités/revue</span>
                <span className="text-white font-medium">{stats.avgNewsPerReview}</span>
              </div>
            </div>
          </div>

          <div className="bg-dark-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-slate-300">Visiteurs</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Aujourd'hui</span>
                <span className="text-white font-medium">{stats.dailyVisitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">En ligne</span>
                <span className="text-white font-medium">{stats.currentVisitors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Total</span>
                <span className="text-white font-medium">{stats.totalVisitors}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-700">
                <span className="text-slate-400 text-sm">Jour le plus actif</span>
                <span className="text-white font-medium">{stats.mostActiveDay}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution par catégorie */}
      <div className="bg-dark-800 border border-slate-700 rounded-xl p-6 mt-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Distribution par catégorie
        </h2>
        <div className="mt-6 space-y-3">
          {Object.entries(distribution)
            .sort((a, b) => (b[1] as number) - (a[1] as number))
            .map(([category, count]) => {
              const percentage = totalReviews > 0 ? (count as number) / totalReviews * 100 : 0;
              const width = (count as number) / maxVal * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300 font-medium">{category}</span>
                    <span className="text-slate-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent-ia h-2 rounded-full transition-all duration-500"
                      style={{ width: `${width}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Top tags */}
      {topTags.length > 0 && (
        <div className="bg-dark-800 border border-slate-700 rounded-xl p-6 mt-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Top tags
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-sm font-medium"
              >
                #{tag} <span className="text-slate-400">({count})</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;