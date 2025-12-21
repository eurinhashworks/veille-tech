import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';

interface Notification {
    id: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    type: string;
}

const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: true })
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            showToast('Erreur lors de la mise à jour', 'error');
        }
    };

    const handleToggle = () => setIsOpen(!isOpen);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border border-dark-900" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-dark-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 origin-top-right"
                    >
                        <div className="p-3 border-b border-slate-700 flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-white">Notifications</h3>
                            <button onClick={fetchNotifications} className="text-xs text-primary-400 hover:text-primary-300">
                                Actualiser
                            </button>
                        </div>

                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    Aucune notification
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map(notif => (
                                        <li key={notif.id} className={`p-3 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors flex gap-3 ${notif.read ? 'opacity-60' : 'bg-primary-900/10'}`}>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-200">{notif.title}</p>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                                                <span className="text-[10px] text-slate-500 mt-2 block">
                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {!notif.read && (
                                                <button
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="text-primary-400 hover:text-primary-300 self-start mt-1"
                                                    title="Marquer comme lu"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
