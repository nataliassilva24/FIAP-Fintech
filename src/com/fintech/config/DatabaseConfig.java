package com.fintech.config;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DatabaseConfig {
    
    private static DatabaseConfig instance;
    private Properties properties;
    
    private String url = "jdbc:oracle:thin:@oracle.fiap.com.br:1521:xe";
    private String username = "";
    private String password = "";
    private int maxPoolSize = 10;
    private int minPoolSize = 2;
    private int connectionTimeout = 30000; // 30 segundos
    
    private DatabaseConfig() {
        loadProperties();
    }
    
    public static synchronized DatabaseConfig getInstance() {
        if (instance == null) {
            instance = new DatabaseConfig();
        }
        return instance;
    }
    
    private void loadProperties() {
        properties = new Properties();
        
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("database.properties")) {
            if (is != null) {
                properties.load(is);
                loadConfigFromProperties();
                System.out.println("Configurações carregadas do arquivo database.properties");
            } else {
                System.out.println("Arquivo database.properties não encontrado. Usando configurações padrão.");
            }
        } catch (IOException e) {
            System.err.println("Erro ao carregar configurações: " + e.getMessage());
            System.out.println("Usando configurações padrão.");
        }
    }
    
    private void loadConfigFromProperties() {
        url = properties.getProperty("db.url", url);
        username = properties.getProperty("db.username", username);
        password = properties.getProperty("db.password", password);
        maxPoolSize = Integer.parseInt(properties.getProperty("db.pool.max", String.valueOf(maxPoolSize)));
        minPoolSize = Integer.parseInt(properties.getProperty("db.pool.min", String.valueOf(minPoolSize)));
        connectionTimeout = Integer.parseInt(properties.getProperty("db.connection.timeout", String.valueOf(connectionTimeout)));
    }
    
    public String getUrl() { return url; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public int getMaxPoolSize() { return maxPoolSize; }
    public int getMinPoolSize() { return minPoolSize; }
    public int getConnectionTimeout() { return connectionTimeout; }
    
    public void setUrl(String url) { this.url = url; }
    public void setUsername(String username) { this.username = username; }
    public void setPassword(String password) { this.password = password; }
    public void setMaxPoolSize(int maxPoolSize) { this.maxPoolSize = maxPoolSize; }
    public void setMinPoolSize(int minPoolSize) { this.minPoolSize = minPoolSize; }
    public void setConnectionTimeout(int connectionTimeout) { this.connectionTimeout = connectionTimeout; }
    
    public boolean isValid() {
        return url != null && !url.trim().isEmpty() &&
               username != null && !username.trim().isEmpty() &&
               password != null;
    }
    
    @Override
    public String toString() {
        return "DatabaseConfig{" +
                "url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", maxPoolSize=" + maxPoolSize +
                ", minPoolSize=" + minPoolSize +
                ", connectionTimeout=" + connectionTimeout +
                '}';
    }
}
