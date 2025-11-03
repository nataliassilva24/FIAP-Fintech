import {
    ArrowDownCircle,
    ArrowUpCircle,
    BarChart3,
    PlusCircle,
    Target,
    TrendingUp,
    Wallet
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { useAuth } from '@contexts/AuthContext';
import { investimentosAPI, metasAPI, transacoesAPI } from '@services/api';
import { colors, typography } from '@styles/tokens';
import toast from 'react-hot-toast';

// ============================================
// STYLED COMPONENTS - DASHBOARD BTG
// ============================================

const DashboardContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
  
  h1 {
    font-size: ${typography.fontSize['4xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[100]};
    margin-bottom: 8px;
    
    @media (max-width: 768px) {
      font-size: ${typography.fontSize['2xl']};
    }
  }
  
  p {
    font-size: ${typography.fontSize.lg};
    color: ${colors.gray[400]};
    
    @media (max-width: 768px) {
      font-size: ${typography.fontSize.base};
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Card)`
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[600]};
  transition: all 200ms ease;
  
  &:hover {
    border-color: ${colors.primary[600]};
    transform: translateY(-2px);
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .stat-title {
      font-size: ${typography.fontSize.sm};
      font-weight: ${typography.fontWeight.medium};
      color: ${colors.gray[400]};
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .stat-icon {
      width: 20px;
      height: 20px;
    }
  }
  
  .stat-value {
    font-size: ${typography.fontSize['2xl']};
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: 8px;
    
    &.positive {
      color: ${colors.success[400]};
    }
    
    &.negative {
      color: ${colors.error[400]};
    }
    
    &.neutral {
      color: ${colors.gray[100]};
    }
  }
  
  .stat-change {
    font-size: ${typography.fontSize.sm};
    display: flex;
    align-items: center;
    gap: 4px;
    
    &.positive {
      color: ${colors.success[400]};
    }
    
    &.negative {
      color: ${colors.error[400]};
    }
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const RecentActivity = styled.div`
  .activity-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid ${colors.gray[700]};
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &.receita {
          background: ${colors.success[900]};
          color: ${colors.success[400]};
        }
        
        &.despesa {
          background: ${colors.error[900]};
          color: ${colors.error[400]};
        }
        
        &.investimento {
          background: ${colors.primary[900]};
          color: ${colors.primary[400]};
        }
        
        svg {
          width: 16px;
          height: 16px;
        }
      }
      
      .activity-details {
        .activity-title {
          font-size: ${typography.fontSize.sm};
          font-weight: ${typography.fontWeight.medium};
          color: ${colors.gray[200]};
        }
        
        .activity-subtitle {
          font-size: ${typography.fontSize.xs};
          color: ${colors.gray[400]};
        }
      }
    }
    
    .activity-value {
      font-size: ${typography.fontSize.sm};
      font-weight: ${typography.fontWeight.semibold};
      
      &.positive {
        color: ${colors.success[400]};
      }
      
      &.negative {
        color: ${colors.error[400]};
      }
    }
  }
`;

// ============================================
// INTERFACES E TIPOS
// ============================================

interface DashboardStats {
    saldoAtual: number;
    totalReceitas: number;
    totalDespesas: number;
    totalInvestidoAtivo: number;
    metasAtivas: number;
    isLoading: boolean;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        saldoAtual: 0,
        totalReceitas: 0,
        totalDespesas: 0,
        totalInvestidoAtivo: 0,
        metasAtivas: 0,
        isLoading: true
    });

    // Carregar dados do dashboard
    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user?.idUsuario) return;

            try {
                setStats(prev => ({ ...prev, isLoading: true }));

                // Buscar dados em paralelo
                const [saldo, receitas, despesas, investimentos, metas] = await Promise.all([
                    transacoesAPI.calcularSaldo(user.idUsuario).catch(() => 0),
                    transacoesAPI.calcularReceitas(user.idUsuario).catch(() => 0),
                    transacoesAPI.calcularDespesas(user.idUsuario).catch(() => 0),
                    investimentosAPI.calcularTotalAtivo(user.idUsuario).catch(() => 0),
                    metasAPI.contarAtivas(user.idUsuario).catch(() => 0)
                ]);

                setStats({
                    saldoAtual: saldo,
                    totalReceitas: receitas,
                    totalDespesas: despesas,
                    totalInvestidoAtivo: investimentos,
                    metasAtivas: metas,
                    isLoading: false
                });

            } catch (error) {
                console.error('Erro ao carregar dados do dashboard:', error);
                toast.error('Erro ao carregar dados do dashboard');
                setStats(prev => ({ ...prev, isLoading: false }));
            }
        };

        loadDashboardData();
    }, [user?.idUsuario]);

    // Formatar valores em Real
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getPeriodGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const dashboardStats = [
        {
            title: 'Saldo Atual',
            value: stats.saldoAtual,
            icon: <Wallet className="stat-icon" />,
            type: stats.saldoAtual >= 0 ? 'positive' : 'negative',
            change: '+5.2%',
            changeType: 'positive'
        },
        {
            title: 'Receitas',
            value: stats.totalReceitas,
            icon: <ArrowUpCircle className="stat-icon" />,
            type: 'positive',
            change: '+12.3%',
            changeType: 'positive'
        },
        {
            title: 'Despesas',
            value: stats.totalDespesas,
            icon: <ArrowDownCircle className="stat-icon" />,
            type: 'negative',
            change: '-2.1%',
            changeType: 'negative'
        },
        {
            title: 'Investimentos Ativos',
            value: stats.totalInvestidoAtivo,
            icon: <TrendingUp className="stat-icon" />,
            type: 'neutral',
            change: '+8.7%',
            changeType: 'positive'
        }
    ];

    return (
        <DashboardContainer>
            {/* Header da página */}
            <PageHeader>
                <h1>
                    {getPeriodGreeting()}, {user?.nomeCompleto?.split(' ')[0] || 'Usuário'}! 👋
                </h1>
                <p>
                    Aqui está o resumo das suas finanças e investimentos de hoje.
                </p>
            </PageHeader>

            {/* Cards de estatísticas */}
            <StatsGrid>
                {dashboardStats.map((stat, index) => (
                    <StatCard key={index} variant="gradient">
                        <CardContent>
                            <div className="stat-header">
                                <div className="stat-title">
                                    {stat.icon}
                                    {stat.title}
                                </div>
                            </div>

                            <div className={`stat-value ${stat.type}`}>
                                {stats.isLoading ? '...' : formatCurrency(stat.value)}
                            </div>

                            <div className={`stat-change ${stat.changeType}`}>
                                {stat.changeType === 'positive' ? <ArrowUpCircle /> : <ArrowDownCircle />}
                                {stat.change} este mês
                            </div>
                        </CardContent>
                    </StatCard>
                ))}
            </StatsGrid>

            {/* Ações rápidas */}
            <QuickActions>
                <Button
                    variant="primary"
                    leftIcon={<PlusCircle />}
                    onClick={() => window.open('/transacoes/nova', '_blank')}
                >
                    Nova Transação
                </Button>

                <Button
                    variant="outline"
                    leftIcon={<TrendingUp />}
                    onClick={() => window.open('/investimentos/novo', '_blank')}
                >
                    Novo Investimento
                </Button>
            </QuickActions>

            {/* Grid principal */}
            <ContentGrid>
                <MainContent>
                    {/* Gráficos e relatórios principais */}
                    <Card variant="gradient">
                        <CardHeader>
                            <CardTitle>
                                <BarChart3 />
                                Resumo Financeiro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{
                                height: '300px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: colors.gray[400]
                            }}>
                                📊 Gráfico de evolução financeira
                                <br />
                                <small>(Implementação com Chart.js ou Recharts)</small>
                            </div>
                        </CardContent>
                    </Card>
                </MainContent>

                <Sidebar>
                    {/* Atividade recente */}
                    <Card variant="gradient">
                        <CardHeader>
                            <CardTitle>
                                Atividade Recente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity>
                                <div className="activity-item">
                                    <div className="activity-info">
                                        <div className="activity-icon receita">
                                            <ArrowUpCircle />
                                        </div>
                                        <div className="activity-details">
                                            <div className="activity-title">Salário recebido</div>
                                            <div className="activity-subtitle">2 dias atrás</div>
                                        </div>
                                    </div>
                                    <div className="activity-value positive">
                                        +R$ 4.500,00
                                    </div>
                                </div>

                                <div className="activity-item">
                                    <div className="activity-info">
                                        <div className="activity-icon investimento">
                                            <TrendingUp />
                                        </div>
                                        <div className="activity-details">
                                            <div className="activity-title">Investimento CDB</div>
                                            <div className="activity-subtitle">5 dias atrás</div>
                                        </div>
                                    </div>
                                    <div className="activity-value">
                                        R$ 5.000,00
                                    </div>
                                </div>

                                <div className="activity-item">
                                    <div className="activity-info">
                                        <div className="activity-icon despesa">
                                            <ArrowDownCircle />
                                        </div>
                                        <div className="activity-details">
                                            <div className="activity-title">Supermercado</div>
                                            <div className="activity-subtitle">1 semana atrás</div>
                                        </div>
                                    </div>
                                    <div className="activity-value negative">
                                        -R$ 350,00
                                    </div>
                                </div>
                            </RecentActivity>
                        </CardContent>
                    </Card>

                    {/* Metas em progresso */}
                    <Card variant="gradient">
                        <CardHeader>
                            <CardTitle>
                                <Target />
                                Metas em Progresso
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ textAlign: 'center', color: colors.gray[400], padding: '20px 0' }}>
                                {stats.isLoading ? (
                                    'Carregando metas...'
                                ) : stats.metasAtivas > 0 ? (
                                    `${stats.metasAtivas} metas ativas`
                                ) : (
                                    'Nenhuma meta ativa'
                                )}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                fullWidth
                                leftIcon={<PlusCircle />}
                                onClick={() => window.open('/metas/nova', '_blank')}
                            >
                                Criar Meta
                            </Button>
                        </CardContent>
                    </Card>
                </Sidebar>
            </ContentGrid>
        </DashboardContainer>
    );
};

export default DashboardPage;
