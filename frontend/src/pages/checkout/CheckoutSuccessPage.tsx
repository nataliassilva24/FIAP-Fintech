import { ArrowRight, Calendar, CheckCircle, CreditCard } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { colors, shadows, typography } from '@styles/tokens';

// ============================================
// STYLED COMPONENTS
// ============================================

const SuccessContainer = styled.div`
    min-height: 100vh;
    background: ${colors.gradients.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
`;

const SuccessCard = styled(Card)`
    background: ${colors.gradients.card};
    border: 1px solid ${colors.success[500]};
    box-shadow: ${shadows['2xl']};
    max-width: 500px;
    width: 100%;
    text-align: center;
`;

const SuccessIcon = styled.div`
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, ${colors.success[500]} 0%, ${colors.success[400]} 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
`;

const SuccessTitle = styled.h1`
    color: white;
    font-size: ${typography.fontSize['2xl']};
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: 12px;
`;

const SuccessSubtitle = styled.p`
    color: ${colors.gray[400]};
    font-size: ${typography.fontSize.base};
    margin-bottom: 32px;
    line-height: 1.6;
`;

const SummarySection = styled.div`
    background: rgba(79, 156, 249, 0.1);
    border: 1px solid rgba(79, 156, 249, 0.2);
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    text-align: left;
`;

const SummaryItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    
    &:last-child {
        border-bottom: none;
    }
`;

const SummaryLabel = styled.span`
    color: ${colors.gray[400]};
    font-size: ${typography.fontSize.sm};
    display: flex;
    align-items: center;
    gap: 8px;
`;

const SummaryValue = styled.span`
    color: white;
    font-weight: ${typography.fontWeight.semibold};
`;

const ActionsSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 32px;
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const CheckoutSuccessPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [contadorRedirect, setContadorRedirect] = useState(10);

    // Dados simulados do pagamento (normalmente viriam da API)
    const dadosContratacao = {
        planoNome: searchParams.get('plano') || 'Intermediário',
        valor: searchParams.get('valor') || '59',
        cartaoMascarado: searchParams.get('cartao') || '**** **** **** 1111',
        proximaCobranca: searchParams.get('proxima') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
        assinaturaId: searchParams.get('id') || Math.floor(Math.random() * 10000).toString()
    };

    // Contador regressivo para redirecionamento
    useEffect(() => {
        const timer = setInterval(() => {
            setContadorRedirect(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/dashboard');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const irParaDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <SuccessContainer>
            <SuccessCard padding="lg">
                <CardContent>
                    <SuccessIcon>
                        <CheckCircle size={40} color="white" />
                    </SuccessIcon>

                    <SuccessTitle>Contratação Realizada com Sucesso! 🎉</SuccessTitle>
                    <SuccessSubtitle>
                        Seu plano foi ativado e você já pode acessar todos os recursos disponíveis.
                    </SuccessSubtitle>

                    {/* Resumo da Contratação */}
                    <SummarySection>
                        <SummaryItem>
                            <SummaryLabel>
                                <Zap size={16} />
                                Plano Contratado
                            </SummaryLabel>
                            <SummaryValue>{dadosContratacao.planoNome}</SummaryValue>
                        </SummaryItem>

                        <SummaryItem>
                            <SummaryLabel>
                                <CreditCard size={16} />
                                Valor Mensal
                            </SummaryLabel>
                            <SummaryValue>R$ {dadosContratacao.valor}</SummaryValue>
                        </SummaryItem>

                        <SummaryItem>
                            <SummaryLabel>
                                <CreditCard size={16} />
                                Cartão
                            </SummaryLabel>
                            <SummaryValue>{dadosContratacao.cartaoMascarado}</SummaryValue>
                        </SummaryItem>

                        <SummaryItem>
                            <SummaryLabel>
                                <Calendar size={16} />
                                Próxima Cobrança
                            </SummaryLabel>
                            <SummaryValue>{dadosContratacao.proximaCobranca}</SummaryValue>
                        </SummaryItem>
                    </SummarySection>

                    {/* Próximos Passos */}
                    <div style={{
                        textAlign: 'left',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        margin: '24px 0'
                    }}>
                        <h3 style={{ color: colors.success[500], fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                            ✅ Próximos Passos
                        </h3>
                        <ul style={{ color: colors.gray[300], fontSize: '14px', lineHeight: '1.6', paddingLeft: '20px' }}>
                            <li>Complete seu perfil no dashboard</li>
                            <li>Conecte suas contas bancárias</li>
                            <li>Configure suas primeiras metas</li>
                            <li>Explore os relatórios com IA</li>
                        </ul>
                    </div>

                    {/* Ações */}
                    <ActionsSection>
                        <Button
                            size="lg"
                            fullWidth
                            onClick={irParaDashboard}
                        >
                            <ArrowRight size={20} />
                            Acessar Dashboard ({contadorRedirect}s)
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            onClick={() => navigate('/')}
                        >
                            Voltar ao Início
                        </Button>
                    </ActionsSection>

                    {/* Info Legal */}
                    <div style={{
                        marginTop: '32px',
                        padding: '16px',
                        background: 'rgba(148, 163, 184, 0.05)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: colors.gray[500],
                        lineHeight: '1.4'
                    }}>
                        <div style={{ marginBottom: '8px', fontWeight: '600', color: colors.gray[400] }}>
                            📧 Confirmação enviada por email
                        </div>
                        <div>
                            • Assinatura ID: #{dadosContratacao.assinaturaId}
                            <br />
                            • Fatura será enviada mensalmente
                            <br />
                            • Cancelamento disponível a qualquer momento
                        </div>
                    </div>
                </CardContent>
            </SuccessCard>
        </SuccessContainer>
    );
};

// Import do componente Zap necessário
import { Zap } from 'lucide-react';

export default CheckoutSuccessPage;



