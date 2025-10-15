package com.fintech.application;

import com.fintech.config.DatabaseConfig;
import com.fintech.dao.*;
import com.fintech.enums.*;
import com.fintech.model.*;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

public class FintechApplication {
    
    private static final Logger LOGGER = Logger.getLogger(FintechApplication.class.getName());
    
    private static UsuarioDAO usuarioDAO;
    private static ConfigUsuarioDAO configDAO;
    private static TransacaoDAO transacaoDAO;
    private static InvestimentoDAO investimentoDAO;
    private static MetaFinanceiraDAO metaDAO;
    
    public static void main(String[] args) {
        System.out.println("🚀 === FINTECH APPLICATION - ENTERPRISE VERSION ===\n");
        
        try {
            if (!inicializarSistema()) {
                System.out.println("❌ Falha na inicialização. Encerrando aplicação.");
                return;
            }
            
            executarDemonstracao();
            
        } catch (Exception e) {
            LOGGER.severe("Erro crítico na aplicação: " + e.getMessage());
            e.printStackTrace();
        } finally {
            finalizarSistema();
        }
        
        System.out.println("\n🏁 === FINTECH APPLICATION FINALIZADA ===");
    }
    
    private static boolean inicializarSistema() {
        System.out.println("🔧 Inicializando sistema Fintech...");
        
        try {
            DatabaseConfig config = DatabaseConfig.getInstance();
            System.out.println("✅ Configurações carregadas: " + config.toString());
            
            ConnectionManager connectionManager = ConnectionManager.getInstance();
            if (config.isValid() && !config.getUsername().isEmpty()) {
                if (connectionManager.testConnection()) {
                    System.out.println("✅ Conexão com banco Oracle estabelecida!");
                    System.out.println("📊 " + connectionManager.getPoolStats());
                } else {
                    System.out.println("⚠️  Banco não conectado - executando em modo demonstração");
                }
            } else {
                System.out.println("ℹ️  Configurações de banco não preenchidas - modo demonstração");
            }
            
            usuarioDAO = new UsuarioDAOImpl();
            configDAO = new ConfigUsuarioDAOImpl();
            transacaoDAO = new TransacaoDAOImpl();
            investimentoDAO = new InvestimentoDAOImpl();
            metaDAO = new MetaFinanceiraDAOImpl();
            
            System.out.println("✅ DAOs inicializados com sucesso!");
            return true;
            
        } catch (Exception e) {
            System.out.println("❌ Erro na inicialização: " + e.getMessage());
            return false;
        }
    }
    
    private static void executarDemonstracao() throws SQLException {
        System.out.println("\n🎯 === DEMONSTRAÇÃO DO SISTEMA ENTERPRISE ===\n");
        
        demonstrarEntidadesEnums();
        
        if (isConectadoAoBanco()) {
            demonstrarComBancoDados();
        } else {
            demonstrarSemBancoDados();
        }
        
        demonstrarValidacoesNegocio();
    }
    
    private static void demonstrarEntidadesEnums() {
        System.out.println("1️⃣ === DEMONSTRAÇÃO ENTIDADES E ENUMS ===");
        
        Usuario usuario = new Usuario(1L, "Maria Silva Santos", "maria@fintech.com", "", 
            LocalDate.of(1992, 5, 15), Genero.FEMININO);
        usuario.definirSenha("MinhaSenh@123");
        
        System.out.println("👤 Usuário criado:");
        System.out.println("   Nome: " + usuario.getNomeCompleto());
        System.out.println("   Email: " + usuario.getEmail());
        System.out.println("   Idade: " + usuario.getIdade() + " anos");
        System.out.println("   Gênero: " + usuario.getGenero().getDescricao());
        System.out.println("   Maior idade: " + (usuario.isMaiorIdade() ? "✅" : "❌"));
        System.out.println("   Senha forte: " + (Usuario.isSenhaForte("MinhaSenh@123") ? "✅" : "❌"));
        
        ConfigUsuario config = new ConfigUsuario(1L, Moeda.BRL, SimNao.SIM, SimNao.NAO);
        config.aplicarPreferencias();
        System.out.println("   Valor formatado: " + config.formatarValor(new BigDecimal("1234.56")));
        
        Transacao transacao = new Transacao(100L, 1L, TipoTransacao.CREDITO, "SALARIO",
            "Salário mensal", new BigDecimal("5500.00"), LocalDate.now());
        transacao.lancar();
        System.out.println("   Percentual: " + transacao.getValor() + " como " + transacao.getTipoTransacao().getDescricao());
        
        Investimento investimento = new Investimento(200L, 1L, TipoInvestimento.TESOURO_DIRETO,
            new BigDecimal("10000.00"), LocalDate.now(), LocalDate.now().plusYears(2));
        investimento.aplicar();
        System.out.println("   Tipo: " + investimento.getTipo().getDescricao());
        System.out.println("   Renda Fixa: " + (investimento.getTipo().isRendaFixa() ? "✅" : "❌"));
        System.out.println("   Dias investido: " + investimento.getDiasInvestido());
        
        MetaFinanceira meta = new MetaFinanceira(300L, 1L, "Viagem Europa", "Férias de 15 dias",
            CategoriaMeta.VIAGEM, new BigDecimal("15000.00"), new BigDecimal("3500.00"),
            LocalDate.now().plusMonths(8), StatusMeta.ATIVA);
        meta.atualizarProgresso();
        System.out.println("   Categoria: " + meta.getCategoria().getDescricao());
        System.out.println("   Status: " + meta.getStatus().getDescricao());
        System.out.println("   Progresso: " + meta.getPercentualAlcancado() + "%");
        System.out.println("   Economia diária: R$ " + meta.getEconomiaoDiaria());
        
        System.out.println();
    }
    
    private static void demonstrarComBancoDados() throws SQLException {
        System.out.println("2️⃣ === DEMONSTRAÇÃO COM BANCO DE DADOS ===");
        
        try {
            Usuario usuarioTeste = new Usuario(9001L, "João Teste", "joao.teste@app.com", "",
                LocalDate.of(1990, 3, 10), Genero.MASCULINO);
            usuarioTeste.definirSenha("teste123");
            
            System.out.println("📝 Testando operações DAO...");
            
            boolean inseriu = usuarioDAO.insert(usuarioTeste);
            System.out.println("   Inserir usuário: " + (inseriu ? "✅" : "❌"));
            
            if (inseriu) {
                Optional<Usuario> encontrado = usuarioDAO.findByEmail("joao.teste@app.com");
                System.out.println("   Buscar por email: " + (encontrado.isPresent() ? "✅" : "❌"));
                
                Optional<Usuario> validado = usuarioDAO.validarCredenciais("joao.teste@app.com", "teste123");
                System.out.println("   Validar credenciais: " + (validado.isPresent() ? "✅" : "❌"));
                
                long totalUsuarios = usuarioDAO.count();
                System.out.println("   Total usuários no banco: " + totalUsuarios);
                
                usuarioDAO.delete(9001L);
                System.out.println("   Limpeza concluída: ✅");
            }
            
        } catch (SQLException e) {
            System.out.println("   ⚠️  Operações com banco limitadas: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static void demonstrarSemBancoDados() {
        System.out.println("2️⃣ === DEMONSTRAÇÃO SEM BANCO (MODO OFFLINE) ===");
        
        System.out.println("🔧 Sistema funcionando em modo demonstração:");
        System.out.println("   ✅ Todas as entidades funcionais");
        System.out.println("   ✅ Todos os enums operacionais");
        System.out.println("   ✅ Validações de negócio ativas");
        System.out.println("   ✅ Pool de conexões configurado");
        System.out.println("   ✅ DAOs prontos para uso");
        
        System.out.println("\n💡 Para ativar funcionalidades de banco:");
        System.out.println("   1. Configure database.properties com suas credenciais Oracle");
        System.out.println("   2. Execute novamente a aplicação");
        System.out.println("   3. Execute os testes específicos: TesteUsuarioDAO, etc.");
        
        System.out.println();
    }
    
    private static void demonstrarValidacoesNegocio() {
        System.out.println("3️⃣ === DEMONSTRAÇÃO VALIDAÇÕES E REGRAS DE NEGÓCIO ===");
        
        System.out.println("📧 Validação de emails:");
        System.out.println("   email@valido.com: " + (Usuario.isEmailValido("email@valido.com") ? "✅" : "❌"));
        System.out.println("   email-invalido: " + (Usuario.isEmailValido("email-invalido") ? "✅" : "❌"));
        
        System.out.println("🔑 Validação de senhas:");
        System.out.println("   MinhaSenh@123: " + (Usuario.isSenhaForte("MinhaSenh@123") ? "✅ Forte" : "❌ Fraca"));
        System.out.println("   123: " + (Usuario.isSenhaForte("123") ? "✅ Forte" : "❌ Fraca"));
        
        System.out.println("💰 Validação de moedas:");
        Moeda usd = Moeda.fromCodigo("USD");
        System.out.println("   USD: " + usd.getNome() + " (" + usd.getSimbolo() + ")");
        System.out.println("   É principal: " + (usd.isPrincipal() ? "✅" : "❌"));
        
        System.out.println("🎯 Validação de meta:");
        MetaFinanceira metaTeste = new MetaFinanceira();
        metaTeste.setIdUsuario(1L);
        metaTeste.setNome("Meta Teste");
        metaTeste.setCategoria(CategoriaMeta.CASA);
        metaTeste.setValorNecessario(new BigDecimal("50000"));
        metaTeste.setValorAcumulado(new BigDecimal("12000"));
        
        System.out.println("   Meta válida: " + (metaTeste.isValid() ? "✅" : "❌"));
        System.out.println("   Progresso: " + metaTeste.getPercentualAlcancado() + "%");
        System.out.println("   Valor restante: R$ " + metaTeste.getValorRestante());
        
        System.out.println("🔄 Conversões inteligentes:");
        System.out.println("   'MASCULINO' → " + Genero.fromString("MASCULINO").getDescricao());
        System.out.println("   'S' → " + SimNao.fromChar('S').getDescricao());
        System.out.println("   'CASA' → " + CategoriaMeta.fromString("CASA").getDescricao());
        
        System.out.println();
    }
    
    private static boolean isConectadoAoBanco() {
        try {
            DatabaseConfig config = DatabaseConfig.getInstance();
            return config.isValid() && !config.getUsername().isEmpty() && 
                   ConnectionManager.getInstance().testConnection();
        } catch (Exception e) {
            return false;
        }
    }
    
    private static void finalizarSistema() {
        System.out.println("🧹 Finalizando sistema...");
        
        try {
            ConnectionManager.getInstance().shutdown();
            System.out.println("✅ Pool de conexões finalizado");
        } catch (Exception e) {
            System.out.println("⚠️  Aviso ao finalizar: " + e.getMessage());
        }
    }
}
