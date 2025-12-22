export type RouteLayout = 'app' | 'marketing' | 'auth' | 'none';

export interface RouteConfig {
    path: string;
    label: string;
    layout: RouteLayout;
    showInSidebar?: boolean;
    isProtected?: boolean;
}

// Named routes for type-safe access throughout the app
export const ROUTES = {
    LANDING: { path: '/', label: 'Accueil', layout: 'marketing' } as RouteConfig,
    LOGIN: { path: '/login', label: 'Connexion', layout: 'auth' } as RouteConfig,
    DASHBOARD: { path: '/dashboard', label: 'Command Center', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    GENERATOR: { path: '/generator', label: 'Générateur', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    TIMELINE: { path: '/timeline', label: 'Timeline', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    SEARCH: { path: '/search', label: 'Recherche', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    CALENDAR: { path: '/calendar', label: 'Calendrier', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    FAVORITES: { path: '/favorites', label: 'Favoris', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    HISTORY: { path: '/history', label: 'Historique', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    ARCHIVES: { path: '/archives', label: 'Archives', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    STATS: { path: '/stats', label: 'Statistiques', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    INTELLIGENCE: { path: '/intelligence', label: 'IA Intelligence', layout: 'app', showInSidebar: true, isProtected: true } as RouteConfig,
    HELP: { path: '/help', label: 'Aide', layout: 'app', showInSidebar: true } as RouteConfig,
    SETTINGS: { path: '/settings', label: 'Paramètres', layout: 'app', isProtected: true } as RouteConfig,
    ABOUT: { path: '/about', label: 'À propos', layout: 'marketing' } as RouteConfig,
    REVIEW_DETAIL: { path: '/review/:id', label: 'Détail Revue', layout: 'app', isProtected: true } as RouteConfig,
};

// Array for React Router mapping
export const ROUTES_LIST = Object.values(ROUTES);

// Sidebar items specifically
export const SIDEBAR_ROUTES = ROUTES_LIST.filter(route => route.showInSidebar);

// Path builders for dynamic routing
export const pathBuilders = {
    review: (id: string) => `/review/${id}`,
};

// Utils
export const getRouteByPath = (path: string) => ROUTES_LIST.find(r => r.path === path);
export const isAppLayout = (path: string) => {
    // Exact match or dynamic match
    const route = ROUTES_LIST.find(r => {
        if (r.path.includes(':')) {
            const base = r.path.split('/:')[0];
            return path.startsWith(base);
        }
        return r.path === path;
    });
    return route?.layout === 'app';
};
