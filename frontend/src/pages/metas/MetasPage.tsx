import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Plus,
    Search,
    Tag,
    Target,
    TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { useAuth } from '@contexts/AuthContext';
import { metasAPI } from '@services/api';
import { colors, typography } from '@styles/tokens';
import { CategoriaMetaLabels, MetaFinanceira, StatusMeta, StatusMetaLabels } from '@types/entities';
import toast from 'react-hot-toast';

// Styled components base (reutilizados)
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

const MetasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const MetaCard = styled(Card)`
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[600]};
  transition: all 200ms ease;
  
  &:hover {
    border-color: ${colors.primary[600]};
    transform: translateY(-2px);
  }
  
  .meta-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .meta-title {
      font-size: ${typography.fontSize.lg};
      font-weight: ${typography.fontWeight.semibold};
      color: ${colors.gray[100]};
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .meta-status {
      font-size: ${typography.fontSize.xs};
      padding: 4px 8px;
      border-radius: 6px;
      font-weight: ${typography.fontWeight.medium};
      
      &.ATIVA {
        background: ${colors.primary[900]};
        color: ${colors.primary[300]};
      }
      
      &.CONCLUIDA {
        background: ${colors.success[900]};
        color: ${colors.success[300]};
      }
      
      &.VENCIDA {
        background: ${colors.error[900]};
        color: ${colors.error[300]};
      }
      
      &.PAUSADA {
        background: ${colors.warning[900]};
        color: ${colors.warning[300]};
      }
    }
  }
  
  .meta-description {
    font-size: ${typography.fontSize.sm};
    color: ${colors.gray[400]};
    margin-bottom: 16px;
  }
  
  .meta-progress {
    margin-bottom: 16px;
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .progress-values {
        font-size: ${typography.fontSize.sm};
        color: ${colors.gray[300]};
      }
      
      .progress-percentage {
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.semibold};
        color: ${colors.primary[400]};
      }
    }
    
    .progress-bar {
      width: 100%;
      height: 8px;
      background: ${colors.gray[800]};
      border-radius: 4px;
      overflow: hidden;
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, ${colors.primary[600]} 0%, ${colors.primary[400]} 100%);
        border-radius: 4px;
        transition: width 300ms ease;
      }
    }
  }
  
  .meta-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .detail-item {
      text-align: center;
      
      .label {
        font-size: ${typography.fontSize.xs};
        color: ${colors.gray[400]};
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        
        svg {
          width: 12px;
          height: 12px;
        }
      }
      
      .value {
        font-size: ${typography.fontSize.sm};
        font-weight: ${typography.fontWeight.medium};
        color: ${colors.gray[200]};
      }
    }
  }
  
  .meta-actions {
    display: flex;
    gap: 8px;
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const MetasPage: React.FC = () => {
    const { user } = useAuth();
    const [metas, setMetas] = useState<MetaFinanceira[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Carregar metas
    useEffect(() => {
        const loadMetas = async () => {
            if (!user?.idUsuario) return;

            try {
                setIsLoading(true);
                const metasData = await metasAPI.listarPorUsuario(user.idUsuario);
                setMetas(metasData);
            } catch (error) {
                console.error('Erro ao carregar metas:', error);
                toast.error('Erro ao carregar metas financeiras');
            } finally {
                setIsLoading(false);
            }
        };

        loadMetas();
    }, [user?.idUsuario]);

    // Filtrar metas
    const filteredMetas = metas.filter(meta =>
        meta.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        CategoriaMetaLabels[meta.categoria].toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular progresso percentual
    const calcularProgresso = (valorAcumulado: number = 0, valorNecessario: number) => {
        return Math.min((valorAcumulado / valorNecessario) * 100, 100);
    };

    // Formatar moeda
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Formatar data
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Sem prazo';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    // Calcular dias restantes
    const calcularDiasRestantes = (dataLimite?: string) => {
        if (!dataLimite) return null;
        const hoje = new Date();
        const limite = new Date(dataLimite);
        const diffTime = limite.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Obter ícone do status
    const getStatusIcon = (status: StatusMeta) => {
        switch (status) {
            case StatusMeta.CONCLUIDA:
                return <CheckCircle />;
            case StatusMeta.VENCIDA:
                return <AlertCircle />;
            default:
                return <Clock />;
        }
    };

    // Handler para adicionar valor à meta
    const handleAdicionarValor = async (meta: MetaFinanceira) => {
        const valorStr = prompt(`Adicionar valor à meta "${meta.nome}":`, '100.00');

        if (valorStr && meta.idMeta) {
            const valor = parseFloat(valorStr.replace(',', '.'));

            if (isNaN(valor) || valor <= 0) {
                toast.error('Valor inválido');
                return;
            }

            try {
                await metasAPI.adicionarValor(meta.idMeta, valor);
                toast.success(`R$ ${valor.toFixed(2)} adicionado à meta!`);
                // Recarregar dados
                window.location.reload();
            } catch (error) {
                console.error('Erro ao adicionar valor:', error);
                toast.error('Erro ao adicionar valor à meta');
            }
        }
    };

    return (
        <PageContainer>
            {/* Header */}
            <PageHeader>
                <PageTitle>
                    <h1>
                        <Target />
                        Metas Financeiras
                    </h1>
                    <p>Defina e acompanhe seus objetivos financeiros</p>
                </PageTitle>

                <Button
                    variant="primary"
                    leftIcon={<Plus />}
                    onClick={() => toast.info('Criar nova meta financeira')}
                >
                    Nova Meta
                </Button>
            </PageHeader>

            {/* Filtros */}
            <div style={{ marginBottom: '24px' }}>
                <Input
                    placeholder="Buscar metas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search />}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            {/* Grid de metas */}
            <MetasGrid>
                {isLoading ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: colors.gray[400] }}>
                        Carregando metas...
                    </div>
                ) : filteredMetas.length === 0 ? (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '60px 20px'
                    }}>
                        <Target style={{
                            width: '48px',
                            height: '48px',
                            color: colors.gray[500],
                            margin: '0 auto 16px'
                        }} />
                        <h3 style={{ color: colors.gray[300], marginBottom: '8px' }}>
                            Nenhuma meta encontrada
                        </h3>
                        <p style={{ color: colors.gray[400], marginBottom: '20px' }}>
                            {searchTerm ? 'Tente ajustar os filtros' : 'Comece definindo sua primeira meta financeira'}
                        </p>
                        {!searchTerm && (
                            <Button
                                variant="primary"
                                leftIcon={<Plus />}
                                onClick={() => toast.info('Criar primeira meta')}
                            >
                                Primeira Meta
                            </Button>
                        )}
                    </div>
                ) : (
                    filteredMetas.map((meta) => {
                        const progresso = calcularProgresso(meta.valorAcumulado, meta.valorNecessario);
                        const diasRestantes = calcularDiasRestantes(meta.dataLimite);

                        return (
                            <MetaCard key={meta.idMeta} variant="gradient">
                                <CardContent>
                                    <div className="meta-header">
                                        <div className="meta-title">
                                            <Target />
                                            {meta.nome}
                                        </div>
                                        <span className={`meta-status ${meta.status}`}>
                                            {StatusMetaLabels[meta.status || StatusMeta.ATIVA]}
                                        </span>
                                    </div>

                                    {meta.descricao && (
                                        <div className="meta-description">
                                            {meta.descricao}
                                        </div>
                                    )}

                                    <div className="meta-progress">
                                        <div className="progress-info">
                                            <div className="progress-values">
                                                {formatCurrency(meta.valorAcumulado || 0)} / {formatCurrency(meta.valorNecessario)}
                                            </div>
                                            <div className="progress-percentage">
                                                {progresso.toFixed(1)}%
                                            </div>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${progresso}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="meta-details">
                                        <div className="detail-item">
                                            <div className="label">
                                                <Tag />
                                                Categoria
                                            </div>
                                            <div className="value">{CategoriaMetaLabels[meta.categoria]}</div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="label">
                                                <Calendar />
                                                Prazo
                                            </div>
                                            <div className="value">
                                                {diasRestantes !== null ? (
                                                    diasRestantes > 0 ? `${diasRestantes} dias` : 'Vencida'
                                                ) : 'Sem prazo'}
                                            </div>
                                        </div>

                                        <div className="detail-item">
                                            <div className="label">
                                                <TrendingUp />
                                                Restante
                                            </div>
                                            <div className="value">
                                                {formatCurrency(meta.valorNecessario - (meta.valorAcumulado || 0))}
                                            </div>
                                        </div>
                                    </div>

                                    {meta.status === StatusMeta.ATIVA && (
                                        <div className="meta-actions">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                leftIcon={<Plus />}
                                                onClick={() => handleAdicionarValor(meta)}
                                            >
                                                Adicionar Valor
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toast.info('Ver histórico da meta')}
                                            >
                                                Histórico
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </MetaCard>
                        );
                    })
                )}
            </MetasGrid>
        </PageContainer>
    );
};

export default MetasPage;
