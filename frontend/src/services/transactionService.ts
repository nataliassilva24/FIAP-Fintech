// Serviço para Transações - Integração com Backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface Transacao {
    idTransacao?: number;
    idUsuario: number;
    tipoTransacao: 'CREDITO' | 'DEBITO' | 'TRANSFERENCIA';
    categoria: string;
    descricao?: string;
    valor: number;
    data: string; // ISO date string
}

export interface NovaTransacao {
    idUsuario: number;
    tipoTransacao: 'CREDITO' | 'DEBITO';
    categoria: string;
    descricao: string;
    valor: number;
    data: string;
}

class TransactionService {
    
    // Listar transações do usuário (dados reais do backend)
    async getTransacoesByUser(idUsuario: number): Promise<Transacao[]> {
        try {
            console.log(`🔄 Buscando transações reais para usuário ${idUsuario}`);
            
            const response = await fetch(`${API_BASE_URL}/transacoes/usuario/${idUsuario}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const transacoesReais: Transacao[] = await response.json();
            
            console.log(`✅ ${transacoesReais.length} transações reais carregadas do backend`);
            return transacoesReais;

        } catch (error) {
            console.error('❌ Erro ao buscar transações:', error);
            
            // Fallback: tentar buscar dados agregados como antes
            try {
                console.log('🔄 Usando fallback com dados agregados...');
                const [receitasResponse, despesasResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/transacoes/usuario/${idUsuario}/receitas`),
                    fetch(`${API_BASE_URL}/transacoes/usuario/${idUsuario}/despesas`)
                ]);

                const receitasData = await receitasResponse.json();
                const despesasData = await despesasResponse.json();

                // Simulação como fallback
                const transacoesFallback: Transacao[] = [];
                
                if (despesasData.totalDespesas > 0) {
                    transacoesFallback.push({
                        idTransacao: 1,
                        idUsuario,
                        tipoTransacao: 'DEBITO',
                        categoria: 'Moradia',
                        descricao: 'Total de despesas do período',
                        valor: despesasData.totalDespesas,
                        data: new Date().toISOString().split('T')[0]
                    });
                }

                if (receitasData.totalReceitas > 0) {
                    transacoesFallback.push({
                        idTransacao: 2,
                        idUsuario,
                        tipoTransacao: 'CREDITO',
                        categoria: 'Salário',
                        descricao: 'Total de receitas do período',
                        valor: receitasData.totalReceitas,
                        data: new Date().toISOString().split('T')[0]
                    });
                }

                console.log(`📋 Usando ${transacoesFallback.length} transações de fallback`);
                return transacoesFallback;
                
            } catch (fallbackError) {
                console.error('❌ Erro no fallback:', fallbackError);
                return [];
            }
        }
    }

    // Criar nova transação (quando modal for implementado)
    async createTransaction(transacao: NovaTransacao): Promise<Transacao | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/transacoes/receita`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: transacao.idUsuario,
                    categoria: transacao.categoria,
                    descricao: transacao.descricao,
                    valor: transacao.valor,
                    data: transacao.data
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Transação criada:', result);
                return result;
            } else {
                throw new Error('Erro ao criar transação');
            }
        } catch (error) {
            console.error('❌ Erro ao criar transação:', error);
            return null;
        }
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

    // Calcular totais por tipo
    calculateTotals(transacoes: Transacao[]) {
        const receitas = transacoes
            .filter(t => t.tipoTransacao === 'CREDITO')
            .reduce((acc, t) => acc + t.valor, 0);
            
        const despesas = transacoes
            .filter(t => t.tipoTransacao === 'DEBITO')
            .reduce((acc, t) => acc + t.valor, 0);

        return {
            receitas,
            despesas,
            saldo: receitas - despesas
        };
    }
}

export const transactionService = new TransactionService();
