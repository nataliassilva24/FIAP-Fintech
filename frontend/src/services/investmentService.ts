// Serviço para Investimentos - Integração com Backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface Investimento {
    idInvestimento?: number;
    idUsuario: number;
    tipo: 'CDB' | 'ACAO' | 'TESOURO_SELIC' | 'TESOURO_IPCA' | 'FUNDO_IMOBILIARIO' | 'DEBENTURE';
    valorInvestido: number;
    dataAplicacao: string; // ISO date string
    dataResgate?: string | null;
    rendaFixa: boolean;
    rendaVariavel: boolean;
    ativo: boolean;
    resgatado: boolean;
}

export interface NovoInvestimento {
    idUsuario: number;
    tipo: 'CDB' | 'ACAO' | 'TESOURO_SELIC' | 'TESOURO_IPCA' | 'FUNDO_IMOBILIARIO' | 'DEBENTURE';
    valorInvestido: number;
    dataAplicacao: string;
}

export interface InvestmentSummary {
    totalInvestido: number;
    totalAtivo: number;
    totalResgatado: number;
    rendaFixa: number;
    rendaVariavel: number;
    quantidadeAtivos: number;
}

class InvestmentService {
    
    // Listar investimentos do usuário (dados reais do backend)
    async getInvestmentsByUser(idUsuario: number): Promise<Investimento[]> {
        try {
            console.log(`🔄 Buscando investimentos reais para usuário ${idUsuario}`);
            
            const response = await fetch(`${API_BASE_URL}/investimentos/usuario/${idUsuario}`);
            
            if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
            }
            
            const investimentosReais: Investimento[] = await response.json();
            
            console.log(`✅ ${investimentosReais.length} investimentos reais carregados do backend`);
            return investimentosReais;

        } catch (error) {
            console.error('❌ Erro ao buscar investimentos:', error);
            throw error; // Com dados reais, não precisamos mais de fallback
        }
    }

    // Criar novo investimento
    async createInvestment(investimento: NovoInvestimento): Promise<Investimento | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/investimentos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idUsuario: investimento.idUsuario,
                    tipo: investimento.tipo,
                    valorInvestido: investimento.valorInvestido,
                    dataAplicacao: investimento.dataAplicacao
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Investimento criado:', result);
                return result;
            } else {
                throw new Error('Erro ao criar investimento');
            }
        } catch (error) {
            console.error('❌ Erro ao criar investimento:', error);
            return null;
        }
    }

    // Resgatar investimento
    async resgateInvestment(idInvestimento: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/investimentos/${idInvestimento}/resgate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                console.log('✅ Investimento resgatado');
                return true;
            } else {
                throw new Error('Erro ao resgatar investimento');
            }
        } catch (error) {
            console.error('❌ Erro ao resgatar investimento:', error);
            return false;
        }
    }

    // Calcular resumo dos investimentos
    calculateSummary(investimentos: Investimento[]): InvestmentSummary {
        const ativos = investimentos.filter(inv => inv.ativo);
        const resgatados = investimentos.filter(inv => inv.resgatado);
        
        const totalInvestido = investimentos.reduce((acc, inv) => acc + inv.valorInvestido, 0);
        
        // Calcular valor atual incluindo rendimentos
        const totalAtivoComRendimento = ativos.reduce((acc, inv) => {
            const rendimento = this.calculateReturn(inv);
            return acc + inv.valorInvestido + rendimento.valor;
        }, 0);
        
        const totalResgatado = resgatados.reduce((acc, inv) => acc + inv.valorInvestido, 0);
        
        // Calcular renda fixa e variável com rendimentos
        const rendaFixaComRendimento = ativos
            .filter(inv => inv.rendaFixa)
            .reduce((acc, inv) => {
                const rendimento = this.calculateReturn(inv);
                return acc + inv.valorInvestido + rendimento.valor;
            }, 0);
            
        const rendaVariavelComRendimento = ativos
            .filter(inv => inv.rendaVariavel)
            .reduce((acc, inv) => {
                const rendimento = this.calculateReturn(inv);
                return acc + inv.valorInvestido + rendimento.valor;
            }, 0);

        return {
            totalInvestido,
            totalAtivo: totalAtivoComRendimento, // Agora inclui rendimentos
            totalResgatado,
            rendaFixa: rendaFixaComRendimento,    // Agora inclui rendimentos
            rendaVariavel: rendaVariavelComRendimento, // Agora inclui rendimentos
            quantidadeAtivos: ativos.length
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

    // Obter nome legível do tipo de investimento
    getTipoLabel(tipo: string): string {
        const labels: Record<string, string> = {
            'CDB': 'CDB',
            'ACAO': 'Ações',
            'TESOURO_SELIC': 'Tesouro Selic',
            'TESOURO_IPCA': 'Tesouro IPCA+',
            'FUNDO_IMOBILIARIO': 'Fundos Imobiliários',
            'DEBENTURE': 'Debêntures'
        };
        return labels[tipo] || tipo;
    }

    // Obter cor para cada tipo de investimento
    getTipoColor(tipo: string): string {
        const colors: Record<string, string> = {
            'CDB': '#10b981',
            'ACAO': '#3b82f6',
            'TESOURO_SELIC': '#f59e0b',
            'TESOURO_IPCA': '#8b5cf6',
            'FUNDO_IMOBILIARIO': '#ef4444',
            'DEBENTURE': '#6b7280'
        };
        return colors[tipo] || '#6b7280';
    }

    // Calcular dias aplicados
    calculateDaysApplied(dataAplicacao: string): number {
        const dataAplicacaoDate = new Date(dataAplicacao);
        const hoje = new Date();
        const diffTime = Math.abs(hoje.getTime() - dataAplicacaoDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Calcular rendimento simulado baseado no tipo e tempo
    calculateReturn(investimento: Investimento): { valor: number; percentual: number; isPositive: boolean } {
        const diasAplicados = this.calculateDaysApplied(investimento.dataAplicacao);
        const valorInvestido = investimento.valorInvestido;
        
        // Rendimentos anuais médios por tipo (simulados mas realistas)
        const rendimentosAnuais: Record<string, number> = {
            'CDB': 0.12,           // 12% ao ano
            'ACAO': 0.15,          // 15% ao ano (mais volátil)
            'TESOURO_SELIC': 0.125, // 12.5% ao ano
            'TESOURO_IPCA': 0.13,  // 13% ao ano
            'FUNDO_IMOBILIARIO': 0.11, // 11% ao ano
            'DEBENTURE': 0.14      // 14% ao ano
        };

        const rendimentoAnual = rendimentosAnuais[investimento.tipo] || 0.10;
        const rendimentoDiario = rendimentoAnual / 365;
        
        // Para ações, adicionar volatilidade simulada
        let fatorVolatilidade = 1;
        if (investimento.tipo === 'ACAO') {
            // Simular volatilidade baseada em hash do ID (consistente)
            const seed = investimento.idInvestimento || 1;
            const random = (seed * 9301 + 49297) % 233280;
            const normalizedRandom = random / 233280;
            fatorVolatilidade = 0.8 + (normalizedRandom * 0.4); // Entre 80% e 120%
        }

        const rendimentoTotal = valorInvestido * rendimentoDiario * diasAplicados * fatorVolatilidade;
        const percentualRendimento = (rendimentoTotal / valorInvestido) * 100;

        return {
            valor: rendimentoTotal,
            percentual: percentualRendimento,
            isPositive: rendimentoTotal >= 0
        };
    }

    // Formatear rendimento com sinal e cor
    formatReturn(rendimento: { valor: number; percentual: number; isPositive: boolean }): {
        texto: string;
        cor: string;
        icone: string;
    } {
        const sinal = rendimento.isPositive ? '+' : '';
        const icone = rendimento.isPositive ? '📈' : '📉';
        const cor = rendimento.isPositive ? '#10b981' : '#ef4444';
        
        const valorFormatado = this.formatCurrency(Math.abs(rendimento.valor));
        const percentualFormatado = `${sinal}${rendimento.percentual.toFixed(2)}%`;
        
        return {
            texto: `${sinal}${valorFormatado} (${percentualFormatado})`,
            cor,
            icone
        };
    }

    // Formatar período de aplicação
    formatDaysApplied(dias: number): string {
        if (dias < 30) {
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
}

export const investmentService = new InvestmentService();
