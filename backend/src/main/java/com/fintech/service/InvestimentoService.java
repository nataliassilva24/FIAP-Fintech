package com.fintech.service;

import com.fintech.entity.Investimento;
import com.fintech.enums.TipoInvestimento;
import com.fintech.repository.InvestimentoRepository;
import com.fintech.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class InvestimentoService {

    @Autowired
    private InvestimentoRepository investimentoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;

    // CRUD Básico
    public Investimento salvar(Investimento investimento) {
        validarInvestimento(investimento);
        validarUsuarioExiste(investimento.getIdUsuario());
        
        return investimentoRepository.save(investimento);
    }

    public Investimento atualizar(Investimento investimento) {
        if (investimento.getIdInvestimento() == null) {
            throw new IllegalArgumentException("ID do investimento é obrigatório para atualização");
        }
        
        validarInvestimento(investimento);
        validarUsuarioExiste(investimento.getIdUsuario());
        
        return investimentoRepository.save(investimento);
    }

    @Transactional(readOnly = true)
    public Investimento buscarPorId(Long id) {
        return investimentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Investimento não encontrado com ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Investimento> listarTodos() {
        return investimentoRepository.findAll();
    }

    public void deletar(Long id) {
        Investimento investimento = buscarPorId(id);
        investimentoRepository.delete(investimento);
    }

    // Busca por usuário
    @Transactional(readOnly = true)
    public List<Investimento> listarPorUsuario(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return investimentoRepository.findByIdUsuario(idUsuario);
    }

    // Gestão de investimentos ativos/resgatados
    @Transactional(readOnly = true)
    public List<Investimento> listarInvestimentosAtivos() {
        return investimentoRepository.findInvestimentosAtivos();
    }

    @Transactional(readOnly = true)
    public List<Investimento> listarInvestimentosAtivosPorUsuario(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return investimentoRepository.findInvestimentosAtivosByUsuario(idUsuario);
    }

    // Resgate de investimento
    public Investimento resgatar(Long id) {
        Investimento investimento = buscarPorId(id);
        
        if (investimento.isResgatado()) {
            throw new IllegalStateException("Investimento já foi resgatado");
        }
        
        investimento.setDataResgate(LocalDate.now());
        return investimentoRepository.save(investimento);
    }

    // Busca por tipo
    @Transactional(readOnly = true)
    public List<Investimento> listarPorTipo(TipoInvestimento tipo) {
        return investimentoRepository.findByTipo(tipo);
    }

    @Transactional(readOnly = true)
    public List<Investimento> listarPorUsuarioETipo(Long idUsuario, TipoInvestimento tipo) {
        validarUsuarioExiste(idUsuario);
        return investimentoRepository.findByIdUsuarioAndTipo(idUsuario, tipo);
    }

    // Cálculos financeiros
    @Transactional(readOnly = true)
    public BigDecimal calcularTotalInvestido(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal total = investimentoRepository.sumTotalInvestidoByUsuario(idUsuario);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal calcularTotalInvestidoAtivo(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        BigDecimal total = investimentoRepository.sumTotalInvestidoAtivoByUsuario(idUsuario);
        return total != null ? total : BigDecimal.ZERO;
    }

    // Relatórios e estatísticas
    @Transactional(readOnly = true)
    public List<Object[]> obterResumoInvestimentosPorTipo(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return investimentoRepository.getResumoInvestimentosPorTipo(idUsuario);
    }

    @Transactional(readOnly = true)
    public List<Object[]> obterDistribuicaoCarteira(Long idUsuario) {
        validarUsuarioExiste(idUsuario);
        return investimentoRepository.getDistribuicaoCarteiraAtiva(idUsuario);
    }

    // Operações específicas do negócio
    public Investimento aplicar(Long idUsuario, TipoInvestimento tipo, BigDecimal valor, LocalDate dataAplicacao) {
        Investimento investimento = new Investimento();
        investimento.setIdUsuario(idUsuario);
        investimento.setTipo(tipo);
        investimento.setValorInvestido(valor);
        investimento.setDataAplicacao(dataAplicacao != null ? dataAplicacao : LocalDate.now());
        
        return salvar(investimento);
    }

    // Validações
    private void validarInvestimento(Investimento investimento) {
        if (investimento == null) {
            throw new IllegalArgumentException("Investimento não pode ser nulo");
        }
        
        if (investimento.getValorInvestido() == null || investimento.getValorInvestido().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Valor investido deve ser maior que zero");
        }
        
        if (investimento.getDataAplicacao() != null && investimento.getDataAplicacao().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Data de aplicação não pode ser futura");
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