import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const LandingNav: React.FC = () => {
    return (
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="EUREKA Logo" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold tracking-tight dark:text-white">EUREKA</span>
            </div>

            <div className="hidden md:flex items-center gap-10">
                <Link href={ROUTES.LANDING.path} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition font-semibold">Accueil</Link>
                {/* Produit Dropdown */}
                <div className="relative group">
                    <div className="cursor-pointer flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition py-2">
                        Produit <span className="material-icons text-base group-hover:rotate-180 transition-transform">expand_more</span>
                    </div>
                    <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="space-y-4">
                            <Link href={ROUTES.LOGIN.path} className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><span className="material-icons text-sm">bolt</span></div>
                                <div>
                                    <div className="text-xs font-bold dark:text-white">Générateur IA</div>
                                    <p className="text-[10px] text-slate-500">Briefings instantanés par IA.</p>
                                </div>
                            </Link>
                            <Link href={ROUTES.LOGIN.path} className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><span className="material-icons text-sm">psychology</span></div>
                                <div>
                                    <div className="text-xs font-bold dark:text-white">Intelligence Adaptative</div>
                                    <p className="text-[10px] text-slate-500">Apprentissage de vos intérêts.</p>
                                </div>
                            </Link>
                            <Link href={ROUTES.LOGIN.path} className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><span className="material-icons text-sm">trending_up</span></div>
                                <div>
                                    <div className="text-xs font-bold dark:text-white">Analyse de Tendances</div>
                                    <p className="text-[10px] text-slate-500">Détection de signaux faibles.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Solutions Dropdown */}
                <div className="relative group">
                    <div className="cursor-pointer flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition py-2">
                        Solutions <span className="material-icons text-base group-hover:rotate-180 transition-transform">expand_more</span>
                    </div>
                    <div className="absolute top-full left-0 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                        <div className="space-y-4">
                            <Link href={ROUTES.LOGIN.path} className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500"><span className="material-icons text-sm">business_center</span></div>
                                <div>
                                    <div className="text-xs font-bold dark:text-white">CTOs & Tech Leads</div>
                                    <p className="text-[10px] text-slate-500">Vision stratégique 360°.</p>
                                </div>
                            </Link>
                            <Link href={ROUTES.LOGIN.path} className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition cursor-pointer">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500"><span className="material-icons text-sm">group</span></div>
                                <div>
                                    <div className="text-xs font-bold dark:text-white">Équipes R&D</div>
                                    <p className="text-[10px] text-slate-500">Intelligence collective partagée.</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <Link href={ROUTES.ABOUT.path} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition font-semibold">Entreprise</Link>
                <a href="/#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition">Tarifs</a>
                <a href="/#faq" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition">FAQ</a>
            </div>

            <div className="flex items-center gap-6">
                <Link href={ROUTES.LOGIN.path} className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-primary transition">
                    Se connecter
                </Link>
                <Link
                    className="bg-primary text-white font-bold px-6 py-3 rounded-full hover:brightness-105 transition shadow-lg shadow-primary/20 text-sm whitespace-nowrap"
                    href={ROUTES.LOGIN.path}
                >
                    Essayer GRATUITEMENT
                </Link>
            </div>
        </nav>
    );
};

export default LandingNav;
