'use client';

import { Bell, Menu, Search, User } from 'lucide-react';

export default function Header({ onMenuClick, userName = "Abogado" }) {
    return (
        <header className="h-20 bg-white border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Lado izquierdo - Menu y búsqueda */}
            <div className="flex items-center gap-4">
                {/* Botón menú móvil */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-3 rounded-xl hover:bg-[var(--surface-hover)] transition-colors"
                    aria-label="Abrir menú"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Barra de búsqueda */}
                <div className="relative hidden sm:block">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar clientes, casos, documentos..."
                        className="pl-12 pr-6 py-3 w-72 lg:w-96 rounded-xl border-2 border-[var(--border)] bg-[var(--surface-hover)] focus:bg-white focus:border-[var(--primary-600)] focus:outline-none transition-all text-base"
                    />
                </div>
            </div>

            {/* Lado derecho - Notificaciones y perfil */}
            <div className="flex items-center gap-3">
                {/* Notificaciones */}
                <button className="relative p-3 rounded-xl hover:bg-[var(--surface-hover)] transition-colors group">
                    <Bell className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--primary-700)]" />
                    <span className="absolute top-2 right-2 w-3 h-3 bg-[var(--danger)] rounded-full border-2 border-white"></span>
                </button>

                {/* Perfil de usuario */}
                <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-[var(--surface-hover)] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-dark)] flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="font-semibold text-[var(--text-primary)]">{userName}</p>
                        <p className="text-sm text-[var(--text-muted)]">Ver perfil</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
