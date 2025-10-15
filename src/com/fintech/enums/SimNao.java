package com.fintech.enums;

public enum SimNao {
    SIM('S', "Sim", true),
    NAO('N', "Não", false);
    
    private final char codigo;
    private final String descricao;
    private final boolean valor;
    
    SimNao(char codigo, String descricao, boolean valor) {
        this.codigo = codigo;
        this.descricao = descricao;
        this.valor = valor;
    }
    
    public char getCodigo() {
        return codigo;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public boolean getValor() {
        return valor;
    }
    
    public static SimNao fromChar(char c) {
        for (SimNao sn : values()) {
            if (sn.codigo == Character.toUpperCase(c)) {
                return sn;
            }
        }
        throw new IllegalArgumentException("Valor inválido para SimNao: " + c);
    }
    
    public static SimNao fromBoolean(boolean valor) {
        return valor ? SIM : NAO;
    }
    
    public static SimNao fromString(String str) {
        if (str == null || str.trim().isEmpty()) {
            return NAO;
        }
        
        String upper = str.trim().toUpperCase();
        return switch (upper) {
            case "S", "SIM", "TRUE", "1", "Y", "YES" -> SIM;
            case "N", "NAO", "NÃO", "FALSE", "0", "NO" -> NAO;
            default -> throw new IllegalArgumentException("Valor inválido para SimNao: " + str);
        };
    }
    
    @Override
    public String toString() {
        return descricao;
    }
}
