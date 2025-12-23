import { Home, Search, Settings, HelpCircle, LogIn, LayoutDashboard, Bell, FileText } from 'lucide-react';

export const ROUTES = {
    HOME: { path: '/', label: 'Accueil', icon: Home },
    SEARCH: { path: '/search', label: 'Recherche', icon: Search },
    SETTINGS: { path: '/settings', label: 'Paramètres', icon: Settings },
    HELP: { path: '/help', label: 'Aide', icon: HelpCircle },
    LOGIN: { path: '/login', label: 'Connexion', icon: LogIn },
    DASHBOARD: { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    LANDING: { path: '/', label: 'Accueil', icon: Home },
    ABOUT: { path: '/about', label: 'À propos', icon: HelpCircle },
};

export const SIDEBAR_ROUTES = [
    { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { path: '/search', label: 'Recherche', icon: Search },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/documents', label: 'Documents', icon: FileText },
];
