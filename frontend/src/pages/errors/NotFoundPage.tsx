import { ArrowLeft, Home, Search, TrendingUp } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { colors, typography } from '@styles/tokens';

// ============================================
// STYLED COMPONENTS - 404 PAGE BTG STYLE
// ============================================

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.gradients.primary};
  padding: 20px;
`;

const NotFoundCard = styled(Card)`
  max-width: 600px;
  text-align: center;
  background: ${colors.gradients.card};
`;

const NotFoundIllustration = styled.div`
  margin-bottom: 32px;
  position: relative;
  
  .big-404 {
    font-size: 8rem;
    font-weight: 900;
    color: ${colors.primary[400]};
    opacity: 0.3;
    line-height: 1;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      font-size: 6rem;
    }
  }
  
  .search-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    color: ${colors.gray[400]};
  }
`;

const NotFoundTitle = styled.h1`
  font-size: ${typography.fontSize['3xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[100]};
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: ${typography.fontSize['2xl']};
  }
`;

const NotFoundDescription = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.gray[400]};
  margin-bottom: 32px;
  line-height: ${typography.lineHeight.relaxed};
`;

const HelpfulLinks = styled.div`
  margin: 32px 0;
  padding: 24px;
  background: ${colors.gray[900]};
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
  text-align: left;
  
  h3 {
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.semibold};
    color: ${colors.gray[100]};
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      width: 16px;
      height: 16px;
      color: ${colors.primary[400]};
    }
  }
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    
    li {
      margin: 8px 0;
      
      button {
        background: none;
        border: none;
        color: ${colors.primary[400]};
        cursor: pointer;
        font-size: ${typography.fontSize.sm};
        text-align: left;
        padding: 4px 0;
        
        &:hover {
          color: ${colors.primary[300]};
          text-decoration: underline;
        }
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

// ============================================
// COMPONENTE NOT FOUND PAGE
// ============================================

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    const helpfulLinks = [
        { label: 'Dashboard Financeiro', path: '/dashboard' },
        { label: 'Gerenciar Transações', path: '/transacoes' },
        { label: 'Ver Investimentos', path: '/investimentos' },
        { label: 'Acompanhar Metas', path: '/metas' },
    ];

    return (
        <NotFoundContainer>
            <NotFoundCard padding="lg">
                <CardContent>
                    <NotFoundIllustration>
                        <div className="big-404">404</div>
                        <Search className="search-icon" />
                    </NotFoundIllustration>

                    <NotFoundTitle>
                        Página não encontrada
                    </NotFoundTitle>

                    <NotFoundDescription>
                        A página que você está procurando não existe ou foi movida.
                        Verifique o endereço ou use os links abaixo para navegar.
                    </NotFoundDescription>

                    <HelpfulLinks>
                        <h3>
                            <TrendingUp />
                            Links úteis
                        </h3>
                        <ul>
                            {helpfulLinks.map((link, index) => (
                                <li key={index}>
                                    <button onClick={() => navigate(link.path)}>
                                        → {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </HelpfulLinks>

                    <ActionButtons>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/home')}
                            leftIcon={<Home />}
                        >
                            Página Inicial
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            leftIcon={<ArrowLeft />}
                        >
                            Voltar
                        </Button>
                    </ActionButtons>
                </CardContent>
            </NotFoundCard>
        </NotFoundContainer>
    );
};

export default NotFoundPage;



