package com.fintech.dto;

import com.fintech.enums.Genero;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO para transferência de dados de usuários entre camadas
 * Implementa padrão DTO para desacoplar API das entidades internas
 */
public class UsuarioDTO {
    
    private Long idUsuario;
    
    @NotBlank(message = "Nome completo é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    private String nomeCompleto;
    
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    private String email;
    
    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve estar no passado")
    private LocalDate dataNascimento;
    
    @NotNull(message = "Gênero é obrigatório")
    private Genero genero;
    
    private LocalDateTime dataCadastro;
    private boolean ativo;
    private Integer idade;
    private Boolean maiorIdade;
    
    // Constructors
    public UsuarioDTO() {}
    
    public UsuarioDTO(Long idUsuario, String nomeCompleto, String email, 
                     LocalDate dataNascimento, Genero genero) {
        this.idUsuario = idUsuario;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.dataNascimento = dataNascimento;
        this.genero = genero;
    }
    
    // Getters and Setters
    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
    
    public String getNomeCompleto() { return nomeCompleto; }
    public void setNomeCompleto(String nomeCompleto) { this.nomeCompleto = nomeCompleto; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }
    
    public Genero getGenero() { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }
    
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
    
    public boolean isAtivo() { return ativo; }
    public void setAtivo(boolean ativo) { this.ativo = ativo; }
    
    public Integer getIdade() { return idade; }
    public void setIdade(Integer idade) { this.idade = idade; }
    
    public Boolean getMaiorIdade() { return maiorIdade; }
    public void setMaiorIdade(Boolean maiorIdade) { this.maiorIdade = maiorIdade; }
}
