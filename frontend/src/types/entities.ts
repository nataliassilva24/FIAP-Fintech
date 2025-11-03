// Tipos TypeScript para o Frontend FIAP Fintech
// Baseados nas entidades do backend Spring Boot

// ============================================
// ENUMS (sincronizados com backend)
// ============================================

export enum Genero {
    MASCULINO = 'MASCULINO',
    FEMININO = 'FEMININO',
    NAO_BINARIO = 'NAO_BINARIO',
    NAO_INFORMADO = 'NAO_INFORMADO',
    OUTRO = 'OUTRO'
}

export enum TipoTransacao {
    CREDITO = 'CREDITO',
    DEBITO = 'DEBITO',
    TRANSFERENCIA = 'TRANSFERENCIA'
}

export enum TipoInvestimento {
    CDB = 'CDB',
    TESOURO_DIRETO = 'TESOURO_DIRETO',
    TESOURO_SELIC = 'TESOURO_SELIC',
    TESOURO_IPCA = 'TESOURO_IPCA',
    LCI = 'LCI',
    LCA = 'LCA',
    POUPANCA = 'POUPANCA',
    FUNDO_DI = 'FUNDO_DI',
    FUNDO_RENDA_FIXA = 'FUNDO_RENDA_FIXA',
    FUNDO_MULTIMERCADO = 'FUNDO_MULTIMERCADO',
    ACAO = 'ACAO',
    FII = 'FII',
    ETF = 'ETF',
    CRIPTO = 'CRIPTO'
}

export enum StatusMeta {
    ATIVA = 'ATIVA',
    PAUSADA = 'PAUSADA',
    CONCLUIDA = 'CONCLUIDA',
    VENCIDA = 'VENCIDA',
    CANCELADA = 'CANCELADA'
}

export enum CategoriaMeta {
    VIAGEM = 'VIAGEM',
    CASA = 'CASA',
    CARRO = 'CARRO',
    EDUCACAO = 'EDUCACAO',
    SAUDE = 'SAUDE',
    EMERGENCIA = 'EMERGENCIA',
    APOSENTADORIA = 'APOSENTADORIA',
    INVESTIMENTO = 'INVESTIMENTO',
    CASAMENTO = 'CASAMENTO',
    FESTA = 'FESTA',
    ELETRONICOS = 'ELETRONICOS',
    REFORMA = 'REFORMA',
    DIVIDA = 'DIVIDA',
    NEGOCIO = 'NEGOCIO',
    RESERVA = 'RESERVA',
    LAZER = 'LAZER',
    OUTROS = 'OUTROS'
}

// ============================================
// INTERFACES DAS ENTIDADES
// ============================================

export interface Usuario {
    idUsuario?: number;
    nomeCompleto: string;
    email: string;
    senha?: string; // Não retornado pela API
    dataNascimento: string; // ISO date string
    genero: Genero;
    dataCadastro?: string;
    ultimoLogin?: string;
    ativo?: boolean;
}

export interface Transacao {
    idTransacao?: number;
    idUsuario: number;
    tipoTransacao: TipoTransacao;
    categoria: string;
    descricao?: string;
    valor: number;
    data: string; // ISO date string
}

export interface Investimento {
    idInvestimento?: number;
    idUsuario: number;
    tipo: TipoInvestimento;
    valorInvestido: number;
    dataAplicacao: string; // ISO date string
    dataResgate?: string; // ISO date string
}

export interface MetaFinanceira {
    idMeta?: number;
    idUsuario: number;
    nome: string;
    descricao?: string;
    categoria: CategoriaMeta;
    valorNecessario: number;
    valorAcumulado?: number;
    dataLimite?: string; // ISO date string
    dataCriacao?: string; // ISO date string
    status?: StatusMeta;
}

// ============================================
// INTERFACES PARA FORMULÁRIOS
// ============================================

export interface LoginForm {
    email: string;
    senha: string;
}

export interface UsuarioForm {
    nomeCompleto: string;
    email: string;
    senha: string;
    dataNascimento: string;
    genero: Genero;
}

export interface TransacaoForm {
    idUsuario: number;
    tipoTransacao: TipoTransacao;
    categoria: string;
    descricao?: string;
    valor: number;
    data: string;
}

export interface InvestimentoForm {
    idUsuario: number;
    tipo: TipoInvestimento;
    valorInvestido: number;
    dataAplicacao: string;
}

export interface MetaFinanceiraForm {
    idUsuario: number;
    nome: string;
    descricao?: string;
    categoria: CategoriaMeta;
    valorNecessario: number;
    dataLimite?: string;
}

// ============================================
// INTERFACES DA API
// ============================================

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
    timestamp: string;
}

export interface LoginResponse {
    token: string;
    refreshToken?: string;
    usuario: Usuario;
    expiresIn?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

// ============================================
// INTERFACES PARA DASHBOARD/RELATÓRIOS
// ============================================

export interface DashboardData {
    saldoAtual: number;
    totalReceitas: number;
    totalDespesas: number;
    totalInvestido: number;
    totalInvestidoAtivo: number;
    metasAtivas: number;
    percentualMetasConcluidas: number;
}

export interface RelatorioPorCategoria {
    categoria: string;
    valor: number;
    percentual?: number;
}

export interface EstatisticasFinanceiras {
    receitasPorCategoria: RelatorioPorCategoria[];
    despesasPorCategoria: RelatorioPorCategoria[];
    investimentosPorTipo: RelatorioPorCategoria[];
    metasPorCategoria: RelatorioPorCategoria[];
}

// ============================================
// INTERFACES PARA COMPONENTES UI
// ============================================

export interface SelectOption {
    value: string;
    label: string;
}

export interface TableColumn<T> {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
    width?: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'date' | 'number' | 'select' | 'textarea';
    required?: boolean;
    placeholder?: string;
    options?: SelectOption[]; // Para select
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

// ============================================
// INTERFACES PARA CONTEXTOS
// ============================================

export interface AuthContextType {
    user: Usuario | null;
    token: string | null;
    login: (email: string, senha: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface NotificationContextType {
    showNotification: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    hideNotification: () => void;
}

// ============================================
// UTILITÁRIOS DE LABELS E FORMATAÇÃO
// ============================================

export const GeneroLabels: Record<Genero, string> = {
    [Genero.MASCULINO]: 'Masculino',
    [Genero.FEMININO]: 'Feminino',
    [Genero.NAO_BINARIO]: 'Não-binário',
    [Genero.NAO_INFORMADO]: 'Não informado',
    [Genero.OUTRO]: 'Outro'
};

export const TipoTransacaoLabels: Record<TipoTransacao, string> = {
    [TipoTransacao.CREDITO]: 'Receita',
    [TipoTransacao.DEBITO]: 'Despesa',
    [TipoTransacao.TRANSFERENCIA]: 'Transferência'
};

export const TipoInvestimentoLabels: Record<TipoInvestimento, string> = {
    [TipoInvestimento.CDB]: 'CDB',
    [TipoInvestimento.TESOURO_DIRETO]: 'Tesouro Direto',
    [TipoInvestimento.TESOURO_SELIC]: 'Tesouro Selic',
    [TipoInvestimento.TESOURO_IPCA]: 'Tesouro IPCA',
    [TipoInvestimento.LCI]: 'LCI',
    [TipoInvestimento.LCA]: 'LCA',
    [TipoInvestimento.POUPANCA]: 'Poupança',
    [TipoInvestimento.FUNDO_DI]: 'Fundo DI',
    [TipoInvestimento.FUNDO_RENDA_FIXA]: 'Fundo Renda Fixa',
    [TipoInvestimento.FUNDO_MULTIMERCADO]: 'Fundo Multimercado',
    [TipoInvestimento.ACAO]: 'Ações',
    [TipoInvestimento.FII]: 'FII',
    [TipoInvestimento.ETF]: 'ETF',
    [TipoInvestimento.CRIPTO]: 'Criptomoedas'
};

export const StatusMetaLabels: Record<StatusMeta, string> = {
    [StatusMeta.ATIVA]: 'Ativa',
    [StatusMeta.PAUSADA]: 'Pausada',
    [StatusMeta.CONCLUIDA]: 'Concluída',
    [StatusMeta.VENCIDA]: 'Vencida',
    [StatusMeta.CANCELADA]: 'Cancelada'
};

export const CategoriaMetaLabels: Record<CategoriaMeta, string> = {
    [CategoriaMeta.VIAGEM]: 'Viagem',
    [CategoriaMeta.CASA]: 'Casa',
    [CategoriaMeta.CARRO]: 'Carro',
    [CategoriaMeta.EDUCACAO]: 'Educação',
    [CategoriaMeta.SAUDE]: 'Saúde',
    [CategoriaMeta.EMERGENCIA]: 'Emergência',
    [CategoriaMeta.APOSENTADORIA]: 'Aposentadoria',
    [CategoriaMeta.INVESTIMENTO]: 'Investimento',
    [CategoriaMeta.CASAMENTO]: 'Casamento',
    [CategoriaMeta.FESTA]: 'Festa/Evento',
    [CategoriaMeta.ELETRONICOS]: 'Eletrônicos',
    [CategoriaMeta.REFORMA]: 'Reforma',
    [CategoriaMeta.DIVIDA]: 'Quitação de Dívida',
    [CategoriaMeta.NEGOCIO]: 'Negócio Próprio',
    [CategoriaMeta.RESERVA]: 'Reserva Financeira',
    [CategoriaMeta.LAZER]: 'Lazer',
    [CategoriaMeta.OUTROS]: 'Outros'
};

// ============================================
// PLANOS E ASSINATURAS
// ============================================

export enum StatusAssinatura {
    ATIVA = 'ATIVA',
    SUSPENSA = 'SUSPENSA',
    CANCELADA = 'CANCELADA',
    VENCIDA = 'VENCIDA',
    PENDENTE = 'PENDENTE',
    TRIAL = 'TRIAL'
}

export interface Plano {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    recursos: string[];
    limiteContas: number; // -1 = ilimitado
    limiteEmpresas: number;
    temIa: boolean;
    temRelatoriosAvancados: boolean;
    temSuportePrioritario: boolean;
    temConsultoria: boolean;
    ativo?: boolean;
    popular?: boolean; // Para destacar no frontend
    dataCriacao?: string;
}

export interface Assinatura {
    id: number;
    usuarioId: number;
    plano: Plano;
    status: StatusAssinatura;
    dataInicio: string;
    dataFim?: string;
    valorPago: number;
    numeroCartaoMascarado?: string;
    nomeTitularCartao?: string;
    bandeiraCartao?: string;
    metodoPagamento?: string;
    renovacaoAutomatica: boolean;
    dataProximaCobranca?: string;
    dataCriacao: string;
    observacoes?: string;
}

// DTOs para contratação
export interface DadosPagamento {
    numeroCartao: string;
    nomeTitular: string;
    validadeMesAno: string; // MM/AA
    cvv: string;
}

export interface ContratarPlanoRequest {
    usuarioId: number;
    planoId: number;
    dadosPagamento: DadosPagamento;
}

export interface ContratarPlanoResponse {
    message: string;
    assinaturaId: number;
    nomePlano: string;
    proximaCobranca: string;
    cartaoMascarado: string;
}

// DTOs para checkout
export interface CheckoutForm {
    planoId: number;
    dadosPagamento: DadosPagamento;
    aceitaTermos: boolean;
}

export interface StatusPlanoUsuario {
    usuarioId: number;
    temPlanoAtivo: boolean;
    planoAtual: string;
    podeContratar: boolean;
    assinaturaAtiva?: Assinatura;
}
