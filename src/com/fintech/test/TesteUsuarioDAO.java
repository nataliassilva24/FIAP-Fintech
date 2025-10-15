package com.fintech.test;

import com.fintech.config.DatabaseConfig;
import com.fintech.dao.UsuarioDAO;
import com.fintech.dao.UsuarioDAOImpl;
import com.fintech.enums.Genero;
import com.fintech.model.Usuario;
import com.fintech.util.ConnectionManager;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

public class TesteUsuarioDAO {
    
    private static final Logger LOGGER = Logger.getLogger(TesteUsuarioDAO.class.getName());
    
    public static void main(String[] args) {
        System.out.println("=== TESTE USUARIO DAO - VERSÃO PROFISSIONAL ===\n");
        
        try {
            if (!configurarTeste()) {
                System.out.println("❌ Falha na configuração inicial. Encerrando testes.");
                return;
            }
            
            UsuarioDAO dao = new UsuarioDAOImpl();
            
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
    
    private static void executarTestes(UsuarioDAO dao) {
        System.out.println("\n🧪 Iniciando bateria de testes...\n");
        
        try {
            testarInsercao(dao);
            
            testarConsultasBasicas(dao);
            
            testarAutenticacao(dao);
            
            testarConsultasEspecificas(dao);
            
            testarAtualizacoesEspecificas(dao);
            
            testarEstatisticas(dao);
            
            testarValidacoesNegocio(dao);
            
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
    
    private static void testarInsercao(UsuarioDAO dao) throws SQLException {
        System.out.println("1️⃣  Testando inserção de usuários...");
        
        Usuario[] usuarios = criarUsuariosDemo();
        int sucessos = 0;
        
        for (int i = 0; i < usuarios.length; i++) {
            try {
                boolean resultado = dao.insert(usuarios[i]);
                if (resultado) {
                    System.out.printf("   ✅ Usuário %d inserido (ID: %d - %s)\n", 
                        i + 1, usuarios[i].getIdUsuario(), usuarios[i].getEmail());
                    sucessos++;
                } else {
                    System.out.printf("   ❌ Falha ao inserir usuário %d\n", i + 1);
                }
            } catch (Exception e) {
                System.out.printf("   ❌ Erro no usuário %d: %s\n", i + 1, e.getMessage());
            }
        }
        
        try {
            Usuario duplicado = new Usuario(999L, "Teste Duplicado", "maria@email.com", "senha123", 
                LocalDate.of(1990, 1, 1), Genero.FEMININO);
            duplicado.definirSenha("senha123");
            
            dao.insert(duplicado);
            System.out.println("   ❌ ERRO: Inserção com email duplicado deveria falhar!");
        } catch (SQLException e) {
            System.out.println("   ✅ Email duplicado rejeitado corretamente");
        }
        
        System.out.printf("📊 Resultado inserção: %d/%d usuários inseridos\n\n", sucessos, usuarios.length);
    }
    
    private static void testarConsultasBasicas(UsuarioDAO dao) throws SQLException {
        System.out.println("2️⃣  Testando consultas básicas...");
        
        List<Usuario> todosUsuarios = dao.findAll();
        System.out.printf("   📋 Total de usuários encontrados: %d\n", todosUsuarios.size());
        
        long totalRegistros = dao.count();
        System.out.printf("   🔢 Count retornou: %d registros\n", totalRegistros);
        
        if (!todosUsuarios.isEmpty()) {
            Long primeiroId = todosUsuarios.get(0).getIdUsuario();
            boolean existe = dao.exists(primeiroId);
            System.out.printf("   🔍 Exists para ID %d: %s\n", primeiroId, existe ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        if (!todosUsuarios.isEmpty()) {
            Long primeiroId = todosUsuarios.get(0).getIdUsuario();
            Optional<Usuario> usuario = dao.findById(primeiroId);
            System.out.printf("   🎯 FindById para ID %d: %s\n", primeiroId, 
                usuario.isPresent() ? "✅ Encontrado" : "❌ Não encontrado");
        }
        
        System.out.println();
    }
    
    private static void testarAutenticacao(UsuarioDAO dao) throws SQLException {
        System.out.println("3️⃣  Testando autenticação...");
        
        Optional<Usuario> usuarioEmail = dao.findByEmail("maria@email.com");
        System.out.printf("   📧 FindByEmail: %s\n", usuarioEmail.isPresent() ? "✅ Encontrado" : "❌ Não encontrado");
        
        boolean emailExiste = dao.existsEmail("maria@email.com");
        boolean emailNaoExiste = dao.existsEmail("naoexiste@email.com");
        System.out.printf("   📧 ExistsEmail (maria@email.com): %s\n", emailExiste ? "✅ Existe" : "❌ Não existe");
        System.out.printf("   📧 ExistsEmail (naoexiste@email.com): %s\n", !emailNaoExiste ? "✅ Não existe" : "❌ Existe incorretamente");
        
        Optional<Usuario> loginValido = dao.validarCredenciais("maria@email.com", "senha123");
        Optional<Usuario> loginInvalido = dao.validarCredenciais("maria@email.com", "senhaerrada");
        System.out.printf("   🔐 Login válido: %s\n", loginValido.isPresent() ? "✅ Autenticado" : "❌ Falhou");
        System.out.printf("   🔐 Login inválido: %s\n", !loginInvalido.isPresent() ? "✅ Rejeitado" : "❌ Autenticou incorretamente");
        
        if (usuarioEmail.isPresent()) {
            boolean loginAtualizado = dao.atualizarUltimoLogin(usuarioEmail.get().getIdUsuario());
            System.out.printf("   ⏰ Atualizar último login: %s\n", loginAtualizado ? "✅ Atualizado" : "❌ Falhou");
        }
        
        System.out.println();
    }
    
    private static void testarConsultasEspecificas(UsuarioDAO dao) throws SQLException {
        System.out.println("4️⃣  Testando consultas específicas...");
        
        List<Usuario> masculinos = dao.findByGenero(Genero.MASCULINO);
        List<Usuario> femininos = dao.findByGenero(Genero.FEMININO);
        System.out.printf("   👨 Usuários masculinos: %d\n", masculinos.size());
        System.out.printf("   👩 Usuários femininos: %d\n", femininos.size());
        
        List<Usuario> jovens = dao.findByFaixaEtaria(18, 30);
        List<Usuario> adultos = dao.findByFaixaEtaria(31, 50);
        System.out.printf("   🧑 Usuários 18-30 anos: %d\n", jovens.size());
        System.out.printf("   👨‍💼 Usuários 31-50 anos: %d\n", adultos.size());
        
        List<Usuario> ativos = dao.findAtivos();
        List<Usuario> inativos = dao.findInativos();
        System.out.printf("   🟢 Usuários ativos: %d\n", ativos.size());
        System.out.printf("   🔴 Usuários inativos: %d\n", inativos.size());
        
        List<Usuario> novos = dao.findUsuariosNovos(30);
        System.out.printf("   🆕 Usuários novos (30 dias): %d\n", novos.size());
        
        List<Usuario> comMaria = dao.findByNomeContendo("Maria");
        System.out.printf("   👤 Usuários com 'Maria' no nome: %d\n", comMaria.size());
        
        List<Usuario> gmail = dao.findByDominioEmail("email.com");
        System.out.printf("   📧 Usuários com email 'email.com': %d\n", gmail.size());
        
        List<Usuario> loginRecente = dao.findComLoginRecente(24);
        System.out.printf("   ⏰ Usuários com login nas últimas 24h: %d\n", loginRecente.size());
        
        List<Usuario> maiores = dao.findMaioresIdade();
        List<Usuario> menores = dao.findMenoresIdade();
        System.out.printf("   🔞 Maiores de idade: %d\n", maiores.size());
        System.out.printf("   👶 Menores de idade: %d\n", menores.size());
        
        List<Usuario> aniversario = dao.findComAniversarioProximo(30);
        System.out.printf("   🎂 Aniversários próximos (30 dias): %d\n", aniversario.size());
        
        System.out.println();
    }
    
    private static void testarAtualizacoesEspecificas(UsuarioDAO dao) throws SQLException {
        System.out.println("5️⃣  Testando atualizações específicas...");
        
        Optional<Usuario> usuarioTeste = dao.findByEmail("joao@email.com");
        if (usuarioTeste.isPresent()) {
            Long idUsuario = usuarioTeste.get().getIdUsuario();
            
            boolean desativou = dao.desativarUsuario(idUsuario);
            System.out.printf("   🔴 Desativar usuário: %s\n", desativou ? "✅ Desativado" : "❌ Falhou");
            
            boolean ativou = dao.ativarUsuario(idUsuario);
            System.out.printf("   🟢 Ativar usuário: %s\n", ativou ? "✅ Ativado" : "❌ Falhou");
            
            String novaSenhaHash = "novasenha123hash"; // Em produção seria um hash real
            boolean senhaAtualizada = dao.atualizarSenha(idUsuario, novaSenhaHash);
            System.out.printf("   🔑 Atualizar senha: %s\n", senhaAtualizada ? "✅ Atualizada" : "❌ Falhou");
            
            String novoEmail = "joao.novo@email.com";
            boolean emailAtualizado = dao.atualizarEmail(idUsuario, novoEmail);
            System.out.printf("   📧 Atualizar email: %s\n", emailAtualizado ? "✅ Atualizado" : "❌ Falhou");
            
            if (emailAtualizado) {
                dao.atualizarEmail(idUsuario, "joao@email.com");
            }
        }
        
        System.out.println();
    }
    
    private static void testarEstatisticas(UsuarioDAO dao) throws SQLException {
        System.out.println("6️⃣  Testando estatísticas...");
        
        Map<Genero, Long> porGenero = dao.contarPorGenero();
        System.out.println("   👥 Usuários por gênero:");
        porGenero.forEach((genero, count) -> 
            System.out.printf("      %s: %d usuários\n", genero.getDescricao(), count));
        
        Map<String, Long> porFaixaEtaria = dao.contarPorFaixaEtaria();
        System.out.println("   📊 Usuários por faixa etária:");
        porFaixaEtaria.forEach((faixa, count) -> 
            System.out.printf("      %s: %d usuários\n", faixa, count));
        
        Map<String, Object> stats = dao.obterEstatisticas();
        System.out.println("   📈 Estatísticas gerais:");
        stats.forEach((chave, valor) -> 
            System.out.printf("      %s: %s\n", chave, valor));
        
        Map<String, Long> cadastrosPorMes = dao.contarCadastrosPorMes();
        System.out.println("   📅 Cadastros por mês (último ano):");
        cadastrosPorMes.forEach((mes, count) -> 
            System.out.printf("      %s: %d cadastros\n", mes, count));
        
        long totalLogins = dao.contarTotalLogins(null);
        System.out.printf("   📊 Total de logins registrados: %d\n", totalLogins);
        
        System.out.println();
    }
    
    private static void testarValidacoesNegocio(UsuarioDAO dao) throws SQLException {
        System.out.println("7️⃣  Testando validações e métodos de negócio...");
        
        Usuario usuarioTeste = new Usuario();
        usuarioTeste.setIdUsuario(7777L);
        usuarioTeste.setNomeCompleto("João da Silva Teste");
        usuarioTeste.setEmail("joao.teste@email.com");
        usuarioTeste.setDataNascimento(LocalDate.of(1990, 6, 15));
        usuarioTeste.setGenero(Genero.MASCULINO);
        usuarioTeste.definirSenha("minhasenha123");
        
        boolean emailValido = Usuario.isEmailValido("teste@email.com");
        boolean emailInvalido = Usuario.isEmailValido("email-invalido");
        System.out.printf("   📧 Validação email válido: %s\n", emailValido ? "✅ Correto" : "❌ Incorreto");
        System.out.printf("   📧 Validação email inválido: %s\n", !emailInvalido ? "✅ Correto" : "❌ Incorreto");
        
        boolean senhaForte = Usuario.isSenhaForte("MinhaSenh@123");
        boolean senhaFraca = Usuario.isSenhaForte("123");
        System.out.printf("   🔑 Senha forte: %s\n", senhaForte ? "✅ Correto" : "❌ Incorreto");
        System.out.printf("   🔑 Senha fraca: %s\n", !senhaFraca ? "✅ Correto" : "❌ Incorreto");
        
        System.out.printf("   👤 Nome: %s\n", usuarioTeste.getNomeCompleto());
        System.out.printf("   📝 Primeiro nome: %s\n", usuarioTeste.getPrimeiroNome());
        System.out.printf("   🔤 Iniciais: %s\n", usuarioTeste.getIniciais());
        System.out.printf("   🎂 Idade: %d anos\n", usuarioTeste.getIdade());
        System.out.printf("   🔞 Maior de idade: %s\n", usuarioTeste.isMaiorIdade() ? "✅ Sim" : "❌ Não");
        System.out.printf("   ✅ Idade mínima: %s\n", usuarioTeste.temIdadeMinima() ? "✅ Sim" : "❌ Não");
        System.out.printf("   🆕 Usuário novo: %s\n", usuarioTeste.isUsuarioNovo() ? "✅ Sim" : "❌ Não");
        System.out.printf("   📋 Dados válidos: %s\n", usuarioTeste.isValid() ? "✅ Sim" : "❌ Não");
        
        System.out.printf("   📝 Resumo log: %s\n", usuarioTeste.getResumoLog());
        
        System.out.println();
    }
    
    private static void testarCrudCompleto(UsuarioDAO dao) throws SQLException {
        System.out.println("8️⃣  Testando CRUD completo...");
        
        Usuario usuarioTeste = new Usuario();
        usuarioTeste.setIdUsuario(8888L);
        usuarioTeste.setNomeCompleto("Teste CRUD Silva");
        usuarioTeste.setEmail("crud@teste.com");
        usuarioTeste.setDataNascimento(LocalDate.of(1985, 3, 10));
        usuarioTeste.setGenero(Genero.NAO_BINARIO);
        usuarioTeste.definirSenha("senha123");
        
        try {
            boolean inseriu = dao.insert(usuarioTeste);
            System.out.printf("   ➕ CREATE: %s\n", inseriu ? "✅ Sucesso" : "❌ Falhou");
            
            Optional<Usuario> lido = dao.findById(8888L);
            System.out.printf("   👁️  READ: %s\n", lido.isPresent() ? "✅ Encontrado" : "❌ Não encontrado");
            
            if (lido.isPresent()) {
                Usuario paraAtualizar = lido.get();
                paraAtualizar.setNomeCompleto("Teste CRUD Silva - ATUALIZADO");
                paraAtualizar.setGenero(Genero.OUTRO);
                
                boolean atualizou = dao.update(paraAtualizar);
                System.out.printf("   📝 UPDATE: %s\n", atualizou ? "✅ Sucesso" : "❌ Falhou");
                
                Optional<Usuario> verificacao = dao.findById(8888L);
                if (verificacao.isPresent() && verificacao.get().getNomeCompleto().contains("ATUALIZADO")) {
                    System.out.println("   🔍 Verificação UPDATE: ✅ Dados atualizados corretamente");
                }
                
                Optional<Usuario> login = dao.validarCredenciais("crud@teste.com", "senha123");
                System.out.printf("   🔐 Validar credenciais: %s\n", login.isPresent() ? "✅ Válidas" : "❌ Inválidas");
            }
            
            boolean deletou = dao.delete(8888L);
            System.out.printf("   🗑️  DELETE: %s\n", deletou ? "✅ Sucesso" : "❌ Falhou");
            
            boolean aindaExiste = dao.exists(8888L);
            System.out.printf("   🔍 Verificação DELETE: %s\n", !aindaExiste ? "✅ Removido corretamente" : "❌ Ainda existe");
            
        } catch (Exception e) {
            System.out.println("   ❌ Erro durante teste CRUD: " + e.getMessage());
        }
        
        System.out.println();
    }
    
    private static Usuario[] criarUsuariosDemo() {
        Usuario[] usuarios = new Usuario[5];
        
        usuarios[0] = new Usuario(5001L, "Maria Silva Santos", "maria@email.com", "", 
            LocalDate.of(1992, 5, 15), Genero.FEMININO);
        usuarios[0].definirSenha("senha123");
        
        usuarios[1] = new Usuario(5002L, "João Pedro Oliveira", "joao@email.com", "", 
            LocalDate.of(1988, 8, 22), Genero.MASCULINO);
        usuarios[1].definirSenha("joao123");
        
        usuarios[2] = new Usuario(5003L, "Ana Carolina Costa", "ana@email.com", "", 
            LocalDate.of(1995, 12, 3), Genero.FEMININO);
        usuarios[2].definirSenha("ana456");
        
        usuarios[3] = new Usuario(5004L, "Carlos Eduardo Lima", "carlos@email.com", "", 
            LocalDate.of(1990, 7, 18), Genero.MASCULINO);
        usuarios[3].definirSenha("carlos789");
        
        usuarios[4] = new Usuario(5005L, "Alex Jordan Silva", "alex@email.com", "", 
            LocalDate.of(1993, 11, 9), Genero.NAO_BINARIO);
        usuarios[4].definirSenha("alex321");
        
        return usuarios;
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
