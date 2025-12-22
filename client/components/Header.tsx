import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, HelpCircle, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import { ROUTES } from '../routes';

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-dark-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center">
          {/* Simple Sidebar Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? "Développer le menu" : "Réduire le menu"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-6 h-6" />
            ) : (
              <ChevronLeft className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full cursor-pointer" onClick={() => navigate(ROUTES.SEARCH.path)}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <input
              type="text"
              readOnly
              className="block w-full p-2 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary placeholder-slate-500 cursor-pointer"
              placeholder="Rechercher une revue (JJ/MM/AAAA)..."
            />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.SEARCH.path)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <NotificationCenter />

          <button
            onClick={() => navigate(ROUTES.SETTINGS.path)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(ROUTES.HELP.path)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
