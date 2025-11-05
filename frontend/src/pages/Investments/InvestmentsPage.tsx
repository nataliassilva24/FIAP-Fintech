import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { Investimento, investmentService } from '../../services/investmentService';
import UserDropdown from '../../components/common/UserDropdown';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const InvestmentsPage: React.FC = () => {
    const usuario = authService.getCurrentUser();
    const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNovoInvestimento, setShowNovoInvestimento] = useState(false);


    // Estado do formulário de novo investimento
    const [formData, setFormData] = useState({
        tipo: 'CDB' as 'CDB' | 'ACAO' | 'TESOURO_SELIC' | 'TESOURO_IPCA' | 'FUNDO_IMOBILIARIO' | 'DEBENTURE',
        valorInvestido: '',
        dataAplicacao: new Date().toISOString().split('T')[0]
    });
    const [saving, setSaving] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Logout handler
    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        authService.logout();
        window.location.href = '/home';
    };

    // Carregar investimentos reais do backend
    useEffect(() => {
        const carregarInvestimentos = async () => {
            if (!usuario?.idUsuario) return;

            try {
                setLoading(true);
                const investimentosReais = await investmentService.getInvestmentsByUser(usuario.idUsuario);
                setInvestimentos(investimentosReais);
                console.log('✅ Investimentos carregados:', investimentosReais);
            } catch (error) {
                console.error('Erro ao carregar investimentos:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarInvestimentos();
    }, [usuario?.idUsuario]);

    // Calcular resumo usando service (todos os investimentos)
    const summary = investmentService.calculateSummary(investimentos);

    // Se não está autenticado, mostrar tela de login
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

    // Handlers para o formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitInvestment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario?.idUsuario) return;

        if (!formData.tipo || !formData.valorInvestido) {
            return;
        }

        setSaving(true);
        try {
            const novoInvestimento = {
                idUsuario: usuario.idUsuario,
                tipo: formData.tipo,
                valorInvestido: parseFloat(formData.valorInvestido),
                dataAplicacao: formData.dataAplicacao
            };

            const resultado = await investmentService.createInvestment(novoInvestimento);

            if (resultado) {
                // Recarregar lista de investimentos
                const investimentosAtualizados = await investmentService.getInvestmentsByUser(usuario.idUsuario);
                setInvestimentos(investimentosAtualizados);

                // Fechar modal e resetar form
                setShowNovoInvestimento(false);
                setFormData({
                    tipo: 'CDB',
                    valorInvestido: '',
                    dataAplicacao: new Date().toISOString().split('T')[0]
                });

                // Sucesso silencioso - modal fecha e lista atualiza
            } else {
                console.error('Erro ao criar investimento');
            }
        } catch (error) {
            console.error('Erro ao salvar investimento:', error);
        } finally {
            setSaving(false);
        }
    };

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
                            { name: 'Metas', path: '/metas' }
                        ].map((item, index) => (
                            <button
                                key={index}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: index === 2 ? '#1e40af' : '#64748b',
                                    fontSize: '15px',
                                    fontWeight: index === 2 ? '600' : '500',
                                    cursor: 'pointer',
                                    padding: '8px 0',
                                    position: 'relative',
                                    borderBottom: index === 2 ? '2px solid #1e40af' : '2px solid transparent',
                                    transition: 'color 0.2s'
                                }}
                                onClick={() => {
                                    if (item.path !== '/investimentos') {
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

                    {/* User Dropdown */}
                    <UserDropdown onLogout={handleLogout} />
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
                                margin: '0 0 8px 0'
                            }}>
                                📈 Carteira de Investimentos
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Gerencie sua carteira de investimentos
                            </p>
                        </div>
                        {/* Botão Novo Investimento */}
                        <button
                                onClick={() => setShowNovoInvestimento(true)}
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
                                ➕ Novo Investimento
                        </button>
                    </div>

                    {/* Cards de Resumo - Design System Consistente */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px'
                    }}>
                        {[
                            {
                                title: 'Total Investido Ativo',
                                value: loading ? '⏳' : investmentService.formatCurrency(summary.totalAtivo),
                                change: '+15.8%',
                                icon: '💰',
                                color: '#10b981'
                            },
                            {
                                title: 'Renda Fixa',
                                value: loading ? '⏳' : investmentService.formatCurrency(summary.rendaFixa),
                                change: '+7.2%',
                                icon: '🏦',
                                color: '#3b82f6'
                            },
                            {
                                title: 'Renda Variável',
                                value: loading ? '⏳' : investmentService.formatCurrency(summary.rendaVariavel),
                                change: '+24.5%',
                                icon: '📈',
                                color: '#8b5cf6'
                            }
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

                {/* Lista de Investimentos */}
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
                        Seus Investimentos
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                            <div style={{
                                display: 'inline-block',
                                width: '32px',
                                height: '32px',
                                border: '3px solid #E5E7EB',
                                borderTop: '3px solid #3B82F6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginBottom: '16px'
                            }}></div>
                            <p>Carregando investimentos...</p>
                        </div>
                    ) : investimentos.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#6B7280'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>📈</div>
                            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                                Nenhum investimento encontrado
                            </h3>
                            <p style={{ marginBottom: '32px', fontSize: '14px', opacity: 0.8 }}>
                                Que tal criar seu primeiro investimento?
                            </p>
                            <button
                                onClick={() => setShowNovoInvestimento(true)}
                                style={{
                                    background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                💰 Criar primeiro investimento
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {investimentos.map((investimento, index) => (
                                <div
                                    key={investimento.idInvestimento || index}
                                    style={{
                                        padding: '20px',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                        background: '#ffffff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#c7d2fe';
                                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: investmentService.getTipoColor(investimento.tipo)
                                        }}></div>
                                        <div>
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '600',
                                                color: '#1e293b',
                                                marginBottom: '4px'
                                            }}>
                                                {investmentService.getTipoLabel(investimento.tipo)}
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#64748b'
                                            }}>
                                                Aplicado em: {investmentService.formatDate(investimento.dataAplicacao)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#1e293b',
                                            marginBottom: '4px'
                                        }}>
                                            {investmentService.formatCurrency(investimento.valorInvestido)}
                                        </div>
                                        {investimento.ativo ? (() => {
                                            const rendimento = investmentService.calculateReturn(investimento);
                                            const rendimentoFormatado = investmentService.formatReturn(rendimento);
                                            const diasAplicados = investmentService.calculateDaysApplied(investimento.dataAplicacao);
                                            const periodoFormatado = investmentService.formatDaysApplied(diasAplicados);
                                            
                                            return (
                                                <div 
                                                    style={{
                                                        fontSize: '12px',
                                                        color: rendimentoFormatado.cor,
                                                        fontWeight: '600',
                                                        cursor: 'help',
                                                        position: 'relative',
                                                        display: 'inline-block'
                                                    }}
                                                    title={`Aplicado há ${periodoFormatado} • ${investmentService.getTipoLabel(investimento.tipo)} • Valor atual: ${investmentService.formatCurrency(investimento.valorInvestido + rendimento.valor)}`}
                                                    onMouseEnter={(e) => {
                                                        // Criar tooltip customizado mais elegante
                                                        const tooltip = document.createElement('div');
                                                        tooltip.innerHTML = `
                                                            <div style="
                                                                background: rgba(0, 0, 0, 0.9);
                                                                color: white;
                                                                padding: 8px 12px;
                                                                border-radius: 6px;
                                                                font-size: 12px;
                                                                position: absolute;
                                                                bottom: 100%;
                                                                right: 0;
                                                                margin-bottom: 5px;
                                                                white-space: nowrap;
                                                                z-index: 1000;
                                                                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                                                            ">
                                                                <div style="font-weight: 600; margin-bottom: 4px;">
                                                                    📅 ${periodoFormatado} aplicado
                                                                </div>
                                                                <div style="opacity: 0.9;">
                                                                    💰 Valor atual: ${investmentService.formatCurrency(investimento.valorInvestido + rendimento.valor)}
                                                                </div>
                                                            </div>
                                                        `;
                                                        tooltip.style.position = 'absolute';
                                                        tooltip.style.pointerEvents = 'none';
                                                        e.currentTarget.appendChild(tooltip);
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        const tooltip = e.currentTarget.querySelector('div:last-child');
                                                        if (tooltip && tooltip !== e.currentTarget.firstChild) {
                                                            tooltip.remove();
                                                        }
                                                    }}
                                                >
                                                    {rendimentoFormatado.icone} {rendimentoFormatado.texto}
                                                </div>
                                            );
                                        })() : (
                                            <div style={{
                                                fontSize: '12px',
                                                color: '#6b7280',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                ⏹️ Resgatado
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Novo Investimento */}
            {showNovoInvestimento && (
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
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '32px',
                        width: '90%',
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
                                📈 Novo Investimento
                            </h2>
                            <button
                                onClick={() => setShowNovoInvestimento(false)}
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

                        {/* Formulário Completo de Novo Investimento */}
                        <form onSubmit={handleSubmitInvestment}>
                            {/* Tipo de Investimento */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Tipo de Investimento
                                </label>
                                <select
                                    name="tipo"
                                    value={formData.tipo}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        background: '#ffffff',
                                        cursor: 'pointer'
                                    }}
                                    required
                                >
                                    <option value="CDB">CDB</option>
                                    <option value="ACAO">Ações</option>
                                    <option value="TESOURO_SELIC">Tesouro Selic</option>
                                    <option value="TESOURO_IPCA">Tesouro IPCA+</option>
                                    <option value="FUNDO_IMOBILIARIO">Fundos Imobiliários</option>
                                    <option value="DEBENTURE">Debêntures</option>
                                </select>
                            </div>

                            {/* Valor */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Valor Investido
                                </label>
                                <input
                                    type="number"
                                    name="valorInvestido"
                                    value={formData.valorInvestido}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: `1px solid ${!formData.valorInvestido && formData.valorInvestido !== '' ? '#ef4444' : '#D1D5DB'}`,
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>

                            {/* Data */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Data da Aplicação
                                </label>
                                <input
                                    type="date"
                                    name="dataAplicacao"
                                    value={formData.dataAplicacao}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                    required
                                />
                            </div>

                            {/* Botões */}
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowNovoInvestimento(false)}
                                    style={{
                                        background: '#F3F4F6',
                                        color: '#6B7280',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{
                                        background: saving ? '#D1D5DB' : 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: saving ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {saving ? '⏳ Salvando...' : '💰 Criar Investimento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* CSS para animação de loading */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default InvestmentsPage;
