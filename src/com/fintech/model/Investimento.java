package com.fintech.model;

import com.fintech.enums.TipoInvestimento;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class Investimento {

    private Long idInvestimento;      // NUMBER (PK)
    private Long idUsuario;           // NUMBER (FK)
    private TipoInvestimento tipo;    // Enum ao invés de String
    private BigDecimal valorInvestido; // NUMBER
    private LocalDate dataAplicacao;   // DATE
    private LocalDate dataResgate;     // DATE

    public Investimento() {}

    public Investimento(Long idInvestimento, Long idUsuario, TipoInvestimento tipo,
                        BigDecimal valorInvestido, LocalDate dataAplicacao, LocalDate dataResgate) {
        this.idInvestimento = idInvestimento;
        this.idUsuario = idUsuario;
        this.tipo = tipo;
        this.valorInvestido = valorInvestido;
        this.dataAplicacao = dataAplicacao;
        this.dataResgate = dataResgate;
    }

    public Investimento(Long idInvestimento, Long idUsuario, String tipo,
                        BigDecimal valorInvestido, LocalDate dataAplicacao, LocalDate dataResgate) {
        this(idInvestimento, idUsuario, TipoInvestimento.fromString(tipo),
             valorInvestido, dataAplicacao, dataResgate);
    }

    public void aplicar() {
        System.out.println("Aplicando " + valorInvestido + " no investimento " + tipo.getDescricao() +
                " para usuário " + idUsuario + " em " + dataAplicacao);
    }

    public void resgatar() {
        System.out.println("Resgatando investimento ID " + idInvestimento + " na data " + dataResgate);
    }

    public long getDiasInvestido() {
        if (dataAplicacao == null) return 0;
        LocalDate dataFim = dataResgate != null ? dataResgate : LocalDate.now();
        return java.time.temporal.ChronoUnit.DAYS.between(dataAplicacao, dataFim);
    }

    public boolean isResgatado() {
        return dataResgate != null && dataResgate.isBefore(LocalDate.now());
    }

    public boolean isAtivo() {
        return dataAplicacao != null && !isResgatado();
    }

    public boolean isValid() {
        return idUsuario != null && 
               tipo != null && 
               valorInvestido != null && valorInvestido.compareTo(BigDecimal.ZERO) > 0 &&
               dataAplicacao != null &&
               (dataResgate == null || dataResgate.isAfter(dataAplicacao));
    }

    public Long getIdInvestimento() {
        return idInvestimento;
    }

    public void setIdInvestimento(Long idInvestimento) {
        this.idInvestimento = idInvestimento;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public TipoInvestimento getTipo() {
        return tipo;
    }

    public void setTipo(TipoInvestimento tipo) {
        this.tipo = tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = TipoInvestimento.fromString(tipo);
    }

    public BigDecimal getValorInvestido() {
        return valorInvestido;
    }

    public void setValorInvestido(BigDecimal valorInvestido) {
        this.valorInvestido = valorInvestido;
    }

    public LocalDate getDataAplicacao() {
        return dataAplicacao;
    }

    public void setDataAplicacao(LocalDate dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
    }

    public LocalDate getDataResgate() {
        return dataResgate;
    }

    public void setDataResgate(LocalDate dataResgate) {
        this.dataResgate = dataResgate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Investimento that = (Investimento) o;
        return Objects.equals(idInvestimento, that.idInvestimento);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idInvestimento);
    }

    @Override
    public String toString() {
        return "Investimento{" +
                "idInvestimento=" + idInvestimento +
                ", idUsuario=" + idUsuario +
                ", tipo=" + tipo +
                ", valorInvestido=" + valorInvestido +
                ", dataAplicacao=" + dataAplicacao +
                ", dataResgate=" + dataResgate +
                '}';
    }
}
