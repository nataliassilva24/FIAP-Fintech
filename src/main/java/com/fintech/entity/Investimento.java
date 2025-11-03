package com.fintech.entity;

import com.fintech.enums.TipoInvestimento;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "TB_INVESTIMENTO")
public class Investimento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_investimento")
    @SequenceGenerator(name = "seq_investimento", sequenceName = "SEQ_INVESTIMENTO", allocationSize = 1)
    @Column(name = "ID_INVESTIMENTO")
    private Long idInvestimento;

    @NotNull(message = "ID do usuário é obrigatório")
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;

    @NotNull(message = "Tipo de investimento é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO", length = 30, nullable = false)
    private TipoInvestimento tipo;

    @NotNull(message = "Valor investido é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor investido deve ser maior que zero")
    @Digits(integer = 12, fraction = 2, message = "Valor deve ter no máximo 12 dígitos inteiros e 2 decimais")
    @Column(name = "VALOR_INVESTIDO", precision = 14, scale = 2, nullable = false)
    private BigDecimal valorInvestido;

    @NotNull(message = "Data de aplicação é obrigatória")
    @PastOrPresent(message = "Data de aplicação não pode ser futura")
    @Column(name = "DATA_APLICACAO", nullable = false)
    private LocalDate dataAplicacao;

    @Column(name = "DATA_RESGATE")
    private LocalDate dataResgate;

    // Referência para o usuário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", insertable = false, updatable = false)
    private Usuario usuario;

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

    @PrePersist
    protected void onCreate() {
        if (dataAplicacao == null) {
            dataAplicacao = LocalDate.now();
        }
    }

    public boolean isResgatado() {
        return dataResgate != null && !dataResgate.isAfter(LocalDate.now());
    }

    public boolean isAtivo() {
        return dataAplicacao != null && !isResgatado();
    }

    public boolean isRendaFixa() {
        return tipo != null && tipo.isRendaFixa();
    }

    public boolean isRendaVariavel() {
        return tipo != null && tipo.isRendaVariavel();
    }

    // Getters and Setters
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

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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
                ", ativo=" + isAtivo() +
                '}';
    }
}