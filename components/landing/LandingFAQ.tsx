import React, { useState } from 'react';

const LandingFAQ: React.FC = () => {
    const faqs = [
        {
            question: "Qu'est-ce qu'EUREKA ?",
            answer: "EUREKA est une plateforme alimentée par l'IA pour l'intelligence technologique. Elle rassemble, résume et analyse automatiquement les tendances et actualités tech selon vos centres d'intérêt (IA, SaaS, Sécurité, etc.)."
        },
        {
            question: "Où puis-je trouver des exemples de rapports ?",
            answer: "Une fois connecté, vous pourrez voir une variété de briefings publics dans la section timeline. Vous pouvez aussi générer votre premier briefing gratuitement via le générateur."
        },
        {
            question: "Quelles sources EUREKA surveille-t-il ?",
            answer: "Nous surveillons les dépôts GitHub, les articles de recherche (arXiv), les médias spécialisés, les blogs de grandes entreprises et les communautés de développeurs pour fournir les briefings les plus récents."
        },
        {
            question: "Comment personnaliser mon briefing ?",
            answer: "Vous pouvez utiliser le langage naturel pour décrire ce dont vous avez besoin. L'IA configurera automatiquement les paramètres de recherche, la profondeur et le ton."
        },
        {
            question: "Comment fonctionne l'analyse par l'IA ?",
            answer: "Nous utilisons des LLM avancés (comme Gemini) combinés à des modèles ML locaux pour extraire les entités clés, le sentiment et les métriques de tendance à partir de contenus tech non structurés."
        },
        {
            question: "Pourquoi choisir EUREKA pour sa veille tech ?",
            answer: "EUREKA est conçu pour la vitesse et la profondeur. Il réduit le temps passé dans le bruit de 90% tout en garantissant que vous ne manquiez aucune mise à jour critique de votre stack."
        },
        {
            question: "Une API est-elle disponible ?",
            answer: "Oui, nos plans payants incluent un accès API pour intégrer les briefings EUREKA directement dans vos tableaux de bord internes ou vos canaux Slack."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-background-light dark:bg-background-dark">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold dark:text-white">Questions Fréquentes</h2>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {faqs.map((faq, index) => (
                        <div key={index} className="py-6">
                            <div
                                className="flex justify-between items-center cursor-pointer group"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-lg font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary transition">
                                    {faq.question}
                                </span>
                                <span className={`material-icons text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-45 text-primary' : ''}`}>
                                    add
                                </span>
                            </div>
                            {openIndex === index && (
                                <div className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed animate-fade-in-up">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LandingFAQ;
