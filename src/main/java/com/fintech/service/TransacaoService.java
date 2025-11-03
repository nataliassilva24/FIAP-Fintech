package com.fintech.service;

import com.fintech.entity.Transacao;
import com.fintech.enums.TipoTransacao;
import com.fintech.repository.TransacaoRepository;
import com.fintech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class TransacaoService {

    @Autowired
    private TransacaoRepository transacaoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // CRUD Básico
    public Transacao salvar(Transacao transacao) {
        validarTransacao(transacao);
        validarUsuarioExiste(transacao.getIdUsuario());
        
        return transacaoRepository.save(transacao);
    }

    public Transacao atualizar(Transacao transacao) {
        if (transacao.getIdTransacao() == null) {
            throw new IllegalArgumentException("ID da transação é obrigatório para atualização");
        }
        
        validarTransacao(transacao);
        validarUsuarioExiste(transacao.getIdUsuario());
        
        return transacaoRepository.save(transacao);
    }

    @Transactional(readOnly = true)
    public Transacao buscarPorId(Long id) {
        return transacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Transacao> listarTodas() {
        return transacaoRepository.findAll();
    }

    public void deletar(Long id) {
        Transacao transacao = buscarPorId(id);
        transacaoRepository.delete(transacao);
    }

    // Busca por usuário
    @Transactional(readOnly = true)
    public List<Transacao> listarPorUsuario(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return transacaoRepository.findByIdUsuarioOrderByDataDesc(idUsuario);
    }

    // Busca por tipo
    @Transactional(readOnly = true)
    public List<Transacao> listarPorTipo(TipoTransacao tipo) {
        return transacaoRepository.findByTipoTransacao(tipo);
    }

    @Transactional(readOnly = true)
    public List<Transacao> listarPorUsuarioETipo(Long idUsuario, TipoTransacao tipo) {
        validarUsuarioExiste(idUsuario);
        return transacaoRepository.findByIdUsuarioAndTipoTransacao(idUsuario, tipo);
    }

    // Busca por categoria
    @Transactional(readOnly = true)
    public List<Transacao> listarPorCategoria(String categoria) {
        return transacaoRepository.findByCategoriaIgnoreCase(categoria);
    }

    // Busca por período
    @Transactional(readOnly = true)
    public List<Transacao> listarPorPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        validarPeriodo(dataInicio, dataFim);
        return transacaoRepository.findByDataBetween(dataInicio, dataFim);
    }

    @Transactional(readOnly = true)
    public List<Transacao> listarPorUsuarioEPeriodo(Long idUsuario, LocalDate dataInicio, LocalDate dataFim) {
        validarUsuarioExiste(idUsuario);
        validarPeriodo(dataInicio, dataFim);
        return transacaoRepository.findByIdUsuarioAndDataBetween(idUsuario, dataInicio, dataFim);
    }

    // Operações financeiras
    @Transactional(readOnly = true)
    public BigDecimal calcularSaldo(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal saldo = transacaoRepository.calcularSaldoUsuario(idUsuario);
        return saldo != null ? saldo : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotalReceitas(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal total = transacaoRepository.sumValoresByUsuarioAndTipo(idUsuario, TipoTransacao.CREDITO);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotalDespesas(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal total = transacaoRepository.sumValoresByUsuarioAndTipo(idUsuario, TipoTransacao.DEBITO);
        return total != null ? total : BigDecimal.ZERO;
    }

    // Relatórios e estatísticas
    @Transactional(readOnly = true)
    public List<Object[]> obterGastosPorCategoria(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return transacaoRepository.sumGastosPorCategoria(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Object[]> obterReceitasPorCategoria(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return transacaoRepository.sumReceitasPorCategoria(idUsuario);
    }

    // Operações específicas do negócio
    public Transacao registrarReceita(Long idUsuario, String categoria, String descricao, 
                                     BigDecimal valor, LocalDate data) {
        Transacao transacao = new Transacao();
        transacao.setIdUsuario(idUsuario);
        transacao.setTipoTransacao(TipoTransacao.CREDITO);
        transacao.setCategoria(categoria);
        transacao.setDescricao(descricao);
        transacao.setValor(valor);
        transacao.setData(data != null ? data : LocalDate.now());
        
        return salvar(transacao);
    }

    public Transacao registrarDespesa(Long idUsuario, String categoria, String descricao, 
                                     BigDecimal valor, LocalDate data) {
        Transacao transacao = new Transacao();
        transacao.setIdUsuario(idUsuario);
        transacao.setTipoTransacao(TipoTransacao.DEBITO);
        transacao.setCategoria(categoria);
        transacao.setDescricao(descricao);
        transacao.setValor(valor);
        transacao.setData(data != null ? data : LocalDate.now());
        
        return salvar(transacao);
    }

    // Validações
    private void validarTransacao(Transacao transacao) {
        if (transacao == null) {
            throw new IllegalArgumentException("Transação não pode ser nula");
        }
        
        if (transacao.getValor() == null || transacao.getValor().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        if (transacao.getCategoria() == null || transacao.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException("Categoria é obrigatória");
        }
    }

    private void validarUsuarioExiste(Long idUsuario) {
        if (idUsuario == null) {
            throw new IllegalArgumentException("ID do usuário é obrigatório");
        }
        
        if (!usuarioRepository.existsById(idUsuario)) {
            throw new RuntimeException("Usuário não encontrado com ID: " + idUsuario);
        }
    }

    private void validarPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        if (dataInicio == null || dataFim == null) {
            throw new IllegalArgumentException("Datas de início e fim são obrigatórias");
        }
        
        if (dataInicio.isAfter(dataFim)) {
            throw new IllegalArgumentException("Data de início deve ser anterior à data de fim");
        }
    }
}