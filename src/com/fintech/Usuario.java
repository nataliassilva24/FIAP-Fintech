package com.fintech;

import java.time.LocalDate;

public class Usuario {

    private Long idUsuario;          // NUMBER (PK)
    private String nomeCompleto;     // VARCHAR2(100)
    private String email;            // VARCHAR2(100) (UNIQUE)
    private String senha;            // VARCHAR2(255)
    private LocalDate dataNascimento;// DATE
    private String genero;           // VARCHAR2(20)

    public Usuario() {}

    public Usuario(Long idUsuario, String nomeCompleto, String email, String senha,
                   LocalDate dataNascimento, String genero) {
        this.idUsuario = idUsuario;
        this.nomeCompleto = nomeCompleto;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
        this.genero = genero;
    }

    public void registrar() {
        System.out.println("Registrando usuário: " + nomeCompleto + " <" + email + ">");
    }

    public void autenticar() {
        System.out.println("Autenticando usuário por email: " + email);
    }
}