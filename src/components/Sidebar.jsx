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
  ChevronRight
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Inicio', icon: LayoutDashboard, description: 'Vista general' },
  { href: '/clientes', label: 'Clientes', icon: Users, description: 'Gestionar clientes' },
  { href: '/casos', label: 'Casos', icon: Briefcase, description: 'Ver todos los casos' },
  { href: '/documentos', label: 'Documentos', icon: FileText, description: 'Archivos y documentos' },
  { href: '/estadisticas', label: 'Estadísticas', icon: BarChart3, description: 'Gráficas y análisis' },
  { href: '/alertas', label: 'Alertas', icon: Bell, description: 'Fechas importantes' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();
  const [pendingAlerts, setPendingAlerts] = useState(3);

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 bg-white border-r border-[var(--border)]
        transition-transform duration-300 ease-in-out
        w-72 lg:w-80
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header del Sidebar */}
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-600)] flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                Asistente Legal
              </h1>
              <p className="text-sm text-[var(--text-muted)]">
                Tu ayuda legal
              </p>
            </div>
          </div>
          
          {/* Botón cerrar en móvil */}
          <button 
            onClick={onToggle}
            className="lg:hidden absolute top-6 right-4 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Navegación */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`
                      flex items-center gap-4 px-4 py-4 rounded-xl
                      transition-all duration-200 group relative
                      ${isActive 
                        ? 'bg-gradient-to-r from-[var(--primary-100)] to-transparent text-[var(--primary-700)] shadow-sm' 
                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                      }
                    `}
                    onClick={() => window.innerWidth < 1024 && onToggle()}
                  >
                    <div className={`
                      p-2 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-[var(--primary-700)] text-white' 
                        : 'bg-[var(--surface-hover)] group-hover:bg-[var(--primary-100)] group-hover:text-[var(--primary-700)]'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <span className="font-semibold text-lg block">{item.label}</span>
                      <span className="text-sm text-[var(--text-muted)] hidden sm:block">
                        {item.description}
                      </span>
                    </div>
                    
                    {/* Badge de alertas pendientes */}
                    {item.href === '/alertas' && pendingAlerts > 0 && (
                      <span className="bg-[var(--danger)] text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                        {pendingAlerts}
                      </span>
                    )}
                    
                    {isActive && (
                      <ChevronRight className="w-5 h-5 text-[var(--primary-700)]" />
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
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--primary-700)] transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">¿Necesitas ayuda?</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
