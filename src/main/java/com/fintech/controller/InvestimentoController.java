package com.fintech.controller;

import com.fintech.entity.Investimento;
import com.fintech.enums.TipoInvestimento;
import com.fintech.service.InvestimentoService;
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
@RequestMapping("/investimentos")
@Tag(name = "Investimentos", description = "Gerenciamento de investimentos financeiros")
public class InvestimentoController {

    @Autowired
    private InvestimentoService investimentoService;

    @Operation(summary = "Listar todos os investimentos", description = "Retorna lista de todos os investimentos")
    @ApiResponse(responseCode = "200", description = "Lista de investimentos retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Investimento>> listarTodos() {
        List<Investimento> investimentos = investimentoService.listarTodos();
        return ResponseEntity.ok(investimentos);
    }

    @Operation(summary = "Buscar investimento por ID", description = "Retorna um investimento específico pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Investimento encontrado"),
        @ApiResponse(responseCode = "404", description = "Investimento não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Investimento> buscarPorId(
            @Parameter(description = "ID do investimento") @PathVariable Long id) {
        try {
            Investimento investimento = investimentoService.buscarPorId(id);
            return ResponseEntity.ok(investimento);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Criar novo investimento", description = "Registra um novo investimento no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Investimento criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Investimento investimento) {
        try {
            Investimento investimentoSalvo = investimentoService.salvar(investimento);
            return ResponseEntity.status(HttpStatus.CREATED).body(investimentoSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Atualizar investimento", description = "Atualiza os dados de um investimento existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Investimento atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Investimento não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @Parameter(description = "ID do investimento") @PathVariable Long id,
            @Valid @RequestBody Investimento investimento) {
        try {
            investimento.setIdInvestimento(id);
            Investimento investimentoAtualizado = investimentoService.atualizar(investimento);
            return ResponseEntity.ok(investimentoAtualizado);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Deletar investimento", description = "Remove um investimento do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Investimento deletado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Investimento não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID do investimento") @PathVariable Long id) {
        try {
            investimentoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Listar investimentos por usuário")
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Investimento>> listarPorUsuario(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            List<Investimento> investimentos = investimentoService.listarPorUsuario(idUsuario);
            return ResponseEntity.ok(investimentos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar investimentos ativos")
    @GetMapping("/ativos")
    public ResponseEntity<List<Investimento>> listarAtivos() {
        List<Investimento> investimentos = investimentoService.listarInvestimentosAtivos();
        return ResponseEntity.ok(investimentos);
    }

    @Operation(summary = "Listar investimentos ativos por usuário")
    @GetMapping("/usuario/{idUsuario}/ativos")
    public ResponseEntity<List<Investimento>> listarAtivosPorUsuario(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            List<Investimento> investimentos = investimentoService.listarInvestimentosAtivosPorUsuario(idUsuario);
            return ResponseEntity.ok(investimentos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar investimentos por tipo")
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Investimento>> listarPorTipo(
            @Parameter(description = "Tipo do investimento") @PathVariable TipoInvestimento tipo) {
        List<Investimento> investimentos = investimentoService.listarPorTipo(tipo);
        return ResponseEntity.ok(investimentos);
    }

    @Operation(summary = "Resgatar investimento")
    @PatchMapping("/{id}/resgatar")
    public ResponseEntity<?> resgatar(
            @Parameter(description = "ID do investimento") @PathVariable Long id) {
        try {
            Investimento investimento = investimentoService.resgatar(id);
            return ResponseEntity.ok(investimento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Cálculos financeiros

    @Operation(summary = "Calcular total investido pelo usuário")
    @GetMapping("/usuario/{idUsuario}/total")
    public ResponseEntity<?> calcularTotalInvestido(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal total = investimentoService.calcularTotalInvestido(idUsuario);
            return ResponseEntity.ok(Map.of("totalInvestido", total));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Calcular total investido ativo pelo usuário")
    @GetMapping("/usuario/{idUsuario}/total-ativo")
    public ResponseEntity<?> calcularTotalInvestidoAtivo(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal total = investimentoService.calcularTotalInvestidoAtivo(idUsuario);
            return ResponseEntity.ok(Map.of("totalInvestidoAtivo", total));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    // Operações específicas do negócio

    @Operation(summary = "Aplicar em investimento")
    @PostMapping("/aplicar")
    public ResponseEntity<?> aplicar(@RequestBody Map<String, Object> dadosInvestimento) {
        try {
            Long idUsuario = Long.valueOf(dadosInvestimento.get("idUsuario").toString());
            TipoInvestimento tipo = TipoInvestimento.valueOf((String) dadosInvestimento.get("tipo"));
            BigDecimal valor = new BigDecimal(dadosInvestimento.get("valor").toString());
            LocalDate dataAplicacao = dadosInvestimento.get("dataAplicacao") != null ? 
                LocalDate.parse((String) dadosInvestimento.get("dataAplicacao")) : LocalDate.now();
            
            Investimento investimento = investimentoService.aplicar(idUsuario, tipo, valor, dataAplicacao);
            return ResponseEntity.status(HttpStatus.CREATED).body(investimento);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}



