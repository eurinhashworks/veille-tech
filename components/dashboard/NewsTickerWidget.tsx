import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface NewsTickerWidgetProps {
    variants: any;
}

const NewsTickerWidget: React.FC<NewsTickerWidgetProps> = ({ variants }) => {
    return (
        <motion.div
            variants={variants}
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
    );
};

export default NewsTickerWidget;
