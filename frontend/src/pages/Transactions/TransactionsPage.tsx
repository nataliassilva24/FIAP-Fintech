import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { Transacao, transactionService } from '../../services/transactionService';

const TransactionsPage: React.FC = () => {
    const usuario = authService.getCurrentUser();
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNovaTransacao, setShowNovaTransacao] = useState(false);

    // Estado do período selecionado (mesmo padrão do dashboard)
    const [selectedPeriod, setSelectedPeriod] = useState('');

    // Estado do formulário de nova transação
    const [formData, setFormData] = useState({
        tipo: 'CREDITO' as 'CREDITO' | 'DEBITO',
        categoria: '',
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0]
    });
    const [saving, setSaving] = useState(false);

    // Funções de formatação de período (igual ao dashboard)
    const getPeriodName = (period: string) => {
        if (!period) return '';
        const [year, month] = period.split('-');
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return `${months[parseInt(month) - 1]}/${year}`;
    };

    const getMonthName = (period: string) => {
        if (!period) return '';
        const [, month] = period.split('-');
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        return months[parseInt(month) - 1];
    };

    // Labels dinâmicos baseados na seleção (igual ao dashboard)
    const getCardLabels = () => {
        if (!selectedPeriod) {
            return {
                receitas: 'Receitas Totais',
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

    // Carregar transações reais do backend
    useEffect(() => {
        const carregarTransacoes = async () => {
            if (!usuario?.idUsuario) return;

            try {
                setLoading(true);
                const transacoesReais = await transactionService.getTransacoesByUser(usuario.idUsuario);
                setTransacoes(transacoesReais);
                console.log('✅ Transações carregadas:', transacoesReais);
            } catch (error) {
                console.error('Erro ao carregar transações:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarTransacoes();
    }, [usuario?.idUsuario]);

    // Filtrar transações por período selecionado
    const transacoesFiltradas = transacoes.filter(t => {
        if (!selectedPeriod) return true; // Se nenhum período selecionado, mostrar todas

        const dataTransacao = new Date(t.data);
        const [year, month] = selectedPeriod.split('-');

        return dataTransacao.getMonth() === (parseInt(month) - 1) &&
            dataTransacao.getFullYear() === parseInt(year);
    });

    // Calcular totais usando service
    const { receitas, despesas, saldo } = transactionService.calculateTotals(transacoesFiltradas);

    // Handlers para o formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario?.idUsuario) return;

        if (!formData.categoria || !formData.descricao || !formData.valor) {
            alert('❌ Por favor, preencha todos os campos obrigatórios!');
            return;
        }

        setSaving(true);
        try {
            const novaTransacao = {
                idUsuario: usuario.idUsuario,
                tipoTransacao: formData.tipo,
                categoria: formData.categoria,
                descricao: formData.descricao,
                valor: parseFloat(formData.valor),
                data: formData.data
            };

            const resultado = await transactionService.createTransaction(novaTransacao);

            if (resultado) {
                // Recarregar lista de transações
                const transacoesAtualizadas = await transactionService.getTransacoesByUser(usuario.idUsuario);
                setTransacoes(transacoesAtualizadas);

                // Fechar modal e resetar form
                setShowNovaTransacao(false);
                setFormData({
                    tipo: 'CREDITO',
                    categoria: '',
                    descricao: '',
                    valor: '',
                    data: new Date().toISOString().split('T')[0]
                });

                console.log('✅ Transação criada com sucesso!');
            } else {
                alert('❌ Erro ao criar transação. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            alert('❌ Erro interno. Tente novamente.');
        } finally {
            setSaving(false);
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
            {/* Header - Idêntico ao Dashboard */}
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
                                    transition: 'color 0.2s'
                                }}
                                onClick={() => {
                                    if (item.name === 'Transações') return;
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
                            onClick={() => {
                                if (confirm('🚪 Tem certeza que deseja sair?')) {
                                    authService.logout();
                                    window.location.href = '/home';
                                }
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
                                💳 Transações {selectedPeriod ? `de ${getPeriodName(selectedPeriod)}` : 'Gerais'}
                            </h2>
                            <p style={{
                                color: '#64748b',
                                fontSize: '16px',
                                margin: 0
                            }}>
                                Gerencie suas receitas e despesas mensais
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Filtro de Período */}
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

                            {/* Botão Nova Transação */}
                            <button
                                onClick={() => setShowNovaTransacao(true)}
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
                                ➕ Nova Transação
                            </button>
                        </div>
                    </div>

                    {/* Cards de Resumo - Design System Consistente */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px'
                    }}>
                        {(() => {
                            const labels = getCardLabels();
                            return [
                                {
                                    title: labels.receitas,
                                    value: loading ? '⏳' : transactionService.formatCurrency(receitas),
                                    change: '+8.2%',
                                    icon: '📈',
                                    color: '#1e40af'
                                },
                                {
                                    title: labels.gastos,
                                    value: loading ? '⏳' : transactionService.formatCurrency(despesas),
                                    change: '-3.1%',
                                    icon: '📉',
                                    color: '#f59e0b'
                                },
                                {
                                    title: labels.balanco,
                                    value: loading ? '⏳' : transactionService.formatCurrency(saldo),
                                    change: saldo >= 0 ? '+85.2%' : '-12.5%',
                                    icon: '⚖️',
                                    color: saldo >= 0 ? '#10b981' : '#ef4444'
                                }
                            ];
                        })().map((stat, index) => (
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
                        Transações {selectedPeriod ? `de ${getPeriodName(selectedPeriod)}` : 'Gerais'}
                    </h3>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                border: '3px solid #f3f4f6',
                                borderTop: '3px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 16px'
                            }}></div>
                            <p>Carregando transações do backend...</p>
                        </div>
                    ) : transacoesFiltradas.length > 0 ? (
                        transacoesFiltradas.map((transacao) => (
                            <div key={transacao.idTransacao} style={{
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
                                    background: transacao.tipoTransacao === 'CREDITO' ? '#10B981' : '#EF4444',
                                    marginRight: '16px'
                                }} />

                                {/* Data */}
                                <div style={{
                                    width: '100px',
                                    fontSize: '14px',
                                    color: '#6b7280',
                                    marginRight: '16px'
                                }}>
                                    {transactionService.formatDate(transacao.data)}
                                </div>

                                {/* Descrição */}
                                <div style={{
                                    flex: 1,
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    marginRight: '16px'
                                }}>
                                    {transacao.descricao || 'Transação'}
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
                                        background: transacao.tipoTransacao === 'CREDITO' ? '#10B981' : '#EF4444',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}>
                                        {transacao.tipoTransacao === 'CREDITO' ? '+' : '-'}
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                                        {transacao.categoria}
                                    </span>
                                </div>

                                {/* Valor */}
                                <div style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: transacao.tipoTransacao === 'CREDITO' ? '#10B981' : '#EF4444',
                                    textAlign: 'right',
                                    minWidth: '140px'
                                }}>
                                    {transacao.tipoTransacao === 'CREDITO' ? '+' : '-'}{transactionService.formatCurrency(transacao.valor)}
                                </div>
                            </div>
                        ))
                    ) : (
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
                                    background: '#f8fafc',
                                    color: '#1e40af',
                                    border: '1px solid #1e40af',
                                    padding: '12px 24px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
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

                        {/* Formulário Completo de Nova Transação */}
                        <form onSubmit={handleSubmitTransaction}>
                            {/* Tipo de Transação */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Tipo de Transação *
                                </label>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'CREDITO' }))}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: formData.tipo === 'CREDITO' ? '2px solid #10B981' : '1px solid #E5E7EB',
                                            background: formData.tipo === 'CREDITO' ? 'rgba(16, 185, 129, 0.1)' : '#ffffff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: formData.tipo === 'CREDITO' ? '#10B981' : '#6B7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        📈 Receita
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'DEBITO' }))}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            border: formData.tipo === 'DEBITO' ? '2px solid #EF4444' : '1px solid #E5E7EB',
                                            background: formData.tipo === 'DEBITO' ? 'rgba(239, 68, 68, 0.1)' : '#ffffff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: formData.tipo === 'DEBITO' ? '#EF4444' : '#6B7280',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        📉 Despesa
                                    </button>
                                </div>
                            </div>

                            {/* Categoria */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Categoria *
                                </label>
                                <select
                                    name="categoria"
                                    value={formData.categoria}
                                    onChange={handleInputChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: '#ffffff',
                                        color: '#1F2937'
                                    }}
                                >
                                    <option value="">Selecionar categoria</option>
                                    {formData.tipo === 'CREDITO' ? (
                                        <>
                                            <option value="Salário">💼 Salário</option>
                                            <option value="Freelance">💻 Freelance</option>
                                            <option value="Investimentos">📈 Rendimentos</option>
                                            <option value="Vendas">🛒 Vendas</option>
                                            <option value="Outros">📋 Outros</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="Alimentação">🍔 Alimentação</option>
                                            <option value="Transporte">🚗 Transporte</option>
                                            <option value="Moradia">🏠 Moradia</option>
                                            <option value="Lazer">🎮 Lazer</option>
                                            <option value="Saúde">🏥 Saúde</option>
                                            <option value="Educação">📚 Educação</option>
                                            <option value="Outros">📋 Outros</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {/* Descrição */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#374151'
                                }}>
                                    Descrição *
                                </label>
                                <input
                                    type="text"
                                    name="descricao"
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    placeholder="Ex: Compra no supermercado, Pagamento freelance..."
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        background: '#ffffff',
                                        color: '#1F2937',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Valor e Data */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Valor (R$) *
                                    </label>
                                    <input
                                        type="number"
                                        name="valor"
                                        value={formData.valor}
                                        onChange={handleInputChange}
                                        placeholder="0,00"
                                        step="0.01"
                                        min="0"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            background: '#ffffff',
                                            color: '#1F2937',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        color: '#374151'
                                    }}>
                                        Data *
                                    </label>
                                    <input
                                        type="date"
                                        name="data"
                                        value={formData.data}
                                        onChange={handleInputChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            background: '#ffffff',
                                            color: '#1F2937',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Botões */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNovaTransacao(false);
                                        setFormData({
                                            tipo: 'CREDITO',
                                            categoria: '',
                                            descricao: '',
                                            valor: '',
                                            data: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                    style={{
                                        flex: 1,
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
                                        flex: 1,
                                        padding: '12px 24px',
                                        border: 'none',
                                        background: saving ? '#9CA3AF' : (formData.tipo === 'CREDITO' ? '#10B981' : '#EF4444'),
                                        color: 'white',
                                        borderRadius: '8px',
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
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
                                            {formData.tipo === 'CREDITO' ? '💰 Adicionar Receita' : '💸 Adicionar Despesa'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;
