package com.fintech.mapper;

import com.fintech.dto.MetaFinanceiraDTO;
import com.fintech.entity.MetaFinanceira;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversão entre MetaFinanceira (Entity) e MetaFinanceiraDTO
 * Implementa padrão Mapper para isolamento entre camadas
 */
@Component
public class MetaFinanceiraMapper {
    
    /**
     * Converte Entity para DTO
     */
    public MetaFinanceiraDTO toDTO(MetaFinanceira meta) {
        if (meta == null) return null;
        
        MetaFinanceiraDTO dto = new MetaFinanceiraDTO();
        dto.setIdMeta(meta.getIdMeta());
        dto.setIdUsuario(meta.getIdUsuario());
        dto.setNome(meta.getNome());
        dto.setDescricao(meta.getDescricao());
        dto.setCategoria(meta.getCategoria());
        dto.setValorNecessario(meta.getValorNecessario());
        dto.setValorAcumulado(meta.getValorAcumulado());
        dto.setDataLimite(meta.getDataLimite());
        dto.setDataCriacao(meta.getDataCriacao());
        dto.setStatus(meta.getStatus());
        
        // Campos calculados
        dto.setPercentualAlcancado(meta.getPercentualAlcancado());
        dto.setValorRestante(meta.getValorRestante());
        dto.setDiasRestantes(meta.getDiasRestantes());
        dto.setVencida(meta.isVencida());
        dto.setConcluida(meta.isConcluida());
        
        return dto;
    }
    
    /**
     * Converte DTO para Entity
     */
    public MetaFinanceira toEntity(MetaFinanceiraDTO dto) {
        if (dto == null) return null;
        
        return new MetaFinanceira(
            dto.getIdMeta(),
            dto.getIdUsuario(),
            dto.getNome(),
            dto.getDescricao(),
            dto.getValorNecessario(),
            dto.getValorAcumulado(),
            dto.getDataLimite()
        );
    }
    
    /**
     * Atualiza Entity com dados do DTO
     */
    public void updateEntity(MetaFinanceira meta, MetaFinanceiraDTO dto) {
        if (meta == null || dto == null) return;
        
        if (dto.getNome() != null) {
            meta.setNome(dto.getNome());
        }
        if (dto.getDescricao() != null) {
            meta.setDescricao(dto.getDescricao());
        }
        if (dto.getCategoria() != null) {
            meta.setCategoria(dto.getCategoria());
        }
        if (dto.getValorNecessario() != null) {
            meta.setValorNecessario(dto.getValorNecessario());
        }
        if (dto.getValorAcumulado() != null) {
            meta.setValorAcumulado(dto.getValorAcumulado());
        }
        if (dto.getDataLimite() != null) {
            meta.setDataLimite(dto.getDataLimite());
        }
        if (dto.getStatus() != null) {
            meta.setStatus(dto.getStatus());
        }
    }
}
