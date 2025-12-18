'use client';

import { useState, useRef } from 'react';
import { Upload, File, X, Image, FileText, Archive, CheckCircle } from 'lucide-react';

export default function FileUpload({
    onFileSelect,
    maxFiles = 10,
    acceptedTypes = '*',
    label = 'Subir archivos'
}) {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return Image;
        if (type.includes('pdf') || type.includes('document')) return FileText;
        if (type.includes('zip') || type.includes('rar')) return Archive;
        return File;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        addFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
        const selectedFiles = Array.from(e.target.files);
        addFiles(selectedFiles);
    };

    const addFiles = (newFiles) => {
        const remainingSlots = maxFiles - files.length;
        const filesToAdd = newFiles.slice(0, remainingSlots).map(file => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            size: file.size,
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            status: 'ready'
        }));

        const updatedFiles = [...files, ...filesToAdd];
        setFiles(updatedFiles);
        onFileSelect?.(updatedFiles);
    };

    const removeFile = (id) => {
        const updatedFiles = files.filter(f => f.id !== id);
        setFiles(updatedFiles);
        onFileSelect?.(updatedFiles);
    };

    return (
        <div className="space-y-4">
            <label className="input-label">{label}</label>

            {/* Área de arrastrar archivos */}
            <div
                className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center
          transition-all duration-300 cursor-pointer
          ${isDragging
                        ? 'border-[var(--primary-600)] bg-[var(--primary-100)] scale-[1.02]'
                        : 'border-[var(--border-strong)] hover:border-[var(--primary-600)] hover:bg-[var(--surface-hover)]'
                    }
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes}
                    onChange={handleFileInput}
                    className="hidden"
                />

                <div className={`
          w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center
          transition-all duration-300
          ${isDragging
                        ? 'bg-[var(--primary-700)] text-white scale-110'
                        : 'bg-[var(--primary-100)] text-[var(--primary-700)]'
                    }
        `}>
                    <Upload className="w-10 h-10" />
                </div>

                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    {isDragging ? '¡Suelta los archivos aquí!' : 'Arrastra tus archivos aquí'}
                </h3>

                <p className="text-[var(--text-muted)] mb-4">
                    o haz clic para seleccionar archivos
                </p>

                <span className="inline-block px-4 py-2 bg-[var(--primary-700)] text-white rounded-xl font-semibold text-base hover:bg-[var(--primary-800)] transition-colors">
                    Seleccionar archivos
                </span>

                <p className="text-sm text-[var(--text-muted)] mt-4">
                    Máximo {maxFiles} archivos • PDF, Word, Excel, Imágenes
                </p>
            </div>

            {/* Lista de archivos */}
            {files.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-semibold text-[var(--text-primary)]">
                        Archivos seleccionados ({files.length})
                    </h4>

                    <div className="grid gap-3">
                        {files.map((file) => {
                            const FileIcon = getFileIcon(file.type);

                            return (
                                <div
                                    key={file.id}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--primary-600)] transition-colors group"
                                >
                                    {/* Preview o icono */}
                                    {file.preview ? (
                                        <img
                                            src={file.preview}
                                            alt={file.name}
                                            className="w-14 h-14 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-lg bg-[var(--primary-100)] flex items-center justify-center">
                                            <FileIcon className="w-7 h-7 text-[var(--primary-700)]" />
                                        </div>
                                    )}

                                    {/* Info del archivo */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-[var(--text-primary)] truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>

                                    {/* Estado */}
                                    <div className="flex items-center gap-2">
                                        {file.status === 'ready' && (
                                            <span className="flex items-center gap-1 text-[var(--success)] text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                Listo
                                            </span>
                                        )}

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFile(file.id);
                                            }}
                                            className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--danger-light)] hover:text-[var(--danger)] transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
