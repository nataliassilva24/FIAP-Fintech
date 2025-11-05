package com.fintech.mapper;

import com.fintech.dto.TransacaoDTO;
import com.fintech.entity.Transacao;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversão entre Transacao (Entity) e TransacaoDTO
 * Implementa padrão Mapper para isolamento entre camadas
 */
@Component
public class TransacaoMapper {
    
    /**
     * Converte Entity para DTO
     */
    public TransacaoDTO toDTO(Transacao transacao) {
        if (transacao == null) return null;
        
        return new TransacaoDTO(
            transacao.getIdTransacao(),
            transacao.getIdUsuario(),
            transacao.getTipoTransacao(),
            transacao.getCategoria(),
            transacao.getDescricao(),
            transacao.getValor(),
            transacao.getData()
        );
    }
    
    /**
     * Converte DTO para Entity
     */
    public Transacao toEntity(TransacaoDTO dto) {
        if (dto == null) return null;
        
        return new Transacao(
            dto.getIdTransacao(),
            dto.getIdUsuario(),
            dto.getTipoTransacao(),
            dto.getCategoria(),
            dto.getDescricao(),
            dto.getValor(),
            dto.getData()
        );
    }
    
    /**
     * Atualiza Entity com dados do DTO
     */
    public void updateEntity(Transacao transacao, TransacaoDTO dto) {
        if (transacao == null || dto == null) return;
        
        if (dto.getTipoTransacao() != null) {
            transacao.setTipoTransacao(dto.getTipoTransacao());
        }
        if (dto.getCategoria() != null) {
            transacao.setCategoria(dto.getCategoria());
        }
        if (dto.getDescricao() != null) {
            transacao.setDescricao(dto.getDescricao());
        }
        if (dto.getValor() != null) {
            transacao.setValor(dto.getValor());
        }
        if (dto.getData() != null) {
            transacao.setData(dto.getData());
        }
    }
}
