package com.fintech.enums;

public enum Moeda {
    BRL("BRL", "Real Brasileiro", "R$", "Brasil"),
    USD("USD", "Dólar Americano", "US$", "Estados Unidos"),
    EUR("EUR", "Euro", "€", "União Europeia"),
    GBP("GBP", "Libra Esterlina", "£", "Reino Unido"),
    JPY("JPY", "Iene Japonês", "¥", "Japão"),
    CAD("CAD", "Dólar Canadense", "C$", "Canadá"),
    AUD("AUD", "Dólar Australiano", "A$", "Austrália"),
    CHF("CHF", "Franco Suíço", "CHF", "Suíça"),
    CNY("CNY", "Yuan Chinês", "¥", "China"),
    ARS("ARS", "Peso Argentino", "$", "Argentina"),
    CLP("CLP", "Peso Chileno", "$", "Chile"),
    MXN("MXN", "Peso Mexicano", "$", "México"),
    COP("COP", "Peso Colombiano", "$", "Colômbia"),
    PEN("PEN", "Sol Peruano", "S/", "Peru"),
    UYU("UYU", "Peso Uruguaio", "$U", "Uruguai");
    
    private final String codigo;
    private final String nome;
    private final String simbolo;
    private final String pais;
    
    Moeda(String codigo, String nome, String simbolo, String pais) {
        this.codigo = codigo;
        this.nome = nome;
        this.simbolo = simbolo;
        this.pais = pais;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public String getNome() {
        return nome;
    }
    
    public String getSimbolo() {
        return simbolo;
    }
    
    public String getPais() {
        return pais;
    }
    
    public static Moeda fromCodigo(String codigo) {
        if (codigo == null) return BRL; // Padrão brasileiro
        
        for (Moeda m : values()) {
            if (m.codigo.equalsIgnoreCase(codigo.trim())) {
                return m;
            }
        }
        
        String codigoLimpo = codigo.trim().toUpperCase();
        if (codigoLimpo.length() >= 3) {
            String primeiraParte = codigoLimpo.substring(0, 3);
            for (Moeda m : values()) {
                if (m.codigo.equals(primeiraParte)) {
                    return m;
                }
            }
        }
        
        return BRL; // Retorna BRL como padrão ao invés de exception
    }
    
    public boolean isSulAmericana() {
        return this == BRL || this == ARS || this == CLP || 
               this == COP || this == PEN || this == UYU;
    }
    
    public boolean isPrincipal() {
        return this == USD || this == EUR || this == GBP || 
               this == JPY || this == CAD || this == CHF;
    }
    
    public String formatarValor(java.math.BigDecimal valor) {
        if (valor == null) return simbolo + " 0,00";
        
        java.text.NumberFormat formatter = java.text.NumberFormat.getCurrencyInstance(
            this == BRL ? new java.util.Locale("pt", "BR") : 
            this == USD ? java.util.Locale.US :
            this == EUR ? java.util.Locale.GERMANY :
            java.util.Locale.US
        );
        
        try {
            String formatado = formatter.format(valor);
            if (this == BRL) {
                return formatado; // NumberFormat já usa R$ para pt_BR
            }
            return simbolo + " " + formatado.replaceAll("[^\\d.,\\s-]", "").trim();
        } catch (Exception e) {
            return simbolo + " " + String.format("%.2f", valor);
        }
    }
    
    @Override
    public String toString() {
        return codigo + " - " + nome;
    }
}
