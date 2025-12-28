import React, { useState, useEffect } from 'react';
import { Network, TrendingUp, Cpu, Brain, Zap, Maximize2, Share2 } from 'lucide-react';
import { TrendAnalysisService } from '../services/ml/trendAnalysisService';
import { TrendReport } from '../services/ml/models/TrendPredictionModel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const IntelligenceDashboard: React.FC = () => {
    const [trends, setTrends] = useState<TrendReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrends = async () => {
            const service = new TrendAnalysisService();
            const allTrends = await service.analyzeTrends();
            setTrends(allTrends);
            setLoading(false);
        };
        loadTrends();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Brain className="text-primary" /> Intelligence Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1">Analyse prédictive et cartographie des technologies.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-dark-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Share2 size={18} />
                    </button>
                    <button className="p-2 bg-dark-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>

            {/* Grid d'aperçu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-800/50 border border-slate-700 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <TrendingUp size={20} />
                        </div>
                        <h3 className="font-bold text-white">Trend Rising</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {trends.filter(t => t.trend === 'rising').length}
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Technos en accélération ce mois.</p>
                </div>

                <div className="bg-dark-800/50 border border-slate-700 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-bold text-white">High Impact</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {trends.filter(t => t.impactScore > 70).length}
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Innovations à fort potentiel disruptif.</p>
                </div>

                <div className="bg-dark-800/50 border border-slate-700 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Network size={20} />
                        </div>
                        <h3 className="font-bold text-white">Network Density</h3>
                    </div>
                    <div className="text-3xl font-bold text-white">High</div>
                    <p className="text-slate-500 text-sm mt-1">Forte corrélation entre les domaines.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique des tendances */}
                <div className="bg-dark-800/50 border border-slate-700 p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-primary" /> Analyse Comparative des Tendances
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends.slice(0, 8)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="technology" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="impactScore" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Score d'Impact" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Network Map Placeholder */}
                <div className="bg-dark-800/50 border border-slate-700 p-6 rounded-2xl relative overflow-hidden group">
                    <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <Network size={18} className="text-primary" /> Cartographie des Écosystèmes
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">Visualisation des dépendances et connexions technologiques.</p>

                    <div className="h-[300px] flex items-center justify-center border border-slate-700/50 rounded-xl bg-dark-900/50 relative overflow-hidden">
                        {/* Visual simulation of nodes and lines */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none">
                            <svg width="100%" height="100%">
                                <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="1" />
                                <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#3b82f6" strokeWidth="1" />
                                <line x1="50%" y1="50%" x2="40%" y2="80%" stroke="#3b82f6" strokeWidth="1" />
                                <circle cx="20%" cy="30%" r="4" fill="#3b82f6" />
                                <circle cx="50%" cy="50%" r="6" fill="#60a5fa" />
                                <circle cx="80%" cy="20%" r="3" fill="#3b82f6" />
                                <circle cx="40%" cy="80%" r="5" fill="#3b82f6" />
                            </svg>
                        </div>
                        <div className="text-center z-10 transition-transform group-hover:scale-110 duration-500">
                            <Network size={48} className="text-primary/30 mx-auto mb-3" />
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase">
                                Vue Réseau Interactive
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                </div>
            </div>

            {/* Top Trends Table */}
            <div className="bg-dark-800/50 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-white">Technos à Surveiller</h3>
                    <button className="text-primary text-sm font-medium hover:underline">Voir tout</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold">Technologie</th>
                                <th className="px-6 py-4 font-bold">Tendance</th>
                                <th className="px-6 py-4 font-bold">Mentions Prédites</th>
                                <th className="px-6 py-4 font-bold">Impact</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {trends.slice(0, 5).map((t, i) => (
                                <tr key={i} className="hover:bg-slate-700/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                                <Cpu size={16} />
                                            </div>
                                            <span className="font-bold text-white">{t.technology}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {t.trend === 'rising' ? (
                                            <span className="text-emerald-400 flex items-center gap-1 text-sm font-medium">
                                                <TrendingUp size={14} /> +{(t.predictedMentions - t.currentMentions).toFixed(1)}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 flex items-center gap-1 text-sm">
                                                Stabilisé
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 font-mono text-sm">{t.predictedMentions.toFixed(0)} / jour</td>
                                    <td className="px-6 py-4">
                                        <div className="w-full bg-slate-700 h-1.5 rounded-full max-w-[100px]">
                                            <div
                                                className={`h-full rounded-full ${t.impactScore > 70 ? 'bg-amber-500' : 'bg-primary'}`}
                                                style={{ width: `${t.impactScore}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${t.trend === 'rising' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {t.trend === 'rising' ? 'Accelerating' : 'Stable'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IntelligenceDashboard;
