import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Verificar se o elemento root existe
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element não encontrado!');
}

// Renderizar aplicação
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
