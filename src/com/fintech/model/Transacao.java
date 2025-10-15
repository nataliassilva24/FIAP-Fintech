package com.fintech.model;

import com.fintech.enums.TipoTransacao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class Transacao {

    private Long idTransacao;       // NUMBER (PK)
    private Long idUsuario;         // NUMBER (FK -> usuario)
    private TipoTransacao tipoTransacao; // Enum ao invés de String
    private String categoria;       // VARCHAR2(50)  (ex: "ALIMENTACAO")
    private String descricao;       // VARCHAR2(255)
    private BigDecimal valor;       // NUMBER
    private LocalDate data;         // DATE

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

    public Transacao(Long idTransacao, Long idUsuario, String tipoTransacao, 
                     String categoria, String descricao, BigDecimal valor, LocalDate data) {
        this(idTransacao, idUsuario, TipoTransacao.fromString(tipoTransacao), 
             categoria, descricao, valor, data);
    }

    public void lancar() {
        System.out.println("Lançando transação [" + tipoTransacao + "] " + valor +
                " cat=" + categoria + " para usuário " + idUsuario + " em " + data);
    }

    public void estornar() {
        System.out.println("Estornando transação ID " + idTransacao);
    }

    public boolean isValid() {
        return idUsuario != null && 
               tipoTransacao != null && 
               categoria != null && !categoria.trim().isEmpty() &&
               valor != null && valor.compareTo(BigDecimal.ZERO) > 0 &&
               data != null;
    }

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

    public void setTipoTransacao(String tipoTransacao) {
        this.tipoTransacao = TipoTransacao.fromString(tipoTransacao);
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
