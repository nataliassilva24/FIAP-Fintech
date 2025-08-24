package com.fintech;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Transacao {

    private Long idTransacao;    // NUMBER (PK)
    private Long idUsuario;      // NUMBER (FK -> usuario)
    private String tipoTransacao;// VARCHAR2(10)  (ex: "CREDITO"/"DEBITO")
    private String categoria;    // VARCHAR2(50)  (ex: "ALIMENTACAO")
    private String descricao;    // VARCHAR2(255)
    private BigDecimal valor;    // NUMBER
    private LocalDate data;      // DATE

    public Transacao() {}

    public Transacao(Long idTransacao, Long idUsuario, String tipoTransacao, String categoria,
                     String descricao, BigDecimal valor, LocalDate data) {
        this.idTransacao = idTransacao;
        this.idUsuario = idUsuario;
        this.tipoTransacao = tipoTransacao;
        this.categoria = categoria;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
    }

    public void lançar() {
        System.out.println("Lançando transação [" + tipoTransacao + "] " + valor +
                " cat=" + categoria + " para usuário " + idUsuario + " em " + data);
    }

    public void estornar() {
        System.out.println("Estornando transação ID " + idTransacao);
    }
}