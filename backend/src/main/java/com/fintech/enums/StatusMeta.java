package com.fintech.enums;

public enum StatusMeta {
    ATIVA("Ativa"),
    PAUSADA("Pausada"),
    CONCLUIDA("Concluída"),
    VENCIDA("Vencida"),
    CANCELADA("Cancelada");
    
    private final String descricao;
    
    StatusMeta(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static StatusMeta fromString(String status) {
        if (status == null) return null;
        
        for (StatusMeta s : values()) {
            if (s.name().equalsIgnoreCase(status)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status de meta inválido: " + status);
    }
    
    public boolean isAtiva() {
        return this == ATIVA;
    }
    
    public boolean isFinalizada() {
        return this == CONCLUIDA || this == VENCIDA || this == CANCELADA;
    }
}