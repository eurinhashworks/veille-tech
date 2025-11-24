import React from 'react';
import { Zap, Search, Sun, HelpCircle, Settings } from 'lucide-react';

interface HeaderProps {
  onSearchClick?: () => void;
  onSettingsClick?: () => void;
  onAboutClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearchClick, onSettingsClick, onAboutClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-dark-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Zap className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-slate-100">
            Tech<span className="text-primary">Pulse</span>.ai
          </span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full cursor-pointer" onClick={onSearchClick}>
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
            onClick={onSearchClick}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            onClick={onSettingsClick}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={onAboutClick}
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
