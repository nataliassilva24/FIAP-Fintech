package com.fintech;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MetaFinanceira {

    private Long idMeta;             // NUMBER (PK)
    private Long idUsuario;          // NUMBER (FK)
    private String nome;             // VARCHAR2(100)
    private String descricao;        // VARCHAR2(255)
    private BigDecimal valorNecessario; // NUMBER
    private BigDecimal valorAcumulado;  // NUMBER
    private LocalDate dataLimite;       // DATE

    public MetaFinanceira() {}

    public MetaFinanceira(Long idMeta, Long idUsuario, String nome, String descricao,
                          BigDecimal valorNecessario, BigDecimal valorAcumulado, LocalDate dataLimite) {
        this.idMeta = idMeta;
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.descricao = descricao;
        this.valorNecessario = valorNecessario;
        this.valorAcumulado = valorAcumulado;
        this.dataLimite = dataLimite;
    }

    public void atualizarProgresso() {
        System.out.println("Atualizando progresso da meta '" + nome + "': " +
                valorAcumulado + "/" + valorNecessario);
    }

    public void verificarPrazo() {
        System.out.println("Verificando prazo da meta '" + nome + "' até " + dataLimite);
    }
}