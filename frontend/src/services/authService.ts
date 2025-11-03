// Simulação de serviço de autenticação com localStorage
export interface Usuario {
    id: number;
    nomeCompleto: string;
    email: string;
    dataNascimento: string;
    genero: string;
    senha: string;
    dataCriacao: string;
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
    private readonly USERS_KEY = 'fiap_fintech_users';
    private readonly CURRENT_USER_KEY = 'fiap_fintech_current_user';
    private readonly TOKEN_KEY = 'fiap_fintech_token';

    // Cadastrar novo usuário
    cadastrar(dadosUsuario: Omit<Usuario, 'id' | 'dataCriacao'>): CadastroResponse {
        try {
            const usuarios = this.getUsuarios();

            // Verificar se email já existe
            const emailExiste = usuarios.find(u => u.email.toLowerCase() === dadosUsuario.email.toLowerCase());
            if (emailExiste) {
                return {
                    success: false,
                    message: 'Este e-mail já está cadastrado!'
                };
            }

            // Criar novo usuário
            const novoUsuario: Usuario = {
                ...dadosUsuario,
                id: Date.now(), // ID simples baseado em timestamp
                dataCriacao: new Date().toISOString()
            };

            // Salvar usuário
            usuarios.push(novoUsuario);
            localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));

            // Auto-login após cadastro
            this.setCurrentUser(novoUsuario);

            return {
                success: true,
                message: 'Cadastro realizado com sucesso!',
                usuario: novoUsuario
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno. Tente novamente.'
            };
        }
    }

    // Fazer login
    login(email: string, senha: string): LoginResponse {
        try {
            const usuarios = this.getUsuarios();

            const usuario = usuarios.find(u =>
                u.email.toLowerCase() === email.toLowerCase() &&
                u.senha === senha
            );

            if (!usuario) {
                return {
                    success: false,
                    message: 'E-mail ou senha incorretos!'
                };
            }

            // Gerar token simples
            const token = this.generateToken(usuario);

            // Salvar sessão
            this.setCurrentUser(usuario);
            localStorage.setItem(this.TOKEN_KEY, token);

            return {
                success: true,
                message: 'Login realizado com sucesso!',
                usuario: usuario,
                token: token
            };
        } catch (error) {
            return {
                success: false,
                message: 'Erro interno. Tente novamente.'
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

    // Obter todos os usuários cadastrados
    private getUsuarios(): Usuario[] {
        try {
            const users = localStorage.getItem(this.USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch {
            return [];
        }
    }

    // Salvar usuário atual
    private setCurrentUser(usuario: Usuario): void {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(usuario));
    }

    // Gerar token simples
    private generateToken(usuario: Usuario): string {
        const payload = {
            id: usuario.id,
            email: usuario.email,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        };
        return btoa(JSON.stringify(payload));
    }

    // Estatísticas para desenvolvimento
    getStats() {
        const usuarios = this.getUsuarios();
        return {
            totalUsuarios: usuarios.length,
            usuarioAtual: this.getCurrentUser()?.nomeCompleto || 'Nenhum',
            isAuthenticated: this.isAuthenticated()
        };
    }

    // Limpar todos os dados (para desenvolvimento)
    clearAllData(): void {
        localStorage.removeItem(this.USERS_KEY);
        localStorage.removeItem(this.CURRENT_USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
    }
}

export const authService = new AuthService();



