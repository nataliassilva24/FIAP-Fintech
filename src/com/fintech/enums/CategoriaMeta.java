package com.fintech.enums;

public enum CategoriaMeta {
    VIAGEM("Viagem"),
    CASA("Casa"),
    CARRO("Carro"),
    EDUCACAO("Educação"),
    SAUDE("Saúde"),
    EMERGENCIA("Emergência"),
    APOSENTADORIA("Aposentadoria"),
    INVESTIMENTO("Investimento"),
    CASAMENTO("Casamento"),
    FESTA("Festa/Evento"),
    ELETRONICOS("Eletrônicos"),
    REFORMA("Reforma"),
    DIVIDA("Quitação de Dívida"),
    NEGOCIO("Negócio Próprio"),
    RESERVA("Reserva Financeira"),
    LAZER("Lazer"),
    OUTROS("Outros");
    
    private final String descricao;
    
    CategoriaMeta(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static CategoriaMeta fromString(String categoria) {
        if (categoria == null) return OUTROS;
        
        for (CategoriaMeta c : values()) {
            if (c.name().equalsIgnoreCase(categoria)) {
                return c;
            }
        }
        return OUTROS; // Retorna OUTROS ao invés de exception para ser mais flexível
    }
    
    public boolean isLongoPrazo() {
        return this == CASA || this == APOSENTADORIA || this == EDUCACAO || 
               this == NEGOCIO || this == RESERVA;
    }
    
    public boolean isEmergencia() {
        return this == EMERGENCIA || this == SAUDE || this == RESERVA;
    }
}
