import React from 'react';
import { LayoutDashboard, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardData } from '../hooks/useDashboardData';
import StatsWidget from '../components/dashboard/StatsWidget';
import TrendsWidget from '../components/dashboard/TrendsWidget';
import LastReviewWidget from '../components/dashboard/LastReviewWidget';
import QuickActionsWidget from '../components/dashboard/QuickActionsWidget';
import NewsTickerWidget from '../components/dashboard/NewsTickerWidget';

const CommandCenter: React.FC = () => {
    const { stats, lastReview, topTrends, loading } = useDashboardData();

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
                <StatsWidget stats={stats} variants={itemVariants} />

                {/* Widget: IA Radar (Trends) */}
                <TrendsWidget topTrends={topTrends} variants={itemVariants} />

                {/* Widget: Last Review (Flash) */}
                <LastReviewWidget lastReview={lastReview} variants={itemVariants} />

                {/* Widget: Quick Actions */}
                <QuickActionsWidget variants={itemVariants} />

                {/* Widget: News Ticker (Full Width) */}
                <NewsTickerWidget variants={itemVariants} />
            </motion.div>
        </div>
    );
};

export default CommandCenter;

