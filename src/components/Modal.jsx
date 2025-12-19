'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    footer
}) {
    const modalRef = useRef(null);

    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className={`
          relative w-full ${sizeClasses[size]}
          bg-[var(--background-secondary)]/95 backdrop-blur-xl
          border border-[var(--border)]
          rounded-2xl shadow-2xl
          animate-fade-in max-h-[90vh] flex flex-col
          overflow-hidden
        `}
            >
                {/* Línea decorativa superior */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-[var(--surface-hover)] hover:bg-[var(--danger)]/20 transition-colors text-[var(--text-muted)] hover:text-[var(--danger)]"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 border-t border-[var(--border)] flex items-center justify-end gap-3 bg-[var(--glass-bg)]">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

// Componente para confirmar acciones
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'danger'
}) {
    const buttonClasses = {
        danger: 'btn btn-danger',
        warning: 'bg-[var(--warning)] text-black font-bold',
        primary: 'btn btn-primary'
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={buttonClasses[type]}
                    >
                        {confirmText}
                    </button>
                </>
            }
        >
            <p className="text-lg text-[var(--text-secondary)]">{message}</p>
        </Modal>
    );
}
