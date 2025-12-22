import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

const LandingHero: React.FC = () => {
    return (
        <div className="container mx-auto px-6 pt-16 pb-24 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight">
                Transformez votre veille tech en<br />briefings qui travaillent pour vous
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
                Construisez les bulletins technologiques dont vous avez besoin sur la plateforme conçue pour la vitesse, la profondeur et l'insight. Aucune requête complexe nécessaire.
            </p>

            <div className="max-w-xl mx-auto relative mb-12">
                <div className="bg-white dark:bg-slate-800 rounded-full shadow-lg p-1.5 pl-5 flex items-center border border-slate-200 dark:border-slate-700">
                    <input
                        className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-0"
                        placeholder="Créez un rapport personnalisé sur les tendances IA..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Vous ne savez pas par où commencer ? Essayez un de ces domaines :</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <Link to={ROUTES.LOGIN.path} className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                        <span className="material-icons text-base">smart_toy</span> IA & GPT
                    </Link>
                    <Link to={ROUTES.LOGIN.path} className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-5 py-2.5 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                        <span className="material-icons text-base">code</span> Dev Tools
                    </Link>
                    <Link to={ROUTES.LOGIN.path} className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-5 py-2.5 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all shadow-sm">
                        <span className="material-icons text-base">cloud</span> SaaS
                    </Link>
                    <Link to={ROUTES.LOGIN.path} className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-5 py-2.5 rounded-full text-sm font-semibold text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white transition-all shadow-sm">
                        <span className="material-icons text-base">lock</span> Sécurité
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingHero;
