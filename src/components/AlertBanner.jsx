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
                    className="bg-gradient-to-r from-[var(--danger)] to-rose-500 text-white rounded-2xl p-5 shadow-lg flex items-center gap-4"
                >
                    <div className="bg-white/20 p-3 rounded-xl animate-pulse-soft">
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                        <h4 className="font-bold text-lg">{alert.title}</h4>
                        <p className="text-white/90">{alert.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => alert.action?.()}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                            Ver detalle
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {onDismiss && (
                            <button
                                onClick={() => onDismiss(alert.id)}
                                className="p-2 rounded-xl hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {/* Alertas próximas */}
            {upcomingAlerts.length > 0 && (
                <div className="bg-gradient-to-r from-[var(--warning)] to-amber-400 text-white rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="bg-white/20 p-3 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg">Próximos eventos ({upcomingAlerts.length})</h4>
                            <p className="text-white/90">Tienes fechas importantes esta semana</p>
                        </div>

                        <button
                            onClick={onViewAll}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                            Ver todas
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="ml-16 space-y-2">
                        {upcomingAlerts.slice(0, 3).map((alert, index) => (
                            <div
                                key={`upcoming-${index}`}
                                className="flex items-center gap-3 bg-white/10 p-3 rounded-xl"
                            >
                                <span className="font-bold">{alert.date}</span>
                                <span className="text-white/90">-</span>
                                <span>{alert.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
