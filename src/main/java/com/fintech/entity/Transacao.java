package com.fintech.entity;

import com.fintech.enums.TipoTransacao;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "TB_TRANSACAO")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_transacao")
    @SequenceGenerator(name = "seq_transacao", sequenceName = "SEQ_TRANSACAO", allocationSize = 1)
    @Column(name = "ID_TRANSACAO")
    private Long idTransacao;

    @NotNull(message = "ID do usuário é obrigatório")
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;

    @NotNull(message = "Tipo de transação é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "TIPO_TRANSACAO", length = 20, nullable = false)
    private TipoTransacao tipoTransacao;

    @NotBlank(message = "Categoria é obrigatória")
    @Size(max = 50, message = "Categoria deve ter no máximo 50 caracteres")
    @Column(name = "CATEGORIA", length = 50, nullable = false)
    private String categoria;

    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    @Column(name = "DESCRICAO", length = 255)
    private String descricao;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Digits(integer = 10, fraction = 2, message = "Valor deve ter no máximo 10 dígitos inteiros e 2 decimais")
    @Column(name = "VALOR", precision = 12, scale = 2, nullable = false)
    private BigDecimal valor;

    @NotNull(message = "Data é obrigatória")
    @Column(name = "DATA_TRANSACAO", nullable = false)
    private LocalDate data;

    // Referência para o usuário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", insertable = false, updatable = false)
    private Usuario usuario;

    public Transacao() {}

    public Transacao(Long idTransacao, Long idUsuario, TipoTransacao tipoTransacao, 
                     String categoria, String descricao, BigDecimal valor, LocalDate data) {
        this.idTransacao = idTransacao;
        this.idUsuario = idUsuario;
        this.tipoTransacao = tipoTransacao;
        this.categoria = categoria;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
    }

    @PrePersist
    @PreUpdate
    protected void onSave() {
        if (data == null) {
            data = LocalDate.now();
        }
    }

    public boolean isReceita() {
        return tipoTransacao == TipoTransacao.CREDITO;
    }

    public boolean isDespesa() {
        return tipoTransacao == TipoTransacao.DEBITO;
    }

    public boolean isTransferencia() {
        return tipoTransacao == TipoTransacao.TRANSFERENCIA;
    }

    // Getters and Setters
    public Long getIdTransacao() {
        return idTransacao;
    }

    public void setIdTransacao(Long idTransacao) {
        this.idTransacao = idTransacao;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public TipoTransacao getTipoTransacao() {
        return tipoTransacao;
    }

    public void setTipoTransacao(TipoTransacao tipoTransacao) {
        this.tipoTransacao = tipoTransacao;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
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
        Transacao transacao = (Transacao) o;
        return Objects.equals(idTransacao, transacao.idTransacao);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idTransacao);
    }

    @Override
    public String toString() {
        return "Transacao{" +
                "idTransacao=" + idTransacao +
                ", idUsuario=" + idUsuario +
                ", tipoTransacao=" + tipoTransacao +
                ", categoria='" + categoria + '\'' +
                ", descricao='" + descricao + '\'' +
                ", valor=" + valor +
                ", data=" + data +
                '}';
    }
}