'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendValue,
    color = 'primary',
    onClick
}) {
    const colorClasses = {
        primary: {
            gradient: 'from-[var(--accent-primary)] to-purple-600',
            glow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
            iconBg: 'bg-[var(--accent-primary)]'
        },
        success: {
            gradient: 'from-emerald-500 to-teal-600',
            glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
            iconBg: 'bg-[var(--success)]'
        },
        warning: {
            gradient: 'from-amber-500 to-orange-600',
            glow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
            iconBg: 'bg-[var(--warning)]'
        },
        danger: {
            gradient: 'from-rose-500 to-red-600',
            glow: 'shadow-[0_0_30px_rgba(239,68,68,0.3)]',
            iconBg: 'bg-[var(--danger)]'
        },
        neutral: {
            gradient: 'from-gray-600 to-gray-700',
            glow: 'shadow-lg',
            iconBg: 'bg-[var(--surface-hover)]'
        }
    };

    const colors = colorClasses[color];

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-[var(--success)]' : trend === 'down' ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]';

    return (
        <div
            className={`
        relative overflow-hidden
        bg-[var(--glass-bg)] backdrop-blur-xl
        border border-[var(--border)] hover:border-[var(--border-strong)]
        rounded-2xl p-6
        transition-all duration-500 
        hover:${colors.glow} hover:-translate-y-1
        group cursor-pointer
      `}
            onClick={onClick}
        >
            {/* Efecto de gradiente superior */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`${colors.iconBg} p-3 rounded-xl shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>

                    {trendValue && (
                        <div className={`flex items-center gap-1 ${trendColor} bg-[var(--surface-hover)] px-2 py-1 rounded-full`}>
                            <TrendIcon className="w-4 h-4" />
                            <span className="text-sm font-bold">{trendValue}</span>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="text-4xl font-bold text-[var(--text-primary)] mb-1 tracking-tight">
                        {value}
                    </h3>
                    <p className="text-base font-medium text-[var(--text-secondary)]">
                        {title}
                    </p>
                    {subtitle && (
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
