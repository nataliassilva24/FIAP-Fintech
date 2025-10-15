package com.fintech.enums;

public enum TipoInvestimento {
    CDB("Certificado de Depósito Bancário"),
    TESOURO_DIRETO("Tesouro Direto"),
    TESOURO_SELIC("Tesouro Selic"),
    TESOURO_IPCA("Tesouro IPCA"),
    LCI("Letra de Crédito Imobiliário"),
    LCA("Letra de Crédito do Agronegócio"),
    POUPANCA("Poupança"),
    FUNDO_DI("Fundo DI"),
    FUNDO_RENDA_FIXA("Fundo de Renda Fixa"),
    FUNDO_MULTIMERCADO("Fundo Multimercado"),
    ACAO("Ação"),
    FII("Fundo de Investimento Imobiliário"),
    ETF("Exchange Traded Fund"),
    CRIPTO("Criptomoeda");
    
    private final String descricao;
    
    TipoInvestimento(String descricao) {
        this.descricao = descricao;
    }
    
    public String getDescricao() {
        return descricao;
    }
    
    public static TipoInvestimento fromString(String tipo) {
        if (tipo == null) return null;
        
        for (TipoInvestimento t : values()) {
            if (t.name().equalsIgnoreCase(tipo)) {
                return t;
            }
        }
        throw new IllegalArgumentException("Tipo de investimento inválido: " + tipo);
    }
    
    public boolean isRendaFixa() {
        return this == CDB || this == TESOURO_DIRETO || this == TESOURO_SELIC || 
               this == TESOURO_IPCA || this == LCI || this == LCA || 
               this == POUPANCA || this == FUNDO_DI || this == FUNDO_RENDA_FIXA;
    }
    
    public boolean isRendaVariavel() {
        return this == ACAO || this == FII || this == ETF || 
               this == FUNDO_MULTIMERCADO || this == CRIPTO;
    }
}
