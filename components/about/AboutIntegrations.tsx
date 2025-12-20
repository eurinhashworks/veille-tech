import React from 'react';

const AboutIntegrations: React.FC = () => {
    return (
        <section className="py-20 bg-white dark:bg-dark-900">
            <div className="container mx-auto px-6">
                <div className="bg-[#021a2f] rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Connecté à votre monde tech</h2>
                        <p className="text-blue-200/70 max-w-2xl mx-auto mb-16 leading-relaxed">
                            EUREKA s'intègre parfaitement à votre flux de travail existant. Recevez vos briefings là où vous travaillez déjà.
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-20 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
                            {[
                                { icon: "forum", label: "Slack" },
                                { icon: "groups", label: "Teams" },
                                { icon: "api", label: "API" },
                                { icon: "mail", label: "Mail" },
                                { icon: "picture_as_pdf", label: "PDF Export" }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-4 group">
                                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/5">
                                        <span className="material-icons text-3xl text-white">{item.icon}</span>
                                    </div>
                                    <span className="text-xs font-bold tracking-widest uppercase text-blue-100/50 group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background glows */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
                </div>
            </div>
        </section>
    );
};

export default AboutIntegrations;
