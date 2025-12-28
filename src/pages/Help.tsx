import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LifeBuoy, Book, Github } from 'lucide-react';

const Help: React.FC = () => {
    const navigate = useNavigate();

    const resources = [
        {
            title: "Documentation Complète",
            description: "Explorez notre documentation détaillée pour comprendre toutes les fonctionnalités d'EUREKA.",
            icon: <Book className="w-6 h-6 text-primary" />,
            link: "/docs", // Assuming you have a docs page
        },
        {
            title: "Rapporter un Bug",
            description: "Vous avez trouvé un problème ? Ouvrez une issue sur notre dépôt GitHub.",
            icon: <Github className="w-6 h-6 text-white" />,
            link: "https://github.com/votre-repo/eureka/issues", // Replace with your repo
        },
        {
            title: "Contacter le Support",
            description: "Pour toute question, contactez-nous directement par email.",
            icon: <LifeBuoy className="w-6 h-6 text-emerald-400" />,
            link: "mailto:support@eureka-app.com",
        },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <header className="flex items-center gap-4 mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-3xl font-bold text-white">Centre d'Aide</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {resources.map((item, index) => (
                    <a
                        key={index}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-dark-800/50 border border-slate-700 p-8 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-all group"
                    >
                        <div className="p-4 bg-dark-900 rounded-full mb-6 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-sm text-slate-400">{item.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Help;
