// Serviço para Metas Financeiras - Integração com Backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface Meta {
    idMeta?: number;
    idUsuario: number;
    nome: string;
    descricao?: string;
    categoria: 'EMERGENCIA' | 'INVESTIMENTO' | 'CASA' | 'VIAGEM' | 'EDUCACAO' | 'APOSENTADORIA' | 'OUTROS';
    valorNecessario: number;
    valorAcumulado: number;
    dataLimite?: string | null;
    dataCriacao: string;
    status: 'ATIVA' | 'CONCLUIDA' | 'PAUSADA' | 'CANCELADA';
    percentualAlcancado: number;
    valorRestante: number;
    diasRestantes: number;
    vencida: boolean;
    concluida: boolean;
}

export interface NovaMeta {
    idUsuario: number;
    nome: string;
    descricao: string;
    categoria: 'EMERGENCIA' | 'INVESTIMENTO' | 'CASA' | 'VIAGEM' | 'EDUCACAO' | 'APOSENTADORIA' | 'ELETRONICOS' | 'OUTROS';
    valorNecessario: number;
    dataLimite?: string;
}

export interface GoalSummary {
    totalMetas: number;
    metasAtivas: number;
    metasConcluidas: number;
    metasVencidas: number;
    totalValorNecessario: number;
    totalValorAcumulado: number;
    percentualGeralAlcancado: number;
}

class GoalService {
    
    // Listar metas do usuário (dados reais do backend)
    async getGoalsByUser(idUsuario: number): Promise<Meta[]> {
        try {
            console.log(`🔄 Buscando metas reais para usuário ${idUsuario}`);
            
            const response = await fetch(`${API_BASE_URL}/metas/usuario/${idUsuario}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const metasReais: Meta[] = await response.json();
            
            console.log(`✅ ${metasReais.length} metas reais carregadas do backend`);
            return metasReais;

        } catch (error) {
            console.error('❌ Erro ao buscar metas:', error);
            throw error; // Com dados reais, não precisamos mais de fallback
        }
    }

    // Criar nova meta
    async createGoal(meta: NovaMeta): Promise<Meta | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/metas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: meta.idUsuario,
                    nome: meta.nome,
                    descricao: meta.descricao,
                    categoria: meta.categoria,
                    valorNecessario: meta.valorNecessario,
                    dataLimite: meta.dataLimite || null
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Meta criada:', result);
                return result;
            } else {
                throw new Error('Erro ao criar meta');
            }
        } catch (error) {
            console.error('❌ Erro ao criar meta:', error);
            return null;
        }
    }

    // Adicionar valor à meta (contribuição)
    async addContribution(idMeta: number, valor: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/metas/${idMeta}/adicionar-valor`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ valor: valor.toString() })
            });

            if (response.ok) {
                console.log('✅ Contribuição adicionada');
                return true;
            } else {
                throw new Error('Erro ao adicionar contribuição');
            }
        } catch (error) {
            console.error('❌ Erro ao adicionar contribuição:', error);
            return false;
        }
    }

    // Atualizar meta existente
    async updateGoal(meta: Meta): Promise<Meta | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/metas/${meta.idMeta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: meta.idUsuario,
                    nome: meta.nome,
                    descricao: meta.descricao,
                    categoria: meta.categoria,
                    valorNecessario: meta.valorNecessario,
                    dataLimite: meta.dataLimite || null
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Meta atualizada:', result);
                return result;
            } else {
                throw new Error('Erro ao atualizar meta');
            }
        } catch (error) {
            console.error('❌ Erro ao atualizar meta:', error);
            return null;
        }
    }

    // Deletar meta
    async deleteGoal(idMeta: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/metas/${idMeta}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('✅ Meta deletada');
                return true;
            } else {
                throw new Error('Erro ao deletar meta');
            }
        } catch (error) {
            console.error('❌ Erro ao deletar meta:', error);
            return false;
        }
    }

    // Calcular resumo das metas
    calculateSummary(metas: Meta[]): GoalSummary {
        const totalMetas = metas.length;
        const metasAtivas = metas.filter(meta => meta.status === 'ATIVA').length;
        const metasConcluidas = metas.filter(meta => meta.concluida).length;
        const metasVencidas = metas.filter(meta => meta.vencida).length;
        
        const totalValorNecessario = metas.reduce((acc, meta) => acc + meta.valorNecessario, 0);
        const totalValorAcumulado = metas.reduce((acc, meta) => acc + meta.valorAcumulado, 0);
        
        const percentualGeralAlcancado = totalValorNecessario > 0 
            ? (totalValorAcumulado / totalValorNecessario) * 100 
            : 0;

        return {
            totalMetas,
            metasAtivas,
            metasConcluidas,
            metasVencidas,
            totalValorNecessario,
            totalValorAcumulado,
            percentualGeralAlcancado
        };
    }

    // Formatar valor monetário
    formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    }

    // Formatar data para exibição
    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    // Obter cor para cada categoria de meta
    getCategoriaColor(categoria: string): string {
        const colors: Record<string, string> = {
            'EMERGENCIA': '#ef4444',
            'INVESTIMENTO': '#10b981',
            'CASA': '#f59e0b',
            'VIAGEM': '#8b5cf6',
            'EDUCACAO': '#3b82f6',
            'APOSENTADORIA': '#6b7280',
            'ELETRONICOS': '#06b6d4',
            'OUTROS': '#64748b'
        };
        return colors[categoria] || '#64748b';
    }

    // Obter nome legível da categoria
    getCategoriaLabel(categoria: string): string {
        const labels: Record<string, string> = {
            'EMERGENCIA': 'Reserva de Emergência',
            'INVESTIMENTO': 'Investimento',
            'CASA': 'Casa Própria',
            'VIAGEM': 'Viagem',
            'EDUCACAO': 'Educação',
            'APOSENTADORIA': 'Aposentadoria',
            'ELETRONICOS': 'Eletrônicos',
            'OUTROS': 'Outros'
        };
        return labels[categoria] || categoria;
    }

    // Obter ícone para cada categoria
    getCategoriaIcon(categoria: string): string {
        const icons: Record<string, string> = {
            'EMERGENCIA': '🚨',
            'INVESTIMENTO': '📈',
            'CASA': '🏠',
            'VIAGEM': '✈️',
            'EDUCACAO': '📚',
            'APOSENTADORIA': '👴',
            'ELETRONICOS': '📱',
            'OUTROS': '🎯'
        };
        return icons[categoria] || '🎯';
    }

    // Formatar dias restantes
    formatDaysRemaining(dias: number): string {
        if (dias === 0) {
            return 'Hoje';
        } else if (dias === 1) {
            return '1 dia';
        } else if (dias < 30) {
            return `${dias} dias`;
        } else if (dias < 365) {
            const meses = Math.floor(dias / 30);
            const diasRestantes = dias % 30;
            return diasRestantes > 0 ? `${meses}m ${diasRestantes}d` : `${meses} meses`;
        } else {
            const anos = Math.floor(dias / 365);
            const mesesRestantes = Math.floor((dias % 365) / 30);
            return mesesRestantes > 0 ? `${anos}a ${mesesRestantes}m` : `${anos} anos`;
        }
    }

    // Obter cor da barra de progresso baseada no percentual
    getProgressColor(percentual: number, isVencida: boolean): string {
        if (isVencida) return '#ef4444'; // Vermelho para vencida
        if (percentual >= 100) return '#10b981'; // Verde para concluída
        if (percentual >= 75) return '#3b82f6'; // Azul para próximo da meta
        if (percentual >= 50) return '#f59e0b'; // Amarelo para meio caminho
        return '#6b7280'; // Cinza para início
    }

    // Calcular velocidade de progresso (valor por dia)
    calculateDailyProgress(meta: Meta): number {
        const diasDecorridos = this.calculateDaysFromCreation(meta.dataCriacao);
        return diasDecorridos > 0 ? meta.valorAcumulado / diasDecorridos : 0;
    }

    // Calcular dias desde criação
    calculateDaysFromCreation(dataCriacao: string): number {
        const dataCriacaoDate = new Date(dataCriacao);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - dataCriacaoDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

export const goalService = new GoalService();
