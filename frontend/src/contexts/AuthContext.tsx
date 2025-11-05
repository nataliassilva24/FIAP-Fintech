import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface Usuario {
    idUsuario: number;
    nomeCompleto: string;
    email: string;
    dataNascimento: string;
    genero: string;
    dataCadastro: string;
    ativo: boolean;
    idade: number;
    maiorIdade: boolean;
}

interface AuthContextType {
    user: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Provider de autenticação global usando Context API
 * Centraliza gerenciamento de estado de usuário em toda aplicação
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = () => {
        const currentUser = authService.getCurrentUser();
        const isAuth = authService.isAuthenticated();
        
        if (isAuth && currentUser) {
            setUser(currentUser);
        } else {
            setUser(null);
        }
        setIsLoading(false);
    };

    const login = async (email: string, senha: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const result = await authService.login(email, senha);
            if (result.success && result.usuario) {
                setUser(result.usuario);
                setIsLoading(false);
                return true;
            }
            setIsLoading(false);
            return false;
        } catch (error) {
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        isLoading,
        login,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook customizado para usar contexto de autenticação
 */
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
    }
    return context;
};
