package com.fintech.model;

import com.fintech.enums.CategoriaMeta;
import com.fintech.enums.StatusMeta;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

public class MetaFinanceira {

    private Long idMeta;                // NUMBER (PK)
    private Long idUsuario;             // NUMBER (FK)
    private String nome;                // VARCHAR2(100)
    private String descricao;           // VARCHAR2(255)
    private CategoriaMeta categoria;    // Enum para categoria da meta
    private BigDecimal valorNecessario; // NUMBER
    private BigDecimal valorAcumulado;  // NUMBER
    private LocalDate dataLimite;       // DATE
    private LocalDate dataCriacao;      // DATE
    private StatusMeta status;          // Enum para status da meta

    public MetaFinanceira() {
        this.dataCriacao = LocalDate.now();
        this.status = StatusMeta.ATIVA;
        this.valorAcumulado = BigDecimal.ZERO;
        this.categoria = CategoriaMeta.OUTROS;
    }

    public MetaFinanceira(Long idMeta, Long idUsuario, String nome, String descricao,
                          BigDecimal valorNecessario, BigDecimal valorAcumulado, LocalDate dataLimite) {
        this();
        this.idMeta = idMeta;
        this.idUsuario = idUsuario;
        this.nome = nome;
        this.descricao = descricao;
        this.valorNecessario = valorNecessario;
        this.valorAcumulado = valorAcumulado != null ? valorAcumulado : BigDecimal.ZERO;
        this.dataLimite = dataLimite;
    }

    public MetaFinanceira(Long idMeta, Long idUsuario, String nome, String descricao,
                          CategoriaMeta categoria, BigDecimal valorNecessario, 
                          BigDecimal valorAcumulado, LocalDate dataLimite, StatusMeta status) {
        this(idMeta, idUsuario, nome, descricao, valorNecessario, valorAcumulado, dataLimite);
        this.categoria = categoria != null ? categoria : CategoriaMeta.OUTROS;
        this.status = status != null ? status : StatusMeta.ATIVA;
    }

    public void atualizarProgresso() {
        System.out.println("Atualizando progresso da meta '" + nome + "': " +
                String.format("R$ %.2f / R$ %.2f (%.1f%%)", 
                valorAcumulado, valorNecessario, getPercentualAlcancado()));
    }

    public void verificarPrazo() {
        System.out.println("Verificando prazo da meta '" + nome + "' até " + dataLimite + 
                " (faltam " + getDiasRestantes() + " dias)");
    }

    public boolean adicionarValor(BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        if (!status.isAtiva()) {
            return false; // Não pode adicionar valor se não estiver ativa
        }
        
        valorAcumulado = valorAcumulado.add(valor);
        
        if (valorAcumulado.compareTo(valorNecessario) >= 0) {
            status = StatusMeta.CONCLUIDA;
        }
        
        return true;
    }

    public boolean removerValor(BigDecimal valor) {
        if (valor == null || valor.compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }
        
        if (!status.isAtiva()) {
            return false;
        }
        
        BigDecimal novoValor = valorAcumulado.subtract(valor);
        if (novoValor.compareTo(BigDecimal.ZERO) < 0) {
            valorAcumulado = BigDecimal.ZERO;
        } else {
            valorAcumulado = novoValor;
        }
        
        if (status == StatusMeta.CONCLUIDA && valorAcumulado.compareTo(valorNecessario) < 0) {
            status = StatusMeta.ATIVA;
        }
        
        return true;
    }

    public BigDecimal getPercentualAlcancado() {
        if (valorNecessario.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return valorAcumulado
                .multiply(new BigDecimal("100"))
                .divide(valorNecessario, 2, RoundingMode.HALF_UP);
    }

    public BigDecimal getValorRestante() {
        BigDecimal restante = valorNecessario.subtract(valorAcumulado);
        return restante.compareTo(BigDecimal.ZERO) > 0 ? restante : BigDecimal.ZERO;
    }

    public long getDiasRestantes() {
        if (dataLimite == null) {
            return Long.MAX_VALUE; // Meta sem prazo
        }
        
        long dias = ChronoUnit.DAYS.between(LocalDate.now(), dataLimite);
        return Math.max(0, dias);
    }

    public long getDiasDesdeInicio() {
        if (dataCriacao == null) {
            return 0;
        }
        
        return ChronoUnit.DAYS.between(dataCriacao, LocalDate.now());
    }

    public boolean isVencida() {
        return dataLimite != null && 
               LocalDate.now().isAfter(dataLimite) && 
               status != StatusMeta.CONCLUIDA;
    }

    public boolean isConcluida() {
        return status == StatusMeta.CONCLUIDA || 
               valorAcumulado.compareTo(valorNecessario) >= 0;
    }

    public boolean isProximaVencimento(int diasAntecedencia) {
        if (dataLimite == null) {
            return false;
        }
        
        long diasRestantes = getDiasRestantes();
        return diasRestantes > 0 && diasRestantes <= diasAntecedencia;
    }

    public BigDecimal getEconomiaoDiaria() {
        if (dataLimite == null || getDiasRestantes() == 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal valorRestante = getValorRestante();
        long diasRestantes = getDiasRestantes();
        
        if (diasRestantes == 0) {
            return valorRestante; // Precisa do valor total hoje
        }
        
        return valorRestante.divide(new BigDecimal(diasRestantes), 2, RoundingMode.HALF_UP);
    }

    public void atualizarStatus() {
        if (isConcluida() && status != StatusMeta.CONCLUIDA) {
            status = StatusMeta.CONCLUIDA;
        } else if (isVencida() && status == StatusMeta.ATIVA) {
            status = StatusMeta.VENCIDA;
        }
    }

    public boolean isValid() {
        return idUsuario != null && 
               nome != null && !nome.trim().isEmpty() &&
               valorNecessario != null && valorNecessario.compareTo(BigDecimal.ZERO) > 0 &&
               valorAcumulado != null && valorAcumulado.compareTo(BigDecimal.ZERO) >= 0 &&
               valorAcumulado.compareTo(valorNecessario) <= 0 &&
               status != null &&
               categoria != null;
    }

    public Long getIdMeta() {
        return idMeta;
    }

    public void setIdMeta(Long idMeta) {
        this.idMeta = idMeta;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public CategoriaMeta getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaMeta categoria) {
        this.categoria = categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = CategoriaMeta.fromString(categoria);
    }

    public BigDecimal getValorNecessario() {
        return valorNecessario;
    }

    public void setValorNecessario(BigDecimal valorNecessario) {
        this.valorNecessario = valorNecessario;
    }

    public BigDecimal getValorAcumulado() {
        return valorAcumulado;
    }

    public void setValorAcumulado(BigDecimal valorAcumulado) {
        this.valorAcumulado = valorAcumulado;
        atualizarStatus(); // Atualiza status quando valor muda
    }

    public LocalDate getDataLimite() {
        return dataLimite;
    }

    public void setDataLimite(LocalDate dataLimite) {
        this.dataLimite = dataLimite;
        atualizarStatus(); // Atualiza status quando data muda
    }

    public LocalDate getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDate dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public StatusMeta getStatus() {
        return status;
    }

    public void setStatus(StatusMeta status) {
        this.status = status;
    }

    public void setStatus(String status) {
        this.status = StatusMeta.fromString(status);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MetaFinanceira that = (MetaFinanceira) o;
        return Objects.equals(idMeta, that.idMeta);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idMeta);
    }

    @Override
    public String toString() {
        return "MetaFinanceira{" +
                "idMeta=" + idMeta +
                ", idUsuario=" + idUsuario +
                ", nome='" + nome + '\'' +
                ", categoria=" + categoria +
                ", valorNecessario=" + valorNecessario +
                ", valorAcumulado=" + valorAcumulado +
                ", percentual=" + getPercentualAlcancado() + "%" +
                ", dataLimite=" + dataLimite +
                ", status=" + status +
                '}';
    }
}
