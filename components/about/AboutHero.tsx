import React from 'react';

const AboutHero: React.FC = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            <div className="container mx-auto px-6 text-center relative z-10">
                <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase border border-slate-200 dark:border-slate-800 rounded-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    INTELLIGENCE TECH PAR IA
                </div>

                <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 max-w-5xl mx-auto leading-[1.1]">
                    Votre veille tech ne devrait pas attendre<br />
                    <span className="text-primary">votre café du matin.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                    EUREKA aide les leaders tech et les équipes à garder une longueur d'avance en automatisant leur veille quotidienne grâce à une analyse IA approfondie.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="/login"
                        className="bg-primary text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:brightness-110 transition-all transform hover:scale-105"
                    >
                        Voir un exemple de rapport
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-slate-600 dark:text-slate-300 font-semibold hover:text-primary transition flex items-center gap-2"
                    >
                        Comment ça marche <span className="material-icons">arrow_downward</span>
                    </a>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10"></div>
        </section>
    );
};

export default AboutHero;
