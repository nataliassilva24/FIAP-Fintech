package com.fintech.service;

import com.fintech.entity.MetaFinanceira;
import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;
import com.fintech.repository.MetaFinanceiraRepository;
import com.fintech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class MetaFinanceiraService {

    @Autowired
    private MetaFinanceiraRepository metaRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // CRUD Básico
    public MetaFinanceira salvar(MetaFinanceira meta) {
        validarMeta(meta);
        validarUsuarioExiste(meta.getIdUsuario());
        
        return metaRepository.save(meta);
    }

    public MetaFinanceira atualizar(MetaFinanceira meta) {
        if (meta.getIdMeta() == null) {
            throw new IllegalArgumentException("ID da meta é obrigatório para atualização");
        }
        
        validarMeta(meta);
        validarUsuarioExiste(meta.getIdUsuario());
        
        return metaRepository.save(meta);
    }

    @Transactional(readOnly = true)
    public MetaFinanceira buscarPorId(Long id) {
        return metaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meta não encontrada com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarTodas() {
        return metaRepository.findAll();
    }

    public void deletar(Long id) {
        MetaFinanceira meta = buscarPorId(id);
        metaRepository.delete(meta);
    }

    // Busca por usuário
    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarPorUsuario(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.findByIdUsuarioOrderByDataCriacaoDesc(idUsuario);
    }

    // Busca por status
    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarPorStatus(StatusMeta status) {
        return metaRepository.findByStatus(status);
    }

    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarPorUsuarioEStatus(Long idUsuario, StatusMeta status) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.findByIdUsuarioAndStatus(idUsuario, status);
    }

    // Metas ativas
    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarMetasAtivas() {
        return metaRepository.findMetasAtivas();
    }

    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarMetasAtivasPorUsuario(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.findMetasAtivasByUsuario(idUsuario);
    }

    // Metas concluídas
    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarMetasConcluidasPorUsuario(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.findMetasConcluidasByUsuario(idUsuario);
    }

    // Busca por categoria
    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarPorCategoria(CategoriaMeta categoria) {
        return metaRepository.findByCategoria(categoria);
    }

    @Transactional(readOnly = true)
    public List<MetaFinanceira> listarPorUsuarioECategoria(Long idUsuario, CategoriaMeta categoria) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.findByIdUsuarioAndCategoria(idUsuario, categoria);
    }

    // Operações de valor
    public MetaFinanceira adicionarValor(Long idMeta, BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor deve ser maior que zero");
        }
        
        MetaFinanceira meta = buscarPorId(idMeta);
        
        if (!meta.getStatus().isAtiva()) {
            throw new IllegalStateException("Não é possível adicionar valor a uma meta inativa");
        }
        
        BigDecimal novoValor = meta.getValorAcumulado().add(valor);
        meta.setValorAcumulado(novoValor);
        
        // Atualizar status se necessário
        if (novoValor.compareTo(meta.getValorNecessario()) >= 0) {
            meta.setStatus(StatusMeta.CONCLUIDA);
        }
        
        return metaRepository.save(meta);
    }

    // Cálculos financeiros
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalNecessarioMetasAtivas(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal total = metaRepository.sumValorNecessarioMetasAtivas(idUsuario);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotalAcumuladoMetasAtivas(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal total = metaRepository.sumValorAcumuladoMetasAtivas(idUsuario);
        return total != null ? total : BigDecimal.ZERO;
    }

    // Relatórios e estatísticas
    @Transactional(readOnly = true)
    public List<Object[]> obterResumoMetasPorCategoria(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.getResumoMetasPorCategoria(idUsuario);
    }

    // Operações específicas do negócio
    public MetaFinanceira criarMeta(Long idUsuario, String nome, String descricao, 
                                   CategoriaMeta categoria, BigDecimal valorNecessario, LocalDate dataLimite) {
        MetaFinanceira meta = new MetaFinanceira();
        meta.setIdUsuario(idUsuario);
        meta.setNome(nome);
        meta.setDescricao(descricao);
        meta.setCategoria(categoria);
        meta.setValorNecessario(valorNecessario);
        meta.setDataLimite(dataLimite);
        meta.setStatus(StatusMeta.ATIVA);
        
        return salvar(meta);
    }

    // Contadores
    @Transactional(readOnly = true)
    public long contarMetasAtivas(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.countMetasAtivas(idUsuario);
    }

    @Transactional(readOnly = true)
    public long contarMetasConcluidas(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return metaRepository.countMetasConcluidas(idUsuario);
    }

    // Validações
    private void validarMeta(MetaFinanceira meta) {
        if (meta == null) {
            throw new IllegalArgumentException("Meta não pode ser nula");
        }
        
        if (meta.getValorNecessario() == null || meta.getValorNecessario().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor necessário deve ser maior que zero");
        }
        
        if (meta.getValorAcumulado() != null && meta.getValorAcumulado().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Valor acumulado não pode ser negativo");
        }
        
        if (meta.getDataLimite() != null && meta.getDataLimite().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Data limite não pode ser no passado");
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
}