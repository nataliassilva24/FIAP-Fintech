package com.fintech.dto;

import com.fintech.enums.TipoTransacao;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para transferência de dados de transações entre camadas
 * Implementa padrão DTO para desacoplar API das entidades internas
 */
public class TransacaoDTO {
    
    private Long idTransacao;
    
    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;
    
    @NotNull(message = "Tipo de transação é obrigatório")
    private TipoTransacao tipoTransacao;
    
    @NotBlank(message = "Categoria é obrigatória")
    @Size(max = 50, message = "Categoria deve ter no máximo 50 caracteres")
    private String categoria;
    
    @Size(max = 255, message = "Descrição deve ter no máximo 255 caracteres")
    private String descricao;
    
    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal valor;
    
    @NotNull(message = "Data é obrigatória")
    private LocalDate data;
    
    // Constructors
    public TransacaoDTO() {}
    
    public TransacaoDTO(Long idTransacao, Long idUsuario, TipoTransacao tipoTransacao,
                       String categoria, String descricao, BigDecimal valor, LocalDate data) {
        this.idTransacao = idTransacao;
        this.idUsuario = idUsuario;
        this.tipoTransacao = tipoTransacao;
        this.categoria = categoria;
        this.descricao = descricao;
        this.valor = valor;
        this.data = data;
    }
    
    // Getters and Setters
    public Long getIdTransacao() { return idTransacao; }
    public void setIdTransacao(Long idTransacao) { this.idTransacao = idTransacao; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public TipoTransacao getTipoTransacao() { return tipoTransacao; }
    public void setTipoTransacao(TipoTransacao tipoTransacao) { this.tipoTransacao = tipoTransacao; }
    
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    
    public BigDecimal getValor() { return valor; }
    public void setValor(BigDecimal valor) { this.valor = valor; }
    
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
}
