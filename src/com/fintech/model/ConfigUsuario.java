package com.fintech.model;

import com.fintech.enums.Moeda;
import com.fintech.enums.SimNao;

import java.time.LocalDateTime;
import java.util.Objects;

public class ConfigUsuario {

    private Long idUsuario;                 // NUMBER (PK/FK)
    private Moeda moedaPadrao;              // Enum ao invés de String
    private SimNao notificacoesAtivas;      // Enum ao invés de char
    private SimNao temaEscuro;              // Enum ao invés de char
    private SimNao notificacaoEmail;        // Notificações por email
    private SimNao notificacaoPush;         // Notificações push
    private String idioma;                  // VARCHAR2(5) - ex: "pt_BR"
    private String formatoData;             // VARCHAR2(10) - ex: "dd/MM/yyyy"
    private String fusoHorario;             // VARCHAR2(50) - ex: "America/Sao_Paulo"
    private LocalDateTime ultimaAtualizacao; // TIMESTAMP

    public ConfigUsuario() {
        this.moedaPadrao = Moeda.BRL;
        this.notificacoesAtivas = SimNao.SIM;
        this.temaEscuro = SimNao.NAO;
        this.notificacaoEmail = SimNao.SIM;
        this.notificacaoPush = SimNao.SIM;
        this.idioma = "pt_BR";
        this.formatoData = "dd/MM/yyyy";
        this.fusoHorario = "America/Sao_Paulo";
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public ConfigUsuario(Long idUsuario, Moeda moedaPadrao, SimNao notificacoesAtivas, SimNao temaEscuro) {
        this();
        this.idUsuario = idUsuario;
        this.moedaPadrao = moedaPadrao != null ? moedaPadrao : Moeda.BRL;
        this.notificacoesAtivas = notificacoesAtivas != null ? notificacoesAtivas : SimNao.SIM;
        this.temaEscuro = temaEscuro != null ? temaEscuro : SimNao.NAO;
    }

    public ConfigUsuario(Long idUsuario, String moedaPadrao, char notificacoesAtivas, char temaEscuro) {
        this(idUsuario, Moeda.fromCodigo(moedaPadrao), 
             SimNao.fromChar(notificacoesAtivas), SimNao.fromChar(temaEscuro));
    }

    public void aplicarPreferencias() {
        System.out.println("Aplicando configurações do usuário " + idUsuario + ":");
        System.out.println("  • Moeda: " + moedaPadrao.getNome() + " (" + moedaPadrao.getSimbolo() + ")");
        System.out.println("  • Notificações: " + notificacoesAtivas.getDescricao());
        System.out.println("  • Tema escuro: " + temaEscuro.getDescricao());
        System.out.println("  • Idioma: " + idioma);
        System.out.println("  • Formato data: " + formatoData);
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public void aplicarConfiguracaoRegional(String pais) {
        switch (pais.toUpperCase()) {
            case "BR", "BRASIL" -> {
                this.moedaPadrao = Moeda.BRL;
                this.idioma = "pt_BR";
                this.formatoData = "dd/MM/yyyy";
                this.fusoHorario = "America/Sao_Paulo";
            }
            case "US", "USA", "ESTADOS UNIDOS" -> {
                this.moedaPadrao = Moeda.USD;
                this.idioma = "en_US";
                this.formatoData = "MM/dd/yyyy";
                this.fusoHorario = "America/New_York";
            }
            case "PT", "PORTUGAL" -> {
                this.moedaPadrao = Moeda.EUR;
                this.idioma = "pt_PT";
                this.formatoData = "dd/MM/yyyy";
                this.fusoHorario = "Europe/Lisbon";
            }
            case "AR", "ARGENTINA" -> {
                this.moedaPadrao = Moeda.ARS;
                this.idioma = "es_AR";
                this.formatoData = "dd/MM/yyyy";
                this.fusoHorario = "America/Argentina/Buenos_Aires";
            }
        }
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public void configurarNotificacoes(boolean ativar) {
        SimNao valor = SimNao.fromBoolean(ativar);
        this.notificacoesAtivas = valor;
        this.notificacaoEmail = valor;
        this.notificacaoPush = valor;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public boolean temNotificacoesAtivas() {
        return notificacoesAtivas.getValor() || 
               notificacaoEmail.getValor() || 
               notificacaoPush.getValor();
    }

    public String formatarValor(java.math.BigDecimal valor) {
        return moedaPadrao.formatarValor(valor);
    }

    public String formatarData(java.time.LocalDate data) {
        if (data == null) return "";
        
        try {
            java.time.format.DateTimeFormatter formatter = 
                java.time.format.DateTimeFormatter.ofPattern(formatoData);
            return data.format(formatter);
        } catch (Exception e) {
            return data.format(java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        }
    }

    public boolean foiAtualizadaRecentemente(int horas) {
        if (ultimaAtualizacao == null) return false;
        
        LocalDateTime limite = LocalDateTime.now().minusHours(horas);
        return ultimaAtualizacao.isAfter(limite);
    }

    public boolean isValid() {
        return idUsuario != null && 
               moedaPadrao != null && 
               notificacoesAtivas != null && 
               temaEscuro != null &&
               notificacaoEmail != null &&
               notificacaoPush != null &&
               idioma != null && !idioma.trim().isEmpty() &&
               formatoData != null && !formatoData.trim().isEmpty();
    }

    public String toJson() {
        return String.format("""
            {
                "idUsuario": %d,
                "moedaPadrao": "%s",
                "notificacoesAtivas": %s,
                "temaEscuro": %s,
                "notificacaoEmail": %s,
                "notificacaoPush": %s,
                "idioma": "%s",
                "formatoData": "%s",
                "fusoHorario": "%s",
                "ultimaAtualizacao": "%s"
            }""", 
            idUsuario, 
            moedaPadrao.getCodigo(),
            notificacoesAtivas.getValor(),
            temaEscuro.getValor(),
            notificacaoEmail.getValor(),
            notificacaoPush.getValor(),
            idioma,
            formatoData,
            fusoHorario,
            ultimaAtualizacao != null ? ultimaAtualizacao.toString() : "null"
        );
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Moeda getMoedaPadrao() {
        return moedaPadrao;
    }

    public void setMoedaPadrao(Moeda moedaPadrao) {
        this.moedaPadrao = moedaPadrao;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public void setMoedaPadrao(String moedaPadrao) {
        this.moedaPadrao = Moeda.fromCodigo(moedaPadrao);
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public SimNao getNotificacoesAtivas() {
        return notificacoesAtivas;
    }

    public void setNotificacoesAtivas(SimNao notificacoesAtivas) {
        this.notificacoesAtivas = notificacoesAtivas;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public void setNotificacoesAtivas(char notificacoesAtivas) {
        this.notificacoesAtivas = SimNao.fromChar(notificacoesAtivas);
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public SimNao getTemaEscuro() {
        return temaEscuro;
    }

    public void setTemaEscuro(SimNao temaEscuro) {
        this.temaEscuro = temaEscuro;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public void setTemaEscuro(char temaEscuro) {
        this.temaEscuro = SimNao.fromChar(temaEscuro);
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public SimNao getNotificacaoEmail() {
        return notificacaoEmail;
    }

    public void setNotificacaoEmail(SimNao notificacaoEmail) {
        this.notificacaoEmail = notificacaoEmail;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public SimNao getNotificacaoPush() {
        return notificacaoPush;
    }

    public void setNotificacaoPush(SimNao notificacaoPush) {
        this.notificacaoPush = notificacaoPush;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public String getIdioma() {
        return idioma;
    }

    public void setIdioma(String idioma) {
        this.idioma = idioma;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public String getFormatoData() {
        return formatoData;
    }

    public void setFormatoData(String formatoData) {
        this.formatoData = formatoData;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public String getFusoHorario() {
        return fusoHorario;
    }

    public void setFusoHorario(String fusoHorario) {
        this.fusoHorario = fusoHorario;
        this.ultimaAtualizacao = LocalDateTime.now();
    }

    public LocalDateTime getUltimaAtualizacao() {
        return ultimaAtualizacao;
    }

    public void setUltimaAtualizacao(LocalDateTime ultimaAtualizacao) {
        this.ultimaAtualizacao = ultimaAtualizacao;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ConfigUsuario that = (ConfigUsuario) o;
        return Objects.equals(idUsuario, that.idUsuario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario);
    }

    @Override
    public String toString() {
        return "ConfigUsuario{" +
                "idUsuario=" + idUsuario +
                ", moedaPadrao=" + moedaPadrao +
                ", notificacoesAtivas=" + notificacoesAtivas +
                ", temaEscuro=" + temaEscuro +
                ", idioma='" + idioma + '\'' +
                ", ultimaAtualizacao=" + ultimaAtualizacao +
                '}';
    }
}
