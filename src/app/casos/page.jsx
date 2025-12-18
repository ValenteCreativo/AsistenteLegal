'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Modal from '@/components/Modal';
import {
    Briefcase,
    Plus,
    Search,
    Filter,
    Calendar,
    User,
    FileText,
    Edit,
    Trash2,
    Eye,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { getCasos, createCaso, updateCaso, deleteCaso, getClientes, getClienteById } from '@/utils/storage';
import { formatDate, getRelativeTime, isUrgent } from '@/utils/dateHelpers';

export default function CasosPage() {
    const [casos, setCasos] = useState([]);
    const [filteredCasos, setFilteredCasos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEstado, setFilterEstado] = useState('todos');
    const [filterTipo, setFilterTipo] = useState('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCaso, setEditingCaso] = useState(null);

    const [formData, setFormData] = useState({
        clienteId: '',
        titulo: '',
        tipo: 'Civil',
        descripcion: '',
        estado: 'activo',
        prioridad: 'media',
        fechaAudiencia: '',
        notas: ''
    });

    const tiposCaso = ['Penal', 'Civil', 'Familiar', 'Laboral', 'Mercantil', 'Administrativo', 'Otro'];
    const estadosCaso = ['activo', 'pendiente', 'ganado', 'cerrado'];
    const prioridades = ['alta', 'media', 'baja'];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let filtered = [...casos];

        // Filtrar por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(c =>
                c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.tipo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtrar por estado
        if (filterEstado !== 'todos') {
            filtered = filtered.filter(c => c.estado === filterEstado);
        }

        // Filtrar por tipo
        if (filterTipo !== 'todos') {
            filtered = filtered.filter(c => c.tipo === filterTipo);
        }

        setFilteredCasos(filtered);
    }, [searchTerm, filterEstado, filterTipo, casos]);

    const loadData = () => {
        const casosData = getCasos();
        const clientesData = getClientes();
        setCasos(casosData);
        setFilteredCasos(casosData);
        setClientes(clientesData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCaso) {
            updateCaso(editingCaso.id, formData);
        } else {
            createCaso(formData);
        }

        loadData();
        closeModal();
    };

    const openModal = (caso = null) => {
        if (caso) {
            setEditingCaso(caso);
            setFormData({
                clienteId: caso.clienteId,
                titulo: caso.titulo,
                tipo: caso.tipo,
                descripcion: caso.descripcion || '',
                estado: caso.estado,
                prioridad: caso.prioridad || 'media',
                fechaAudiencia: caso.fechaAudiencia ? caso.fechaAudiencia.split('T')[0] : '',
                notas: caso.notas || ''
            });
        } else {
            setEditingCaso(null);
            setFormData({
                clienteId: clientes[0]?.id || '',
                titulo: '',
                tipo: 'Civil',
                descripcion: '',
                estado: 'activo',
                prioridad: 'media',
                fechaAudiencia: '',
                notas: ''
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCaso(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este caso? Esta acción no se puede deshacer.')) {
            deleteCaso(id);
            loadData();
        }
    };

    const getEstadoStyles = (estado) => {
        switch (estado) {
            case 'activo': return { bg: 'bg-[var(--info-light)]', text: 'text-[var(--info)]', icon: Clock };
            case 'pendiente': return { bg: 'bg-[var(--warning-light)]', text: 'text-[var(--warning)]', icon: AlertTriangle };
            case 'ganado': return { bg: 'bg-[var(--success-light)]', text: 'text-[var(--success)]', icon: CheckCircle2 };
            case 'cerrado': return { bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircle };
            default: return { bg: 'bg-gray-100', text: 'text-gray-500', icon: Clock };
        }
    };

    const getPrioridadStyles = (prioridad) => {
        switch (prioridad) {
            case 'alta': return 'bg-[var(--danger)] text-white';
            case 'media': return 'bg-[var(--warning)] text-white';
            case 'baja': return 'bg-[var(--success)] text-white';
            default: return 'bg-gray-200 text-gray-700';
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Encabezado */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <Briefcase className="w-10 h-10 text-[var(--accent-gold)]" />
                            Mis Casos
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mt-1">
                            {casos.length} casos en total • {casos.filter(c => c.estado === 'activo').length} activos
                        </p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="btn btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        Nuevo Caso
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Búsqueda */}
                    <div className="relative flex-1">
                        <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Buscar casos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-14"
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div className="relative">
                        <select
                            value={filterEstado}
                            onChange={(e) => setFilterEstado(e.target.value)}
                            className="input-field appearance-none pr-12 min-w-[180px]"
                        >
                            <option value="todos">Todos los estados</option>
                            <option value="activo">Activos</option>
                            <option value="pendiente">Pendientes</option>
                            <option value="ganado">Ganados</option>
                            <option value="cerrado">Cerrados</option>
                        </select>
                        <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>

                    {/* Filtro por tipo */}
                    <div className="relative">
                        <select
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                            className="input-field appearance-none pr-12 min-w-[180px]"
                        >
                            <option value="todos">Todos los tipos</option>
                            {tiposCaso.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                </div>

                {/* Lista de casos */}
                <div className="grid gap-4">
                    {filteredCasos.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-[var(--border)]">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                {searchTerm || filterEstado !== 'todos' || filterTipo !== 'todos'
                                    ? 'No se encontraron casos'
                                    : 'No hay casos registrados'
                                }
                            </h3>
                            <p className="text-[var(--text-muted)] mb-6">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza creando tu primer caso'}
                            </p>
                            {!searchTerm && filterEstado === 'todos' && filterTipo === 'todos' && (
                                <button onClick={() => openModal()} className="btn btn-primary">
                                    <Plus className="w-5 h-5" />
                                    Nuevo Caso
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredCasos.map((caso) => {
                            const cliente = getClienteById(caso.clienteId);
                            const estadoStyles = getEstadoStyles(caso.estado);
                            const EstadoIcon = estadoStyles.icon;

                            return (
                                <div
                                    key={caso.id}
                                    className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--primary-600)] hover:shadow-md transition-all group"
                                >
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        {/* Info principal */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className={`w-14 h-14 rounded-2xl ${estadoStyles.bg} flex items-center justify-center flex-shrink-0`}>
                                                <Briefcase className={`w-7 h-7 ${estadoStyles.text}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-700)] transition-colors truncate">
                                                        {caso.titulo}
                                                    </h3>
                                                    {isUrgent(caso.fechaAudiencia) && (
                                                        <span className="badge badge-danger flex-shrink-0">
                                                            <AlertTriangle className="w-4 h-4" />
                                                            Urgente
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[var(--text-secondary)]">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-4 h-4" />
                                                        {cliente?.nombre || 'Cliente no encontrado'}
                                                    </span>
                                                    <span className="badge badge-neutral">
                                                        {caso.tipo}
                                                    </span>
                                                    {caso.fechaAudiencia && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {getRelativeTime(caso.fechaAudiencia)}
                                                        </span>
                                                    )}
                                                </div>

                                                {caso.descripcion && (
                                                    <p className="text-[var(--text-muted)] mt-2 line-clamp-2">
                                                        {caso.descripcion}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Estado y prioridad */}
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getPrioridadStyles(caso.prioridad)}`}>
                                                {caso.prioridad}
                                            </span>

                                            <span className={`flex items-center gap-1 px-3 py-2 rounded-xl ${estadoStyles.bg} ${estadoStyles.text} font-semibold`}>
                                                <EstadoIcon className="w-4 h-4" />
                                                {caso.estado.charAt(0).toUpperCase() + caso.estado.slice(1)}
                                            </span>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/casos/${caso.id}`}
                                                className="p-3 rounded-xl bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-700)] hover:text-white transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>

                                            <button
                                                onClick={() => openModal(caso)}
                                                className="p-3 rounded-xl bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--warning-light)] hover:text-[var(--warning)] transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(caso.id)}
                                                className="p-3 rounded-xl bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Modal de crear/editar */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={editingCaso ? 'Editar Caso' : 'Nuevo Caso'}
                    size="lg"
                    footer={
                        <>
                            <button onClick={closeModal} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} className="btn btn-primary">
                                {editingCaso ? 'Guardar Cambios' : 'Crear Caso'}
                            </button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="input-label">Cliente *</label>
                            <select
                                value={formData.clienteId}
                                onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                                className="input-field"
                                required
                            >
                                <option value="">Selecciona un cliente</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                            <p className="input-helper">
                                ¿No encuentras al cliente? <Link href="/clientes" className="text-[var(--primary-700)] underline">Créalo primero</Link>
                            </p>
                        </div>

                        <div>
                            <label className="input-label">Título del caso *</label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Demanda laboral García vs Empresa XYZ"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="input-label">Tipo de caso</label>
                                <select
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                    className="input-field"
                                >
                                    {tiposCaso.map(tipo => (
                                        <option key={tipo} value={tipo}>{tipo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Estado</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    className="input-field"
                                >
                                    {estadosCaso.map(estado => (
                                        <option key={estado} value={estado}>
                                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="input-label">Prioridad</label>
                                <select
                                    value={formData.prioridad}
                                    onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                                    className="input-field"
                                >
                                    {prioridades.map(p => (
                                        <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Fecha de audiencia</label>
                            <input
                                type="date"
                                value={formData.fechaAudiencia}
                                onChange={(e) => setFormData({ ...formData, fechaAudiencia: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="input-label">Descripción</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                className="input-field min-h-[120px] resize-none"
                                placeholder="Detalles del caso..."
                            />
                        </div>
                    </form>
                </Modal>
            </div>
        </MainLayout>
    );
}
