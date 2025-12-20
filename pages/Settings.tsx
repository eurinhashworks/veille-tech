import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Palette, Bell, User, Download, Upload, Shield, Save } from 'lucide-react';
import Button from '../components/Button';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [username, setUsername] = useState(localStorage.getItem('default_username') || '');
  const [autoGenerate, setAutoGenerate] = useState(localStorage.getItem('auto_generate') === 'true');
  const [notifications, setNotifications] = useState(localStorage.getItem('notifications') === 'true');
  const [defaultVisibility, setDefaultVisibility] = useState(localStorage.getItem('default_visibility') || 'public');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    localStorage.setItem('theme', theme);
    localStorage.setItem('default_username', username);
    localStorage.setItem('auto_generate', autoGenerate.toString());
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('default_visibility', defaultVisibility);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    const { exportAllData } = await import('../services/storageService');
    const data = await exportAllData();

    const exportData = {
      ...data,
      settings: {
        username,
        theme,
        autoGenerate,
        notifications,
        defaultVisibility
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eureka-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Importer les données
        const { importData } = await import('../services/storageService');
        await importData(data);

        // Importer les paramètres
        if (data.settings) {
          setUsername(data.settings.username || '');
          setTheme(data.settings.theme || 'dark');
          setAutoGenerate(data.settings.autoGenerate || false);
          setNotifications(data.settings.notifications || false);
          setDefaultVisibility(data.settings.defaultVisibility || 'public');
        }
        alert('Données importées avec succès!');
        window.location.reload(); // Recharger pour afficher les nouvelles données
      } catch (err) {
        alert('Erreur lors de l\'importation du fichier');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">Paramètres</h1>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* API Configuration */}
        <section className="bg-dark-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">Configuration API</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Clé API Google Gemini (Optionnelle)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza... (utilisée uniquement si la limite de l'API principale est atteinte)"
                className="bg-dark-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-slate-600"
              />
              <p className="text-xs text-slate-500 mt-2">
                Obtenez votre clé sur{' '}
                <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Google AI Studio
                </a>. Cette clé sera utilisée uniquement si la limite de l'API principale est atteinte.
              </p>
            </div>
          </div>
        </section>

        {/* User Profile */}
        <section className="bg-dark-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">Profil Utilisateur</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Pseudo par défaut
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre pseudo"
                className="bg-dark-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Visibilité par défaut
              </label>
              <div className="flex gap-4">
                <label className={`flex-1 border ${defaultVisibility === 'public' ? 'border-primary bg-primary/10' : 'border-slate-700'} rounded-lg p-3 cursor-pointer transition-all`}>
                  <input
                    type="radio"
                    checked={defaultVisibility === 'public'}
                    onChange={() => setDefaultVisibility('public')}
                    className="hidden"
                  />
                  <span className={defaultVisibility === 'public' ? 'text-primary font-medium' : 'text-slate-400'}>
                    Publique
                  </span>
                </label>
                <label className={`flex-1 border ${defaultVisibility === 'private' ? 'border-primary bg-primary/10' : 'border-slate-700'} rounded-lg p-3 cursor-not-allowed transition-all relative opacity-50`}>
                  <input
                    type="radio"
                    checked={defaultVisibility === 'private'}
                    onChange={() => setDefaultVisibility('private')}
                    className="hidden"
                    disabled
                  />
                  <span className={defaultVisibility === 'private' ? 'text-primary font-medium' : 'text-slate-400'}>
                    Privée
                  </span>
                  <span className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    BIENTÔT
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="bg-dark-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">Apparence</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Thème
              </label>
              <div className="flex gap-4">
                <label className={`flex-1 border ${theme === 'dark' ? 'border-primary bg-primary/10' : 'border-slate-700'} rounded-lg p-3 cursor-pointer transition-all`}>
                  <input
                    type="radio"
                    checked={theme === 'dark'}
                    onChange={() => setTheme('dark')}
                    className="hidden"
                  />
                  <span className={theme === 'dark' ? 'text-primary font-medium' : 'text-slate-400'}>
                    Sombre
                  </span>
                </label>
                <label className={`flex-1 border ${theme === 'light' ? 'border-primary bg-primary/10' : 'border-slate-700'} rounded-lg p-3 cursor-pointer transition-all`}>
                  <input
                    type="radio"
                    checked={theme === 'light'}
                    onChange={() => setTheme('light')}
                    className="hidden"
                  />
                  <span className={theme === 'light' ? 'text-primary font-medium' : 'text-slate-400'}>
                    Clair
                  </span>
                </label>
                <label className={`flex-1 border ${theme === 'auto' ? 'border-primary bg-primary/10' : 'border-slate-700'} rounded-lg p-3 cursor-pointer transition-all`}>
                  <input
                    type="radio"
                    checked={theme === 'auto'}
                    onChange={() => setTheme('auto')}
                    className="hidden"
                  />
                  <span className={theme === 'auto' ? 'text-primary font-medium' : 'text-slate-400'}>
                    Auto
                  </span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-dark-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-300">Activer les notifications</p>
                <p className="text-xs text-slate-500">Recevoir des rappels quotidiens</p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 text-primary bg-dark-900 border-slate-700 rounded focus:ring-primary"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-300">Génération automatique</p>
                <p className="text-xs text-slate-500">Générer une revue chaque jour à 9h</p>
              </div>
              <input
                type="checkbox"
                checked={autoGenerate}
                onChange={(e) => setAutoGenerate(e.target.checked)}
                className="w-5 h-5 text-primary bg-dark-900 border-slate-700 rounded focus:ring-primary"
              />
            </label>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-dark-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-white">Gestion des Données</h2>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleExport}
                variant="secondary"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exporter les données
              </Button>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="file-import"
                />
                <Button
                  variant="secondary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => (document.getElementById('file-import') as HTMLInputElement)?.click()}
                >
                  <Upload className="w-4 h-4" />
                  Importer les données
                </Button>
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Sauvegardez vos revues et paramètres en format JSON
            </p>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Paramètres sauvegardés !' : 'Sauvegarder les paramètres'}
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="px-8"
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
