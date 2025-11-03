package com.fintech.config;

import com.fintech.entity.Usuario;
import com.fintech.entity.Transacao;
import com.fintech.entity.Investimento;
import com.fintech.entity.MetaFinanceira;
import com.fintech.enums.*;
import com.fintech.repository.UsuarioRepository;
import com.fintech.repository.TransacaoRepository;
import com.fintech.repository.InvestimentoRepository;
import com.fintech.repository.MetaFinanceiraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@Profile("dev") // Só executa no profile de desenvolvimento
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private TransacaoRepository transacaoRepository;
    
    @Autowired
    private InvestimentoRepository investimentoRepository;
    
    @Autowired
    private MetaFinanceiraRepository metaRepository;
    

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔄 Carregando dados de teste...");
        
        // Verificar se já existem dados de usuários
        if (usuarioRepository.count() > 0) {
            System.out.println("⚠️ Dados de usuários já existem, pulando carga inicial");
            return;
        }
        
        carregarUsuarios();
        carregarTransacoes();
        carregarInvestimentos();
        carregarMetas();
        
        System.out.println("✅ Dados de teste carregados com sucesso!");
    }


    private void carregarUsuarios() {
        System.out.println("👤 Carregando usuários...");
        
        // Usuário 1
        Usuario usuario1 = new Usuario();
        usuario1.setNomeCompleto("João Silva Santos");
        usuario1.setEmail("joao.silva@email.com");
        usuario1.definirSenha("senha123");
        usuario1.setDataNascimento(LocalDate.of(1990, 1, 15));
        usuario1.setGenero(Genero.MASCULINO);
        usuario1.setDataCadastro(LocalDateTime.now().minusDays(45));
        usuario1.ativar();
        
        // Usuário 2
        Usuario usuario2 = new Usuario();
        usuario2.setNomeCompleto("Maria Oliveira Costa");
        usuario2.setEmail("maria.oliveira@email.com");
        usuario2.definirSenha("maria123");
        usuario2.setDataNascimento(LocalDate.of(1985, 7, 22));
        usuario2.setGenero(Genero.FEMININO);
        usuario2.setDataCadastro(LocalDateTime.now().minusDays(30));
        usuario2.ativar();
        
        // Usuário 3
        Usuario usuario3 = new Usuario();
        usuario3.setNomeCompleto("Carlos Pereira Lima");
        usuario3.setEmail("carlos.pereira@email.com");
        usuario3.definirSenha("carlos123");
        usuario3.setDataNascimento(LocalDate.of(1988, 12, 10));
        usuario3.setGenero(Genero.MASCULINO);
        usuario3.setDataCadastro(LocalDateTime.now().minusDays(15));
        usuario3.ativar();
        
        usuarioRepository.save(usuario1);
        usuarioRepository.save(usuario2);
        usuarioRepository.save(usuario3);
        
        System.out.println("✓ 3 usuários criados");
    }

    private void carregarTransacoes() {
        System.out.println("💰 Carregando transações...");
        
        // Transações do Usuário 1 (João)
        // Receitas
        criarTransacao(1L, TipoTransacao.CREDITO, "SALARIO", "Salário Janeiro", 
                      new BigDecimal("4500.00"), LocalDate.now().minusDays(20));
        criarTransacao(1L, TipoTransacao.CREDITO, "FREELANCE", "Projeto consultoria", 
                      new BigDecimal("2000.00"), LocalDate.now().minusDays(15));
        
        // Despesas
        criarTransacao(1L, TipoTransacao.DEBITO, "ALIMENTACAO", "Supermercado", 
                      new BigDecimal("350.00"), LocalDate.now().minusDays(18));
        criarTransacao(1L, TipoTransacao.DEBITO, "TRANSPORTE", "Combustível", 
                      new BigDecimal("200.00"), LocalDate.now().minusDays(10));
        
        // Transações do Usuário 2 (Maria)
        criarTransacao(2L, TipoTransacao.CREDITO, "SALARIO", "Salário Janeiro", 
                      new BigDecimal("6000.00"), LocalDate.now().minusDays(22));
        criarTransacao(2L, TipoTransacao.DEBITO, "MORADIA", "Aluguel", 
                      new BigDecimal("1500.00"), LocalDate.now().minusDays(25));
        
        // Transações do Usuário 3 (Carlos)
        criarTransacao(3L, TipoTransacao.CREDITO, "NEGOCIO", "Venda produto", 
                      new BigDecimal("3200.00"), LocalDate.now().minusDays(12));
        criarTransacao(3L, TipoTransacao.DEBITO, "EDUCACAO", "Curso online", 
                      new BigDecimal("450.00"), LocalDate.now().minusDays(8));
        
        System.out.println("✓ 8 transações criadas");
    }

    private void carregarInvestimentos() {
        System.out.println("📈 Carregando investimentos...");
        
        // Investimentos do João
        criarInvestimento(1L, TipoInvestimento.CDB, new BigDecimal("5000.00"), 
                         LocalDate.now().minusDays(30), null);
        criarInvestimento(1L, TipoInvestimento.TESOURO_SELIC, new BigDecimal("3000.00"), 
                         LocalDate.now().minusDays(25), null);
        
        // Investimentos da Maria
        criarInvestimento(2L, TipoInvestimento.ACAO, new BigDecimal("2000.00"), 
                         LocalDate.now().minusDays(20), null);
        criarInvestimento(2L, TipoInvestimento.POUPANCA, new BigDecimal("1000.00"), 
                         LocalDate.now().minusDays(15), LocalDate.now().minusDays(5)); // Já resgatado
        
        // Investimentos do Carlos
        criarInvestimento(3L, TipoInvestimento.FII, new BigDecimal("4000.00"), 
                         LocalDate.now().minusDays(18), null);
        
        System.out.println("✓ 5 investimentos criados");
    }

    private void carregarMetas() {
        System.out.println("🎯 Carregando metas...");
        
        // Metas do João
        criarMeta(1L, "Viagem Europa", "Economizar para férias na Europa", 
                 CategoriaMeta.VIAGEM, new BigDecimal("15000.00"), new BigDecimal("3500.00"), 
                 LocalDate.now().plusMonths(8), StatusMeta.ATIVA);
        
        criarMeta(1L, "Carro Novo", "Trocar de carro", 
                 CategoriaMeta.CARRO, new BigDecimal("45000.00"), new BigDecimal("12000.00"), 
                 LocalDate.now().plusMonths(12), StatusMeta.ATIVA);
        
        // Metas da Maria
        criarMeta(2L, "Casa Própria", "Comprar apartamento", 
                 CategoriaMeta.CASA, new BigDecimal("80000.00"), new BigDecimal("25000.00"), 
                 LocalDate.now().plusMonths(24), StatusMeta.ATIVA);
        
        criarMeta(2L, "Reserva Emergência", "Fundo de emergência", 
                 CategoriaMeta.EMERGENCIA, new BigDecimal("20000.00"), new BigDecimal("18500.00"), 
                 LocalDate.now().plusMonths(6), StatusMeta.ATIVA);
        
        // Metas do Carlos
        criarMeta(3L, "Especialização", "MBA em Gestão Financeira", 
                 CategoriaMeta.EDUCACAO, new BigDecimal("8000.00"), new BigDecimal("8000.00"), 
                 LocalDate.now().plusMonths(3), StatusMeta.CONCLUIDA); // Já concluída
        
        System.out.println("✓ 5 metas criadas");
    }

    private void criarTransacao(Long idUsuario, TipoTransacao tipo, String categoria, 
                               String descricao, BigDecimal valor, LocalDate data) {
        Transacao transacao = new Transacao();
        transacao.setIdUsuario(idUsuario);
        transacao.setTipoTransacao(tipo);
        transacao.setCategoria(categoria);
        transacao.setDescricao(descricao);
        transacao.setValor(valor);
        transacao.setData(data);
        transacaoRepository.save(transacao);
    }

    private void criarInvestimento(Long idUsuario, TipoInvestimento tipo, BigDecimal valor, 
                                  LocalDate dataAplicacao, LocalDate dataResgate) {
        Investimento investimento = new Investimento();
        investimento.setIdUsuario(idUsuario);
        investimento.setTipo(tipo);
        investimento.setValorInvestido(valor);
        investimento.setDataAplicacao(dataAplicacao);
        investimento.setDataResgate(dataResgate);
        investimentoRepository.save(investimento);
    }

    private void criarMeta(Long idUsuario, String nome, String descricao, CategoriaMeta categoria,
                          BigDecimal valorNecessario, BigDecimal valorAcumulado, 
                          LocalDate dataLimite, StatusMeta status) {
        MetaFinanceira meta = new MetaFinanceira();
        meta.setIdUsuario(idUsuario);
        meta.setNome(nome);
        meta.setDescricao(descricao);
        meta.setCategoria(categoria);
        meta.setValorNecessario(valorNecessario);
        meta.setValorAcumulado(valorAcumulado);
        meta.setDataLimite(dataLimite);
        meta.setStatus(status);
        meta.setDataCriacao(LocalDate.now().minusDays(30));
        metaRepository.save(meta);
    }
}
