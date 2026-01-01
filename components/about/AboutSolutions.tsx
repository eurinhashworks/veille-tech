import React from 'react';

const AboutSolutions: React.FC = () => {
    const solutions = [
        {
            title: "Pour CTOs & Tech Leads",
            bg: "bg-blue-50 dark:bg-blue-900/10",
            border: "border-blue-100 dark:border-blue-900/30",
            iconColor: "text-blue-500",
            desc: "Suivez les stacks tech, les tendances d'architecture et l'innovation en temps réel."
        },
        {
            title: "Pour Investisseurs & Analystes",
            bg: "bg-emerald-50 dark:bg-emerald-900/10",
            border: "border-emerald-100 dark:border-emerald-900/30",
            iconColor: "text-emerald-500",
            desc: "Automatisation de la due diligence, détection de signaux de marché et suivi de startups."
        },
        {
            title: "Pour Équipes Produit & Stratégie",
            bg: "bg-teal-50 dark:bg-teal-900/10",
            border: "border-teal-100 dark:border-teal-900/30",
            iconColor: "text-teal-500",
            desc: "Suivi des fonctionnalités concurrentes, analyse des patterns UX et alertes de marché."
        }
    ];

    return (
        <section className="py-24 bg-slate-50 dark:bg-dark-950">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Surveillez ensemble avec une vision totale.</h2>
                        <p className="text-slate-600 dark:text-slate-400">Flux de travail d'intelligence collaborative conçus pour l'entreprise moderne.</p>
                    </div>
                    <a href="/login" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold hover:brightness-110 transition shrink-0 whitespace-nowrap">
                        Démarrer l'essai gratuit
                    </a>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {solutions.map((item, i) => (
                        <div key={i} className={`${item.bg} ${item.border} border rounded-[2rem] p-10 flex flex-col hover:shadow-2xl transition-all duration-500`}>
                            <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center ${item.iconColor} mb-8 shadow-sm`}>
                                <span className="material-icons text-3xl">corporate_fare</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-height-tight">{item.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 flex-grow">
                                {item.desc}
                            </p>
                            <a href="/login" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white hover:text-primary transition group">
                                En savoir plus <span className="material-icons text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSolutions;
