import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';

// Importar estilos
import { GlobalStyles } from '@styles/GlobalStyles';
import tokens from '@styles/tokens';

// Importar páginas
import LoginPage from '@pages/auth/LoginPage-simple';
import ErrorPage from '@pages/errors/ErrorPage';
import NotFoundPage from '@pages/errors/NotFoundPage';
import HomePage from '@pages/home/HomePage';

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
                    {/* Rotas da aplicação */}
                    <Routes>
                        {/* Rota raiz - redireciona para home */}
                        <Route
                            path="/"
                            element={<Navigate to="/home" replace />}
                        />

                        {/* Páginas principais */}
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Página de erro */}
                        <Route path="/error" element={<ErrorPage />} />

                        {/* 404 - Página não encontrada */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Router>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;
