'use client';

import MainLayout from '@/components/MainLayout';
import {
    HelpCircle,
    MessageCircle,
    Book,
    Video,
    Mail,
    Phone,
    ChevronRight,
    Users,
    Briefcase,
    FileText,
    BarChart3,
    Bell,
    Settings
} from 'lucide-react';
import Link from 'next/link';

export default function AyudaPage() {
    const guias = [
        {
            icon: Users,
            titulo: 'Gestión de Clientes',
            descripcion: 'Aprende a agregar y administrar la información de tus clientes',
            pasos: [
                'Ve a la sección "Clientes" en el menú lateral',
                'Haz clic en el botón grande "Agregar Cliente"',
                'Completa el formulario con la información del cliente',
                'Guarda los cambios'
            ]
        },
        {
            icon: Briefcase,
            titulo: 'Crear un Nuevo Caso',
            descripcion: 'Cómo registrar y dar seguimiento a casos legales',
            pasos: [
                'Primero asegúrate de tener registrado al cliente',
                'Ve a la sección "Casos" en el menú',
                'Presiona "Nuevo Caso"',
                'Selecciona el cliente y completa los detalles',
                'Establece la prioridad y fecha de audiencia si aplica'
            ]
        },
        {
            icon: FileText,
            titulo: 'Subir Documentos',
            descripcion: 'Organiza los documentos de cada caso',
            pasos: [
                'Accede a "Documentos" desde el menú',
                'Haz clic en "Subir Documentos"',
                'Selecciona el caso al que pertenecen',
                'Arrastra los archivos o haz clic para seleccionar',
                'Los documentos se guardarán automáticamente'
            ]
        },
        {
            icon: Bell,
            titulo: 'Configurar Alertas',
            descripcion: 'No olvides fechas importantes',
            pasos: [
                'Ve a "Alertas" en el menú lateral',
                'Presiona "Nueva Alerta"',
                'Establece el título, fecha y descripción',
                'Las alertas urgentes aparecerán en rojo'
            ]
        }
    ];

    const preguntasFrecuentes = [
        {
            pregunta: '¿Dónde se guardan mis datos?',
            respuesta: 'Todos tus datos se guardan localmente en tu navegador. Esto significa que son privados y solo tú puedes acceder a ellos desde este dispositivo.'
        },
        {
            pregunta: '¿Puedo usar la aplicación sin internet?',
            respuesta: 'Sí, una vez cargada la aplicación, puedes usarla sin conexión a internet. Tus datos permanecerán seguros en tu dispositivo.'
        },
        {
            pregunta: '¿Cómo veo las estadísticas de mis casos?',
            respuesta: 'En el Dashboard principal verás un resumen rápido. Para análisis más detallado, visita la sección "Estadísticas" donde encontrarás gráficas completas.'
        },
        {
            pregunta: '¿Puedo exportar mis datos?',
            respuesta: 'En la sección de Estadísticas encontrarás botones para imprimir o exportar reportes de tu actividad.'
        }
    ];

    return (
        <MainLayout>
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
                {/* Encabezado */}
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-600)] flex items-center justify-center shadow-lg">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)]">
                        Centro de Ayuda
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] mt-2">
                        Aquí encontrarás guías para usar todas las funciones
                    </p>
                </div>

                {/* Guías paso a paso */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        📖 Guías Paso a Paso
                    </h2>

                    <div className="grid gap-4">
                        {guias.map((guia, index) => {
                            const Icon = guia.icon;
                            return (
                                <details
                                    key={index}
                                    className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden group"
                                >
                                    <summary className="p-6 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors list-none">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-[var(--primary-100)] flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-7 h-7 text-[var(--primary-700)]" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                                    {guia.titulo}
                                                </h3>
                                                <p className="text-[var(--text-muted)]">{guia.descripcion}</p>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-[var(--text-muted)] group-open:rotate-90 transition-transform" />
                                        </div>
                                    </summary>

                                    <div className="px-6 pb-6 pt-2 ml-18">
                                        <div className="ml-[4.5rem] pl-4 border-l-3 border-[var(--primary-600)]">
                                            <ol className="space-y-3">
                                                {guia.pasos.map((paso, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <span className="w-8 h-8 rounded-full bg-[var(--primary-700)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                                            {i + 1}
                                                        </span>
                                                        <span className="text-lg text-[var(--text-secondary)] pt-1">{paso}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                </details>
                            );
                        })}
                    </div>
                </div>

                {/* Preguntas frecuentes */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        ❓ Preguntas Frecuentes
                    </h2>

                    <div className="grid gap-3">
                        {preguntasFrecuentes.map((faq, index) => (
                            <details
                                key={index}
                                className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden"
                            >
                                <summary className="p-5 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors list-none font-semibold text-lg text-[var(--text-primary)]">
                                    {faq.pregunta}
                                </summary>
                                <div className="px-5 pb-5">
                                    <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                                        {faq.respuesta}
                                    </p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Contacto */}
                <div className="bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-600)] rounded-2xl p-8 text-white text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">¿Necesitas más ayuda?</h2>
                    <p className="text-white/80 mb-6">
                        Estamos aquí para asistirte con cualquier duda
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:soporte@asistente-legal.com"
                            className="btn bg-white text-[var(--primary-700)] hover:bg-white/90"
                        >
                            <Mail className="w-5 h-5" />
                            Enviar correo
                        </a>
                    </div>
                </div>

                {/* Navegación rápida */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { href: '/', icon: BarChart3, label: 'Dashboard' },
                        { href: '/clientes', icon: Users, label: 'Clientes' },
                        { href: '/casos', icon: Briefcase, label: 'Casos' },
                        { href: '/documentos', icon: FileText, label: 'Documentos' },
                        { href: '/estadisticas', icon: BarChart3, label: 'Estadísticas' },
                        { href: '/alertas', icon: Bell, label: 'Alertas' }
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="p-5 bg-white rounded-2xl border border-[var(--border)] hover:border-[var(--primary-600)] hover:shadow-md transition-all text-center"
                            >
                                <Icon className="w-8 h-8 mx-auto mb-2 text-[var(--primary-700)]" />
                                <span className="font-semibold text-[var(--text-primary)]">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}
