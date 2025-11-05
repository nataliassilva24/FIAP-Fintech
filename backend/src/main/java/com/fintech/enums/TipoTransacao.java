package com.fintech.enums;

public enum TipoTransacao {
    CREDITO("Crédito"),
    DEBITO("Débito"),
    TRANSFERENCIA("Transferência");
    
    private final String descricao;
    
    TipoTransacao(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static TipoTransacao fromString(String tipo) {
        if (tipo == null) return null;
        
        for (TipoTransacao t : values()) {
            if (t.name().equalsIgnoreCase(tipo)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo de transação inválido: " + tipo);
    }
}