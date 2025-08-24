package com.fintech;

public class ConfigUsuario {

    private Long idUsuario;        // NUMBER (PK/FK)
    private String moedaPadrao;    // VARCHAR2(5)  ex: "BRL"
    private char notificacoesAtivas; // CHAR(1)    'S' ou 'N'
    private char temaEscuro;         // CHAR(1)    'S' ou 'N'

    public ConfigUsuario() {}

    public ConfigUsuario(Long idUsuario, String moedaPadrao, char notificacoesAtivas, char temaEscuro) {
        this.idUsuario = idUsuario;
        this.moedaPadrao = moedaPadrao;
        this.notificacoesAtivas = notificacoesAtivas;
        this.temaEscuro = temaEscuro;
    }

    public void aplicarPreferencias() {
        System.out.println("Aplicando config do usuário " + idUsuario +
                " | moeda=" + moedaPadrao +
                " | notifs=" + notificacoesAtivas +
                " | temaEscuro=" + temaEscuro);
    }
}