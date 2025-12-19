'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  Menu,
  X,
  Scale,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, description: 'Vista general' },
  { href: '/clientes', label: 'Clientes', icon: Users, description: 'Gestionar clientes' },
  { href: '/casos', label: 'Casos', icon: Briefcase, description: 'Ver todos los casos' },
  { href: '/documentos', label: 'Documentos', icon: FileText, description: 'Archivos' },
  { href: '/estadisticas', label: 'Estadísticas', icon: BarChart3, description: 'Análisis' },
  { href: '/alertas', label: 'Alertas', icon: Bell, description: 'Recordatorios' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();
  const [pendingAlerts, setPendingAlerts] = useState(3);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 
        bg-[var(--background-secondary)]/90 backdrop-blur-xl
        border-r border-[var(--border)]
        transition-transform duration-300 ease-in-out
        w-72 lg:w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Efecto de línea superior brillante */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-50" />

        {/* Header del Sidebar */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-purple-600 flex items-center justify-center shadow-lg animate-glow">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)] absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Asistente Legal
              </h1>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                Premium Edition
              </p>
            </div>
          </div>

          {/* Botón cerrar en móvil */}
          <button
            onClick={onToggle}
            className="lg:hidden absolute top-6 right-4 p-2 rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--accent-primary)]/20 transition-colors"
          >
            <X className="w-6 h-6 text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-4 px-4">
            Navegación
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-xl
                      transition-all duration-300 group relative overflow-hidden
                      ${isActive
                        ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary-light)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                      }
                    `}
                    onClick={() => window.innerWidth < 1024 && onToggle()}
                  >
                    {/* Barra indicadora activa */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent-primary)] rounded-r-full shadow-[0_0_10px_var(--accent-primary)]" />
                    )}

                    <div className={`
                      p-2 rounded-lg transition-all duration-300
                      ${isActive
                        ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_20px_var(--accent-primary-glow)]'
                        : 'bg-[var(--surface-hover)] group-hover:bg-[var(--accent-primary)]/20 group-hover:text-[var(--accent-primary)]'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <span className="font-semibold text-base block">{item.label}</span>
                      <span className="text-xs text-[var(--text-muted)] hidden sm:block">
                        {item.description}
                      </span>
                    </div>

                    {/* Badge de alertas pendientes */}
                    {item.href === '/alertas' && pendingAlerts > 0 && (
                      <span className="bg-[var(--danger)] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center animate-pulse-soft">
                        {pendingAlerts}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-4 h-4 text-[var(--accent-primary)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-[var(--border)]">
          <Link
            href="/ayuda"
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--accent-primary)] transition-all group"
          >
            <div className="p-2 rounded-lg bg-[var(--surface-hover)] group-hover:bg-[var(--accent-primary)]/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-medium">Centro de Ayuda</span>
          </Link>

          {/* Versión */}
          <div className="mt-4 px-4">
            <p className="text-xs text-[var(--text-muted)]">
              Versión 2.0 • JeskoJets Edition
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
