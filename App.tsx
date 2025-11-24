import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, FolderOpen, BarChart3, Globe, Lock, Bot, Search as SearchIcon, Star, Settings as SettingsIcon, Info, Clock } from 'lucide-react';
import Header from './components/Header';
import Button from './components/Button';
import Spinner from './components/Spinner';
import MarkdownViewer from './components/MarkdownViewer';
import Timeline from './components/Timeline';
import HistoryTable from './components/HistoryTable';
import Stats from './components/Stats';
import Search from './pages/Search';
import Settings from './pages/Settings';
import About from './pages/About';
import CalendarView from './pages/CalendarView';
import Favorites from './pages/Favorites';
import Export from './pages/Export';
import History from './pages/History';
import { generateTechReview } from './services/geminiService';
import { Review, GenerationStatus, CategoryType } from './types';
import { useCurrentUser } from './hooks/useCurrentUser';
import { incrementDailyVisitors, incrementCurrentVisitors, decrementCurrentVisitors } from './services/visitorService';

type Tab = 'generator' | 'timeline' | 'table' | 'stats' | 'search' | 'calendar' | 'favorites' | 'history' | 'settings' | 'about';

const App: React.FC = () => {
  // Application State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<Tab>('generator');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showExport, setShowExport] = useState(false);
  
  // Utiliser le hook utilisateur pour obtenir l'utilisateur courant
  const { user, loading: userLoading } = useCurrentUser();

  // Generation Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [username, setUsername] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Paramètres d'IA personnalisés
  const [aiStyle, setAiStyle] = useState<'analytical' | 'creative' | 'technical' | 'executive'>('analytical');
  const [aiTone, setAiTone] = useState<'formal' | 'casual' | 'humorous' | 'serious'>('formal');
  const [aiDepth, setAiDepth] = useState<'brief' | 'detailed' | 'comprehensive'>('detailed');
  const [showAiSettings, setShowAiSettings] = useState(false);
  
  // État de progression
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');

  // Charger les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      // Attendre que l'utilisateur soit chargé
      if (userLoading) return;
      
      try {
        // Incrémenter les compteurs de visiteurs
        await incrementDailyVisitors();
        await incrementCurrentVisitors();
        
        // Utiliser le nouveau service de stockage avec Prisma
        const { getAllReviews } = await import('./services/storageService');
        
        // Charger les revues depuis la base de données
        const dbReviews = await getAllReviews();
        setReviews(dbReviews);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };
    
    loadData();
    
    // Décrémenter le compteur de visiteurs actuels lors du démontage du composant
    return () => {
      decrementCurrentVisitors();
    };
  }, [userLoading]);

  // Charger les préférences d'IA de l'utilisateur
  useEffect(() => {
    const loadAiPreferences = async () => {
      if (userLoading || !user) return;
      
      try {
        const { getAiPreferences } = await import('./services/storageService');
        const preferences = await getAiPreferences(user.id);
        
        if (preferences) {
          setAiStyle(preferences.style);
          setAiTone(preferences.tone);
          setAiDepth(preferences.depth);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des préférences IA:', error);
      }
    };
    
    loadAiPreferences();
  }, [user, userLoading]);

  const handleGenerate = async () => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setSelectedReview(null);
    setProgress(0);
    setProgressMessage('Initialisation de l\'analyse...');

    try {
      const { getReviewByDate, saveReview, getAllReviews } = await import('./services/storageService');
      
      // Vérifier si une revue existe déjà pour cette date
      const existing = await getReviewByDate(date);
      
      if (existing) {
        setTimeout(() => {
          setSelectedReview(existing);
          setStatus(GenerationStatus.SUCCESS);
        }, 800);
        return;
      }

      // Simuler la progression pendant la génération
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            // Messages de progression
            const messages = [
              'Recherche des actualités du jour...',
              'Analyse des tendances technologiques...',
              'Extraction des données pertinentes...',
              'Structuration du contenu...',
              'Génération de l\'analyse IA...',
              'Finalisation de la revue...'
            ];
            const messageIndex = Math.floor(prev / 15);
            setProgressMessage(messages[messageIndex] || messages[messages.length - 1]);
            return prev + Math.random() * 5;
          }
          return prev;
        });
      }, 500);

      // Générer la nouvelle revue avec les paramètres d'IA personnalisés
      const newReview = await generateTechReview(date, username || 'Anonyme', isPublic, {
        style: aiStyle,
        tone: aiTone,
        depth: aiDepth
      });
      
      // Arrêter la simulation de progression
      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Finalisation...');
      
      // Sauvegarder dans la base de données PostgreSQL via Prisma
      await saveReview(newReview);
      
      // Recharger toutes les revues depuis la base de données
      const updatedReviews = await getAllReviews();
      setReviews(updatedReviews);
      setSelectedReview(newReview);
      setStatus(GenerationStatus.SUCCESS);
      setProgressMessage('Analyse terminée !');
      
      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
      }, 2000);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "Une erreur est survenue.");
      setProgress(0);
      setProgressMessage('');
    }
  };

  // Sauvegarder les préférences d'IA lorsque l'utilisateur les modifie
  const handleAiStyleChange = (style: 'analytical' | 'creative' | 'technical' | 'executive') => {
    setAiStyle(style);
    if (user) {
      import('./services/storageService').then(({ saveAiPreferences }) => {
        saveAiPreferences(user.id, { style, tone: aiTone, depth: aiDepth });
      });
    }
  };

  const handleAiToneChange = (tone: 'formal' | 'casual' | 'humorous' | 'serious') => {
    setAiTone(tone);
    if (user) {
      import('./services/storageService').then(({ saveAiPreferences }) => {
        saveAiPreferences(user.id, { style: aiStyle, tone, depth: aiDepth });
      });
    }
  };

  const handleAiDepthChange = (depth: 'brief' | 'detailed' | 'comprehensive') => {
    setAiDepth(depth);
    if (user) {
      import('./services/storageService').then(({ saveAiPreferences }) => {
        saveAiPreferences(user.id, { style: aiStyle, tone: aiTone, depth });
      });
    }
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (selectedReview) {
      // We append the AI analysis to the copy text if desired, or keep it strict markdown.
      // Let's keep strict markdown as per previous request, but maybe add the analysis at the top?
      // User asked for "copy paste to word", so mixing the AI Analysis block (which is metadata) into the copy string might be good.
      const textToCopy = `L'AVIS DE CLARA L'IA :
${selectedReview.metadata.aiAnalysis}

-------------------

${selectedReview.content}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTabs = () => (
    <div className="flex space-x-1 bg-dark-800/50 p-1 rounded-xl mb-8 border border-slate-700/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
       <button 
         onClick={() => { setCurrentTab('generator'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'generator' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/550'}`}
       >
         <Sparkles className="w-4 h-4" /> Générateur
       </button>
       <button 
         onClick={() => { setCurrentTab('search'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'search' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <SearchIcon className="w-4 h-4" /> Recherche
       </button>
       <button 
         onClick={() => { setCurrentTab('timeline'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'timeline' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <Calendar className="w-4 h-4" /> Timeline
       </button>
       <button 
         onClick={() => { setCurrentTab('calendar'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'calendar' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <Calendar className="w-4 h-4" /> Calendrier
       </button>
       <button 
         onClick={() => { setCurrentTab('favorites'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'favorites' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <Star className="w-4 h-4" /> Favoris
       </button>
       <button 
         onClick={() => { setCurrentTab('history'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'history' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <Clock className="w-4 h-4" /> Historique
       </button>
       <button 
         onClick={() => { setCurrentTab('table'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'table' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <FolderOpen className="w-4 h-4" /> Archives
       </button>
       <button 
         onClick={() => { setCurrentTab('stats'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'stats' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
       >
         <BarChart3 className="w-4 h-4" /> Stats
       </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-dark-900 text-slate-200 selection:bg-primary/30">
      <Header 
        onSearchClick={() => setCurrentTab('search')}
        onSettingsClick={() => setCurrentTab('settings')}
        onAboutClick={() => setCurrentTab('about')}
      />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-10 max-w-5xl">
        
        {/* Navigation Tabs */}
        {!selectedReview && renderTabs()}

        {/* VIEW: GENERATOR */}
        {currentTab === 'generator' && !selectedReview && (
          <div className="animate-fade-in-up">
            <section className="text-center mb-12">
               <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
                Le futur de la<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-accent-ia">
                  Veille Technologique
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
                Générez, archivez et analysez l'actualité tech quotidienne avec la précision de l'IA. 
                <br />Une expérience de lecture fluide, prête à partager.
              </p>
            </section>

            <div className="bg-dark-800 border border-slate-700 rounded-2xl p-6 md:p-8 max-w-xl mx-auto shadow-2xl relative overflow-hidden group">
               {/* Background Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 -mr-16 -mt-16 transition-opacity opacity-75 group-hover:opacity-100"></div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Date de la revue</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-dark-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Votre pseudo (optionnel)</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Anonyme"
                    className="bg-dark-900 border border-slate-700 text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-3 placeholder-slate-600 transition-colors"
                  />
                </div>

                <div className="flex gap-4">
                  <label className={`flex-1 border ${isPublic ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 bg-dark-900 text-slate-500 hover:bg-dark-800'} rounded-lg p-3 cursor-pointer transition-all text-center text-sm font-medium flex items-center justify-center gap-2`}>
                    <input type="radio" checked={isPublic} onChange={() => setIsPublic(true)} className="hidden" />
                    <Globe className="w-4 h-4" /> Publique
                  </label>
                  <label className={`flex-1 border ${!isPublic ? 'border-primary bg-primary/10 text-primary' : 'border-slate-700 bg-dark-900 text-slate-500 hover:bg-dark-800'} rounded-lg p-3 cursor-pointer transition-all text-center text-sm font-medium flex items-center justify-center gap-2`}>
                    <input type="radio" checked={!isPublic} onChange={() => setIsPublic(false)} className="hidden" />
                    <Lock className="w-4 h-4" /> Privée
                  </label>
                </div>

                {/* Paramètres d'IA personnalisés */}
                <div className="border-t border-slate-700/50 pt-4">
                  <button 
                    onClick={() => setShowAiSettings(!showAiSettings)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm w-full"
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Personnaliser le style de l'IA
                    <span className="ml-auto">
                      {showAiSettings ? '▲' : '▼'}
                    </span>
                  </button>

                  {showAiSettings && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Style d'analyse</label>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { value: 'analytical', label: 'Analytique', desc: 'Approche factuelle et logique' },
                            { value: 'creative', label: 'Créatif', desc: 'Perspective originale et imaginative' },
                            { value: 'technical', label: 'Technique', desc: 'Détails techniques approfondis' },
                            { value: 'executive', label: 'Stratégique', desc: 'Focus sur l\'impact business' }
                          ] as const).map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleAiStyleChange(option.value)}
                              className={`p-3 rounded-lg text-left transition-all ${
                                aiStyle === option.value
                                  ? 'bg-primary/20 border border-primary text-white'
                                  : 'bg-dark-900 border border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs opacity-75 mt-1">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Ton de l'IA</label>
                        <div className="grid grid-cols-2 gap-2">
                          {([
                            { value: 'formal', label: 'Formel', desc: 'Langage professionnel' },
                            { value: 'casual', label: 'Décontracté', desc: 'Ton conversationnel' },
                            { value: 'humorous', label: 'Humoristique', desc: 'Avec touches d\'humour' },
                            { value: 'serious', label: 'Sérieux', desc: 'Ton direct et grave' }
                          ] as const).map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleAiToneChange(option.value)}
                              className={`p-3 rounded-lg text-left transition-all ${
                                aiTone === option.value
                                  ? 'bg-primary/20 border border-primary text-white'
                                  : 'bg-dark-900 border border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs opacity-75 mt-1">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Profondeur</label>
                        <div className="grid grid-cols-3 gap-2">
                          {([
                            { value: 'brief', label: 'Concis', desc: 'Essentiel uniquement' },
                            { value: 'detailed', label: 'Détaillé', desc: 'Bon équilibre' },
                            { value: 'comprehensive', label: 'Complet', desc: 'Analyse approfondie' }
                          ] as const).map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleAiDepthChange(option.value)}
                              className={`p-3 rounded-lg text-left transition-all ${
                                aiDepth === option.value
                                  ? 'bg-primary/20 border border-primary text-white'
                                  : 'bg-dark-900 border border-slate-700 text-slate-300 hover:border-slate-600'
                              }`}
                            >
                              <div className="font-medium text-sm">{option.label}</div>
                              <div className="text-xs opacity-75 mt-1">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Indicateur de progression */}
                {status === GenerationStatus.LOADING && (
                  <div className="bg-dark-900/50 border border-slate-700 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm font-medium">{progressMessage}</span>
                      <span className="text-primary font-mono text-sm">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-accent-ia h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-center">
                      <Spinner size="md" color="primary" />
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleGenerate} 
                  isLoading={status === GenerationStatus.LOADING}
                  disabled={status === GenerationStatus.LOADING}
                  className="w-full h-12 text-lg"
                >
                  {status === GenerationStatus.LOADING ? 'Analyse en cours...' : 'Générer la revue'}
                </Button>

                {status === GenerationStatus.ERROR && (
                  <div className="p-3 bg-red-900/20 border border-red-800 rounded text-red-300 text-sm text-center">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TIMELINE */}
        {currentTab === 'timeline' && !selectedReview && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-white pl-4 border-l-4 border-accent-ia">Fil d'actualité</h2>
            <Timeline reviews={reviews} onSelectReview={handleViewReview} />
          </div>
        )}

        {/* VIEW: TABLE */}
        {currentTab === 'table' && !selectedReview && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-6 text-white">Archives Globales</h2>
            <HistoryTable reviews={reviews} onSelectReview={handleViewReview} />
          </div>
        )}

        {/* VIEW: STATS */}
        {currentTab === 'stats' && !selectedReview && (
          <div className="animate-fade-in-up">
             <h2 className="text-2xl font-bold mb-6 text-white">Analytics</h2>
             <Stats reviews={reviews} />
          </div>
        )}

        {/* VIEW: SEARCH */}
        {currentTab === 'search' && !selectedReview && (
          <Search reviews={reviews} onSelectReview={handleViewReview} />
        )}

        {/* VIEW: CALENDAR */}
        {currentTab === 'calendar' && !selectedReview && (
          <CalendarView reviews={reviews} onSelectReview={handleViewReview} />
        )}

        {/* VIEW: FAVORITES */}
        {currentTab === 'favorites' && !selectedReview && (
          <Favorites reviews={reviews} onSelectReview={handleViewReview} />
        )}

        {/* VIEW: HISTORY */}
        {currentTab === 'history' && !selectedReview && (
          <History />
        )}

        {/* VIEW: SETTINGS */}
        {currentTab === 'settings' && !selectedReview && (
          <Settings onClose={() => setCurrentTab('generator')} />
        )}

        {/* VIEW: ABOUT */}
        {currentTab === 'about' && !selectedReview && (
          <About />
        )}

        {/* VIEW: SINGLE REVIEW (Detail) */}
        {selectedReview && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="flex items-center text-slate-400 hover:text-primary transition-colors text-sm font-mono group"
                >
                  <span className="inline-block transition-transform group-hover:-translate-x-1 mr-2">←</span> Retour
                </button>

                <div className="flex gap-3">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 transition-all"
                    >
                        {copied ? (
                            <span className="text-green-400 flex items-center gap-1">
                                ✓ Copié
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Copier texte
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={async () => {
                          if (!selectedReview) return;
                          const { getUserFavorites, addToFavorites, removeFromFavorites } = await import('./services/storageService');
                          if (!user) return;
                          const favs = await getUserFavorites(user.id);
                          const isFav = favs.includes(selectedReview.metadata.id);
                          if (isFav) {
                            await removeFromFavorites(user.id, selectedReview.metadata.id);
                          } else {
                            await addToFavorites(user.id, selectedReview.metadata.id);
                          }
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg text-xs font-medium transition-all"
                    >
                        <Star className="w-3 h-3" />
                        Favori
                    </button>
                    <button 
                        onClick={() => setShowExport(!showExport)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/80 text-white rounded-lg text-xs font-medium transition-all"
                    >
                        <Star className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* Meta Header */}
            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-800">
               <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Date</span>
                  <span className="text-white font-mono text-sm">{selectedReview.metadata.formattedDate}</span>
               </div>
               <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Curateur</span>
                  <span className="text-white font-mono text-sm">{selectedReview.metadata.username}</span>
               </div>
               <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Dominante</span>
                  <span className={`font-bold text-sm text-${selectedReview.metadata.dominantCategory === 'IA' ? 'accent-ia' : 'primary'}`}>
                    {selectedReview.metadata.dominantCategory}
                  </span>
               </div>
            </div>

            {/* Export Panel */}
            {showExport && selectedReview && (
              <div className="mb-8">
                <Export review={selectedReview} />
              </div>
            )}

            {/* AI Opinion Block */}
            {selectedReview.metadata.aiAnalysis && (
              <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-6 rounded-xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Bot className="w-24 h-24 text-white" />
                </div>
                <div className="relative z-10 flex gap-4">
                  <div className="hidden md:flex w-12 h-12 bg-indigo-500/20 rounded-full items-center justify-center shrink-0 border border-indigo-500/40">
                    <Bot className="w-6 h-6 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-indigo-300 font-bold text-lg mb-2 flex items-center gap-2">
                       <Bot className="w-5 h-5 md:hidden" /> L'avis de l'IA
                    </h3>
                    <p className="text-slate-200 italic leading-relaxed text-sm md:text-base font-medium">
                      "{selectedReview.metadata.aiAnalysis}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            <article className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent-ia to-accent-sec"></div>
               
               {/* Content Renderer */}
               <MarkdownViewer content={selectedReview.content} />
               
               {/* Sources */}
               {selectedReview.sources.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-700/50 print:hidden">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sources vérifiées</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedReview.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center p-2 rounded hover:bg-slate-700/50 transition-colors group border border-transparent hover:border-slate-700"
                      >
                        <div className="w-5 h-5 rounded bg-slate-700 text-slate-400 flex items-center justify-center text-[10px] mr-3 group-hover:bg-primary group-hover:text-white shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-blue-300 truncate">
                          {source.title}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <div className="mt-8 text-center text-slate-500 text-xs font-mono">
                Généré par TechPulse AI • Contenu vérifié via Google Search Grounding
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;