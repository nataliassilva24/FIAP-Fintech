package com.fintech.dao;

import com.fintech.enums.TipoInvestimento;
import com.fintech.model.Investimento;
import com.fintech.util.ConnectionManager;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Level;
import java.util.logging.Logger;

public class InvestimentoDAOImpl implements InvestimentoDAO {
    
    private static final Logger LOGGER = Logger.getLogger(InvestimentoDAOImpl.class.getName());
    private final ConnectionManager connectionManager;
    
    private static final String SQL_INSERT = 
        "INSERT INTO investimento (id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate) VALUES (?, ?, ?, ?, ?, ?)";
    
    private static final String SQL_UPDATE = 
        "UPDATE investimento SET id_usuario = ?, tipo = ?, valor_investido = ?, data_aplicacao = ?, data_resgate = ? WHERE id_investimento = ?";
    
    private static final String SQL_DELETE = 
        "DELETE FROM investimento WHERE id_investimento = ?";
    
    private static final String SQL_FIND_BY_ID = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE id_investimento = ?";
    
    private static final String SQL_FIND_ALL = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento ORDER BY data_aplicacao DESC";
    
    private static final String SQL_COUNT = 
        "SELECT COUNT(*) FROM investimento";
    
    private static final String SQL_EXISTS = 
        "SELECT 1 FROM investimento WHERE id_investimento = ?";
    
    private static final String SQL_FIND_BY_USUARIO = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE id_usuario = ? ORDER BY data_aplicacao DESC";
    
    private static final String SQL_FIND_BY_TIPO = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE tipo = ? ORDER BY data_aplicacao DESC";
    
    private static final String SQL_FIND_ATIVOS = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE id_usuario = ? AND (data_resgate IS NULL OR data_resgate > SYSDATE) ORDER BY data_aplicacao DESC";
    
    private static final String SQL_FIND_RESGATADOS = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE id_usuario = ? AND data_resgate IS NOT NULL AND data_resgate <= SYSDATE ORDER BY data_resgate DESC";
    
    private static final String SQL_FIND_BY_PERIODO_APLICACAO = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE data_aplicacao BETWEEN ? AND ? ORDER BY data_aplicacao DESC";
    
    private static final String SQL_FIND_BY_PERIODO_RESGATE = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE data_resgate BETWEEN ? AND ? ORDER BY data_resgate DESC";
    
    private static final String SQL_FIND_BY_USUARIO_TIPO = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE id_usuario = ? AND tipo = ? ORDER BY data_aplicacao DESC";
    
    private static final String SQL_TOTAL_INVESTIDO = 
        "SELECT SUM(valor_investido) FROM investimento WHERE id_usuario = ?";
    
    private static final String SQL_TOTAL_POR_TIPO = 
        "SELECT SUM(valor_investido) FROM investimento WHERE id_usuario = ? AND tipo = ?";
    
    private static final String SQL_TOTAL_ATIVOS = 
        "SELECT SUM(valor_investido) FROM investimento WHERE id_usuario = ? AND (data_resgate IS NULL OR data_resgate > SYSDATE)";
    
    private static final String SQL_PROXIMOS_VENCIMENTO = 
        "SELECT id_investimento, id_usuario, tipo, valor_investido, data_aplicacao, data_resgate FROM investimento WHERE id_usuario = ? AND data_resgate IS NOT NULL AND data_resgate BETWEEN SYSDATE AND SYSDATE + ? ORDER BY data_resgate ASC";
    
    public InvestimentoDAOImpl() {
        this.connectionManager = ConnectionManager.getInstance();
    }
    
    @Override
    public boolean insert(Investimento investimento) throws SQLException {
        if (investimento == null || !investimento.isValid()) {
            throw new IllegalArgumentException("Investimento inválido para inserção");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_INSERT)) {
                setInvestimentoParameters(stmt, investimento, false);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Investimento inserido com sucesso: ID " + investimento.getIdInvestimento());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao inserir investimento: " + investimento.getIdInvestimento(), e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public boolean update(Investimento investimento) throws SQLException {
        if (investimento == null || investimento.getIdInvestimento() == null || !investimento.isValid()) {
            throw new IllegalArgumentException("Investimento inválido para atualização");
        }
        
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_UPDATE)) {
                setInvestimentoParameters(stmt, investimento, true);
                
                int rowsAffected = stmt.executeUpdate();
                boolean success = rowsAffected > 0;
                
                if (success) {
                    LOGGER.info("Investimento atualizado com sucesso: ID " + investimento.getIdInvestimento());
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao atualizar investimento: " + investimento.getIdInvestimento(), e);
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
                    LOGGER.info("Investimento removido com sucesso: ID " + id);
                }
                
                return success;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao remover investimento: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public Optional<Investimento> findById(Long id) throws SQLException {
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
                        return Optional.of(mapResultSetToInvestimento(rs));
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar investimento por ID: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
        
        return Optional.empty();
    }
    
    @Override
    public List<Investimento> findAll() throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(SQL_FIND_ALL);
                 ResultSet rs = stmt.executeQuery()) {
                
                List<Investimento> investimentos = new ArrayList<>();
                while (rs.next()) {
                    investimentos.add(mapResultSetToInvestimento(rs));
                }
                
                LOGGER.info("Encontrados " + investimentos.size() + " investimentos");
                return investimentos;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Erro ao buscar todos os investimentos", e);
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
            LOGGER.log(Level.SEVERE, "Erro ao contar investimentos", e);
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
            LOGGER.log(Level.SEVERE, "Erro ao verificar existência do investimento: " + id, e);
            throw e;
        } finally {
            if (conn != null) {
                connectionManager.returnConnection(conn);
            }
        }
    }
    
    @Override
    public List<Investimento> findByUsuario(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_USUARIO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<Investimento> findByTipo(TipoInvestimento tipo) throws SQLException {
        if (tipo == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_TIPO, stmt -> stmt.setString(1, tipo.name()));
    }
    
    @Override
    public List<Investimento> findAtivos(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_ATIVOS, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<Investimento> findResgatados(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_RESGATADOS, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<Investimento> findByPeriodoAplicacao(LocalDate dataInicio, LocalDate dataFim) throws SQLException {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Datas não podem ser nulas");
        }
        
        return executeQuery(SQL_FIND_BY_PERIODO_APLICACAO, stmt -> {
            stmt.setDate(1, Date.valueOf(dataInicio));
            stmt.setDate(2, Date.valueOf(dataFim));
        });
    }
    
    @Override
    public List<Investimento> findByPeriodoResgate(LocalDate dataInicio, LocalDate dataFim) throws SQLException {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Datas não podem ser nulas");
        }
        
        return executeQuery(SQL_FIND_BY_PERIODO_RESGATE, stmt -> {
            stmt.setDate(1, Date.valueOf(dataInicio));
            stmt.setDate(2, Date.valueOf(dataFim));
        });
    }
    
    @Override
    public List<Investimento> findByUsuarioAndTipo(Long idUsuario, TipoInvestimento tipo) throws SQLException {
        if (idUsuario == null || tipo == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_FIND_BY_USUARIO_TIPO, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setString(2, tipo.name());
        });
    }
    
    @Override
    public BigDecimal calcularTotalInvestido(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_TOTAL_INVESTIDO, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public BigDecimal calcularTotalPorTipo(Long idUsuario, TipoInvestimento tipo) throws SQLException {
        if (idUsuario == null || tipo == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_TOTAL_POR_TIPO, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setString(2, tipo.name());
        });
    }
    
    @Override
    public BigDecimal calcularTotalAtivos(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return BigDecimal.ZERO;
        }
        
        return executeCalculation(SQL_TOTAL_ATIVOS, stmt -> stmt.setLong(1, idUsuario));
    }
    
    @Override
    public List<Investimento> findProximosVencimento(Long idUsuario, int diasAntecedencia) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        return executeQuery(SQL_PROXIMOS_VENCIMENTO, stmt -> {
            stmt.setLong(1, idUsuario);
            stmt.setInt(2, diasAntecedencia);
        });
    }
    
    @Override
    public List<Investimento> findRendaFixa(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        List<Investimento> todosInvestimentos = findByUsuario(idUsuario);
        return todosInvestimentos.stream()
                .filter(inv -> inv.getTipo().isRendaFixa())
                .toList();
    }
    
    @Override
    public List<Investimento> findRendaVariavel(Long idUsuario) throws SQLException {
        if (idUsuario == null) {
            return new ArrayList<>();
        }
        
        List<Investimento> todosInvestimentos = findByUsuario(idUsuario);
        return todosInvestimentos.stream()
                .filter(inv -> inv.getTipo().isRendaVariavel())
                .toList();
    }
    
    
    @FunctionalInterface
    private interface StatementSetter {
        void setParameters(PreparedStatement stmt) throws SQLException;
    }
    
    private List<Investimento> executeQuery(String sql, StatementSetter setter) throws SQLException {
        Connection conn = null;
        try {
            conn = connectionManager.getConnection();
            
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                setter.setParameters(stmt);
                
                try (ResultSet rs = stmt.executeQuery()) {
                    List<Investimento> investimentos = new ArrayList<>();
                    while (rs.next()) {
                        investimentos.add(mapResultSetToInvestimento(rs));
                    }
                    return investimentos;
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
    
    private void setInvestimentoParameters(PreparedStatement stmt, Investimento investimento, boolean isUpdate) throws SQLException {
        if (isUpdate) {
            stmt.setLong(1, investimento.getIdUsuario());
            stmt.setString(2, investimento.getTipo().name());
            stmt.setBigDecimal(3, investimento.getValorInvestido());
            stmt.setDate(4, investimento.getDataAplicacao() != null ? Date.valueOf(investimento.getDataAplicacao()) : null);
            stmt.setDate(5, investimento.getDataResgate() != null ? Date.valueOf(investimento.getDataResgate()) : null);
            stmt.setLong(6, investimento.getIdInvestimento());
        } else {
            stmt.setLong(1, investimento.getIdInvestimento());
            stmt.setLong(2, investimento.getIdUsuario());
            stmt.setString(3, investimento.getTipo().name());
            stmt.setBigDecimal(4, investimento.getValorInvestido());
            stmt.setDate(5, investimento.getDataAplicacao() != null ? Date.valueOf(investimento.getDataAplicacao()) : null);
            stmt.setDate(6, investimento.getDataResgate() != null ? Date.valueOf(investimento.getDataResgate()) : null);
        }
    }
    
    private Investimento mapResultSetToInvestimento(ResultSet rs) throws SQLException {
        Investimento investimento = new Investimento();
        investimento.setIdInvestimento(rs.getLong("id_investimento"));
        investimento.setIdUsuario(rs.getLong("id_usuario"));
        investimento.setTipo(TipoInvestimento.fromString(rs.getString("tipo")));
        investimento.setValorInvestido(rs.getBigDecimal("valor_investido"));
        
        Date dataAplicacao = rs.getDate("data_aplicacao");
        if (dataAplicacao != null) {
            investimento.setDataAplicacao(dataAplicacao.toLocalDate());
        }
        
        Date dataResgate = rs.getDate("data_resgate");
        if (dataResgate != null) {
            investimento.setDataResgate(dataResgate.toLocalDate());
        }
        
        return investimento;
    }
}
