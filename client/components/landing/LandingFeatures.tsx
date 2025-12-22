import React from 'react';

const LandingFeatures: React.FC = () => {
    return (
        <section className="py-20 bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-slate-900 dark:text-white">Votre veille tech est terminée.</h2>
                    <p className="text-slate-600 dark:text-slate-400">Si vous pouvez décrire l'insight qu'il vous faut, vous pouvez le construire.</p>
                </div>

                {/* Feature 1 */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 md:p-12 mb-8 flex flex-col md:flex-row items-center gap-12 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="md:w-1/3">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-slate-900 dark:text-white">Lisez à la vitesse de la lumière</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Indiquez votre sujet à EUREKA, et regardez-le se transformer en un briefing opérationnel—avec toutes les sources, résumés et données de tendances nécessaires.
                        </p>
                        <a href="/login" className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition">
                            Voir un exemple
                        </a>
                    </div>
                    <div className="md:w-2/3 w-full">
                        <div className="relative bg-gradient-to-br from-indigo-200 via-purple-100 to-white dark:from-indigo-900 dark:via-slate-800 dark:to-slate-900 rounded-xl p-6 shadow-xl transform rotate-1 hover:rotate-0 transition duration-500">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                        <span className="material-icons text-sm">article</span>
                                    </div>
                                    <div className="text-sm font-bold dark:text-white">Rapport IA Générative</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Nouveaux Articles</div>
                                        <div className="text-xl font-bold dark:text-white">12</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Croissance</div>
                                        <div className="text-xl font-bold text-green-500">+24%</div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-700 p-3 rounded-md">
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Sentiment</div>
                                        <div className="text-xl font-bold text-blue-500">Pos</div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 bg-slate-100 dark:bg-slate-600 rounded w-full"></div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-600 rounded w-5/6"></div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-600 rounded w-4/6"></div>
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur p-3 rounded-lg shadow-lg border border-slate-100 dark:border-slate-600 text-xs text-slate-900 dark:text-slate-100">
                                <p className="text-slate-600 dark:text-slate-300 italic">"Crée un digest quotidien pour m'aider à suivre les sorties LLM majeures et les benchmarks open source..."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 2 (Enjoy built-in insight) */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 md:p-12 mb-8 flex flex-col md:flex-row-reverse items-center gap-12 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="md:w-1/3">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-slate-900 dark:text-white">Profitez d'insights tech intégrés</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Bénéficiez d'une analyse automatisée des signaux faibles, du tracking des levées de fonds et d'un scoring de pertinence personnalisé selon votre stack technique.
                        </p>
                        <a href="/login" className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition">
                            En savoir plus
                        </a>
                    </div>
                    <div className="md:w-2/3 w-full">
                        <div className="relative bg-gradient-to-bl from-orange-100 via-rose-50 to-white dark:from-orange-900/40 dark:via-red-900/20 dark:to-slate-900 rounded-3xl p-8 shadow-2xl border border-white/50 transform -rotate-1 hover:rotate-0 transition-all duration-700">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <div className="flex h-[300px]">
                                    {/* Sidebar */}
                                    <div className="w-48 bg-slate-50 dark:bg-slate-900/50 p-6 border-r border-slate-200 dark:border-slate-700 hidden sm:block">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-12 bg-primary/20 rounded-full"></div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-1.5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                                <div className="h-1.5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Main Content */}
                                    <div className="flex-1 p-8">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Intelligence Écosystème</h4>
                                                <p className="text-[10px] text-slate-500">Mise à jour : il y a 5 min</p>
                                            </div>
                                            <div className="px-3 py-1 bg-green-500/10 text-green-600 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider">Actif</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-6 mb-8">
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                                <div className="text-[10px] text-slate-500 mb-1">Sentiment Marché</div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                    78% <span className="material-icons text-green-500 text-sm">trending_up</span>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-700">
                                                <div className="text-[10px] text-slate-500 mb-1">Signaux Faibles</div>
                                                <div className="text-lg font-bold text-slate-900 dark:text-white">12 Détectés</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                                    <span className="material-icons text-xs">analytics</span>
                                                </div>
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                                                    <div className="h-1.5 w-4/6 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 3 (Ready to read) */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="md:w-1/3">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-slate-900 dark:text-white">Prêt à lire, instantanément.</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Notre plateforme intègre ses propres archives. Quand votre briefing est prêt, il ne reste plus qu'à le publier, l'utiliser et le partager avec votre équipe.
                        </p>
                        <a href="/login" className="inline-block bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-90 transition">
                            Explorer
                        </a>
                    </div>
                    <div className="md:w-2/3 w-full">
                        <div className="relative bg-gradient-to-tr from-emerald-100/50 via-teal-50 to-white dark:from-emerald-900/40 dark:via-teal-900/20 dark:to-slate-900 rounded-3xl p-8 shadow-2xl border border-white/50 transform hover:scale-[1.02] transition-all duration-700">
                            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <span className="material-icons">history</span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold dark:text-white">Archives de Veille</h4>
                                            <p className="text-[10px] text-slate-500">Souveraineté & Historique</p>
                                        </div>
                                    </div>
                                    <a href="/login" className="px-4 py-2 bg-primary text-white text-[10px] font-bold rounded-lg shadow-lg shadow-primary/20 cursor-pointer hover:brightness-110 transition">Nouveau Briefing</a>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: "Rapport Cloud Native", date: "Aujourd'hui", color: "blue" },
                                        { title: "Sécurité Zero Trust", date: "Hier", color: "red" },
                                        { title: "Tendances Web3", date: "15 Déc", color: "purple" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 group hover:border-primary/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full bg-${item.color}-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]`}></div>
                                                <div>
                                                    <div className="text-xs font-bold dark:text-white group-hover:text-primary transition-colors">{item.title}</div>
                                                    <div className="text-[9px] text-slate-400">{item.date} • Analyse Complète</div>
                                                </div>
                                            </div>
                                            <span className="material-icons text-xs text-slate-300 group-hover:text-primary transition-colors">chevron_right</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingFeatures;
