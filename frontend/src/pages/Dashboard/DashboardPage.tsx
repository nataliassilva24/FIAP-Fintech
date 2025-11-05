import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { dashboardService, DashboardStats } from '../../services/dashboardService';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import UserDropdown from '../../components/common/UserDropdown';

const DashboardPage: React.FC = () => {
    const usuario = authService.getCurrentUser();
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Função para obter o nome do período selecionado
    const getPeriodName = (period: string) => {
        if (!period) return '';
        const [year, month] = period.split('-');
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return `${months[parseInt(month) - 1]}/${year}`;
    };

    // Função para obter apenas o mês
    const getMonthName = (period: string) => {
        if (!period) return '';
        const [, month] = period.split('-');
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return months[parseInt(month) - 1];
    };

    // Labels dinâmicos baseados na seleção
    const getCardLabels = () => {
        if (!selectedPeriod) {
            return {
                receitas: 'Receitas Total',
                gastos: 'Gastos Totais', 
                balanco: 'Balanço Geral'
            };
        }
        const mes = getMonthName(selectedPeriod);
        return {
            receitas: `Receitas de ${mes}`,
            gastos: `Gastos de ${mes}`,
            balanco: `Balanço de ${mes}`
        };
    };

    // Labels dinâmicos para gráficos
    const getChartLabels = () => {
        if (!selectedPeriod) {
            return {
                despesas: 'Despesas por categoria',
                receitas: 'Receitas por categoria'
            };
        }
        const mes = getMonthName(selectedPeriod);
        return {
            despesas: `Despesas de ${mes} por categoria`,
            receitas: `Receitas de ${mes} por categoria`
        };
    };

    // Função para adaptar o layout baseado no valor - Sem quebra de linha
    const getAdaptiveLayout = (value: number) => {
        const formattedValue = dashboardService.formatCurrency(value);
        const valueLength = formattedValue.length;
        
        // Casos especiais para valores muito pequenos ou zero
        if (value === 0) {
            return {
                outerSize: 110,
                innerSize: 80,
                fontSize: '14px',
                containerPadding: '8px'
            };
        }
        
        if (value < 100) { // R$ 99,99
            return {
                outerSize: 120,
                innerSize: 85,
                fontSize: '15px',
                containerPadding: '8px'
            };
        }
        
        // Adaptação baseada no comprimento do texto formatado - mais generoso
        if (valueLength <= 8) { // R$ 999,99
            return {
                outerSize: 130,
                innerSize: 90,
                fontSize: '15px',
                containerPadding: '8px'
            };
        } else if (valueLength <= 11) { // R$ 99.999,99
            return {
                outerSize: 150,
                innerSize: 110,
                fontSize: '13px',
                containerPadding: '8px'
            };
        } else if (valueLength <= 14) { // R$ 999.999,99
            return {
                outerSize: 170,
                innerSize: 130,
                fontSize: '12px',
                containerPadding: '8px'
            };
        } else if (valueLength <= 17) { // R$ 999.999.999,99
            return {
                outerSize: 190,
                innerSize: 150,
                fontSize: '11px',
                containerPadding: '8px'
            };
        } else { // Valores extremamente grandes
            return {
                outerSize: 210,
                innerSize: 170,
                fontSize: '10px',
                containerPadding: '8px'
            };
        }
    };

    // Carregar dados do dashboard
    useEffect(() => {
        if (usuario?.idUsuario) {
            loadDashboardData();
        }
    }, [selectedPeriod, usuario?.idUsuario]);

    const loadDashboardData = async () => {
        if (!usuario?.idUsuario) return;
        
        setLoading(true);
        try {
            const data = await dashboardService.getDashboardData(usuario.idUsuario, selectedPeriod);
            setDashboardData(data);
        } catch (error) {
            console.error('Erro ao carregar dados do dashboard:', error);
            // Manter dados atuais ou usar mock em caso de erro
        } finally {
            setLoading(false);
        }
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
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        authService.logout();
        window.location.href = '/home';
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
                                {selectedPeriod 
                                    ? `Aqui está um resumo da sua situação financeira para ${getPeriodName(selectedPeriod)}`
                                    : 'Aqui está um resumo geral da sua situação financeira'
                                }
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                            border: '1px solid #93C5FD',
                            borderRadius: '12px',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.15)',
                            minWidth: '180px',
                            transition: 'all 0.3s ease'
                        }}>
                            <span style={{ fontSize: '16px' }}>📅</span>
                            
                            <input
                                type="month"
                                value={selectedPeriod || ''}
                                onChange={(e) => {
                                    setSelectedPeriod(e.target.value);
                                    console.log('Período alterado para:', e.target.value ? getPeriodName(e.target.value) : 'Totais gerais');
                                    // Os dados serão recarregados automaticamente pelo useEffect
                                }}
                                placeholder="Selecionar período"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#1E40AF',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    width: '140px'
                                }}
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '20px'
                    }}>
                        {(() => {
                            const statsData = loading || !dashboardData ? [
                                { title: 'Saldo Total em Conta', value: 'Carregando...', change: '-', icon: '💰', color: '#10b981' },
                                { title: getCardLabels().receitas, value: 'Carregando...', change: '-', icon: '📈', color: '#1e40af' },
                                { title: getCardLabels().gastos, value: 'Carregando...', change: '-', icon: '📉', color: '#f59e0b' },
                                { title: getCardLabels().balanco, value: 'Carregando...', change: '-', icon: '⚖️', color: '#8b5cf6' }
                            ] : [
                                { 
                                    title: 'Saldo Total em Conta', 
                                    value: dashboardService.formatCurrency(dashboardData.cards.saldoTotal), 
                                    change: dashboardService.calculatePercentageChange(dashboardData.cards.saldoTotal, 100000), 
                                    icon: '💰', 
                                    color: '#10b981' 
                                },
                                { 
                                    title: getCardLabels().receitas, 
                                    value: dashboardService.formatCurrency(dashboardData.cards.receitasTotal), 
                                    change: dashboardService.calculatePercentageChange(dashboardData.cards.receitasTotal, 40000), 
                                    icon: '📈', 
                                    color: '#1e40af' 
                                },
                                { 
                                    title: getCardLabels().gastos, 
                                    value: dashboardService.formatCurrency(dashboardData.cards.gastosTotal), 
                                    change: dashboardService.calculatePercentageChange(dashboardData.cards.gastosTotal, 20000), 
                                    icon: '📉', 
                                    color: '#f59e0b' 
                                },
                                { 
                                    title: getCardLabels().balanco, 
                                    value: dashboardService.formatCurrency(dashboardData.cards.receitasTotal - dashboardData.cards.gastosTotal), 
                                    change: '+85.2%', 
                                    icon: '⚖️', 
                                    color: '#8b5cf6' 
                                }
                            ];

                            return statsData.map((stat, index) => (
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
                            ));
                        })()}
                    </div>

                    {/* Charts Section - dentro do card principal */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginTop: '32px'
                    }}>
                        {/* Despesas por Categoria */}
                        <div>
                            <h3 style={{
                                color: '#64748b',
                                fontSize: '16px',
                                fontWeight: '500',
                                margin: '0 0 24px 0',
                                textAlign: 'center'
                            }}>
                                {getChartLabels().despesas}
                            </h3>
                            
                            {/* Gráfico de Pizza Centralizado - Layout Adaptável */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                {(() => {
                                    const totalDespesas = dashboardData?.despesasPorCategoria.reduce((total, cat) => total + cat.valor, 0) || 0;
                                    const layout = getAdaptiveLayout(totalDespesas);
                                    
                                    return (
                                        <div style={{
                                            width: `${layout.outerSize}px`,
                                            height: `${layout.outerSize}px`,
                                            borderRadius: '50%',
                                            background: `conic-gradient(
                                                from 0deg,
                                                #EF4444 0deg 120deg,
                                                #F59E0B 120deg 200deg,
                                                #8B5CF6 200deg 280deg,
                                                #E5E7EB 280deg 360deg
                                            )`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div style={{
                                                width: `${layout.innerSize}px`,
                                                height: `${layout.innerSize}px`,
                                                borderRadius: '50%',
                                                background: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                padding: layout.containerPadding
                                            }}>
                                                <div style={{ 
                                                    fontSize: layout.fontSize, 
                                                    fontWeight: '700', 
                                                    color: '#1F2937',
                                                    textAlign: 'center',
                                                    lineHeight: '1.2',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {loading ? '⏳' : dashboardService.formatCurrency(totalDespesas)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Legenda Horizontal - Quebra automática */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center' 
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    gap: '16px',
                                    justifyContent: 'center'
                                }}>
                                    {loading ? (
                                        <div>Carregando categorias...</div>
                                    ) : (
                                        dashboardData?.despesasPorCategoria.map((item, index) => {
                                            const colors = ['#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#F59E0B'];
                                            return { 
                                                color: colors[index] || '#9CA3AF', 
                                                label: item.categoria, 
                                                value: dashboardService.formatCurrency(item.valor).replace('R$ ', 'R$ ')
                                            };
                                        }) || []
                                    ).map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: '#F8FAFC',
                                            padding: '6px 12px',
                                            borderRadius: '16px',
                                            border: '1px solid #F1F5F9'
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: item.color
                                            }}></div>
                                            <div style={{
                                                color: '#6B7280',
                                                fontSize: '12px',
                                                marginRight: '4px'
                                            }}>
                                                {item.label}
                                            </div>
                                            <div style={{
                                                color: '#374151',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Receitas por Categoria */}
                        <div>
                            <h3 style={{
                                color: '#64748b',
                                fontSize: '16px',
                                fontWeight: '500',
                                margin: '0 0 24px 0',
                                textAlign: 'center'
                            }}>
                                {getChartLabels().receitas}
                            </h3>
                            
                            {/* Gráfico de Pizza Centralizado - Layout Adaptável */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                {(() => {
                                    const totalReceitas = dashboardData?.receitasPorCategoria.reduce((total, cat) => total + cat.valor, 0) || 0;
                                    const layout = getAdaptiveLayout(totalReceitas);
                                    
                                    return (
                                        <div style={{
                                            width: `${layout.outerSize}px`,
                                            height: `${layout.outerSize}px`,
                                            borderRadius: '50%',
                                            background: `conic-gradient(
                                                from 0deg,
                                                #10B981 0deg 240deg,
                                                #34D399 240deg 300deg,
                                                #E5E7EB 300deg 360deg
                                            )`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            transition: 'all 0.3s ease'
                                        }}>
                                            <div style={{
                                                width: `${layout.innerSize}px`,
                                                height: `${layout.innerSize}px`,
                                                borderRadius: '50%',
                                                background: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                padding: layout.containerPadding
                                            }}>
                                                <div style={{ 
                                                    fontSize: layout.fontSize, 
                                                    fontWeight: '700', 
                                                    color: '#1F2937',
                                                    textAlign: 'center',
                                                    lineHeight: '1.2',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {loading ? '⏳' : dashboardService.formatCurrency(totalReceitas)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Legenda Horizontal - Quebra automática */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center' 
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    gap: '16px',
                                    justifyContent: 'center'
                                }}>
                                    {loading ? (
                                        <div>Carregando categorias...</div>
                                    ) : (
                                        dashboardData?.receitasPorCategoria.map((item, index) => {
                                            const colors = ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'];
                                            return { 
                                                color: colors[index] || '#9CA3AF', 
                                                label: item.categoria, 
                                                value: dashboardService.formatCurrency(item.valor).replace('R$ ', 'R$ ')
                                            };
                                        }) || []
                                    ).map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: '#F8FAFC',
                                            padding: '6px 12px',
                                            borderRadius: '16px',
                                            border: '1px solid #F1F5F9'
                                        }}>
                                            <div style={{
                                                width: '8px',
                                                height: '8px',
                                                borderRadius: '50%',
                                                background: item.color
                                            }}></div>
                                            <div style={{
                                                color: '#6B7280',
                                                fontSize: '12px',
                                                marginRight: '4px'
                                            }}>
                                                {item.label}
                                            </div>
                                            <div style={{
                                                color: '#374151',
                                                fontSize: '12px',
                                                fontWeight: '600'
                                            }}>
                                                {item.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
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
                            onClick={action.onClick}
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
        </div>
    );
};

export default DashboardPage;
