import React from 'react';

const LandingPricing: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Investissez dans votre savoir.</h2>
                    <p className="text-slate-500 dark:text-slate-400">Le prix de deux cafés pour une maîtrise totale de votre industrie.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
                    {/* STARTER (Public) */}
                    <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 flex flex-col hover:border-slate-300 dark:hover:border-slate-500 transition-all shadow-sm">
                        <div className="mb-8">
                            <div className="h-2 w-12 bg-slate-200 dark:bg-slate-700 rounded-full mb-6"></div>
                            <h3 className="text-2xl font-bold mb-2">Public</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold">€0</span>
                                <span className="text-slate-500 dark:text-slate-400">/ mois</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pour découvrir et partager.</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-10 text-sm">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-green-500 text-sm">check_circle</span>
                                <span>Recherches & briefings publics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-green-500 text-sm">check_circle</span>
                                <span>3 briefings générés / mois</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-green-500 text-sm">check_circle</span>
                                <span>Style d'analyse : Analytique</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-green-500 text-sm">check_circle</span>
                                <span>Partage public (lien unique)</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 opacity-60">
                                <span className="material-icons text-sm">cancel</span>
                                <span>Recherches privées</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 opacity-60">
                                <span className="material-icons text-sm">cancel</span>
                                <span>Personnalisation des sources</span>
                            </div>
                        </div>

                        <a href="/login" className="w-full py-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:brightness-95 transition text-center">
                            C'est gratuit – Démarrer
                        </a>
                    </div>

                    {/* PRO (Privé) - FEATURED */}
                    <div className="relative bg-white dark:bg-slate-800 border-2 border-primary rounded-3xl p-8 flex flex-col shadow-2xl md:scale-105 z-10 transition-transform hover:scale-[1.07]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">
                            Le plus populaire
                        </div>

                        <div className="mb-8">
                            <div className="h-2 w-12 bg-primary/20 rounded-full mb-6"></div>
                            <h3 className="text-2xl font-bold mb-2 text-primary">Privé</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold">€19</span>
                                <span className="text-slate-500 dark:text-slate-400">/ mois</span>
                            </div>
                            <p className="text-[10px] text-primary font-bold mb-1 italic opacity-80">(ou €15/mois si annuel)</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Pour votre veille professionnelle.</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-10 text-sm">
                            <div className="flex items-center gap-3 font-semibold">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Recherches & briefings 100% privés</span>
                            </div>
                            <div className="flex items-center gap-3 font-semibold">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Briefings illimités</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Styles : Analytique, Tech, Créatif...</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Personnalisation des sources (5 max)</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Archivage & calendrier privé</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Export PDF + Markdown</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-primary text-sm">check_circle</span>
                                <span>Partage contrôlé (3 membres max)</span>
                            </div>
                        </div>

                        <a href="/login" className="w-full py-4 rounded-xl font-bold text-white bg-primary hover:brightness-95 transition shadow-lg shadow-primary/20 text-center">
                            Essayer 14 jours gratuitement
                        </a>
                    </div>

                    {/* ENTERPRISE (Souverain) */}
                    <div className="bg-[#021a2f] border border-slate-700 rounded-3xl p-8 flex flex-col text-white hover:border-slate-500 transition-all shadow-xl">
                        <div className="mb-8">
                            <div className="h-2 w-12 bg-blue-400/20 rounded-full mb-6"></div>
                            <h3 className="text-2xl font-bold mb-2">Souverain</h3>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-blue-400">Sur devis</span>
                            </div>
                            <p className="text-[10px] text-blue-300/60 font-bold mb-1 uppercase tracking-tight">À partir de €99/mois</p>
                            <p className="text-sm text-slate-400 font-medium">Pour les équipes qui construisent l'avenir.</p>
                        </div>

                        <div className="flex-grow space-y-4 mb-10 text-sm">
                            <div className="flex items-center gap-3 text-slate-200">
                                <span className="material-icons text-blue-400 text-sm">check_circle</span>
                                <span>Espace de travail privé dédié</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-200">
                                <span className="material-icons text-blue-400 text-sm">check_circle</span>
                                <span>Sources personnalisées illimitées</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-200">
                                <span className="material-icons text-blue-400 text-sm">check_circle</span>
                                <span>API complète pour vos outils</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-200">
                                <span className="material-icons text-blue-400 text-sm">check_circle</span>
                                <span>Équipe illimitée + SSO</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-200">
                                <span className="material-icons text-blue-400 text-sm">check_circle</span>
                                <span>Branding personnalisé</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-200">
                                <span className="material-icons text-blue-400 text-sm">check_circle</span>
                                <span>Support dédié & Onboarding</span>
                            </div>
                        </div>

                        <a href="/login" className="w-full py-4 rounded-xl font-bold bg-white text-[#021a2f] hover:bg-slate-100 transition shadow-xl text-center">
                            Nous contacter
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LandingPricing;
