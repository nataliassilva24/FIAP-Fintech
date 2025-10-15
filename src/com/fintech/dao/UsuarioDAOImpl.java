package com.fintech.dao;

import com.fintech.enums.Genero;
import com.fintech.model.Usuario;
import com.fintech.util.ConnectionManager;

import java.security.MessageDigest;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class UsuarioDAOImpl implements UsuarioDAO {
    
    private static final Logger LOGGER = Logger.getLogger(UsuarioDAOImpl.class.getName());
    private final ConnectionManager connectionManager;
    
    private static final String SQL_INSERT = 
        "INSERT INTO usuario (id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    private static final String SQL_UPDATE = 
        "UPDATE usuario SET nome_completo = ?, email = ?, senha = ?, data_nascimento = ?, genero = ?, ultimo_login = ?, ativo = ? WHERE id_usuario = ?";
    
    private static final String SQL_DELETE = 
        "DELETE FROM usuario WHERE id_usuario = ?";
    
    private static final String SQL_FIND_BY_ID = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE id_usuario = ?";
    
    private static final String SQL_FIND_ALL = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario ORDER BY data_cadastro DESC";
    
    private static final String SQL_COUNT = 
        "SELECT COUNT(*) FROM usuario";
    
    private static final String SQL_EXISTS = 
        "SELECT 1 FROM usuario WHERE id_usuario = ?";
    
    private static final String SQL_FIND_BY_EMAIL = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE UPPER(email) = UPPER(?)";
    
    private static final String SQL_EXISTS_EMAIL = 
        "SELECT 1 FROM usuario WHERE UPPER(email) = UPPER(?)";
    
    private static final String SQL_VALIDAR_CREDENCIAIS = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE UPPER(email) = UPPER(?) AND senha = ? AND ativo = 1";
    
    private static final String SQL_FIND_BY_GENERO = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE genero = ?";
    
    private static final String SQL_FIND_ATIVOS = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE ativo = 1";
    
    private static final String SQL_FIND_INATIVOS = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE ativo = 0";
    
    private static final String SQL_FIND_CADASTRADOS_PERIODO = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE DATE(data_cadastro) BETWEEN ? AND ? ORDER BY data_cadastro DESC";
    
    private static final String SQL_FIND_USUARIOS_NOVOS = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE data_cadastro >= SYSTIMESTAMP - INTERVAL '?' DAY ORDER BY data_cadastro DESC";
    
    private static final String SQL_FIND_USUARIOS_INATIVOS = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE ultimo_login < SYSTIMESTAMP - INTERVAL '?' DAY OR ultimo_login IS NULL";
    
    private static final String SQL_FIND_LOGIN_RECENTE = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE ultimo_login >= SYSTIMESTAMP - INTERVAL '?' HOUR ORDER BY ultimo_login DESC";
    
    private static final String SQL_FIND_BY_NOME_CONTENDO = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE UPPER(nome_completo) LIKE UPPER(?) ORDER BY nome_completo";
    
    private static final String SQL_FIND_BY_DOMINIO_EMAIL = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE UPPER(email) LIKE UPPER(?) ORDER BY email";
    
    private static final String SQL_UPDATE_ULTIMO_LOGIN = 
        "UPDATE usuario SET ultimo_login = SYSTIMESTAMP WHERE id_usuario = ?";
    
    private static final String SQL_ATIVAR_USUARIO = 
        "UPDATE usuario SET ativo = 1 WHERE id_usuario = ?";
    
    private static final String SQL_DESATIVAR_USUARIO = 
        "UPDATE usuario SET ativo = 0 WHERE id_usuario = ?";
    
    private static final String SQL_UPDATE_SENHA = 
        "UPDATE usuario SET senha = ? WHERE id_usuario = ?";
    
    private static final String SQL_UPDATE_EMAIL = 
        "UPDATE usuario SET email = ? WHERE id_usuario = ? AND NOT EXISTS (SELECT 1 FROM usuario WHERE UPPER(email) = UPPER(?) AND id_usuario != ?)";
    
    private static final String SQL_CONTAR_POR_GENERO = 
        "SELECT genero, COUNT(*) FROM usuario GROUP BY genero";
    
    private static final String SQL_FIND_ANIVERSARIO_PROXIMO = 
        "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE TO_NUMBER(TO_CHAR(data_nascimento, 'MMDD')) BETWEEN TO_NUMBER(TO_CHAR(SYSDATE, 'MMDD')) AND TO_NUMBER(TO_CHAR(SYSDATE + ?, 'MMDD')) ORDER BY TO_CHAR(data_nascimento, 'MMDD')";
    
    public UsuarioDAOImpl() {
        this.connectionManager = ConnectionManager.getInstance();
    }
    
    @Override
    public boolean insert(Usuario usuario) throws SQLException {
        if (usuario == null || !usuario.isValid()) {
            throw new IllegalArgumentException("Usuário inválido para inserção");
        }
        
        if (existsEmail(usuario.getEmail())) {
            throw new SQLException("Email já está em uso: " + usuario.getEmail());
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_INSERT)) {
                setUsuarioParameters(stmt, usuario, false);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Usuário inserido com sucesso: ID " + usuario.getIdUsuario() + " - " + usuario.getEmail());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao inserir usuário: " + usuario.getEmail(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean update(Usuario usuario) throws SQLException {
        if (usuario == null || usuario.getIdUsuario() == null || !usuario.isValid()) {
            throw new IllegalArgumentException("Usuário inválido para atualização");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_UPDATE)) {
                setUsuarioParameters(stmt, usuario, true);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Usuário atualizado com sucesso: ID " + usuario.getIdUsuario());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar usuário: " + usuario.getIdUsuario(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean delete(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            throw new IllegalArgumentException("ID não pode ser nulo");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_DELETE)) {
                stmt.setLong(1, idUsuario);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Usuário removido com sucesso: ID " + idUsuario);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Optional<Usuario> findById(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return Optional.empty();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_ID)) {
                stmt.setLong(1, idUsuario);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return Optional.of(mapResultSetToUsuario(rs));
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar usuário por ID: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public List<Usuario> findAll() throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_ALL);
                 ResultSet rs = stmt.executeQuery()) {
                
                List<Usuario> usuarios = new ArrayList<>();
                while (rs.next()) {
                    usuarios.add(mapResultSetToUsuario(rs));
                }
                
                LOGGER.info("Encontrados " + usuarios.size() + " usuários");
                return usuarios;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar todos os usuários", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public long count() throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_COUNT);
                 ResultSet rs = stmt.executeQuery()) {
                
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao contar usuários", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return 0;
    }
    
    @Override
    public boolean exists(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return false;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_EXISTS)) {
                stmt.setLong(1, idUsuario);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    return rs.next();
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência do usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    
    @Override
    public Optional<Usuario> findByEmail(String email) throws SQLException {
        if (email == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_EMAIL)) {
                stmt.setString(1, email.trim());
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return Optional.of(mapResultSetToUsuario(rs));
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar usuário por email: " + email, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public boolean existsEmail(String email) throws SQLException {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_EXISTS_EMAIL)) {
                stmt.setString(1, email.trim());
                
                try (ResultSet rs = stmt.executeQuery()) {
                    return rs.next();
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência do email: " + email, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Optional<Usuario> validarCredenciais(String email, String senha) throws SQLException {
        if (email == null || senha == null || email.trim().isEmpty()) {
            return Optional.empty();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            String senhaHash = hashSenha(senha);
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_VALIDAR_CREDENCIAIS)) {
                stmt.setString(1, email.trim());
                stmt.setString(2, senhaHash);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        Usuario usuario = mapResultSetToUsuario(rs);
                        atualizarUltimoLogin(usuario.getIdUsuario());
                        return Optional.of(usuario);
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao validar credenciais para: " + email, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public List<Usuario> findByGenero(Genero genero) throws SQLException {
        if (genero == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_GENERO, stmt -> stmt.setString(1, genero.name()));
    }
    
    @Override
    public List<Usuario> findByFaixaEtaria(int idadeMinima, int idadeMaxima) throws SQLException {
        LocalDate hoje = LocalDate.now();
        LocalDate dataNascMaxima = hoje.minusYears(idadeMinima);
        LocalDate dataNascMinima = hoje.minusYears(idadeMaxima + 1);
        
        String sql = "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE data_nascimento BETWEEN ? AND ? ORDER BY data_nascimento DESC";
        
        return executeQuery(sql, stmt -> {
            stmt.setDate(1, java.sql.Date.valueOf(dataNascMinima));
            stmt.setDate(2, java.sql.Date.valueOf(dataNascMaxima));
        });
    }
    
    @Override
    public List<Usuario> findAtivos() throws SQLException {
        return executeQuery(SQL_FIND_ATIVOS, stmt -> {});
    }
    
    @Override
    public List<Usuario> findInativos() throws SQLException {
        return executeQuery(SQL_FIND_INATIVOS, stmt -> {});
    }
    
    @Override
    public List<Usuario> findCadastradosNoPeriodo(LocalDate dataInicio, LocalDate dataFim) throws SQLException {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Datas não podem ser nulas");
        }
        
        return executeQuery(SQL_FIND_CADASTRADOS_PERIODO, stmt -> {
            stmt.setDate(1, java.sql.Date.valueOf(dataInicio));
            stmt.setDate(2, java.sql.Date.valueOf(dataFim));
        });
    }
    
    @Override
    public List<Usuario> findUsuariosNovos(int dias) throws SQLException {
        String sql = "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE data_cadastro >= SYSTIMESTAMP - INTERVAL '" + dias + "' DAY ORDER BY data_cadastro DESC";
        
        return executeQuery(sql, stmt -> {});
    }
    
    @Override
    public List<Usuario> findUsuariosInativos(int diasSemLogin) throws SQLException {
        String sql = "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE ultimo_login < SYSTIMESTAMP - INTERVAL '" + diasSemLogin + "' DAY OR ultimo_login IS NULL";
        
        return executeQuery(sql, stmt -> {});
    }
    
    @Override
    public List<Usuario> findComLoginRecente(int horas) throws SQLException {
        String sql = "SELECT id_usuario, nome_completo, email, senha, data_nascimento, genero, data_cadastro, ultimo_login, ativo FROM usuario WHERE ultimo_login >= SYSTIMESTAMP - INTERVAL '" + horas + "' HOUR ORDER BY ultimo_login DESC";
        
        return executeQuery(sql, stmt -> {});
    }
    
    @Override
    public List<Usuario> findByNomeContendo(String parteNome) throws SQLException {
        if (parteNome == null || parteNome.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_NOME_CONTENDO, stmt -> 
            stmt.setString(1, "%" + parteNome.trim() + "%"));
    }
    
    @Override
    public List<Usuario> findByDominioEmail(String dominio) throws SQLException {
        if (dominio == null || dominio.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_DOMINIO_EMAIL, stmt -> 
            stmt.setString(1, "%@" + dominio.trim() + "%"));
    }
    
    @Override
    public boolean atualizarUltimoLogin(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_ULTIMO_LOGIN, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public boolean ativarUsuario(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return false;
        }
        
        return executeUpdate(SQL_ATIVAR_USUARIO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public boolean desativarUsuario(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return false;
        }
        
        return executeUpdate(SQL_DESATIVAR_USUARIO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public boolean atualizarSenha(Long idUsuario, String novaSenhaHash) throws SQLException {
        if (idUsuario == null || novaSenhaHash == null) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_SENHA, stmt -> {
            stmt.setString(1, novaSenhaHash);
            stmt.setLong(2, idUsuario);
        });
    }
    
    @Override
    public boolean atualizarEmail(Long idUsuario, String novoEmail) throws SQLException {
        if (idUsuario == null || novoEmail == null || !Usuario.isEmailValido(novoEmail)) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_EMAIL, stmt -> {
            stmt.setString(1, novoEmail);
            stmt.setLong(2, idUsuario);
            stmt.setString(3, novoEmail);
            stmt.setLong(4, idUsuario);
        });
    }
    
    @Override
    public Map<Genero, Long> contarPorGenero() throws SQLException {
        Map<Genero, Long> resultado = new HashMap<>();
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_CONTAR_POR_GENERO);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    String nomeGenero = rs.getString(1);
                    Long count = rs.getLong(2);
                    
                    try {
                        Genero genero = Genero.fromString(nomeGenero);
                        resultado.put(genero, count);
                    } catch (Exception e) {
                        LOGGER.warning("Gênero desconhecido no banco: " + nomeGenero);
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao contar por gênero", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return resultado;
    }
    
    @Override
    public Map<String, Long> contarPorFaixaEtaria() throws SQLException {
        Map<String, Long> resultado = new HashMap<>();
        
        List<Usuario> todosUsuarios = findAll();
        
        for (Usuario usuario : todosUsuarios) {
            int idade = usuario.getIdade();
            String faixa;
            
            if (idade < 18) faixa = "Menor de 18";
            else if (idade < 25) faixa = "18-24";
            else if (idade < 35) faixa = "25-34";
            else if (idade < 45) faixa = "35-44";
            else if (idade < 55) faixa = "45-54";
            else if (idade < 65) faixa = "55-64";
            else faixa = "65+";
            
            resultado.merge(faixa, 1L, Long::sum);
        }
        
        return resultado;
    }
    
    @Override
    public Map<String, Object> obterEstatisticas() throws SQLException {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            stats.put("totalUsuarios", count());
            
            stats.put("porGenero", contarPorGenero());
            
            stats.put("porFaixaEtaria", contarPorFaixaEtaria());
            
            long ativos = findAtivos().size();
            long inativos = findInativos().size();
            stats.put("usuariosAtivos", ativos);
            stats.put("usuariosInativos", inativos);
            
            long novos = findUsuariosNovos(30).size();
            stats.put("usuariosNovos30dias", novos);
            
            long loginRecente = findComLoginRecente(24).size();
            stats.put("loginUltimas24h", loginRecente);
            
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Erro ao calcular algumas estatísticas", e);
        }
        
        return stats;
    }
    
    @Override
    public Map<String, Long> contarCadastrosPorMes() throws SQLException {
        Map<String, Long> resultado = new LinkedHashMap<>();
        
        String sql = "SELECT TO_CHAR(data_cadastro, 'YYYY-MM') as mes, COUNT(*) FROM usuario WHERE data_cadastro >= ADD_MONTHS(SYSDATE, -12) GROUP BY TO_CHAR(data_cadastro, 'YYYY-MM') ORDER BY mes";
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    String mes = rs.getString(1);
                    Long count = rs.getLong(2);
                    resultado.put(mes, count);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao contar cadastros por mês", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return resultado;
    }
    
    @Override
    public List<Usuario> findComAniversarioProximo(int diasAntecedencia) throws SQLException {
        return executeQuery(SQL_FIND_ANIVERSARIO_PROXIMO, stmt -> stmt.setInt(1, diasAntecedencia));
    }
    
    @Override
    public List<Usuario> findMaioresIdade() throws SQLException {
        return findByFaixaEtaria(18, 150);
    }
    
    @Override
    public List<Usuario> findMenoresIdade() throws SQLException {
        return findByFaixaEtaria(0, 17);
    }
    
    @Override
    public long contarTotalLogins(Long idUsuario) throws SQLException {
        if (idUsuario != null) {
            Optional<Usuario> usuario = findById(idUsuario);
            return usuario.isPresent() && usuario.get().getUltimoLogin() != null ? 1 : 0;
        } else {
            List<Usuario> usuarios = findAll();
            return usuarios.stream().mapToLong(u -> u.getUltimoLogin() != null ? 1 : 0).sum();
        }
    }
    
    
    @FunctionalInterface
    private interface StatementSetter {
        void setParameters(PreparedStatement stmt) throws SQLException;
    }
    
    private List<Usuario> executeQuery(String sql, StatementSetter setter) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                setter.setParameters(stmt);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Usuario> usuarios = new ArrayList<>();
                    while (rs.next()) {
                        usuarios.add(mapResultSetToUsuario(rs));
                    }
                    return usuarios;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao executar consulta: " + sql, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    private boolean executeUpdate(String sql, StatementSetter setter) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                setter.setParameters(stmt);
                
                int rowsAffected = stmt.executeUpdate();
                return rowsAffected > 0;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao executar update: " + sql, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    private void setUsuarioParameters(PreparedStatement stmt, Usuario usuario, boolean isUpdate) throws SQLException {
        if (isUpdate) {
            stmt.setString(1, usuario.getNomeCompleto());
            stmt.setString(2, usuario.getEmail());
            stmt.setString(3, usuario.getSenha());
            stmt.setDate(4, usuario.getDataNascimento() != null ? java.sql.Date.valueOf(usuario.getDataNascimento()) : null);
            stmt.setString(5, usuario.getGenero().name());
            stmt.setTimestamp(6, usuario.getUltimoLogin() != null ? Timestamp.valueOf(usuario.getUltimoLogin()) : null);
            stmt.setInt(7, usuario.isAtivo() ? 1 : 0);
            stmt.setLong(8, usuario.getIdUsuario());
        } else {
            stmt.setLong(1, usuario.getIdUsuario());
            stmt.setString(2, usuario.getNomeCompleto());
            stmt.setString(3, usuario.getEmail());
            stmt.setString(4, usuario.getSenha());
            stmt.setDate(5, usuario.getDataNascimento() != null ? java.sql.Date.valueOf(usuario.getDataNascimento()) : null);
            stmt.setString(6, usuario.getGenero().name());
            stmt.setTimestamp(7, usuario.getDataCadastro() != null ? Timestamp.valueOf(usuario.getDataCadastro()) : Timestamp.valueOf(LocalDateTime.now()));
            stmt.setTimestamp(8, usuario.getUltimoLogin() != null ? Timestamp.valueOf(usuario.getUltimoLogin()) : null);
            stmt.setInt(9, usuario.isAtivo() ? 1 : 0);
        }
    }
    
    private Usuario mapResultSetToUsuario(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(rs.getLong("id_usuario"));
        usuario.setNomeCompleto(rs.getString("nome_completo"));
        usuario.setEmail(rs.getString("email"));
        usuario.setSenha(rs.getString("senha"));
        
        java.sql.Date dataNascimento = rs.getDate("data_nascimento");
        if (dataNascimento != null) {
            usuario.setDataNascimento(dataNascimento.toLocalDate());
        }
        
        usuario.setGenero(Genero.fromString(rs.getString("genero")));
        
        Timestamp dataCadastro = rs.getTimestamp("data_cadastro");
        if (dataCadastro != null) {
            usuario.setDataCadastro(dataCadastro.toLocalDateTime());
        }
        
        Timestamp ultimoLogin = rs.getTimestamp("ultimo_login");
        if (ultimoLogin != null) {
            usuario.setUltimoLogin(ultimoLogin.toLocalDateTime());
        }
        
        usuario.setAtivo(rs.getInt("ativo") == 1);
        
        return usuario;
    }
    
    private String hashSenha(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senha.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer hash da senha", e);
        }
    }
}
