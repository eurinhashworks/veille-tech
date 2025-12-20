import React from 'react';
import { Star, Bot } from 'lucide-react';
import MarkdownViewer from '../components/MarkdownViewer';
import Export from './Export';
import { Review } from '../types';

interface ReviewDetailProps {
    review: Review;
    onBack: () => void;
    onCopy: () => void;
    copied: boolean;
    isFavorite: boolean;
    onFavoriteToggle: () => void;
    showExport: boolean;
    setShowExport: (show: boolean) => void;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
    review, onBack, onCopy, copied, isFavorite, onFavoriteToggle,
    showExport, setShowExport
}) => {
    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-primary transition-colors text-sm font-mono group"
                >
                    <span className="inline-block transition-transform group-hover:-translate-x-1 mr-2">←</span> Retour
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={onCopy}
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
                        onClick={onFavoriteToggle}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isFavorite ? 'bg-yellow-500 text-yellow-900' : 'bg-yellow-600 hover:bg-yellow-500 text-white'}`}
                    >
                        <Star className={`w-3 h-3 ${isFavorite ? 'fill-current' : ''}`} />
                        {isFavorite ? 'Favori ✓' : 'Favori'}
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

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-800">
                <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Date</span>
                    <span className="text-white font-mono text-sm">{review.metadata.formattedDate}</span>
                </div>
                <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Curateur</span>
                    <span className="text-white font-mono text-sm">{review.metadata.username}</span>
                </div>
                <div className="bg-dark-800 px-4 py-2 rounded-lg border border-slate-700 shadow-sm">
                    <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Dominante</span>
                    <span className={`font-bold text-sm text-${review.metadata.dominantCategory === 'IA' ? 'accent-ia' : 'primary'}`}>
                        {review.metadata.dominantCategory}
                    </span>
                </div>
            </div>

            {showExport && (
                <div className="mb-8">
                    <Export review={review} />
                </div>
            )}

            {review.metadata.aiAnalysis && (
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
                                "{review.metadata.aiAnalysis}"
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <article className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent-ia to-accent-sec"></div>

                <MarkdownViewer content={review.content} />

                {review.sources.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-slate-700/50 print:hidden">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Sources vérifiées</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {review.sources.map((source, idx) => (
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
                Généré par EUREKA • Contenu vérifié via Google Search Grounding
            </div>
        </div>
    );
};

export default ReviewDetail;
