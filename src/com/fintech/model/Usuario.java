package com.fintech.model;

import com.fintech.enums.Genero;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Objects;
import java.util.regex.Pattern;

public class Usuario {

    private Long idUsuario;          // NUMBER (PK)
    private String nomeCompleto;     // VARCHAR2(100)
    private String email;            // VARCHAR2(100) (UNIQUE)
    private String senha;            // VARCHAR2(255) - Hash da senha
    private LocalDate dataNascimento;// DATE
    private Genero genero;           // Enum ao invés de String
    private LocalDateTime dataCadastro;   // TIMESTAMP
    private LocalDateTime ultimoLogin;    // TIMESTAMP
    private boolean ativo;           // CHAR(1) 'S'/'N'

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    private static final int IDADE_MINIMA = 16;
    private static final int NOME_MIN_LENGTH = 2;
    private static final int SENHA_MIN_LENGTH = 6;

    public Usuario() {
        this.dataCadastro = LocalDateTime.now();
        this.genero = Genero.NAO_INFORMADO;
        this.ativo = true;
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

    public Usuario(Long idUsuario, String nomeCompleto, String email, String senha,
                   LocalDate dataNascimento, String genero) {
        this(idUsuario, nomeCompleto, email, senha, dataNascimento, Genero.fromString(genero));
    }

    public void registrar() {
        System.out.println("Registrando usuário: " + nomeCompleto + " <" + email + ">");
        this.dataCadastro = LocalDateTime.now();
        this.ativo = true;
    }

    public void autenticar() {
        System.out.println("Autenticando usuário por email: " + email);
        this.ultimoLogin = LocalDateTime.now();
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

    public long getDiasCadastrado() {
        if (dataCadastro == null) {
            return 0;
        }
        return java.time.temporal.ChronoUnit.DAYS.between(dataCadastro.toLocalDate(), LocalDate.now());
    }

    public boolean isUsuarioNovo() {
        return getDiasCadastrado() <= 30;
    }

    public long getDiasUltimoLogin() {
        if (ultimoLogin == null) {
            return Long.MAX_VALUE; // Nunca fez login
        }
        return java.time.temporal.ChronoUnit.DAYS.between(ultimoLogin.toLocalDate(), LocalDate.now());
    }

    public boolean isInativo(int diasLimite) {
        return getDiasUltimoLogin() > diasLimite;
    }

    public void ativar() {
        this.ativo = true;
    }

    public void desativar() {
        this.ativo = false;
    }

    public String getPrimeiroNome() {
        if (nomeCompleto == null || nomeCompleto.trim().isEmpty()) {
            return "";
        }
        String[] partes = nomeCompleto.trim().split("\\s+");
        return partes[0];
    }

    public String getIniciais() {
        if (nomeCompleto == null || nomeCompleto.trim().isEmpty()) {
            return "";
        }
        
        String[] palavras = nomeCompleto.trim().split("\\s+");
        StringBuilder iniciais = new StringBuilder();
        
        for (String palavra : palavras) {
            if (!palavra.isEmpty()) {
                iniciais.append(palavra.charAt(0));
            }
        }
        
        return iniciais.toString().toUpperCase();
    }

    public boolean isValid() {
        return nomeCompleto != null && nomeCompleto.trim().length() >= NOME_MIN_LENGTH &&
               email != null && isEmailValido(email) &&
               senha != null && !senha.trim().isEmpty() &&
               dataNascimento != null && temIdadeMinima() &&
               genero != null;
    }

    public static boolean isEmailValido(String email) {
        return email != null && EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isSenhaForte(String senha) {
        if (senha == null || senha.length() < 8) {
            return false;
        }
        
        boolean temMinuscula = senha.matches(".*[a-z].*");
        boolean temMaiuscula = senha.matches(".*[A-Z].*");
        boolean temNumero = senha.matches(".*\\d.*");
        boolean temEspecial = senha.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
        
        return temMinuscula && temMaiuscula && temNumero && temEspecial;
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

    public String getResumoLog() {
        return String.format("Usuario{id=%d, nome='%s', email='%s', idade=%d, ativo=%s}", 
                idUsuario, getPrimeiroNome(), 
                email != null ? email.replaceAll("(.{2}).*(@.*)", "$1***$2") : null,
                getIdade(), ativo);
    }

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
        return senha; // Retorna o hash, não a senha original
    }

    public void setSenha(String senha) {
        this.senha = senha; // Para persistência do hash já calculado
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

    public void setGenero(String genero) {
        this.genero = Genero.fromString(genero);
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public LocalDateTime getUltimoLogin() {
        return ultimoLogin;
    }

    public void setUltimoLogin(LocalDateTime ultimoLogin) {
        this.ultimoLogin = ultimoLogin;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
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
                ", ativo=" + ativo +
                ", diasCadastrado=" + getDiasCadastrado() +
                '}';
    }
}
