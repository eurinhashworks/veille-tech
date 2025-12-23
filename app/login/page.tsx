"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation'; // Replaced useNavigate

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter(); // Replaced useNavigate

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'sign-in'
            });

            if (error) {
                setError(error.message || 'Failed to send OTP');
            } else {
                setStep('otp');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await authClient.signIn.emailOtp({
                email,
                otp
            });

            if (error) {
                setError(error.message || 'Invalid OTP');
            } else {
                router.push('/dashboard'); // Replaced navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-dark-800 border border-slate-700 p-8 rounded-2xl shadow-xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Bienvenue</h1>
                    <p className="text-slate-400">Connectez-vous à votre espace EUREKA</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="vous@exemple.com"
                                    className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                <>
                                    Envoyer le code <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Code de vérification</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    maxLength={6}
                                    className="w-full pl-10 pr-4 py-2 bg-dark-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-center tracking-widest text-xl"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2 text-center">Un code a été envoyé à {email}</p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Se connecter'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('email')}
                            className="w-full text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Retour
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;
