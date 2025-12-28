import React from 'react';
import { Sparkles, Globe, Lock, Settings as SettingsIcon } from 'lucide-react';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import { GenerationStatus } from '../types';

interface GeneratorProps {
    date: string;
    setDate: (date: string) => void;
    username: string;
    setUsername: (username: string) => void;
    isPublic: boolean;
    setIsPublic: (isPublic: boolean) => void;
    status: GenerationStatus;
    error: string | null;
    progress: number;
    progressMessage: string;
    aiStyle: string;
    aiTone: string;
    aiDepth: string;
    showAiSettings: boolean;
    setShowAiSettings: (show: boolean) => void;
    handleAiStyleChange: (style: any) => void;
    handleAiToneChange: (tone: any) => void;
    handleAiDepthChange: (depth: any) => void;
    handleGenerate: () => void;
}

const Generator: React.FC<GeneratorProps> = ({
    date, setDate, username, setUsername, isPublic, setIsPublic,
    status, error, progress, progressMessage,
    aiStyle, aiTone, aiDepth, showAiSettings, setShowAiSettings,
    handleAiStyleChange, handleAiToneChange, handleAiDepthChange,
    handleGenerate
}) => {
    return (
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
                                                className={`p-3 rounded-lg text-left transition-all ${aiStyle === option.value
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
                                                className={`p-3 rounded-lg text-left transition-all ${aiTone === option.value
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
                                                className={`p-3 rounded-lg text-left transition-all ${aiDepth === option.value
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
    );
};

export default Generator;
