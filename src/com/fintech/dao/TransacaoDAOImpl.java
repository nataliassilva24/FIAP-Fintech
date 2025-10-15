package com.fintech.dao;

import com.fintech.enums.TipoTransacao;
import com.fintech.model.Transacao;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TransacaoDAOImpl implements TransacaoDAO {
    
    private static final Logger LOGGER = Logger.getLogger(TransacaoDAOImpl.class.getName());
    private final ConnectionManager connectionManager;
    
    private static final String SQL_INSERT = 
        "INSERT INTO transacao (id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    private static final String SQL_UPDATE = 
        "UPDATE transacao SET id_usuario = ?, tipo_transacao = ?, categoria = ?, descricao = ?, valor = ?, data = ? WHERE id_transacao = ?";
    
    private static final String SQL_DELETE = 
        "DELETE FROM transacao WHERE id_transacao = ?";
    
    private static final String SQL_FIND_BY_ID = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao WHERE id_transacao = ?";
    
    private static final String SQL_FIND_ALL = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao ORDER BY data DESC";
    
    private static final String SQL_COUNT = 
        "SELECT COUNT(*) FROM transacao";
    
    private static final String SQL_EXISTS = 
        "SELECT 1 FROM transacao WHERE id_transacao = ?";
    
    private static final String SQL_FIND_BY_USUARIO = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao WHERE id_usuario = ? ORDER BY data DESC";
    
    private static final String SQL_FIND_BY_TIPO = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao WHERE tipo_transacao = ? ORDER BY data DESC";
    
    private static final String SQL_FIND_BY_CATEGORIA = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao WHERE UPPER(categoria) = UPPER(?) ORDER BY data DESC";
    
    private static final String SQL_FIND_BY_PERIODO = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao WHERE data BETWEEN ? AND ? ORDER BY data DESC";
    
    private static final String SQL_FIND_BY_USUARIO_PERIODO = 
        "SELECT id_transacao, id_usuario, tipo_transacao, categoria, descricao, valor, data FROM transacao WHERE id_usuario = ? AND data BETWEEN ? AND ? ORDER BY data DESC";
    
    private static final String SQL_CALCULAR_SALDO = 
        "SELECT SUM(CASE WHEN tipo_transacao = 'CREDITO' THEN valor ELSE -valor END) FROM transacao WHERE id_usuario = ?";
    
    private static final String SQL_CALCULAR_TOTAL_POR_TIPO = 
        "SELECT SUM(valor) FROM transacao WHERE id_usuario = ? AND tipo_transacao = ?";
    
    public TransacaoDAOImpl() {
        this.connectionManager = ConnectionManager.getInstance();
    }
    
    @Override
    public boolean insert(Transacao transacao) throws SQLException {
        if (transacao == null || !transacao.isValid()) {
            throw new IllegalArgumentException("Transação inválida para inserção");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_INSERT)) {
                setTransacaoParameters(stmt, transacao, false);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Transação inserida com sucesso: ID " + transacao.getIdTransacao());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao inserir transação: " + transacao.getIdTransacao(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean update(Transacao transacao) throws SQLException {
        if (transacao == null || transacao.getIdTransacao() == null || !transacao.isValid()) {
            throw new IllegalArgumentException("Transação inválida para atualização");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_UPDATE)) {
                setTransacaoParameters(stmt, transacao, true);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Transação atualizada com sucesso: ID " + transacao.getIdTransacao());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar transação: " + transacao.getIdTransacao(), e);
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
                    LOGGER.info("Transação removida com sucesso: ID " + id);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover transação: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Optional<Transacao> findById(Long id) throws SQLException {
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
                        return Optional.of(mapResultSetToTransacao(rs));
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar transação por ID: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public List<Transacao> findAll() throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_ALL);
                 ResultSet rs = stmt.executeQuery()) {
                
                List<Transacao> transacoes = new ArrayList<>();
                while (rs.next()) {
                    transacoes.add(mapResultSetToTransacao(rs));
                }
                
                LOGGER.info("Encontradas " + transacoes.size() + " transações");
                return transacoes;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar todas as transações", e);
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
            LOGGER.log(Level.SEVERE, "Erro ao contar transações", e);
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
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência da transação: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<Transacao> findByUsuario(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_USUARIO)) {
                stmt.setLong(1, idUsuario);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Transacao> transacoes = new ArrayList<>();
                    while (rs.next()) {
                        transacoes.add(mapResultSetToTransacao(rs));
                    }
                    return transacoes;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar transações por usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<Transacao> findByTipo(TipoTransacao tipo) throws SQLException {
        if (tipo == null) {
            return new ArrayList<>();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_TIPO)) {
                stmt.setString(1, tipo.name());
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Transacao> transacoes = new ArrayList<>();
                    while (rs.next()) {
                        transacoes.add(mapResultSetToTransacao(rs));
                    }
                    return transacoes;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar transações por tipo: " + tipo, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<Transacao> findByCategoria(String categoria) throws SQLException {
        if (categoria == null || categoria.trim().isEmpty()) {
            return new ArrayList<>();
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_CATEGORIA)) {
                stmt.setString(1, categoria.trim());
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Transacao> transacoes = new ArrayList<>();
                    while (rs.next()) {
                        transacoes.add(mapResultSetToTransacao(rs));
                    }
                    return transacoes;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar transações por categoria: " + categoria, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<Transacao> findByPeriodo(LocalDate dataInicio, LocalDate dataFim) throws SQLException {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Datas não podem ser nulas");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_PERIODO)) {
                stmt.setDate(1, Date.valueOf(dataInicio));
                stmt.setDate(2, Date.valueOf(dataFim));
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Transacao> transacoes = new ArrayList<>();
                    while (rs.next()) {
                        transacoes.add(mapResultSetToTransacao(rs));
                    }
                    return transacoes;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar transações por período", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<Transacao> findByUsuarioAndPeriodo(Long idUsuario, LocalDate dataInicio, LocalDate dataFim) throws SQLException {
        if (idUsuario == null || dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Parâmetros não podem ser nulos");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_BY_USUARIO_PERIODO)) {
                stmt.setLong(1, idUsuario);
                stmt.setDate(2, Date.valueOf(dataInicio));
                stmt.setDate(3, Date.valueOf(dataFim));
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Transacao> transacoes = new ArrayList<>();
                    while (rs.next()) {
                        transacoes.add(mapResultSetToTransacao(rs));
                    }
                    return transacoes;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar transações por usuário e período", e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public BigDecimal calcularSaldo(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_CALCULAR_SALDO)) {
                stmt.setLong(1, idUsuario);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        BigDecimal saldo = rs.getBigDecimal(1);
                        return saldo != null ? saldo : BigDecimal.ZERO;
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao calcular saldo do usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return BigDecimal.ZERO;
    }
    
    @Override
    public BigDecimal calcularTotalPorTipo(Long idUsuario, TipoTransacao tipo) throws SQLException {
        if (idUsuario == null || tipo == null) {
            return BigDecimal.ZERO;
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_CALCULAR_TOTAL_POR_TIPO)) {
                stmt.setLong(1, idUsuario);
                stmt.setString(2, tipo.name());
                
                try (ResultSet rs = stmt.executeQuery()) {
                    if (rs.next()) {
                        BigDecimal total = rs.getBigDecimal(1);
                        return total != null ? total : BigDecimal.ZERO;
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao calcular total por tipo para usuário: " + idUsuario, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return BigDecimal.ZERO;
    }
    
    private void setTransacaoParameters(PreparedStatement stmt, Transacao transacao, boolean isUpdate) throws SQLException {
        if (isUpdate) {
            stmt.setLong(1, transacao.getIdUsuario());
            stmt.setString(2, transacao.getTipoTransacao().name());
            stmt.setString(3, transacao.getCategoria());
            stmt.setString(4, transacao.getDescricao());
            stmt.setBigDecimal(5, transacao.getValor());
            stmt.setDate(6, transacao.getData() != null ? Date.valueOf(transacao.getData()) : null);
            stmt.setLong(7, transacao.getIdTransacao());
        } else {
            stmt.setLong(1, transacao.getIdTransacao());
            stmt.setLong(2, transacao.getIdUsuario());
            stmt.setString(3, transacao.getTipoTransacao().name());
            stmt.setString(4, transacao.getCategoria());
            stmt.setString(5, transacao.getDescricao());
            stmt.setBigDecimal(6, transacao.getValor());
            stmt.setDate(7, transacao.getData() != null ? Date.valueOf(transacao.getData()) : null);
        }
    }
    
    private Transacao mapResultSetToTransacao(ResultSet rs) throws SQLException {
        Transacao transacao = new Transacao();
        transacao.setIdTransacao(rs.getLong("id_transacao"));
        transacao.setIdUsuario(rs.getLong("id_usuario"));
        transacao.setTipoTransacao(TipoTransacao.fromString(rs.getString("tipo_transacao")));
        transacao.setCategoria(rs.getString("categoria"));
        transacao.setDescricao(rs.getString("descricao"));
        transacao.setValor(rs.getBigDecimal("valor"));
        
        Date sqlDate = rs.getDate("data");
        if (sqlDate != null) {
            transacao.setData(sqlDate.toLocalDate());
        }
        
        return transacao;
    }
}
