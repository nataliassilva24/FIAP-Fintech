import { usuariosAPI } from '@services/api';
import { LoginForm, Usuario } from '@types/entities';
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';

// Estado do contexto de autenticação
interface AuthState {
    user: Usuario | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Ações do contexto
type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: { user: Usuario; token: string } }
    | { type: 'LOGIN_ERROR'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Reducer para gerenciar estado
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };

        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case 'LOGIN_ERROR':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

// Interface do contexto
export interface AuthContextType {
    user: Usuario | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginForm) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props do provider
interface AuthProviderProps {
    children: ReactNode;
}

// Provider do contexto de autenticação
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Verificar se há token salvo ao inicializar
    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const savedToken = localStorage.getItem('auth_token');
                const savedUser = localStorage.getItem('user');

                if (savedToken && savedUser) {
                    const user = JSON.parse(savedUser) as Usuario;
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: { user, token: savedToken }
                    });
                }
            } catch (error) {
                console.error('Erro ao verificar token salvo:', error);
                // Limpar dados inválidos
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            } finally {
                // SEMPRE define loading como false após 1 segundo (evita travamento)
                setTimeout(() => {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }, 1000);
            }
        };

        checkAuthToken();
    }, []);

    // Função de login
    const login = async (credentials: LoginForm): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });

        try {
            const response = await usuariosAPI.autenticar(credentials);

            // Salvar no localStorage
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user', JSON.stringify(response.usuario));

            // Atualizar estado
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: {
                    user: response.usuario,
                    token: response.token
                }
            });

            toast.success(`Bem-vindo(a), ${response.usuario.nomeCompleto}!`);
            return true;

        } catch (error: any) {
            const errorMessage = error.response?.data?.error?.message ||
                error.response?.data?.erro ||
                'Erro ao fazer login. Verifique suas credenciais.';

            dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
            toast.error(errorMessage);
            return false;
        }
    };

    // Função de logout
    const logout = () => {
        // Limpar localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');

        // Atualizar estado
        dispatch({ type: 'LOGOUT' });

        toast.success('Logout realizado com sucesso');
    };

    // Função para limpar erro
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value: AuthContextType = {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        login,
        logout,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar o contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }

    return context;
};

export default AuthContext;
