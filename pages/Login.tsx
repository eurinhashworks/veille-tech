import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="h-screen overflow-hidden flex bg-white dark:bg-dark-950 font-sans">
            {/* Left Panel - Auth */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-12 lg:p-20 relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-20 cursor-pointer" onClick={() => navigate('/')}>
                    <img src="/logo.png" alt="EUREKA Logo" className="w-10 h-10 object-contain" />
                    <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">EUREKA</span>
                </div>

                <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                        Accédez à votre veille
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-10">
                        Gérez vos rapports personnalisés et découvrez les dernières tendances tech.
                    </p>

                    {/* Google Button */}
                    <button
                        onClick={() => navigate('/generator')}
                        className="flex items-center justify-center gap-4 w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 py-4 rounded-xl font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                        Se connecter avec Google
                    </button>

                    <p className="mt-8 text-center text-[10px] text-slate-400 leading-relaxed">
                        Connexion sécurisée. Nous ne publierons jamais rien sans votre accord.<br />
                        En continuant, vous acceptez nos <a href="#" className="underline">CGU</a> et notre <a href="#" className="underline">Confidentialité</a>.
                    </p>
                </div>

                {/* Footer links for mobile */}
                <div className="mt-auto pt-10 flex gap-6 text-[10px] text-slate-400 lg:hidden">
                    <a href="#">CGU</a>
                    <a href="#">Confidentialité</a>
                    <a href="#">Support</a>
                </div>
            </div>

            {/* Right Panel - Branding/Mockup */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#f8fafc] to-[#e0f2fe] dark:from-[#0f172a] dark:to-[#021a2f] relative overflow-hidden items-center justify-center p-20">
                {/* Background decorative elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>

                {/* Faint UI icons in background */}
                <div className="absolute top-1/4 left-1/4 opacity-10 dark:opacity-5 transform -rotate-12">
                    <span className="material-icons text-8xl">radar</span>
                </div>
                <div className="absolute bottom-1/4 right-1/4 opacity-10 dark:opacity-5 transform rotate-12">
                    <span className="material-icons text-8xl">lightbulb</span>
                </div>

                {/* Main Mockup */}
                <div className="relative z-10 w-full max-w-xl">
                    <div className="bg-white/30 dark:bg-white/5 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-white/40">
                        <img
                            src="/eureka_dashboard_mockup.png"
                            alt="EUREKA Dashboard Mockup"
                            className="w-full h-auto rounded-2xl shadow-inner"
                        />
                    </div>

                    {/* Floating Value Props */}
                    <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-float">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                <span className="material-icons text-sm font-bold">trending_up</span>
                            </div>
                            <span className="text-xs font-bold dark:text-white">+24% Pertinence IA</span>
                        </div>
                        <p className="text-[10px] text-slate-500">ML-Powered insights</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
