import React, { useState, useRef, useEffect } from 'react';
import { authService } from '../../services/authService';

interface UserDropdownProps {
    onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ onLogout }) => {
    const usuario = authService.getCurrentUser();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (!usuario) return null;

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            {/* User Info Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    borderRadius: '24px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    outline: 'none'
                }}
                onMouseEnter={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = '#e2e8f0';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isOpen) {
                        e.currentTarget.style.background = '#f1f5f9';
                    }
                }}
            >
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                }}>
                    {usuario.nomeCompleto?.split(' ').map(name => name[0]).join('').substring(0, 2) || 'US'}
                </div>
                <div style={{ textAlign: 'left' }}>
                    <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                        {usuario.nomeCompleto?.split(' ')[0] || 'Usuário'}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '12px' }}>
                        {usuario.email || 'email@example.com'}
                    </div>
                </div>
                <div style={{
                    color: '#64748b',
                    fontSize: '12px',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }}>
                    ▼
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    minWidth: '200px',
                    zIndex: 1000
                }}>
                    {/* Perfil Option */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            window.location.href = '/perfil';
                        }}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#1F2937',
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>👤</span>
                        <span>Meu Perfil</span>
                    </button>

                    {/* Logout Option */}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#DC2626',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'none';
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>🚪</span>
                        <span>Sair</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
