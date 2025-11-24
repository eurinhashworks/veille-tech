import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, FolderOpen, BarChart3, Globe, Lock, Bot, Search as SearchIcon, Star, Settings as SettingsIcon, Info } from 'lucide-react';
import Header from './components/Header';
import Button from './components/Button';
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
import { generateTechReview } from './services/geminiService';
import { Review, GenerationStatus, CategoryType } from './types';

// Mock Data for initial population to make the UI look alive
const MOCK_REVIEWS: Review[] = [
  {
    metadata: {
      id: 'mock-1',
      date: '2025-08-08',
      formattedDate: 'Vendredi 08 août 2025',
      username: 'Eurin',
      timestamp: 1754636400000,
      generationTime: 2.8,
      tags: ['Cloud', 'Kubernetes', 'AWS'],
      dominantCategory: 'Cloud',
      newsCount: 27,
      flashSummary: 'AWS lance une nouvelle instance Graviton4 et Kubernetes 1.31 sort en beta.',
      aiAnalysis: "Mon analyse : La course à l'armement entre AWS et Azure ne se joue plus sur le prix, mais sur l'efficacité énergétique des puces custom. Kubernetes devient invisible, ce qui est son destin final.",
      isPublic: true
    },
    content: "# Revue Tech — 08 Août 2025\n> L'innovation n'est pas une destination, c'est un état d'esprit permanent.\n\n### Résumé Flash\nUne journée marquée par l'avancée des processeurs ARM chez AWS et une adoption massive de Kubernetes en Edge Computing.\n\n## [CLOUD] Cloud Computing\n* **AWS Graviton4** : Amazon annonce la disponibilité générale de ses nouvelles instances, promettant 30% de perf en plus.\n* **Azure Arc Updates** : Microsoft facilite la gestion hybride avec de nouveaux contrôles de sécurité unifiés.\n* **Google Cloud Next** : Les rumeurs enflent sur une nouvelle offre de TPU v6 pour l'IA générative.\n\n## [DEVOPS] DevOps & Platform Engineering\n* **Kubernetes 1.31 Beta** : La nouvelle version met l'accent sur la sécurité des sidecars et le support natif de WASM.\n* **Terraform** : HashiCorp introduit de nouvelles politiques de gestion des états pour les grandes équipes.\n\n## [SECURITY] Cybersécurité\n* **Faille Zero-Day** : Une vulnérabilité critique dans certains routeurs Cisco nécessite un patch immédiat.\n* **Ransomware** : Le groupe LockBit revendique une nouvelle attaque sur un grand groupe logistique.\n\n## [IA] IA & Innovation\n* **Model Collapse** : Une étude montre les risques de l'entraînement d'IA sur des données générées par IA.\n* **Mistral Large 2** : Le modèle français continue d'impressionner par ses capacités de raisonnement multilingue.\n\n## Impact\n* **Pour les développeurs** : Migrer vers ARM devient incontournable pour optimiser les coûts cloud. Kubernetes 1.31 nécessite une revue des configurations de sécurité.\n* **Pour les entreprises** : L'efficacité énergétique des infrastructures devient un critère de choix stratégique face à la hausse des coûts.\n* **Pour l'écosystème tech** : La consolidation autour de quelques acteurs cloud majeurs s'accélère, réduisant la diversité du marché.",
    sources: []
  },
  {
    metadata: {
      id: 'mock-2',
      date: '2025-08-07',
      formattedDate: 'Jeudi 07 août 2025',
      username: 'Anonyme',
      timestamp: 1754550000000,
      generationTime: 3.1,
      tags: ['ZeroTrust', 'CrowdStrike', 'CVE'],
      dominantCategory: 'Security',
      newsCount: 24,
      flashSummary: 'Faille critique détectée dans OpenSSH, correctif urgent déployé.',
      aiAnalysis: "Mon avis : Nous assistons à une fragilisation systémique. La dépendance à quelques librairies open-source critiques reste le talon d'Achille de toute l'industrie numérique.",
      isPublic: true
    },
    content: "# Revue Tech — 07 Août 2025\n> La sécurité est un processus, pas un produit.\n\n## [SECURITY] Cybersécurité\n* **OpenSSH Critical** : La faille 'RegreSSHion' touche des millions de serveurs Linux. Patching impératif.\n* **CrowdStrike Analysis** : Retour sur l'incident mondial, l'entreprise publie un post-mortem détaillé.\n\n## [WEB] Web & Mobile Dev\n* **React 19 RC** : La Release Candidate est disponible, introduisant le compilateur automatique.\n* **iOS 19 Beta** : Apple ouvre les APIs de son Neural Engine aux développeurs tiers.\n\n## Impact\n* **Pour les développeurs** : Patcher OpenSSH en urgence sur tous les serveurs. Tester React 19 RC pour anticiper la migration.\n* **Pour les entreprises** : Revoir les processus de gestion des dépendances critiques et mettre en place des audits de sécurité réguliers.\n* **Pour l'écosystème tech** : La fragilité des composants open-source essentiels soulève des questions sur la gouvernance et le financement.",
    sources: []
  },
  {
    metadata: {
      id: 'mock-3',
      date: '2025-08-06',
      formattedDate: 'Mercredi 06 août 2025',
      username: 'Clara IA',
      timestamp: 1754463600000,
      generationTime: 2.7,
      tags: ['GPT-5', 'NVIDIA', 'LLM'],
      dominantCategory: 'IA',
      newsCount: 29,
      flashSummary: 'NVIDIA dévoile sa puce B200 et OpenAI tease GPT-5 pour l\'automne.',
      aiAnalysis: "Mon analyse : La loi de Moore est morte, vive la loi de Huang. Si NVIDIA continue à ce rythme, le hardware dictera le software pour la prochaine décennie.",
      isPublic: true
    },
    content: "# Revue Tech — 06 Août 2025\n> L'intelligence artificielle est le nouveau code binaire de notre réalité.\n\n## [IA] IA & Innovation\n* **NVIDIA Blackwell** : La nouvelle architecture GPU promet de réduire les coûts d'inférence par 25.\n* **OpenAI** : Sam Altman évoque une 'intelligence de niveau doctorat' pour les prochains modèles.\n* **AI Act** : L'Europe finalise les directives d'application pour les modèles open-source.\n\n## Impact\n* **Pour les développeurs** : Les nouveaux GPU Blackwell vont démocratiser l'accès aux modèles d'IA avancés. Préparer l'intégration de modèles plus puissants.\n* **Pour les entreprises** : L'AI Act européen impose de nouvelles contraintes de conformité. Anticiper les audits et la documentation des modèles.\n* **Pour l'écosystème tech** : La domination de NVIDIA sur le hardware IA crée une dépendance stratégique majeure pour toute l'industrie.",
    sources: []
  }
];

type Tab = 'generator' | 'timeline' | 'table' | 'stats' | 'search' | 'calendar' | 'favorites' | 'settings' | 'about';

const App: React.FC = () => {
  // Application State
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [currentTab, setCurrentTab] = useState<Tab>('generator');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showExport, setShowExport] = useState(false);

  // Generation Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [username, setUsername] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setSelectedReview(null);

    try {
      const existing = reviews.find(r => r.metadata.date === date);
      
      if (existing) {
        setTimeout(() => {
          setSelectedReview(existing);
          setStatus(GenerationStatus.SUCCESS);
        }, 800);
        return;
      }

      const newReview = await generateTechReview(date, username, isPublic);
      
      setReviews(prev => [newReview, ...prev]);
      setSelectedReview(newReview);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "Une erreur est survenue.");
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
      const textToCopy = `L'AVIS DE L'IA :\n${selectedReview.metadata.aiAnalysis}\n\n-------------------\n\n${selectedReview.content}`;
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderTabs = () => (
    <div className="flex space-x-1 bg-dark-800/50 p-1 rounded-xl mb-8 border border-slate-700/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
       <button 
         onClick={() => { setCurrentTab('generator'); setSelectedReview(null); }}
         className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${currentTab === 'generator' && !selectedReview ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
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

                 <Button 
                    onClick={handleGenerate} 
                    isLoading={status === GenerationStatus.LOADING}
                    className="w-full h-12 text-lg"
                 >
                    {status === GenerationStatus.LOADING ? 'Analyse de l\'actualité...' : 'Générer la revue'}
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