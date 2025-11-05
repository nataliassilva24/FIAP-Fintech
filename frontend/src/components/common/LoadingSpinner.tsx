import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    size = 'medium', 
    color = '#2563EB' 
}) => {
    const sizeMap = {
        small: '16px',
        medium: '24px',
        large: '32px'
    };

    return (
        <div
            style={{
                width: sizeMap[size],
                height: sizeMap[size],
                border: `2px solid ${color}20`,
                borderTop: `2px solid ${color}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}
        />
    );
};

export default LoadingSpinner;
