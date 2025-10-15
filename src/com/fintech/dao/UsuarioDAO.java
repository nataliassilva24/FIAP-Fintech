package com.fintech.dao;

import com.fintech.enums.Genero;
import com.fintech.model.Usuario;

import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface UsuarioDAO extends BaseDAO<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email) throws SQLException;
    
    boolean existsEmail(String email) throws SQLException;
    
    Optional<Usuario> validarCredenciais(String email, String senha) throws SQLException;
    
    List<Usuario> findByGenero(Genero genero) throws SQLException;
    
    List<Usuario> findByFaixaEtaria(int idadeMinima, int idadeMaxima) throws SQLException;
    
    List<Usuario> findAtivos() throws SQLException;
    
    List<Usuario> findInativos() throws SQLException;
    
    List<Usuario> findCadastradosNoPeriodo(LocalDate dataInicio, LocalDate dataFim) throws SQLException;
    
    List<Usuario> findUsuariosNovos(int dias) throws SQLException;
    
    List<Usuario> findUsuariosInativos(int diasSemLogin) throws SQLException;
    
    List<Usuario> findComLoginRecente(int horas) throws SQLException;
    
    List<Usuario> findByNomeContendo(String parteNome) throws SQLException;
    
    List<Usuario> findByDominioEmail(String dominio) throws SQLException;
    
    boolean atualizarUltimoLogin(Long idUsuario) throws SQLException;
    
    boolean ativarUsuario(Long idUsuario) throws SQLException;
    
    boolean desativarUsuario(Long idUsuario) throws SQLException;
    
    boolean atualizarSenha(Long idUsuario, String novaSenhaHash) throws SQLException;
    
    boolean atualizarEmail(Long idUsuario, String novoEmail) throws SQLException;
    
    java.util.Map<Genero, Long> contarPorGenero() throws SQLException;
    
    java.util.Map<String, Long> contarPorFaixaEtaria() throws SQLException;
    
    java.util.Map<String, Object> obterEstatisticas() throws SQLException;
    
    java.util.Map<String, Long> contarCadastrosPorMes() throws SQLException;
    
    List<Usuario> findComAniversarioProximo(int diasAntecedencia) throws SQLException;
    
    List<Usuario> findMaioresIdade() throws SQLException;
    
    List<Usuario> findMenoresIdade() throws SQLException;
    
    long contarTotalLogins(Long idUsuario) throws SQLException;
}
