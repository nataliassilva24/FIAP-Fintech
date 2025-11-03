package com.fintech.service;

import com.fintech.entity.Usuario;
import com.fintech.enums.Genero;
import com.fintech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Constantes de validação
    private static final int NOME_MIN_LENGTH = 2;
    private static final int SENHA_MIN_LENGTH = 6;

    // CRUD Básico
    public Usuario salvar(Usuario usuario) {
        validarUsuario(usuario);
        
        // Verifica se email já existe
        if (usuario.getIdUsuario() == null && usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado: " + usuario.getEmail());
        }
        
        // Hash da senha se for nova
        if (usuario.getIdUsuario() == null && usuario.getSenha() != null) {
            usuario.definirSenha(usuario.getSenha());
        }
        
        return usuarioRepository.save(usuario);
    }

    public Usuario atualizar(Usuario usuario) {
        if (usuario.getIdUsuario() == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório para atualização");
        }
        
        Usuario usuarioExistente = buscarPorId(usuario.getIdUsuario());
        
        // Verifica se email foi alterado e se já existe
        if (!usuarioExistente.getEmail().equals(usuario.getEmail()) && 
            usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("Email já cadastrado: " + usuario.getEmail());
        }
        
        validarUsuario(usuario);
        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public void deletar(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }

    // Busca por email
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    // Autenticação
    @Transactional(readOnly = true)
    public Optional<Usuario> autenticar(String email, String senha) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmailAndAtivo(email);
        
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            if (usuario.validarSenha(senha)) {
                // Atualiza último login
                usuario.autenticar();
                usuarioRepository.save(usuario);
                return Optional.of(usuario);
            }
        }
        
        return Optional.empty();
    }

    // Gestão de usuários
    @Transactional(readOnly = true)
    public List<Usuario> listarUsuariosAtivos() {
        return usuarioRepository.findUsuariosAtivos();
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarUsuariosInativos() {
        return usuarioRepository.findUsuariosInativos();
    }

    public Usuario ativarUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.ativar();
        return usuarioRepository.save(usuario);
    }

    public Usuario desativarUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.desativar();
        return usuarioRepository.save(usuario);
    }

    // Busca e filtros
    @Transactional(readOnly = true)
    public List<Usuario> buscarPorNome(String nome) {
        return usuarioRepository.findByNomeCompletoContainingIgnoreCase(nome);
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarPorGenero(Genero genero) {
        return usuarioRepository.findByGenero(genero);
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscarUsuariosNovos() {
        LocalDateTime dataLimite = LocalDateTime.now().minusDays(30);
        return usuarioRepository.findUsuariosNovos(dataLimite);
    }

    // Validações de negócio
    private void validarUsuario(Usuario usuario) {
        if (usuario == null) {
            throw new IllegalArgumentException("Usuário não pode ser nulo");
        }
        
        if (usuario.getNomeCompleto() == null || usuario.getNomeCompleto().trim().length() < NOME_MIN_LENGTH) {
            throw new IllegalArgumentException("Nome deve ter pelo menos " + NOME_MIN_LENGTH + " caracteres");
        }
        
        if (usuario.getEmail() == null || !isEmailValido(usuario.getEmail())) {
            throw new IllegalArgumentException("Email inválido");
        }
        
        if (usuario.getDataNascimento() == null || !usuario.temIdadeMinima()) {
            throw new IllegalArgumentException("Usuário deve ter pelo menos 16 anos");
        }
    }

    // Operações específicas do negócio
    public Usuario registrarNovoUsuario(String nomeCompleto, String email, String senha, 
                                       LocalDate dataNascimento, Genero genero) {
        
        if (usuarioRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email já cadastrado: " + email);
        }
        
        Usuario usuario = new Usuario();
        usuario.setNomeCompleto(nomeCompleto);
        usuario.setEmail(email);
        usuario.definirSenha(senha);
        usuario.setDataNascimento(dataNascimento);
        usuario.setGenero(genero);
        usuario.registrar();
        
        return usuarioRepository.save(usuario);
    }

    // Estatísticas
    @Transactional(readOnly = true)
    public long contarUsuariosAtivos() {
        return usuarioRepository.countUsuariosAtivos();
    }

    @Transactional(readOnly = true)
    public long contarUsuariosCadastradosUltimoMes() {
        LocalDateTime dataInicio = LocalDateTime.now().minusMonths(1);
        return usuarioRepository.countUsuariosCadastradosApos(dataInicio);
    }

    private boolean isEmailValido(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        
        // Regex simples para validar email
        return email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }
}