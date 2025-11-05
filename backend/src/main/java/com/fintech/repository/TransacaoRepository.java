package com.fintech.repository;

import com.fintech.entity.Transacao;
import com.fintech.enums.TipoTransacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Busca transações por usuário
    List<Transacao> findByIdUsuario(Long idUsuario);

    // Busca transações por usuário ordenadas por data (mais recentes primeiro)
    List<Transacao> findByIdUsuarioOrderByDataDesc(Long idUsuario);

    // Busca transações por tipo
    List<Transacao> findByTipoTransacao(TipoTransacao tipoTransacao);

    // Busca transações por usuário e tipo
    List<Transacao> findByIdUsuarioAndTipoTransacao(Long idUsuario, TipoTransacao tipoTransacao);

    // Busca transações por categoria
    List<Transacao> findByCategoriaIgnoreCase(String categoria);

    // Busca transações por período
    List<Transacao> findByDataBetween(LocalDate dataInicio, LocalDate dataFim);

    // Busca transações por usuário e período
    List<Transacao> findByIdUsuarioAndDataBetween(Long idUsuario, LocalDate dataInicio, LocalDate dataFim);

    // Queries agregadas - Somatórias
    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.idUsuario = :idUsuario AND t.tipoTransacao = :tipo")
    BigDecimal sumValoresByUsuarioAndTipo(@Param("idUsuario") Long idUsuario, @Param("tipo") TipoTransacao tipo);

    @Query("SELECT SUM(t.valor) FROM Transacao t WHERE t.idUsuario = :idUsuario AND t.tipoTransacao = :tipo AND t.data BETWEEN :dataInicio AND :dataFim")
    BigDecimal sumValoresByUsuarioTipoAndPeriodo(
        @Param("idUsuario") Long idUsuario, 
        @Param("tipo") TipoTransacao tipo,
        @Param("dataInicio") LocalDate dataInicio, 
        @Param("dataFim") LocalDate dataFim);

    // Saldo do usuário (receitas - despesas)
    @Query("SELECT COALESCE(SUM(CASE WHEN t.tipoTransacao = 'CREDITO' THEN t.valor ELSE -t.valor END), 0) FROM Transacao t WHERE t.idUsuario = :idUsuario")
    BigDecimal calcularSaldoUsuario(@Param("idUsuario") Long idUsuario);

    // Gastos por categoria
    @Query("SELECT t.categoria, SUM(t.valor) FROM Transacao t WHERE t.idUsuario = :idUsuario AND t.tipoTransacao = 'DEBITO' GROUP BY t.categoria ORDER BY SUM(t.valor) DESC")
    List<Object[]> sumGastosPorCategoria(@Param("idUsuario") Long idUsuario);

    // Receitas por categoria
    @Query("SELECT t.categoria, SUM(t.valor) FROM Transacao t WHERE t.idUsuario = :idUsuario AND t.tipoTransacao = 'CREDITO' GROUP BY t.categoria ORDER BY SUM(t.valor) DESC")
    List<Object[]> sumReceitasPorCategoria(@Param("idUsuario") Long idUsuario);
}