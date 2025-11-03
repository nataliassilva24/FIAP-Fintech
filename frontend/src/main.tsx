import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// VERSÃO SIMPLIFICADA - FOCO NO DEMO
import { GlobalStyles } from '@styles/GlobalStyles';
import tokens from '@styles/tokens';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { authService } from './services/authService';

// ============================================
// MODAL DE CADASTRO SIMPLES
// ============================================

const CadastroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        dataNascimento: '',
        genero: '',
        senha: ''
    });

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validação básica
        if (!formData.nomeCompleto || !formData.email || !formData.dataNascimento || !formData.genero || !formData.senha) {
            alert('❌ Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        if (formData.senha.length < 6) {
            alert('❌ A senha deve ter no mínimo 6 caracteres!');
            return;
        }

        // Tentar cadastrar via authService (sem auto-login)
        const usuarios = JSON.parse(localStorage.getItem('fiap_fintech_users') || '[]');

        // Verificar se email já existe
        const emailExiste = usuarios.find((u: any) => u.email.toLowerCase() === formData.email.toLowerCase());
        if (emailExiste) {
            alert('❌ Este e-mail já está cadastrado!');
            return;
        }

        // Criar novo usuário (sem auto-login)
        const novoUsuario = {
            id: Date.now(),
            nomeCompleto: formData.nomeCompleto,
            email: formData.email,
            dataNascimento: formData.dataNascimento,
            genero: formData.genero,
            senha: formData.senha,
            dataCriacao: new Date().toISOString()
        };

        // Salvar usuário
        usuarios.push(novoUsuario);
        localStorage.setItem('fiap_fintech_users', JSON.stringify(usuarios));

        alert(`🎉 Cadastro realizado com sucesso!\n\n👤 ${formData.nomeCompleto}\n📧 ${formData.email}\n\n✅ Conta criada no FIAP Fintech!\n🔐 Agora faça o login para acessar`);
        onClose();
        setTimeout(() => window.location.href = '/login', 1500);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
                position: 'relative'
            }}>
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0, 0, 0, 0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ×
                </button>

                {/* Header do Modal */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'linear-gradient(135deg, #2563EB 0%, #4F9CF9 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: '24px'
                    }}>
                        💰
                    </div>
                    <h2 style={{
                        color: '#1e293b',
                        fontSize: '28px',
                        fontWeight: '700',
                        marginBottom: '8px'
                    }}>
                        Criar Conta Demo
                    </h2>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '16px',
                        margin: 0
                    }}>
                        Acesse gratuitamente o FIAP Fintech
                    </p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            color: '#1e293b',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Nome Completo *
                        </label>
                        <input
                            type="text"
                            name="nomeCompleto"
                            value={formData.nomeCompleto}
                            onChange={handleInputChange}
                            placeholder="Seu nome completo"
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#f8f9fa',
                                border: '2px solid #e9ecef',
                                borderRadius: '10px',
                                color: '#1e293b',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            color: '#1e293b',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            E-mail *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            required
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#f8f9fa',
                                border: '2px solid #e9ecef',
                                borderRadius: '10px',
                                color: '#1e293b',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <label style={{
                                color: '#1e293b',
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                display: 'block'
                            }}>
                                Data Nascimento *
                            </label>
                            <input
                                type="date"
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleInputChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    background: '#f8f9fa',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '10px',
                                    color: '#1e293b',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                            />
                        </div>

                        <div>
                            <label style={{
                                color: '#1e293b',
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '8px',
                                display: 'block'
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
                                    padding: '14px',
                                    background: '#f8f9fa',
                                    border: '2px solid #e9ecef',
                                    borderRadius: '10px',
                                    color: '#1e293b',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            >
                                <option value="">Selecione</option>
                                <option value="MASCULINO">Masculino</option>
                                <option value="FEMININO">Feminino</option>
                                <option value="NAO_BINARIO">Não-binário</option>
                                <option value="NAO_INFORMADO">Prefiro não informar</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            color: '#1e293b',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '8px',
                            display: 'block'
                        }}>
                            Senha *
                        </label>
                        <input
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            placeholder="Mínimo 6 caracteres"
                            required
                            minLength={6}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#f8f9fa',
                                border: '2px solid #e9ecef',
                                borderRadius: '10px',
                                color: '#1e293b',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#2563EB'}
                            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '18px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)'
                        }}
                    >
                        Criar Conta
                    </button>

                    <div style={{
                        color: '#6b7280',
                        fontSize: '13px',
                        textAlign: 'center',
                        lineHeight: '1.5'
                    }}>
                        Ao criar sua conta, você concorda com nossos{' '}
                        <a
                            href="#"
                            style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600' }}
                            onClick={(e) => { e.preventDefault(); alert('📋 Termos de Uso - Sistema de Demonstração\n\nEste é um ambiente de teste para fins educacionais.'); }}
                        >
                            Termos de Uso
                        </a>
                        .{' '}
                        <br />
                        <small style={{ opacity: 0.8 }}>
                            Após criar a conta, faça login para acessar o sistema.
                        </small>
                    </div>
                </form>
            </div>
        </div>
    );
};

// ============================================
// HOMEPAGE COMPONENTS
// ============================================

// Header Simplificado
const FintechHeader = ({ onAbrirCadastro }: { onAbrirCadastro: () => void }) => (
    <header style={{
        background: '#0B1426',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    }}>
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            height: '64px'
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
                    background: 'linear-gradient(135deg, #2563EB 0%, #4F9CF9 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '16px'
                }}>
                    💰
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
                    <div style={{
                        color: '#94A3B8',
                        fontSize: '12px',
                        fontWeight: '400',
                        lineHeight: '1'
                    }}>
                        Controle Financeiro Inteligente
                    </div>
                </div>
            </div>

            {/* Navigation Simples */}
            <nav style={{ display: 'flex', gap: '32px' }}>
                <a href="#recursos" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                    Recursos
                </a>
                <a href="#demo" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                    Demo
                </a>
                <a href="#sobre" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                    Sobre
                </a>
            </nav>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                    onClick={() => window.location.href = '/login'}
                    style={{
                        background: 'transparent',
                        color: '#94A3B8',
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    Login
                </button>
                <button
                    onClick={onAbrirCadastro}
                    style={{
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Começar Demo
                </button>
            </div>
        </div>
    </header>
);

// Hero Section Principal
const FintechHeroSection = ({ onAbrirCadastro }: { onAbrirCadastro: () => void }) => (
    <section style={{
        background: 'linear-gradient(90deg, #0B1426 0%, #1E293B 70%, rgba(30, 41, 59, 0.8) 100%)',
        minHeight: '700px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
    }}>
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
            width: '100%'
        }}>
            {/* Content Left */}
            <div>
                <h1 style={{
                    fontSize: '56px',
                    fontWeight: '700',
                    color: 'white',
                    lineHeight: '1.1',
                    marginBottom: '32px',
                    fontFamily: '"Inter", sans-serif'
                }}>
                    Sistema de <span style={{ color: '#4F9CF9' }}>Controle Financeiro</span> Inteligente
                </h1>

                <p style={{
                    fontSize: '22px',
                    color: '#94A3B8',
                    lineHeight: '1.6',
                    marginBottom: '48px'
                }}>
                    Gerencie suas finanças pessoais, investimentos e metas de forma inteligente.
                    Com dashboard interativo, relatórios detalhados e controle total do seu dinheiro.
                </p>

                <div style={{
                    background: 'rgba(79, 156, 249, 0.1)',
                    border: '1px solid rgba(79, 156, 249, 0.2)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '48px'
                }}>
                    <h3 style={{ color: '#4F9CF9', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        🚀 Funcionalidades Principais:
                    </h3>
                    <ul style={{ color: '#CBD5E1', fontSize: '15px', lineHeight: '1.8', margin: 0, paddingLeft: '20px' }}>
                        <li>Dashboard financeiro em tempo real</li>
                        <li>Controle de transações e investimentos</li>
                        <li>Metas financeiras personalizadas</li>
                        <li>Relatórios e análises detalhadas</li>
                        <li>Interface moderna e intuitiva</li>
                    </ul>
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <button
                        onClick={onAbrirCadastro}
                        style={{
                            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '18px 40px',
                            borderRadius: '12px',
                            fontSize: '20px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)'
                        }}
                    >
                        🎯 Começar Demo Agora
                    </button>

                    <button
                        onClick={() => document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            background: 'transparent',
                            color: '#4F9CF9',
                            border: '2px solid #4F9CF9',
                            padding: '18px 40px',
                            borderRadius: '12px',
                            fontSize: '20px',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        Ver Recursos
                    </button>
                </div>
            </div>

            {/* Right side - Dashboard Preview Melhorado */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '500px'
            }}>
                <div style={{
                    width: '420px',
                    height: '320px',
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                    borderRadius: '20px',
                    border: '2px solid rgba(79, 156, 249, 0.4)',
                    padding: '32px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                    position: 'relative'
                }}>
                    <div style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        📊 Dashboard FIAP Fintech
                        <span style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #22C55E 100%)',
                            color: 'white',
                            fontSize: '11px',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '600'
                        }}>
                            DEMO ATIVO
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '6px' }}>Saldo Total</div>
                            <div style={{ color: '#10B981', fontSize: '24px', fontWeight: '700' }}>R$ 38.420</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '6px' }}>Este Mês</div>
                            <div style={{ color: '#4F9CF9', fontSize: '24px', fontWeight: '700' }}>+R$ 2.150</div>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(79, 156, 249, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px'
                        }}>
                            <span style={{ color: '#CBD5E1', fontSize: '14px' }}>Meta: Casa Própria</span>
                            <span style={{ color: '#4F9CF9', fontSize: '13px', fontWeight: '600' }}>68%</span>
                        </div>
                        <div style={{
                            width: '100%',
                            height: '6px',
                            background: '#1E293B',
                            borderRadius: '3px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: '68%',
                                height: '100%',
                                background: 'linear-gradient(90deg, #10B981 0%, #4F9CF9 100%)',
                                borderRadius: '3px'
                            }}></div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{
                            color: '#10B981',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            💡 Sistema ativo
                        </div>

                        <div style={{
                            background: 'rgba(79, 156, 249, 0.2)',
                            borderRadius: '8px',
                            padding: '8px 12px'
                        }}>
                            <div style={{ color: '#4F9CF9', fontSize: '11px', fontWeight: '600' }}>
                                🤖 IA habilitada
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// Seção de Recursos
const RecursosSection = ({ onAbrirCadastro }: { onAbrirCadastro: () => void }) => (
    <section id="recursos" style={{
        background: 'linear-gradient(135deg, #0B1426 0%, #1E293B 60%, #334155 100%)',
        padding: '100px 0',
        textAlign: 'center'
    }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <h2 style={{
                fontSize: '42px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '24px'
            }}>
                Tudo que Você Precisa em Um Só Lugar
            </h2>

            <p style={{
                fontSize: '20px',
                color: '#94A3B8',
                lineHeight: '1.6',
                marginBottom: '60px',
                maxWidth: '800px',
                margin: '0 auto 60px'
            }}>
                Sistema completo de gestão financeira pessoal desenvolvido com as melhores tecnologias.
            </p>

            {/* Grid de Recursos */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
                marginBottom: '60px'
            }}>
                {[
                    {
                        icon: '📊',
                        title: 'Dashboard Interativo',
                        desc: 'Visualize todas suas finanças em tempo real com gráficos e indicadores',
                        color: '#4F9CF9'
                    },
                    {
                        icon: '💰',
                        title: 'Controle de Transações',
                        desc: 'Gerencie entradas, saídas e transferências com categorização automática',
                        color: '#10B981'
                    },
                    {
                        icon: '📈',
                        title: 'Gestão de Investimentos',
                        desc: 'Acompanhe CDB, Tesouro, Ações, FII e outros investimentos em um só lugar',
                        color: '#F59E0B'
                    },
                    {
                        icon: '🎯',
                        title: 'Metas Financeiras',
                        desc: 'Defina objetivos e acompanhe o progresso de suas conquistas financeiras',
                        color: '#EF4444'
                    },
                    {
                        icon: '📋',
                        title: 'Relatórios Detalhados',
                        desc: 'Análises completas com gráficos e insights para tomada de decisão',
                        color: '#8B5CF6'
                    },
                    {
                        icon: '🔒',
                        title: 'Segurança Total',
                        desc: 'Criptografia bancária, autenticação segura e proteção de dados',
                        color: '#06B6D4'
                    }
                ].map((recurso, index) => (
                    <div key={index} style={{
                        background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                        border: `1px solid ${recurso.color}40`,
                        borderRadius: '20px',
                        padding: '32px',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '20px',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}>
                            {recurso.icon}
                        </div>
                        <h3 style={{
                            color: 'white',
                            fontSize: '22px',
                            fontWeight: '700',
                            marginBottom: '12px'
                        }}>
                            {recurso.title}
                        </h3>
                        <p style={{
                            color: '#94A3B8',
                            fontSize: '16px',
                            lineHeight: '1.6'
                        }}>
                            {recurso.desc}
                        </p>

                        {/* Glow effect */}
                        <div style={{
                            position: 'absolute',
                            top: '-50px',
                            right: '-50px',
                            width: '100px',
                            height: '100px',
                            background: `radial-gradient(circle, ${recurso.color}20 0%, transparent 70%)`,
                            borderRadius: '50%'
                        }}></div>
                    </div>
                ))}
            </div>

            {/* CTA Final */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                border: '2px solid #4F9CF9',
                borderRadius: '24px',
                padding: '48px',
                marginTop: '60px'
            }}>
                <h3 style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: '700',
                    marginBottom: '16px'
                }}>
                    Pronto para Começar?
                </h3>

                <p style={{
                    color: '#94A3B8',
                    fontSize: '18px',
                    marginBottom: '32px',
                    lineHeight: '1.6'
                }}>
                    Crie sua conta em menos de 2 minutos e tenha acesso completo ao sistema.
                    <br />
                    <strong style={{ color: '#4F9CF9' }}>100% gratuito para demonstração!</strong>
                </p>

                <button
                    onClick={onAbrirCadastro}
                    style={{
                        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '20px 48px',
                        borderRadius: '16px',
                        fontSize: '22px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 12px 32px rgba(37, 99, 235, 0.4)',
                        marginRight: '24px'
                    }}
                >
                    🚀 Criar Conta Demo
                </button>

                <button
                    onClick={() => alert('📊 FIAP Fintech - Sistema Completo:\n\n✅ Frontend: React + TypeScript + Styled Components\n✅ Backend: Spring Boot + JPA + Oracle/H2\n✅ Funcionalidades: Dashboard, Transações, Investimentos, Metas\n✅ Design: Inspirado no BTG Pactual\n✅ Arquitetura: MVC + REST APIs\n✅ Segurança: Autenticação JWT\n\n🎓 Projeto desenvolvido para FIAP\n🚀 Tecnologias modernas e boas práticas')}
                    style={{
                        background: 'transparent',
                        color: '#4F9CF9',
                        border: '2px solid #4F9CF9',
                        padding: '20px 48px',
                        borderRadius: '16px',
                        fontSize: '22px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    📋 Ver Detalhes Técnicos
                </button>
            </div>
        </div>
    </section>
);

// ============================================
// LOGIN PAGE
// ============================================

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        senha: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [lembrarDados, setLembrarDados] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email || !formData.senha) {
            alert('❌ Por favor, preencha e-mail e senha!');
            return;
        }

        setIsLoading(true);

        // Simular delay de rede
        setTimeout(() => {
            const resultado = authService.login(formData.email, formData.senha);

            setIsLoading(false);

            if (resultado.success) {
                alert(`✅ ${resultado.message}\n\n👋 Bem-vindo de volta, ${resultado.usuario?.nomeCompleto}!`);
                window.location.href = '/dashboard';
            } else {
                alert(`❌ ${resultado.message}`);
            }
        }, 1000);
    };

    // Dados de exemplo para ajudar o usuário
    const handleUseExample = () => {
        const stats = authService.getStats();
        if (stats.totalUsuarios === 0) {
            alert('📝 Nenhum usuário cadastrado ainda!\n\n🎯 Dica: Vá para a homepage e clique em "Começar Demo" para criar uma conta primeiro.');
            return;
        }

        alert('💡 Dica: Use o e-mail e senha que você cadastrou!\n\n📊 Estatísticas do sistema:\n' +
            `👥 Total de usuários: ${stats.totalUsuarios}\n` +
            `🔐 Usuário atual: ${stats.usuarioAtual}\n` +
            `✅ Autenticado: ${stats.isAuthenticated ? 'Sim' : 'Não'}`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Lado Esquerdo - Imagem Corporativa */}
            <div style={{
                flex: '1',
                background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.9) 0%, rgba(59, 130, 246, 0.8) 50%, rgba(37, 99, 235, 0.9) 100%), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30zM0 30c0 16.569 13.431 30 30 30V0C13.431 0 0 13.431 0 30z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: 'cover, 100px 100px',
                backgroundPosition: 'center, 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minWidth: '45%'
            }}>
                {/* Overlay Pattern */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />

                {/* Conteúdo do lado esquerdo */}
                <div style={{
                    textAlign: 'center',
                    color: 'white',
                    zIndex: 1,
                    maxWidth: '400px',
                    padding: '40px'
                }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 32px',
                        fontSize: '48px',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255,255,255,0.3)'
                    }}>
                        💰
                    </div>

                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '700',
                        marginBottom: '16px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}>
                        FIAP Fintech
                    </h1>

                    <p style={{
                        fontSize: '18px',
                        opacity: 0.9,
                        lineHeight: '1.6',
                        marginBottom: '32px'
                    }}>
                        Sistema de controle financeiro inteligente para empresas e profissionais
                    </p>

                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '12px'
                        }}>
                            ✨ Recursos Premium
                        </h3>
                        <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            fontSize: '14px',
                            lineHeight: '1.8'
                        }}>
                            <li>📊 Dashboard em tempo real</li>
                            <li>💰 Controle de transações</li>
                            <li>📈 Análise de investimentos</li>
                            <li>🎯 Metas financeiras</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Lado Direito - Formulário */}
            <div style={{
                flex: '1',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                minWidth: '55%',
                position: 'relative'
            }}>
                {/* Logo FIAP no canto superior direito */}
                <div style={{
                    position: 'absolute',
                    top: '40px',
                    right: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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

                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    marginTop: '60px'
                }}>
                    {/* Título */}
                    <h1 style={{
                        color: '#1f2937',
                        fontSize: '28px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        lineHeight: '1.2'
                    }}>
                        Faça o login para acessar a sua conta
                    </h1>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} style={{ marginTop: '32px' }}>
                        {/* Campo E-mail */}
                        <div style={{ marginBottom: '24px', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '16px',
                                pointerEvents: 'none'
                            }}>
                                👤
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="E-mail"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 16px 16px 44px',
                                    background: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    color: '#1f2937',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                        </div>

                        {/* Campo Senha */}
                        <div style={{ marginBottom: '24px', position: 'relative' }}>
                            <div style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9ca3af',
                                fontSize: '16px',
                                pointerEvents: 'none'
                            }}>
                                🔒
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                                placeholder="Senha"
                                required
                                style={{
                                    width: '100%',
                                    padding: '16px 50px 16px 44px',
                                    background: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    color: '#1f2937',
                                    fontSize: '16px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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
                                    color: '#9ca3af',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>

                        {/* Checkbox e link */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '32px'
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                color: '#4b5563'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={lembrarDados}
                                    onChange={(e) => setLembrarDados(e.target.checked)}
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        accentColor: '#1e40af'
                                    }}
                                />
                                Lembrar meus dados
                            </label>

                            <button
                                type="button"
                                onClick={handleUseExample}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1e40af',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Recuperar senha
                            </button>
                        </div>

                        {/* Botão Acessar */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: isLoading ? '#9ca3af' : '#1e40af',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                marginBottom: '24px',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
                            }}
                            onMouseLeave={(e) => {
                                if (!isLoading) (e.target as HTMLButtonElement).style.backgroundColor = '#1e40af';
                            }}
                        >
                            {isLoading ? 'Entrando...' : 'Acessar'}
                        </button>

                        {/* Termos */}
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            lineHeight: '1.5',
                            marginBottom: '32px'
                        }}>
                            Ao continuar, estou de acordo com a{' '}
                            <a href="#" style={{ color: '#1e40af', textDecoration: 'none' }}>
                                Política de privacidade
                            </a>{' '}
                            e{' '}
                            <a href="#" style={{ color: '#1e40af', textDecoration: 'none' }}>
                                Termos de uso
                            </a>
                            .
                        </p>


                        {/* Links de navegação */}
                        <div style={{
                            textAlign: 'center',
                            paddingTop: '20px',
                            borderTop: '1px solid #e5e7eb'
                        }}>
                            <p style={{
                                color: '#6b7280',
                                fontSize: '14px',
                                margin: '0 0 16px'
                            }}>
                                Ainda não tem conta?
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/home'}
                                    style={{
                                        background: '#f3f4f6',
                                        color: '#4b5563',
                                        border: '1px solid #d1d5db',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    ← Voltar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/cadastro'}
                                    style={{
                                        background: '#1e40af',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cadastrar-se
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ============================================
// MAIN APP COMPONENT
// ============================================

const FintechApp = () => {
    const [modalCadastroAberto, setModalCadastroAberto] = useState(false);

    const abrirModalCadastro = () => {
        setModalCadastroAberto(true);
    };

    const fecharModalCadastro = () => {
        setModalCadastroAberto(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0B1426' }}>
            <FintechHeader onAbrirCadastro={abrirModalCadastro} />
            <FintechHeroSection onAbrirCadastro={abrirModalCadastro} />
            <RecursosSection onAbrirCadastro={abrirModalCadastro} />

            {/* Modal de Cadastro */}
            <CadastroModal
                isOpen={modalCadastroAberto}
                onClose={fecharModalCadastro}
            />
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
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            💰
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
                        {['Dashboard', 'Transações', 'Investimentos', 'Metas', 'Relatórios'].map((item, index) => (
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
                                onClick={() => alert(`📊 ${item}\n\nFuncionalidade em desenvolvimento!\n\n🎓 Sistema FIAP Fintech`)}
                            >
                                {item}
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
                            { title: 'Saldo Total', value: 'R$ 127.840,50', change: '+12.5%', icon: '💰', color: '#10b981' },
                            { title: 'Receitas do Mês', value: 'R$ 45.200,00', change: '+8.2%', icon: '📈', color: '#1e40af' },
                            { title: 'Gastos do Mês', value: 'R$ 23.750,30', change: '-3.1%', icon: '📉', color: '#f59e0b' },
                            { title: 'Meta Atual', value: '78% atingida', change: 'Casa própria', icon: '🎯', color: '#8b5cf6' }
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
                            title: 'Nova Transação',
                            desc: 'Registre receitas, despesas e transferências',
                            color: '#1e40af',
                            bgColor: '#dbeafe'
                        },
                        {
                            icon: '📊',
                            title: 'Relatórios',
                            desc: 'Visualize análises detalhadas dos seus dados',
                            color: '#059669',
                            bgColor: '#d1fae5'
                        },
                        {
                            icon: '🎯',
                            title: 'Definir Meta',
                            desc: 'Configure objetivos financeiros e acompanhe',
                            color: '#dc2626',
                            bgColor: '#fee2e2'
                        },
                        {
                            icon: '📈',
                            title: 'Investimentos',
                            desc: 'Gerencie sua carteira de investimentos',
                            color: '#7c3aed',
                            bgColor: '#ede9fe'
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
                            onClick={() => alert(`🔧 ${action.title}\n\nFuncionalidade em desenvolvimento!\n\n✅ Interface: Implementada\n✅ Design: Clean e moderno\n⏳ Backend: Em integração\n\n🎓 Projeto FIAP Fintech`)}
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
                                color: 'white',
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
                        <Route path="*" element={
                            <div style={{
                                minHeight: '100vh',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #0B1426 0%, #1E293B 100%)',
                                color: 'white',
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
                                            color: 'white',
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