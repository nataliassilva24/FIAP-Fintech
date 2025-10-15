package com.fintech.test;

import com.fintech.config.DatabaseConfig;
import com.fintech.dao.InvestimentoDAO;
import com.fintech.dao.InvestimentoDAOImpl;
import com.fintech.enums.TipoInvestimento;
import com.fintech.model.Investimento;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

public class TesteInvestimentoDAO {
    
    private static final Logger LOGGER = Logger.getLogger(TesteInvestimentoDAO.class.getName());
    private static final Long USUARIO_TESTE_ID = 1L;
    
    public static void main(String[] args) {
        System.out.println("=== TESTE INVESTIMENTO DAO - VERSÃO PROFISSIONAL ===\n");
        
        try {
            if (!configurarTeste()) {
                System.out.println("❌ Falha na configuração inicial. Encerrando testes.");
                return;
            }
            
            InvestimentoDAO dao = new InvestimentoDAOImpl();
            
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
    
    private static void executarTestes(InvestimentoDAO dao) {
        System.out.println("\n🧪 Iniciando bateria de testes...\n");
        
        try {
            testarInsercao(dao);
            
            testarConsultasBasicas(dao);
            
            testarConsultasEspecificas(dao);
            
            testarCalculos(dao);
            
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
    
    private static void testarInsercao(InvestimentoDAO dao) throws SQLException {
        System.out.println("1️⃣  Testando inserção de investimentos...");
        
        Investimento[] investimentos = criarInvestimentosDemo();
        int sucessos = 0;
        
        for (int i = 0; i < investimentos.length; i++) {
            try {
                boolean resultado = dao.insert(investimentos[i]);
                if (resultado) {
                    System.out.printf("   ✅ Investimento %d inserido (ID: %d - %s)\n", 
                        i + 1, investimentos[i].getIdInvestimento(), investimentos[i].getTipo().getDescricao());
                    sucessos++;
                } else {
                    System.out.printf("   ❌ Falha ao inserir investimento %d\n", i + 1);
                }
            } catch (Exception e) {
                System.out.printf("   ❌ Erro no investimento %d: %s\n", i + 1, e.getMessage());
            }
        }
        
        System.out.printf("📊 Resultado inserção: %d/%d investimentos inseridos\n\n", sucessos, investimentos.length);
    }
    
    private static void testarConsultasBasicas(InvestimentoDAO dao) throws SQLException {
        System.out.println("2️⃣  Testando consultas básicas...");
        
        List<Investimento> todosInvestimentos = dao.findAll();
        System.out.printf("   📋 Total de investimentos encontrados: %d\n", todosInvestimentos.size());
        
        long totalRegistros = dao.count();
        System.out.printf("   🔢 Count retornou: %d registros\n", totalRegistros);
        
        if (!todosInvestimentos.isEmpty()) {
            Long primeiroId = todosInvestimentos.get(0).getIdInvestimento();
            boolean existe = dao.exists(primeiroId);
            System.out.printf("   🔍 Exists para ID %d: %s\n", primeiroId, existe ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        if (!todosInvestimentos.isEmpty()) {
            Long primeiroId = todosInvestimentos.get(0).getIdInvestimento();
            Optional<Investimento> investimento = dao.findById(primeiroId);
            System.out.printf("   🎯 FindById para ID %d: %s\n", primeiroId, 
                investimento.isPresent() ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        System.out.println();
    }
    
    private static void testarConsultasEspecificas(InvestimentoDAO dao) throws SQLException {
        System.out.println("3️⃣  Testando consultas específicas...");
        
        List<Investimento> investimentosUsuario = dao.findByUsuario(USUARIO_TESTE_ID);
        System.out.printf("   👤 Investimentos do usuário %d: %d\n", USUARIO_TESTE_ID, investimentosUsuario.size());
        
        List<Investimento> tesouro = dao.findByTipo(TipoInvestimento.TESOURO_DIRETO);
        List<Investimento> cdb = dao.findByTipo(TipoInvestimento.CDB);
        System.out.printf("   🏛️  Investimentos TESOURO_DIRETO: %d\n", tesouro.size());
        System.out.printf("   🏦 Investimentos CDB: %d\n", cdb.size());
        
        List<Investimento> ativos = dao.findAtivos(USUARIO_TESTE_ID);
        List<Investimento> resgatados = dao.findResgatados(USUARIO_TESTE_ID);
        System.out.printf("   🟢 Investimentos ativos: %d\n", ativos.size());
        System.out.printf("   🔴 Investimentos resgatados: %d\n", resgatados.size());
        
        LocalDate inicioAno = LocalDate.now().withDayOfYear(1);
        LocalDate fimAno = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear());
        List<Investimento> investimentosAno = dao.findByPeriodoAplicacao(inicioAno, fimAno);
        System.out.printf("   📅 Investimentos aplicados este ano: %d\n", investimentosAno.size());
        
        List<Investimento> rendaFixa = dao.findRendaFixa(USUARIO_TESTE_ID);
        List<Investimento> rendaVariavel = dao.findRendaVariavel(USUARIO_TESTE_ID);
        System.out.printf("   📈 Renda Fixa: %d\n", rendaFixa.size());
        System.out.printf("   📊 Renda Variável: %d\n", rendaVariavel.size());
        
        System.out.println();
    }
    
    private static void testarCalculos(InvestimentoDAO dao) throws SQLException {
        System.out.println("4️⃣  Testando cálculos financeiros...");
        
        BigDecimal totalInvestido = dao.calcularTotalInvestido(USUARIO_TESTE_ID);
        System.out.printf("   💰 Total investido pelo usuário %d: R$ %.2f\n", USUARIO_TESTE_ID, totalInvestido);
        
        BigDecimal totalAtivos = dao.calcularTotalAtivos(USUARIO_TESTE_ID);
        System.out.printf("   🟢 Total em investimentos ativos: R$ %.2f\n", totalAtivos);
        
        BigDecimal totalCDB = dao.calcularTotalPorTipo(USUARIO_TESTE_ID, TipoInvestimento.CDB);
        BigDecimal totalTesouro = dao.calcularTotalPorTipo(USUARIO_TESTE_ID, TipoInvestimento.TESOURO_DIRETO);
        System.out.printf("   🏦 Total em CDB: R$ %.2f\n", totalCDB);
        System.out.printf("   🏛️  Total em Tesouro Direto: R$ %.2f\n", totalTesouro);
        
        List<Investimento> proximosVencimento = dao.findProximosVencimento(USUARIO_TESTE_ID, 30);
        System.out.printf("   ⏰ Investimentos com vencimento nos próximos 30 dias: %d\n", proximosVencimento.size());
        
        System.out.println();
    }
    
    private static void testarCrudCompleto(InvestimentoDAO dao) throws SQLException {
        System.out.println("5️⃣  Testando CRUD completo...");
        
        Investimento investimentoTeste = new Investimento(9999L, USUARIO_TESTE_ID, TipoInvestimento.POUPANCA,
                new BigDecimal("1000.00"), LocalDate.now(), LocalDate.now().plusMonths(12));
        
        try {
            boolean inseriu = dao.insert(investimentoTeste);
            System.out.printf("   ➕ CREATE: %s\n", inseriu ? "✅ Sucesso" : "❌ Falhou");
            
            Optional<Investimento> lido = dao.findById(9999L);
            System.out.printf("   👁️  READ: %s\n", lido.isPresent() ? "✅ Encontrado" : "❌ Não encontrado");
            
            if (lido.isPresent()) {
                Investimento paraAtualizar = lido.get();
                paraAtualizar.setValorInvestido(new BigDecimal("2000.00"));
                paraAtualizar.setTipo(TipoInvestimento.CDB);
                
                boolean atualizou = dao.update(paraAtualizar);
                System.out.printf("   📝 UPDATE: %s\n", atualizou ? "✅ Sucesso" : "❌ Falhou");
                
                Optional<Investimento> verificacao = dao.findById(9999L);
                if (verificacao.isPresent() && verificacao.get().getValorInvestido().compareTo(new BigDecimal("2000.00")) == 0) {
                    System.out.println("   🔍 Verificação UPDATE: ✅ Dados atualizados corretamente");
                }
            }
            
            boolean deletou = dao.delete(9999L);
            System.out.printf("   🗑️  DELETE: %s\n", deletou ? "✅ Sucesso" : "❌ Falhou");
            
            boolean aindaExiste = dao.exists(9999L);
            System.out.printf("   🔍 Verificação DELETE: %s\n", !aindaExiste ? "✅ Removido corretamente" : "❌ Ainda existe");
            
        } catch (Exception e) {
            System.out.println("   ❌ Erro durante teste CRUD: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static Investimento[] criarInvestimentosDemo() {
        return new Investimento[]{
            new Investimento(3001L, USUARIO_TESTE_ID, TipoInvestimento.CDB, 
                new BigDecimal("5000.00"), LocalDate.now().minusDays(30), LocalDate.now().plusMonths(6)),
                
            new Investimento(3002L, USUARIO_TESTE_ID, TipoInvestimento.TESOURO_DIRETO, 
                new BigDecimal("10000.00"), LocalDate.now().minusDays(60), LocalDate.now().plusYears(2)),
                
            new Investimento(3003L, USUARIO_TESTE_ID, TipoInvestimento.LCI, 
                new BigDecimal("3000.00"), LocalDate.now().minusDays(90), LocalDate.now().plusMonths(18)),
                
            new Investimento(3004L, USUARIO_TESTE_ID, TipoInvestimento.POUPANCA, 
                new BigDecimal("2000.00"), LocalDate.now().minusDays(120), null), // Sem data de resgate
                
            new Investimento(3005L, USUARIO_TESTE_ID, TipoInvestimento.FUNDO_DI, 
                new BigDecimal("7500.00"), LocalDate.now().minusDays(45), LocalDate.now().plusMonths(9))
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
