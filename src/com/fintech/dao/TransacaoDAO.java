package com.fintech.dao;

import com.fintech.enums.TipoTransacao;
import com.fintech.model.Transacao;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

public interface TransacaoDAO extends BaseDAO<Transacao, Long> {
    
    List<Transacao> findByUsuario(Long idUsuario) throws SQLException;
    
    List<Transacao> findByTipo(TipoTransacao tipo) throws SQLException;
    
    List<Transacao> findByCategoria(String categoria) throws SQLException;
    
    List<Transacao> findByPeriodo(LocalDate dataInicio, LocalDate dataFim) throws SQLException;
    
    List<Transacao> findByUsuarioAndPeriodo(Long idUsuario, LocalDate dataInicio, LocalDate dataFim) throws SQLException;
    
    BigDecimal calcularSaldo(Long idUsuario) throws SQLException;
    
    BigDecimal calcularTotalPorTipo(Long idUsuario, TipoTransacao tipo) throws SQLException;
    
    @Deprecated
    default List<Transacao> getAll() throws SQLException {
        return findAll();
    }
}
