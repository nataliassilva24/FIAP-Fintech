import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { colors, typography } from '@styles/tokens';

// ============================================
// STYLED COMPONENTS - ERROR PAGE BTG STYLE
// ============================================

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.gradients.primary};
  padding: 20px;
`;

const ErrorCard = styled(Card)`
  max-width: 500px;
  text-align: center;
  background: ${colors.gradients.card};
  border: 1px solid ${colors.error[800]};
`;

const ErrorIcon = styled.div`
  margin-bottom: 24px;
  
  .error-icon {
    width: 64px;
    height: 64px;
    color: ${colors.error[400]};
    margin: 0 auto;
  }
`;

const ErrorTitle = styled.h1`
  font-size: ${typography.fontSize['4xl']};
  font-weight: ${typography.fontWeight.bold};
  color: ${colors.gray[100]};
  margin-bottom: 16px;
`;

const ErrorDescription = styled.p`
  font-size: ${typography.fontSize.lg};
  color: ${colors.gray[400]};
  margin-bottom: 32px;
  line-height: ${typography.lineHeight.relaxed};
`;

const ErrorDetails = styled.div`
  background: ${colors.gray[900]};
  border: 1px solid ${colors.gray[700]};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
  text-align: left;
  
  .error-code {
    font-family: monospace;
    font-size: ${typography.fontSize.sm};
    color: ${colors.error[400]};
    margin-bottom: 8px;
  }
  
  .error-message {
    font-size: ${typography.fontSize.sm};
    color: ${colors.gray[300]};
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
// COMPONENTE ERROR PAGE
// ============================================

interface ErrorPageProps {
    errorCode?: string;
    errorMessage?: string;
    showDetails?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
    errorCode = '500',
    errorMessage = 'Algo deu errado no servidor',
    showDetails = false
}) => {
    const navigate = useNavigate();

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const getErrorTitle = (code: string) => {
        switch (code) {
            case '404':
                return 'Página não encontrada';
            case '403':
                return 'Acesso negado';
            case '401':
                return 'Não autorizado';
            case '500':
            default:
                return 'Erro interno do servidor';
        }
    };

    const getErrorDescription = (code: string) => {
        switch (code) {
            case '404':
                return 'A página que você está procurando não existe ou foi movida.';
            case '403':
                return 'Você não tem permissão para acessar esta página.';
            case '401':
                return 'Você precisa fazer login para acessar esta página.';
            case '500':
            default:
                return 'Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.';
        }
    };

    return (
        <ErrorContainer>
            <ErrorCard padding="lg">
                <CardContent>
                    <ErrorIcon>
                        <AlertTriangle className="error-icon" />
                    </ErrorIcon>

                    <ErrorTitle>
                        Oops! {getErrorTitle(errorCode)}
                    </ErrorTitle>

                    <ErrorDescription>
                        {getErrorDescription(errorCode)}
                    </ErrorDescription>

                    {showDetails && (
                        <ErrorDetails>
                            <div className="error-code">
                                Código de erro: {errorCode}
                            </div>
                            <div className="error-message">
                                {errorMessage}
                            </div>
                        </ErrorDetails>
                    )}

                    <ActionButtons>
                        <Button
                            variant="primary"
                            onClick={handleRefresh}
                            leftIcon={<RefreshCw />}
                        >
                            Tentar Novamente
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleGoBack}
                            leftIcon={<ArrowLeft />}
                        >
                            Voltar
                        </Button>

                        <Button
                            variant="ghost"
                            onClick={handleGoHome}
                            leftIcon={<Home />}
                        >
                            Página Inicial
                        </Button>
                    </ActionButtons>
                </CardContent>
            </ErrorCard>
        </ErrorContainer>
    );
};

export default ErrorPage;



