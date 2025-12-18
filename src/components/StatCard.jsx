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
            bg: 'bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-600)]',
            iconBg: 'bg-white/20',
            text: 'text-white'
        },
        success: {
            bg: 'bg-gradient-to-br from-[var(--success)] to-emerald-500',
            iconBg: 'bg-white/20',
            text: 'text-white'
        },
        warning: {
            bg: 'bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-light)]',
            iconBg: 'bg-white/20',
            text: 'text-white'
        },
        danger: {
            bg: 'bg-gradient-to-br from-[var(--danger)] to-rose-500',
            iconBg: 'bg-white/20',
            text: 'text-white'
        },
        neutral: {
            bg: 'bg-white border border-[var(--border)]',
            iconBg: 'bg-[var(--primary-100)]',
            text: 'text-[var(--text-primary)]'
        }
    };

    const colors = colorClasses[color];

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-emerald-300' : trend === 'down' ? 'text-rose-300' : 'text-white/70';

    return (
        <div
            className={`
        ${colors.bg} rounded-2xl p-6 shadow-lg 
        transition-all duration-300 cursor-pointer
        hover:shadow-xl hover:-translate-y-1
        ${onClick ? 'cursor-pointer' : ''}
      `}
            onClick={onClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`${colors.iconBg} p-3 rounded-xl`}>
                    <Icon className={`w-7 h-7 ${color === 'neutral' ? 'text-[var(--primary-700)]' : 'text-white'}`} />
                </div>

                {trendValue && (
                    <div className={`flex items-center gap-1 ${trendColor}`}>
                        <TrendIcon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{trendValue}</span>
                    </div>
                )}
            </div>

            <div className={colors.text}>
                <h3 className={`text-4xl font-bold mb-1 ${color === 'neutral' ? 'text-[var(--text-primary)]' : ''}`}>
                    {value}
                </h3>
                <p className={`text-lg font-medium ${color === 'neutral' ? 'text-[var(--text-primary)]' : 'text-white/90'}`}>
                    {title}
                </p>
                {subtitle && (
                    <p className={`text-sm mt-1 ${color === 'neutral' ? 'text-[var(--text-muted)]' : 'text-white/70'}`}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
