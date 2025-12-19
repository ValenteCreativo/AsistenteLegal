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

// Configuración base para todas las gráficas - DARK MODE
const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                font: {
                    size: 13,
                    family: 'Inter'
                },
                color: 'rgba(255, 255, 255, 0.7)',
                usePointStyle: true,
                pointStyle: 'circle'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(15, 15, 25, 0.95)',
            titleFont: { size: 14, family: 'Inter', weight: '600' },
            titleColor: '#fff',
            bodyFont: { size: 13, family: 'Inter' },
            bodyColor: 'rgba(255,255,255,0.8)',
            padding: 14,
            cornerRadius: 12,
            displayColors: true,
            boxPadding: 6,
            borderColor: 'rgba(6, 182, 212, 0.3)',
            borderWidth: 1
        }
    }
};

// Colores neón para las gráficas
const neonColors = {
    backgrounds: [
        'rgba(6, 182, 212, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)'
    ],
    borders: [
        'rgb(6, 182, 212)',
        'rgb(16, 185, 129)',
        'rgb(245, 158, 11)',
        'rgb(139, 92, 246)',
        'rgb(236, 72, 153)'
    ]
};

// Gráfica de Barras - Tipos de Casos
export function BarChart({ data, title = 'Casos por Tipo' }) {
    const chartData = {
        labels: data?.labels || ['Penal', 'Civil', 'Familiar', 'Laboral', 'Mercantil'],
        datasets: [{
            label: 'Número de casos',
            data: data?.values || [12, 19, 8, 15, 6],
            backgroundColor: neonColors.backgrounds,
            borderColor: neonColors.borders,
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
                font: { size: 16, family: 'Inter', weight: '600' },
                color: '#fff',
                padding: { bottom: 20 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: {
                    font: { size: 12, family: 'Inter' },
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, family: 'Inter' },
                    color: 'rgba(255,255,255,0.5)'
                }
            }
        }
    };

    return (
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border)] h-80">
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
                borderColor: 'rgb(6, 182, 212)',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#0a0a0f',
                pointBorderColor: 'rgb(6, 182, 212)',
                pointBorderWidth: 3
            },
            {
                label: 'Casos cerrados',
                data: data?.cerrados || [2, 4, 3, 6, 5, 8],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#0a0a0f',
                pointBorderColor: 'rgb(16, 185, 129)',
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
                font: { size: 16, family: 'Inter', weight: '600' },
                color: '#fff',
                padding: { bottom: 20 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: {
                    font: { size: 12, family: 'Inter' },
                    color: 'rgba(255,255,255,0.5)'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, family: 'Inter' },
                    color: 'rgba(255,255,255,0.5)'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border)] h-80">
            <Line data={chartData} options={options} />
        </div>
    );
}

// Gráfica de Dona - Resultados de Casos
export function DoughnutChart({ data, title = 'Resultados de Casos' }) {
    const chartData = {
        labels: data?.labels || ['Ganados', 'En proceso', 'Pendientes', 'Cerrados'],
        datasets: [{
            data: data?.values || [45, 25, 20, 10],
            backgroundColor: [
                'rgba(16, 185, 129, 0.9)',
                'rgba(6, 182, 212, 0.9)',
                'rgba(245, 158, 11, 0.9)',
                'rgba(100, 116, 139, 0.9)'
            ],
            borderColor: [
                'rgb(16, 185, 129)',
                'rgb(6, 182, 212)',
                'rgb(245, 158, 11)',
                'rgb(100, 116, 139)'
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
                font: { size: 16, family: 'Inter', weight: '600' },
                color: '#fff',
                padding: { bottom: 10 }
            }
        }
    };

    // Calcular total para mostrar en el centro
    const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-[var(--glass-bg)] backdrop-blur-xl rounded-2xl p-6 border border-[var(--border)] h-80 relative">
            <Doughnut data={chartData} options={options} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                <p className="text-4xl font-bold text-[var(--text-primary)]">{total}</p>
                <p className="text-sm text-[var(--text-muted)]">Total</p>
            </div>
        </div>
    );
}

// Exportar todos los tipos de gráficas
export default { BarChart, LineChart, DoughnutChart };
