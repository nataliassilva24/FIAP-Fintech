import { Toaster } from 'react-hot-toast';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

// Importar contextos
import { AuthProvider } from '@contexts/AuthContext';

// Importar estilos globais
import { GlobalStyles } from '@styles/GlobalStyles';
import tokens from '@styles/tokens';

// Importar páginas
import LoginPage from '@pages/auth/LoginPage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import ErrorPage from '@pages/errors/ErrorPage';
import NotFoundPage from '@pages/errors/NotFoundPage';
import HomePage from '@pages/home/HomePage';

// Páginas das entidades
import InvestimentosPage from '@pages/investimentos/InvestimentosPage';
import MetasPage from '@pages/metas/MetasPage';
import TransacoesPage from '@pages/transacoes/TransacoesPage';
import UsuariosPage from '@pages/usuarios/UsuariosPage';

// Componentes de layout
import { Layout } from '@components/layout/Layout';
import { ProtectedRoute } from '@components/layout/ProtectedRoute';

// Container principal da aplicação
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
    return (
        <ThemeProvider theme={tokens}>
            <GlobalStyles />
            <AppContainer>
                <Router>
                    <AuthProvider>
                        {/* Componente de notificações (Toast) */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#1E293B',
                                    color: '#F1F5F9',
                                    border: '1px solid #475569',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10B981',
                                        secondary: '#F1F5F9',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#EF4444',
                                        secondary: '#F1F5F9',
                                    },
                                },
                            }}
                        />

                        {/* Rotas da aplicação */}
                        <Routes>
                            {/* Rota raiz - redireciona baseado na autenticação */}
                            <Route
                                path="/"
                                element={<Navigate to="/home" replace />}
                            />

                            {/* Páginas públicas */}
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />

                            {/* Páginas protegidas com layout */}
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Layout>
                                        <DashboardPage />
                                    </Layout>
                                </ProtectedRoute>
                            } />

                            <Route path="/usuarios" element={
                                <ProtectedRoute>
                                    <Layout>
                                        <UsuariosPage />
                                    </Layout>
                                </ProtectedRoute>
                            } />

                            <Route path="/transacoes" element={
                                <ProtectedRoute>
                                    <Layout>
                                        <TransacoesPage />
                                    </Layout>
                                </ProtectedRoute>
                            } />

                            <Route path="/investimentos" element={
                                <ProtectedRoute>
                                    <Layout>
                                        <InvestimentosPage />
                                    </Layout>
                                </ProtectedRoute>
                            } />

                            <Route path="/metas" element={
                                <ProtectedRoute>
                                    <Layout>
                                        <MetasPage />
                                    </Layout>
                                </ProtectedRoute>
                            } />

                            {/* Página de erro */}
                            <Route path="/error" element={<ErrorPage />} />

                            {/* 404 - Página não encontrada */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </AuthProvider>
                </Router>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;



