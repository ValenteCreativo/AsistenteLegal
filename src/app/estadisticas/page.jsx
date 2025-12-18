'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { BarChart, LineChart, DoughnutChart } from '@/components/Charts';
import StatCard from '@/components/StatCard';
import {
    BarChart3,
    Users,
    Briefcase,
    FileText,
    TrendingUp,
    Award,
    Clock,
    Calendar,
    Download,
    Printer
} from 'lucide-react';
import { getEstadisticas, getCasos, getClientes } from '@/utils/storage';

export default function EstadisticasPage() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState('6meses');

    useEffect(() => {
        const estadisticas = getEstadisticas();
        setStats(estadisticas);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--primary-600)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-xl text-[var(--text-muted)]">Cargando estadísticas...</p>
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
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <BarChart3 className="w-10 h-10 text-[var(--info)]" />
                            Estadísticas
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mt-1">
                            Análisis completo de tu desempeño legal
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button className="btn btn-secondary">
                            <Printer className="w-5 h-5" />
                            Imprimir
                        </button>
                        <button className="btn btn-primary">
                            <Download className="w-5 h-5" />
                            Exportar Reporte
                        </button>
                    </div>
                </div>

                {/* KPIs principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    <StatCard
                        title="Total Clientes"
                        value={stats?.totalClientes || 0}
                        icon={Users}
                        color="primary"
                        subtitle="Clientes registrados"
                    />
                    <StatCard
                        title="Total Casos"
                        value={stats?.totalCasos || 0}
                        icon={Briefcase}
                        color="warning"
                        subtitle="Casos gestionados"
                    />
                    <StatCard
                        title="Tasa de Éxito"
                        value={`${stats?.tasaExito || 0}%`}
                        icon={Award}
                        color="success"
                        trend={stats?.tasaExito >= 50 ? 'up' : 'down'}
                        subtitle="Casos ganados"
                    />
                    <StatCard
                        title="Documentos"
                        value={stats?.totalDocumentos || 0}
                        icon={FileText}
                        color="neutral"
                        subtitle="Archivos guardados"
                    />
                </div>

                {/* Resumen de estados */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                        Resumen de Casos por Estado
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-blue-600 font-semibold text-lg">Activos</span>
                            </div>
                            <p className="text-4xl font-bold text-blue-700">{stats?.casosActivos || 0}</p>
                            <p className="text-blue-600 text-sm mt-1">En proceso</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-amber-600 font-semibold text-lg">Pendientes</span>
                            </div>
                            <p className="text-4xl font-bold text-amber-700">{stats?.casosPendientes || 0}</p>
                            <p className="text-amber-600 text-sm mt-1">Esperando resolución</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-emerald-600 font-semibold text-lg">Ganados</span>
                            </div>
                            <p className="text-4xl font-bold text-emerald-700">{stats?.casosGanados || 0}</p>
                            <p className="text-emerald-600 text-sm mt-1">Resolución favorable</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl bg-gray-500 flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-gray-600 font-semibold text-lg">Cerrados</span>
                            </div>
                            <p className="text-4xl font-bold text-gray-700">{stats?.casosCerrados || 0}</p>
                            <p className="text-gray-600 text-sm mt-1">Finalizados</p>
                        </div>
                    </div>
                </div>

                {/* Gráficas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChart
                        title="Distribución por Tipo de Caso"
                        data={{
                            labels: stats?.tiposCasos?.map(t => t.label) || [],
                            values: stats?.tiposCasos?.map(t => t.value) || []
                        }}
                    />
                    <DoughnutChart
                        title="Estado Actual de Casos"
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

                {/* Evolución temporal */}
                <LineChart
                    title="Evolución de Casos (Últimos 6 meses)"
                    data={stats?.casosPorMes}
                />

                {/* Métricas de rendimiento */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)]">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                        Métricas de Rendimiento
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--primary-100)] to-transparent">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--primary-700)] flex items-center justify-center">
                                <TrendingUp className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-[var(--primary-700)] mb-2">
                                {stats?.tasaExito || 0}%
                            </h3>
                            <p className="text-lg text-[var(--text-secondary)]">Tasa de Éxito</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                Casos ganados vs total
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--success-light)] to-transparent">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--success)] flex items-center justify-center">
                                <Users className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-[var(--success)] mb-2">
                                {stats?.totalClientes > 0 ? (stats.totalCasos / stats.totalClientes).toFixed(1) : 0}
                            </h3>
                            <p className="text-lg text-[var(--text-secondary)]">Casos por Cliente</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                Promedio de casos
                            </p>
                        </div>

                        <div className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--warning-light)] to-transparent">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--warning)] flex items-center justify-center">
                                <FileText className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-[var(--accent-gold-dark)] mb-2">
                                {stats?.totalCasos > 0 ? Math.round(stats.totalDocumentos / stats.totalCasos) : 0}
                            </h3>
                            <p className="text-lg text-[var(--text-secondary)]">Docs por Caso</p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                Promedio de documentos
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
