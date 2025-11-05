import React, { useState } from 'react';
import { authService } from '../../services/authService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Toast from '../../components/common/Toast';

const ProfilePage: React.FC = () => {
    const usuario = authService.getCurrentUser();
    const [isEditing, setIsEditing] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const [saving, setSaving] = useState(false);

    // Estado do formulário de edição
    const [formData, setFormData] = useState({
        nomeCompleto: usuario?.nomeCompleto || '',
        email: usuario?.email || '',
        dataNascimento: usuario?.dataNascimento || '',
        genero: usuario?.genero || 'MASCULINO' as 'MASCULINO' | 'FEMININO' | 'OUTRO'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario?.idUsuario) return;

        if (!formData.nomeCompleto || !formData.email || !formData.dataNascimento) {
            setToast({ show: true, message: 'Por favor, preencha todos os campos obrigatórios!', type: 'error' });
            return;
        }

        setSaving(true);
        try {
            // Simular chamada para API de atualização de usuário
            // TODO: Implementar userService.updateUser() se necessário
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay da API

            setToast({ show: true, message: 'Perfil atualizado com sucesso!', type: 'success' });
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            setToast({ show: true, message: 'Erro interno. Tente novamente.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        authService.logout();
        window.location.href = '/home';
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setFormData({
            nomeCompleto: usuario?.nomeCompleto || '',
            email: usuario?.email || '',
            dataNascimento: usuario?.dataNascimento || '',
            genero: usuario?.genero || 'MASCULINO'
        });
    };

    // Se não está autenticado, redireciona para login
    if (!authService.isAuthenticated() || !usuario) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                color: '#334155',
                textAlign: 'center'
            }}>
                <div>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</div>
                    <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Acesso Negado</h1>
                    <p style={{ marginBottom: '24px', opacity: 0.8 }}>
                        Você precisa fazer login para acessar o perfil.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: '"Inter", sans-serif'
        }}>
            {/* Header Clean */}
            <header style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '72px'
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            F
                        </div>
                        <div>
                            <h1 style={{
                                color: '#1e293b',
                                fontSize: '22px',
                                fontWeight: '700',
                                margin: 0,
                                letterSpacing: '-0.025em'
                            }}>
                                FIAP Fintech
                            </h1>
                            <p style={{
                                color: '#64748b',
                                fontSize: '12px',
                                margin: 0,
                                fontWeight: '500'
                            }}>
                                Controle Financeiro
                            </p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {[
                            { name: 'Dashboard', path: '/dashboard' },
                            { name: 'Transações', path: '/transacoes' },
                            { name: 'Investimentos', path: '/investimentos' },
                            { name: 'Metas', path: '/metas' },
                            { name: 'Perfil', path: '/perfil' }
                        ].map((item, index) => (
                            <button
                                key={index}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: index === 4 ? '#1e40af' : '#64748b', // Perfil ativo
                                    fontSize: '15px',
                                    fontWeight: index === 4 ? '600' : '500',
                                    cursor: 'pointer',
                                    padding: '8px 0',
                                    position: 'relative',
                                    borderBottom: index === 4 ? '2px solid #1e40af' : '2px solid transparent',
                                    transition: 'color 0.2s'
                                }}
                                onClick={() => {
                                    if (item.path !== '/perfil') {
                                        window.location.href = item.path;
                                    }
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>

                    {/* User Menu */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px 16px',
                            background: '#f1f5f9',
                            borderRadius: '24px'
                        }}>
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
                                {usuario?.nomeCompleto?.split(' ').map(name => name[0]).join('').substring(0, 2) || 'US'}
                            </div>
                            <div>
                                <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                                    {usuario?.nomeCompleto?.split(' ')[0] || 'Usuário'}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '12px' }}>
                                    {usuario?.email || 'email@example.com'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            style={{
                                background: '#ffffff',
                                color: '#64748b',
                                border: '1px solid #e2e8f0',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                (e.target as HTMLButtonElement).style.background = '#fee2e2';
                                (e.target as HTMLButtonElement).style.color = '#dc2626';
                                (e.target as HTMLButtonElement).style.borderColor = '#fecaca';
                            }}
                            onMouseLeave={(e) => {
                                (e.target as HTMLButtonElement).style.background = '#ffffff';
                                (e.target as HTMLButtonElement).style.color = '#64748b';
                                (e.target as HTMLButtonElement).style.borderColor = '#e2e8f0';
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Header da Página */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '32px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h2 style={{
                                color: '#1e293b',
                                fontSize: '28px',
                                fontWeight: '700',
                                margin: '0 0 8px 0'
                            }}>
                                👤 Meu Perfil
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Gerencie suas informações pessoais e configurações da conta
                            </p>
                        </div>

                        {/* Botão Editar */}
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    background: '#f8fafc',
                                    color: '#1e40af',
                                    border: '1px solid #1e40af',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#eff6ff';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#f8fafc';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                ✏️ Editar Perfil
                            </button>
                        )}
                    </div>
                </div>

                {/* Card do Perfil */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    {isEditing ? (
                        /* Modo de Edição */
                        <form onSubmit={handleSaveProfile}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '24px',
                                marginBottom: '32px'
                            }}>
                                {/* Nome Completo */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Nome Completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="nomeCompleto"
                                        value={formData.nomeCompleto}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            background: '#ffffff',
                                            color: '#1F2937',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            background: '#ffffff',
                                            color: '#1F2937',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Gênero */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Gênero *
                                    </label>
                                    <select
                                        name="genero"
                                        value={formData.genero}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            background: '#ffffff',
                                            color: '#1F2937',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <option value="MASCULINO">Masculino</option>
                                        <option value="FEMININO">Feminino</option>
                                        <option value="OUTRO">Outro</option>
                                    </select>
                                </div>

                                {/* Data de Nascimento */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Data de Nascimento *
                                    </label>
                                    <input
                                        type="date"
                                        name="dataNascimento"
                                        value={formData.dataNascimento}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '16px',
                                            background: '#ffffff',
                                            color: '#1F2937',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                {/* Idade (calculada) */}
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Idade
                                    </label>
                                    <div style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        background: '#F9FAFB',
                                        color: '#6B7280',
                                        boxSizing: 'border-box'
                                    }}>
                                        {usuario?.idade} anos
                                    </div>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
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
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding: '12px 24px',
                                        border: 'none',
                                        background: saving ? '#9CA3AF' : 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {saving ? (
                                        <>
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid white',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            ✏️ Salvar Alterações
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Modo de Visualização */
                        <div>
                            {/* Avatar e Info Principal */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                                marginBottom: '32px',
                                padding: '24px',
                                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                                borderRadius: '12px',
                                border: '1px solid #bfdbfe'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {usuario.nomeCompleto.split(' ').map(name => name[0]).join('').substring(0, 2)}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#1e293b',
                                        margin: '0 0 4px 0'
                                    }}>
                                        {usuario.nomeCompleto}
                                    </h3>
                                    <p style={{
                                        fontSize: '16px',
                                        color: '#64748b',
                                        margin: '0 0 8px 0'
                                    }}>
                                        {usuario.email}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '14px',
                                            color: '#10b981',
                                            background: '#f0fdf4',
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            border: '1px solid #bbf7d0',
                                            fontWeight: '600'
                                        }}>
                                            ✅ Conta Ativa
                                        </span>
                                        <span style={{
                                            fontSize: '14px',
                                            color: '#64748b'
                                        }}>
                                            📅 Membro desde {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Informações Detalhadas */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '24px'
                            }}>
                                {/* Dados Pessoais */}
                                <div>
                                    <h4 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        marginBottom: '16px'
                                    }}>
                                        📋 Dados Pessoais
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Nome Completo:</span>
                                            <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                                {usuario.nomeCompleto}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Data de Nascimento:</span>
                                            <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                                {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')} ({usuario.idade} anos)
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Gênero:</span>
                                            <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                                {usuario.genero === 'MASCULINO' ? 'Masculino' : usuario.genero === 'FEMININO' ? 'Feminino' : 'Outro'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Informações da Conta */}
                                <div>
                                    <h4 style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#1e293b',
                                        marginBottom: '16px'
                                    }}>
                                        🔐 Informações da Conta
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Email:</span>
                                            <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                                {usuario.email}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Data de Cadastro:</span>
                                            <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                                {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <div>
                                            <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Status da Conta:</span>
                                            <div style={{
                                                display: 'inline-block',
                                                color: '#10b981',
                                                background: '#f0fdf4',
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                border: '1px solid #bbf7d0',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                marginTop: '4px'
                                            }}>
                                                ✅ Ativa
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botões de Ação */}
                            <div style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={cancelEdit}
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
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        padding: '12px 24px',
                                        border: 'none',
                                        background: saving ? '#9CA3AF' : 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                                        color: 'white',
                                        borderRadius: '8px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {saving ? (
                                        <>
                                            <div style={{
                                                width: '16px',
                                                height: '16px',
                                                border: '2px solid rgba(255,255,255,0.3)',
                                                borderTop: '2px solid white',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }}></div>
                                            Salvando...
                                        </>
                                    ) : (
                                        '✏️ Salvar Alterações'
                                    )}
                                </button>
                            </div>
                        </form>
                    ) : (
                    /* Modo de Visualização */
                    <div>
                        {/* Avatar e Info Principal */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            marginBottom: '32px',
                            padding: '24px',
                            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                            borderRadius: '12px',
                            border: '1px solid #bfdbfe'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '24px',
                                fontWeight: '700',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                {usuario.nomeCompleto.split(' ').map(name => name[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#1e293b',
                                    margin: '0 0 4px 0'
                                }}>
                                    {usuario.nomeCompleto}
                                </h3>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#64748b',
                                    margin: '0 0 8px 0'
                                }}>
                                    {usuario.email}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: '12px',
                                    alignItems: 'center'
                                }}>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#10b981',
                                        background: '#f0fdf4',
                                        padding: '4px 12px',
                                        borderRadius: '16px',
                                        border: '1px solid #bbf7d0',
                                        fontWeight: '600'
                                    }}>
                                        ✅ Conta Ativa
                                    </span>
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#64748b'
                                    }}>
                                        📅 Membro desde {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Informações Detalhadas */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '24px'
                        }}>
                            {/* Dados Pessoais */}
                            <div>
                                <h4 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '16px'
                                }}>
                                    📋 Dados Pessoais
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Nome Completo:</span>
                                        <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                            {usuario.nomeCompleto}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Data de Nascimento:</span>
                                        <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                            {new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')} ({usuario.idade} anos)
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Gênero:</span>
                                        <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                            {usuario.genero === 'MASCULINO' ? 'Masculino' : usuario.genero === 'FEMININO' ? 'Feminino' : 'Outro'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informações da Conta */}
                            <div>
                                <h4 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    marginBottom: '16px'
                                }}>
                                    🔐 Informações da Conta
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Email:</span>
                                        <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                            {usuario.email}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Data de Cadastro:</span>
                                        <div style={{ color: '#1e293b', fontSize: '16px', fontWeight: '600', marginTop: '4px' }}>
                                            {new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>Status da Conta:</span>
                                        <div style={{
                                            display: 'inline-block',
                                            color: '#10b981',
                                            background: '#f0fdf4',
                                            padding: '4px 12px',
                                            borderRadius: '16px',
                                            border: '1px solid #bbf7d0',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            marginTop: '4px'
                                        }}>
                                            ✅ Ativa
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </main>

            {/* Modal de Confirmação de Logout */}
            <ConfirmDialog
                isOpen={showLogoutConfirm}
                title="Sair do Sistema"
                message="Tem certeza que deseja encerrar sua sessão? Você precisará fazer login novamente para acessar o sistema."
                confirmText="Sim, Sair"
                cancelText="Cancelar"
                type="warning"
                onConfirm={confirmLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />

            {/* Toast para Notificações */}
            <Toast
                isOpen={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ ...toast, show: false })}
            />

            {/* CSS para animações */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
