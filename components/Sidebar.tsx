import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SIDEBAR_ROUTES, ROUTES } from '@/lib/routes';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) => {
    const router = useRouter();
    const pathname = usePathname();

    const handleNav = (path: string) => {
        router.push(path);
        setIsMobileOpen(false);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={isMobileOpen ? 'open' : 'closed'}
                variants={{
                    open: { x: 0 },
                    closed: { x: -300 }
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col bg-dark-900/80 backdrop-blur-xl border-r border-slate-800 lg:translate-x-0 lg:!transform-none ${isCollapsed ? 'lg:w-20' : 'lg:w-64'
                    } w-64 transition-[width] duration-300`}
            >
                {/* Logo Section */}
                <div className={`p-6 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''} shrink-0`}>
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <img src="/logo.png" alt="EUREKA" className="w-6 h-6" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-bold text-2xl tracking-tight text-white">EUREKA</span>
                    )}
                </div>

                {/* Navigation Section */}
                <div className="flex-grow px-3 space-y-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {SIDEBAR_ROUTES.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNav(item.path)}
                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${isActive(item.path)
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }`}
                        >
                            {item.icon && <item.icon className={`w-5 h-5 shrink-0 ${isActive(item.path) ? 'text-primary' : 'group-hover:scale-110 transition-transform'}`} />}
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {isActive(item.path) && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Bottom Section */}
                <div className="p-4 space-y-2 border-t border-slate-800/50">
                    <button
                        onClick={() => handleNav(ROUTES.SETTINGS.path)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all ${isActive(ROUTES.SETTINGS.path) ? 'bg-slate-800/50 text-white' : ''
                            }`}
                    >
                        {ROUTES.SETTINGS.icon && <ROUTES.SETTINGS.icon className="w-5 h-5 shrink-0" />}
                        {!isCollapsed && <span className="text-sm font-medium">{ROUTES.SETTINGS.label}</span>}
                    </button>

                    <button
                        onClick={() => handleNav(ROUTES.LOGIN.path)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all`}
                    >
                        {ROUTES.LOGIN.icon && <ROUTES.LOGIN.icon className="w-5 h-5 shrink-0" />}
                        {!isCollapsed && <span className="text-sm font-medium">{ROUTES.LOGIN.label}</span>}
                    </button>

                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
