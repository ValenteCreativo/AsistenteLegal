'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Contenido principal */}
            <div className="lg:ml-80">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
