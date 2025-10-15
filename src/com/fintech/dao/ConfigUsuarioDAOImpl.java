package com.fintech.dao;

import com.fintech.enums.Moeda;
import com.fintech.enums.SimNao;
import com.fintech.model.ConfigUsuario;
import com.fintech.util.ConnectionManager;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ConfigUsuarioDAOImpl implements ConfigUsuarioDAO {
    
    private static final Logger LOGGER = Logger.getLogger(ConfigUsuarioDAOImpl.class.getName());
    private final ConnectionManager connectionManager;
    
    private static final String SQL_INSERT = 
        "INSERT INTO config_usuario (id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    private static final String SQL_UPDATE = 
        "UPDATE config_usuario SET moeda_padrao = ?, notificacoes_ativas = ?, tema_escuro = ?, notificacao_email = ?, notificacao_push = ?, idioma = ?, formato_data = ?, fuso_horario = ?, ultima_atualizacao = ? WHERE id_usuario = ?";
    
    private static final String SQL_DELETE = 
        "DELETE FROM config_usuario WHERE id_usuario = ?";
    
    private static final String SQL_FIND_BY_ID = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE id_usuario = ?";
    
    private static final String SQL_FIND_ALL = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario ORDER BY ultima_atualizacao DESC";
    
    private static final String SQL_COUNT = 
        "SELECT COUNT(*) FROM config_usuario";
    
    private static final String SQL_EXISTS = 
        "SELECT 1 FROM config_usuario WHERE id_usuario = ?";
    
    private static final String SQL_FIND_BY_MOEDA = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE moeda_padrao = ?";
    
    private static final String SQL_FIND_BY_IDIOMA = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE idioma = ?";
    
    private static final String SQL_FIND_BY_NOTIFICACOES = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE notificacoes_ativas = ?";
    
    private static final String SQL_FIND_BY_TEMA = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE tema_escuro = ?";
    
    private static final String SQL_FIND_BY_FUSO = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE fuso_horario = ?";
    
    private static final String SQL_FIND_ATUALIZADAS_RECENTEMENTE = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE ultima_atualizacao >= SYSTIMESTAMP - INTERVAL '?' HOUR";
    
    private static final String SQL_FIND_COM_EMAIL = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE notificacao_email = 'S'";
    
    private static final String SQL_FIND_COM_PUSH = 
        "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE notificacao_push = 'S'";
    
    private static final String SQL_UPSERT = 
        "MERGE INTO config_usuario cu USING (SELECT ? as id_usuario FROM dual) d ON (cu.id_usuario = d.id_usuario) " +
        "WHEN MATCHED THEN UPDATE SET moeda_padrao = ?, notificacoes_ativas = ?, tema_escuro = ?, notificacao_email = ?, notificacao_push = ?, idioma = ?, formato_data = ?, fuso_horario = ?, ultima_atualizacao = ? " +
        "WHEN NOT MATCHED THEN INSERT (id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    private static final String SQL_UPDATE_MOEDA = 
        "UPDATE config_usuario SET moeda_padrao = ?, ultima_atualizacao = SYSTIMESTAMP WHERE id_usuario = ?";
    
    private static final String SQL_UPDATE_NOTIFICACOES = 
        "UPDATE config_usuario SET notificacoes_ativas = ?, notificacao_email = ?, notificacao_push = ?, ultima_atualizacao = SYSTIMESTAMP WHERE id_usuario = ?";
    
    private static final String SQL_UPDATE_REGIONAL = 
        "UPDATE config_usuario SET moeda_padrao = ?, idioma = ?, formato_data = ?, fuso_horario = ?, ultima_atualizacao = SYSTIMESTAMP WHERE id_usuario = ?";
    
    private static final String SQL_UPDATE_TEMA = 
        "UPDATE config_usuario SET tema_escuro = ?, ultima_atualizacao = SYSTIMESTAMP WHERE id_usuario = ?";
    
    private static final String SQL_CONTAR_POR_MOEDA = 
        "SELECT moeda_padrao, COUNT(*) FROM config_usuario GROUP BY moeda_padrao";
    
    private static final String SQL_CONTAR_POR_IDIOMA = 
        "SELECT idioma, COUNT(*) FROM config_usuario GROUP BY idioma";
    
    public ConfigUsuarioDAOImpl() {
        this.connectionManager = ConnectionManager.getInstance();
    }
    
    @Override
    public boolean insert(ConfigUsuario config) throws SQLException {
        if (config == null || !config.isValid()) {
            throw new IllegalArgumentException("Configuração de usuário inválida para inserção");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_INSERT)) {
                setConfigParameters(stmt, config);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Configuração inserida com sucesso para usuário: " + config.getIdUsuario());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao inserir configuração do usuário: " + config.getIdUsuario(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean update(ConfigUsuario config) throws SQLException {
        if (config == null || config.getIdUsuario() == null || !config.isValid()) {
            throw new IllegalArgumentException("Configuração de usuário inválida para atualização");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_UPDATE)) {
                stmt.setString(1, config.getMoedaPadrao().getCodigo());
                stmt.setString(2, String.valueOf(config.getNotificacoesAtivas().getCodigo()));
                stmt.setString(3, String.valueOf(config.getTemaEscuro().getCodigo()));
                stmt.setString(4, String.valueOf(config.getNotificacaoEmail().getCodigo()));
                stmt.setString(5, String.valueOf(config.getNotificacaoPush().getCodigo()));
                stmt.setString(6, config.getIdioma());
                stmt.setString(7, config.getFormatoData());
                stmt.setString(8, config.getFusoHorario());
                stmt.setTimestamp(9, Timestamp.valueOf(LocalDateTime.now()));
                stmt.setLong(10, config.getIdUsuario());
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    config.setUltimaAtualizacao(LocalDateTime.now());
                    LOGGER.info("Configuração atualizada com sucesso para usuário: " + config.getIdUsuario());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar configuração do usuário: " + config.getIdUsuario(), e);
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
            throw new IllegalArgumentException("ID do usuário não pode ser nulo");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_DELETE)) {
                stmt.setLong(1, idUsuario);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Configuração removida com sucesso para usuário: " + idUsuario);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover configuração do usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Optional<ConfigUsuario> findById(Long idUsuario) throws SQLException {
        return findByUsuario(idUsuario); // Para ConfigUsuario, ID = idUsuario
    }
    
    @Override
    public Optional<ConfigUsuario> findByUsuario(Long idUsuario) throws SQLException {
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
                        return Optional.of(mapResultSetToConfig(rs));
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar configuração do usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public List<ConfigUsuario> findAll() throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_ALL);
                 ResultSet rs = stmt.executeQuery()) {
                
                List<ConfigUsuario> configs = new ArrayList<>();
                while (rs.next()) {
                    configs.add(mapResultSetToConfig(rs));
                }
                
                LOGGER.info("Encontradas " + configs.size() + " configurações de usuário");
                return configs;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar todas as configurações", e);
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
            LOGGER.log(Level.SEVERE, "Erro ao contar configurações", e);
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
        return usuarioTemConfiguracao(idUsuario);
    }
    
    
    @Override
    public List<ConfigUsuario> findByMoedaPadrao(Moeda moeda) throws SQLException {
        if (moeda == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_MOEDA, stmt -> stmt.setString(1, moeda.getCodigo()));
    }
    
    @Override
    public List<ConfigUsuario> findByIdioma(String idioma) throws SQLException {
        if (idioma == null || idioma.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_IDIOMA, stmt -> stmt.setString(1, idioma.trim()));
    }
    
    @Override
    public List<ConfigUsuario> findByNotificacoesAtivas(boolean ativo) throws SQLException {
        String valor = ativo ? "S" : "N";
        return executeQuery(SQL_FIND_BY_NOTIFICACOES, stmt -> stmt.setString(1, valor));
    }
    
    @Override
    public List<ConfigUsuario> findByTemaEscuro(boolean temaEscuro) throws SQLException {
        String valor = temaEscuro ? "S" : "N";
        return executeQuery(SQL_FIND_BY_TEMA, stmt -> stmt.setString(1, valor));
    }
    
    @Override
    public List<ConfigUsuario> findByFusoHorario(String fusoHorario) throws SQLException {
        if (fusoHorario == null || fusoHorario.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_FUSO, stmt -> stmt.setString(1, fusoHorario.trim()));
    }
    
    @Override
    public List<ConfigUsuario> findAtualizadasRecentemente(int horas) throws SQLException {
        String sql = "SELECT id_usuario, moeda_padrao, notificacoes_ativas, tema_escuro, notificacao_email, notificacao_push, idioma, formato_data, fuso_horario, ultima_atualizacao FROM config_usuario WHERE ultima_atualizacao >= SYSTIMESTAMP - INTERVAL '" + horas + "' HOUR";
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {
                
                List<ConfigUsuario> configs = new ArrayList<>();
                while (rs.next()) {
                    configs.add(mapResultSetToConfig(rs));
                }
                return configs;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar configurações atualizadas recentemente", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<ConfigUsuario> findComNotificacaoEmail() throws SQLException {
        return executeQuery(SQL_FIND_COM_EMAIL, stmt -> {});
    }
    
    @Override
    public List<ConfigUsuario> findComNotificacaoPush() throws SQLException {
        return executeQuery(SQL_FIND_COM_PUSH, stmt -> {});
    }
    
    @Override
    public boolean upsert(ConfigUsuario config) throws SQLException {
        if (config == null || !config.isValid()) {
            throw new IllegalArgumentException("Configuração inválida para upsert");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_UPSERT)) {
                stmt.setLong(1, config.getIdUsuario());
                
                stmt.setString(2, config.getMoedaPadrao().getCodigo());
                stmt.setString(3, String.valueOf(config.getNotificacoesAtivas().getCodigo()));
                stmt.setString(4, String.valueOf(config.getTemaEscuro().getCodigo()));
                stmt.setString(5, String.valueOf(config.getNotificacaoEmail().getCodigo()));
                stmt.setString(6, String.valueOf(config.getNotificacaoPush().getCodigo()));
                stmt.setString(7, config.getIdioma());
                stmt.setString(8, config.getFormatoData());
                stmt.setString(9, config.getFusoHorario());
                stmt.setTimestamp(10, Timestamp.valueOf(LocalDateTime.now()));
                
                stmt.setLong(11, config.getIdUsuario());
                stmt.setString(12, config.getMoedaPadrao().getCodigo());
                stmt.setString(13, String.valueOf(config.getNotificacoesAtivas().getCodigo()));
                stmt.setString(14, String.valueOf(config.getTemaEscuro().getCodigo()));
                stmt.setString(15, String.valueOf(config.getNotificacaoEmail().getCodigo()));
                stmt.setString(16, String.valueOf(config.getNotificacaoPush().getCodigo()));
                stmt.setString(17, config.getIdioma());
                stmt.setString(18, config.getFormatoData());
                stmt.setString(19, config.getFusoHorario());
                stmt.setTimestamp(20, Timestamp.valueOf(LocalDateTime.now()));
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    config.setUltimaAtualizacao(LocalDateTime.now());
                    LOGGER.info("Upsert realizado com sucesso para usuário: " + config.getIdUsuario());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao fazer upsert da configuração: " + config.getIdUsuario(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean atualizarMoedaPadrao(Long idUsuario, Moeda moeda) throws SQLException {
        if (idUsuario == null || moeda == null) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_MOEDA, stmt -> {
            stmt.setString(1, moeda.getCodigo());
            stmt.setLong(2, idUsuario);
        });
    }
    
    @Override
    public boolean atualizarNotificacoes(Long idUsuario, boolean notificacoesAtivas, 
                                         boolean notificacaoEmail, boolean notificacaoPush) throws SQLException {
        if (idUsuario == null) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_NOTIFICACOES, stmt -> {
            stmt.setString(1, notificacoesAtivas ? "S" : "N");
            stmt.setString(2, notificacaoEmail ? "S" : "N");
            stmt.setString(3, notificacaoPush ? "S" : "N");
            stmt.setLong(4, idUsuario);
        });
    }
    
    @Override
    public boolean atualizarConfiguracaoRegional(Long idUsuario, Moeda moeda, String idioma, 
                                                 String formatoData, String fusoHorario) throws SQLException {
        if (idUsuario == null || moeda == null || idioma == null || formatoData == null || fusoHorario == null) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_REGIONAL, stmt -> {
            stmt.setString(1, moeda.getCodigo());
            stmt.setString(2, idioma);
            stmt.setString(3, formatoData);
            stmt.setString(4, fusoHorario);
            stmt.setLong(5, idUsuario);
        });
    }
    
    @Override
    public boolean atualizarTema(Long idUsuario, boolean temaEscuro) throws SQLException {
        if (idUsuario == null) {
            return false;
        }
        
        return executeUpdate(SQL_UPDATE_TEMA, stmt -> {
            stmt.setString(1, temaEscuro ? "S" : "N");
            stmt.setLong(2, idUsuario);
        });
    }
    
    @Override
    public Map<Moeda, Long> contarPorMoeda() throws SQLException {
        Map<Moeda, Long> resultado = new HashMap<>();
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_CONTAR_POR_MOEDA);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    String codigoMoeda = rs.getString(1);
                    Long count = rs.getLong(2);
                    
                    try {
                        Moeda moeda = Moeda.fromCodigo(codigoMoeda);
                        resultado.put(moeda, count);
                    } catch (Exception e) {
                        LOGGER.warning("Moeda desconhecida no banco: " + codigoMoeda);
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao contar por moeda", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return resultado;
    }
    
    @Override
    public Map<String, Long> contarPorIdioma() throws SQLException {
        Map<String, Long> resultado = new HashMap<>();
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_CONTAR_POR_IDIOMA);
                 ResultSet rs = stmt.executeQuery()) {
                
                while (rs.next()) {
                    String idioma = rs.getString(1);
                    Long count = rs.getLong(2);
                    resultado.put(idioma, count);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao contar por idioma", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return resultado;
    }
    
    @Override
    public Map<String, Object> obterEstatisticas() throws SQLException {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            stats.put("totalConfiguracoes", count());
            
            stats.put("porMoeda", contarPorMoeda());
            
            stats.put("porIdioma", contarPorIdioma());
            
            long comNotificacoes = findByNotificacoesAtivas(true).size();
            stats.put("comNotificacoesAtivas", comNotificacoes);
            
            long comTemaEscuro = findByTemaEscuro(true).size();
            stats.put("comTemaEscuro", comTemaEscuro);
            
            long atualizadasRecentemente = findAtualizadasRecentemente(24).size();
            stats.put("atualizadasUltimas24h", atualizadasRecentemente);
            
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Erro ao calcular algumas estatísticas", e);
        }
        
        return stats;
    }
    
    @Override
    public boolean removerPorUsuario(Long idUsuario) throws SQLException {
        return delete(idUsuario); // Mesmo comportamento
    }
    
    @Override
    public Optional<ConfigUsuario> criarConfiguracaoPadrao(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return Optional.empty();
        }
        
        ConfigUsuario configPadrao = new ConfigUsuario();
        configPadrao.setIdUsuario(idUsuario);
        
        boolean inseriu = insert(configPadrao);
        if (inseriu) {
            return Optional.of(configPadrao);
        }
        
        return Optional.empty();
    }
    
    @Override
    public boolean usuarioTemConfiguracao(Long idUsuario) throws SQLException {
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
            LOGGER.log(Level.SEVERE, "Erro ao verificar se usuário tem configuração: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    
    @FunctionalInterface
    private interface StatementSetter {
        void setParameters(PreparedStatement stmt) throws SQLException;
    }
    
    private List<ConfigUsuario> executeQuery(String sql, StatementSetter setter) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                setter.setParameters(stmt);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<ConfigUsuario> configs = new ArrayList<>();
                    while (rs.next()) {
                        configs.add(mapResultSetToConfig(rs));
                    }
                    return configs;
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
    
    private void setConfigParameters(PreparedStatement stmt, ConfigUsuario config) throws SQLException {
        stmt.setLong(1, config.getIdUsuario());
        stmt.setString(2, config.getMoedaPadrao().getCodigo());
        stmt.setString(3, String.valueOf(config.getNotificacoesAtivas().getCodigo()));
        stmt.setString(4, String.valueOf(config.getTemaEscuro().getCodigo()));
        stmt.setString(5, String.valueOf(config.getNotificacaoEmail().getCodigo()));
        stmt.setString(6, String.valueOf(config.getNotificacaoPush().getCodigo()));
        stmt.setString(7, config.getIdioma());
        stmt.setString(8, config.getFormatoData());
        stmt.setString(9, config.getFusoHorario());
        stmt.setTimestamp(10, Timestamp.valueOf(config.getUltimaAtualizacao() != null ? 
                                               config.getUltimaAtualizacao() : LocalDateTime.now()));
    }
    
    private ConfigUsuario mapResultSetToConfig(ResultSet rs) throws SQLException {
        ConfigUsuario config = new ConfigUsuario();
        config.setIdUsuario(rs.getLong("id_usuario"));
        config.setMoedaPadrao(Moeda.fromCodigo(rs.getString("moeda_padrao")));
        config.setNotificacoesAtivas(SimNao.fromChar(rs.getString("notificacoes_ativas").charAt(0)));
        config.setTemaEscuro(SimNao.fromChar(rs.getString("tema_escuro").charAt(0)));
        config.setNotificacaoEmail(SimNao.fromChar(rs.getString("notificacao_email").charAt(0)));
        config.setNotificacaoPush(SimNao.fromChar(rs.getString("notificacao_push").charAt(0)));
        config.setIdioma(rs.getString("idioma"));
        config.setFormatoData(rs.getString("formato_data"));
        config.setFusoHorario(rs.getString("fuso_horario"));
        
        Timestamp ultimaAtualizacao = rs.getTimestamp("ultima_atualizacao");
        if (ultimaAtualizacao != null) {
            config.setUltimaAtualizacao(ultimaAtualizacao.toLocalDateTime());
        }
        
        return config;
    }
}
