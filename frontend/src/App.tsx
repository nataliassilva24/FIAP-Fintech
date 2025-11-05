import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import tokens from './styles/tokens';
import AppRouter from './routes/AppRouter';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={tokens}>
            <GlobalStyles />
            <div style={{ minHeight: '100vh' }}>
                <AppRouter />
            </div>
        </ThemeProvider>
    );
};

export default App;
