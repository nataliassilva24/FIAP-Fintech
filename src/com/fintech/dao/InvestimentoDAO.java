package com.fintech.dao;

import com.fintech.enums.TipoInvestimento;
import com.fintech.model.Investimento;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

public interface InvestimentoDAO extends BaseDAO<Investimento, Long> {
    
    List<Investimento> findByUsuario(Long idUsuario) throws SQLException;
    
    List<Investimento> findByTipo(TipoInvestimento tipo) throws SQLException;
    
    List<Investimento> findAtivos(Long idUsuario) throws SQLException;
    
    List<Investimento> findResgatados(Long idUsuario) throws SQLException;
    
    List<Investimento> findByPeriodoAplicacao(LocalDate dataInicio, LocalDate dataFim) throws SQLException;
    
    List<Investimento> findByPeriodoResgate(LocalDate dataInicio, LocalDate dataFim) throws SQLException;
    
    List<Investimento> findByUsuarioAndTipo(Long idUsuario, TipoInvestimento tipo) throws SQLException;
    
    BigDecimal calcularTotalInvestido(Long idUsuario) throws SQLException;
    
    BigDecimal calcularTotalPorTipo(Long idUsuario, TipoInvestimento tipo) throws SQLException;
    
    BigDecimal calcularTotalAtivos(Long idUsuario) throws SQLException;
    
    List<Investimento> findProximosVencimento(Long idUsuario, int diasAntecedencia) throws SQLException;
    
    List<Investimento> findRendaFixa(Long idUsuario) throws SQLException;
    
    List<Investimento> findRendaVariavel(Long idUsuario) throws SQLException;
}
