package com.fintech.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Utilitário para criar a tabela TB_INVESTIMENTO no Oracle Database
 */
public class InvestimentoSchemaFixer {

    private static final String URL = "jdbc:oracle:thin:@oracle.fiap.com.br:1521:orcl";
    private static final String USERNAME = "rm557347";
    private static final String PASSWORD = "311000";

    public static void main(String[] args) {
        System.out.println("🔧 [InvestimentoSchemaFixer] Criando tabela TB_INVESTIMENTO...");
        
        try {
            Class.forName("oracle.jdbc.OracleDriver");
            
            System.out.println("🌐 [InvestimentoSchemaFixer] Conectando ao Oracle Database FIAP...");
            try (Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD)) {
                System.out.println("✅ [InvestimentoSchemaFixer] Conectado com sucesso!");
                
                if (tableExists(conn, "TB_INVESTIMENTO")) {
                    System.out.println("ℹ️  [InvestimentoSchemaFixer] Tabela TB_INVESTIMENTO já existe");
                } else {
                    System.out.println("⚠️  [InvestimentoSchemaFixer] Tabela TB_INVESTIMENTO não encontrada. Criando...");
                    createInvestimentoTable(conn);
                }
                
                verifyTableStructure(conn);
                System.out.println("🎉 [InvestimentoSchemaFixer] Tabela TB_INVESTIMENTO criada com sucesso!");
                
            }
        } catch (Exception e) {
            System.err.println("❌ [InvestimentoSchemaFixer] Erro: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static boolean tableExists(Connection conn, String tableName) throws SQLException {
        String sql = "SELECT COUNT(*) FROM USER_TABLES WHERE TABLE_NAME = ?";
        try (var stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, tableName.toUpperCase());
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    private static void createInvestimentoTable(Connection conn) throws SQLException {
        conn.setAutoCommit(false);
        
        try (Statement stmt = conn.createStatement()) {
            // Criar sequence
            try {
                String seqSql = "CREATE SEQUENCE SEQ_INVESTIMENTO START WITH 1 INCREMENT BY 1 NOMAXVALUE NOCYCLE CACHE 20";
                stmt.executeUpdate(seqSql);
                System.out.println("✅ [InvestimentoSchemaFixer] Sequence SEQ_INVESTIMENTO criada");
            } catch (SQLException e) {
                if (e.getErrorCode() == 955) { // already exists
                    System.out.println("ℹ️  [InvestimentoSchemaFixer] Sequence SEQ_INVESTIMENTO já existe");
                } else {
                    throw e;
                }
            }
            
            // Criar tabela
            String tableSql = """
                CREATE TABLE TB_INVESTIMENTO (
                    ID_INVESTIMENTO NUMBER PRIMARY KEY,
                    ID_USUARIO NUMBER NOT NULL,
                    TIPO VARCHAR2(30) NOT NULL CHECK (
                        TIPO IN (
                            'CDB', 'TESOURO_DIRETO', 'TESOURO_SELIC', 'TESOURO_IPCA',
                            'LCI', 'LCA', 'POUPANCA', 'FUNDO_DI', 'FUNDO_RENDA_FIXA',
                            'FUNDO_MULTIMERCADO', 'ACAO', 'FII', 'ETF', 'CRIPTO'
                        )
                    ),
                    VALOR_INVESTIDO NUMBER(14, 2) NOT NULL CHECK (VALOR_INVESTIDO > 0),
                    DATA_APLICACAO DATE NOT NULL,
                    DATA_RESGATE DATE,
                    CONSTRAINT FK_INVESTIMENTO_USUARIO FOREIGN KEY (ID_USUARIO) REFERENCES TB_USUARIO(ID_USUARIO),
                    CONSTRAINT CK_DATA_RESGATE CHECK (DATA_RESGATE IS NULL OR DATA_RESGATE >= DATA_APLICACAO)
                )
                """;
            
            stmt.executeUpdate(tableSql);
            System.out.println("✅ [InvestimentoSchemaFixer] Tabela TB_INVESTIMENTO criada");
            
            // Criar índices
            String[] indices = {
                "CREATE INDEX IDX_INVESTIMENTO_USUARIO ON TB_INVESTIMENTO (ID_USUARIO)",
                "CREATE INDEX IDX_INVESTIMENTO_TIPO ON TB_INVESTIMENTO (TIPO)",
                "CREATE INDEX IDX_INVESTIMENTO_DATA_APLICACAO ON TB_INVESTIMENTO (DATA_APLICACAO)",
                "CREATE INDEX IDX_INVESTIMENTO_ATIVO ON TB_INVESTIMENTO (ID_USUARIO, DATA_RESGATE)"
            };
            
            for (String indexSql : indices) {
                try {
                    stmt.executeUpdate(indexSql);
                } catch (SQLException e) {
                    if (e.getErrorCode() != 955) { // ignore "already exists"
                        throw e;
                    }
                }
            }
            System.out.println("✅ [InvestimentoSchemaFixer] Índices criados");
            
            conn.commit();
            System.out.println("✅ [InvestimentoSchemaFixer] Alterações commitadas");
            
        } catch (SQLException e) {
            conn.rollback();
            throw e;
        } finally {
            conn.setAutoCommit(true);
        }
    }

    private static void verifyTableStructure(Connection conn) throws SQLException {
        System.out.println("🔍 [InvestimentoSchemaFixer] Estrutura da TB_INVESTIMENTO:");
        
        String sql = "SELECT COLUMN_NAME, DATA_TYPE, DATA_LENGTH, NULLABLE " +
                    "FROM USER_TAB_COLUMNS " +
                    "WHERE TABLE_NAME = 'TB_INVESTIMENTO' " +
                    "ORDER BY COLUMN_ID";
                    
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            System.out.println("┌─────────────────────┬─────────────┬────────┬──────────┐");
            System.out.println("│ COLUMN_NAME         │ DATA_TYPE   │ LENGTH │ NULLABLE │");
            System.out.println("├─────────────────────┼─────────────┼────────┼──────────┤");
            
            while (rs.next()) {
                System.out.printf("│ %-19s │ %-11s │ %-6s │ %-8s │%n", 
                    rs.getString("COLUMN_NAME"),
                    rs.getString("DATA_TYPE"),
                    rs.getString("DATA_LENGTH"),
                    rs.getString("NULLABLE"));
            }
            
            System.out.println("└─────────────────────┴─────────────┴────────┴──────────┘");
        }
    }
}
