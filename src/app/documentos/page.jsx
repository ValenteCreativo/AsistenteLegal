'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import FileUpload from '@/components/FileUpload';
import Modal from '@/components/Modal';
import {
    FileText,
    FolderOpen,
    Search,
    Download,
    Trash2,
    Eye,
    File,
    Image,
    FileSpreadsheet,
    Briefcase,
    ChevronDown,
    Plus,
    Filter
} from 'lucide-react';
import { getDocumentos, createDocumento, deleteDocumento, getCasos, getCasoById } from '@/utils/storage';
import { formatDate, getRelativeTime } from '@/utils/dateHelpers';

export default function DocumentosPage() {
    const [documentos, setDocumentos] = useState([]);
    const [filteredDocumentos, setFilteredDocumentos] = useState([]);
    const [casos, setCasos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCaso, setFilterCaso] = useState('todos');
    const [filterCategoria, setFilterCategoria] = useState('todos');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadCaso, setUploadCaso] = useState('');
    const [uploadCategoria, setUploadCategoria] = useState('evidencia');

    const categorias = [
        { value: 'evidencia', label: 'Evidencia', icon: Eye },
        { value: 'contratos', label: 'Contratos', icon: FileText },
        { value: 'comunicaciones', label: 'Comunicaciones', icon: File },
        { value: 'otros', label: 'Otros', icon: FolderOpen }
    ];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        let filtered = [...documentos];

        if (searchTerm) {
            filtered = filtered.filter(d =>
                d.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCaso !== 'todos') {
            filtered = filtered.filter(d => d.casoId === filterCaso);
        }

        if (filterCategoria !== 'todos') {
            filtered = filtered.filter(d => d.categoria === filterCategoria);
        }

        setFilteredDocumentos(filtered);
    }, [searchTerm, filterCaso, filterCategoria, documentos]);

    const loadData = () => {
        setDocumentos(getDocumentos());
        setCasos(getCasos());
    };

    const getFileIcon = (tipo) => {
        if (tipo?.startsWith('image/')) return Image;
        if (tipo?.includes('spreadsheet') || tipo?.includes('excel')) return FileSpreadsheet;
        return FileText;
    };

    const handleUpload = () => {
        if (!uploadCaso || selectedFiles.length === 0) {
            alert('Por favor selecciona un caso y al menos un archivo');
            return;
        }

        selectedFiles.forEach(fileData => {
            createDocumento({
                casoId: uploadCaso,
                nombre: fileData.name,
                tipo: fileData.type,
                size: fileData.size,
                categoria: uploadCategoria
            });
        });

        loadData();
        setIsModalOpen(false);
        setSelectedFiles([]);
        setUploadCaso('');
        setUploadCategoria('evidencia');
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este documento?')) {
            deleteDocumento(id);
            loadData();
        }
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '0 B';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <MainLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Encabezado */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                            <FileText className="w-10 h-10 text-[var(--success)]" />
                            Documentos
                        </h1>
                        <p className="text-lg text-[var(--text-secondary)] mt-1">
                            {documentos.length} archivos guardados
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn btn-primary"
                    >
                        <Plus className="w-5 h-5" />
                        Subir Documentos
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-14"
                        />
                    </div>

                    <div className="relative">
                        <select
                            value={filterCaso}
                            onChange={(e) => setFilterCaso(e.target.value)}
                            className="input-field appearance-none pr-12 min-w-[200px]"
                        >
                            <option value="todos">Todos los casos</option>
                            {casos.map(caso => (
                                <option key={caso.id} value={caso.id}>{caso.titulo}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={filterCategoria}
                            onChange={(e) => setFilterCategoria(e.target.value)}
                            className="input-field appearance-none pr-12 min-w-[180px]"
                        >
                            <option value="todos">Todas las categorías</option>
                            {categorias.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                </div>

                {/* Lista de documentos */}
                <div className="grid gap-4">
                    {filteredDocumentos.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-[var(--border)]">
                            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
                            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                                {searchTerm || filterCaso !== 'todos' || filterCategoria !== 'todos'
                                    ? 'No se encontraron documentos'
                                    : 'No hay documentos guardados'
                                }
                            </h3>
                            <p className="text-[var(--text-muted)] mb-6">
                                Sube documentos a tus casos para mantenerlos organizados
                            </p>
                            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                                <Plus className="w-5 h-5" />
                                Subir Documentos
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDocumentos.map((doc) => {
                                const caso = getCasoById(doc.casoId);
                                const FileIcon = getFileIcon(doc.tipo);
                                const categoria = categorias.find(c => c.value === doc.categoria);

                                return (
                                    <div
                                        key={doc.id}
                                        className="bg-white rounded-2xl p-5 border border-[var(--border)] hover:border-[var(--primary-600)] hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-[var(--primary-100)] flex items-center justify-center flex-shrink-0">
                                                <FileIcon className="w-7 h-7 text-[var(--primary-700)]" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--primary-700)]">
                                                    {doc.nombre}
                                                </h4>
                                                <p className="text-sm text-[var(--text-muted)]">
                                                    {formatFileSize(doc.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                <Briefcase className="w-4 h-4" />
                                                <span className="truncate">{caso?.titulo || 'Caso no encontrado'}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="badge badge-neutral text-xs">
                                                    {categoria?.label || 'Sin categoría'}
                                                </span>
                                                <span className="text-xs text-[var(--text-muted)]">
                                                    {getRelativeTime(doc.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button className="flex-1 btn btn-secondary py-2 text-sm">
                                                <Eye className="w-4 h-4" />
                                                Ver
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Modal de subir documentos */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Subir Documentos"
                    size="lg"
                    footer={
                        <>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button onClick={handleUpload} className="btn btn-primary">
                                Subir {selectedFiles.length} archivo(s)
                            </button>
                        </>
                    }
                >
                    <div className="space-y-6">
                        <div>
                            <label className="input-label">Caso asociado *</label>
                            <select
                                value={uploadCaso}
                                onChange={(e) => setUploadCaso(e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Selecciona un caso</option>
                                {casos.map(caso => (
                                    <option key={caso.id} value={caso.id}>{caso.titulo}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="input-label">Categoría</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {categorias.map(cat => {
                                    const CatIcon = cat.icon;
                                    return (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setUploadCategoria(cat.value)}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${uploadCategoria === cat.value
                                                    ? 'border-[var(--primary-600)] bg-[var(--primary-100)]'
                                                    : 'border-[var(--border)] hover:border-[var(--primary-600)]'
                                                }`}
                                        >
                                            <CatIcon className={`w-6 h-6 ${uploadCategoria === cat.value ? 'text-[var(--primary-700)]' : 'text-[var(--text-muted)]'}`} />
                                            <span className="text-sm font-medium">{cat.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <FileUpload
                            onFileSelect={setSelectedFiles}
                            label="Archivos"
                            maxFiles={10}
                        />
                    </div>
                </Modal>
            </div>
        </MainLayout>
    );
}
