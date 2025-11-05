import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    icon?: string;
}

/**
 * Componente Button reutilizável com variants e tamanhos
 * Implementa padrão de Design System profissional
 */
const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    type = 'button',
    fullWidth = false,
    icon
}) => {
    const getVariantStyles = () => {
        const variants = {
            primary: {
                background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                color: 'white',
                border: 'none'
            },
            secondary: {
                background: '#F3F4F6',
                color: '#6B7280',
                border: '1px solid #E5E7EB'
            },
            success: {
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none'
            },
            danger: {
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: 'white',
                border: 'none'
            },
            outline: {
                background: 'transparent',
                color: '#3B82F6',
                border: '1px solid #3B82F6'
            }
        };
        return variants[variant];
    };

    const getSizeStyles = () => {
        const sizes = {
            sm: { padding: '8px 16px', fontSize: '14px' },
            md: { padding: '12px 24px', fontSize: '16px' },
            lg: { padding: '16px 32px', fontSize: '18px' }
        };
        return sizes[size];
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            style={{
                ...getVariantStyles(),
                ...getSizeStyles(),
                width: fullWidth ? '100%' : 'auto',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
                opacity: (disabled || loading) ? 0.6 : 1,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: icon ? '8px' : '0',
                boxShadow: variant === 'primary' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
                if (!disabled && !loading) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = variant === 'primary' 
                        ? '0 4px 8px rgba(59, 130, 246, 0.4)' 
                        : '0 2px 4px rgba(0, 0, 0, 0.1)';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = variant === 'primary' 
                        ? '0 2px 4px rgba(59, 130, 246, 0.3)' 
                        : 'none';
                }
            }}
        >
            {loading ? (
                <>
                    <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid transparent',
                        borderTop: '2px solid currentColor',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></span>
                    <span>Carregando...</span>
                </>
            ) : (
                <>
                    {icon && <span>{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
