package com.fintech.dao;

import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import com.fintech.model.MetaFinanceira;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

public interface MetaFinanceiraDAO extends BaseDAO<MetaFinanceira, Long> {
    
    List<MetaFinanceira> findByUsuario(Long idUsuario) throws SQLException;
    
    List<MetaFinanceira> findByStatus(StatusMeta status) throws SQLException;
    
    List<MetaFinanceira> findByCategoria(CategoriaMeta categoria) throws SQLException;
    
    List<MetaFinanceira> findAtivas(Long idUsuario) throws SQLException;
    
    List<MetaFinanceira> findConcluidas(Long idUsuario) throws SQLException;
    
    List<MetaFinanceira> findVencidas(Long idUsuario) throws SQLException;
    
    List<MetaFinanceira> findByUsuarioAndCategoria(Long idUsuario, CategoriaMeta categoria) throws SQLException;
    
    List<MetaFinanceira> findByUsuarioAndStatus(Long idUsuario, StatusMeta status) throws SQLException;
    
    List<MetaFinanceira> findByPeriodoVencimento(LocalDate dataInicio, LocalDate dataFim) throws SQLException;
    
    List<MetaFinanceira> findProximasVencimento(Long idUsuario, int diasAntecedencia) throws SQLException;
    
    List<MetaFinanceira> findByFaixaPercentual(Long idUsuario, int percentualMinimo, int percentualMaximo) throws SQLException;
    
    List<MetaFinanceira> findByFaixaValor(Long idUsuario, BigDecimal valorMinimo, BigDecimal valorMaximo) throws SQLException;
    
    BigDecimal calcularTotalNecessario(Long idUsuario) throws SQLException;
    
    BigDecimal calcularTotalAcumulado(Long idUsuario) throws SQLException;
    
    BigDecimal calcularTotalRestante(Long idUsuario) throws SQLException;
    
    BigDecimal calcularPercentualMedio(Long idUsuario) throws SQLException;
    
    BigDecimal calcularEconomiaoDiariaMedia(Long idUsuario) throws SQLException;
    
    List<MetaFinanceira> findPorPrioridade(Long idUsuario, int limite) throws SQLException;
    
    java.util.Map<CategoriaMeta, Long> contarPorCategoria(Long idUsuario) throws SQLException;
    
    java.util.Map<StatusMeta, Long> contarPorStatus(Long idUsuario) throws SQLException;
    
    boolean adicionarValor(Long idMeta, BigDecimal valor) throws SQLException;
    
    boolean removerValor(Long idMeta, BigDecimal valor) throws SQLException;
    
    boolean atualizarStatus(Long idMeta, StatusMeta novoStatus) throws SQLException;
    
    int atualizarMetasVencidas(Long idUsuario) throws SQLException;
}
