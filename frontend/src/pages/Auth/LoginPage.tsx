import React, { useState } from 'react';
import { authService } from '../../services/authService';
import Toast from '../../components/common/Toast';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'login' | 'cadastro'>('login');
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
        nomeCompleto: '',
        dataNascimento: '',
        genero: 'MASCULINO' as 'MASCULINO' | 'FEMININO' | 'OUTRO'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({show: false, message: '', type: 'success'});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.senha) {
            setToast({show: true, message: 'Por favor, preencha e-mail e senha!', type: 'error'});
            return;
        }

        setIsLoading(true);

        try {
            const resultado = await authService.login(formData.email, formData.senha);
            setIsLoading(false);

            if (resultado.success) {
                // Login bem-sucedido, redirecionar para dashboard
                window.location.href = '/dashboard';
            } else {
                setToast({show: true, message: resultado.message, type: 'error'});
            }
        } catch (error) {
            setIsLoading(false);
            setToast({show: true, message: 'Erro interno. Tente novamente.', type: 'error'});
            console.error('Erro no login:', error);
        }
    };

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nomeCompleto || !formData.email || !formData.dataNascimento || !formData.senha) {
            setToast({show: true, message: 'Por favor, preencha todos os campos!', type: 'error'});
            return;
        }

        setIsLoading(true);

        try {
            const resultado = await authService.cadastrar({
                nomeCompleto: formData.nomeCompleto,
                email: formData.email,
                dataNascimento: formData.dataNascimento,
                genero: formData.genero,
                senha: formData.senha
            });

            setIsLoading(false);

            if (resultado.success) {
                // Mudar para aba de login automaticamente e manter email preenchido - SEM POPUP
                setActiveTab('login');
                setFormData({ email: formData.email, senha: '', nomeCompleto: '', dataNascimento: '', genero: 'MASCULINO' });
                
                // Feedback visual sutil no campo de email
                setTimeout(() => {
                    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
                    if (emailInput) {
                        emailInput.style.borderBottomColor = '#10B981';
                        emailInput.style.transition = 'border-color 0.3s ease';
                    }
                }, 100);
            } else {
                setToast({show: true, message: resultado.message, type: 'error'});
            }
        } catch (error) {
            setIsLoading(false);
            setToast({show: true, message: 'Erro interno. Tente novamente.', type: 'error'});
            console.error('Erro no cadastro:', error);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: '#ffffff'
        }}>
            {/* Lado Esquerdo - Animação e Ilustração */}
            <div style={{
                flex: '1',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh'
            }}>
                {/* Elementos animados de fundo */}
                <div style={{
                    position: 'absolute',
                    top: '15%',
                    left: '10%',
                    width: '200px',
                    height: '200px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                    borderRadius: '50%',
                    transform: 'translateY(0)',
                    transition: 'transform 2s ease-in-out',
                    zIndex: 1
                }} />

                <div style={{
                    position: 'absolute',
                    top: '60%',
                    left: '20%',
                    width: '150px',
                    height: '150px',
                    background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(79, 156, 249, 0.05) 100%)',
                    borderRadius: '50%',
                    transform: 'translateY(-10px)',
                    transition: 'transform 1.5s ease-in-out',
                    zIndex: 1
                }} />

                <div style={{
                    position: 'absolute',
                    top: '30%',
                    right: '15%',
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(245, 158, 11, 0.03) 100%)',
                    borderRadius: '50%',
                    transform: 'translateY(-5px)',
                    transition: 'transform 1.8s ease-in-out',
                    zIndex: 1
                }} />

                {/* Logo FIAP Fintech */}
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 10
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        F
                    </div>
                    <div style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1F2937',
                        letterSpacing: '-0.3px'
                    }}>
                        FIAP Fintech
                    </div>
                </div>

                {/* Conteúdo Central - Título e Ilustração */}
                <div style={{
                    textAlign: 'center',
                    zIndex: 5,
                    maxWidth: '450px',
                    padding: '0 40px'
                }}>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        color: '#1F2937',
                        marginBottom: '24px',
                        lineHeight: '1.1'
                    }}>
                        Hora de transformar suas finanças.
                    </h1>

                    {/* Ilustração animada */}
                    <div style={{
                        margin: '40px auto',
                        width: '300px',
                        height: '220px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* Pessoa estilizada */}
                        <div style={{
                            width: '90px',
                            height: '160px',
                            background: 'linear-gradient(135deg, #2563EB 0%, #4F9CF9 100%)',
                            borderRadius: '45px 45px 20px 20px',
                            position: 'relative',
                            marginRight: '30px',
                            transform: 'translateY(-8px)',
                            transition: 'transform 2s ease-in-out',
                            zIndex: 3
                        }}>
                            {/* Cabeça */}
                            <div style={{
                                width: '55px',
                                height: '55px',
                                background: '#FDE68A',
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '-27px',
                                left: '17px'
                            }} />
                            {/* Braço */}
                            <div style={{
                                width: '70px',
                                height: '25px',
                                background: 'linear-gradient(135deg, #2563EB 0%, #4F9CF9 100%)',
                                borderRadius: '12px',
                                position: 'absolute',
                                right: '-60px',
                                top: '45px',
                                transform: 'rotate(-15deg)',
                                zIndex: 2
                            }} />
                        </div>

                        {/* Dashboard/Cartão */}
                        <div style={{
                            width: '140px',
                            height: '90px',
                            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                            borderRadius: '16px',
                            position: 'relative',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                            border: '1px solid #E2E8F0',
                            transform: 'translateY(-12px)',
                            transition: 'transform 1.8s ease-in-out'
                        }}>
                            {/* Símbolo $ */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '36px',
                                fontWeight: 'bold',
                                color: '#2563EB'
                            }}>
                                $
                            </div>
                            {/* Detalhes decorativos */}
                            <div style={{
                                position: 'absolute',
                                top: '12px',
                                left: '12px',
                                width: '20px',
                                height: '3px',
                                background: '#CBD5E1',
                                borderRadius: '2px'
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                left: '12px',
                                width: '30px',
                                height: '3px',
                                background: '#CBD5E1',
                                borderRadius: '2px'
                            }} />
                        </div>

                        {/* Elementos decorativos flutuantes */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '40px',
                            width: '25px',
                            height: '25px',
                            background: 'rgba(37, 99, 235, 0.2)',
                            borderRadius: '50%',
                            transform: 'translateY(-6px)',
                            transition: 'transform 2.2s ease-in-out'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '50px',
                            width: '15px',
                            height: '15px',
                            background: 'rgba(251, 191, 36, 0.3)',
                            borderRadius: '50%',
                            transform: 'translateY(-4px)',
                            transition: 'transform 1.5s ease-in-out'
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '30px',
                            width: '12px',
                            height: '12px',
                            background: 'rgba(37, 99, 235, 0.15)',
                            borderRadius: '50%',
                            transform: 'translateY(-3px)',
                            transition: 'transform 2.5s ease-in-out'
                        }} />
                    </div>

                    <p style={{
                        fontSize: '18px',
                        color: '#6B7280',
                        lineHeight: '1.6',
                        marginBottom: '0'
                    }}>
                        O caminho está à sua frente. Você já deu seu primeiro passo rumo à transformação financeira e nós te guiaremos nessa jornada.
                    </p>
                </div>
            </div>

            {/* Lado Direito - Formulários */}
            <div style={{
                flex: '1',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                minHeight: '100vh'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px'
                }}>
                    {/* Abas ENTRAR/CADASTRAR */}
                    <div style={{
                        display: 'flex',
                        marginBottom: '40px',
                        borderBottom: '1px solid #E5E7EB'
                    }}>
                        <button
                            type="button"
                            onClick={() => setActiveTab('login')}
                            style={{
                                flex: 1,
                                padding: '16px 24px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'login' ? '2px solid #2563EB' : '2px solid transparent',
                                color: activeTab === 'login' ? '#2563EB' : '#9CA3AF',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                marginBottom: '-1px'
                            }}
                        >
                            {isLoading ? 'Entrando...' : 'ENTRAR'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('cadastro')}
                            style={{
                                flex: 1,
                                padding: '16px 24px',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'cadastro' ? '2px solid #2563EB' : '2px solid transparent',
                                color: activeTab === 'cadastro' ? '#2563EB' : '#9CA3AF',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                marginBottom: '-1px'
                            }}
                        >
                            CADASTRAR
                        </button>
                    </div>

                    {/* Formulário de Login */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin}>
                            <div style={{ marginBottom: '24px' }}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Seu email"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                />
                            </div>

                            <div style={{ marginBottom: '24px', position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    placeholder="Senha"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 50px 16px 16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#6B7280',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        padding: '4px'
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: isLoading ? '#9CA3AF' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    marginBottom: '24px',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                }}
                            >
                                {isLoading ? 'Entrando...' : 'ENTRAR'}
                            </button>
                        </form>
                    )}

                    {/* Formulário de Cadastro */}
                    {activeTab === 'cadastro' && (
                        <form onSubmit={handleCadastro}>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    name="nomeCompleto"
                                    value={formData.nomeCompleto}
                                    onChange={handleInputChange}
                                    placeholder="Nome completo"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                                <input
                                    type="date"
                                    name="dataNascimento"
                                    value={formData.dataNascimento}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                />
                                <select
                                    name="genero"
                                    value={formData.genero}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        flex: 1,
                                        padding: '16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                >
                                    <option value="MASCULINO">Masculino</option>
                                    <option value="FEMININO">Feminino</option>
                                    <option value="OUTRO">Outro</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '24px', position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    placeholder="Senha"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '16px 50px 16px 16px',
                                        background: '#ffffff',
                                        border: 'none',
                                        borderBottom: '1px solid #E5E7EB',
                                        borderRadius: '0',
                                        color: '#1F2937',
                                        fontSize: '16px',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = '#2563EB'}
                                    onBlur={(e) => e.target.style.borderBottomColor = '#E5E7EB'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '16px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: '#6B7280',
                                        fontSize: '16px',
                                        cursor: 'pointer',
                                        padding: '4px'
                                    }}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: isLoading ? '#9CA3AF' : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    marginBottom: '24px',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                }}
                        >
                            {isLoading ? 'Criando conta...' : 'CADASTRAR'}
                        </button>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                        <button
                            type="button"
                            onClick={() => window.location.href = '/home'}
                            style={{
                                color: '#2563EB',
                                background: 'none',
                                border: 'none',
                                fontSize: '14px',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            ← Voltar para homepage
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast para Notificações */}
            <Toast
                isOpen={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({...toast, show: false})}
            />
        </div>
    );
};

export default LoginPage;
