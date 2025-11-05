package com.fintech.repository;

import com.fintech.entity.Investimento;
import com.fintech.enums.TipoInvestimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvestimentoRepository extends JpaRepository<Investimento, Long> {

    // Busca investimentos por usuário
    List<Investimento> findByIdUsuario(Long idUsuario);

    // Busca investimentos ativos (não resgatados)
    @Query("SELECT i FROM Investimento i WHERE i.dataResgate IS NULL")
    List<Investimento> findInvestimentosAtivos();

    // Busca investimentos ativos por usuário
    @Query("SELECT i FROM Investimento i WHERE i.idUsuario = :idUsuario AND i.dataResgate IS NULL")
    List<Investimento> findInvestimentosAtivosByUsuario(@Param("idUsuario") Long idUsuario);

    // Busca por tipo de investimento
    List<Investimento> findByTipo(TipoInvestimento tipo);

    // Busca por usuário e tipo
    List<Investimento> findByIdUsuarioAndTipo(Long idUsuario, TipoInvestimento tipo);

    // Busca investimentos por período de aplicação
    List<Investimento> findByDataAplicacaoBetween(LocalDate dataInicio, LocalDate dataFim);

    // Queries agregadas - Somatórias
    @Query("SELECT SUM(i.valorInvestido) FROM Investimento i WHERE i.idUsuario = :idUsuario")
    BigDecimal sumTotalInvestidoByUsuario(@Param("idUsuario") Long idUsuario);

    @Query("SELECT SUM(i.valorInvestido) FROM Investimento i WHERE i.idUsuario = :idUsuario AND i.dataResgate IS NULL")
    BigDecimal sumTotalInvestidoAtivoByUsuario(@Param("idUsuario") Long idUsuario);

    // Investimentos por tipo (agrupado)
    @Query("SELECT i.tipo, COUNT(i), SUM(i.valorInvestido) FROM Investimento i WHERE i.idUsuario = :idUsuario GROUP BY i.tipo ORDER BY SUM(i.valorInvestido) DESC")
    List<Object[]> getResumoInvestimentosPorTipo(@Param("idUsuario") Long idUsuario);

    // Distribuição da carteira
    @Query("SELECT i.tipo, SUM(i.valorInvestido) FROM Investimento i WHERE i.idUsuario = :idUsuario AND i.dataResgate IS NULL GROUP BY i.tipo")
    List<Object[]> getDistribuicaoCarteiraAtiva(@Param("idUsuario") Long idUsuario);
}