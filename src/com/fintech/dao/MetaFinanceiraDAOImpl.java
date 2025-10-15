package com.fintech.dao;

import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import com.fintech.model.MetaFinanceira;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.*;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

public class MetaFinanceiraDAOImpl implements MetaFinanceiraDAO {
    
    private static final Logger LOGGER = Logger.getLogger(MetaFinanceiraDAOImpl.class.getName());
    private final ConnectionManager connectionManager;
    
    private static final String SQL_INSERT = 
        "INSERT INTO meta_financeira (id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    private static final String SQL_UPDATE = 
        "UPDATE meta_financeira SET id_usuario = ?, nome = ?, descricao = ?, categoria = ?, valor_necessario = ?, valor_acumulado = ?, data_limite = ?, status = ? WHERE id_meta = ?";
    
    private static final String SQL_DELETE = 
        "DELETE FROM meta_financeira WHERE id_meta = ?";
    
    private static final String SQL_FIND_BY_ID = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_meta = ?";
    
    private static final String SQL_FIND_ALL = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira ORDER BY data_criacao DESC";
    
    private static final String SQL_COUNT = 
        "SELECT COUNT(*) FROM meta_financeira";
    
    private static final String SQL_EXISTS = 
        "SELECT 1 FROM meta_financeira WHERE id_meta = ?";
    
    private static final String SQL_FIND_BY_USUARIO = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_BY_STATUS = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE status = ? ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_BY_CATEGORIA = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE categoria = ? ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_ATIVAS = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND status = 'ATIVA' ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_CONCLUIDAS = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND status = 'CONCLUIDA' ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_VENCIDAS = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND status = 'VENCIDA' ORDER BY data_limite DESC";
    
    private static final String SQL_FIND_BY_USUARIO_CATEGORIA = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND categoria = ? ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_BY_USUARIO_STATUS = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND status = ? ORDER BY data_criacao DESC";
    
    private static final String SQL_FIND_BY_PERIODO_VENCIMENTO = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE data_limite BETWEEN ? AND ? ORDER BY data_limite ASC";
    
    private static final String SQL_FIND_PROXIMAS_VENCIMENTO = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND data_limite IS NOT NULL AND data_limite BETWEEN SYSDATE AND SYSDATE + ? AND status = 'ATIVA' ORDER BY data_limite ASC";
    
    private static final String SQL_FIND_BY_FAIXA_VALOR = 
        "SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status FROM meta_financeira WHERE id_usuario = ? AND valor_necessario BETWEEN ? AND ? ORDER BY valor_necessario DESC";
    
    private static final String SQL_TOTAL_NECESSARIO = 
        "SELECT SUM(valor_necessario) FROM meta_financeira WHERE id_usuario = ? AND status = 'ATIVA'";
    
    private static final String SQL_TOTAL_ACUMULADO = 
        "SELECT SUM(valor_acumulado) FROM meta_financeira WHERE id_usuario = ?";
    
    private static final String SQL_TOTAL_RESTANTE = 
        "SELECT SUM(valor_necessario - valor_acumulado) FROM meta_financeira WHERE id_usuario = ? AND status = 'ATIVA' AND valor_necessario > valor_acumulado";
    
    private static final String SQL_PERCENTUAL_MEDIO = 
        "SELECT AVG((valor_acumulado / valor_necessario) * 100) FROM meta_financeira WHERE id_usuario = ? AND status = 'ATIVA' AND valor_necessario > 0";
    
    private static final String SQL_ADICIONAR_VALOR = 
        "UPDATE meta_financeira SET valor_acumulado = valor_acumulado + ?, status = CASE WHEN (valor_acumulado + ?) >= valor_necessario THEN 'CONCLUIDA' ELSE status END WHERE id_meta = ? AND status = 'ATIVA'";
    
    private static final String SQL_REMOVER_VALOR = 
        "UPDATE meta_financeira SET valor_acumulado = GREATEST(0, valor_acumulado - ?), status = CASE WHEN valor_acumulado < valor_necessario AND status = 'CONCLUIDA' THEN 'ATIVA' ELSE status END WHERE id_meta = ? AND status IN ('ATIVA', 'CONCLUIDA')";
    
    private static final String SQL_ATUALIZAR_STATUS = 
        "UPDATE meta_financeira SET status = ? WHERE id_meta = ?";
    
    private static final String SQL_ATUALIZAR_METAS_VENCIDAS = 
        "UPDATE meta_financeira SET status = 'VENCIDA' WHERE data_limite < SYSDATE AND status = 'ATIVA'" +
        " AND (? IS NULL OR id_usuario = ?)";
    
    private static final String SQL_FIND_POR_PRIORIDADE = """
        SELECT id_meta, id_usuario, nome, descricao, categoria, valor_necessario, valor_acumulado, data_limite, data_criacao, status 
        FROM meta_financeira 
        WHERE id_usuario = ? AND status = 'ATIVA' 
        ORDER BY 
            CASE WHEN data_limite IS NULL THEN 1 ELSE 0 END,
            (data_limite - SYSDATE) ASC,
            (valor_acumulado / valor_necessario) ASC
        """;
    
    public MetaFinanceiraDAOImpl() {
        this.connectionManager = ConnectionManager.getInstance();
    }
    
    @Override
    public boolean insert(MetaFinanceira meta) throws SQLException {
        if (meta == null || !meta.isValid()) {
            throw new IllegalArgumentException("Meta financeira inválida para inserção");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_INSERT)) {
                setMetaParameters(stmt, meta, false);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Meta financeira inserida com sucesso: ID " + meta.getIdMeta());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao inserir meta financeira: " + meta.getIdMeta(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean update(MetaFinanceira meta) throws SQLException {
        if (meta == null || meta.getIdMeta() == null || !meta.isValid()) {
            throw new IllegalArgumentException("Meta financeira inválida para atualização");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_UPDATE)) {
                setMetaParameters(stmt, meta, true);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Meta financeira atualizada com sucesso: ID " + meta.getIdMeta());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar meta financeira: " + meta.getIdMeta(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean delete(Long id) throws SQLException {
        if (id == null) {
            throw new IllegalArgumentException("ID não pode ser nulo");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_DELETE)) {
                stmt.setLong(1, id);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Meta financeira removida com sucesso: ID " + id);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover meta financeira: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Optional<MetaFinanceira> findById(Long id) throws SQLException {
        if (id == null) {
            return Optional.empty();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_ID)) {
                stmt.setLong(1, id);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        return Optional.of(mapResultSetToMeta(rs));
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar meta financeira por ID: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public List<MetaFinanceira> findAll() throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_ALL);
                 ResultSet rs = stmt.executeQuery()) {
                
                List<MetaFinanceira> metas = new ArrayList<>();
                while (rs.next()) {
                    metas.add(mapResultSetToMeta(rs));
                }
                
                LOGGER.info("Encontradas " + metas.size() + " metas financeiras");
                return metas;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar todas as metas financeiras", e);
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
            LOGGER.log(Level.SEVERE, "Erro ao contar metas financeiras", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return 0;
    }
    
    @Override
    public boolean exists(Long id) throws SQLException {
        if (id == null) {
            return false;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_EXISTS)) {
                stmt.setLong(1, id);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    return rs.next();
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência da meta financeira: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    
    @Override
    public List<MetaFinanceira> findByUsuario(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_USUARIO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<MetaFinanceira> findByStatus(StatusMeta status) throws SQLException {
        if (status == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_STATUS, stmt -> stmt.setString(1, status.name()));
    }
    
    @Override
    public List<MetaFinanceira> findByCategoria(CategoriaMeta categoria) throws SQLException {
        if (categoria == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_CATEGORIA, stmt -> stmt.setString(1, categoria.name()));
    }
    
    @Override
    public List<MetaFinanceira> findAtivas(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_ATIVAS, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<MetaFinanceira> findConcluidas(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_CONCLUIDAS, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<MetaFinanceira> findVencidas(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_VENCIDAS, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<MetaFinanceira> findByUsuarioAndCategoria(Long idUsuario, CategoriaMeta categoria) throws SQLException {
        if (idUsuario == null || categoria == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_USUARIO_CATEGORIA, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setString(2, categoria.name());
        });
    }
    
    @Override
    public List<MetaFinanceira> findByUsuarioAndStatus(Long idUsuario, StatusMeta status) throws SQLException {
        if (idUsuario == null || status == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_USUARIO_STATUS, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setString(2, status.name());
        });
    }
    
    @Override
    public List<MetaFinanceira> findByPeriodoVencimento(LocalDate dataInicio, LocalDate dataFim) throws SQLException {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Datas não podem ser nulas");
        }
        
        return executeQuery(SQL_FIND_BY_PERIODO_VENCIMENTO, stmt -> {
            stmt.setDate(1, java.sql.Date.valueOf(dataInicio));
            stmt.setDate(2, java.sql.Date.valueOf(dataFim));
        });
    }
    
    @Override
    public List<MetaFinanceira> findProximasVencimento(Long idUsuario, int diasAntecedencia) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_PROXIMAS_VENCIMENTO, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setInt(2, diasAntecedencia);
        });
    }
    
    @Override
    public List<MetaFinanceira> findByFaixaPercentual(Long idUsuario, int percentualMinimo, int percentualMaximo) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        List<MetaFinanceira> todasMetas = findByUsuario(idUsuario);
        return todasMetas.stream()
                .filter(meta -> {
                    BigDecimal percentual = meta.getPercentualAlcancado();
                    return percentual.compareTo(new BigDecimal(percentualMinimo)) >= 0 &&
                           percentual.compareTo(new BigDecimal(percentualMaximo)) <= 0;
                })
                .toList();
    }
    
    @Override
    public List<MetaFinanceira> findByFaixaValor(Long idUsuario, BigDecimal valorMinimo, BigDecimal valorMaximo) throws SQLException {
        if (idUsuario == null || valorMinimo == null || valorMaximo == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_FAIXA_VALOR, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setBigDecimal(2, valorMinimo);
            stmt.setBigDecimal(3, valorMaximo);
        });
    }
    
    
    @Override
    public BigDecimal calcularTotalNecessario(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_TOTAL_NECESSARIO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public BigDecimal calcularTotalAcumulado(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_TOTAL_ACUMULADO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public BigDecimal calcularTotalRestante(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_TOTAL_RESTANTE, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public BigDecimal calcularPercentualMedio(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_PERCENTUAL_MEDIO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public BigDecimal calcularEconomiaoDiariaMedia(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        List<MetaFinanceira> metasAtivas = findAtivas(idUsuario);
        BigDecimal totalEconomiaDiaria = BigDecimal.ZERO;
        
        for (MetaFinanceira meta : metasAtivas) {
            totalEconomiaDiaria = totalEconomiaDiaria.add(meta.getEconomiaoDiaria());
        }
        
        return totalEconomiaDiaria;
    }
    
    @Override
    public List<MetaFinanceira> findPorPrioridade(Long idUsuario, int limite) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            String sql = SQL_FIND_POR_PRIORIDADE;
            if (limite > 0) {
                sql += " FETCH FIRST " + limite + " ROWS ONLY";
            }
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setLong(1, idUsuario);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<MetaFinanceira> metas = new ArrayList<>();
                    while (rs.next()) {
                        metas.add(mapResultSetToMeta(rs));
                    }
                    return metas;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar metas por prioridade", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Map<CategoriaMeta, Long> contarPorCategoria(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new HashMap<>();
        }
        
        List<MetaFinanceira> metas = findByUsuario(idUsuario);
        Map<CategoriaMeta, Long> contadores = new HashMap<>();
        
        for (MetaFinanceira meta : metas) {
            contadores.merge(meta.getCategoria(), 1L, Long::sum);
        }
        
        return contadores;
    }
    
    @Override
    public Map<StatusMeta, Long> contarPorStatus(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new HashMap<>();
        }
        
        List<MetaFinanceira> metas = findByUsuario(idUsuario);
        Map<StatusMeta, Long> contadores = new HashMap<>();
        
        for (MetaFinanceira meta : metas) {
            contadores.merge(meta.getStatus(), 1L, Long::sum);
        }
        
        return contadores;
    }
    
    
    @Override
    public boolean adicionarValor(Long idMeta, BigDecimal valor) throws SQLException {
        if (idMeta == null || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_ADICIONAR_VALOR)) {
                stmt.setBigDecimal(1, valor);
                stmt.setBigDecimal(2, valor);
                stmt.setLong(3, idMeta);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Valor adicionado à meta: ID " + idMeta + ", Valor: " + valor);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao adicionar valor à meta: " + idMeta, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean removerValor(Long idMeta, BigDecimal valor) throws SQLException {
        if (idMeta == null || valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_REMOVER_VALOR)) {
                stmt.setBigDecimal(1, valor);
                stmt.setLong(2, idMeta);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Valor removido da meta: ID " + idMeta + ", Valor: " + valor);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover valor da meta: " + idMeta, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean atualizarStatus(Long idMeta, StatusMeta novoStatus) throws SQLException {
        if (idMeta == null || novoStatus == null) {
            return false;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_ATUALIZAR_STATUS)) {
                stmt.setString(1, novoStatus.name());
                stmt.setLong(2, idMeta);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Status atualizado para meta: ID " + idMeta + ", Novo status: " + novoStatus);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar status da meta: " + idMeta, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public int atualizarMetasVencidas(Long idUsuario) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_ATUALIZAR_METAS_VENCIDAS)) {
                stmt.setObject(1, idUsuario);
                stmt.setObject(2, idUsuario);
                
                int rowsAffected = stmt.executeUpdate();
                
                if (rowsAffected > 0) {
                    LOGGER.info("Atualizadas " + rowsAffected + " metas vencidas" + 
                               (idUsuario != null ? " para usuário " + idUsuario : ""));
                }
                
                return rowsAffected;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar metas vencidas", e);
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
    
    private List<MetaFinanceira> executeQuery(String sql, StatementSetter setter) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                setter.setParameters(stmt);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<MetaFinanceira> metas = new ArrayList<>();
                    while (rs.next()) {
                        metas.add(mapResultSetToMeta(rs));
                    }
                    return metas;
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
    
    private BigDecimal executeCalculation(String sql, StatementSetter setter) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                setter.setParameters(stmt);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        BigDecimal result = rs.getBigDecimal(1);
                        return result != null ? result : BigDecimal.ZERO;
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao executar cálculo: " + sql, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return BigDecimal.ZERO;
    }
    
    private void setMetaParameters(PreparedStatement stmt, MetaFinanceira meta, boolean isUpdate) throws SQLException {
        if (isUpdate) {
            stmt.setLong(1, meta.getIdUsuario());
            stmt.setString(2, meta.getNome());
            stmt.setString(3, meta.getDescricao());
            stmt.setString(4, meta.getCategoria().name());
            stmt.setBigDecimal(5, meta.getValorNecessario());
            stmt.setBigDecimal(6, meta.getValorAcumulado());
            stmt.setDate(7, meta.getDataLimite() != null ? java.sql.Date.valueOf(meta.getDataLimite()) : null);
            stmt.setString(8, meta.getStatus().name());
            stmt.setLong(9, meta.getIdMeta());
        } else {
            stmt.setLong(1, meta.getIdMeta());
            stmt.setLong(2, meta.getIdUsuario());
            stmt.setString(3, meta.getNome());
            stmt.setString(4, meta.getDescricao());
            stmt.setString(5, meta.getCategoria().name());
            stmt.setBigDecimal(6, meta.getValorNecessario());
            stmt.setBigDecimal(7, meta.getValorAcumulado());
            stmt.setDate(8, meta.getDataLimite() != null ? java.sql.Date.valueOf(meta.getDataLimite()) : null);
            stmt.setDate(9, meta.getDataCriacao() != null ? java.sql.Date.valueOf(meta.getDataCriacao()) : java.sql.Date.valueOf(LocalDate.now()));
            stmt.setString(10, meta.getStatus().name());
        }
    }
    
    private MetaFinanceira mapResultSetToMeta(ResultSet rs) throws SQLException {
        MetaFinanceira meta = new MetaFinanceira();
        meta.setIdMeta(rs.getLong("id_meta"));
        meta.setIdUsuario(rs.getLong("id_usuario"));
        meta.setNome(rs.getString("nome"));
        meta.setDescricao(rs.getString("descricao"));
        meta.setCategoria(CategoriaMeta.fromString(rs.getString("categoria")));
        meta.setValorNecessario(rs.getBigDecimal("valor_necessario"));
        meta.setValorAcumulado(rs.getBigDecimal("valor_acumulado"));
        
        java.sql.Date dataLimite = rs.getDate("data_limite");
        if (dataLimite != null) {
            meta.setDataLimite(dataLimite.toLocalDate());
        }
        
        java.sql.Date dataCriacao = rs.getDate("data_criacao");
        if (dataCriacao != null) {
            meta.setDataCriacao(dataCriacao.toLocalDate());
        }
        
        meta.setStatus(StatusMeta.fromString(rs.getString("status")));
        
        return meta;
    }
}
