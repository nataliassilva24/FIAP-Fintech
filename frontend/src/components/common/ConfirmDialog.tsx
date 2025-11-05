import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: '🗑️',
                    confirmBg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    iconBg: '#fef2f2',
                    iconColor: '#dc2626'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    confirmBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    iconBg: '#fffbeb',
                    iconColor: '#f59e0b'
                };
            default:
                return {
                    icon: 'ℹ️',
                    confirmBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    iconBg: '#eff6ff',
                    iconColor: '#2563eb'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div style={{
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
            backdropFilter: 'blur(4px)'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '32px',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                margin: '20px'
            }}>
                {/* Header com ícone */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: styles.iconBg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                    }}>
                        {styles.icon}
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1F2937',
                        margin: 0
                    }}>
                        {title}
                    </h2>
                </div>

                {/* Mensagem */}
                <p style={{
                    fontSize: '16px',
                    color: '#6B7280',
                    lineHeight: '1.6',
                    marginBottom: '32px',
                    margin: '0 0 32px 0'
                }}>
                    {message}
                </p>

                {/* Botões */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end'
                }}>
                    <button
                        onClick={onCancel}
                        style={{
                            padding: '12px 24px',
                            border: '1px solid #E5E7EB',
                            background: '#ffffff',
                            color: '#6B7280',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f9fafb';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                        }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            background: styles.confirmBg,
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            boxShadow: `0 4px 6px -1px ${styles.iconColor}40`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = `0 6px 8px -1px ${styles.iconColor}60`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = `0 4px 6px -1px ${styles.iconColor}40`;
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
