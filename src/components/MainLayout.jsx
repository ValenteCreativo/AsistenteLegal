'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function MainLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--background)] relative">
            {/* Efecto de viñeta ambiental */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.05),transparent_50%)]" />
            </div>

            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Contenido principal */}
            <div className="lg:ml-80 relative z-10">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="p-6 lg:p-8 min-h-[calc(100vh-5rem)]">
                    {children}
                </main>

                {/* Footer sutil */}
                <footer className="border-t border-[var(--border)] py-6 px-8 text-center">
                    <p className="text-sm text-[var(--text-muted)]">
                        © 2024 Asistente Legal • Diseño Premium
                    </p>
                </footer>
            </div>
        </div>
    );
}
