package com.fintech.test;

import com.fintech.config.DatabaseConfig;
import com.fintech.dao.TransacaoDAO;
import com.fintech.dao.TransacaoDAOImpl;
import com.fintech.enums.TipoTransacao;
import com.fintech.model.Transacao;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

public class TesteTransacaoDAO {
    
    private static final Logger LOGGER = Logger.getLogger(TesteTransacaoDAO.class.getName());
    private static final Long USUARIO_TESTE_ID = 1L;
    
    public static void main(String[] args) {
        System.out.println("=== TESTE TRANSACAO DAO - VERSÃO REFATORADA ===\n");
        
        try {
            if (!configurarTeste()) {
                System.out.println("❌ Falha na configuração inicial. Encerrando testes.");
                return;
            }
            
            TransacaoDAO dao = new TransacaoDAOImpl();
            
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
                System.out.println("💡 Dica: Verifique as configurações em DatabaseConfig ou crie um arquivo database.properties");
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
    
    private static void executarTestes(TransacaoDAO dao) {
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
    
    private static void testarInsercao(TransacaoDAO dao) throws SQLException {
        System.out.println("1️⃣  Testando inserção de transações...");
        
        Transacao[] transacoes = criarTransacoesDemo();
        int sucessos = 0;
        
        for (int i = 0; i < transacoes.length; i++) {
            try {
                boolean resultado = dao.insert(transacoes[i]);
                if (resultado) {
                    System.out.printf("   ✅ Transação %d inserida (ID: %d)\n", i + 1, transacoes[i].getIdTransacao());
                    sucessos++;
                } else {
                    System.out.printf("   ❌ Falha ao inserir transação %d\n", i + 1);
                }
            } catch (Exception e) {
                System.out.printf("   ❌ Erro na transação %d: %s\n", i + 1, e.getMessage());
            }
        }
        
        System.out.printf("📊 Resultado inserção: %d/%d transações inseridas\n\n", sucessos, transacoes.length);
    }
    
    private static void testarConsultasBasicas(TransacaoDAO dao) throws SQLException {
        System.out.println("2️⃣  Testando consultas básicas...");
        
        List<Transacao> todasTransacoes = dao.findAll();
        System.out.printf("   📋 Total de transações encontradas: %d\n", todasTransacoes.size());
        
        long totalRegistros = dao.count();
        System.out.printf("   🔢 Count retornou: %d registros\n", totalRegistros);
        
        if (!todasTransacoes.isEmpty()) {
            Long primeiroId = todasTransacoes.get(0).getIdTransacao();
            boolean existe = dao.exists(primeiroId);
            System.out.printf("   🔍 Exists para ID %d: %s\n", primeiroId, existe ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        if (!todasTransacoes.isEmpty()) {
            Long primeiroId = todasTransacoes.get(0).getIdTransacao();
            Optional<Transacao> transacao = dao.findById(primeiroId);
            System.out.printf("   🎯 FindById para ID %d: %s\n", primeiroId, 
                transacao.isPresent() ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        System.out.println();
    }
    
    private static void testarConsultasEspecificas(TransacaoDAO dao) throws SQLException {
        System.out.println("3️⃣  Testando consultas específicas...");
        
        List<Transacao> transacoesUsuario = dao.findByUsuario(USUARIO_TESTE_ID);
        System.out.printf("   👤 Transações do usuário %d: %d\n", USUARIO_TESTE_ID, transacoesUsuario.size());
        
        List<Transacao> creditos = dao.findByTipo(TipoTransacao.CREDITO);
        List<Transacao> debitos = dao.findByTipo(TipoTransacao.DEBITO);
        System.out.printf("   💰 Transações CREDITO: %d\n", creditos.size());
        System.out.printf("   💸 Transações DEBITO: %d\n", debitos.size());
        
        List<Transacao> alimentacao = dao.findByCategoria("ALIMENTACAO");
        System.out.printf("   🍽️  Transações ALIMENTACAO: %d\n", alimentacao.size());
        
        LocalDate inicioMes = LocalDate.now().withDayOfMonth(1);
        LocalDate fimMes = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        List<Transacao> transacoesMes = dao.findByPeriodo(inicioMes, fimMes);
        System.out.printf("   📅 Transações do mês atual: %d\n", transacoesMes.size());
        
        List<Transacao> transacoesUsuarioMes = dao.findByUsuarioAndPeriodo(USUARIO_TESTE_ID, inicioMes, fimMes);
        System.out.printf("   👤📅 Transações do usuário %d no mês: %d\n", USUARIO_TESTE_ID, transacoesUsuarioMes.size());
        
        System.out.println();
    }
    
    private static void testarCalculos(TransacaoDAO dao) throws SQLException {
        System.out.println("4️⃣  Testando cálculos financeiros...");
        
        BigDecimal saldo = dao.calcularSaldo(USUARIO_TESTE_ID);
        System.out.printf("   💰 Saldo do usuário %d: R$ %.2f\n", USUARIO_TESTE_ID, saldo);
        
        BigDecimal totalCreditos = dao.calcularTotalPorTipo(USUARIO_TESTE_ID, TipoTransacao.CREDITO);
        BigDecimal totalDebitos = dao.calcularTotalPorTipo(USUARIO_TESTE_ID, TipoTransacao.DEBITO);
        System.out.printf("   📈 Total créditos: R$ %.2f\n", totalCreditos);
        System.out.printf("   📉 Total débitos: R$ %.2f\n", totalDebitos);
        System.out.printf("   🧮 Diferença (saldo calculado): R$ %.2f\n", totalCreditos.subtract(totalDebitos));
        
        System.out.println();
    }
    
    private static void testarCrudCompleto(TransacaoDAO dao) throws SQLException {
        System.out.println("5️⃣  Testando CRUD completo...");
        
        Transacao transacaoTeste = new Transacao(9999L, USUARIO_TESTE_ID, TipoTransacao.DEBITO,
                "TESTE", "Transação para teste CRUD", new BigDecimal("99.99"), LocalDate.now());
        
        try {
            boolean inseriu = dao.insert(transacaoTeste);
            System.out.printf("   ➕ CREATE: %s\n", inseriu ? "✅ Sucesso" : "❌ Falhou");
            
            Optional<Transacao> lida = dao.findById(9999L);
            System.out.printf("   👁️  READ: %s\n", lida.isPresent() ? "✅ Encontrada" : "❌ Não encontrada");
            
            if (lida.isPresent()) {
                Transacao paraAtualizar = lida.get();
                paraAtualizar.setDescricao("Transação ATUALIZADA para teste CRUD");
                paraAtualizar.setValor(new BigDecimal("199.99"));
                
                boolean atualizou = dao.update(paraAtualizar);
                System.out.printf("   📝 UPDATE: %s\n", atualizou ? "✅ Sucesso" : "❌ Falhou");
                
                Optional<Transacao> verificacao = dao.findById(9999L);
                if (verificacao.isPresent() && verificacao.get().getValor().compareTo(new BigDecimal("199.99")) == 0) {
                    System.out.println("   🔍 Verificação UPDATE: ✅ Dados atualizados corretamente");
                }
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
    
    private static Transacao[] criarTransacoesDemo() {
        return new Transacao[]{
            new Transacao(2001L, USUARIO_TESTE_ID, TipoTransacao.CREDITO, "SALARIO", 
                "Salário dezembro 2024", new BigDecimal("6500.00"), LocalDate.now()),
                
            new Transacao(2002L, USUARIO_TESTE_ID, TipoTransacao.DEBITO, "ALIMENTACAO", 
                "Supermercado Pão de Açúcar", new BigDecimal("347.82"), LocalDate.now().minusDays(1)),
                
            new Transacao(2003L, USUARIO_TESTE_ID, TipoTransacao.DEBITO, "TRANSPORTE", 
                "Combustível - Posto Ipiranga", new BigDecimal("165.50"), LocalDate.now().minusDays(2)),
                
            new Transacao(2004L, USUARIO_TESTE_ID, TipoTransacao.CREDITO, "FREELANCE", 
                "Desenvolvimento sistema web", new BigDecimal("2100.00"), LocalDate.now().minusDays(3)),
                
            new Transacao(2005L, USUARIO_TESTE_ID, TipoTransacao.DEBITO, "ENTRETENIMENTO", 
                "Cinema Cinemark - Ingresso + pipoca", new BigDecimal("78.50"), LocalDate.now().minusDays(4))
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
