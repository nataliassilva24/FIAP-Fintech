package com.fintech.controller;

import com.fintech.entity.Transacao;
import com.fintech.enums.TipoTransacao;
import com.fintech.service.TransacaoService;
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
@RequestMapping("/transacoes")
@Tag(name = "Transações", description = "Gerenciamento de transações financeiras")
public class TransacaoController {

    @Autowired
    private TransacaoService transacaoService;

    @Operation(summary = "Listar todas as transações", description = "Retorna lista de todas as transações")
    @ApiResponse(responseCode = "200", description = "Lista de transações retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Transacao>> listarTodas() {
        List<Transacao> transacoes = transacaoService.listarTodas();
        return ResponseEntity.ok(transacoes);
    }

    @Operation(summary = "Buscar transação por ID", description = "Retorna uma transação específica pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transação encontrada"),
        @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Transacao> buscarPorId(
            @Parameter(description = "ID da transação") @PathVariable Long id) {
        try {
            Transacao transacao = transacaoService.buscarPorId(id);
            return ResponseEntity.ok(transacao);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Criar nova transação", description = "Registra uma nova transação no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Transação criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Transacao transacao) {
        try {
            Transacao transacaoSalva = transacaoService.salvar(transacao);
            return ResponseEntity.status(HttpStatus.CREATED).body(transacaoSalva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Atualizar transação", description = "Atualiza os dados de uma transação existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transação atualizada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @Parameter(description = "ID da transação") @PathVariable Long id,
            @Valid @RequestBody Transacao transacao) {
        try {
            transacao.setIdTransacao(id);
            Transacao transacaoAtualizada = transacaoService.atualizar(transacao);
            return ResponseEntity.ok(transacaoAtualizada);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrada")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Deletar transação", description = "Remove uma transação do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Transação deletada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Transação não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID da transação") @PathVariable Long id) {
        try {
            transacaoService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Listar transações por usuário")
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Transacao>> listarPorUsuario(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            List<Transacao> transacoes = transacaoService.listarPorUsuario(idUsuario);
            return ResponseEntity.ok(transacoes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar transações por tipo")
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Transacao>> listarPorTipo(
            @Parameter(description = "Tipo da transação") @PathVariable TipoTransacao tipo) {
        List<Transacao> transacoes = transacaoService.listarPorTipo(tipo);
        return ResponseEntity.ok(transacoes);
    }

    @Operation(summary = "Listar transações por categoria")
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Transacao>> listarPorCategoria(
            @Parameter(description = "Categoria da transação") @PathVariable String categoria) {
        List<Transacao> transacoes = transacaoService.listarPorCategoria(categoria);
        return ResponseEntity.ok(transacoes);
    }

    @Operation(summary = "Calcular saldo do usuário")
    @GetMapping("/usuario/{idUsuario}/saldo")
    public ResponseEntity<?> calcularSaldo(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal saldo = transacaoService.calcularSaldo(idUsuario);
            return ResponseEntity.ok(Map.of("saldo", saldo));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Calcular total de receitas do usuário")
    @GetMapping("/usuario/{idUsuario}/receitas")
    public ResponseEntity<?> calcularTotalReceitas(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal totalReceitas = transacaoService.calcularTotalReceitas(idUsuario);
            return ResponseEntity.ok(Map.of("totalReceitas", totalReceitas));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Calcular total de despesas do usuário")
    @GetMapping("/usuario/{idUsuario}/despesas")
    public ResponseEntity<?> calcularTotalDespesas(
            @Parameter(description = "ID do usuário") @PathVariable Long idUsuario) {
        try {
            BigDecimal totalDespesas = transacaoService.calcularTotalDespesas(idUsuario);
            return ResponseEntity.ok(Map.of("totalDespesas", totalDespesas));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Registrar receita")
    @PostMapping("/receita")
    public ResponseEntity<?> registrarReceita(@RequestBody Map<String, Object> dadosReceita) {
        try {
            Long idUsuario = Long.valueOf(dadosReceita.get("idUsuario").toString());
            String categoria = (String) dadosReceita.get("categoria");
            String descricao = (String) dadosReceita.get("descricao");
            BigDecimal valor = new BigDecimal(dadosReceita.get("valor").toString());
            LocalDate data = dadosReceita.get("data") != null ? 
                LocalDate.parse((String) dadosReceita.get("data")) : LocalDate.now();
            
            Transacao transacao = transacaoService.registrarReceita(idUsuario, categoria, descricao, valor, data);
            return ResponseEntity.status(HttpStatus.CREATED).body(transacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Registrar despesa")
    @PostMapping("/despesa")
    public ResponseEntity<?> registrarDespesa(@RequestBody Map<String, Object> dadosDespesa) {
        try {
            Long idUsuario = Long.valueOf(dadosDespesa.get("idUsuario").toString());
            String categoria = (String) dadosDespesa.get("categoria");
            String descricao = (String) dadosDespesa.get("descricao");
            BigDecimal valor = new BigDecimal(dadosDespesa.get("valor").toString());
            LocalDate data = dadosDespesa.get("data") != null ? 
                LocalDate.parse((String) dadosDespesa.get("data")) : LocalDate.now();
            
            Transacao transacao = transacaoService.registrarDespesa(idUsuario, categoria, descricao, valor, data);
            return ResponseEntity.status(HttpStatus.CREATED).body(transacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}



