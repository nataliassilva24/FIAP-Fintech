import { CreditCard, Shield, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { colors, shadows, typography } from '@styles/tokens';
import { DadosPagamento, Plano } from '@types/entities';

// ============================================
// STYLED COMPONENTS - CHECKOUT BTG STYLE
// ============================================

const CheckoutContainer = styled.div`
    min-height: 100vh;
    background: ${colors.gradients.primary};
    padding: 40px 20px;
`;

const CheckoutContent = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 40px;
    
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
`;

const MainSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const SideSection = styled.div`
    position: sticky;
    top: 20px;
    height: fit-content;
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

const CheckoutCard = styled(Card)`
    background: ${colors.gradients.card};
    border: 1px solid ${colors.gray[600]};
    box-shadow: ${shadows.xl};
`;

const SectionTitle = styled.h3`
    color: white;
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.semibold};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const FormGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;

    &.full-width {
        grid-template-columns: 1fr;
    }
`;

const PlanSummary = styled.div`
    background: linear-gradient(145deg, rgba(79, 156, 249, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
    border: 2px solid #4F9CF9;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
`;

const PlanName = styled.h3`
    color: #4F9CF9;
    font-size: ${typography.fontSize['2xl']};
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: 8px;
`;

const PlanPrice = styled.div`
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 16px;
`;

const Price = styled.span`
    color: white;
    font-size: ${typography.fontSize['3xl']};
    font-weight: ${typography.fontWeight.bold};
`;

const PriceFrequency = styled.span`
    color: ${colors.gray[400]};
    font-size: ${typography.fontSize.base};
`;

const FeatureList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const FeatureItem = styled.li`
    color: ${colors.gray[300]};
    font-size: ${typography.fontSize.sm};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '✓';
        color: ${colors.success[500]};
        font-weight: bold;
    }
`;

const SecurityBadge = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 8px;
    margin-top: 24px;
`;

const SecurityText = styled.span`
    color: ${colors.success[500]};
    font-size: ${typography.fontSize.sm};
    font-weight: ${typography.fontWeight.medium};
`;

const TermsCheckbox = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin: 24px 0;
    
    input[type="checkbox"] {
        margin-top: 4px;
        width: 16px;
        height: 16px;
        accent-color: #4F9CF9;
    }
    
    label {
        color: ${colors.gray[300]};
        font-size: ${typography.fontSize.sm};
        line-height: 1.5;
        cursor: pointer;
        
        a {
            color: #4F9CF9;
            text-decoration: none;
            
            &:hover {
                text-decoration: underline;
            }
        }
    }
`;

const LoadingOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
`;

const LoadingCard = styled.div`
    background: ${colors.gradients.card};
    border: 1px solid ${colors.gray[600]};
    border-radius: 16px;
    padding: 32px;
    text-align: center;
    max-width: 300px;
`;

const LoadingText = styled.div`
    color: white;
    font-size: ${typography.fontSize.lg};
    font-weight: ${typography.fontWeight.semibold};
    margin-top: 16px;
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const { planoId } = useParams<{ planoId: string }>();

    // Estados
    const [plano, setPlano] = useState<Plano | null>(null);
    const [loading, setLoading] = useState(true);
    const [processando, setProcessando] = useState(false);
    const [dadosPagamento, setDadosPagamento] = useState<DadosPagamento>({
        numeroCartao: '',
        nomeTitular: '',
        validadeMesAno: '',
        cvv: ''
    });
    const [aceitaTermos, setAceitaTermos] = useState(false);

    // Mock dos planos (em produção seria da API)
    const planosMock: Plano[] = [
        {
            id: 1,
            nome: 'Básico',
            descricao: 'Perfeito para iniciantes no controle financeiro',
            preco: 29,
            recursos: [
                'Controle de gastos pessoais',
                'Relatórios básicos',
                'Até 3 contas bancárias',
                'Metas financeiras simples',
                'Suporte por email'
            ],
            limiteContas: 3,
            limiteEmpresas: 1,
            temIa: false,
            temRelatoriosAvancados: false,
            temSuportePrioritario: false,
            temConsultoria: false
        },
        {
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
        {
            id: 3,
            nome: 'Pro',
            descricao: 'Para empresas que precisam de tudo',
            preco: 129,
            recursos: [
                'Tudo do plano Intermediário',
                'Multi-empresas (até 10)',
                'IA preditiva avançada',
                'Relatórios personalizados',
                'API completa para integração',
                'Suporte 24/7 dedicado',
                'Consultoria financeira'
            ],
            limiteContas: -1,
            limiteEmpresas: 10,
            temIa: true,
            temRelatoriosAvancados: true,
            temSuportePrioritario: true,
            temConsultoria: true
        }
    ];

    // Carregar plano selecionado
    useEffect(() => {
        const id = parseInt(planoId || '1');
        const planoSelecionado = planosMock.find(p => p.id === id);

        if (planoSelecionado) {
            setPlano(planoSelecionado);
        } else {
            toast.error('Plano não encontrado');
            navigate('/');
        }
        setLoading(false);
    }, [planoId, navigate]);

    // Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Formatação especial para número do cartão
        if (name === 'numeroCartao') {
            const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
            setDadosPagamento(prev => ({ ...prev, [name]: formatted }));
            return;
        }

        // Formatação para validade MM/AA
        if (name === 'validadeMesAno') {
            const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
            setDadosPagamento(prev => ({ ...prev, [name]: formatted }));
            return;
        }

        setDadosPagamento(prev => ({ ...prev, [name]: value }));
    };

    const preencherDadosDemo = () => {
        setDadosPagamento({
            numeroCartao: '4111 1111 1111 1111',
            nomeTitular: 'JOÃO SILVA SANTOS',
            validadeMesAno: '12/28',
            cvv: '123'
        });
        toast.info('Dados de demonstração preenchidos (cartão de teste)');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!aceitaTermos) {
            toast.error('Você deve aceitar os termos de uso');
            return;
        }

        setProcessando(true);

        try {
            // Simular processamento
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Em produção seria uma chamada à API real
            console.log('Processando pagamento:', {
                plano: plano?.nome,
                valor: plano?.preco,
                dadosPagamento: {
                    ...dadosPagamento,
                    numeroCartao: dadosPagamento.numeroCartao.replace(/\d(?=\d{4})/g, "*")
                }
            });

            toast.success(`Plano ${plano?.nome} contratado com sucesso! 🎉`);

            // Redirecionar para dashboard ou página de sucesso
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (error) {
            toast.error('Erro ao processar pagamento. Tente novamente.');
        } finally {
            setProcessando(false);
        }
    };

    if (loading) {
        return (
            <CheckoutContainer>
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'white' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <div>Carregando dados do plano...</div>
                </div>
            </CheckoutContainer>
        );
    }

    if (!plano) {
        return (
            <CheckoutContainer>
                <div style={{ textAlign: 'center', padding: '100px 0', color: 'white' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
                    <div>Plano não encontrado</div>
                    <Button
                        onClick={() => navigate('/')}
                        style={{ marginTop: '20px' }}
                    >
                        Voltar ao Início
                    </Button>
                </div>
            </CheckoutContainer>
        );
    }

    return (
        <>
            <CheckoutContainer>
                <PageTitle>
                    <CreditCard />
                    Finalizar Contratação
                </PageTitle>
                <PageSubtitle>
                    Preencha os dados de pagamento para ativar seu plano
                </PageSubtitle>

                <CheckoutContent>
                    {/* Seção Principal - Formulário */}
                    <MainSection>
                        <CheckoutCard padding="lg">
                            <CardContent>
                                <SectionTitle>
                                    <CreditCard size={20} />
                                    Dados do Cartão
                                </SectionTitle>

                                <form onSubmit={handleSubmit}>
                                    <FormGrid className="full-width">
                                        <Input
                                            label="Número do Cartão"
                                            name="numeroCartao"
                                            value={dadosPagamento.numeroCartao}
                                            onChange={handleInputChange}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            required
                                        />
                                    </FormGrid>

                                    <FormGrid className="full-width">
                                        <Input
                                            label="Nome do Titular"
                                            name="nomeTitular"
                                            value={dadosPagamento.nomeTitular}
                                            onChange={handleInputChange}
                                            placeholder="NOME COMO NO CARTÃO"
                                            style={{ textTransform: 'uppercase' }}
                                            required
                                        />
                                    </FormGrid>

                                    <FormGrid>
                                        <Input
                                            label="Validade"
                                            name="validadeMesAno"
                                            value={dadosPagamento.validadeMesAno}
                                            onChange={handleInputChange}
                                            placeholder="MM/AA"
                                            maxLength={5}
                                            required
                                        />
                                        <Input
                                            label="CVV"
                                            name="cvv"
                                            value={dadosPagamento.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            maxLength={4}
                                            type="password"
                                            required
                                        />
                                    </FormGrid>

                                    {/* Botão Demo */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={preencherDadosDemo}
                                        style={{ marginBottom: '24px', width: '100%' }}
                                    >
                                        🧪 Preencher Dados de Demonstração
                                    </Button>

                                    {/* Termos */}
                                    <TermsCheckbox>
                                        <input
                                            type="checkbox"
                                            id="termos"
                                            checked={aceitaTermos}
                                            onChange={(e) => setAceitaTermos(e.target.checked)}
                                        />
                                        <label htmlFor="termos">
                                            Eu concordo com os{' '}
                                            <a href="#" onClick={(e) => { e.preventDefault(); alert('Termos de Uso e Política de Privacidade - Demo'); }}>
                                                Termos de Uso e Política de Privacidade
                                            </a>
                                        </label>
                                    </TermsCheckbox>

                                    {/* Botão de Pagamento */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        fullWidth
                                        isLoading={processando}
                                        disabled={processando || !aceitaTermos}
                                    >
                                        {processando ? 'Processando Pagamento...' : `Contratar por R$ ${plano.preco}/mês`}
                                    </Button>
                                </form>
                            </CardContent>
                        </CheckoutCard>

                        {/* Badges de Segurança */}
                        <SecurityBadge>
                            <Shield size={20} />
                            <SecurityText>
                                🔒 Pagamento 100% seguro • 💳 Dados de demonstração apenas • 🎭 Ambiente de teste
                            </SecurityText>
                        </SecurityBadge>
                    </MainSection>

                    {/* Seção Lateral - Resumo */}
                    <SideSection>
                        <CheckoutCard padding="lg">
                            <CardContent>
                                <PlanSummary>
                                    <PlanName>{plano.nome}</PlanName>
                                    <PlanPrice>
                                        <Price>R$ {plano.preco}</Price>
                                        <PriceFrequency>/mês</PriceFrequency>
                                    </PlanPrice>
                                    <div style={{ color: colors.gray[400], fontSize: typography.fontSize.sm }}>
                                        {plano.descricao}
                                    </div>
                                </PlanSummary>

                                <SectionTitle>
                                    <Zap size={20} />
                                    Recursos Inclusos
                                </SectionTitle>

                                <FeatureList>
                                    {plano.recursos.map((recurso, index) => (
                                        <FeatureItem key={index}>{recurso}</FeatureItem>
                                    ))}
                                </FeatureList>

                                <div style={{
                                    borderTop: '1px solid ' + colors.gray[600],
                                    paddingTop: '20px',
                                    marginTop: '20px',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ color: colors.gray[400], fontSize: typography.fontSize.sm, marginBottom: '8px' }}>
                                        Total mensal
                                    </div>
                                    <div style={{
                                        color: 'white',
                                        fontSize: typography.fontSize['2xl'],
                                        fontWeight: typography.fontWeight.bold
                                    }}>
                                        R$ {plano.preco}
                                    </div>
                                    <div style={{ color: colors.gray[500], fontSize: typography.fontSize.xs }}>
                                        Cobrança recorrente mensal
                                    </div>
                                </div>
                            </CardContent>
                        </CheckoutCard>
                    </SideSection>
                </CheckoutContent>
            </CheckoutContainer>

            {/* Loading Overlay */}
            {processando && (
                <LoadingOverlay>
                    <LoadingCard>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💳</div>
                        <LoadingText>Processando Pagamento</LoadingText>
                        <div style={{ color: colors.gray[400], fontSize: typography.fontSize.sm, marginTop: '8px' }}>
                            Aguarde alguns instantes...
                        </div>
                    </LoadingCard>
                </LoadingOverlay>
            )}
        </>
    );
};

export default CheckoutPage;



