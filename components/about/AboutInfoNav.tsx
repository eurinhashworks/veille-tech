import React from 'react';

const AboutInfoNav: React.FC = () => {
    const navItems = [
        { label: "Produit", icon: "bolt" },
        { label: "Cas d'usage", icon: "view_quilt" },
        { label: "Ressources", icon: "description" },
        { label: "Tarifs", icon: "payments" },
        { label: "Entreprise", icon: "business" },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-dark-900 dark:to-dark-950">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-sm font-bold tracking-[0.3em] text-primary uppercase mb-12">Alors, c'est quoi EUREKA ?</h2>

                <nav className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-4 p-2 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-100 dark:border-slate-700 mb-16">
                    <div className="flex items-center gap-2 px-4 border-r border-slate-100 dark:border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <span className="material-icons text-sm">psychology</span>
                        </div>
                        <span className="text-xs font-black tracking-tighter dark:text-white">EUREKA</span>
                    </div>

                    {navItems.map((item, i) => (
                        <a
                            key={i}
                            href="/login"
                            className="flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-full transition-all"
                        >
                            {item.label} <span className="material-icons text-xs">expand_more</span>
                        </a>
                    ))}

                    <a
                        href="/login"
                        className="ml-2 px-6 py-2.5 bg-blue-500 text-white text-[10px] font-bold rounded-full hover:brightness-110 shadow-lg shadow-blue-500/20"
                    >
                        Essayer Gratuitement
                    </a>
                </nav>

                <div className="max-w-xl mx-auto">
                    <a
                        href="/login"
                        className="inline-flex items-center gap-3 px-8 py-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl hover:border-primary/50 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <span className="material-icons">auto_awesome</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Générer un exemple de rapport gratuit</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default AboutInfoNav;
