import {
    ArrowRight,
    BarChart3,
    Shield,
    Target,
    TrendingUp
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { colors, shadows, typography } from '@styles/tokens';

// ============================================
// STYLED COMPONENTS - HOMEPAGE BTG STYLE
// ============================================

const HomeContainer = styled.div`
  min-height: 100vh;
  background: ${colors.gradients.primary};
  position: relative;
  overflow-x: hidden;
`;

const Header = styled.header`
  position: relative;
  z-index: 10;
  padding: 20px 0;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 0 16px;
    flex-direction: column;
    gap: 16px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  .logo-icon {
    width: 32px;
    height: 32px;
    color: ${colors.primary[400]};
  }
  
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: ${colors.gray[100]};
    margin: 0;
    
    .highlight {
      color: ${colors.primary[400]};
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const HeroSection = styled.section`
  padding: 80px 0 120px;
  text-align: center;
  position: relative;
  
  @media (max-width: 768px) {
    padding: 60px 0 80px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const HeroTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[100]};
  margin-bottom: 20px;
  line-height: 1.2;
  
  .gradient-text {
    background: linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[300]} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroDescription = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.gray[300]};
  margin-bottom: 32px;
  line-height: ${typography.lineHeight.relaxed};
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSize.base};
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
`;

const FeaturesContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[100]};
  text-align: center;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionDescription = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.gray[400]};
  text-align: center;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  background: ${colors.gradients.card};
  border: 1px solid ${colors.gray[600]};
  transition: all ${transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.xl};
    border-color: ${colors.primary[600]};
  }
  
  .feature-icon {
    width: 48px;
    height: 48px;
    color: ${colors.primary[400]};
    margin: 0 auto 16px;
  }
  
  h4 {
    font-size: ${typography.fontSize.xl};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.gray[100]};
    margin-bottom: 12px;
  }
  
  p {
    color: ${colors.gray[400]};
    line-height: ${typography.lineHeight.relaxed};
  }
`;

const StatsSection = styled.section`
  padding: 60px 0;
`;

const StatsGrid = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 16px;
  }
`;

const StatCard = styled.div`
  text-align: center;
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: ${typography.fontWeight.bold};
    color: ${colors.primary[400]};
    margin-bottom: 8px;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  .stat-label {
    font-size: ${typography.fontSize.sm};
    color: ${colors.gray[400]};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const isAuthenticated = false; // Simplificado para demo

    const features = [
        {
            icon: <BarChart3 className="feature-icon" />,
            title: 'Controle Financeiro',
            description: 'Gerencie suas receitas e despesas com categorização inteligente e relatórios detalhados.'
        },
        {
            icon: <TrendingUp className="feature-icon" />,
            title: 'Carteira de Investimentos',
            description: 'Acompanhe seus investimentos em tempo real com análise de performance e diversificação.'
        },
        {
            icon: <Target className="feature-icon" />,
            title: 'Metas Financeiras',
            description: 'Defina objetivos e acompanhe seu progresso com metas personalizadas e alertas inteligentes.'
        },
        {
            icon: <Shield className="feature-icon" />,
            title: 'Segurança BTG',
            description: 'Proteção de dados com criptografia avançada e autenticação segura.'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Usuários Ativos' },
        { number: '50M+', label: 'Investido' },
        { number: '99.9%', label: 'Disponibilidade' },
        { number: '24/7', label: 'Suporte' }
    ];

    return (
        <HomeContainer>
            {/* Header */}
            <Header>
                <HeaderContent>
                    <Logo>
                        <TrendingUp className="logo-icon" />
                        <h1>FIAP <span className="highlight">Fintech</span></h1>
                    </Logo>

                    <HeaderActions>
                        {isAuthenticated ? (
                            <Button
                                variant="primary"
                                onClick={() => navigate('/dashboard')}
                                rightIcon={<ArrowRight />}
                            >
                                Ir para Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/login')}
                                >
                                    Entrar
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/login')}
                                >
                                    Começar Agora
                                </Button>
                            </>
                        )}
                    </HeaderActions>
                </HeaderContent>
            </Header>

            {/* Hero Section */}
            <HeroSection>
                <HeroContent>
                    <HeroTitle>
                        O futuro das suas <span className="gradient-text">finanças</span> começa aqui
                    </HeroTitle>

                    <HeroDescription>
                        Plataforma completa para gestão financeira pessoal com tecnologia BTG.
                        Controle seus gastos, invista com inteligência e conquiste suas metas financeiras.
                    </HeroDescription>

                    <HeroActions>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => navigate('/login')}
                            rightIcon={<ArrowRight />}
                        >
                            Começar Gratuitamente
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => navigate('/demo')}
                        >
                            Ver Demonstração
                        </Button>
                    </HeroActions>

                    {/* Stats */}
                    <StatsGrid>
                        {stats.map((stat, index) => (
                            <StatCard key={index}>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </StatCard>
                        ))}
                    </StatsGrid>
                </HeroContent>
            </HeroSection>

            {/* Features Section */}
            <FeaturesSection>
                <FeaturesContent>
                    <SectionTitle>Recursos Principais</SectionTitle>
                    <SectionDescription>
                        Tudo que você precisa para ter controle total sobre suas finanças,
                        investimentos e objetivos financeiros.
                    </SectionDescription>

                    <FeaturesGrid>
                        {features.map((feature, index) => (
                            <FeatureCard key={index} variant="gradient" hoverable>
                                <CardContent>
                                    {feature.icon}
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </CardContent>
                            </FeatureCard>
                        ))}
                    </FeaturesGrid>
                </FeaturesContent>
            </FeaturesSection>
        </HomeContainer>
    );
};

export default HomePage;
