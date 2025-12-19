'use client';

import { Bell, Menu, Search, User, Sparkles } from 'lucide-react';

export default function Header({ onMenuClick, userName = "Abogado" }) {
    return (
        <header className="h-20 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Línea decorativa superior */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)]/30 to-transparent" />

            {/* Lado izquierdo - Menu y búsqueda */}
            <div className="flex items-center gap-4">
                {/* Botón menú móvil */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-3 rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--accent-primary)]/20 transition-all"
                    aria-label="Abrir menú"
                >
                    <Menu className="w-6 h-6 text-[var(--text-primary)]" />
                </button>

                {/* Barra de búsqueda */}
                <div className="relative hidden sm:block group">
                    <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar clientes, casos..."
                        className="pl-12 pr-6 py-3 w-72 lg:w-96 rounded-full 
              bg-[var(--surface-hover)] border border-[var(--border)]
              focus:bg-[var(--glass-bg)] focus:border-[var(--accent-primary)] 
              focus:shadow-[0_0_20px_var(--accent-primary-glow)]
              focus:outline-none transition-all text-base text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]"
                    />
                </div>
            </div>

            {/* Lado derecho - Notificaciones y perfil */}
            <div className="flex items-center gap-3">
                {/* Notificaciones */}
                <button className="relative p-3 rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--accent-primary)]/20 transition-all group">
                    <Bell className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)]" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--danger)] rounded-full border-2 border-[var(--background)] animate-pulse"></span>
                </button>

                {/* Perfil de usuario */}
                <button className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--surface-hover)] hover:bg-[var(--accent-primary)]/20 border border-[var(--border)] hover:border-[var(--accent-primary)]/50 transition-all group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-purple-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[var(--success)] rounded-full border-2 border-[var(--background)]" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{userName}</p>
                        <p className="text-xs text-[var(--text-muted)]">Premium</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-[var(--accent-gold)] hidden md:block" />
                </button>
            </div>
        </header>
    );
}
