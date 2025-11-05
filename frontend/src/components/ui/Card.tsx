import React from 'react';

interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    padding?: 'sm' | 'md' | 'lg';
    shadow?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

/**
 * Componente Card reutilizável
 * Implementa padrão consistente para todos os cards da aplicação
 */
const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    padding = 'md',
    shadow = 'sm',
    hover = false,
    className,
    onClick
}) => {
    const getPaddingStyles = () => {
        const paddings = {
            sm: '16px',
            md: '24px',
            lg: '32px'
        };
        return paddings[padding];
    };

    const getShadowStyles = () => {
        const shadows = {
            none: 'none',
            sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        };
        return shadows[shadow];
    };

    return (
        <div
            className={className}
            onClick={onClick}
            style={{
                background: '#ffffff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: getPaddingStyles(),
                boxShadow: getShadowStyles(),
                cursor: onClick ? 'pointer' : 'default',
                transition: hover ? 'all 0.2s ease' : 'none'
            }}
            onMouseEnter={(e) => {
                if (hover && onClick) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(0, 0, 0, 0.15)';
                }
            }}
            onMouseLeave={(e) => {
                if (hover && onClick) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = getShadowStyles();
                }
            }}
        >
            {(title || subtitle) && (
                <div style={{ marginBottom: '16px' }}>
                    {title && (
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#1F2937',
                            margin: '0 0 4px 0'
                        }}>
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p style={{
                            fontSize: '14px',
                            color: '#6B7280',
                            margin: 0
                        }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            
            {children}
        </div>
    );
};

export default Card;
