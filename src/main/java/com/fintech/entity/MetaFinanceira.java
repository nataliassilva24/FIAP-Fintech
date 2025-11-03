package com.fintech.entity;

import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

@Entity
@Table(name = "TB_META_FINANCEIRA")
public class MetaFinanceira {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_meta")
    @SequenceGenerator(name = "seq_meta", sequenceName = "SEQ_META_FINANCEIRA", allocationSize = 1)
    @Column(name = "ID_META")
    private Long idMeta;

    @NotNull(message = "ID do usuário é obrigatório")
    @Column(name = "ID_USUARIO", nullable = false)
    private Long idUsuario;

    @NotBlank(message = "Nome da meta é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    @Column(name = "NOME", length = 100, nullable = false)
    private String nome;

    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    @Column(name = "DESCRICAO", length = 255)
    private String descricao;

    @NotNull(message = "Categoria é obrigatória")
    @Enumerated(EnumType.STRING)
    @Column(name = "CATEGORIA", length = 20, nullable = false)
    private CategoriaMeta categoria;

    @NotNull(message = "Valor necessário é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor necessário deve ser maior que zero")
    @Digits(integer = 12, fraction = 2, message = "Valor deve ter no máximo 12 dígitos inteiros e 2 decimais")
    @Column(name = "VALOR_NECESSARIO", precision = 14, scale = 2, nullable = false)
    private BigDecimal valorNecessario;

    @NotNull(message = "Valor acumulado é obrigatório")
    @DecimalMin(value = "0.00", message = "Valor acumulado não pode ser negativo")
    @Digits(integer = 12, fraction = 2, message = "Valor deve ter no máximo 12 dígitos inteiros e 2 decimais")
    @Column(name = "VALOR_ACUMULADO", precision = 14, scale = 2, nullable = false)
    private BigDecimal valorAcumulado;

    @Column(name = "DATA_LIMITE")
    private LocalDate dataLimite;

    @NotNull(message = "Data de criação é obrigatória")
    @Column(name = "DATA_CRIACAO", nullable = false)
    private LocalDate dataCriacao;

    @NotNull(message = "Status é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "STATUS", length = 15, nullable = false)
    private StatusMeta status;

    // Referência para o usuário
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_USUARIO", insertable = false, updatable = false)
    private Usuario usuario;

    public MetaFinanceira() {
        this.dataCriacao = LocalDate.now();
        this.status = StatusMeta.ATIVA;
        this.valorAcumulado = BigDecimal.ZERO;
        this.categoria = CategoriaMeta.OUTROS;
    }

    public MetaFinanceira(Long idMeta, Long idUsuario, String nome, String descricao,
                          BigDecimal valorNecessario, BigDecimal valorAcumulado, LocalDate dataLimite) {
        this();
        this.idMeta = idMeta;
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.descricao = descricao;
        this.valorNecessario = valorNecessario;
        this.valorAcumulado = valorAcumulado != null ? valorAcumulado : BigDecimal.ZERO;
        this.dataLimite = dataLimite;
    }

    @PrePersist
    protected void onCreate() {
        if (dataCriacao == null) {
            dataCriacao = LocalDate.now();
        }
        if (status == null) {
            status = StatusMeta.ATIVA;
        }
        if (valorAcumulado == null) {
            valorAcumulado = BigDecimal.ZERO;
        }
        if (categoria == null) {
            categoria = CategoriaMeta.OUTROS;
        }
    }

    public BigDecimal getPercentualAlcancado() {
        if (valorNecessario.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return valorAcumulado
                .multiply(new BigDecimal("100"))
                .divide(valorNecessario, 2, RoundingMode.HALF_UP);
    }

    public BigDecimal getValorRestante() {
        BigDecimal restante = valorNecessario.subtract(valorAcumulado);
        return restante.compareTo(BigDecimal.ZERO) > 0 ? restante : BigDecimal.ZERO;
    }

    public long getDiasRestantes() {
        if (dataLimite == null) {
            return Long.MAX_VALUE; // Meta sem prazo
        }
        
        long dias = ChronoUnit.DAYS.between(LocalDate.now(), dataLimite);
        return Math.max(0, dias);
    }

    public boolean isVencida() {
        return dataLimite != null && 
               LocalDate.now().isAfter(dataLimite) && 
               status != StatusMeta.CONCLUIDA;
    }

    public boolean isConcluida() {
        return status == StatusMeta.CONCLUIDA || 
               valorAcumulado.compareTo(valorNecessario) >= 0;
    }

    // Getters and Setters
    public Long getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Long idMeta) {
        this.idMeta = idMeta;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public CategoriaMeta getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaMeta categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getValorNecessario() {
        return valorNecessario;
    }

    public void setValorNecessario(BigDecimal valorNecessario) {
        this.valorNecessario = valorNecessario;
    }

    public BigDecimal getValorAcumulado() {
        return valorAcumulado;
    }

    public void setValorAcumulado(BigDecimal valorAcumulado) {
        this.valorAcumulado = valorAcumulado;
    }

    public LocalDate getDataLimite() {
        return dataLimite;
    }

    public void setDataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public StatusMeta getStatus() {
        return status;
    }

    public void setStatus(StatusMeta status) {
        this.status = status;
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
        MetaFinanceira that = (MetaFinanceira) o;
        return Objects.equals(idMeta, that.idMeta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idMeta);
    }

    @Override
    public String toString() {
        return "MetaFinanceira{" +
                "idMeta=" + idMeta +
                ", idUsuario=" + idUsuario +
                ", nome='" + nome + '\'' +
                ", categoria=" + categoria +
                ", valorNecessario=" + valorNecessario +
                ", valorAcumulado=" + valorAcumulado +
                ", percentual=" + getPercentualAlcancado() + "%" +
                ", dataLimite=" + dataLimite +
                ", status=" + status +
                '}';
    }
}