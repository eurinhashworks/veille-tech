import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, Clock, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Review } from '../../types/types';

interface LastReviewWidgetProps {
    lastReview: Review | null;
    variants: any;
}

const LastReviewWidget: React.FC<LastReviewWidgetProps> = ({ lastReview, variants }) => {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);

    return (
        <motion.div
            variants={variants}
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
    );
};

export default LastReviewWidget;
