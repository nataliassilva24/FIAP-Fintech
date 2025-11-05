package com.fintech.controller;

import com.fintech.entity.Usuario;
import com.fintech.enums.Genero;
import com.fintech.service.UsuarioService;
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

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
@Tag(name = "Usuários", description = "Gerenciamento de usuários do sistema")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Operation(summary = "Listar todos os usuários", description = "Retorna lista de todos os usuários cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de usuários retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        List<Usuario> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Buscar usuário por ID", description = "Retorna um usuário específico pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(
            @Parameter(description = "ID do usuário") @PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.buscarPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Criar novo usuário", description = "Cadastra um novo usuário no sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioSalvo = usuarioService.salvar(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Atualizar usuário", description = "Atualiza os dados de um usuário existente")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(
            @Parameter(description = "ID do usuário") @PathVariable Long id,
            @Valid @RequestBody Usuario usuario) {
        try {
            usuario.setIdUsuario(id);
            Usuario usuarioAtualizado = usuarioService.atualizar(usuario);
            return ResponseEntity.ok(usuarioAtualizado);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("não encontrado")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @Operation(summary = "Deletar usuário", description = "Remove um usuário do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Usuário deletado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Usuário não encontrado")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID do usuário") @PathVariable Long id) {
        try {
            usuarioService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints específicos

    @Operation(summary = "Buscar usuário por email", description = "Busca usuário pelo endereço de email")
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(
            @Parameter(description = "Email do usuário") @PathVariable String email) {
        Optional<Usuario> usuario = usuarioService.buscarPorEmail(email);
        return usuario.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Autenticar usuário", description = "Realiza autenticação do usuário")
    @PostMapping("/auth")
    public ResponseEntity<?> autenticar(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");
        
        if (email == null || senha == null) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Email e senha são obrigatórios"));
        }
        
        Optional<Usuario> usuario = usuarioService.autenticar(email, senha);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "mensagem", "Autenticação realizada com sucesso",
                "usuario", usuario.get()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("erro", "Credenciais inválidas"));
        }
    }

    @Operation(summary = "Listar usuários ativos")
    @GetMapping("/ativos")
    public ResponseEntity<List<Usuario>> listarAtivos() {
        List<Usuario> usuarios = usuarioService.listarUsuariosAtivos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Listar usuários inativos")
    @GetMapping("/inativos")
    public ResponseEntity<List<Usuario>> listarInativos() {
        List<Usuario> usuarios = usuarioService.listarUsuariosInativos();
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Ativar usuário")
    @PatchMapping("/{id}/ativar")
    public ResponseEntity<Usuario> ativar(
            @Parameter(description = "ID do usuário") @PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.ativarUsuario(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Desativar usuário")
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<Usuario> desativar(
            @Parameter(description = "ID do usuário") @PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.desativarUsuario(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoints de busca e filtros

    @Operation(summary = "Buscar usuários por nome")
    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscarPorNome(
            @Parameter(description = "Nome para busca") @RequestParam String nome) {
        List<Usuario> usuarios = usuarioService.buscarPorNome(nome);
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Buscar usuários por gênero")
    @GetMapping("/genero/{genero}")
    public ResponseEntity<List<Usuario>> buscarPorGenero(
            @Parameter(description = "Gênero") @PathVariable Genero genero) {
        List<Usuario> usuarios = usuarioService.buscarPorGenero(genero);
        return ResponseEntity.ok(usuarios);
    }

    @Operation(summary = "Buscar usuários novos (últimos 30 dias)")
    @GetMapping("/novos")
    public ResponseEntity<List<Usuario>> buscarUsuariosNovos() {
        List<Usuario> usuarios = usuarioService.buscarUsuariosNovos();
        return ResponseEntity.ok(usuarios);
    }

    // Endpoints de estatísticas

    @Operation(summary = "Contar usuários ativos")
    @GetMapping("/estatisticas/ativos")
    public ResponseEntity<Map<String, Long>> contarAtivos() {
        long count = usuarioService.contarUsuariosAtivos();
        return ResponseEntity.ok(Map.of("usuariosAtivos", count));
    }

    @Operation(summary = "Contar usuários cadastrados no último mês")
    @GetMapping("/estatisticas/ultimo-mes")
    public ResponseEntity<Map<String, Long>> contarUltimoMes() {
        long count = usuarioService.contarUsuariosCadastradosUltimoMes();
        return ResponseEntity.ok(Map.of("usuariosUltimoMes", count));
    }

    // Operações específicas do negócio

    @Operation(summary = "Registrar novo usuário completo")
    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> dadosUsuario) {
        try {
            String nomeCompleto = (String) dadosUsuario.get("nomeCompleto");
            String email = (String) dadosUsuario.get("email");
            String senha = (String) dadosUsuario.get("senha");
            LocalDate dataNascimento = LocalDate.parse((String) dadosUsuario.get("dataNascimento"));
            Genero genero = Genero.fromString((String) dadosUsuario.get("genero"));
            
            Usuario usuario = usuarioService.registrarNovoUsuario(
                nomeCompleto, email, senha, dataNascimento, genero);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}