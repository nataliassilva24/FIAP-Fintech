// Serviço para dados do Dashboard - Integração com Backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface DashboardData {
    saldoTotal: number;
    receitasTotal: number;
    gastosTotal: number;
    totalInvestidoAtivo: number;
    metasAtivas: number;
    percentualMetasConcluidas: number;
}

export interface TransacaoPorCategoria {
    categoria: string;
    valor: number;
    count: number;
}

export interface DashboardStats {
    cards: DashboardData;
    despesasPorCategoria: TransacaoPorCategoria[];
    receitasPorCategoria: TransacaoPorCategoria[];
}

class DashboardService {
    
    // Buscar dados completos do dashboard para um usuário
    async getDashboardData(idUsuario: number, periodo?: string): Promise<DashboardStats> {
        try {
            console.log(`🔄 Carregando dados do dashboard para usuário ${idUsuario}${periodo ? ` - período: ${periodo}` : ' - totais gerais'}`);
            
            // Buscar dados básicos (estes endpoints funcionam)
            const [saldoResponse, receitasResponse, despesasResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/transacoes/usuario/${idUsuario}/saldo`),
                fetch(`${API_BASE_URL}/transacoes/usuario/${idUsuario}/receitas`), 
                fetch(`${API_BASE_URL}/transacoes/usuario/${idUsuario}/despesas`)
            ]);

            // Processar respostas
            const saldoData = await saldoResponse.json();
            const receitasData = await receitasResponse.json();
            const despesasData = await despesasResponse.json();

            // Calcular balanço
            const receitas = receitasData.totalReceitas || 0;
            const despesas = despesasData.totalDespesas || 0;
            const saldo = saldoData.saldo || 0;

            console.log(`📊 Dados reais: Saldo=${saldo}, Receitas=${receitas}, Despesas=${despesas}`);

            // Usar dados reais para cards e mock para gráficos (temporário até resolver serialização)
            return {
                cards: {
                    saldoTotal: saldo,
                    receitasTotal: receitas,
                    gastosTotal: despesas,
                    totalInvestidoAtivo: 0, // TODO: implementar quando endpoint funcionar
                    metasAtivas: 0,
                    percentualMetasConcluidas: 0
                },
                // Mock temporário para gráficos (até resolver problema de serialização do backend)
                despesasPorCategoria: [
                    { categoria: 'Alimentação', valor: despesas * 0.6, count: 5 },
                    { categoria: 'Transporte', valor: despesas * 0.3, count: 3 },
                    { categoria: 'Outros', valor: despesas * 0.1, count: 2 }
                ],
                receitasPorCategoria: receitas > 0 ? [
                    { categoria: 'Salário', valor: receitas * 0.8, count: 1 },
                    { categoria: 'Freelance', valor: receitas * 0.2, count: 2 }
                ] : [
                    { categoria: 'Aguardando receitas', valor: 0, count: 0 }
                ]
            };

        } catch (error) {
            console.error('❌ Erro ao buscar dados do dashboard:', error);
            // Retornar dados mock em caso de erro
            return this.getMockData();
        }
    }

    // Calcular transações por categoria (com filtro de período opcional)
    private calcularPorCategoria(transacoes: any[], tipo: 'CREDITO' | 'DEBITO', periodo?: string): TransacaoPorCategoria[] {
        let filteredTransacoes = transacoes.filter(t => t.tipoTransacao === tipo);
        
        // Filtrar por período se especificado
        if (periodo) {
            const [year, month] = periodo.split('-');
            filteredTransacoes = filteredTransacoes.filter(t => {
                const dataTransacao = new Date(t.data);
                return dataTransacao.getFullYear().toString() === year && 
                       (dataTransacao.getMonth() + 1).toString().padStart(2, '0') === month;
            });
        }

        // Agrupar por categoria
        const categorias = new Map<string, { valor: number, count: number }>();
        
        filteredTransacoes.forEach(transacao => {
            const categoria = transacao.categoria || 'Outros';
            const valor = parseFloat(transacao.valor) || 0;
            
            if (categorias.has(categoria)) {
                const existing = categorias.get(categoria)!;
                categorias.set(categoria, {
                    valor: existing.valor + valor,
                    count: existing.count + 1
                });
            } else {
                categorias.set(categoria, { valor, count: 1 });
            }
        });

        // Converter para array e ordenar por valor
        return Array.from(categorias.entries())
            .map(([categoria, data]) => ({
                categoria,
                valor: data.valor,
                count: data.count
            }))
            .sort((a, b) => b.valor - a.valor)
            .slice(0, 5); // Limitar a 5 categorias principais
    }

    // Dados mock para fallback
    private getMockData(): DashboardStats {
        return {
            cards: {
                saldoTotal: 127840.50,
                receitasTotal: 45200.00,
                gastosTotal: 23750.30,
                totalInvestidoAtivo: 50000.00,
                metasAtivas: 3,
                percentualMetasConcluidas: 78
            },
            despesasPorCategoria: [
                { categoria: 'Alimentação', valor: 520.00, count: 15 },
                { categoria: 'Transporte', valor: 280.00, count: 8 },
                { categoria: 'Lazer', valor: 390.00, count: 5 }
            ],
            receitasPorCategoria: [
                { categoria: 'Salário', valor: 5200.00, count: 1 },
                { categoria: 'Freelance', valor: 1562.08, count: 3 }
            ]
        };
    }

    // Formatar valor para exibição
    formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        }).format(value);
    }

    // Calcular percentual de variação (mock)
    calculatePercentageChange(current: number, previous: number): string {
        const change = ((current - previous) / previous) * 100;
        const sign = change > 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}%`;
    }
}

export const dashboardService = new DashboardService();
