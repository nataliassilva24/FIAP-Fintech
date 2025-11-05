import React, { useEffect } from 'react';

interface ToastProps {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
    autoClose?: boolean;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({
    isOpen,
    message,
    type,
    onClose,
    autoClose = true,
    duration = 3000
}) => {
    useEffect(() => {
        if (isOpen && autoClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, autoClose, duration, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✅',
                    bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderColor: '#10b981'
                };
            case 'error':
                return {
                    icon: '❌',
                    bg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    borderColor: '#dc2626'
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderColor: '#f59e0b'
                };
            default:
                return {
                    icon: 'ℹ️',
                    bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    borderColor: '#2563eb'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'white',
            border: `1px solid ${styles.borderColor}20`,
            borderRadius: '12px',
            padding: '16px 20px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            minWidth: '300px',
            maxWidth: '500px',
            backdropFilter: 'blur(8px)',
            transform: 'translateX(0)',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <div style={{
                fontSize: '18px',
                flexShrink: 0
            }}>
                {styles.icon}
            </div>
            <div style={{
                flex: 1,
                fontSize: '14px',
                fontWeight: '500',
                color: '#1F2937'
            }}>
                {message}
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#6B7280',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                }}
            >
                ✕
            </button>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Toast;
