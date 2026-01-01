'use client';

import { useState } from 'react';
import { KeyRound, Settings, Sun, Moon, Bell, User, Upload, Download, Lock } from 'lucide-react';

// Mock data and state
const user = {
  name: 'Utilisateur Anonyme',
  avatar: `https://api.dicebear.com/8.x/pixel-art/svg?seed=anonymous`,
};
const categories = ['Cloud', 'DevOps', 'IA', 'Web', 'Security', 'Mix'];
const languages = ['Français', 'Anglais'];
const tones = ['Professionnel', 'Décontracté', 'Technique'];

export default function SettingsPage() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(['IA', 'Web']);
  const [language, setLanguage] = useState(languages[0]);
  const [tone, setTone] = useState(tones[0]);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [username, setUsername] = useState(user.name);

  const handleCategoryChange = (category: string) => {
    setFavoriteCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Paramètres</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column for sections */}
        <div className="md:col-span-1">
          <nav className="space-y-2">
            <a href="#api" className="flex items-center gap-3 p-3 rounded-lg bg-dark-800 text-white">
              <KeyRound className="w-5 h-5 text-primary" />
              <span>Clé API Gemini</span>
            </a>
            <a href="#preferences" className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 text-slate-300">
              <Settings className="w-5 h-5" />
              <span>Préférences</span>
            </a>
            <a href="#profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 text-slate-300">
              <User className="w-5 h-5" />
              <span>Profil</span>
            </a>
            <a href="#data" className="flex items-center gap-3 p-3 rounded-lg hover:bg-dark-800 text-slate-300">
              <Upload className="w-5 h-5" />
              <span>Données</span>
            </a>
          </nav>
        </div>

        {/* Right column for content */}
        <div className="md:col-span-2 space-y-12">
          {/* API Section */}
          <section id="api">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-3"><KeyRound className="w-6 h-6 text-primary" />Clé API Gemini</h2>
            <div className="p-6 bg-dark-800 border border-slate-700 rounded-lg">
                <label htmlFor="gemini-api-key" className="block text-sm font-medium text-slate-300 mb-2">Votre clé API</label>
                <input
                    id="gemini-api-key"
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="block w-full p-3 text-sm text-slate-200 border border-slate-600 rounded-lg bg-dark-900 focus:ring-primary focus:border-primary placeholder-slate-500"
                    placeholder="Collez votre clé API Google Gemini ici"
                />
                <p className="mt-2 text-xs text-slate-500">Votre clé est stockée localement et n'est jamais partagée.</p>
            </div>
          </section>

          {/* Preferences Section */}
          <section id="preferences">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-3"><Settings className="w-6 h-6" />Préférences de Génération</h2>
            <div className="p-6 bg-dark-800 border border-slate-700 rounded-lg space-y-6">
              <div>
                <h3 className="text-md font-medium text-slate-300 mb-3">Catégories favorites</h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <button key={category} onClick={() => handleCategoryChange(category)} className={`px-4 py-2 text-sm rounded-full border transition-colors ${favoriteCategories.includes(category) ? 'bg-primary border-primary text-white' : 'bg-dark-900 border-slate-600 hover:bg-slate-700 text-slate-300'}`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-2">Langue</label>
                  <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="block w-full p-3 text-sm text-slate-200 border border-slate-600 rounded-lg bg-dark-900 focus:ring-primary focus:border-primary">
                    {languages.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-2">Ton</label>
                  <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className="block w-full p-3 text-sm text-slate-200 border border-slate-600 rounded-lg bg-dark-900 focus:ring-primary focus:border-primary">
                    {tones.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Profile Section */}
          <section id="profile">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-3"><User className="w-6 h-6" />Profil et Apparence</h2>
             <div className="p-6 bg-dark-800 border border-slate-700 rounded-lg space-y-6">
                <div className="flex items-center gap-4">
                  <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-primary"/>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Nom d'utilisateur</label>
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="text-lg font-semibold bg-transparent text-white focus:outline-none"/>
                  </div>
                </div>
                <div>
                    <h3 className="text-md font-medium text-slate-300 mb-3">Thème</h3>
                    <div className="flex gap-4">
                        <button onClick={() => setTheme('light')} className={`flex items-center justify-center w-full p-4 rounded-lg border-2 ${theme === 'light' ? 'border-primary' : 'border-slate-600'}`}>
                            <Sun className="w-6 h-6 mr-2"/> Clair
                        </button>
                        <button onClick={() => setTheme('dark')} className={`flex items-center justify-center w-full p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-primary' : 'border-slate-600'}`}>
                            <Moon className="w-6 h-6 mr-2"/> Sombre
                        </button>
                    </div>
                </div>
             </div>
          </section>
          
          {/* Data Section */}
          <section id="data">
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-3"><Upload className="w-6 h-6" />Gestion des données</h2>
            <div className="p-6 bg-dark-800 border border-slate-700 rounded-lg flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-3 w-full p-4 rounded-lg bg-dark-900 border border-slate-600 hover:bg-slate-700 transition-colors">
                    <Download className="w-5 h-5" />
                    Exporter mes données (.json)
                </button>
                <button className="flex items-center justify-center gap-3 w-full p-4 rounded-lg bg-dark-900 border border-slate-600 hover:bg-slate-700 transition-colors">
                    <Upload className="w-5 h-5" />
                    Importer des données (.json)
                </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}