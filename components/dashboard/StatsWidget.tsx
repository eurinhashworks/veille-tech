import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StatsWidgetProps {
    stats: {
        totalReviews: number;
        topCategory: string;
    } | null;
    variants: any;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ stats, variants }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={variants}
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
    );
};

export default StatsWidget;
