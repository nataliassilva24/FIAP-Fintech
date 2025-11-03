package com.fintech.controller;

import com.fintech.entity.MetaFinanceira;
import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import com.fintech.service.MetaFinanceiraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/metas")
@Tag(name = "Metas Financeiras", description = "Gerenciamento de metas financeiras dos usuários")
public class MetaFinanceiraController {

    @Autowired
    private MetaFinanceiraService metaService;

    @Operation(summary = "Listar todas as metas", description = "Retorna lista de todas as metas financeiras")
    @ApiResponse(responseCode = "200", description = "Lista de metas retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<MetaFinanceira>> listarTodas() {
        List<MetaFinanceira> metas = metaService.listarTodas();
        return ResponseEntity.ok(metas);
    }

    @Operation(summary = "Buscar meta por ID", description = "Retorna uma meta específica pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meta encontrada"),
        @ApiResponse(responseCode = "404", description = "Meta não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MetaFinanceira> buscarPorId(
            @Parameter(description = "ID da meta") @PathVariable Long id) {
        try {
            MetaFinanceira meta = metaService.buscarPorId(id);
            return ResponseEntity.ok(meta);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Criar nova meta", description = "Registra uma nova meta financeira no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Meta criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody MetaFinanceira meta) {
        try {
            MetaFinanceira metaSalva = metaService.salvar(meta);
            return ResponseEntity.status(HttpStatus.CREATED).body(metaSalva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Atualizar meta", description = "Atualiza os dados de uma meta existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Meta atualizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Meta não encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @Parameter(description = "ID da meta") @PathVariable Long id,
            @Valid @RequestBody MetaFinanceira meta) {
        try {
            meta.setIdMeta(id);
            MetaFinanceira metaAtualizada = metaService.atualizar(meta);
            return ResponseEntity.ok(metaAtualizada);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrada")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Deletar meta", description = "Remove uma meta do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Meta deletada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Meta não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID da meta") @PathVariable Long id) {
        try {
            metaService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints específicos

    @Operation(summary = "Listar metas por usuário")
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<MetaFinanceira>> listarPorUsuario(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            List<MetaFinanceira> metas = metaService.listarPorUsuario(idUsuario);
            return ResponseEntity.ok(metas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar metas ativas")
    @GetMapping("/ativas")
    public ResponseEntity<List<MetaFinanceira>> listarAtivas() {
        List<MetaFinanceira> metas = metaService.listarMetasAtivas();
        return ResponseEntity.ok(metas);
    }

    @Operation(summary = "Listar metas ativas por usuário")
    @GetMapping("/usuario/{idUsuario}/ativas")
    public ResponseEntity<List<MetaFinanceira>> listarAtivasPorUsuario(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            List<MetaFinanceira> metas = metaService.listarMetasAtivasPorUsuario(idUsuario);
            return ResponseEntity.ok(metas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar metas por categoria")
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<MetaFinanceira>> listarPorCategoria(
            @Parameter(description = "Categoria da meta") @PathVariable CategoriaMeta categoria) {
        List<MetaFinanceira> metas = metaService.listarPorCategoria(categoria);
        return ResponseEntity.ok(metas);
    }

    @Operation(summary = "Listar metas por status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MetaFinanceira>> listarPorStatus(
            @Parameter(description = "Status da meta") @PathVariable StatusMeta status) {
        List<MetaFinanceira> metas = metaService.listarPorStatus(status);
        return ResponseEntity.ok(metas);
    }

    // Operações de valor

    @Operation(summary = "Adicionar valor à meta")
    @PatchMapping("/{id}/adicionar-valor")
    public ResponseEntity<?> adicionarValor(
            @Parameter(description = "ID da meta") @PathVariable Long id,
            @RequestBody Map<String, String> dados) {
        try {
            BigDecimal valor = new BigDecimal(dados.get("valor"));
            MetaFinanceira meta = metaService.adicionarValor(id, valor);
            return ResponseEntity.ok(meta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Cálculos financeiros

    @Operation(summary = "Calcular total necessário das metas ativas do usuário")
    @GetMapping("/usuario/{idUsuario}/total-necessario")
    public ResponseEntity<?> calcularTotalNecessario(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal total = metaService.calcularTotalNecessarioMetasAtivas(idUsuario);
            return ResponseEntity.ok(Map.of("totalNecessario", total));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Calcular total acumulado das metas ativas do usuário")
    @GetMapping("/usuario/{idUsuario}/total-acumulado")
    public ResponseEntity<?> calcularTotalAcumulado(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal total = metaService.calcularTotalAcumuladoMetasAtivas(idUsuario);
            return ResponseEntity.ok(Map.of("totalAcumulado", total));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Operações específicas do negócio

    @Operation(summary = "Criar meta completa")
    @PostMapping("/criar")
    public ResponseEntity<?> criarMeta(@RequestBody Map<String, Object> dadosMeta) {
        try {
            Long idUsuario = Long.valueOf(dadosMeta.get("idUsuario").toString());
            String nome = (String) dadosMeta.get("nome");
            String descricao = (String) dadosMeta.get("descricao");
            CategoriaMeta categoria = CategoriaMeta.valueOf((String) dadosMeta.get("categoria"));
            BigDecimal valorNecessario = new BigDecimal(dadosMeta.get("valorNecessario").toString());
            LocalDate dataLimite = dadosMeta.get("dataLimite") != null ? 
                LocalDate.parse((String) dadosMeta.get("dataLimite")) : null;
            
            MetaFinanceira meta = metaService.criarMeta(idUsuario, nome, descricao, categoria, valorNecessario, dataLimite);
            return ResponseEntity.status(HttpStatus.CREATED).body(meta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Estatísticas

    @Operation(summary = "Contar metas ativas do usuário")
    @GetMapping("/usuario/{idUsuario}/estatisticas/ativas")
    public ResponseEntity<Map<String, Long>> contarMetasAtivas(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            long count = metaService.contarMetasAtivas(idUsuario);
            return ResponseEntity.ok(Map.of("metasAtivas", count));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Contar metas concluídas do usuário")
    @GetMapping("/usuario/{idUsuario}/estatisticas/concluidas")
    public ResponseEntity<Map<String, Long>> contarMetasConcluidas(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            long count = metaService.contarMetasConcluidas(idUsuario);
            return ResponseEntity.ok(Map.of("metasConcluidas", count));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}



