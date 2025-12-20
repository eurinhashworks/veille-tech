import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Calendar, FolderOpen, BarChart3, Star, Clock, Search as SearchIcon } from 'lucide-react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import HistoryTable from './components/HistoryTable';
import Stats from './components/Stats';
import Search from './pages/Search';
import Settings from './pages/Settings';
import About from './pages/About';
import CalendarView from './pages/CalendarView';
import Favorites from './pages/Favorites';
import History from './pages/History';
import Generator from './pages/Generator';
import Landing from './pages/Landing';
import Login from './pages/Login';
import ReviewDetail from './pages/ReviewDetail';
import TechBackground from './components/TechBackground';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider, useToast } from './components/Toast';
import { ReviewSkeleton, TimelineSkeleton } from './components/Skeleton';
import { generateReviewWithLimitHandling } from './services/apiService';
import { Review, GenerationStatus } from './types';
import { useCurrentUser } from './hooks/useCurrentUser';
import { incrementDailyVisitors, incrementCurrentVisitors, decrementCurrentVisitors } from './services/visitorService';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Application State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showExport, setShowExport] = useState(false);

  // User state
  const { user, loading: userLoading } = useCurrentUser();

  // Generation Form State
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [username, setUsername] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // AI Settings
  const [aiStyle, setAiStyle] = useState<'analytical' | 'creative' | 'technical' | 'executive'>('analytical');
  const [aiTone, setAiTone] = useState<'formal' | 'casual' | 'humorous' | 'serious'>('formal');
  const [aiDepth, setAiDepth] = useState<'brief' | 'detailed' | 'comprehensive'>('detailed');
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      if (userLoading) return;
      try {
        await incrementDailyVisitors();
        await incrementCurrentVisitors();
        const { getAllReviews } = await import('./services/storageService');
        const dbReviews = await getAllReviews();
        setReviews(dbReviews);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };
    loadData();
    return () => {
      decrementCurrentVisitors();
    };
  }, [userLoading]);

  // Load AI Preferences
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
      const existing = await getReviewByDate(date);

      if (existing) {
        setTimeout(() => {
          setSelectedReview(existing);
          setStatus(GenerationStatus.SUCCESS);
          navigate(`/review/${existing.metadata.id}`);
        }, 800);
        return;
      }

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
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

      const newReview = await generateReviewWithLimitHandling(date, username || 'Anonyme', isPublic, {
        style: aiStyle,
        tone: aiTone,
        depth: aiDepth
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Finalisation...');

      await saveReview(newReview);

      const updatedReviews = await getAllReviews();
      setReviews(updatedReviews);
      setSelectedReview(newReview);
      setStatus(GenerationStatus.SUCCESS);
      setProgressMessage('Analyse terminée !');

      if (user) {
        const { addToFavorites } = await import('./services/storageService');
        try {
          await addToFavorites(user.id, newReview.metadata.id);
        } catch (favError) {
          console.warn('⚠️ Impossible d\'ajouter aux favoris:', favError);
        }
      }

      setTimeout(() => {
        setProgress(0);
        setProgressMessage('');
        showToast('Revue générée avec succès !', 'success');
        navigate(`/review/${newReview.metadata.id}`);
      }, 2000);
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setError(err.message || "Une erreur est survenue.");
      showToast(err.message || "Erreur lors de la génération", 'error');
      setProgress(0);
      setProgressMessage('');
    }
  };

  // Addition for favorites
  const [userFavorites, setUserFavorites] = useState<string[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) return;
      const { getUserFavorites } = await import('./services/storageService');
      const favs = await getUserFavorites(user.id);
      setUserFavorites(favs);
    };
    loadFavorites();
  }, [user]);

  const handleFavoriteToggle = async (review: Review) => {
    if (!user) return;
    const { getUserFavorites, addToFavorites, removeFromFavorites } = await import('./services/storageService');
    const isFav = userFavorites.includes(review.metadata.id);
    if (isFav) {
      await removeFromFavorites(user.id, review.metadata.id);
      showToast('Retiré des favoris');
    } else {
      await addToFavorites(user.id, review.metadata.id);
      showToast('Ajouté aux favoris', 'success');
    }
    const updatedFavs = await getUserFavorites(user.id);
    setUserFavorites(updatedFavs);
  };

  const handleCopy = (review: Review) => {
    const textToCopy = `L'AVIS DE CLARA L'IA :
${review.metadata.aiAnalysis}

-------------------

${review.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showToast('Copié dans le presse-papier !', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { path: '/', label: 'Générateur', icon: Sparkles },
    { path: '/search', label: 'Recherche', icon: SearchIcon },
    { path: '/timeline', label: 'Timeline', icon: Calendar },
    { path: '/calendar', label: 'Calendrier', icon: Calendar },
    { path: '/favorites', label: 'Favoris', icon: Star },
    { path: '/history', label: 'Historique', icon: Clock },
    { path: '/archives', label: 'Archives', icon: FolderOpen },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
  ];

  const renderNavTabs = () => (
    <div className="flex space-x-1 bg-dark-800/50 p-1 rounded-xl mb-8 border border-slate-700/50 backdrop-blur-sm overflow-x-auto scrollbar-hide">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${isActive ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}
          >
            <item.icon className="w-4 h-4" /> {item.label}
          </Link>
        );
      })}
    </div>
  );

  // Performance optimization: Memoize visibility checks
  const isAppShellHidden = useMemo(() =>
    location.pathname.match(/^\/($|login|about)/),
    [location.pathname]);

  const currentReviewId = useMemo(() =>
    location.pathname.startsWith('/review/') ? location.pathname.split('/').pop() : null,
    [location.pathname]);

  const currentReview = useMemo(() =>
    currentReviewId ? reviews.find(r => r.metadata.id === currentReviewId) : null,
    [currentReviewId, reviews]);

  // Scroll to top on route change for speed perception
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white flex flex-col">
      {!isAppShellHidden && <TechBackground />}
      {!isAppShellHidden && <Header />}

      <main className={`flex-grow ${isAppShellHidden ? '' : 'container mx-auto px-4 py-8 md:py-10 max-w-5xl'}`}>
        {!isAppShellHidden && !location.pathname.startsWith('/review/') && renderNavTabs()}

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }} // Reduced from 0.3 for snappier feel
          >
            <Routes location={location}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/generator"
                element={
                  <PageWrapper>
                    <Generator
                      date={date} setDate={setDate}
                      username={username} setUsername={setUsername}
                      isPublic={isPublic} setIsPublic={setIsPublic}
                      status={status} error={error}
                      progress={progress} progressMessage={progressMessage}
                      aiStyle={aiStyle} aiTone={aiTone} aiDepth={aiDepth}
                      showAiSettings={showAiSettings} setShowAiSettings={setShowAiSettings}
                      handleAiStyleChange={setAiStyle} handleAiToneChange={setAiTone} handleAiDepthChange={setAiDepth}
                      handleGenerate={handleGenerate}
                    />
                  </PageWrapper>
                } />
              <Route path="/timeline" element={<PageWrapper>{loading ? <TimelineSkeleton /> : <Timeline reviews={reviews} onSelectReview={(r) => navigate(`/review/${r.metadata.id}`)} />}</PageWrapper>} />
              <Route path="/archives" element={<PageWrapper>{loading ? <TimelineSkeleton /> : <HistoryTable reviews={reviews} onSelectReview={(r) => navigate(`/review/${r.metadata.id}`)} />}</PageWrapper>} />
              <Route path="/stats" element={<PageWrapper>{loading ? <TimelineSkeleton /> : <Stats reviews={reviews} />}</PageWrapper>} />
              <Route path="/search" element={<PageWrapper>{loading ? <TimelineSkeleton /> : <Search reviews={reviews} onSelectReview={(r) => navigate(`/review/${r.metadata.id}`)} />}</PageWrapper>} />
              <Route path="/calendar" element={<PageWrapper>{loading ? <TimelineSkeleton /> : <CalendarView reviews={reviews} onSelectReview={(r) => navigate(`/review/${r.metadata.id}`)} />}</PageWrapper>} />
              <Route path="/favorites" element={<PageWrapper>{loading ? <TimelineSkeleton /> : <Favorites reviews={reviews} onSelectReview={(r) => navigate(`/review/${r.metadata.id}`)} />}</PageWrapper>} />
              <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
              <Route path="/settings" element={<PageWrapper><Settings onClose={() => navigate('/')} /></PageWrapper>} />
              <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
              <Route path="/review/:id" element={
                loading ? (
                  <PageWrapper><ReviewSkeleton /></PageWrapper>
                ) : currentReview ? (
                  <PageWrapper>
                    <ReviewDetail
                      review={currentReview}
                      onBack={() => navigate(-1)}
                      onCopy={() => handleCopy(currentReview)}
                      copied={copied}
                      isFavorite={userFavorites.includes(currentReviewId!)}
                      onFavoriteToggle={() => handleFavoriteToggle(currentReview)}
                      showExport={showExport}
                      setShowExport={setShowExport}
                    />
                  </PageWrapper>
                ) : <Navigate to="/" />
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.15 }} // Reduced from 0.2
  >
    {children}
  </motion.div>
);

export default App;