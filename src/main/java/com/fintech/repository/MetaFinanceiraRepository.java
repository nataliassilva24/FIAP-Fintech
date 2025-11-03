package com.fintech.repository;

import com.fintech.entity.MetaFinanceira;
import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MetaFinanceiraRepository extends JpaRepository<MetaFinanceira, Long> {

    // Busca metas por usuário
    List<MetaFinanceira> findByIdUsuario(Long idUsuario);

    // Busca metas por usuário ordenadas por data de criação
    List<MetaFinanceira> findByIdUsuarioOrderByDataCriacaoDesc(Long idUsuario);

    // Busca metas por status
    List<MetaFinanceira> findByStatus(StatusMeta status);

    // Busca metas por usuário e status
    List<MetaFinanceira> findByIdUsuarioAndStatus(Long idUsuario, StatusMeta status);

    // Busca metas ativas
    @Query("SELECT m FROM MetaFinanceira m WHERE m.status = 'ATIVA'")
    List<MetaFinanceira> findMetasAtivas();

    // Busca metas ativas por usuário
    @Query("SELECT m FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario AND m.status = 'ATIVA'")
    List<MetaFinanceira> findMetasAtivasByUsuario(@Param("idUsuario") Long idUsuario);

    // Busca metas concluídas por usuário
    @Query("SELECT m FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario AND m.status = 'CONCLUIDA'")
    List<MetaFinanceira> findMetasConcluidasByUsuario(@Param("idUsuario") Long idUsuario);

    // Busca por categoria
    List<MetaFinanceira> findByCategoria(CategoriaMeta categoria);

    // Busca por usuário e categoria
    List<MetaFinanceira> findByIdUsuarioAndCategoria(Long idUsuario, CategoriaMeta categoria);

    // Busca metas por nome (contém)
    List<MetaFinanceira> findByNomeContainingIgnoreCase(String nome);

    // Queries agregadas - Somatórias
    @Query("SELECT SUM(m.valorNecessario) FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario AND m.status = 'ATIVA'")
    BigDecimal sumValorNecessarioMetasAtivas(@Param("idUsuario") Long idUsuario);

    @Query("SELECT SUM(m.valorAcumulado) FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario AND m.status = 'ATIVA'")
    BigDecimal sumValorAcumuladoMetasAtivas(@Param("idUsuario") Long idUsuario);

    // Metas por categoria (agrupado)
    @Query("SELECT m.categoria, COUNT(m), SUM(m.valorNecessario), SUM(m.valorAcumulado) FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario GROUP BY m.categoria ORDER BY COUNT(m) DESC")
    List<Object[]> getResumoMetasPorCategoria(@Param("idUsuario") Long idUsuario);

    // Contar metas ativas
    @Query("SELECT COUNT(m) FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario AND m.status = 'ATIVA'")
    long countMetasAtivas(@Param("idUsuario") Long idUsuario);

    // Contar metas concluídas
    @Query("SELECT COUNT(m) FROM MetaFinanceira m WHERE m.idUsuario = :idUsuario AND m.status = 'CONCLUIDA'")
    long countMetasConcluidas(@Param("idUsuario") Long idUsuario);
}