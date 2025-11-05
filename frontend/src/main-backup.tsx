import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

// VERSÃO SIMPLIFICADA - FOCO NO DEMO
import { GlobalStyles } from '@styles/GlobalStyles';
import tokens from '@styles/tokens';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { authService } from './services/authService';


// ============================================
// HOMEPAGE COMPONENTS
// ============================================

// Header Simplificado
const FintechHeader = () => (
    <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '16px 32px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
    }}>
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            {/* Logo FIAP Fintech */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <div style={{
                    width: '36px',
                    height: '36px',
                    background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '16px'
                }}>
                    F
                </div>
                <div>
                    <div style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '700',
                        fontFamily: '"Inter", sans-serif',
                        lineHeight: '1'
                    }}>
                        FIAP Fintech
                    </div>
                </div>
            </div>


            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                    onClick={() => window.location.href = '/login'}
                    style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '10px 18px',
                        borderRadius: '25px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                >
                    → Iniciar sessão
                </button>
            </div>
        </div>
    </header>
);

// Hero Section Principal
const FintechHeroSection = () => (
    <section style={{
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #60A5FA 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 32px',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            width: '100%'
        }}>
            {/* Content Left */}
            <div>
                <h1 style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    color: 'white',
                    lineHeight: '1.1',
                    marginBottom: '24px',
                    fontFamily: '"Inter", sans-serif',
                    letterSpacing: '-0.025em'
                }}>
                    A melhor solução<br />
                    para uma vida{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        financeira saudável
                    </span>
                </h1>

                <p style={{
                    fontSize: '20px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.6',
                    marginBottom: '40px',
                    maxWidth: '500px'
                }}>
                    Reúna todas as suas despesas em um único aplicativo
                    e simplifique suas finanças com o nosso gerenciador.
                </p>

                <p style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    maxWidth: '500px'
                }}>
                    * Sistema sujeito a análise. Desenvolvido exclusivamente para fins educacionais da FIAP por
                    estudantes, totalmente gratuito para estudantes.
                </p>


            </div>

            {/* Right side - Dashboard Preview */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '600px',
                position: 'relative'
            }}>
                {/* Main Dashboard Device */}
                <div style={{
                    width: '280px',
                    height: '500px',
                    background: 'linear-gradient(145deg, #1f2937 0%, #111827 100%)',
                    borderRadius: '40px',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                    transform: 'rotate(-8deg)',
                    overflow: 'hidden',
                    border: '6px solid transparent',
                    backgroundImage: 'linear-gradient(145deg, #1f2937 0%, #111827 100%), linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EF4444 100%)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                }}>
                    {/* Screen Content */}
                    <div style={{
                        padding: '24px 18px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '14px',
                            color: 'white'
                        }}>
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '600'
                            }}>
                                FIAP Fintech
                            </div>
                            <div style={{
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                color: 'white',
                                fontSize: '11px',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                            }}>
                                ONLINE
                            </div>
                        </div>


                        {/* Balance Card */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4F9CF9 0%, #3B82F6 100%)',
                            borderRadius: '18px',
                            padding: '18px',
                            marginBottom: '14px',
                            marginTop: '24px',
                            color: 'white',
                            boxShadow: '0 6px 16px rgba(79, 156, 249, 0.25)'
                        }}>
                            <div style={{
                                fontSize: '12px',
                                opacity: 0.9,
                                marginBottom: '4px'
                            }}>
                                Saldo Total
                            </div>
                            <div style={{
                                fontSize: '22px',
                                fontWeight: '600'
                            }}>
                                R$ 12.847,50
                            </div>
                        </div>

                        {/* Income and Expense Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px'
                        }}>
                            {/* Income */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)',
                                borderRadius: '14px',
                                padding: '14px',
                                color: '#FCD34D',
                                border: '1px solid rgba(251, 191, 36, 0.4)',
                                boxShadow: '0 3px 10px rgba(251, 191, 36, 0.15)'
                            }}>
                                <div style={{
                                    fontSize: '10px',
                                    opacity: 0.9,
                                    marginBottom: '4px'
                                }}>
                                    Receitas
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    R$ 8.500
                                </div>
                            </div>

                            {/* Expenses */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.25) 100%)',
                                borderRadius: '14px',
                                padding: '14px',
                                color: '#F87171',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                boxShadow: '0 3px 10px rgba(239, 68, 68, 0.15)'
                            }}>
                                <div style={{
                                    fontSize: '10px',
                                    opacity: 0.9,
                                    marginBottom: '4px'
                                }}>
                                    Gastos
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    R$ 3.200
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Notification Tooltip */}
                <div style={{
                    position: 'absolute',
                    top: '92px',
                    right: '65px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                    zIndex: 20,
                    whiteSpace: 'nowrap'
                }}>
                    <span style={{ fontSize: '14px' }}>💰</span>
                    <span>+R$ 2.500 hoje</span>
                </div>

                {/* Goal Badge */}
                <div style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '40px',
                    background: '#10B981',
                    color: 'white',
                    padding: '10px 18px',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                    zIndex: 10
                }}>
                    ✓ Meta: 78%
                </div>
            </div>
        </div>
    </section>
);


// ============================================
// LOGIN PAGE
// ============================================

const LoginPage = () => {
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.senha) {
            alert('❌ Por favor, preencha e-mail e senha!');
            return;
        }

        setIsLoading(true);

        try {
            const resultado = await authService.login(formData.email, formData.senha);
            setIsLoading(false);

            if (resultado.success) {
                alert(`✅ ${resultado.message}\n\n👋 Bem-vindo de volta, ${resultado.usuario?.nomeCompleto}!`);
                window.location.href = '/dashboard';
            } else {
                alert(`❌ ${resultado.message}`);
            }
        } catch (error) {
            setIsLoading(false);
            alert('❌ Erro interno. Tente novamente.');
            console.error('Erro no login:', error);
        }
    };

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nomeCompleto || !formData.email || !formData.dataNascimento || !formData.senha) {
            alert('❌ Por favor, preencha todos os campos!');
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
                alert(`🎉 Cadastro realizado com sucesso!\n\n👤 ${formData.nomeCompleto}\n📧 ${formData.email}\n\n✅ Conta criada no FIAP Fintech!\n🔐 Agora faça o login para acessar`);
                setActiveTab('login');
                setFormData({ email: formData.email, senha: '', nomeCompleto: '', dataNascimento: '', genero: 'MASCULINO' });
            } else {
                alert(`❌ ${resultado.message}`);
            }
        } catch (error) {
            setIsLoading(false);
            alert('❌ Erro interno. Tente novamente.');
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

                    {/* Ilustração animada similar à da Mobills */}
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
                            ENTRAR
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
        </div>
    );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const FintechApp = () => {
    return (
        <div style={{ minHeight: '100vh', background: '#0B1426' }}>
            <FintechHeader />
            <FintechHeroSection />
        </div>
    );
};

// ============================================
// DASHBOARD PAGE
// ============================================

const DashboardPage = () => {
    const usuario = authService.getCurrentUser();

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
                        Você precisa fazer login para acessar o dashboard.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                            background: '#1e40af',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                    >
                        Ir para Login
                    </button>
                </div>
            </div>
        );
    }

    const handleLogout = () => {
        if (confirm('🚪 Tem certeza que deseja sair?')) {
            authService.logout();
            alert('✅ Logout realizado com sucesso!\n\n👋 Até logo!');
            window.location.href = '/home';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8fafc',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
                            { name: 'Dashboard', path: '/dashboard', active: true },
                            { name: 'Transações', path: '/transacoes', active: false },
                            { name: 'Investimentos', path: '/investimentos', active: false },
                            { name: 'Metas', path: '/metas', active: false }
                        ].map((item, index) => (
                            <button
                                key={index}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: index === 0 ? '#1e40af' : '#64748b',
                                    fontSize: '15px',
                                    fontWeight: index === 0 ? '600' : '500',
                                    cursor: 'pointer',
                                    padding: '8px 0',
                                    position: 'relative',
                                    borderBottom: index === 0 ? '2px solid #1e40af' : '2px solid transparent',
                                    transition: 'color 0.2s'
                                }}
                                onClick={() => {
                                    if (item.name === 'Dashboard') return;
                                    window.location.href = item.path;
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
                                color: '#1F2937',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                {usuario.nomeCompleto.split(' ').map(name => name[0]).join('').substring(0, 2)}
                            </div>
                            <div>
                                <div style={{ color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                                    {usuario.nomeCompleto.split(' ')[0]}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '12px' }}>
                                    {usuario.email}
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
                {/* Welcome Section */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '32px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{
                                color: '#1e293b',
                                fontSize: '28px',
                                fontWeight: '700',
                                margin: '0 0 8px 0',
                                letterSpacing: '-0.025em'
                            }}>
                                Bem-vindo de volta, {usuario.nomeCompleto.split(' ')[0]}! 👋
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Aqui está um resumo da sua situação financeira
                            </p>
                        </div>

                        <div style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            border: '1px solid #bfdbfe'
                        }}>
                            📊 Dashboard Ativo
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px'
                    }}>
                        {[
                            { title: 'Saldo Total em Conta', value: 'R$ 127.840,50', change: '+12.5%', icon: '💰', color: '#10b981' },
                            { title: 'Receitas do Mês (Atual)', value: 'R$ 45.200,00', change: '+8.2%', icon: '📈', color: '#1e40af' },
                            { title: 'Gastos do Mês (Atual)', value: 'R$ 23.750,30', change: '-3.1%', icon: '📉', color: '#f59e0b' },
                            { title: 'Balanço Mensal (Mês Atual)', value: '78% atingida', change: 'Casa própria', icon: '🎯', color: '#8b5cf6' }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '24px',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>{stat.icon}</span>
                                    <span style={{
                                        color: stat.color,
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: `${stat.color}15`,
                                        padding: '4px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                                    {stat.title}
                                </div>
                                <div style={{ color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px'
                }}>
                    {[
                        {
                            icon: '💳',
                            title: 'Gerenciar Transações',
                            desc: 'Visualize, registre e gerencie todas suas transações',
                            color: '#1e40af',
                            bgColor: '#dbeafe',
                            onClick: () => window.location.href = '/transacoes'
                        },
                        {
                            icon: '🎯',
                            title: 'Definir Meta',
                            desc: 'Configure objetivos financeiros e acompanhe',
                            color: '#dc2626',
                            bgColor: '#fee2e2',
                            onClick: () => window.location.href = '/metas'
                        },
                        {
                            icon: '📈',
                            title: 'Investimentos',
                            desc: 'Gerencie sua carteira de investimentos',
                            color: '#7c3aed',
                            bgColor: '#ede9fe',
                            onClick: () => window.location.href = '/investimentos'
                        }
                    ].map((action, index) => (
                        <div
                            key={index}
                            style={{
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '28px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
                            }}
                            onClick={() => action.onClick ? action.onClick() : alert(`🔧 ${action.title}\n\nFuncionalidade em desenvolvimento!\n\n✅ Interface: Implementada\n✅ Design: Clean e moderno\n⏳ Backend: Em integração\n\n🎓 Projeto FIAP Fintech`)}
                        >
                            <div style={{
                                width: '64px',
                                height: '64px',
                                background: action.bgColor,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                fontSize: '28px'
                            }}>
                                {action.icon}
                            </div>

                            <h3 style={{
                                color: action.color,
                                fontSize: '20px',
                                fontWeight: '700',
                                margin: '0 0 12px 0'
                            }}>
                                {action.title}
                            </h3>

                            <p style={{
                                color: '#64748b',
                                fontSize: '15px',
                                lineHeight: '1.5',
                                margin: 0
                            }}>
                                {action.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Recent Activity */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '28px'
                    }}>
                        <h3 style={{
                            color: '#1e293b',
                            fontSize: '22px',
                            fontWeight: '700',
                            margin: 0
                        }}>
                            📋 Atividades Recentes
                        </h3>

                        <button style={{
                            color: '#1e40af',
                            background: 'none',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}>
                            Ver todas →
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { icon: '✅', text: 'Conta criada com sucesso', time: 'Agora mesmo', color: '#10b981' },
                            { icon: '🔐', text: 'Login realizado no sistema', time: 'Há poucos minutos', color: '#1e40af' },
                            { icon: '👤', text: 'Perfil atualizado', time: 'Hoje', color: '#64748b' },
                            { icon: '📊', text: 'Dashboard acessado', time: 'Hoje', color: '#8b5cf6' }
                        ].map((activity, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    background: '#f8fafc',
                                    borderRadius: '12px',
                                    border: '1px solid #f1f5f9'
                                }}
                            >
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    background: `${activity.color}15`,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px'
                                }}>
                                    {activity.icon}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        color: '#1e293b',
                                        fontSize: '15px',
                                        fontWeight: '600',
                                        marginBottom: '2px'
                                    }}>
                                        {activity.text}
                                    </div>
                                    <div style={{
                                        color: '#64748b',
                                        fontSize: '13px'
                                    }}>
                                        {activity.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

// ============================================
// PÁGINA DE TRANSAÇÕES
// ============================================

const TransacoesPage = () => {
    const usuario = authService.getCurrentUser();
    const [transacoes, setTransacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNovaTransacao, setShowNovaTransacao] = useState(false);

    // Inicializar sempre com o mês atual
    const obterPrimeiroDiaDoMesAtual = () => {
        const hoje = new Date();
        return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    };
    const [mesAtual] = useState(obterPrimeiroDiaDoMesAtual());

    // Carregar transações (simuladas por enquanto)
    useEffect(() => {
        const carregarTransacoes = async () => {
            try {
                setLoading(true);
                // Simular API call - substituir por API real depois
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Dados simulados para demonstração
                const transacoesSimuladas = [
                    {
                        id: 1,
                        data: '05/11/2025',
                        descricao: 'Teste com data atual automática',
                        categoria: 'Data Atual',
                        valor: 555.00,
                        tipo: 'receita'
                    },
                    {
                        id: 2,
                        data: '05/11/2025',
                        descricao: 'Nova transação',
                        categoria: 'Salário',
                        valor: 2000.00,
                        tipo: 'receita'
                    },
                    {
                        id: 3,
                        data: '05/11/2025',
                        descricao: 'Nova transação',
                        categoria: 'Freelance',
                        valor: 500.00,
                        tipo: 'receita'
                    },
                    {
                        id: 4,
                        data: '05/11/2025',
                        descricao: 'Nova transação',
                        categoria: 'Moradia',
                        valor: -230.00,
                        tipo: 'despesa'
                    }
                ];

                setTransacoes(transacoesSimuladas);
            } catch (error) {
                console.error('Erro ao carregar transações:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarTransacoes();
    }, []);

    // Filtrar transações por mês selecionado
    const transacoesFiltradas = transacoes.filter(t => {
        const [, mes, ano] = t.data.split('/');
        const mesTransacao = parseInt(mes) - 1;
        const anoTransacao = parseInt(ano);

        return mesTransacao === mesAtual.getMonth() &&
            anoTransacao === mesAtual.getFullYear();
    });

    // Calcular totais
    const receitas = transacoesFiltradas.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
    const despesas = transacoesFiltradas.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + Math.abs(t.valor), 0);
    const saldoAtual = receitas - despesas;

    // Função para formatar valor
    const formatarValor = (valor: number) => {
        const formatted = Math.abs(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        return valor < 0 ? `-${formatted}` : formatted;
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
                    <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Acesso Negado</h1>
                    <p style={{ marginBottom: '24px', opacity: 0.8 }}>
                        Você precisa fazer login para acessar as transações.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer'
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
            {/* Header */}
            <header style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '16px 24px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px'
                        }}>
                            💳
                        </div>
                        <div>
                            <h1 style={{
                                color: '#1e293b',
                                fontSize: '24px',
                                fontWeight: '700',
                                margin: 0
                            }}>
                                FIAP Fintech
                            </h1>
                            <div style={{
                                fontSize: '12px',
                                color: '#64748b',
                                fontWeight: '500'
                            }}>
                                Sistema de Controle Financeiro
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {[
                            { name: 'Dashboard', path: '/dashboard', active: false },
                            { name: 'Transações', path: '/transacoes', active: true },
                            { name: 'Investimentos', path: '/investimentos', active: false },
                            { name: 'Metas', path: '/metas', active: false }
                        ].map((item, index) => (
                            <button
                                key={index}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: item.active ? '#1e40af' : '#64748b',
                                    fontSize: '15px',
                                    fontWeight: item.active ? '600' : '500',
                                    cursor: 'pointer',
                                    padding: '8px 0',
                                    position: 'relative',
                                    borderBottom: item.active ? '2px solid #1e40af' : '2px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={() => {
                                    if (item.path.startsWith('/')) {
                                        window.location.href = item.path;
                                    }
                                }}
                                onMouseEnter={(e) => {
                                    if (!item.active) {
                                        e.currentTarget.style.color = '#3b82f6';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!item.active) {
                                        e.currentTarget.style.color = '#64748b';
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
                                width: '32px',
                                height: '32px',
                                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#1F2937',
                                fontSize: '12px',
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
                            onClick={() => {
                                if (confirm('Deseja realmente sair?')) {
                                    authService.logout();
                                    window.location.href = '/home';
                                }
                            }}
                            style={{
                                background: '#ef4444',
                                color: '#1F2937',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 24px 32px 24px' }}>
                {/* Welcome Section */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '32px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h2 style={{
                                color: '#1e293b',
                                fontSize: '28px',
                                fontWeight: '700',
                                margin: '0 0 8px 0'
                            }}>
                                💳 Transações de {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Gerencie suas receitas e despesas mensais
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNovaTransacao(true)}
                            style={{
                                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                color: '#1F2937',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            ➕ Nova Transação
                        </button>
                    </div>

                    {/* Cards de Resumo */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
                        {/* Receitas */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #22C55E 100%)',
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Receitas do Mês</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatarValor(receitas)}</div>
                        </div>

                        {/* Despesas */}
                        <div style={{
                            background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Gastos do Mês</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatarValor(despesas)}</div>
                        </div>

                        {/* Balanço */}
                        <div style={{
                            background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                            borderRadius: '16px',
                            padding: '24px',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>Balanço Mensal</div>
                            <div style={{ fontSize: '24px', fontWeight: '700' }}>{formatarValor(saldoAtual)}</div>
                        </div>
                    </div>
                </div>

                {/* Lista de Transações */}
                <div style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                    <h3 style={{
                        color: '#1e293b',
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '24px'
                    }}>
                        Transações de {mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
                            <p>Carregando transações...</p>
                        </div>
                    ) : transacoesFiltradas.length > 0 ? transacoesFiltradas.map((transacao) => (
                        <div key={transacao.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '16px',
                            border: '1px solid #f1f5f9',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            transition: 'all 0.2s ease'
                        }}>
                            {/* Status */}
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: '#10B981',
                                marginRight: '16px'
                            }} />

                            {/* Data */}
                            <div style={{
                                width: '100px',
                                fontSize: '14px',
                                color: '#6b7280',
                                marginRight: '16px'
                            }}>
                                {transacao.data}
                            </div>

                            {/* Descrição */}
                            <div style={{
                                flex: 1,
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#1f2937',
                                marginRight: '16px'
                            }}>
                                {transacao.descricao}
                            </div>

                            {/* Categoria */}
                            <div style={{
                                width: '120px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginRight: '16px'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    background: transacao.tipo === 'receita' ? '#10B981' : '#1E40AF',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px'
                                }}>
                                    {transacao.tipo === 'receita' ? '+' : '-'}
                                </div>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                    {transacao.categoria}
                                </span>
                            </div>

                            {/* Valor */}
                            <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: transacao.tipo === 'receita' ? '#10B981' : '#EF4444',
                                textAlign: 'right',
                                minWidth: '140px'
                            }}>
                                {formatarValor(transacao.valor)}
                            </div>
                        </div>
                    )) : (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#6B7280'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
                            <h3 style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#1F2937',
                                marginBottom: '8px'
                            }}>
                                Nenhuma transação encontrada
                            </h3>
                            <p style={{ marginBottom: '24px' }}>
                                Não há transações para o mês selecionado.
                            </p>
                            <button
                                onClick={() => setShowNovaTransacao(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                    color: '#1F2937',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                💰 Criar primeira transação
                            </button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Nova Transação */}
            {showNovaTransacao && (
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
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '32px',
                        width: '100%',
                        maxWidth: '500px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '700',
                                color: '#1F2937',
                                margin: 0
                            }}>
                                💰 Nova Transação
                            </h2>
                            <button
                                onClick={() => setShowNovaTransacao(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#6B7280',
                                    padding: '4px'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <p style={{
                            color: '#6B7280',
                            fontSize: '16px',
                            textAlign: 'center',
                            padding: '20px'
                        }}>
                            🚧 Modal de criação em desenvolvimento
                            <br />
                            ✅ Integração com Oracle Database preparada
                        </p>

                        <button
                            onClick={() => setShowNovaTransacao(false)}
                            style={{
                                width: '100%',
                                padding: '12px 24px',
                                border: 'none',
                                background: '#3B82F6',
                                color: '#1F2937',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '600'
                            }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// PÁGINA DE INVESTIMENTOS
// ============================================

const InvestimentosPage = () => {
    const usuario = authService.getCurrentUser();

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
                    <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Acesso Negado</h1>
                    <p style={{ marginBottom: '24px', opacity: 0.8 }}>
                        Você precisa fazer login para acessar os investimentos.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer'
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
            <header style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '16px 24px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h1 style={{
                        color: '#1e293b',
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: 0
                    }}>
                        📈 Investimentos
                    </h1>
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {[
                            { name: 'Dashboard', path: '/dashboard', active: false },
                            { name: 'Transações', path: '/transacoes', active: false },
                            { name: 'Investimentos', path: '/investimentos', active: true },
                            { name: 'Metas', path: '/metas', active: false }
                        ].map((item, index) => (
                            <button
                                key={index}
                                onClick={() => window.location.href = item.path}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: item.active ? '#1e40af' : '#64748b',
                                    fontSize: '15px',
                                    fontWeight: item.active ? '600' : '500',
                                    cursor: 'pointer'
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px'
                }}>
                    <h2 style={{
                        fontSize: '32px',
                        color: '#1e293b',
                        marginBottom: '16px'
                    }}>
                        📈 Página de Investimentos
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: '#64748b',
                        marginBottom: '32px'
                    }}>
                        Gerencie sua carteira de investimentos
                    </p>
                    <div style={{
                        background: '#ffffff',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '16px' }}>
                            🚧 Funcionalidades em desenvolvimento...
                            <br />
                            ✅ Integração com Oracle Database preparada
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ============================================
// PÁGINA DE METAS
// ============================================

const MetasPage = () => {
    const usuario = authService.getCurrentUser();

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
                    <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Acesso Negado</h1>
                    <p style={{ marginBottom: '24px', opacity: 0.8 }}>
                        Você precisa fazer login para acessar as metas.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer'
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
            <header style={{
                background: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
                padding: '16px 24px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <h1 style={{
                        color: '#1e293b',
                        fontSize: '24px',
                        fontWeight: '700',
                        margin: 0
                    }}>
                        🎯 Metas Financeiras
                    </h1>
                    <nav style={{ display: 'flex', gap: '32px' }}>
                        {[
                            { name: 'Dashboard', path: '/dashboard', active: false },
                            { name: 'Transações', path: '/transacoes', active: false },
                            { name: 'Investimentos', path: '/investimentos', active: false },
                            { name: 'Metas', path: '/metas', active: true }
                        ].map((item, index) => (
                            <button
                                key={index}
                                onClick={() => window.location.href = item.path}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: item.active ? '#1e40af' : '#64748b',
                                    fontSize: '15px',
                                    fontWeight: item.active ? '600' : '500',
                                    cursor: 'pointer'
                                }}
                            >
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px'
                }}>
                    <h2 style={{
                        fontSize: '32px',
                        color: '#1e293b',
                        marginBottom: '16px'
                    }}>
                        🎯 Página de Metas
                    </h2>
                    <p style={{
                        fontSize: '18px',
                        color: '#64748b',
                        marginBottom: '32px'
                    }}>
                        Defina e acompanhe suas metas financeiras
                    </p>
                    <div style={{
                        background: '#ffffff',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <p style={{ color: '#6b7280', fontSize: '16px' }}>
                            🚧 Funcionalidades em desenvolvimento...
                            <br />
                            ✅ Integração com Oracle Database preparada
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

// ============================================
// PÁGINA DE CADASTRO
// ============================================

const CadastroPage = () => {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        dataNascimento: '',
        genero: '',
        senha: '',
        confirmarSenha: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validação básica
        if (!formData.nomeCompleto || !formData.email || !formData.dataNascimento ||
            !formData.genero || !formData.senha || !formData.confirmarSenha) {
            alert('❌ Por favor, preencha todos os campos obrigatórios!');
            setLoading(false);
            return;
        }

        if (formData.senha.length < 6) {
            alert('❌ A senha deve ter no mínimo 6 caracteres!');
            setLoading(false);
            return;
        }

        if (formData.senha !== formData.confirmarSenha) {
            alert('❌ As senhas não coincidem!');
            setLoading(false);
            return;
        }

        // Verificar se e-mail já existe
        const usuarios = JSON.parse(localStorage.getItem('fiap_fintech_users') || '[]');
        const emailExiste = usuarios.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());

        if (emailExiste) {
            alert('❌ Este e-mail já está cadastrado! Faça login.');
            setLoading(false);
            return;
        }

        // Simular processo de cadastro
        setTimeout(() => {
            try {
                // Criar novo usuário
                const novoUsuario = {
                    id: Date.now(),
                    nomeCompleto: formData.nomeCompleto,
                    email: formData.email,
                    dataNascimento: formData.dataNascimento,
                    genero: formData.genero,
                    senha: formData.senha,
                    dataCriacao: new Date().toISOString()
                };

                // Salvar no localStorage
                usuarios.push(novoUsuario);
                localStorage.setItem('fiap_fintech_users', JSON.stringify(usuarios));

                alert(`🎉 Cadastro realizado com sucesso!\n\n👤 ${formData.nomeCompleto}\n📧 ${formData.email}\n\n✅ Conta criada no FIAP Fintech!\n🔐 Redirecionando para o login...`);

                // Redirecionar para login
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);

            } catch (error) {
                alert('❌ Erro ao criar conta. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Lado Esquerdo - Informações */}
            <div style={{
                flex: 1,
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                position: 'relative'
            }}>
                {/* Elementos decorativos */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '100px',
                    height: '100px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                }}></div>

                <div style={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '15%',
                    width: '150px',
                    height: '150px',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    transform: 'rotate(45deg)'
                }}></div>

                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    zIndex: 1
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        fontSize: '48px'
                    }}>
                        💰
                    </div>

                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        marginBottom: '16px',
                        letterSpacing: '-0.5px'
                    }}>
                        FIAP Fintech
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        opacity: 0.9,
                        lineHeight: '1.6',
                        maxWidth: '400px'
                    }}>
                        Sistema de controle financeiro inteligente para empresas e profissionais
                    </p>

                    <div style={{
                        marginTop: '40px',
                        padding: '24px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '16px'
                        }}>
                            ✨ Recursos Premium
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                            <span>📊 Dashboard em tempo real</span>
                            <span>🔒 Controle de transações</span>
                            <span>📈 Análise de investimentos</span>
                            <span>🎯 Metas financeiras</span>
                            <span>📋 Relatórios personalizados</span>
                            <span>🔐 Segurança avançada</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Formulário de Cadastro */}
            <div style={{
                flex: 1,
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '400px'
                }}>
                    {/* Logo no topo */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '40px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '16px'
                        }}>
                            💰
                        </div>
                        <div style={{
                            color: '#1e40af',
                            fontSize: '14px',
                            fontWeight: '700',
                            letterSpacing: '0.5px'
                        }}>
                            fiap fintech
                        </div>
                    </div>

                    {/* Título */}
                    <h1 style={{
                        color: '#1f2937',
                        fontSize: '28px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        lineHeight: '1.2'
                    }}>
                        Criar nova conta
                    </h1>

                    <p style={{
                        color: '#6b7280',
                        fontSize: '16px',
                        marginBottom: '32px'
                    }}>
                        Preencha seus dados para começar
                    </p>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Nome Completo */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }}>
                                👤
                            </div>
                            <input
                                type="text"
                                name="nomeCompleto"
                                placeholder="Nome completo"
                                value={formData.nomeCompleto}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                required
                            />
                        </div>

                        {/* E-mail */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }}>
                                📧
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                required
                            />
                        </div>

                        {/* Data de Nascimento */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }}>
                                📅
                            </div>
                            <input
                                type="date"
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                required
                            />
                        </div>

                        {/* Gênero */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }}>
                                ⚡
                            </div>
                            <select
                                name="genero"
                                value={formData.genero}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit',
                                    backgroundColor: 'white'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                required
                            >
                                <option value="">Selecione seu gênero</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                                <option value="NAO_INFORMADO">Prefiro não informar</option>
                            </select>
                        </div>

                        {/* Senha */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }}>
                                🔒
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="senha"
                                placeholder="Senha (mínimo 6 caracteres)"
                                value={formData.senha}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                minLength={6}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Confirmar Senha */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '18px'
                            }}>
                                🔐
                            </div>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmarSenha"
                                placeholder="Confirmar senha"
                                value={formData.confirmarSenha}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 48px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    fontFamily: 'inherit'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '18px'
                                }}
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Botão de Cadastro */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                                color: '#1F2937',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                marginTop: '8px'
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) {
                                    (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                                    (e.target as HTMLButtonElement).style.boxShadow = '0 8px 16px rgba(30, 64, 175, 0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!loading) {
                                    (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                                    (e.target as HTMLButtonElement).style.boxShadow = 'none';
                                }
                            }}
                        >
                            {loading ? '🔄 Criando conta...' : '🚀 Criar conta'}
                        </button>

                        {/* Divisor */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            margin: '24px 0'
                        }}>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                            <span style={{ color: '#6b7280', fontSize: '14px' }}>ou</span>
                            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                        </div>

                        {/* Botões de ação */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => window.location.href = '/login'}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    color: '#6b7280',
                                    border: '2px solid #e5e7eb',
                                    padding: '10px 20px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}
                            >
                                ← Voltar ao Login
                            </button>
                        </div>

                        {/* Termos */}
                        <p style={{
                            color: '#6b7280',
                            fontSize: '12px',
                            textAlign: 'center',
                            lineHeight: '1.4',
                            marginTop: '16px'
                        }}>
                            Ao criar sua conta, você concorda com nossos{' '}
                            <a
                                href="#"
                                style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('📋 Termos de Uso - Sistema de Demonstração\n\nEste é um ambiente de teste para fins educacionais.');
                                }}
                            >
                                Termos de Uso
                            </a> e{' '}
                            <a
                                href="#"
                                style={{ color: '#1e40af', textDecoration: 'none', fontWeight: '600' }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('🔒 Política de Privacidade - Sistema de Demonstração\n\nSeus dados são seguros e utilizados apenas para fins educacionais.');
                                }}
                            >
                                Política de Privacidade
                            </a>.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

// App Container
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// App Principal
function App() {
    return (
        <ThemeProvider theme={tokens}>
            <GlobalStyles />
            <AppContainer>
                <Router>
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route path="/home" element={<FintechApp />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/cadastro" element={<CadastroPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/transacoes" element={<TransacoesPage />} />
                        <Route path="/investimentos" element={<InvestimentosPage />} />
                        <Route path="/metas" element={<MetasPage />} />
                        <Route path="*" element={
                            <div style={{
                                minHeight: '100vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #0B1426 0%, #1E293B 100%)',
                                color: '#1F2937',
                                textAlign: 'center'
                            }}>
                                <div>
                                    <h1 style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '48px' }}>❌</h1>
                                    <h2 style={{ color: 'white', marginBottom: '1rem' }}>Página não encontrada</h2>
                                    <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                                        A página que você procura não existe.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = '/home'}
                                        style={{
                                            background: '#2563EB',
                                            color: '#1F2937',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        🏠 Ir para Home
                                    </button>
                                </div>
                            </div>
                        } />
                    </Routes>
                </Router>
            </AppContainer>
        </ThemeProvider>
    );
}

// Verificar se o elemento root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element não encontrado!');
}

// Renderizar aplicação
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);