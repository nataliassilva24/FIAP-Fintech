// Serviço de API para comunicação com backend Spring Boot

import {
    ApiResponse,
    Investimento,
    InvestimentoForm,
    LoginForm,
    LoginResponse,
    MetaFinanceira,
    MetaFinanceiraForm,
    Transacao,
    TransacaoForm,
    Usuario,
    UsuarioForm
} from '@types/entities';
import axios, { AxiosResponse } from 'axios';

// Configuração base do Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se token expirou, redirecionar para login
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Utilitário para extrair dados da resposta
const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    return response.data.data as T;
};

// ============================================
// USUÁRIOS
// ============================================

export const usuariosAPI = {
    // Listar usuários
    listar: async (): Promise<Usuario[]> => {
        const response = await api.get<ApiResponse<Usuario[]>>('/usuarios');
        return extractData(response);
    },

    // Buscar usuário por ID
    buscarPorId: async (id: number): Promise<Usuario> => {
        const response = await api.get<ApiResponse<Usuario>>(`/usuarios/${id}`);
        return extractData(response);
    },

    // Criar usuário
    criar: async (usuario: UsuarioForm): Promise<Usuario> => {
        const response = await api.post<ApiResponse<Usuario>>('/usuarios', usuario);
        return extractData(response);
    },

    // Registrar usuário (endpoint específico)
    registrar: async (usuario: UsuarioForm): Promise<Usuario> => {
        const response = await api.post<ApiResponse<Usuario>>('/usuarios/registrar', usuario);
        return extractData(response);
    },

    // Autenticar usuário
    autenticar: async (credentials: LoginForm): Promise<LoginResponse> => {
        const response = await api.post<ApiResponse<LoginResponse>>('/usuarios/auth', credentials);
        return extractData(response);
    },

    // Atualizar usuário
    atualizar: async (id: number, usuario: Partial<UsuarioForm>): Promise<Usuario> => {
        const response = await api.put<ApiResponse<Usuario>>(`/usuarios/${id}`, usuario);
        return extractData(response);
    },

    // Deletar usuário
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/usuarios/${id}`);
    },

    // Buscar por email
    buscarPorEmail: async (email: string): Promise<Usuario | null> => {
        try {
            const response = await api.get<ApiResponse<Usuario>>(`/usuarios/email/${email}`);
            return extractData(response);
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    },

    // Ativar/Desativar usuário
    ativar: async (id: number): Promise<Usuario> => {
        const response = await api.patch<ApiResponse<Usuario>>(`/usuarios/${id}/ativar`);
        return extractData(response);
    },

    desativar: async (id: number): Promise<Usuario> => {
        const response = await api.patch<ApiResponse<Usuario>>(`/usuarios/${id}/desativar`);
        return extractData(response);
    }
};

// ============================================
// TRANSAÇÕES
// ============================================

export const transacoesAPI = {
    // Listar todas as transações
    listar: async (): Promise<Transacao[]> => {
        const response = await api.get<ApiResponse<Transacao[]>>('/transacoes');
        return extractData(response);
    },

    // Listar transações por usuário
    listarPorUsuario: async (idUsuario: number): Promise<Transacao[]> => {
        const response = await api.get<ApiResponse<Transacao[]>>(`/transacoes/usuario/${idUsuario}`);
        return extractData(response);
    },

    // Buscar transação por ID
    buscarPorId: async (id: number): Promise<Transacao> => {
        const response = await api.get<ApiResponse<Transacao>>(`/transacoes/${id}`);
        return extractData(response);
    },

    // Criar transação
    criar: async (transacao: TransacaoForm): Promise<Transacao> => {
        const response = await api.post<ApiResponse<Transacao>>('/transacoes', transacao);
        return extractData(response);
    },

    // Registrar receita
    criarReceita: async (dados: Omit<TransacaoForm, 'tipoTransacao'>): Promise<Transacao> => {
        const response = await api.post<ApiResponse<Transacao>>('/transacoes/receita', dados);
        return extractData(response);
    },

    // Registrar despesa
    criarDespesa: async (dados: Omit<TransacaoForm, 'tipoTransacao'>): Promise<Transacao> => {
        const response = await api.post<ApiResponse<Transacao>>('/transacoes/despesa', dados);
        return extractData(response);
    },

    // Calcular saldo
    calcularSaldo: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ saldo: number }>>(`/transacoes/usuario/${idUsuario}/saldo`);
        return extractData(response).saldo;
    },

    // Calcular receitas
    calcularReceitas: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ totalReceitas: number }>>(`/transacoes/usuario/${idUsuario}/receitas`);
        return extractData(response).totalReceitas;
    },

    // Calcular despesas
    calcularDespesas: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ totalDespesas: number }>>(`/transacoes/usuario/${idUsuario}/despesas`);
        return extractData(response).totalDespesas;
    },

    // Atualizar transação
    atualizar: async (id: number, transacao: TransacaoForm): Promise<Transacao> => {
        const response = await api.put<ApiResponse<Transacao>>(`/transacoes/${id}`, transacao);
        return extractData(response);
    },

    // Deletar transação
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/transacoes/${id}`);
    }
};

// ============================================
// INVESTIMENTOS
// ============================================

export const investimentosAPI = {
    // Listar todos os investimentos
    listar: async (): Promise<Investimento[]> => {
        const response = await api.get<ApiResponse<Investimento[]>>('/investimentos');
        return extractData(response);
    },

    // Listar investimentos por usuário
    listarPorUsuario: async (idUsuario: number): Promise<Investimento[]> => {
        const response = await api.get<ApiResponse<Investimento[]>>(`/investimentos/usuario/${idUsuario}`);
        return extractData(response);
    },

    // Listar investimentos ativos por usuário
    listarAtivosPorUsuario: async (idUsuario: number): Promise<Investimento[]> => {
        const response = await api.get<ApiResponse<Investimento[]>>(`/investimentos/usuario/${idUsuario}/ativos`);
        return extractData(response);
    },

    // Buscar investimento por ID
    buscarPorId: async (id: number): Promise<Investimento> => {
        const response = await api.get<ApiResponse<Investimento>>(`/investimentos/${id}`);
        return extractData(response);
    },

    // Criar investimento
    criar: async (investimento: InvestimentoForm): Promise<Investimento> => {
        const response = await api.post<ApiResponse<Investimento>>('/investimentos', investimento);
        return extractData(response);
    },

    // Aplicar investimento (endpoint específico)
    aplicar: async (dados: InvestimentoForm): Promise<Investimento> => {
        const response = await api.post<ApiResponse<Investimento>>('/investimentos/aplicar', dados);
        return extractData(response);
    },

    // Resgatar investimento
    resgatar: async (id: number): Promise<Investimento> => {
        const response = await api.patch<ApiResponse<Investimento>>(`/investimentos/${id}/resgatar`);
        return extractData(response);
    },

    // Calcular total investido
    calcularTotalInvestido: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ totalInvestido: number }>>(`/investimentos/usuario/${idUsuario}/total`);
        return extractData(response).totalInvestido;
    },

    // Calcular total investido ativo
    calcularTotalAtivo: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ totalInvestidoAtivo: number }>>(`/investimentos/usuario/${idUsuario}/total-ativo`);
        return extractData(response).totalInvestidoAtivo;
    },

    // Atualizar investimento
    atualizar: async (id: number, investimento: InvestimentoForm): Promise<Investimento> => {
        const response = await api.put<ApiResponse<Investimento>>(`/investimentos/${id}`, investimento);
        return extractData(response);
    },

    // Deletar investimento
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/investimentos/${id}`);
    }
};

// ============================================
// METAS FINANCEIRAS
// ============================================

export const metasAPI = {
    // Listar todas as metas
    listar: async (): Promise<MetaFinanceira[]> => {
        const response = await api.get<ApiResponse<MetaFinanceira[]>>('/metas');
        return extractData(response);
    },

    // Listar metas por usuário
    listarPorUsuario: async (idUsuario: number): Promise<MetaFinanceira[]> => {
        const response = await api.get<ApiResponse<MetaFinanceira[]>>(`/metas/usuario/${idUsuario}`);
        return extractData(response);
    },

    // Listar metas ativas por usuário
    listarAtivasPorUsuario: async (idUsuario: number): Promise<MetaFinanceira[]> => {
        const response = await api.get<ApiResponse<MetaFinanceira[]>>(`/metas/usuario/${idUsuario}/ativas`);
        return extractData(response);
    },

    // Buscar meta por ID
    buscarPorId: async (id: number): Promise<MetaFinanceira> => {
        const response = await api.get<ApiResponse<MetaFinanceira>>(`/metas/${id}`);
        return extractData(response);
    },

    // Criar meta
    criar: async (meta: MetaFinanceiraForm): Promise<MetaFinanceira> => {
        const response = await api.post<ApiResponse<MetaFinanceira>>('/metas', meta);
        return extractData(response);
    },

    // Criar meta (endpoint específico)
    criarCompleta: async (dados: MetaFinanceiraForm): Promise<MetaFinanceira> => {
        const response = await api.post<ApiResponse<MetaFinanceira>>('/metas/criar', dados);
        return extractData(response);
    },

    // Adicionar valor à meta
    adicionarValor: async (id: number, valor: number): Promise<MetaFinanceira> => {
        const response = await api.patch<ApiResponse<MetaFinanceira>>(`/metas/${id}/adicionar-valor`, { valor });
        return extractData(response);
    },

    // Calcular total necessário das metas ativas
    calcularTotalNecessario: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ totalNecessario: number }>>(`/metas/usuario/${idUsuario}/total-necessario`);
        return extractData(response).totalNecessario;
    },

    // Calcular total acumulado das metas ativas  
    calcularTotalAcumulado: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ totalAcumulado: number }>>(`/metas/usuario/${idUsuario}/total-acumulado`);
        return extractData(response).totalAcumulado;
    },

    // Contar metas ativas
    contarAtivas: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ metasAtivas: number }>>(`/metas/usuario/${idUsuario}/estatisticas/ativas`);
        return extractData(response).metasAtivas;
    },

    // Contar metas concluídas
    contarConcluidas: async (idUsuario: number): Promise<number> => {
        const response = await api.get<ApiResponse<{ metasConcluidas: number }>>(`/metas/usuario/${idUsuario}/estatisticas/concluidas`);
        return extractData(response).metasConcluidas;
    },

    // Atualizar meta
    atualizar: async (id: number, meta: MetaFinanceiraForm): Promise<MetaFinanceira> => {
        const response = await api.put<ApiResponse<MetaFinanceira>>(`/metas/${id}`, meta);
        return extractData(response);
    },

    // Deletar meta
    deletar: async (id: number): Promise<void> => {
        await api.delete(`/metas/${id}`);
    }
};

// ============================================
// EXPORTAR TODAS AS APIs
// ============================================

export const apiService = {
    usuarios: usuariosAPI,
    transacoes: transacoesAPI,
    investimentos: investimentosAPI,
    metas: metasAPI
};

export default apiService;



