import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ChevronRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrendReport } from '../../services/trendService';

interface TrendsWidgetProps {
    topTrends: TrendReport[];
    variants: any;
}

const TrendsWidget: React.FC<TrendsWidgetProps> = ({ topTrends, variants }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={variants}
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
    );
};

export default TrendsWidget;
