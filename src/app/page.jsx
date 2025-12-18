'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import StatCard from '@/components/StatCard';
import AlertBanner from '@/components/AlertBanner';
import { BarChart, LineChart, DoughnutChart } from '@/components/Charts';
import {
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    Plus,
    ArrowRight,
    Calendar,
    Clock,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { getEstadisticas, getAlertas, getCasos, initializeDemoData } from '@/utils/storage';
import { formatShortDate, isUrgent, getRelativeTime } from '@/utils/dateHelpers';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [recentCasos, setRecentCasos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Inicializar datos demo si es primera vez
        initializeDemoData();

        // Cargar datos
        const estadisticas = getEstadisticas();
        const alertas = getAlertas();
        const casos = getCasos().slice(-5).reverse();

        setStats(estadisticas);
        setAlerts(alertas.filter(a => !a.leida));
        setRecentCasos(casos);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--primary-600)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xl text-[var(--text-muted)]">Cargando...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-8 animate-fade-in">
                {/* Encabezado */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                            ¡Bienvenido! 👋
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mt-1">
                            Aquí está el resumen de tu actividad legal
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/clientes"
                            className="btn btn-secondary"
                        >
                            <Users className="w-5 h-5" />
                            Nuevo Cliente
                        </Link>
                        <Link
                            href="/casos"
                            className="btn btn-primary"
                        >
                            <Plus className="w-5 h-5" />
                            Nuevo Caso
                        </Link>
                    </div>
                </div>

                {/* Alertas */}
                <AlertBanner
                    alerts={alerts}
                    onViewAll={() => window.location.href = '/alertas'}
                />

                {/* Estadísticas principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <StatCard
                        title="Clientes Activos"
                        value={stats?.totalClientes || 0}
                        icon={Users}
                        color="primary"
                        trend="up"
                        trendValue="+12%"
                        subtitle="Total registrados"
                    />
                    <StatCard
                        title="Casos Activos"
                        value={stats?.casosActivos || 0}
                        icon={Briefcase}
                        color="warning"
                        subtitle={`${stats?.totalCasos || 0} total`}
                    />
                    <StatCard
                        title="Casos Ganados"
                        value={stats?.casosGanados || 0}
                        icon={CheckCircle2}
                        color="success"
                        trend="up"
                        trendValue={`${stats?.tasaExito || 0}%`}
                        subtitle="Tasa de éxito"
                    />
                    <StatCard
                        title="Documentos"
                        value={stats?.totalDocumentos || 0}
                        icon={FileText}
                        color="neutral"
                        subtitle="Archivos guardados"
                    />
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                        title="Casos por Tipo"
                        data={{
                            labels: stats?.tiposCasos?.map(t => t.label) || [],
                            values: stats?.tiposCasos?.map(t => t.value) || []
                        }}
                    />
                    <DoughnutChart
                        title="Estado de Casos"
                        data={{
                            labels: ['Ganados', 'Activos', 'Pendientes', 'Cerrados'],
                            values: [
                                stats?.casosGanados || 0,
                                stats?.casosActivos || 0,
                                stats?.casosPendientes || 0,
                                stats?.casosCerrados || 0
                            ]
                        }}
                    />
                </div>

                {/* Progreso temporal */}
                <LineChart
                    title="Evolución de Casos (Últimos 6 meses)"
                    data={stats?.casosPorMes}
                />

                {/* Casos recientes y acciones rápidas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Casos recientes */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                Casos Recientes
                            </h3>
                            <Link
                                href="/casos"
                                className="text-[var(--primary-700)] font-semibold flex items-center gap-1 hover:underline"
                            >
                                Ver todos
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {recentCasos.length === 0 ? (
                                <p className="text-[var(--text-muted)] text-center py-8">
                                    No hay casos registrados aún
                                </p>
                            ) : (
                                recentCasos.map((caso) => (
                                    <Link
                                        key={caso.id}
                                        href={`/casos/${caso.id}`}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-[var(--surface-hover)] transition-colors group"
                                    >
                                        <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center
                      ${caso.estado === 'activo' ? 'bg-[var(--primary-100)] text-[var(--primary-700)]' : ''}
                      ${caso.estado === 'ganado' ? 'bg-[var(--success-light)] text-[var(--success)]' : ''}
                      ${caso.estado === 'pendiente' ? 'bg-[var(--warning-light)] text-[var(--warning)]' : ''}
                      ${caso.estado === 'cerrado' ? 'bg-gray-100 text-gray-500' : ''}
                    `}>
                                            <Briefcase className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--primary-700)]">
                                                {caso.titulo}
                                            </h4>
                                            <p className="text-sm text-[var(--text-muted)]">
                                                {caso.tipo} • {getRelativeTime(caso.createdAt)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isUrgent(caso.fechaAudiencia) && (
                                                <span className="badge badge-danger">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Urgente
                                                </span>
                                            )}
                                            <span className={`
                        badge
                        ${caso.estado === 'activo' ? 'badge-info' : ''}
                        ${caso.estado === 'ganado' ? 'badge-success' : ''}
                        ${caso.estado === 'pendiente' ? 'badge-warning' : ''}
                        ${caso.estado === 'cerrado' ? 'badge-neutral' : ''}
                      `}>
                                                {caso.estado.charAt(0).toUpperCase() + caso.estado.slice(1)}
                                            </span>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
                            Acciones Rápidas
                        </h3>

                        <div className="space-y-3">
                            <Link
                                href="/clientes"
                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[var(--primary-100)] to-transparent hover:from-[var(--primary-700)] hover:to-[var(--primary-600)] group transition-all"
                            >
                                <div className="w-12 h-12 bg-[var(--primary-700)] rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-[var(--primary-700)]">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-white">
                                        Agregar Cliente
                                    </h4>
                                    <p className="text-sm text-[var(--text-muted)] group-hover:text-white/80">
                                        Registrar nuevo cliente
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/documentos"
                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[var(--success-light)] to-transparent hover:from-[var(--success)] hover:to-emerald-500 group transition-all"
                            >
                                <div className="w-12 h-12 bg-[var(--success)] rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-[var(--success)]">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-white">
                                        Subir Documentos
                                    </h4>
                                    <p className="text-sm text-[var(--text-muted)] group-hover:text-white/80">
                                        Agregar archivos a casos
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/estadisticas"
                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[var(--warning-light)] to-transparent hover:from-[var(--warning)] hover:to-amber-400 group transition-all"
                            >
                                <div className="w-12 h-12 bg-[var(--warning)] rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-[var(--warning)]">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-white">
                                        Ver Estadísticas
                                    </h4>
                                    <p className="text-sm text-[var(--text-muted)] group-hover:text-white/80">
                                        Análisis completo
                                    </p>
                                </div>
                            </Link>

                            <Link
                                href="/alertas"
                                className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-rose-100 to-transparent hover:from-[var(--danger)] hover:to-rose-500 group transition-all"
                            >
                                <div className="w-12 h-12 bg-[var(--danger)] rounded-xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-[var(--danger)]">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-white">
                                        Mis Alertas
                                    </h4>
                                    <p className="text-sm text-[var(--text-muted)] group-hover:text-white/80">
                                        Fechas importantes
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
