'use client';

import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Registrar los componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Configuración base para todas las gráficas
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                font: {
                    size: 14,
                    family: 'Inter'
                },
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 14, family: 'Inter', weight: '600' },
            bodyFont: { size: 13, family: 'Inter' },
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            boxPadding: 6
        }
    }
};

// Gráfica de Barras - Tipos de Casos
export function BarChart({ data, title = 'Casos por Tipo' }) {
    const chartData = {
        labels: data?.labels || ['Penal', 'Civil', 'Familiar', 'Laboral', 'Mercantil'],
        datasets: [{
            label: 'Número de casos',
            data: data?.values || [12, 19, 8, 15, 6],
            backgroundColor: [
                'rgba(37, 99, 235, 0.8)',
                'rgba(5, 150, 105, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(236, 72, 153, 0.8)'
            ],
            borderColor: [
                'rgb(37, 99, 235)',
                'rgb(5, 150, 105)',
                'rgb(245, 158, 11)',
                'rgb(139, 92, 246)',
                'rgb(236, 72, 153)'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const options = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: {
                display: true,
                text: title,
                font: { size: 18, family: 'Inter', weight: '600' },
                padding: { bottom: 20 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 12, family: 'Inter' } }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, family: 'Inter' } }
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] h-80">
            <Bar data={chartData} options={options} />
        </div>
    );
}

// Gráfica de Línea - Progreso Temporal
export function LineChart({ data, title = 'Casos por Mes' }) {
    const chartData = {
        labels: data?.labels || ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Casos nuevos',
                data: data?.nuevos || [4, 6, 5, 8, 7, 10],
                borderColor: 'rgb(37, 99, 235)',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'white',
                pointBorderWidth: 3
            },
            {
                label: 'Casos cerrados',
                data: data?.cerrados || [2, 4, 3, 6, 5, 8],
                borderColor: 'rgb(5, 150, 105)',
                backgroundColor: 'rgba(5, 150, 105, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'white',
                pointBorderWidth: 3
            }
        ]
    };

    const options = {
        ...baseOptions,
        plugins: {
            ...baseOptions.plugins,
            title: {
                display: true,
                text: title,
                font: { size: 18, family: 'Inter', weight: '600' },
                padding: { bottom: 20 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(0,0,0,0.05)' },
                ticks: { font: { size: 12, family: 'Inter' } }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 12, family: 'Inter' } }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] h-80">
            <Line data={chartData} options={options} />
        </div>
    );
}

// Gráfica de Dona - Resultados de Casos
export function DoughnutChart({ data, title = 'Resultados de Casos' }) {
    const chartData = {
        labels: data?.labels || ['Ganados', 'En proceso', 'Pendientes', 'Cerrados sin fallo'],
        datasets: [{
            data: data?.values || [45, 25, 20, 10],
            backgroundColor: [
                'rgba(5, 150, 105, 0.9)',
                'rgba(37, 99, 235, 0.9)',
                'rgba(245, 158, 11, 0.9)',
                'rgba(148, 163, 184, 0.9)'
            ],
            borderColor: [
                'rgb(5, 150, 105)',
                'rgb(37, 99, 235)',
                'rgb(245, 158, 11)',
                'rgb(148, 163, 184)'
            ],
            borderWidth: 2,
            hoverOffset: 10
        }]
    };

    const options = {
        ...baseOptions,
        cutout: '65%',
        plugins: {
            ...baseOptions.plugins,
            title: {
                display: true,
                text: title,
                font: { size: 18, family: 'Inter', weight: '600' },
                padding: { bottom: 10 }
            }
        }
    };

    // Calcular total para mostrar en el centro
    const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--border)] h-80 relative">
            <Doughnut data={chartData} options={options} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                <p className="text-4xl font-bold text-[var(--text-primary)]">{total}</p>
                <p className="text-sm text-[var(--text-muted)]">Total casos</p>
            </div>
        </div>
    );
}

// Exportar todos los tipos de gráficas
export default { BarChart, LineChart, DoughnutChart };
