import { useAuth } from '@contexts/AuthContext';
import { colors } from '@styles/tokens';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// Componente de loading
const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: ${colors.gradients.primary};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${colors.gray[700]};
  border-top: 3px solid ${colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin-top: 16px;
  color: ${colors.gray[400]};
  font-size: 14px;
`;

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Mostrar loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <LoadingContainer>
                <div style={{ textAlign: 'center' }}>
                    <LoadingSpinner />
                    <LoadingText>Verificando autenticação...</LoadingText>
                </div>
            </LoadingContainer>
        );
    }

    // Se não autenticado, redirecionar para login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Se autenticado, renderizar children
    return <>{children}</>;
};

export default ProtectedRoute;



