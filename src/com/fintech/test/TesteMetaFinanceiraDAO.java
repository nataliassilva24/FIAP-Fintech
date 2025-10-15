package com.fintech.test;

import com.fintech.config.DatabaseConfig;
import com.fintech.dao.MetaFinanceiraDAO;
import com.fintech.dao.MetaFinanceiraDAOImpl;
import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import com.fintech.model.MetaFinanceira;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

public class TesteMetaFinanceiraDAO {
    
    private static final Logger LOGGER = Logger.getLogger(TesteMetaFinanceiraDAO.class.getName());
    private static final Long USUARIO_TESTE_ID = 1L;
    
    public static void main(String[] args) {
        System.out.println("=== TESTE META FINANCEIRA DAO - VERSÃO PROFISSIONAL ===\n");
        
        try {
            if (!configurarTeste()) {
                System.out.println("❌ Falha na configuração inicial. Encerrando testes.");
                return;
            }
            
            MetaFinanceiraDAO dao = new MetaFinanceiraDAOImpl();
            
            executarTestes(dao);
            
        } catch (Exception e) {
            LOGGER.severe("Erro durante os testes: " + e.getMessage());
            e.printStackTrace();
        } finally {
            finalizarTeste();
        }
        
        System.out.println("\n=== FIM DOS TESTES ===");
    }
    
    private static boolean configurarTeste() {
        System.out.println("🔧 Configurando ambiente de teste...");
        
        try {
            DatabaseConfig config = DatabaseConfig.getInstance();
            System.out.println("📋 Configurações do banco: " + config.toString());
            
            ConnectionManager connectionManager = ConnectionManager.getInstance();
            if (!connectionManager.testConnection()) {
                System.out.println("❌ Falha na conexão com o banco de dados!");
                System.out.println("💡 Dica: Verifique as configurações em DatabaseConfig");
                return false;
            }
            
            System.out.println("✅ Conexão com banco estabelecida!");
            System.out.println("📊 " + connectionManager.getPoolStats());
            
            return true;
            
        } catch (Exception e) {
            System.out.println("❌ Erro na configuração: " + e.getMessage());
            return false;
        }
    }
    
    private static void executarTestes(MetaFinanceiraDAO dao) {
        System.out.println("\n🧪 Iniciando bateria de testes...\n");
        
        try {
            testarInsercao(dao);
            
            testarConsultasBasicas(dao);
            
            testarConsultasEspecificas(dao);
            
            testarCalculos(dao);
            
            testarOperacoesValor(dao);
            
            testarEstatisticas(dao);
            
            testarCrudCompleto(dao);
            
            System.out.println("✅ Todos os testes executados com sucesso!");
            
        } catch (SQLException e) {
            System.out.println("❌ Erro SQL durante os testes: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("❌ Erro inesperado durante os testes: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void testarInsercao(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("1️⃣  Testando inserção de metas financeiras...");
        
        MetaFinanceira[] metas = criarMetasDemo();
        int sucessos = 0;
        
        for (int i = 0; i < metas.length; i++) {
            try {
                boolean resultado = dao.insert(metas[i]);
                if (resultado) {
                    System.out.printf("   ✅ Meta %d inserida (ID: %d - %s)\n", 
                        i + 1, metas[i].getIdMeta(), metas[i].getNome());
                    sucessos++;
                } else {
                    System.out.printf("   ❌ Falha ao inserir meta %d\n", i + 1);
                }
            } catch (Exception e) {
                System.out.printf("   ❌ Erro na meta %d: %s\n", i + 1, e.getMessage());
            }
        }
        
        System.out.printf("📊 Resultado inserção: %d/%d metas inseridas\n\n", sucessos, metas.length);
    }
    
    private static void testarConsultasBasicas(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("2️⃣  Testando consultas básicas...");
        
        List<MetaFinanceira> todasMetas = dao.findAll();
        System.out.printf("   📋 Total de metas encontradas: %d\n", todasMetas.size());
        
        long totalRegistros = dao.count();
        System.out.printf("   🔢 Count retornou: %d registros\n", totalRegistros);
        
        if (!todasMetas.isEmpty()) {
            Long primeiroId = todasMetas.get(0).getIdMeta();
            boolean existe = dao.exists(primeiroId);
            System.out.printf("   🔍 Exists para ID %d: %s\n", primeiroId, existe ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        if (!todasMetas.isEmpty()) {
            Long primeiroId = todasMetas.get(0).getIdMeta();
            Optional<MetaFinanceira> meta = dao.findById(primeiroId);
            System.out.printf("   🎯 FindById para ID %d: %s\n", primeiroId, 
                meta.isPresent() ? "✅ Encontrada" : "❌ Não encontrada");
        }
        
        System.out.println();
    }
    
    private static void testarConsultasEspecificas(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("3️⃣  Testando consultas específicas...");
        
        List<MetaFinanceira> metasUsuario = dao.findByUsuario(USUARIO_TESTE_ID);
        System.out.printf("   👤 Metas do usuário %d: %d\n", USUARIO_TESTE_ID, metasUsuario.size());
        
        List<MetaFinanceira> ativas = dao.findAtivas(USUARIO_TESTE_ID);
        List<MetaFinanceira> concluidas = dao.findConcluidas(USUARIO_TESTE_ID);
        List<MetaFinanceira> vencidas = dao.findVencidas(USUARIO_TESTE_ID);
        System.out.printf("   🟢 Metas ativas: %d\n", ativas.size());
        System.out.printf("   ✅ Metas concluídas: %d\n", concluidas.size());
        System.out.printf("   🔴 Metas vencidas: %d\n", vencidas.size());
        
        List<MetaFinanceira> viagem = dao.findByCategoria(CategoriaMeta.VIAGEM);
        List<MetaFinanceira> casa = dao.findByCategoria(CategoriaMeta.CASA);
        System.out.printf("   ✈️  Metas VIAGEM: %d\n", viagem.size());
        System.out.printf("   🏠 Metas CASA: %d\n", casa.size());
        
        List<MetaFinanceira> faixaValor = dao.findByFaixaValor(USUARIO_TESTE_ID, 
            new BigDecimal("1000"), new BigDecimal("50000"));
        System.out.printf("   💰 Metas entre R$ 1.000 e R$ 50.000: %d\n", faixaValor.size());
        
        List<MetaFinanceira> proximasVencimento = dao.findProximasVencimento(USUARIO_TESTE_ID, 60);
        System.out.printf("   ⏰ Metas com vencimento nos próximos 60 dias: %d\n", proximasVencimento.size());
        
        List<MetaFinanceira> prioridades = dao.findPorPrioridade(USUARIO_TESTE_ID, 3);
        System.out.printf("   🔥 Top 3 metas por prioridade: %d\n", prioridades.size());
        
        System.out.println();
    }
    
    private static void testarCalculos(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("4️⃣  Testando cálculos financeiros...");
        
        BigDecimal totalNecessario = dao.calcularTotalNecessario(USUARIO_TESTE_ID);
        BigDecimal totalAcumulado = dao.calcularTotalAcumulado(USUARIO_TESTE_ID);
        BigDecimal totalRestante = dao.calcularTotalRestante(USUARIO_TESTE_ID);
        
        System.out.printf("   🎯 Total necessário (metas ativas): R$ %.2f\n", totalNecessario);
        System.out.printf("   💰 Total acumulado: R$ %.2f\n", totalAcumulado);
        System.out.printf("   📊 Total restante: R$ %.2f\n", totalRestante);
        
        BigDecimal percentualMedio = dao.calcularPercentualMedio(USUARIO_TESTE_ID);
        System.out.printf("   📈 Percentual médio de progresso: %.1f%%\n", percentualMedio);
        
        BigDecimal economiaDiaria = dao.calcularEconomiaoDiariaMedia(USUARIO_TESTE_ID);
        System.out.printf("   💵 Economia diária média necessária: R$ %.2f\n", economiaDiaria);
        
        System.out.println();
    }
    
    private static void testarOperacoesValor(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("5️⃣  Testando operações de valor...");
        
        List<MetaFinanceira> metasAtivas = dao.findAtivas(USUARIO_TESTE_ID);
        if (!metasAtivas.isEmpty()) {
            MetaFinanceira metaTeste = metasAtivas.get(0);
            Long idMeta = metaTeste.getIdMeta();
            BigDecimal valorAnterior = metaTeste.getValorAcumulado();
            
            System.out.printf("   📋 Testando com meta: %s (Valor atual: R$ %.2f)\n", 
                metaTeste.getNome(), valorAnterior);
            
            BigDecimal valorAdicionar = new BigDecimal("500.00");
            boolean adicionou = dao.adicionarValor(idMeta, valorAdicionar);
            System.out.printf("   ➕ Adicionar R$ %.2f: %s\n", valorAdicionar, 
                adicionou ? "✅ Sucesso" : "❌ Falhou");
            
            Optional<MetaFinanceira> metaAtualizada = dao.findById(idMeta);
            if (metaAtualizada.isPresent()) {
                BigDecimal novoValor = metaAtualizada.get().getValorAcumulado();
                System.out.printf("   🔍 Verificação: R$ %.2f → R$ %.2f\n", valorAnterior, novoValor);
            }
            
            BigDecimal valorRemover = new BigDecimal("200.00");
            boolean removeu = dao.removerValor(idMeta, valorRemover);
            System.out.printf("   ➖ Remover R$ %.2f: %s\n", valorRemover, 
                removeu ? "✅ Sucesso" : "❌ Falhou");
        }
        
        System.out.println();
    }
    
    private static void testarEstatisticas(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("6️⃣  Testando estatísticas...");
        
        Map<CategoriaMeta, Long> porCategoria = dao.contarPorCategoria(USUARIO_TESTE_ID);
        System.out.println("   📊 Metas por categoria:");
        porCategoria.forEach((categoria, count) -> 
            System.out.printf("      %s: %d\n", categoria.getDescricao(), count));
        
        Map<StatusMeta, Long> porStatus = dao.contarPorStatus(USUARIO_TESTE_ID);
        System.out.println("   🔄 Metas por status:");
        porStatus.forEach((status, count) -> 
            System.out.printf("      %s: %d\n", status.getDescricao(), count));
        
        int metasAtualizadas = dao.atualizarMetasVencidas(USUARIO_TESTE_ID);
        System.out.printf("   🔄 Metas vencidas atualizadas: %d\n", metasAtualizadas);
        
        System.out.println();
    }
    
    private static void testarCrudCompleto(MetaFinanceiraDAO dao) throws SQLException {
        System.out.println("7️⃣  Testando CRUD completo...");
        
        MetaFinanceira metaTeste = new MetaFinanceira(9999L, USUARIO_TESTE_ID, "Meta Teste CRUD", 
            "Meta para testar operações CRUD", CategoriaMeta.OUTROS, 
            new BigDecimal("5000.00"), new BigDecimal("1000.00"), 
            LocalDate.now().plusMonths(6), StatusMeta.ATIVA);
        
        try {
            boolean inseriu = dao.insert(metaTeste);
            System.out.printf("   ➕ CREATE: %s\n", inseriu ? "✅ Sucesso" : "❌ Falhou");
            
            Optional<MetaFinanceira> lida = dao.findById(9999L);
            System.out.printf("   👁️  READ: %s\n", lida.isPresent() ? "✅ Encontrada" : "❌ Não encontrada");
            
            if (lida.isPresent()) {
                MetaFinanceira paraAtualizar = lida.get();
                paraAtualizar.setNome("Meta Teste CRUD - ATUALIZADA");
                paraAtualizar.setValorAcumulado(new BigDecimal("2000.00"));
                paraAtualizar.setCategoria(CategoriaMeta.LAZER);
                
                boolean atualizou = dao.update(paraAtualizar);
                System.out.printf("   📝 UPDATE: %s\n", atualizou ? "✅ Sucesso" : "❌ Falhou");
                
                Optional<MetaFinanceira> verificacao = dao.findById(9999L);
                if (verificacao.isPresent() && verificacao.get().getNome().contains("ATUALIZADA")) {
                    System.out.println("   🔍 Verificação UPDATE: ✅ Dados atualizados corretamente");
                }
                
                boolean statusAtualizado = dao.atualizarStatus(9999L, StatusMeta.PAUSADA);
                System.out.printf("   🔄 Atualizar Status: %s\n", statusAtualizado ? "✅ Sucesso" : "❌ Falhou");
            }
            
            boolean deletou = dao.delete(9999L);
            System.out.printf("   🗑️  DELETE: %s\n", deletou ? "✅ Sucesso" : "❌ Falhou");
            
            boolean aindaExiste = dao.exists(9999L);
            System.out.printf("   🔍 Verificação DELETE: %s\n", !aindaExiste ? "✅ Removida corretamente" : "❌ Ainda existe");
            
        } catch (Exception e) {
            System.out.println("   ❌ Erro durante teste CRUD: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static MetaFinanceira[] criarMetasDemo() {
        return new MetaFinanceira[]{
            new MetaFinanceira(4001L, USUARIO_TESTE_ID, "Viagem para Europa", 
                "Férias de 15 dias na Europa", CategoriaMeta.VIAGEM,
                new BigDecimal("15000.00"), new BigDecimal("3500.00"), 
                LocalDate.now().plusMonths(8), StatusMeta.ATIVA),
                
            new MetaFinanceira(4002L, USUARIO_TESTE_ID, "Entrada do Apartamento", 
                "Entrada para financiamento imobiliário", CategoriaMeta.CASA,
                new BigDecimal("80000.00"), new BigDecimal("25000.00"), 
                LocalDate.now().plusMonths(18), StatusMeta.ATIVA),
                
            new MetaFinanceira(4003L, USUARIO_TESTE_ID, "Carro Novo", 
                "Troca do carro atual", CategoriaMeta.CARRO,
                new BigDecimal("45000.00"), new BigDecimal("12000.00"), 
                LocalDate.now().plusMonths(12), StatusMeta.ATIVA),
                
            new MetaFinanceira(4004L, USUARIO_TESTE_ID, "MBA Executivo", 
                "Curso de pós-graduação", CategoriaMeta.EDUCACAO,
                new BigDecimal("25000.00"), new BigDecimal("8000.00"), 
                LocalDate.now().plusMonths(6), StatusMeta.ATIVA),
                
            new MetaFinanceira(4005L, USUARIO_TESTE_ID, "Reserva de Emergência", 
                "6 meses de despesas", CategoriaMeta.EMERGENCIA,
                new BigDecimal("30000.00"), new BigDecimal("30000.00"), 
                null, StatusMeta.CONCLUIDA) // Meta já concluída
        };
    }
    
    private static void finalizarTeste() {
        System.out.println("🧹 Finalizando ambiente de teste...");
        
        try {
            ConnectionManager.getInstance().shutdown();
            System.out.println("✅ Pool de conexões finalizado");
        } catch (Exception e) {
            System.out.println("⚠️  Aviso ao finalizar: " + e.getMessage());
        }
    }
}
