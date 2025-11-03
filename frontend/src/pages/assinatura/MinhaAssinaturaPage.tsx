import { AlertCircle, CheckCircle, CreditCard, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { colors, shadows, typography } from '@styles/tokens';
import { Assinatura, StatusAssinatura } from '@types/entities';

// ============================================
// STYLED COMPONENTS
// ============================================

const AssinaturaContainer = styled.div`
    min-height: 100vh;
    background: ${colors.gradients.primary};
    padding: 40px 20px;
`;

const AssinaturaContent = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

const PageTitle = styled.h1`
    color: white;
    font-size: ${typography.fontSize['3xl']};
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
`;

const PageSubtitle = styled.p`
    color: ${colors.gray[400]};
    font-size: ${typography.fontSize.lg};
    margin-bottom: 32px;
`;

const StatusBadge = styled.span<{ status: StatusAssinatura }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.semibold};
    
    ${({ status }) => {
        switch (status) {
            case StatusAssinatura.ATIVA:
                return `
                    background: rgba(16, 185, 129, 0.2);
                    color: ${colors.success[400]};
                    border: 1px solid rgba(16, 185, 129, 0.3);
                `;
            case StatusAssinatura.SUSPENSA:
                return `
                    background: rgba(245, 158, 11, 0.2);
                    color: ${colors.warning[400]};
                    border: 1px solid rgba(245, 158, 11, 0.3);
                `;
            case StatusAssinatura.CANCELADA:
                return `
                    background: rgba(239, 68, 68, 0.2);
                    color: ${colors.error[400]};
                    border: 1px solid rgba(239, 68, 68, 0.3);
                `;
            default:
                return `
                    background: rgba(148, 163, 184, 0.2);
                    color: ${colors.gray[400]};
                    border: 1px solid rgba(148, 163, 184, 0.3);
                `;
        }
    }}
`;

const PlanoCard = styled(Card)`
    background: ${colors.gradients.card};
    border: 1px solid ${colors.gray[600]};
    box-shadow: ${shadows.xl};
    margin-bottom: 24px;
`;

const PlanoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
`;

const PlanoInfo = styled.div`
    flex: 1;
`;

const PlanoNome = styled.h2`
    color: #4F9CF9;
    font-size: ${typography.fontSize['2xl']};
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: 8px;
`;

const PlanoPreco = styled.div`
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 12px;
`;

const DetalhesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
    margin: 24px 0;
`;

const DetalheItem = styled.div`
    text-align: center;
    padding: 20px;
    background: rgba(79, 156, 249, 0.05);
    border: 1px solid rgba(79, 156, 249, 0.1);
    border-radius: 12px;
`;

const DetalheLabel = styled.div`
    color: ${colors.gray[400]};
    font-size: ${typography.fontSize.sm};
    margin-bottom: 8px;
`;

const DetalheValor = styled.div`
    color: white;
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semibold};
`;

const ActionsSection = styled.div`
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 32px;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// ============================================
// COMPONENTE PRINCIPAL  
// ============================================

export const MinhaAssinaturaPage: React.FC = () => {
    const navigate = useNavigate();
    const [assinatura, setAssinatura] = useState<Assinatura | null>(null);
    const [loading, setLoading] = useState(true);

    // Mock da assinatura (em produção viria da API)
    useEffect(() => {
        setTimeout(() => {
            // Simulando uma assinatura ativa do plano Intermediário
            const assinaturaMock: Assinatura = {
                id: 1001,
                usuarioId: 1,
                plano: {
                    id: 2,
                    nome: 'Intermediário',
                    descricao: 'Ideal para pequenas empresas e freelancers',
                    preco: 59,
                    recursos: [
                        'Tudo do plano Básico',
                        'Gestão de investimentos',
                        'Contas bancárias ilimitadas',
                        'Relatórios avançados com IA',
                        'Integração com APIs bancárias',
                        'Suporte prioritário'
                    ],
                    limiteContas: -1,
                    limiteEmpresas: 3,
                    temIa: true,
                    temRelatoriosAvancados: true,
                    temSuportePrioritario: true,
                    temConsultoria: false,
                    popular: true
                },
                status: StatusAssinatura.ATIVA,
                dataInicio: '2024-10-01',
                valorPago: 59,
                numeroCartaoMascarado: '**** **** **** 1111',
                nomeTitularCartao: 'JOÃO SILVA SANTOS',
                bandeiraCartao: 'Visa',
                renovacaoAutomatica: true,
                dataProximaCobranca: '2024-11-01',
                dataCriacao: '2024-10-01T10:00:00'
            };

            setAssinatura(assinaturaMock);
            setLoading(false);
        }, 1000);
    }, []);

    const handleCancelarAssinatura = () => {
        const confirma = window.confirm(
            '⚠️ Tem certeza que deseja cancelar sua assinatura?\n\n' +
            '• Você perderá acesso aos recursos premium\n' +
            '• O cancelamento será efetivo no próximo ciclo\n' +
            '• Seus dados serão preservados por 30 dias'
        );

        if (confirma) {
            toast.success('Solicitação de cancelamento registrada');
            // Em produção seria uma chamada à API
            console.log('Cancelando assinatura ID:', assinatura?.id);
        }
    };

    const handleAlterarCartao = () => {
        toast.info('Redirecionando para atualização de cartão...');
        // Em produção redirecionaria para formulário de atualização
    };

    if (loading) {
        return (
            <AssinaturaContainer>
                <AssinaturaContent>
                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'white' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                        <div>Carregando dados da assinatura...</div>
                    </div>
                </AssinaturaContent>
            </AssinaturaContainer>
        );
    }

    if (!assinatura) {
        return (
            <AssinaturaContainer>
                <AssinaturaContent>
                    <div style={{ textAlign: 'center', padding: '100px 0', color: 'white' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
                        <div style={{ marginBottom: '2rem' }}>Você não possui nenhuma assinatura ativa</div>
                        <Button onClick={() => navigate('/')}>
                            Ver Planos Disponíveis
                        </Button>
                    </div>
                </AssinaturaContent>
            </AssinaturaContainer>
        );
    }

    return (
        <AssinaturaContainer>
            <AssinaturaContent>
                <PageTitle>
                    <Settings />
                    Minha Assinatura
                </PageTitle>
                <PageSubtitle>
                    Gerencie seu plano e dados de pagamento
                </PageSubtitle>

                {/* Card Principal da Assinatura */}
                <PlanoCard padding="lg">
                    <CardContent>
                        <PlanoHeader>
                            <PlanoInfo>
                                <PlanoNome>{assinatura.plano.nome}</PlanoNome>
                                <PlanoPreco>
                                    <span style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>
                                        R$ {assinatura.plano.preco}
                                    </span>
                                    <span style={{ color: colors.gray[400], fontSize: '16px' }}>
                                        /mês
                                    </span>
                                </PlanoPreco>
                                <div style={{ color: colors.gray[400], fontSize: '14px' }}>
                                    {assinatura.plano.descricao}
                                </div>
                            </PlanoInfo>

                            <StatusBadge status={assinatura.status}>
                                <CheckCircle size={16} />
                                {assinatura.status}
                            </StatusBadge>
                        </PlanoHeader>

                        {/* Detalhes da Assinatura */}
                        <DetalhesGrid>
                            <DetalheItem>
                                <DetalheLabel>Data de Início</DetalheLabel>
                                <DetalheValor>
                                    {new Date(assinatura.dataInicio).toLocaleDateString('pt-BR')}
                                </DetalheValor>
                            </DetalheItem>

                            <DetalheItem>
                                <DetalheLabel>Próxima Cobrança</DetalheLabel>
                                <DetalheValor>
                                    {assinatura.dataProximaCobranca ?
                                        new Date(assinatura.dataProximaCobranca).toLocaleDateString('pt-BR')
                                        : 'N/A'
                                    }
                                </DetalheValor>
                            </DetalheItem>

                            <DetalheItem>
                                <DetalheLabel>Cartão</DetalheLabel>
                                <DetalheValor>
                                    {assinatura.numeroCartaoMascarado}
                                    <br />
                                    <small style={{ color: colors.gray[500] }}>
                                        {assinatura.bandeiraCartao}
                                    </small>
                                </DetalheValor>
                            </DetalheItem>

                            <DetalheItem>
                                <DetalheLabel>Renovação</DetalheLabel>
                                <DetalheValor>
                                    {assinatura.renovacaoAutomatica ?
                                        <span style={{ color: colors.success[500] }}>✓ Automática</span> :
                                        <span style={{ color: colors.warning[500] }}>⚠️ Manual</span>
                                    }
                                </DetalheValor>
                            </DetalheItem>
                        </DetalhesGrid>

                        {/* Recursos do Plano */}
                        <div style={{ marginTop: '32px' }}>
                            <h3 style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                                marginBottom: '16px'
                            }}>
                                📋 Recursos Inclusos
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '12px'
                            }}>
                                {assinatura.plano.recursos.map((recurso, index) => (
                                    <div key={index} style={{
                                        color: colors.gray[300],
                                        fontSize: '14px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <span style={{ color: colors.success[500] }}>✓</span>
                                        {recurso}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ações */}
                        <ActionsSection>
                            <Button
                                variant="outline"
                                onClick={handleAlterarCartao}
                            >
                                <CreditCard size={16} />
                                Alterar Cartão
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => navigate('/dashboard')}
                            >
                                Ir para Dashboard
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => navigate('/')}
                            >
                                Upgrade de Plano
                            </Button>

                            <Button
                                variant="danger"
                                onClick={handleCancelarAssinatura}
                                style={{ marginLeft: 'auto' }}
                            >
                                <AlertCircle size={16} />
                                Cancelar Plano
                            </Button>
                        </ActionsSection>
                    </CardContent>
                </PlanoCard>

                {/* Card de Informações Adicionais */}
                <Card padding="md" style={{ background: 'rgba(79, 156, 249, 0.1)', border: '1px solid rgba(79, 156, 249, 0.2)' }}>
                    <CardContent>
                        <h3 style={{ color: '#4F9CF9', fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            💡 Informações Importantes
                        </h3>
                        <div style={{ color: colors.gray[300], fontSize: '14px', lineHeight: '1.6' }}>
                            • <strong>Faturamento:</strong> Cobrança automática todo dia {new Date(assinatura.dataProximaCobranca || '').getDate()}
                            <br />
                            • <strong>Cancelamento:</strong> Disponível a qualquer momento, efetivo no próximo ciclo
                            <br />
                            • <strong>Dados:</strong> Seus dados ficam seguros por 30 dias após cancelamento
                            <br />
                            • <strong>Suporte:</strong> {assinatura.plano.temSuportePrioritario ? 'Prioritário disponível 24/7' : 'Por email durante horário comercial'}
                        </div>
                    </CardContent>
                </Card>
            </AssinaturaContent>
        </AssinaturaContainer>
    );
};

export default MinhaAssinaturaPage;



