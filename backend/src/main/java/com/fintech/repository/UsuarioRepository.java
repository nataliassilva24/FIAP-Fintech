package com.fintech.repository;

import com.fintech.entity.Usuario;
import com.fintech.enums.Genero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca por email (único)
    Optional<Usuario> findByEmail(String email);

    // Verifica se existe usuário com email
    boolean existsByEmail(String email);

    // Busca usuários ativos
    @Query("SELECT u FROM Usuario u WHERE u.ativo = 'S'")
    List<Usuario> findUsuariosAtivos();

    // Busca usuários inativos
    @Query("SELECT u FROM Usuario u WHERE u.ativo = 'N'")
    List<Usuario> findUsuariosInativos();

    // Busca por nome (contém)
    List<Usuario> findByNomeCompletoContainingIgnoreCase(String nome);

    // Busca por gênero
    List<Usuario> findByGenero(Genero genero);

    // Busca por data de nascimento entre datas
    List<Usuario> findByDataNascimentoBetween(LocalDate dataInicio, LocalDate dataFim);

    // Busca usuários cadastrados em um período
    List<Usuario> findByDataCadastroBetween(LocalDateTime inicio, LocalDateTime fim);

    // Busca usuários novos (últimos 30 dias)
    @Query("SELECT u FROM Usuario u WHERE u.dataCadastro >= :dataLimite")
    List<Usuario> findUsuariosNovos(@Param("dataLimite") LocalDateTime dataLimite);

    // Busca para autenticação
    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.ativo = 'S'")
    Optional<Usuario> findByEmailAndAtivo(@Param("email") String email);

    // Estatísticas
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.ativo = 'S'")
    long countUsuariosAtivos();

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.dataCadastro >= :dataInicio")
    long countUsuariosCadastradosApos(@Param("dataInicio") LocalDateTime dataInicio);
}