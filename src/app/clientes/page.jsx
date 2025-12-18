'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Modal from '@/components/Modal';
import {
    Users,
    Plus,
    Search,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    Edit,
    Trash2,
    Eye,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { getClientes, createCliente, updateCliente, deleteCliente, getCasosByCliente } from '@/utils/storage';
import { formatDate } from '@/utils/dateHelpers';

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCliente, setEditingCliente] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        notas: ''
    });

    useEffect(() => {
        loadClientes();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const filtered = clientes.filter(c =>
                c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.telefono?.includes(searchTerm)
            );
            setFilteredClientes(filtered);
        } else {
            setFilteredClientes(clientes);
        }
    }, [searchTerm, clientes]);

    const loadClientes = () => {
        const data = getClientes();
        setClientes(data);
        setFilteredClientes(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCliente) {
            updateCliente(editingCliente.id, formData);
        } else {
            createCliente(formData);
        }

        loadClientes();
        closeModal();
    };

    const openModal = (cliente = null) => {
        if (cliente) {
            setEditingCliente(cliente);
            setFormData({
                nombre: cliente.nombre,
                telefono: cliente.telefono || '',
                email: cliente.email || '',
                direccion: cliente.direccion || '',
                notas: cliente.notas || ''
            });
        } else {
            setEditingCliente(null);
            setFormData({ nombre: '', telefono: '', email: '', direccion: '', notas: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCliente(null);
        setFormData({ nombre: '', telefono: '', email: '', direccion: '', notas: '' });
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente? Esta acción no se puede deshacer.')) {
            deleteCliente(id);
            loadClientes();
        }
    };

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Encabezado */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <Users className="w-10 h-10 text-[var(--primary-700)]" />
                            Mis Clientes
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mt-1">
                            {clientes.length} clientes registrados
                        </p>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="btn btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        Agregar Cliente
                    </button>
                </div>

                {/* Búsqueda */}
                <div className="relative">
                    <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-14 text-lg"
                    />
                </div>

                {/* Lista de clientes */}
                <div className="grid gap-4">
                    {filteredClientes.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-[var(--border)]">
                            <Users className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                            </h3>
                            <p className="text-[var(--text-muted)] mb-6">
                                {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primer cliente'}
                            </p>
                            {!searchTerm && (
                                <button onClick={() => openModal()} className="btn btn-primary">
                                    <Plus className="w-5 h-5" />
                                    Agregar Cliente
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredClientes.map((cliente) => {
                            const casos = getCasosByCliente(cliente.id);

                            return (
                                <div
                                    key={cliente.id}
                                    className="bg-white rounded-2xl p-6 border border-[var(--border)] hover:border-[var(--primary-600)] hover:shadow-md transition-all group"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        {/* Avatar e info principal */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-700)] to-[var(--primary-600)] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                {cliente.nombre.charAt(0).toUpperCase()}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--primary-700)] transition-colors">
                                                    {cliente.nombre}
                                                </h3>

                                                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[var(--text-secondary)]">
                                                    {cliente.telefono && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-4 h-4" />
                                                            {cliente.telefono}
                                                        </span>
                                                    )}
                                                    {cliente.email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="w-4 h-4" />
                                                            {cliente.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Casos asociados */}
                                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-hover)] rounded-xl">
                                            <Briefcase className="w-5 h-5 text-[var(--primary-700)]" />
                                            <span className="font-semibold text-[var(--text-primary)]">{casos.length}</span>
                                            <span className="text-[var(--text-muted)]">casos</span>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/clientes/${cliente.id}`}
                                                className="p-3 rounded-xl bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-700)] hover:text-white transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </Link>

                                            <button
                                                onClick={() => openModal(cliente)}
                                                className="p-3 rounded-xl bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--warning-light)] hover:text-[var(--warning)] transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(cliente.id)}
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
                    title={editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
                    size="lg"
                    footer={
                        <>
                            <button onClick={closeModal} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button onClick={handleSubmit} className="btn btn-primary">
                                {editingCliente ? 'Guardar Cambios' : 'Crear Cliente'}
                            </button>
                        </>
                    }
                >
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="input-label">Nombre completo *</label>
                            <input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="input-field"
                                placeholder="Ej: María García López"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Teléfono</label>
                                <input
                                    type="tel"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: 555-1234-5678"
                                />
                            </div>

                            <div>
                                <label className="input-label">Correo electrónico</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input-field"
                                    placeholder="Ej: cliente@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="input-label">Dirección</label>
                            <input
                                type="text"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                className="input-field"
                                placeholder="Ej: Calle Principal #123, Colonia Centro"
                            />
                        </div>

                        <div>
                            <label className="input-label">Notas adicionales</label>
                            <textarea
                                value={formData.notas}
                                onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                className="input-field min-h-[120px] resize-none"
                                placeholder="Información adicional del cliente..."
                            />
                        </div>
                    </form>
                </Modal>
            </div>
        </MainLayout>
    );
}
