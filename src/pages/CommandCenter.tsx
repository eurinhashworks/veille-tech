import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    TrendingUp,
    Brain,
    Zap,
    BarChart3,
    Clock,
    FileText,
    ChevronRight,
    Target,
    Search,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getStatistics, getAllReviews } from '../services/storageService';
import { TrendAnalysisService } from '../services/ml/trendAnalysisService';
import { Review } from '../types';
import { TrendReport } from '../services/ml/models/TrendPredictionModel';
import { motion } from 'framer-motion';

const CommandCenter: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [lastReview, setLastReview] = useState<Review | null>(null);
    const [topTrends, setTopTrends] = useState<TrendReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                const [dbStats, dbReviews] = await Promise.all([
                    getStatistics(),
                    getAllReviews()
                ]);

                setStats(dbStats);
                if (dbReviews.length > 0) {
                    setLastReview(dbReviews[0]);
                }

                const trendService = new TrendAnalysisService();
                const trends = await trendService.getRisingTrends(3);
                setTopTrends(trends);

            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <LayoutDashboard className="text-primary" /> Command Center
                    </h1>
                    <p className="text-slate-400 mt-1">Plateforme de pilotage stratégique et insights IA.</p>
                </div>
                <div className="flex items-center gap-3 bg-dark-800/50 border border-slate-700 px-4 py-2 rounded-xl">
                    <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-sm text-slate-300 font-medium">Système Opérationnel</span>
                </div>
            </header>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {/* Widget: Stats Radar (Pulse) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-dark-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-colors"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <BarChart3 size={20} />
                            </div>
                            <h3 className="font-bold text-white">Veille Pulse</h3>
                        </div>
                        <button
                            onClick={() => navigate('/stats')}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            Détails <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Volume Total</p>
                            <p className="text-3xl font-black text-white">{stats?.totalReviews || 0}</p>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                <TrendingUp size={10} /> +12% cette semaine
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Top Catégorie</p>
                            <p className="text-2xl font-bold text-primary">{stats?.topCategory || 'Mix'}</p>
                            <p className="text-[10px] text-slate-400">Basé sur les 30 derniers jours</p>
                        </div>
                    </div>

                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BarChart3 size={120} className="text-primary rotate-12" />
                    </div>
                </motion.div>

                {/* Widget: IA Radar (Trends) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2 bg-dark-800/40 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Brain size={20} />
                            </div>
                            <h3 className="font-bold text-white">Radar IA : Tendances mondiales</h3>
                        </div>
                        <button
                            onClick={() => navigate('/intelligence')}
                            className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                        >
                            Explorer <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {topTrends.map((trend, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-dark-900/40 rounded-xl border border-slate-700/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                        <TrendingUp size={14} />
                                    </div>
                                    <span className="text-sm font-medium text-white">{trend.technology}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-400">+{((trend.predictedMentions - trend.currentMentions) / trend.currentMentions * 100).toFixed(1)}%</p>
                                        <p className="text-[10px] text-slate-500 uppercase">Impact: {trend.impactScore}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Widget: Last Review (Flash) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-3 bg-dark-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl relative group hover:border-primary/30 transition-colors"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                                <FileText size={14} /> Dernière Revue Générée
                            </div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                {lastReview ? lastReview.metadata.formattedDate : 'Aucune revue générée'}
                            </h3>
                        </div>
                        {lastReview && (
                            <button
                                onClick={() => navigate(`/review/${lastReview.metadata.id}`)}
                                className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/10"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </div>

                    {lastReview && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="md:col-span-3">
                                <p className="text-slate-300 leading-relaxed text-lg italic">
                                    "{lastReview.metadata.flashSummary}"
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {lastReview.metadata.tags.slice(0, 5).map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-dark-900/60 border border-slate-700/50 rounded-full text-xs text-slate-400 font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col justify-end items-end gap-2 border-l border-slate-700/50 pl-8">
                                <div className="text-right">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold">Temps de lecture</p>
                                    <p className="text-white font-mono flex items-center gap-2 justify-end">
                                        <Clock size={12} className="text-primary" /> ~5 min
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 text-[10px] uppercase font-bold">News analysées</p>
                                    <p className="text-white font-mono flex items-center gap-2 justify-end">
                                        <Zap size={12} className="text-amber-400" /> {lastReview.metadata.newsCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Widget: Quick Actions */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-1 bg-gradient-to-br from-primary/20 to-accent-ia/20 backdrop-blur-md border border-primary/20 p-6 rounded-3xl flex flex-col justify-between"
                >
                    <div className="space-y-2">
                        <h4 className="font-bold text-white text-lg">Actions Rapides</h4>
                        <p className="text-slate-400 text-xs">Accès direct aux fonctionnalités critiques.</p>
                    </div>

                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => navigate('/generator')}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Zap className="text-amber-400 w-4 h-4" />
                                <span className="text-sm font-medium text-white">Nouvelle Revue</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-500" />
                        </button>
                        <button
                            onClick={() => navigate('/search')}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Search className="text-blue-400 w-4 h-4" />
                                <span className="text-sm font-medium text-white">Recherche Globale</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-500" />
                        </button>
                        <button
                            onClick={() => navigate('/intelligence')}
                            className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Target className="text-emerald-400 w-4 h-4" />
                                <span className="text-sm font-medium text-white">Deep Intelligence</span>
                            </div>
                            <ChevronRight size={14} className="text-slate-500" />
                        </button>
                    </div>
                </motion.div>

                {/* Widget: News Ticker (Full Width) */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-4 bg-dark-900/50 border border-slate-800 p-4 rounded-2xl overflow-hidden"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-lg text-[10px] font-bold uppercase shrink-0">
                            <Activity size={12} /> Live Feed
                        </div>
                        <div className="flex-1 overflow-hidden relative h-6">
                            <motion.div
                                animate={{ x: [0, -1000] }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute whitespace-nowrap flex items-center gap-12 text-sm text-slate-400"
                            >
                                <span>🚀 EUREKA v2.0 est désormais en ligne avec PostgreSQL strict.</span>
                                <span>🔥 Tendance forte détectée sur les LLM Open Source cette semaine.</span>
                                <span>⚡ Nouvelle revue générée pour "Analyse Cybersécurité".</span>
                                <span>💡 Conseil : Utilisez le dashboard Intelligence pour voir le graphe de réseau.</span>
                                <span>💧 Accès libre pour tous ! Aucune connexion requise.</span>
                                <span>📊 Les statistiques de visite ont augmenté de 15% aujourd'hui.</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CommandCenter;
