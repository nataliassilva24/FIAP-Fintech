import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { Meta, goalService } from '../../services/goalService';

const GoalsPage: React.FC = () => {
    const usuario = authService.getCurrentUser();
    const [metas, setMetas] = useState<Meta[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNovaMeta, setShowNovaMeta] = useState(false);
    const [showContribuicao, setShowContribuicao] = useState(false);
    const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);

    // Estado do formulário de nova meta
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        categoria: 'OUTROS' as 'EMERGENCIA' | 'INVESTIMENTO' | 'CASA' | 'VIAGEM' | 'EDUCACAO' | 'APOSENTADORIA' | 'ELETRONICOS' | 'OUTROS',
        valorNecessario: '',
        dataLimite: ''
    });
    const [saving, setSaving] = useState(false);
    
    // Estado do formulário de contribuição
    const [valorContribuicao, setValorContribuicao] = useState('');

    // Carregar metas reais do backend
    useEffect(() => {
        const carregarMetas = async () => {
            if (!usuario?.idUsuario) return;

            try {
                setLoading(true);
                const metasReais = await goalService.getGoalsByUser(usuario.idUsuario);
                setMetas(metasReais);
                console.log('✅ Metas carregadas:', metasReais);
            } catch (error) {
                console.error('Erro ao carregar metas:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarMetas();
    }, [usuario?.idUsuario]);

    // Calcular resumo usando service
    const summary = goalService.calculateSummary(metas);

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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario?.idUsuario) return;

        if (!formData.nome || !formData.valorNecessario) {
            return;
        }

        setSaving(true);
        try {
            const novaMeta = {
                idUsuario: usuario.idUsuario,
                nome: formData.nome,
                descricao: formData.descricao,
                categoria: formData.categoria,
                valorNecessario: parseFloat(formData.valorNecessario),
                dataLimite: formData.dataLimite || undefined
            };

            const resultado = await goalService.createGoal(novaMeta);

            if (resultado) {
                // Recarregar lista de metas
                const metasAtualizadas = await goalService.getGoalsByUser(usuario.idUsuario);
                setMetas(metasAtualizadas);

                // Fechar modal e resetar form
                setShowNovaMeta(false);
                setFormData({
                    nome: '',
                    descricao: '',
                    categoria: 'OUTROS',
                    valorNecessario: '',
                    dataLimite: ''
                });
            } else {
                console.error('Erro ao criar meta');
            }
        } catch (error) {
            console.error('Erro ao salvar meta:', error);
        } finally {
            setSaving(false);
        }
    };

    // Handler para adicionar contribuição
    const handleAddContribution = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!metaSelecionada?.idMeta || !valorContribuicao) return;

        setSaving(true);
        try {
            const valor = parseFloat(valorContribuicao);
            const sucesso = await goalService.addContribution(metaSelecionada.idMeta, valor);

            if (sucesso) {
                // Recarregar lista de metas
                if (usuario?.idUsuario) {
                    const metasAtualizadas = await goalService.getGoalsByUser(usuario.idUsuario);
                    setMetas(metasAtualizadas);
                }

                // Fechar modal e resetar form
                setShowContribuicao(false);
                setMetaSelecionada(null);
                setValorContribuicao('');
            } else {
                console.error('Erro ao adicionar contribuição');
            }
        } catch (error) {
            console.error('Erro ao adicionar contribuição:', error);
        } finally {
            setSaving(false);
        }
    };

    // Abrir modal de contribuição
    const abrirModalContribuicao = (meta: Meta) => {
        setMetaSelecionada(meta);
        setShowContribuicao(true);
        setValorContribuicao('');
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
                    {/* Logo e Navegação */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
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

                        {/* Navegação */}
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
                                        cursor: 'pointer',
                                        padding: '8px 0',
                                        position: 'relative',
                                        borderBottom: item.active ? '2px solid #1e40af' : '2px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* User Info e Logout */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                background: '#1e40af',
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
                            onClick={() => {
                                authService.logout();
                                window.location.href = '/login';
                            }}
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
                                margin: '0 0 8px 0'
                            }}>
                                🎯 Suas Metas Financeiras
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Defina objetivos e acompanhe seu progresso
                            </p>
                        </div>
                        {/* Botão Nova Meta */}
                        <button
                            onClick={() => setShowNovaMeta(true)}
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
                            ➕ Nova Meta
                        </button>
                    </div>

                    {/* Cards de Resumo - Design System Consistente */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '20px'
                    }}>
                        {[
                            {
                                title: 'Metas Ativas',
                                value: loading ? '⏳' : summary.metasAtivas.toString(),
                                change: '+2 este mês',
                                icon: '🎯',
                                color: '#1e40af'
                            },
                            {
                                title: 'Concluídas',
                                value: loading ? '⏳' : summary.metasConcluidas.toString(),
                                change: '+1 este mês',
                                icon: '✅',
                                color: '#10b981'
                            },
                            {
                                title: 'Progresso Geral',
                                value: loading ? '⏳' : `${summary.percentualGeralAlcancado.toFixed(1)}%`,
                                change: '+5.2% este mês',
                                icon: '📊',
                                color: '#8b5cf6'
                            },
                            {
                                title: 'Total Acumulado',
                                value: loading ? '⏳' : goalService.formatCurrency(summary.totalValorAcumulado),
                                change: '+12.8%',
                                icon: '💰',
                                color: '#f59e0b'
                            }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '20px',
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
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        background: `${stat.color}15`,
                                        padding: '4px 8px',
                                        borderRadius: '6px'
                                    }}>
                                        {stat.change}
                                    </span>
                                </div>
                                <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
                                    {stat.title}
                                </div>
                                <div style={{ color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lista de Metas com Barras de Progresso */}
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
                        Suas Metas
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
                            <p>Carregando metas...</p>
                        </div>
                    ) : metas.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#6B7280'
                        }}>
                            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>🎯</div>
                            <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#374151' }}>
                                Nenhuma meta encontrada
                            </h3>
                            <p style={{ marginBottom: '32px', fontSize: '14px', opacity: 0.8 }}>
                                Que tal criar sua primeira meta financeira?
                            </p>
                            <button
                                onClick={() => setShowNovaMeta(true)}
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
                                🎯 Criar primeira meta
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {metas.map((meta, index) => {
                                const progressColor = goalService.getProgressColor(meta.percentualAlcancado, meta.vencida);
                                const diasProgresso = goalService.calculateDaysFromCreation(meta.dataCriacao);
                                const progressoDiario = goalService.calculateDailyProgress(meta);

                                return (
                                    <div
                                        key={meta.idMeta || index}
                                        style={{
                                            padding: '24px',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            transition: 'all 0.2s',
                                            background: '#ffffff',
                                            position: 'relative'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = '#c7d2fe';
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = '#e2e8f0';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        {/* Header da Meta */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '12px',
                                                    background: `${goalService.getCategoriaColor(meta.categoria)}15`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '18px'
                                                }}>
                                                    {goalService.getCategoriaIcon(meta.categoria)}
                                                </div>
                                                <div>
                                                    <h4 style={{
                                                        fontSize: '18px',
                                                        fontWeight: '700',
                                                        color: '#1e293b',
                                                        margin: '0 0 4px 0'
                                                    }}>
                                                        {meta.nome}
                                                    </h4>
                                                    <div style={{
                                                        fontSize: '13px',
                                                        color: '#64748b',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px'
                                                    }}>
                                                        <span>{goalService.getCategoriaLabel(meta.categoria)}</span>
                                                        {meta.dataLimite && (
                                                            <>
                                                                <span>•</span>
                                                                <span>⏰ {goalService.formatDaysRemaining(meta.diasRestantes)}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{
                                                    fontSize: '20px',
                                                    fontWeight: '700',
                                                    color: progressColor,
                                                    marginBottom: '4px'
                                                }}>
                                                    {meta.percentualAlcancado.toFixed(1)}%
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#64748b'
                                                }}>
                                                    {goalService.formatCurrency(meta.valorAcumulado)} de {goalService.formatCurrency(meta.valorNecessario)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Descrição */}
                                        {meta.descricao && (
                                            <p style={{
                                                color: '#6b7280',
                                                fontSize: '14px',
                                                margin: '0 0 16px 0',
                                                lineHeight: '1.5'
                                            }}>
                                                {meta.descricao}
                                            </p>
                                        )}

                                        {/* Barra de Progresso */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{
                                                width: '100%',
                                                height: '8px',
                                                background: '#f1f5f9',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{
                                                    width: `${Math.min(meta.percentualAlcancado, 100)}%`,
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)',
                                                    borderRadius: '4px',
                                                    transition: 'width 0.3s ease',
                                                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                                                }}></div>
                                            </div>
                                        </div>

                                        {/* Footer com estatísticas */}
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            fontSize: '12px',
                                            color: '#64748b'
                                        }}>
                                            <div style={{ display: 'flex', gap: '16px' }}>
                                                <span>
                                                    💰 Falta: {goalService.formatCurrency(meta.valorRestante)}
                                                </span>
                                                {progressoDiario > 0 && (
                                                    <span 
                                                        title={`Baseado no progresso dos últimos ${goalService.formatDaysRemaining(diasProgresso)}`}
                                                        style={{ cursor: 'help' }}
                                                    >
                                                        📈 {goalService.formatCurrency(progressoDiario)}/dia
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {meta.vencida ? (
                                                    <span style={{ color: '#ef4444', fontWeight: '600' }}>
                                                        ⚠️ Vencida
                                                    </span>
                                                ) : meta.concluida ? (
                                                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                                                        🎉 Concluída
                                                    </span>
                                                ) : (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{ color: '#64748b' }}>
                                                            📅 Criada em {goalService.formatDate(meta.dataCriacao)}
                                                        </span>
                                                        <span style={{ color: '#6b7280' }}>•</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                abrirModalContribuicao(meta);
                                                            }}
                                                            style={{
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '8px',
                                                                padding: '8px 16px',
                                                                fontSize: '12px',
                                                                fontWeight: '700',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s',
                                                                boxShadow: '0 3px 6px rgba(16, 185, 129, 0.4)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '6px'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(16, 185, 129, 0.5)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = '0 3px 6px rgba(16, 185, 129, 0.4)';
                                                            }}
                                                            title={`Adicionar valor à meta "${meta.nome}"`}
                                                        >
                                                            💵 Adicionar valor
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal Nova Meta */}
            {showNovaMeta && (
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
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        maxHeight: '90vh',
                        overflowY: 'auto'
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
                                🎯 Nova Meta
                            </h2>
                            <button
                                onClick={() => setShowNovaMeta(false)}
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

                        {/* Formulário Completo de Nova Meta */}
                        <form onSubmit={handleSubmitGoal}>
                            {/* Nome da Meta */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Nome da Meta
                                </label>
                                <input
                                    type="text"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Casa própria, Viagem, Emergência..."
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

                            {/* Descrição */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Descrição (opcional)
                                </label>
                                <textarea
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    placeholder="Descreva sua meta..."
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            {/* Categoria */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Categoria
                                </label>
                                <select
                                    name="categoria"
                                    value={formData.categoria}
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
                                    <option value="EMERGENCIA">🚨 Reserva de Emergência</option>
                                    <option value="CASA">🏠 Casa Própria</option>
                                    <option value="INVESTIMENTO">📈 Investimento</option>
                                    <option value="VIAGEM">✈️ Viagem</option>
                                    <option value="EDUCACAO">📚 Educação</option>
                                    <option value="ELETRONICOS">📱 Eletrônicos</option>
                                    <option value="APOSENTADORIA">👴 Aposentadoria</option>
                                    <option value="OUTROS">🎯 Outros</option>
                                </select>
                            </div>

                            {/* Valor Necessário */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Valor da Meta
                                </label>
                                <input
                                    type="number"
                                    name="valorNecessario"
                                    value={formData.valorNecessario}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
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

                            {/* Data Limite (opcional) */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Data Limite (opcional)
                                </label>
                                <input
                                    type="date"
                                    name="dataLimite"
                                    value={formData.dataLimite}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '16px'
                                    }}
                                />
                                <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginTop: '4px'
                                }}>
                                    Deixe em branco para metas sem prazo
                                </div>
                            </div>

                            {/* Botões */}
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setShowNovaMeta(false)}
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
                                    {saving ? '⏳ Salvando...' : '🎯 Criar Meta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Adicionar Contribuição */}
            {showContribuicao && metaSelecionada && (
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
                        maxWidth: '450px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '24px'
                        }}>
                            <div>
                                <h2 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: '#1F2937',
                                    margin: '0 0 8px 0'
                                }}>
                                    💰 Adicionar Contribuição
                                </h2>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#64748b',
                                    fontSize: '14px'
                                }}>
                                    <span>{goalService.getCategoriaIcon(metaSelecionada.categoria)}</span>
                                    <span>{metaSelecionada.nome}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowContribuicao(false);
                                    setMetaSelecionada(null);
                                    setValorContribuicao('');
                                }}
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

                        {/* Progresso Atual */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>Progresso atual</span>
                                <span style={{ 
                                    color: goalService.getProgressColor(metaSelecionada.percentualAlcancado, metaSelecionada.vencida),
                                    fontSize: '16px',
                                    fontWeight: '700'
                                }}>
                                    {metaSelecionada.percentualAlcancado.toFixed(1)}%
                                </span>
                            </div>
                            
                            {/* Barra de Progresso */}
                            <div style={{
                                width: '100%',
                                height: '6px',
                                background: '#e5e7eb',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                marginBottom: '8px'
                            }}>
                                <div style={{
                                    width: `${Math.min(metaSelecionada.percentualAlcancado, 100)}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)',
                                    borderRadius: '3px',
                                    transition: 'width 0.3s ease',
                                    boxShadow: '0 1px 3px rgba(16, 185, 129, 0.2)'
                                }}></div>
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                color: '#64748b',
                                fontSize: '12px' 
                            }}>
                                <span>{goalService.formatCurrency(metaSelecionada.valorAcumulado)}</span>
                                <span>{goalService.formatCurrency(metaSelecionada.valorNecessario)}</span>
                            </div>
                        </div>

                        {/* Formulário de Contribuição */}
                        <form onSubmit={handleAddContribution}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Valor da Contribuição
                                </label>
                                <input
                                    type="number"
                                    value={valorContribuicao}
                                    onChange={(e) => setValorContribuicao(e.target.value)}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '16px',
                                        textAlign: 'right'
                                    }}
                                    required
                                    autoFocus
                                />
                                <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginTop: '4px'
                                }}>
                                    Quanto você quer adicionar à meta "{metaSelecionada.nome}"?
                                </div>
                            </div>

                            {/* Preview do novo progresso */}
                            {valorContribuicao && !isNaN(parseFloat(valorContribuicao)) && (
                                <div style={{
                                    background: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ color: '#059669', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                                        📊 Novo progresso após contribuição:
                                    </div>
                                    <div style={{ color: '#064e3b', fontSize: '14px' }}>
                                        {goalService.formatCurrency(metaSelecionada.valorAcumulado + parseFloat(valorContribuicao))} de {goalService.formatCurrency(metaSelecionada.valorNecessario)} 
                                        <span style={{ fontWeight: '700', marginLeft: '8px' }}>
                                            ({(((metaSelecionada.valorAcumulado + parseFloat(valorContribuicao)) / metaSelecionada.valorNecessario) * 100).toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Botões */}
                            <div style={{
                                display: 'flex',
                                gap: '16px',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowContribuicao(false);
                                        setMetaSelecionada(null);
                                        setValorContribuicao('');
                                    }}
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
                                    disabled={saving || !valorContribuicao}
                                    style={{
                                        background: (saving || !valorContribuicao) ? '#D1D5DB' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: (saving || !valorContribuicao) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {saving ? '⏳ Adicionando...' : '💵 Adicionar Valor'}
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

export default GoalsPage;
