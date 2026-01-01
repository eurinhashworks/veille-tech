import React from 'react';

const AboutFeatures: React.FC = () => {
    return (
        <section className="py-24 bg-white dark:bg-dark-900">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-20 items-stretch">
                    {/* Left Column */}
                    <div className="flex-1 space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Passez votre veille à l'échelle</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                Pourquoi limiter votre vision à quelques newsletters ? EUREKA traite des milliers de signaux pour ne vous apporter que ce qui compte pour vos besoins spécifiques.
                            </p>
                            <div className="space-y-4">
                                {["Surveillez 200+ sources fiables", "Automatisez les briefings quotidiens & hebdos", "Personnalisez votre style d'analyse"].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-colors cursor-pointer group">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <span className="material-icons text-sm">check</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mid-Left stylized block */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: "lock", label: "Briefings Privés" },
                                { icon: "groups", label: "Partage Équipe" },
                                { icon: "api", label: "Accès API" },
                                { icon: "inventory_2", label: "Archives Sécurisées" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex flex-col items-center text-center group hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-xl">
                                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-blue-500 mb-4 shadow-sm">
                                        <span className="material-icons">{item.icon}</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Profondeur sans compromis</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                                Les résumés simples ne suffisent pas pour les décisions stratégiques. EUREKA fournit une analyse multi-couches qui va au-delà de la surface.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    { title: "Détection de tendances & scoring", desc: "Identifiez les modèles émergents avant qu'ils ne deviennent courants." },
                                    { title: "Analyse de nouveauté", desc: "Comprenez exactement ce qui est nouveau et pourquoi c'est important." },
                                    { title: "Insights concurrentiels", desc: "Restez informé des mouvements du marché et des concurrents." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Top-Right stylized block: Report Preview */}
                        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Configuration Générateur</span>
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    {['Analytique', 'Technique', 'Créatif', 'Stratégique'].map((style) => (
                                        <div key={style} className={`p-3 rounded-xl border flex items-center justify-center text-[10px] font-bold transition ${style === 'Analytique' ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-primary/30'}`}>
                                            {style}
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full mb-2"></div>
                                    <div className="h-2 w-4/6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                                </div>
                                <button className="w-full py-3 bg-primary text-white text-[10px] font-bold rounded-xl shadow-lg shadow-primary/20">
                                    GÉNÉRER UN RAPPORT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutFeatures;
