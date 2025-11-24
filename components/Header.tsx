import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-dark-900/90 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-slate-100">
            Tech<span className="text-primary">Pulse</span>.ai
          </span>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="text" className="block w-full p-2 pl-10 text-sm text-slate-200 border border-slate-700 rounded-lg bg-dark-800 focus:ring-primary focus:border-primary placeholder-slate-500" placeholder="Rechercher une revue (JJ/MM/AAAA)..." />
            </div>
        </div>

        <nav className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 cursor-pointer hover:bg-slate-600 transition-colors">
            ?
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
