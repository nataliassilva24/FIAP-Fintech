package com.fintech.dto;

import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para transferência de dados de metas financeiras entre camadas
 * Implementa padrão DTO para desacoplar API das entidades internas
 */
public class MetaFinanceiraDTO {
    
    private Long idMeta;
    
    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;
    
    @NotBlank(message = "Nome da meta é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String nome;
    
    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    private String descricao;
    
    @NotNull(message = "Categoria é obrigatória")
    private CategoriaMeta categoria;
    
    @NotNull(message = "Valor necessário é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor necessário deve ser maior que zero")
    @Digits(integer = 12, fraction = 2, message = "Valor deve ter no máximo 12 dígitos inteiros e 2 decimais")
    private BigDecimal valorNecessario;
    
    @NotNull(message = "Valor acumulado é obrigatório")
    @DecimalMin(value = "0.00", message = "Valor acumulado não pode ser negativo")
    @Digits(integer = 12, fraction = 2, message = "Valor deve ter no máximo 12 dígitos inteiros e 2 decimais")
    private BigDecimal valorAcumulado;
    
    private LocalDate dataLimite;
    private LocalDate dataCriacao;
    private StatusMeta status;
    
    // Campos calculados
    private BigDecimal percentualAlcancado;
    private BigDecimal valorRestante;
    private Long diasRestantes;
    private Boolean vencida;
    private Boolean concluida;
    
    // Constructors
    public MetaFinanceiraDTO() {}
    
    public MetaFinanceiraDTO(Long idMeta, Long idUsuario, String nome, String descricao,
                            CategoriaMeta categoria, BigDecimal valorNecessario, 
                            BigDecimal valorAcumulado, LocalDate dataLimite) {
        this.idMeta = idMeta;
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.descricao = descricao;
        this.categoria = categoria;
        this.valorNecessario = valorNecessario;
        this.valorAcumulado = valorAcumulado;
        this.dataLimite = dataLimite;
    }
    
    // Getters and Setters
    public Long getIdMeta() { return idMeta; }
    public void setIdMeta(Long idMeta) { this.idMeta = idMeta; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public CategoriaMeta getCategoria() { return categoria; }
    public void setCategoria(CategoriaMeta categoria) { this.categoria = categoria; }
    
    public BigDecimal getValorNecessario() { return valorNecessario; }
    public void setValorNecessario(BigDecimal valorNecessario) { this.valorNecessario = valorNecessario; }
    
    public BigDecimal getValorAcumulado() { return valorAcumulado; }
    public void setValorAcumulado(BigDecimal valorAcumulado) { this.valorAcumulado = valorAcumulado; }
    
    public LocalDate getDataLimite() { return dataLimite; }
    public void setDataLimite(LocalDate dataLimite) { this.dataLimite = dataLimite; }
    
    public LocalDate getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDate dataCriacao) { this.dataCriacao = dataCriacao; }
    
    public StatusMeta getStatus() { return status; }
    public void setStatus(StatusMeta status) { this.status = status; }
    
    public BigDecimal getPercentualAlcancado() { return percentualAlcancado; }
    public void setPercentualAlcancado(BigDecimal percentualAlcancado) { this.percentualAlcancado = percentualAlcancado; }
    
    public BigDecimal getValorRestante() { return valorRestante; }
    public void setValorRestante(BigDecimal valorRestante) { this.valorRestante = valorRestante; }
    
    public Long getDiasRestantes() { return diasRestantes; }
    public void setDiasRestantes(Long diasRestantes) { this.diasRestantes = diasRestantes; }
    
    public Boolean getVencida() { return vencida; }
    public void setVencida(Boolean vencida) { this.vencida = vencida; }
    
    public Boolean getConcluida() { return concluida; }
    public void setConcluida(Boolean concluida) { this.concluida = concluida; }
}
