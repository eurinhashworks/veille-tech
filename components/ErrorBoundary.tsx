import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
                    <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 p-8 rounded-2xl text-center shadow-2xl">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-500/10 mb-6">
                            <AlertTriangle className="w-8 h-8 text-rose-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Oops! Quelque chose a mal tourné</h1>
                        <p className="text-slate-400 mb-8 text-sm">
                            Une erreur inattendue est survenue dans l'application. Notre équipe a été notifiée.
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="bg-black/40 p-4 rounded-lg mb-8 text-xs text-rose-300 font-mono text-left overflow-auto max-h-40">
                                {this.state.error?.toString()}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-indigo-600/20"
                        >
                            <RefreshCcw className="w-4 h-4" />
                            Recharger la page
                        </button>
                    </div>
                </div>
            );
        }

        return (this as any).props.children;
    }
}
