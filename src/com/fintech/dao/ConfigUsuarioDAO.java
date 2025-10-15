package com.fintech.dao;

import com.fintech.enums.Moeda;
import com.fintech.enums.SimNao;
import com.fintech.model.ConfigUsuario;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface ConfigUsuarioDAO extends BaseDAO<ConfigUsuario, Long> {
    
    Optional<ConfigUsuario> findByUsuario(Long idUsuario) throws SQLException;
    
    List<ConfigUsuario> findByMoedaPadrao(Moeda moeda) throws SQLException;
    
    List<ConfigUsuario> findByIdioma(String idioma) throws SQLException;
    
    List<ConfigUsuario> findByNotificacoesAtivas(boolean ativo) throws SQLException;
    
    List<ConfigUsuario> findByTemaEscuro(boolean temaEscuro) throws SQLException;
    
    List<ConfigUsuario> findByFusoHorario(String fusoHorario) throws SQLException;
    
    List<ConfigUsuario> findAtualizadasRecentemente(int horas) throws SQLException;
    
    List<ConfigUsuario> findComNotificacaoEmail() throws SQLException;
    
    List<ConfigUsuario> findComNotificacaoPush() throws SQLException;
    
    boolean upsert(ConfigUsuario config) throws SQLException;
    
    boolean atualizarMoedaPadrao(Long idUsuario, Moeda moeda) throws SQLException;
    
    boolean atualizarNotificacoes(Long idUsuario, boolean notificacoesAtivas, 
                                  boolean notificacaoEmail, boolean notificacaoPush) throws SQLException;
    
    boolean atualizarConfiguracaoRegional(Long idUsuario, Moeda moeda, String idioma, 
                                          String formatoData, String fusoHorario) throws SQLException;
    
    boolean atualizarTema(Long idUsuario, boolean temaEscuro) throws SQLException;
    
    java.util.Map<Moeda, Long> contarPorMoeda() throws SQLException;
    
    java.util.Map<String, Long> contarPorIdioma() throws SQLException;
    
    java.util.Map<String, Object> obterEstatisticas() throws SQLException;
    
    boolean removerPorUsuario(Long idUsuario) throws SQLException;
    
    Optional<ConfigUsuario> criarConfiguracaoPadrao(Long idUsuario) throws SQLException;
    
    boolean usuarioTemConfiguracao(Long idUsuario) throws SQLException;
}
