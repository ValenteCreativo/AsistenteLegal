'use client';

import { AlertTriangle, Clock, X, ChevronRight } from 'lucide-react';

export default function AlertBanner({ alerts, onDismiss, onViewAll }) {
    if (!alerts || alerts.length === 0) return null;

    const urgentAlerts = alerts.filter(a => a.type === 'urgent');
    const upcomingAlerts = alerts.filter(a => a.type === 'upcoming');

    return (
        <div className="space-y-3 mb-6 animate-fade-in">
            {/* Alertas urgentes */}
            {urgentAlerts.map((alert, index) => (
                <div
                    key={`urgent-${index}`}
                    className="relative overflow-hidden bg-gradient-to-r from-[var(--danger)]/20 to-rose-900/20 backdrop-blur-xl border border-[var(--danger)]/30 text-white rounded-2xl p-5 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                >
                    {/* Línea superior brillante */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--danger)] to-transparent" />

                    <div className="flex items-center gap-4">
                        <div className="bg-[var(--danger)] p-3 rounded-xl animate-pulse-soft shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                            <AlertTriangle className="w-6 h-6" />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-[var(--text-primary)]">{alert.title}</h4>
                            <p className="text-[var(--text-secondary)]">{alert.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => alert.action?.()}
                                className="btn btn-secondary text-sm py-2"
                            >
                                Ver detalle
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {onDismiss && (
                                <button
                                    onClick={() => onDismiss(alert.id)}
                                    className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5 text-[var(--text-muted)]" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Alertas próximas */}
            {upcomingAlerts.length > 0 && (
                <div className="relative overflow-hidden bg-gradient-to-r from-[var(--warning)]/20 to-amber-900/20 backdrop-blur-xl border border-[var(--warning)]/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    {/* Línea superior brillante */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--warning)] to-transparent" />

                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-[var(--warning)] p-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                            <Clock className="w-6 h-6 text-black" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-[var(--text-primary)]">Próximos eventos ({upcomingAlerts.length})</h4>
                            <p className="text-[var(--text-secondary)]">Tienes fechas importantes esta semana</p>
                        </div>

                        <button
                            onClick={onViewAll}
                            className="btn btn-secondary text-sm py-2"
                        >
                            Ver todas
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="ml-16 space-y-2">
                        {upcomingAlerts.slice(0, 3).map((alert, index) => (
                            <div
                                key={`upcoming-${index}`}
                                className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl"
                            >
                                <span className="font-bold text-[var(--warning)]">{alert.date}</span>
                                <span className="text-[var(--text-muted)]">-</span>
                                <span className="text-[var(--text-secondary)]">{alert.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
