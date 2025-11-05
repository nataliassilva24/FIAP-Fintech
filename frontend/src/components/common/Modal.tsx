import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

/**
 * Componente Modal reutilizável 
 * Implementa padrão consistente para todos os modais da aplicação
 */
const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true
}) => {
    // Fechar modal com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            // Prevenir scroll do body quando modal aberto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getSizeStyles = () => {
        const sizes = {
            sm: { maxWidth: '400px' },
            md: { maxWidth: '500px' },
            lg: { maxWidth: '700px' },
            xl: { maxWidth: '900px' }
        };
        return sizes[size];
    };

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '16px'
            }}
            onClick={(e) => {
                // Fechar modal clicando no backdrop
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div 
                style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    ...getSizeStyles(),
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    animation: 'modalSlide 0.2s ease-out'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header do Modal */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '24px 32px',
                    borderBottom: '1px solid #E5E7EB'
                }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1F2937',
                        margin: 0
                    }}>
                        {title}
                    </h2>
                    
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '24px',
                                cursor: 'pointer',
                                color: '#6B7280',
                                padding: '4px',
                                borderRadius: '4px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F3F4F6';
                                e.currentTarget.style.color = '#374151';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'none';
                                e.currentTarget.style.color = '#6B7280';
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Conteúdo do Modal */}
                <div style={{ padding: '32px' }}>
                    {children}
                </div>
            </div>

            {/* CSS para animação */}
            <style>{`
                @keyframes modalSlide {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default Modal;
