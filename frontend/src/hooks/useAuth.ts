import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { Usuario } from '../services/authService';

interface UseAuthReturn {
    user: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => void;
}

export const useAuth = (): UseAuthReturn => {
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

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const result = await authService.login(email, password);
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

    return {
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        isLoading,
        login,
        logout,
        checkAuth
    };
};
