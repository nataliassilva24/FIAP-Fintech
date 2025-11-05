package com.fintech.mapper;

import com.fintech.dto.UsuarioDTO;
import com.fintech.entity.Usuario;
import org.springframework.stereotype.Component;

/**
 * Mapper para conversão entre Usuario (Entity) e UsuarioDTO
 * Implementa padrão Mapper para isolamento entre camadas
 */
@Component
public class UsuarioMapper {
    
    /**
     * Converte Entity para DTO
     */
    public UsuarioDTO toDTO(Usuario usuario) {
        if (usuario == null) return null;
        
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setNomeCompleto(usuario.getNomeCompleto());
        dto.setEmail(usuario.getEmail());
        dto.setDataNascimento(usuario.getDataNascimento());
        dto.setGenero(usuario.getGenero());
        dto.setDataCadastro(usuario.getDataCadastro());
        dto.setAtivo(usuario.isAtivo());
        dto.setIdade(usuario.getIdade());
        dto.setMaiorIdade(usuario.isMaiorIdade());
        
        return dto;
    }
    
    /**
     * Converte DTO para Entity (sem senha por segurança)
     */
    public Usuario toEntity(UsuarioDTO dto) {
        if (dto == null) return null;
        
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(dto.getIdUsuario());
        usuario.setNomeCompleto(dto.getNomeCompleto());
        usuario.setEmail(dto.getEmail());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setGenero(dto.getGenero());
        usuario.setDataCadastro(dto.getDataCadastro());
        usuario.setAtivo(dto.isAtivo());
        
        return usuario;
    }
    
    /**
     * Atualiza Entity com dados do DTO (preserva campos sensíveis)
     */
    public void updateEntity(Usuario usuario, UsuarioDTO dto) {
        if (usuario == null || dto == null) return;
        
        if (dto.getNomeCompleto() != null) {
            usuario.setNomeCompleto(dto.getNomeCompleto());
        }
        if (dto.getEmail() != null) {
            usuario.setEmail(dto.getEmail());
        }
        if (dto.getDataNascimento() != null) {
            usuario.setDataNascimento(dto.getDataNascimento());
        }
        if (dto.getGenero() != null) {
            usuario.setGenero(dto.getGenero());
        }
        // Não atualizar senha via DTO por segurança
    }
}
