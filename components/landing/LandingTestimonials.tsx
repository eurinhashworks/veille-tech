import React from 'react';

const LandingTestimonials: React.FC = () => {
    const testimonials = [
        {
            name: "Alex, CTO",
            handle: "@alex_cto_paris",
            text: "Grâce à EUREKA, je gagne 2 heures chaque matin. L'analyse technique est d'une précision rare. Indispensable.",
            size: "medium"
        },
        {
            name: "Sarah, VC",
            handle: "@sarah_fund",
            text: "Notre due diligence est 2x plus rapide. EUREKA scanne et synthétise l'écosystème mieux qu'un analyste junior.",
            size: "wide"
        },
        {
            name: "Thomas",
            handle: "@thomas_dev",
            text: "Enfin une IA qui comprend la tech, pas juste les mots-clés. Les rapports sur Rust et WebAssembly sont bluffants.",
            size: "high"
        },
        {
            name: "Marie, Product Lead",
            handle: "@marie_build",
            text: "Je personnalise mes briefings 'SaaS & Outils'. Chaque vendredi, mon équipe a son digest. Ils adorent.",
            size: "medium"
        },
        {
            name: "Hasan",
            handle: "@hasan_ai",
            text: "Okay, EUREKA a changé ma routine. Fini le scroll sur 10 sites. Mon temps de veille est passé de 1h à 5 min. Magique.",
            size: "wide"
        },
        {
            name: "Best of Tech",
            handle: "@bestoftech_fr",
            text: "Vous pouvez maintenant maîtriser l'actualité tech sans y consacrer votre journée. C'est l'outil de productivité ultime pour les devs et founders.",
            size: "high"
        }
    ];

    // Doubling for seamless scroll
    const allTestimonials = [...testimonials, ...testimonials];

    const getCardStyle = (size: string) => {
        switch (size) {
            case 'wide': return 'w-[400px] h-[180px]';
            case 'high': return 'w-[300px] h-[240px]';
            default: return 'w-[300px] h-[180px]';
        }
    };

    return (
        <section className="relative overflow-hidden pt-24 pb-32 bg-gradient-to-b from-slate-50 to-[#f0fdf4] dark:from-slate-900 dark:to-[#061a06]">
            <div className="container mx-auto px-6 text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                    "Okay, @EUREKA_tech a changé ma veille."
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Ce que les builders tech disent de nous.
                </p>
            </div>

            {/* Scrolling Grid Area */}
            <div className="flex flex-col gap-6 w-full relative">
                {/* Row 1: Right to Left */}
                <div className="flex gap-6 animate-marquee">
                    {allTestimonials.map((t, i) => (
                        <div
                            key={`r1-${i}`}
                            className={`flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-105 hover:shadow-xl transition-all duration-300 group cursor-pointer ${getCardStyle(t.size)}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.handle}</div>
                                </div>
                                <div className="ml-auto flex gap-1">
                                    <span className="material-icons text-blue-400 text-sm">verified</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">"{t.text}"</p>
                            <div className="mt-auto flex items-center justify-between pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex gap-3">
                                    <span className="material-icons text-slate-400 text-sm hover:text-blue-400">chat_bubble_outline</span>
                                    <span className="material-icons text-slate-400 text-sm hover:text-green-400">repeat</span>
                                    <span className="material-icons text-slate-400 text-sm hover:text-red-400">favorite_border</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Row 2: Left to Right (slightly shifted) */}
                <div className="flex gap-6 animate-marquee2 ml-[-100px]">
                    {[...allTestimonials].reverse().map((t, i) => (
                        <div
                            key={`r2-${i}`}
                            className={`flex-shrink-0 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:scale-105 hover:shadow-xl transition-all duration-300 group cursor-pointer ${getCardStyle(t.size)}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.handle}</div>
                                </div>
                                <div className="ml-auto">
                                    <span className="material-icons text-blue-500 text-sm">share</span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA on White Background */}
            <div className="mt-20 flex flex-col items-center">
                <div className="h-20 w-full bg-gradient-to-b from-transparent to-white dark:to-slate-950"></div>
                <div className="bg-white dark:bg-slate-950 w-full py-12 flex justify-center">
                    <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:brightness-90 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Commencer gratuitement – 14 jours d'essai
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee2 {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee 60s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
                .animate-marquee2 {
                    display: flex;
                    width: max-content;
                    animation: marquee2 50s linear infinite;
                }
                .animate-marquee2:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default LandingTestimonials;
