package com.fintech.util;

import com.fintech.config.DatabaseConfig;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ConnectionManager {
    
    private static final Logger LOGGER = Logger.getLogger(ConnectionManager.class.getName());
    private static ConnectionManager instance;
    
    private final DatabaseConfig config;
    private final BlockingQueue<Connection> connectionPool;
    private volatile boolean isShutdown = false;
    
    private ConnectionManager() {
        this.config = DatabaseConfig.getInstance();
        this.connectionPool = new ArrayBlockingQueue<>(config.getMaxPoolSize());
        initializePool();
    }
    
    public static synchronized ConnectionManager getInstance() {
        if (instance == null) {
            instance = new ConnectionManager();
        }
        return instance;
    }
    
    private void initializePool() {
        LOGGER.info("Inicializando pool de conexões...");
        
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            
            for (int i = 0; i < config.getMinPoolSize(); i++) {
                Connection conn = createNewConnection();
                if (conn != null) {
                    connectionPool.offer(conn);
                }
            }
            
            LOGGER.info("Pool inicializado com " + connectionPool.size() + " conexões");
            
        } catch (ClassNotFoundException e) {
            LOGGER.severe("Driver Oracle não encontrado: " + e.getMessage());
            throw new RuntimeException("Driver Oracle não encontrado", e);
        }
    }
    
    private Connection createNewConnection() {
        try {
            Connection conn = DriverManager.getConnection(
                config.getUrl(), 
                config.getUsername(), 
                config.getPassword()
            );
            
            conn.setAutoCommit(true);
            
            LOGGER.fine("Nova conexão criada");
            return conn;
            
        } catch (SQLException e) {
            LOGGER.severe("Erro ao criar conexão: " + e.getMessage());
            return null;
        }
    }
    
    public Connection getConnection() throws SQLException {
        if (isShutdown) {
            throw new SQLException("ConnectionManager foi finalizado");
        }
        
        try {
            Connection conn = connectionPool.poll(config.getConnectionTimeout(), TimeUnit.MILLISECONDS);
            
            if (conn == null) {
                LOGGER.warning("Pool esgotado, criando nova conexão...");
                conn = createNewConnection();
                
                if (conn == null) {
                    throw new SQLException("Não foi possível obter conexão com o banco");
                }
            }
            
            if (conn.isClosed() || !conn.isValid(5)) {
                LOGGER.warning("Conexão inválida detectada, criando nova...");
                conn = createNewConnection();
                
                if (conn == null) {
                    throw new SQLException("Não foi possível criar nova conexão");
                }
            }
            
            return conn;
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new SQLException("Interrompido ao aguardar conexão", e);
        }
    }
    
    public void returnConnection(Connection conn) {
        if (conn == null || isShutdown) {
            return;
        }
        
        try {
            if (!conn.isClosed() && conn.isValid(1)) {
                conn.setAutoCommit(true);
                
                if (!connectionPool.offer(conn)) {
                    conn.close();
                    LOGGER.fine("Pool cheio, conexão fechada");
                }
            } else {
                conn.close();
                LOGGER.fine("Conexão inválida retornada, foi fechada");
            }
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Erro ao retornar conexão para o pool", e);
        }
    }
    
    public boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && conn.isValid(5);
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Teste de conexão falhou", e);
            return false;
        }
    }
    
    public String getPoolStats() {
        return String.format("Pool Stats - Disponíveis: %d, Máximo: %d, Mínimo: %d", 
            connectionPool.size(), config.getMaxPoolSize(), config.getMinPoolSize());
    }
    
    public synchronized void shutdown() {
        if (isShutdown) {
            return;
        }
        
        LOGGER.info("Finalizando pool de conexões...");
        isShutdown = true;
        
        Connection conn;
        while ((conn = connectionPool.poll()) != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                LOGGER.log(Level.WARNING, "Erro ao fechar conexão durante shutdown", e);
            }
        }
        
        LOGGER.info("Pool de conexões finalizado");
    }
}
