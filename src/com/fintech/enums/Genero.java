package com.fintech.enums;

public enum Genero {
    MASCULINO("Masculino", "M"),
    FEMININO("Feminino", "F"),
    NAO_BINARIO("Não-binário", "NB"),
    NAO_INFORMADO("Não informado", "NI"),
    OUTRO("Outro", "O");
    
    private final String descricao;
    private final String codigo;
    
    Genero(String descricao, String codigo) {
        this.descricao = descricao;
        this.codigo = codigo;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public static Genero fromString(String genero) {
        if (genero == null || genero.trim().isEmpty()) {
            return NAO_INFORMADO;
        }
        
        String upper = genero.trim().toUpperCase();
        
        for (Genero g : values()) {
            if (g.name().equals(upper)) {
                return g;
            }
        }
        
        for (Genero g : values()) {
            if (g.codigo.equalsIgnoreCase(genero.trim())) {
                return g;
            }
        }
        
        return switch (upper) {
            case "MASCULINO", "HOMEM", "MALE", "M" -> MASCULINO;
            case "FEMININO", "MULHER", "FEMALE", "F" -> FEMININO;
            case "NAO-BINARIO", "NAO_BINARIO", "NAOBINARIO", "NON-BINARY", "NONBINARY", "NB" -> NAO_BINARIO;
            case "NAO_INFORMADO", "NAO INFORMADO", "NAOINFORMADO", "NOT_INFORMED", "NI", "" -> NAO_INFORMADO;
            default -> OUTRO;
        };
    }
    
    public boolean isBinario() {
        return this == MASCULINO || this == FEMININO;
    }
    
    public boolean isInformado() {
        return this != NAO_INFORMADO;
    }
    
    @Override
    public String toString() {
        return descricao;
    }
}
