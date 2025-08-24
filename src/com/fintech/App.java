package com.fintech;

import java.math.BigDecimal;
import java.time.LocalDate;

public class App {
    public static void main(String[] args) {
        System.out.println("== Fintech App ==");

        Usuario u = new Usuario(1L, "Maria Silva", "maria@fintech.com", "12345",
                LocalDate.of(1995, 5, 20), "FEMININO");
        u.registrar();
        u.autenticar();

        ConfigUsuario cfg = new ConfigUsuario(1L, "BRL", 'S', 'N');
        cfg.aplicarPreferencias();

        // === Transações ===
        Transacao t1 = new Transacao(100L, 1L, "CREDITO", "SALARIO",
                "Recebimento mensal", new BigDecimal("3500.00"), LocalDate.now());
        t1.lançar();

        Transacao t2 = new Transacao(101L, 1L, "DEBITO", "MERCADO",
                "Compras no supermercado", new BigDecimal("320.75"), LocalDate.now());
        t2.lançar();

        Transacao t3 = new Transacao(102L, 1L, "DEBITO", "ALIMENTAÇÃO",
                "Almoço no restaurante", new BigDecimal("58.90"), LocalDate.now().minusDays(1));
        t3.lançar();

        Transacao t4 = new Transacao(103L, 1L, "DEBITO", "TRANSPORTE",
                "Uber para reunião", new BigDecimal("22.50"), LocalDate.now().minusDays(2));
        t4.lançar();

        Transacao t5 = new Transacao(104L, 1L, "DEBITO", "ENTRETENIMENTO",
                "Assinatura Netflix", new BigDecimal("55.90"), LocalDate.now().minusDays(3));
        t5.lançar();

        Transacao t6 = new Transacao(105L, 1L, "TRANSFERENCIA", "PIX",
                "PIX para João", new BigDecimal("150.00"), LocalDate.now().minusDays(4));
        t6.lançar();

        Transacao t7 = new Transacao(106L, 1L, "TRANSFERENCIA", "PIX",
                "Recebimento PIX de Ana", new BigDecimal("200.00"), LocalDate.now().minusDays(5));
        t7.lançar();

        Transacao t8 = new Transacao(107L, 1L, "DEBITO", "SAÚDE",
                "Consulta médica", new BigDecimal("180.00"), LocalDate.now().minusDays(6));
        t8.lançar();

        // === Investimento ===
        Investimento inv = new Investimento(200L, 1L, "CDB",
                new BigDecimal("1000.00"), LocalDate.now(), LocalDate.now().plusMonths(6));
        inv.aplicar();

        // === Meta Financeira ===
        MetaFinanceira meta = new MetaFinanceira(300L, 1L, "Viagem",
                "Férias de fim de ano", new BigDecimal("8000.00"),
                new BigDecimal("1500.00"), LocalDate.now().plusMonths(8));
        meta.atualizarProgresso();
        meta.verificarPrazo();
    }
}