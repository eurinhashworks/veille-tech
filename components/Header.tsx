import React from 'react';
import { Sparkles, Search, Sun, HelpCircle, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  isLoading?: boolean;
  favoriteCount?: number;
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onMenuToggle?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoading, favoriteCount, currentTab, onNavigate, onMenuToggle }) => {
  const tabs = [
    { id: 'generator', label: 'Generator', icon: <Sun className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorites', icon: <Sun className="w-4 h-4" /> },
    { id: 'search', label: 'Search', icon: <Sun className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sun className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Sun className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-dark-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('generator')}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-ia flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TechPulse AI</h1>
              <p className="text-xs text-slate-400 -mt-1">Veille technologique</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${currentTab === tab.id 
                    ? 'bg-primary/20 text-primary border border-primary/30' 
                    : 'text-slate-400 hover:text-white hover:bg-dark-800'
                  }
                `}
              >
                <span className="hidden lg:inline">{tab.label}</span>
                {tab.icon}
                {tab.id === 'favorites' && favoriteCount > 0 && (
                  <span className="bg-yellow-500 text-yellow-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Search & User Actions */}
          <div className="flex items-center gap-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center">
              <div 
                className="flex items-center gap-2 bg-dark-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-white hover:border-primary transition-colors cursor-pointer"
                onClick={() => onNavigate('search')}
              >
                <Search className="w-4 h-4" />
                <span className="hidden lg:inline">Rechercher...</span>
                <kbd className="hidden lg:flex items-center gap-1 text-xs bg-dark-700 text-slate-500 px-1.5 py-1 rounded">
                  <span className="inline-flex items-center justify-center w-4 h-4 bg-slate-800 rounded">⌘</span>
                  <span>K</span>
                </kbd>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              {/* Loading indicator */}
              {isLoading && (
                <div className="w-6 h-6 border-2 border-slate-700 border-t-primary rounded-full animate-spin"></div>
              )}
              
              <button 
                onClick={() => onNavigate('settings')}
                className="p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => onNavigate('about')}
                className="p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={onMenuToggle}
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
