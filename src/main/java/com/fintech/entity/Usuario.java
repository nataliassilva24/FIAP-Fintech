package com.fintech.entity;

import com.fintech.enums.Genero;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.security.MessageDigest;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

@Entity
@Table(name = "TB_USUARIO")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_usuario")
    @SequenceGenerator(name = "seq_usuario", sequenceName = "SEQ_USUARIO", allocationSize = 1)
    @Column(name = "ID_USUARIO")
    private Long idUsuario;

    @NotBlank(message = "Nome completo é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    @Column(name = "NOME_COMPLETO", length = 100, nullable = false)
    private String nomeCompleto;

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email deve ter formato válido")
    @Size(max = 100, message = "Email deve ter no máximo 100 caracteres")
    @Column(name = "EMAIL", length = 100, nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Column(name = "SENHA", length = 255, nullable = false)
    private String senha;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Past(message = "Data de nascimento deve estar no passado")
    @Column(name = "DATA_NASCIMENTO", nullable = false)
    private LocalDate dataNascimento;

    @NotNull(message = "Gênero é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(name = "GENERO", length = 20, nullable = false)
    private Genero genero;

    @Column(name = "DATA_CADASTRO", nullable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "ATIVO", length = 1, nullable = false)
    private char ativo;

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    private static final int IDADE_MINIMA = 16;
    private static final int NOME_MIN_LENGTH = 2;
    private static final int SENHA_MIN_LENGTH = 6;

    public Usuario() {
        this.dataCadastro = LocalDateTime.now();
        this.genero = Genero.NAO_INFORMADO;
        this.ativo = 'S';
    }

    public Usuario(Long idUsuario, String nomeCompleto, String email, String senha,
                   LocalDate dataNascimento, Genero genero) {
        this();
        this.idUsuario = idUsuario;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
        this.genero = genero != null ? genero : Genero.NAO_INFORMADO;
    }

    @PrePersist
    protected void onCreate() {
        if (dataCadastro == null) {
            dataCadastro = LocalDateTime.now();
        }
        if (ativo == '\0') {
            ativo = 'S';
        }
    }

    public void registrar() {
        System.out.println("Registrando usuário: " + nomeCompleto + " <" + email + ">");
        this.dataCadastro = LocalDateTime.now();
        this.ativo = 'S';
    }

    public void autenticar() {
        System.out.println("Autenticando usuário por email: " + email);
        // Login realizado com sucesso
    }

    public boolean validarSenha(String senhaFornecida) {
        if (senhaFornecida == null || senha == null) {
            return false;
        }
        
        String hashFornecido = hashSenha(senhaFornecida);
        return senha.equals(hashFornecido);
    }

    public void definirSenha(String novaSenha) {
        if (novaSenha == null || novaSenha.length() < SENHA_MIN_LENGTH) {
            throw new IllegalArgumentException("Senha deve ter pelo menos " + SENHA_MIN_LENGTH + " caracteres");
        }
        this.senha = hashSenha(novaSenha);
    }

    public int getIdade() {
        if (dataNascimento == null) {
            return 0;
        }
        return Period.between(dataNascimento, LocalDate.now()).getYears();
    }

    public boolean isMaiorIdade() {
        return getIdade() >= 18;
    }

    public boolean temIdadeMinima() {
        return getIdade() >= IDADE_MINIMA;
    }

    private String hashSenha(String senha) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(senha.getBytes("UTF-8"));
            StringBuilder hexString = new StringBuilder();
            
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer hash da senha", e);
        }
    }

    public boolean isAtivo() {
        return this.ativo == 'S';
    }

    public void ativar() {
        this.ativo = 'S';
    }

    public void desativar() {
        this.ativo = 'N';
    }

    // Getters and Setters
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public LocalDate getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }


    public void setAtivo(boolean ativo) {
        this.ativo = ativo ? 'S' : 'N';
    }

    public void setAtivo(char ativo) {
        this.ativo = ativo;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Usuario usuario = (Usuario) o;
        return Objects.equals(idUsuario, usuario.idUsuario) ||
               (Objects.equals(email, usuario.email) && email != null);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idUsuario, email);
    }

    @Override
    public String toString() {
        return "Usuario{" +
                "idUsuario=" + idUsuario +
                ", nomeCompleto='" + nomeCompleto + '\'' +
                ", email='" + email + '\'' +
                ", idade=" + getIdade() +
                ", genero=" + genero +
                ", ativo=" + isAtivo() +
                '}';
    }
}