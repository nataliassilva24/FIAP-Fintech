// Serviço de autenticação integrado com API Backend
const API_BASE_URL = 'http://localhost:8080';

export interface Usuario {
    idUsuario: number;
    nomeCompleto: string;
    email: string;
    dataNascimento: string;
    genero: string;
    senha?: string;
    dataCadastro: string;
    ativo: boolean;
    idade: number;
    maiorIdade: boolean;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    usuario?: Usuario;
    token?: string;
}

export interface CadastroResponse {
    success: boolean;
    message: string;
    usuario?: Usuario;
}

class AuthService {
    private readonly CURRENT_USER_KEY = 'fiap_fintech_current_user';
    private readonly TOKEN_KEY = 'fiap_fintech_token';

    // Cadastrar novo usuário via API
    async cadastrar(dadosUsuario: {
        nomeCompleto: string;
        email: string;
        dataNascimento: string;
        genero: string;
        senha: string;
    }): Promise<CadastroResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/registrar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosUsuario)
            });

            if (response.ok) {
                const usuario = await response.json();
                return {
                    success: true,
                    message: 'Cadastro realizado com sucesso!',
                    usuario: usuario
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.erro || 'Erro ao realizar cadastro. Verifique os dados e tente novamente.'
                };
            }
        } catch (error) {
            console.error('Erro na API de cadastro:', error);
            return {
                success: false,
                message: 'Erro de conexão. Verifique sua internet e tente novamente.'
            };
        }
    }

    // Fazer login via API
    async login(email: string, senha: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/usuarios/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha })
            });

            if (response.ok) {
                const data = await response.json();
                const usuario = data.usuario;
                
                // Gerar token simples para manter compatibilidade
                const token = this.generateToken(usuario);

                // Salvar sessão no localStorage
                this.setCurrentUser(usuario);
                localStorage.setItem(this.TOKEN_KEY, token);

                return {
                    success: true,
                    message: 'Login realizado com sucesso!',
                    usuario: usuario,
                    token: token
                };
            } else {
                const errorData = await response.json();
                return {
                    success: false,
                    message: errorData.erro || 'E-mail ou senha incorretos!'
                };
            }
        } catch (error) {
            console.error('Erro na API de login:', error);
            return {
                success: false,
                message: 'Erro de conexão. Verifique sua internet e tente novamente.'
            };
        }
    }

    // Fazer logout
    logout(): void {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
    }

    // Verificar se está logado
    isAuthenticated(): boolean {
        const usuario = this.getCurrentUser();
        const token = this.getToken();
        return !!(usuario && token);
    }

    // Obter usuário atual
    getCurrentUser(): Usuario | null {
        try {
            const userData = localStorage.getItem(this.CURRENT_USER_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch {
            return null;
        }
    }

    // Obter token atual
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Salvar usuário atual na sessão
    private setCurrentUser(usuario: Usuario): void {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(usuario));
    }

    // Gerar token simples para compatibilidade
    private generateToken(usuario: Usuario): string {
        const payload = {
            id: usuario.idUsuario,
            email: usuario.email,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        return btoa(JSON.stringify(payload));
    }

    // Estatísticas do usuário atual
    getStats() {
        return {
            usuarioAtual: this.getCurrentUser()?.nomeCompleto || 'Nenhum',
            isAuthenticated: this.isAuthenticated()
        };
    }

    // Limpar dados da sessão
    clearAllData(): void {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
    }
}

export const authService = new AuthService();



