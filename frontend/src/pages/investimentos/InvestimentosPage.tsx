import {
    Briefcase,
    PieChart,
    Plus,
    Search,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { investimentosAPI } from '@services/api';
import { colors, typography } from '@styles/tokens';
import { Investimento, TipoInvestimentoLabels } from '@types/entities';
import toast from 'react-hot-toast';

// Reutilizar estilos base
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

const PageTitle = styled.div`
  flex: 1;
  
  h1 {
    font-size: ${typography.fontSize['3xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[100]};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    svg {
      color: ${colors.primary[400]};
    }
  }
  
  p {
    color: ${colors.gray[400]};
  }
`;

const InvestmentCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const InvestmentCard = styled(Card)`
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[600]};
  transition: all 200ms ease;
  
  &:hover {
    border-color: ${colors.primary[600]};
    transform: translateY(-2px);
  }
  
  .investment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .investment-type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: ${typography.fontWeight.semibold};
      color: ${colors.gray[100]};
      
      .type-icon {
        width: 20px;
        height: 20px;
        padding: 4px;
        border-radius: 4px;
        background: ${colors.primary[900]};
        color: ${colors.primary[400]};
      }
    }
    
    .investment-status {
      font-size: ${typography.fontSize.xs};
      padding: 2px 8px;
      border-radius: 4px;
      
      &.ativo {
        background: ${colors.success[900]};
        color: ${colors.success[300]};
      }
      
      &.resgatado {
        background: ${colors.gray[800]};
        color: ${colors.gray[400]};
      }
    }
  }
  
  .investment-value {
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[100]};
    margin-bottom: 12px;
  }
  
  .investment-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .detail-item {
      text-align: center;
      
      .label {
        font-size: ${typography.fontSize.xs};
        color: ${colors.gray[400]};
        margin-bottom: 4px;
      }
      
      .value {
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.medium};
        color: ${colors.gray[200]};
      }
    }
  }
  
  .investment-actions {
    margin-top: 16px;
    display: flex;
    gap: 8px;
  }
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PortfolioSummary = styled(Card)`
  .portfolio-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .total-invested {
    font-size: ${typography.fontSize['2xl']};
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.gray[100]};
    margin-bottom: 16px;
  }
  
  .allocation {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .allocation-type {
      font-size: ${typography.fontSize.sm};
      color: ${colors.gray[300]};
    }
    
    .allocation-value {
      font-size: ${typography.fontSize.sm};
      font-weight: ${typography.fontWeight.semibold};
      color: ${colors.gray[100]};
    }
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const InvestimentosPage: React.FC = () => {
    const { user } = useAuth();
    const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalInvestido, setTotalInvestido] = useState(0);
    const [totalAtivo, setTotalAtivo] = useState(0);

    // Carregar investimentos
    useEffect(() => {
        const loadInvestimentos = async () => {
            if (!user?.idUsuario) return;

            try {
                setIsLoading(true);

                const [investimentosData, totalData, ativoData] = await Promise.all([
                    investimentosAPI.listarPorUsuario(user.idUsuario),
                    investimentosAPI.calcularTotalInvestido(user.idUsuario).catch(() => 0),
                    investimentosAPI.calcularTotalAtivo(user.idUsuario).catch(() => 0)
                ]);

                setInvestimentos(investimentosData);
                setTotalInvestido(totalData);
                setTotalAtivo(ativoData);

            } catch (error) {
                console.error('Erro ao carregar investimentos:', error);
                toast.error('Erro ao carregar carteira de investimentos');
            } finally {
                setIsLoading(false);
            }
        };

        loadInvestimentos();
    }, [user?.idUsuario]);

    // Filtrar investimentos
    const filteredInvestimentos = investimentos.filter(investimento =>
        TipoInvestimentoLabels[investimento.tipo].toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Formatar moeda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Formatar data
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    // Calcular dias investido
    const calcularDiasInvestido = (dataAplicacao: string, dataResgate?: string) => {
        const inicio = new Date(dataAplicacao);
        const fim = dataResgate ? new Date(dataResgate) : new Date();
        const diffTime = Math.abs(fim.getTime() - inicio.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Handler para resgatar investimento
    const handleResgatar = async (investimento: Investimento) => {
        if (!investimento.idInvestimento) return;

        if (confirm(`Confirma o resgate do investimento ${TipoInvestimentoLabels[investimento.tipo]}?`)) {
            try {
                await investimentosAPI.resgatar(investimento.idInvestimento);
                toast.success('Investimento resgatado com sucesso!');
                // Recarregar dados
                window.location.reload();
            } catch (error) {
                console.error('Erro ao resgatar investimento:', error);
                toast.error('Erro ao resgatar investimento');
            }
        }
    };

    return (
        <PageContainer>
            {/* Header */}
            <PageHeader>
                <PageTitle>
                    <h1>
                        <TrendingUp />
                        Carteira de Investimentos
                    </h1>
                    <p>Acompanhe e gerencie seus investimentos financeiros</p>
                </PageTitle>

                <Button
                    variant="primary"
                    leftIcon={<Plus />}
                    onClick={() => toast.info('Aplicar novo investimento')}
                >
                    Novo Investimento
                </Button>
            </PageHeader>

            {/* Resumo da carteira */}
            <SummarySection>
                <PortfolioSummary variant="gradient">
                    <CardHeader>
                        <CardTitle>
                            <PieChart />
                            Resumo da Carteira
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="total-invested">
                            {isLoading ? 'Carregando...' : formatCurrency(totalAtivo)}
                        </div>

                        <div className="allocation">
                            <span className="allocation-type">Total Investido</span>
                            <span className="allocation-value">
                                {formatCurrency(totalInvestido)}
                            </span>
                        </div>

                        <div className="allocation">
                            <span className="allocation-type">Valor Ativo</span>
                            <span className="allocation-value">
                                {formatCurrency(totalAtivo)}
                            </span>
                        </div>

                        <div className="allocation">
                            <span className="allocation-type">Rentabilidade</span>
                            <span className="allocation-value" style={{ color: colors.success[400] }}>
                                +8.7%
                            </span>
                        </div>
                    </CardContent>
                </PortfolioSummary>

                <Card variant="gradient">
                    <CardHeader>
                        <CardTitle>
                            Distribuição por Tipo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div style={{
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.gray[400],
                            textAlign: 'center'
                        }}>
                            📊 Gráfico de pizza
                            <br />
                            <small>Distribuição dos investimentos</small>
                        </div>
                    </CardContent>
                </Card>
            </SummarySection>

            {/* Filtros */}
            <div style={{ marginBottom: '24px' }}>
                <Input
                    placeholder="Buscar investimentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search />}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            {/* Grid de investimentos */}
            <InvestmentCards>
                {isLoading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: colors.gray[400] }}>
                        Carregando investimentos...
                    </div>
                ) : filteredInvestimentos.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '60px 20px'
                    }}>
                        <TrendingUp style={{
                            width: '48px',
                            height: '48px',
                            color: colors.gray[500],
                            margin: '0 auto 16px'
                        }} />
                        <h3 style={{ color: colors.gray[300], marginBottom: '8px' }}>
                            Nenhum investimento encontrado
                        </h3>
                        <p style={{ color: colors.gray[400], marginBottom: '20px' }}>
                            {searchTerm ? 'Tente ajustar os filtros' : 'Comece criando seu primeiro investimento'}
                        </p>
                        {!searchTerm && (
                            <Button
                                variant="primary"
                                leftIcon={<Plus />}
                                onClick={() => toast.info('Aplicar primeiro investimento')}
                            >
                                Primeiro Investimento
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredInvestimentos.map((investimento) => (
                        <InvestmentCard key={investimento.idInvestimento} variant="gradient">
                            <CardContent>
                                <div className="investment-header">
                                    <div className="investment-type">
                                        <Briefcase className="type-icon" />
                                        {TipoInvestimentoLabels[investimento.tipo]}
                                    </div>
                                    <span className={`investment-status ${investimento.dataResgate ? 'resgatado' : 'ativo'}`}>
                                        {investimento.dataResgate ? 'Resgatado' : 'Ativo'}
                                    </span>
                                </div>

                                <div className="investment-value">
                                    {formatCurrency(investimento.valorInvestido)}
                                </div>

                                <div className="investment-details">
                                    <div className="detail-item">
                                        <div className="label">Aplicação</div>
                                        <div className="value">{formatDate(investimento.dataAplicacao)}</div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="label">Dias</div>
                                        <div className="value">
                                            {calcularDiasInvestido(investimento.dataAplicacao, investimento.dataResgate)}
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="label">Rendimento</div>
                                        <div className="value" style={{ color: colors.success[400] }}>
                                            +5.2%
                                        </div>
                                    </div>
                                </div>

                                {!investimento.dataResgate && (
                                    <div className="investment-actions">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleResgatar(investimento)}
                                        >
                                            Resgatar
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toast.info('Ver detalhes do investimento')}
                                        >
                                            Detalhes
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </InvestmentCard>
                    ))
                )}
            </InvestmentCards>
        </PageContainer>
    );
};

export default InvestimentosPage;



