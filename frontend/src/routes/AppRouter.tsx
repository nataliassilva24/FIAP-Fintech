import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
// import DashboardPage from '../pages/Dashboard/DashboardPage';
// import TransactionsPage from '../pages/Transactions/TransactionsPage';
// import InvestmentsPage from '../pages/Investments/InvestmentsPage';
// import GoalsPage from '../pages/Goals/GoalsPage';

// Error Page Component
const ErrorPage: React.FC = () => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0B1426 0%, #1E293B 100%)',
        color: '#1F2937',
        textAlign: 'center'
    }}>
        <div>
            <h1 style={{ color: '#EF4444', marginBottom: '1rem', fontSize: '48px' }}>❌</h1>
            <h2 style={{ color: 'white', marginBottom: '1rem' }}>Página não encontrada</h2>
            <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
                A página que você procura não existe.
            </p>
            <button
                onClick={() => window.location.href = '/home'}
                style={{
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                }}
            >
                🏠 Ir para Home
            </button>
        </div>
    </div>
);

// Temporary placeholder for pages not yet extracted
const PlaceholderPage: React.FC<{ pageName: string }> = ({ pageName }) => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        textAlign: 'center'
    }}>
        <div>
            <h1>🚧 {pageName}</h1>
            <p>Esta página será extraída do main.tsx em breve...</p>
            <button
                onClick={() => window.location.href = '/home'}
                style={{
                    background: '#2563EB',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginTop: '16px'
                }}
            >
                ← Voltar para Home
            </button>
        </div>
    </div>
);

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                
                {/* Main pages */}
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Placeholder pages (to be extracted) */}
                <Route path="/dashboard" element={<PlaceholderPage pageName="Dashboard" />} />
                <Route path="/transacoes" element={<PlaceholderPage pageName="Transações" />} />
                <Route path="/investimentos" element={<PlaceholderPage pageName="Investimentos" />} />
                <Route path="/metas" element={<PlaceholderPage pageName="Metas" />} />
                <Route path="/cadastro" element={<PlaceholderPage pageName="Cadastro" />} />
                
                {/* 404 Error page */}
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
