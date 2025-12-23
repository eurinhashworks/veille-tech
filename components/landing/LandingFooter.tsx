import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const LandingFooter: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-background-dark pt-20 pb-10 border-t border-slate-100 dark:border-slate-800 relative z-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16 text-slate-900 dark:text-slate-100">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/logo.png" alt="EUREKA Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold tracking-tight dark:text-white">EUREKA</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            EUREKA transforme le bruit numérique en intelligence stratégique. La plateforme ultime pour les leaders tech qui veulent maîtriser leur domaine sans y passer la journée.
                        </p>
                        <div className="flex gap-4">
                            <a className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition" href="#"><i className="material-icons text-xl">close</i></a>
                            <a className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition" href="#"><i className="material-icons text-xl">discord</i></a>
                            <a className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition" href="#"><i className="material-icons text-xl">work</i></a>
                            <a className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition" href="#"><i className="material-icons text-xl">smart_display</i></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-sm tracking-wider uppercase text-slate-900 dark:text-white">Société</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><Link className="hover:text-primary transition" href={ROUTES.ABOUT.path}>Entreprise</Link></li>
                            <li><a className="hover:text-primary transition" href="#">Programme Affiliation</a></li>
                            <li><a className="hover:text-primary transition" href="#">Carrières</a></li>
                            <li><a className="hover:text-primary transition" href="#">Presse</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Produit</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><a className="hover:text-primary transition" href="#">Générateur IA</a></li>
                            <li><a className="hover:text-primary transition" href="#">Trends ML</a></li>
                            <li><a className="hover:text-primary transition" href="#">Timeline adaptive</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Solutions</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li><a className="hover:text-primary transition" href="#">CTOs & Tech Leads</a></li>
                            <li><a className="hover:text-primary transition" href="#">Équipes R&D</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-bold mb-6 text-sm tracking-wider uppercase text-slate-900 dark:text-white">Légal</h4>
                        <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <li><a className="hover:text-primary transition" href="#">Confidentialité</a></li>
                            <li><a className="hover:text-primary transition" href="#">Conditions</a></li>
                            <li><a className="hover:text-primary transition" href="#">Sécurité</a></li>
                            <li><a className="hover:text-primary transition" href="#">Abus</a></li>
                            <li><a className="hover:text-primary transition" href="#">RGPD</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                    <p className="text-sm text-slate-400">© 2024 EUREKA. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
