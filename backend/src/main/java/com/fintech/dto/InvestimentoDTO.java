package com.fintech.dto;

import com.fintech.enums.TipoInvestimento;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO para transferência de dados de investimentos entre camadas
 * Implementa padrão DTO para desacoplar API das entidades internas
 */
public class InvestimentoDTO {
    
    private Long idInvestimento;
    
    @NotNull(message = "ID do usuário é obrigatório")
    private Long idUsuario;
    
    @NotNull(message = "Tipo de investimento é obrigatório")
    private TipoInvestimento tipo;
    
    @NotNull(message = "Valor investido é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor investido deve ser maior que zero")
    @Digits(integer = 12, fraction = 2, message = "Valor deve ter no máximo 12 dígitos inteiros e 2 decimais")
    private BigDecimal valorInvestido;
    
    @NotNull(message = "Data de aplicação é obrigatória")
    @PastOrPresent(message = "Data de aplicação não pode ser futura")
    private LocalDate dataAplicacao;
    
    private LocalDate dataResgate;
    
    // Campos calculados
    private Boolean ativo;
    private Boolean resgatado;
    private Boolean rendaFixa;
    private Boolean rendaVariavel;
    
    // Constructors
    public InvestimentoDTO() {}
    
    public InvestimentoDTO(Long idInvestimento, Long idUsuario, TipoInvestimento tipo,
                          BigDecimal valorInvestido, LocalDate dataAplicacao, LocalDate dataResgate) {
        this.idInvestimento = idInvestimento;
        this.idUsuario = idUsuario;
        this.tipo = tipo;
        this.valorInvestido = valorInvestido;
        this.dataAplicacao = dataAplicacao;
        this.dataResgate = dataResgate;
    }
    
    // Getters and Setters
    public Long getIdInvestimento() { return idInvestimento; }
    public void setIdInvestimento(Long idInvestimento) { this.idInvestimento = idInvestimento; }
    
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public TipoInvestimento getTipo() { return tipo; }
    public void setTipo(TipoInvestimento tipo) { this.tipo = tipo; }
    
    public BigDecimal getValorInvestido() { return valorInvestido; }
    public void setValorInvestido(BigDecimal valorInvestido) { this.valorInvestido = valorInvestido; }
    
    public LocalDate getDataAplicacao() { return dataAplicacao; }
    public void setDataAplicacao(LocalDate dataAplicacao) { this.dataAplicacao = dataAplicacao; }
    
    public LocalDate getDataResgate() { return dataResgate; }
    public void setDataResgate(LocalDate dataResgate) { this.dataResgate = dataResgate; }
    
    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }
    
    public Boolean getResgatado() { return resgatado; }
    public void setResgatado(Boolean resgatado) { this.resgatado = resgatado; }
    
    public Boolean getRendaFixa() { return rendaFixa; }
    public void setRendaFixa(Boolean rendaFixa) { this.rendaFixa = rendaFixa; }
    
    public Boolean getRendaVariavel() { return rendaVariavel; }
    public void setRendaVariavel(Boolean rendaVariavel) { this.rendaVariavel = rendaVariavel; }
}
