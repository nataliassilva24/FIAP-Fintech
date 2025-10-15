package com.fintech.test;

import com.fintech.config.DatabaseConfig;
import com.fintech.dao.ConfigUsuarioDAO;
import com.fintech.dao.ConfigUsuarioDAOImpl;
import com.fintech.enums.Moeda;
import com.fintech.enums.SimNao;
import com.fintech.model.ConfigUsuario;
import com.fintech.util.ConnectionManager;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

public class TesteConfigUsuarioDAO {
    
    private static final Logger LOGGER = Logger.getLogger(TesteConfigUsuarioDAO.class.getName());
    private static final Long[] USUARIOS_TESTE = {1L, 2L, 3L, 4L, 5L};
    
    public static void main(String[] args) {
        System.out.println("=== TESTE CONFIG USUARIO DAO - VERSÃO PROFISSIONAL ===\n");
        
        try {
            if (!configurarTeste()) {
                System.out.println("❌ Falha na configuração inicial. Encerrando testes.");
                return;
            }
            
            ConfigUsuarioDAO dao = new ConfigUsuarioDAOImpl();
            
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
    
    private static void executarTestes(ConfigUsuarioDAO dao) {
        System.out.println("\n🧪 Iniciando bateria de testes...\n");
        
        try {
            testarInsercaoUpsert(dao);
            
            testarConsultasBasicas(dao);
            
            testarConsultasEspecificas(dao);
            
            testarAtualizacoesEspecificas(dao);
            
            testarEstatisticas(dao);
            
            testarFuncionalidadesAvancadas(dao);
            
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
    
    private static void testarInsercaoUpsert(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("1️⃣  Testando inserção e upsert...");
        
        ConfigUsuario[] configs = criarConfigsDemo();
        int sucessosInsert = 0;
        int sucessosUpsert = 0;
        
        for (int i = 0; i < configs.length; i++) {
            try {
                boolean resultado = dao.insert(configs[i]);
                if (resultado) {
                    System.out.printf("   ✅ Config %d inserida (Usuário: %d - %s)\n", 
                        i + 1, configs[i].getIdUsuario(), configs[i].getMoedaPadrao().getNome());
                    sucessosInsert++;
                } else {
                    System.out.printf("   ❌ Falha ao inserir config %d\n", i + 1);
                }
            } catch (Exception e) {
                System.out.printf("   ❌ Erro na config %d: %s\n", i + 1, e.getMessage());
            }
        }
        
        System.out.printf("📊 Resultado INSERT: %d/%d configurações inseridas\n", sucessosInsert, configs.length);
        
        for (ConfigUsuario config : configs) {
            try {
                config.setTemaEscuro(SimNao.SIM);
                config.setMoedaPadrao(Moeda.USD);
                
                boolean resultado = dao.upsert(config);
                if (resultado) {
                    sucessosUpsert++;
                }
            } catch (Exception e) {
                System.out.printf("   ❌ Erro no upsert: %s\n", e.getMessage());
            }
        }
        
        System.out.printf("📊 Resultado UPSERT: %d/%d configurações processadas\n\n", sucessosUpsert, configs.length);
    }
    
    private static void testarConsultasBasicas(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("2️⃣  Testando consultas básicas...");
        
        List<ConfigUsuario> todasConfigs = dao.findAll();
        System.out.printf("   📋 Total de configurações encontradas: %d\n", todasConfigs.size());
        
        long totalRegistros = dao.count();
        System.out.printf("   🔢 Count retornou: %d registros\n", totalRegistros);
        
        for (Long idUsuario : USUARIOS_TESTE) {
            boolean existe = dao.exists(idUsuario);
            boolean temConfig = dao.usuarioTemConfiguracao(idUsuario);
            Optional<ConfigUsuario> config = dao.findByUsuario(idUsuario);
            
            System.out.printf("   👤 Usuário %d: exists=%s, temConfig=%s, found=%s\n", 
                idUsuario, existe ? "✅" : "❌", temConfig ? "✅" : "❌", 
                config.isPresent() ? "✅" : "❌");
        }
        
        System.out.println();
    }
    
    private static void testarConsultasEspecificas(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("3️⃣  Testando consultas específicas...");
        
        List<ConfigUsuario> brl = dao.findByMoedaPadrao(Moeda.BRL);
        List<ConfigUsuario> usd = dao.findByMoedaPadrao(Moeda.USD);
        System.out.printf("   💰 Configurações BRL: %d\n", brl.size());
        System.out.printf("   💵 Configurações USD: %d\n", usd.size());
        
        List<ConfigUsuario> ptBr = dao.findByIdioma("pt_BR");
        List<ConfigUsuario> enUs = dao.findByIdioma("en_US");
        System.out.printf("   🇧🇷 Configurações pt_BR: %d\n", ptBr.size());
        System.out.printf("   🇺🇸 Configurações en_US: %d\n", enUs.size());
        
        List<ConfigUsuario> comNotif = dao.findByNotificacoesAtivas(true);
        List<ConfigUsuario> semNotif = dao.findByNotificacoesAtivas(false);
        System.out.printf("   🔔 Com notificações: %d\n", comNotif.size());
        System.out.printf("   🔕 Sem notificações: %d\n", semNotif.size());
        
        List<ConfigUsuario> temaEscuro = dao.findByTemaEscuro(true);
        List<ConfigUsuario> temaClaro = dao.findByTemaEscuro(false);
        System.out.printf("   🌙 Tema escuro: %d\n", temaEscuro.size());
        System.out.printf("   🌞 Tema claro: %d\n", temaClaro.size());
        
        List<ConfigUsuario> saoPaulo = dao.findByFusoHorario("America/Sao_Paulo");
        System.out.printf("   🕐 Fuso São Paulo: %d\n", saoPaulo.size());
        
        List<ConfigUsuario> comEmail = dao.findComNotificacaoEmail();
        List<ConfigUsuario> comPush = dao.findComNotificacaoPush();
        System.out.printf("   📧 Com notificação email: %d\n", comEmail.size());
        System.out.printf("   📱 Com notificação push: %d\n", comPush.size());
        
        List<ConfigUsuario> recentes = dao.findAtualizadasRecentemente(24);
        System.out.printf("   ⏰ Atualizadas nas últimas 24h: %d\n", recentes.size());
        
        System.out.println();
    }
    
    private static void testarAtualizacoesEspecificas(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("4️⃣  Testando atualizações específicas...");
        
        Long usuarioTeste = USUARIOS_TESTE[0];
        
        boolean moedaAtualizada = dao.atualizarMoedaPadrao(usuarioTeste, Moeda.EUR);
        System.out.printf("   💶 Atualizar moeda para EUR: %s\n", moedaAtualizada ? "✅" : "❌");
        
        boolean notifsAtualizadas = dao.atualizarNotificacoes(usuarioTeste, true, false, true);
        System.out.printf("   🔔 Atualizar notificações: %s\n", notifsAtualizadas ? "✅" : "❌");
        
        boolean temaAtualizado = dao.atualizarTema(usuarioTeste, true);
        System.out.printf("   🌙 Atualizar para tema escuro: %s\n", temaAtualizado ? "✅" : "❌");
        
        boolean regionalAtualizada = dao.atualizarConfiguracaoRegional(usuarioTeste, 
            Moeda.GBP, "en_GB", "dd/MM/yyyy", "Europe/London");
        System.out.printf("   🇬🇧 Atualizar config regional (UK): %s\n", regionalAtualizada ? "✅" : "❌");
        
        Optional<ConfigUsuario> configVerificacao = dao.findByUsuario(usuarioTeste);
        if (configVerificacao.isPresent()) {
            ConfigUsuario config = configVerificacao.get();
            System.out.printf("   🔍 Verificação - Moeda: %s, Tema: %s, Idioma: %s\n",
                config.getMoedaPadrao(), config.getTemaEscuro(), config.getIdioma());
        }
        
        System.out.println();
    }
    
    private static void testarEstatisticas(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("5️⃣  Testando estatísticas...");
        
        Map<Moeda, Long> porMoeda = dao.contarPorMoeda();
        System.out.println("   💰 Usuários por moeda:");
        porMoeda.forEach((moeda, count) -> 
            System.out.printf("      %s (%s): %d usuários\n", moeda.getNome(), moeda.getCodigo(), count));
        
        Map<String, Long> porIdioma = dao.contarPorIdioma();
        System.out.println("   🌍 Usuários por idioma:");
        porIdioma.forEach((idioma, count) -> 
            System.out.printf("      %s: %d usuários\n", idioma, count));
        
        Map<String, Object> stats = dao.obterEstatisticas();
        System.out.println("   📊 Estatísticas gerais:");
        stats.forEach((chave, valor) -> 
            System.out.printf("      %s: %s\n", chave, valor));
        
        System.out.println();
    }
    
    private static void testarFuncionalidadesAvancadas(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("6️⃣  Testando funcionalidades avançadas...");
        
        Long usuarioNovo = 999L;
        
        Optional<ConfigUsuario> configPadrao = dao.criarConfiguracaoPadrao(usuarioNovo);
        System.out.printf("   🆕 Criar configuração padrão: %s\n", 
            configPadrao.isPresent() ? "✅ Criada" : "❌ Falhou");
        
        if (configPadrao.isPresent()) {
            ConfigUsuario config = configPadrao.get();
            
            System.out.println("   📋 Configuração padrão criada:");
            System.out.printf("      Moeda: %s, Idioma: %s, Tema: %s\n", 
                config.getMoedaPadrao().getNome(), config.getIdioma(), config.getTemaEscuro());
            
            java.math.BigDecimal valorTeste = new java.math.BigDecimal("1234.56");
            String valorFormatado = config.formatarValor(valorTeste);
            System.out.printf("      Formato valor: %s\n", valorFormatado);
            
            java.time.LocalDate dataTeste = java.time.LocalDate.now();
            String dataFormatada = config.formatarData(dataTeste);
            System.out.printf("      Formato data: %s\n", dataFormatada);
            
            config.aplicarConfiguracaoRegional("USA");
            System.out.printf("      Após aplicar USA - Moeda: %s, Idioma: %s\n", 
                config.getMoedaPadrao(), config.getIdioma());
            
            String json = config.toJson();
            System.out.println("   📄 Exportação JSON:");
            System.out.println("      " + json.replaceAll("\n", "\n      "));
        }
        
        boolean removeu = dao.removerPorUsuario(usuarioNovo);
        System.out.printf("   🗑️  Remover configuração teste: %s\n", removeu ? "✅" : "❌");
        
        System.out.println();
    }
    
    private static void testarCrudCompleto(ConfigUsuarioDAO dao) throws SQLException {
        System.out.println("7️⃣  Testando CRUD completo...");
        
        Long usuarioCrud = 8888L;
        
        ConfigUsuario configTeste = new ConfigUsuario();
        configTeste.setIdUsuario(usuarioCrud);
        configTeste.setMoedaPadrao(Moeda.CAD);
        configTeste.setNotificacoesAtivas(SimNao.SIM);
        configTeste.setTemaEscuro(SimNao.NAO);
        configTeste.setIdioma("fr_CA");
        configTeste.setFormatoData("yyyy-MM-dd");
        configTeste.setFusoHorario("America/Toronto");
        
        try {
            boolean inseriu = dao.insert(configTeste);
            System.out.printf("   ➕ CREATE: %s\n", inseriu ? "✅ Sucesso" : "❌ Falhou");
            
            Optional<ConfigUsuario> lida = dao.findByUsuario(usuarioCrud);
            System.out.printf("   👁️  READ: %s\n", lida.isPresent() ? "✅ Encontrada" : "❌ Não encontrada");
            
            if (lida.isPresent()) {
                ConfigUsuario paraAtualizar = lida.get();
                paraAtualizar.setMoedaPadrao(Moeda.JPY);
                paraAtualizar.setTemaEscuro(SimNao.SIM);
                paraAtualizar.setIdioma("ja_JP");
                
                boolean atualizou = dao.update(paraAtualizar);
                System.out.printf("   📝 UPDATE: %s\n", atualizou ? "✅ Sucesso" : "❌ Falhou");
                
                Optional<ConfigUsuario> verificacao = dao.findByUsuario(usuarioCrud);
                if (verificacao.isPresent() && verificacao.get().getMoedaPadrao() == Moeda.JPY) {
                    System.out.println("   🔍 Verificação UPDATE: ✅ Dados atualizados corretamente");
                }
                
                paraAtualizar.setMoedaPadrao(Moeda.AUD);
                boolean upserted = dao.upsert(paraAtualizar);
                System.out.printf("   🔄 UPSERT (update): %s\n", upserted ? "✅ Sucesso" : "❌ Falhou");
            }
            
            boolean deletou = dao.delete(usuarioCrud);
            System.out.printf("   🗑️  DELETE: %s\n", deletou ? "✅ Sucesso" : "❌ Falhou");
            
            boolean aindaExiste = dao.exists(usuarioCrud);
            System.out.printf("   🔍 Verificação DELETE: %s\n", !aindaExiste ? "✅ Removida corretamente" : "❌ Ainda existe");
            
        } catch (Exception e) {
            System.out.println("   ❌ Erro durante teste CRUD: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static ConfigUsuario[] criarConfigsDemo() {
        return new ConfigUsuario[]{
            criarConfig(USUARIOS_TESTE[0], Moeda.BRL, "pt_BR", "America/Sao_Paulo"),
            criarConfig(USUARIOS_TESTE[1], Moeda.USD, "en_US", "America/New_York"),
            criarConfig(USUARIOS_TESTE[2], Moeda.EUR, "pt_PT", "Europe/Lisbon"),
            criarConfig(USUARIOS_TESTE[3], Moeda.ARS, "es_AR", "America/Argentina/Buenos_Aires"),
            criarConfig(USUARIOS_TESTE[4], Moeda.GBP, "en_GB", "Europe/London")
        };
    }
    
    private static ConfigUsuario criarConfig(Long idUsuario, Moeda moeda, String idioma, String fusoHorario) {
        ConfigUsuario config = new ConfigUsuario();
        config.setIdUsuario(idUsuario);
        config.setMoedaPadrao(moeda);
        config.setNotificacoesAtivas(SimNao.SIM);
        config.setTemaEscuro(SimNao.NAO);
        config.setNotificacaoEmail(SimNao.SIM);
        config.setNotificacaoPush(SimNao.fromBoolean(idUsuario % 2 == 0)); // Alterna push
        config.setIdioma(idioma);
        config.setFormatoData("dd/MM/yyyy");
        config.setFusoHorario(fusoHorario);
        return config;
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
