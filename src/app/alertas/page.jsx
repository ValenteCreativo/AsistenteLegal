'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Modal from '@/components/Modal';
import {
    Bell,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    Plus,
    Trash2,
    Eye,
    ChevronRight,
    Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { getAlertas, createAlerta, deleteAlerta, markAlertaAsRead, getCasos } from '@/utils/storage';
import { formatDate, getRelativeTime, isUrgent, getDaysUntil, getWeekDates } from '@/utils/dateHelpers';

export default function AlertasPage() {
    const [alertas, setAlertas] = useState([]);
    const [casos, setCasos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        type: 'upcoming',
        casoId: ''
    });

    const weekDates = getWeekDates();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        const alertasData = getAlertas();
        // Ordenar por fecha (más urgentes primero)
        alertasData.sort((a, b) => {
            if (a.type === 'urgent' && b.type !== 'urgent') return -1;
            if (a.type !== 'urgent' && b.type === 'urgent') return 1;
            return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
        });
        setAlertas(alertasData);
        setCasos(getCasos());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createAlerta({
            ...formData,
            type: getDaysUntil(formData.date) <= 3 ? 'urgent' : 'upcoming'
        });
        loadData();
        setIsModalOpen(false);
        setFormData({ title: '', description: '', date: '', type: 'upcoming', casoId: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta alerta?')) {
            deleteAlerta(id);
            loadData();
        }
    };

    const handleMarkAsRead = (id) => {
        markAlertaAsRead(id);
        loadData();
    };

    const urgentAlertas = alertas.filter(a => a.type === 'urgent' && !a.leida);
    const upcomingAlertas = alertas.filter(a => a.type === 'upcoming' && !a.leida);
    const readAlertas = alertas.filter(a => a.leida);

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Encabezado */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <Bell className="w-10 h-10 text-[var(--danger)]" />
                            Alertas y Recordatorios
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mt-1">
                            {alertas.filter(a => !a.leida).length} pendientes de revisar
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        Nueva Alerta
                    </button>
                </div>

                {/* Vista de semana */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                    <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Esta Semana</h2>

                    <div className="grid grid-cols-7 gap-2">
                        {weekDates.map((day, i) => (
                            <div
                                key={i}
                                className={`p-4 rounded-xl text-center transition-all ${day.isToday
                                        ? 'bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-600)] text-white shadow-lg'
                                        : 'bg-[var(--surface-hover)] hover:bg-[var(--primary-100)]'
                                    }`}
                            >
                                <p className={`text-sm font-medium ${day.isToday ? 'text-white/80' : 'text-[var(--text-muted)]'}`}>
                                    {day.dayName}
                                </p>
                                <p className={`text-2xl font-bold ${day.isToday ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                                    {day.dayNumber}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertas urgentes */}
                {urgentAlertas.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-[var(--danger)] flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6" />
                            Urgente ({urgentAlertas.length})
                        </h2>

                        {urgentAlertas.map((alerta) => (
                            <div
                                key={alerta.id}
                                className="bg-gradient-to-r from-[var(--danger)] to-rose-500 text-white rounded-2xl p-5 shadow-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-white/20 p-3 rounded-xl animate-pulse-soft">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl">{alerta.title}</h3>
                                        <p className="text-white/90">{alerta.description}</p>
                                        {alerta.date && (
                                            <p className="text-white/80 text-sm mt-1 flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(alerta.date)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleMarkAsRead(alerta.id)}
                                            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                                            title="Marcar como leída"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(alerta.id)}
                                            className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Alertas próximas */}
                {upcomingAlertas.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-[var(--warning)] flex items-center gap-2">
                            <Clock className="w-6 h-6" />
                            Próximas ({upcomingAlertas.length})
                        </h2>

                        <div className="grid gap-3">
                            {upcomingAlertas.map((alerta) => (
                                <div
                                    key={alerta.id}
                                    className="bg-white rounded-2xl p-5 border border-[var(--border)] hover:border-[var(--warning)] hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-[var(--warning-light)] p-3 rounded-xl">
                                            <Clock className="w-6 h-6 text-[var(--warning)]" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-[var(--text-primary)]">{alerta.title}</h3>
                                            <p className="text-[var(--text-secondary)]">{alerta.description}</p>
                                            {alerta.date && (
                                                <p className="text-[var(--text-muted)] text-sm mt-1 flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(alerta.date)} • {getRelativeTime(alerta.date)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleMarkAsRead(alerta.id)}
                                                className="p-3 rounded-xl bg-[var(--success-light)] text-[var(--success)] hover:bg-[var(--success)] hover:text-white transition-colors"
                                                title="Marcar como leída"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(alerta.id)}
                                                className="p-3 rounded-xl bg-[var(--surface-hover)] text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sin alertas pendientes */}
                {urgentAlertas.length === 0 && upcomingAlertas.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center border border-[var(--border)]">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--success-light)] flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-[var(--success)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                            ¡Todo al día! 🎉
                        </h3>
                        <p className="text-lg text-[var(--text-muted)] mb-6">
                            No tienes alertas pendientes
                        </p>
                        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                            <Plus className="w-5 h-5" />
                            Crear Recordatorio
                        </button>
                    </div>
                )}

                {/* Alertas leídas */}
                {readAlertas.length > 0 && (
                    <div className="space-y-3">
                        <h2 className="text-xl font-bold text-[var(--text-muted)] flex items-center gap-2">
                            <CheckCircle className="w-6 h-6" />
                            Revisadas ({readAlertas.length})
                        </h2>

                        <div className="grid gap-3 opacity-60">
                            {readAlertas.slice(0, 5).map((alerta) => (
                                <div
                                    key={alerta.id}
                                    className="bg-white rounded-2xl p-4 border border-[var(--border)]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-100 p-2 rounded-xl">
                                            <CheckCircle className="w-5 h-5 text-gray-400" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-[var(--text-muted)] line-through">{alerta.title}</h3>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(alerta.id)}
                                            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Modal de nueva alerta */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Nueva Alerta"
                    size="md"
                    footer={
                        <>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Crear Alerta
                            </button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="input-label">Título *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Audiencia caso García"
                                required
                            />
                        </div>

                        <div>
                            <label className="input-label">Fecha</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="input-label">Caso relacionado (opcional)</label>
                            <select
                                value={formData.casoId}
                                onChange={(e) => setFormData({ ...formData, casoId: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Sin caso asociado</option>
                                {casos.map(caso => (
                                    <option key={caso.id} value={caso.id}>{caso.titulo}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="input-label">Descripción</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field min-h-[100px] resize-none"
                                placeholder="Detalles adicionales..."
                            />
                        </div>
                    </form>
                </Modal>
            </div>
        </MainLayout>
    );
}
