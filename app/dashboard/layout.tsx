"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-slate-900 overflow-hidden text-slate-100 font-sans antialiased">
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
