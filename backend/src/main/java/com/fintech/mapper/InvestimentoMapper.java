package com.fintech.mapper;

import com.fintech.dto.InvestimentoDTO;
import com.fintech.entity.Investimento;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversão entre Investimento (Entity) e InvestimentoDTO
 * Implementa padrão Mapper para isolamento entre camadas
 */
@Component
public class InvestimentoMapper {
    
    /**
     * Converte Entity para DTO
     */
    public InvestimentoDTO toDTO(Investimento investimento) {
        if (investimento == null) return null;
        
        InvestimentoDTO dto = new InvestimentoDTO();
        dto.setIdInvestimento(investimento.getIdInvestimento());
        dto.setIdUsuario(investimento.getIdUsuario());
        dto.setTipo(investimento.getTipo());
        dto.setValorInvestido(investimento.getValorInvestido());
        dto.setDataAplicacao(investimento.getDataAplicacao());
        dto.setDataResgate(investimento.getDataResgate());
        
        // Campos calculados
        dto.setAtivo(investimento.isAtivo());
        dto.setResgatado(investimento.isResgatado());
        dto.setRendaFixa(investimento.isRendaFixa());
        dto.setRendaVariavel(investimento.isRendaVariavel());
        
        return dto;
    }
    
    /**
     * Converte DTO para Entity
     */
    public Investimento toEntity(InvestimentoDTO dto) {
        if (dto == null) return null;
        
        return new Investimento(
            dto.getIdInvestimento(),
            dto.getIdUsuario(),
            dto.getTipo(),
            dto.getValorInvestido(),
            dto.getDataAplicacao(),
            dto.getDataResgate()
        );
    }
    
    /**
     * Atualiza Entity com dados do DTO
     */
    public void updateEntity(Investimento investimento, InvestimentoDTO dto) {
        if (investimento == null || dto == null) return;
        
        if (dto.getTipo() != null) {
            investimento.setTipo(dto.getTipo());
        }
        if (dto.getValorInvestido() != null) {
            investimento.setValorInvestido(dto.getValorInvestido());
        }
        if (dto.getDataAplicacao() != null) {
            investimento.setDataAplicacao(dto.getDataAplicacao());
        }
        if (dto.getDataResgate() != null) {
            investimento.setDataResgate(dto.getDataResgate());
        }
    }
}
