"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send, User as UserIcon, MessageSquare } from 'lucide-react';
import { useToast } from './Toast';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        username: string;
        image?: string | null;
    };
}

interface CommentsSectionProps {
    reviewId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ reviewId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/comments?reviewId=${reviewId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to load comments');
        }
    };

    useEffect(() => {
        fetchComments();
    }, [reviewId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviewId, content: newComment })
            });

            if (!res.ok) throw new Error('Failed to post');

            const comment = await res.json();
            setComments(prev => [...prev, comment]); // Optimistic or real append
            setNewComment('');
            showToast('Commentaire ajouté', 'success');
        } catch (error) {
            showToast('Erreur lors de l\'envoi', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-400" />
                Discussion ({comments.length})
            </h3>

            {/* List */}
            <div className="space-y-6 mb-8">
                {comments.length === 0 ? (
                    <p className="text-slate-500 italic">Soyez le premier à commenter cette revue.</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 border border-slate-600 overflow-hidden relative">
                                {comment.user.image ? (
                                    <Image src={comment.user.image} alt={comment.user.username} fill className="object-cover" />
                                ) : (
                                    <UserIcon size={14} className="text-slate-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline justify-between">
                                    <span className="font-medium text-slate-300 text-sm">{comment.user.username || 'Utilisateur'}</span>
                                    <span className="text-xs text-slate-600">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Participez à la discussion..."
                    className="w-full bg-dark-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[80px] pr-12 resize-none"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Send size={16} />
                    )}
                </button>
            </form>
        </div>
    );
};

export default CommentsSection;
