import {
    ArrowDownCircle,
    ArrowUpCircle,
    DollarSign,
    Filter,
    Plus,
    Search,
    Tag
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { transacoesAPI } from '@services/api';
import { colors, typography } from '@styles/tokens';
import { TipoTransacao, TipoTransacaoLabels, Transacao } from '@types/entities';
import toast from 'react-hot-toast';

// Reutilizar estilos da página de usuários
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

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const SummaryCard = styled(Card)`
  text-align: center;
  
  .summary-icon {
    width: 24px;
    height: 24px;
    margin: 0 auto 12px;
  }
  
  .summary-label {
    font-size: ${typography.fontSize.sm};
    color: ${colors.gray[400]};
    margin-bottom: 8px;
  }
  
  .summary-value {
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.bold};
    
    &.positive { color: ${colors.success[400]}; }
    &.negative { color: ${colors.error[400]}; }
    &.neutral { color: ${colors.gray[100]}; }
  }
`;

const TransactionsTable = styled.div`
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[700]};
  border-radius: 12px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr 120px 120px 100px;
  gap: 16px;
  padding: 16px 24px;
  background: ${colors.gray[800]};
  border-bottom: 1px solid ${colors.gray[700]};
  font-size: ${typography.fontSize.sm};
  font-weight: ${typography.fontWeight.semibold};
  color: ${colors.gray[300]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px;
    gap: 12px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr 120px 120px 100px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid ${colors.gray[700]};
  
  &:hover {
    background: ${colors.gray[800]};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 80px;
    gap: 12px;
  }
  
  .transaction-type {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
    
    &.CREDITO {
      color: ${colors.success[400]};
    }
    
    &.DEBITO {
      color: ${colors.error[400]};
    }
    
    &.TRANSFERENCIA {
      color: ${colors.primary[400]};
    }
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  .transaction-details {
    .description {
      font-size: ${typography.fontSize.sm};
      color: ${colors.gray[200]};
      margin-bottom: 2px;
    }
    
    .category {
      font-size: ${typography.fontSize.xs};
      color: ${colors.gray[400]};
      display: flex;
      align-items: center;
      gap: 4px;
      
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
  
  .value {
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.semibold};
    text-align: right;
    
    &.positive { color: ${colors.success[400]}; }
    &.negative { color: ${colors.error[400]}; }
  }
  
  .date {
    font-size: ${typography.fontSize.sm};
    color: ${colors.gray[400]};
    text-align: center;
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const TransacoesPage: React.FC = () => {
    const { user } = useAuth();
    const [transacoes, setTransacoes] = useState<Transacao[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [saldo, setSaldo] = useState(0);
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalDespesas, setTotalDespesas] = useState(0);

    // Carregar transações
    useEffect(() => {
        const loadTransacoes = async () => {
            if (!user?.idUsuario) return;

            try {
                setIsLoading(true);

                const [transacoesData, saldoData, receitasData, despesasData] = await Promise.all([
                    transacoesAPI.listarPorUsuario(user.idUsuario),
                    transacoesAPI.calcularSaldo(user.idUsuario).catch(() => 0),
                    transacoesAPI.calcularReceitas(user.idUsuario).catch(() => 0),
                    transacoesAPI.calcularDespesas(user.idUsuario).catch(() => 0)
                ]);

                setTransacoes(transacoesData);
                setSaldo(saldoData);
                setTotalReceitas(receitasData);
                setTotalDespesas(despesasData);

            } catch (error) {
                console.error('Erro ao carregar transações:', error);
                toast.error('Erro ao carregar transações');
            } finally {
                setIsLoading(false);
            }
        };

        loadTransacoes();
    }, [user?.idUsuario]);

    // Filtrar transações
    const filteredTransacoes = transacoes.filter(transacao =>
        transacao.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transacao.categoria.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Obter ícone do tipo de transação
    const getTransactionIcon = (tipo: TipoTransacao) => {
        switch (tipo) {
            case TipoTransacao.CREDITO:
                return <ArrowUpCircle />;
            case TipoTransacao.DEBITO:
                return <ArrowDownCircle />;
            default:
                return <DollarSign />;
        }
    };

    const summaryData = [
        {
            label: 'Saldo Atual',
            value: saldo,
            icon: <DollarSign className="summary-icon" />,
            type: saldo >= 0 ? 'positive' : 'negative'
        },
        {
            label: 'Total Receitas',
            value: totalReceitas,
            icon: <ArrowUpCircle className="summary-icon" />,
            type: 'positive'
        },
        {
            label: 'Total Despesas',
            value: totalDespesas,
            icon: <ArrowDownCircle className="summary-icon" />,
            type: 'negative'
        }
    ];

    return (
        <PageContainer>
            {/* Header */}
            <PageHeader>
                <PageTitle>
                    <h1>
                        <DollarSign />
                        Transações Financeiras
                    </h1>
                    <p>Gerencie suas receitas, despesas e transferências</p>
                </PageTitle>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button
                        variant="outline"
                        leftIcon={<Plus />}
                        onClick={() => toast.info('Registrar receita')}
                    >
                        Receita
                    </Button>

                    <Button
                        variant="primary"
                        leftIcon={<Plus />}
                        onClick={() => toast.info('Registrar despesa')}
                    >
                        Despesa
                    </Button>
                </div>
            </PageHeader>

            {/* Cards de resumo */}
            <SummaryCards>
                {summaryData.map((item, index) => (
                    <SummaryCard key={index} variant="gradient">
                        <CardContent>
                            {item.icon}
                            <div className="summary-label">{item.label}</div>
                            <div className={`summary-value ${item.type}`}>
                                {isLoading ? '...' : formatCurrency(item.value)}
                            </div>
                        </CardContent>
                    </SummaryCard>
                ))}
            </SummaryCards>

            {/* Filtros */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search />}
                    style={{ maxWidth: '400px' }}
                />

                <Button variant="ghost" leftIcon={<Filter />}>
                    Filtros
                </Button>
            </div>

            {/* Tabela de transações */}
            <Card variant="default">
                <TransactionsTable>
                    <TableHeader>
                        <div>Tipo</div>
                        <div>Detalhes</div>
                        <div className="hidden-mobile">Categoria</div>
                        <div className="hidden-mobile">Valor</div>
                        <div className="hidden-mobile">Data</div>
                    </TableHeader>

                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: colors.gray[400] }}>
                            Carregando transações...
                        </div>
                    ) : filteredTransacoes.length === 0 ? (
                        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                            <DollarSign style={{ width: '48px', height: '48px', color: colors.gray[500], margin: '0 auto 16px' }} />
                            <h3 style={{ color: colors.gray[300], marginBottom: '8px' }}>
                                Nenhuma transação encontrada
                            </h3>
                            <p style={{ color: colors.gray[400], marginBottom: '20px' }}>
                                {searchTerm ? 'Tente ajustar os filtros' : 'Comece registrando sua primeira transação'}
                            </p>
                            {!searchTerm && (
                                <Button
                                    variant="primary"
                                    leftIcon={<Plus />}
                                    onClick={() => toast.info('Criar primeira transação')}
                                >
                                    Nova Transação
                                </Button>
                            )}
                        </div>
                    ) : (
                        filteredTransacoes.map((transacao) => (
                            <TableRow key={transacao.idTransacao}>
                                <div className={`transaction-type ${transacao.tipoTransacao}`}>
                                    {getTransactionIcon(transacao.tipoTransacao)}
                                    <span className="hidden-mobile">{TipoTransacaoLabels[transacao.tipoTransacao]}</span>
                                </div>

                                <div className="transaction-details">
                                    <div className="description">
                                        {transacao.descricao || 'Sem descrição'}
                                    </div>
                                    <div className="category">
                                        <Tag />
                                        {transacao.categoria}
                                    </div>
                                </div>

                                <div className="hidden-mobile">
                                    {transacao.categoria}
                                </div>

                                <div className={`value hidden-mobile ${transacao.tipoTransacao === TipoTransacao.CREDITO ? 'positive' : 'negative'}`}>
                                    {transacao.tipoTransacao === TipoTransacao.CREDITO ? '+' : '-'}
                                    {formatCurrency(transacao.valor)}
                                </div>

                                <div className="date hidden-mobile">
                                    {formatDate(transacao.data)}
                                </div>
                            </TableRow>
                        ))
                    )}
                </TransactionsTable>
            </Card>
        </PageContainer>
    );
};

export default TransacoesPage;



