package com.fintech;

import java.math.BigDecimal;
import java.time.LocalDate;

public class Investimento {

    private Long idInvestimento;  // NUMBER (PK)
    private Long idUsuario;       // NUMBER (FK)
    private String tipo;          // VARCHAR2(50) (ex: "CDB", "TESOURO")
    private BigDecimal valorInvestido; // NUMBER
    private LocalDate dataAplicacao;   // DATE
    private LocalDate dataResgate;     // DATE

    public Investimento() {}

    public Investimento(Long idInvestimento, Long idUsuario, String tipo,
                        BigDecimal valorInvestido, LocalDate dataAplicacao, LocalDate dataResgate) {
        this.idInvestimento = idInvestimento;
        this.idUsuario = idUsuario;
        this.tipo = tipo;
        this.valorInvestido = valorInvestido;
        this.dataAplicacao = dataAplicacao;
        this.dataResgate = dataResgate;
    }

    public void aplicar() {
        System.out.println("Aplicando " + valorInvestido + " no investimento " + tipo +
                " para usuário " + idUsuario + " em " + dataAplicacao);
    }

    public void resgatar() {
        System.out.println("Resgatando investimento ID " + idInvestimento + " na data " + dataResgate);
    }
}