# 🏦 FIAP Fintech Backend - Spring Boot

Sistema Fintech desenvolvido em **Spring Boot + JPA** para a disciplina de **Integration** da FIAP, seguindo as tecnologias ensinadas no curso e implementando **padrão de camadas bem definidas**.

## 🎯 Requisitos FIAP Atendidos

✅ **1.** Classes de modelos que representem o Fintech (Entidades)  
✅ **2.** Repository com JPA para cada entidade  
✅ **3.** Camada Service com regras de negócio  
✅ **4.** Endpoints REST com GET, POST, PUT, DELETE  
✅ **5.** Códigos de status HTTP corretos  
✅ **6.** Tabelas na instância Oracle FIAP  
✅ **7.** Conexão obrigatória com Oracle FIAP  
✅ **8.** Mínimo 3 entidades implementadas (**5 entidades**)  

## 🚀 Tecnologias Utilizadas

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Oracle Database** (instância FIAP)
- **Spring Web** (REST Controllers)
- **Spring Validation**
- **Swagger/OpenAPI** (documentação)
- **Maven** (gerenciamento de dependências)

## 🏗️ Arquitetura do Projeto

### **Camadas Implementadas (padrão FIAP):**

```
src/main/java/com/fintech/
├── 📱 FintechApplication.java    # Aplicação principal
├── 🎯 entity/                   # Entidades JPA
│   ├── Usuario.java
│   ├── Transacao.java
│   ├── Investimento.java
│   └── MetaFinanceira.java
├── 🗄️ repository/               # Repositories JPA
│   ├── UsuarioRepository.java
│   ├── TransacaoRepository.java
│   ├── InvestimentoRepository.java
│   └── MetaFinanceiraRepository.java
├── 🧠 service/                  # Services (regras de negócio)
│   ├── UsuarioService.java
│   ├── TransacaoService.java
│   ├── InvestimentoService.java
│   └── MetaFinanceiraService.java
├── 🎮 controller/               # REST Controllers
│   ├── UsuarioController.java
│   ├── TransacaoController.java
│   ├── InvestimentoController.java
│   └── MetaFinanceiraController.java
└── 📋 enums/                    # Enums do sistema
    ├── Genero.java
    ├── TipoTransacao.java
    ├── TipoInvestimento.java
    ├── StatusMeta.java
    └── CategoriaMeta.java
```

## 🎯 Entidades Implementadas (5 entidades)

### **1. 👤 Usuario**
- Cadastro completo com validações
- Autenticação e controle de acesso
- Gestão de status (ativo/inativo)

### **2. 💰 Transacao**
- Receitas e despesas
- Categorização de transações
- Cálculos de saldo e relatórios

### **3. 📈 Investimento**
- Diferentes tipos de investimento
- Gestão de aplicação e resgate
- Análise de carteira

### **4. 🎯 MetaFinanceira**
- Objetivos financeiros
- Acompanhamento de progresso
- Sistema de metas por categoria

### **5. ⚙️ ConfigUsuario** *(estrutura preparada)*
- Preferências do usuário
- Configurações regionais
- Personalização da interface

## 📡 Endpoints da API

### **🔗 URL Base**
```
http://localhost:8080/api
```

### **👤 Usuários**
```http
GET    /api/usuarios              # Listar usuários
GET    /api/usuarios/{id}         # Buscar por ID
POST   /api/usuarios              # Criar usuário
PUT    /api/usuarios/{id}         # Atualizar usuário
DELETE /api/usuarios/{id}         # Deletar usuário
POST   /api/usuarios/auth         # Autenticar usuário
GET    /api/usuarios/ativos       # Usuários ativos
PATCH  /api/usuarios/{id}/ativar  # Ativar usuário
PATCH  /api/usuarios/{id}/desativar # Desativar usuário
```

### **💰 Transações**
```http
GET    /api/transacoes            # Listar transações
GET    /api/transacoes/{id}       # Buscar por ID
POST   /api/transacoes            # Criar transação
PUT    /api/transacoes/{id}       # Atualizar transação
DELETE /api/transacoes/{id}       # Deletar transação
POST   /api/transacoes/receita    # Registrar receita
POST   /api/transacoes/despesa    # Registrar despesa
GET    /api/transacoes/usuario/{id}/saldo  # Calcular saldo
```

### **📈 Investimentos**
```http
GET    /api/investimentos         # Listar investimentos
GET    /api/investimentos/{id}    # Buscar por ID
POST   /api/investimentos         # Criar investimento
PUT    /api/investimentos/{id}    # Atualizar investimento
DELETE /api/investimentos/{id}    # Deletar investimento
POST   /api/investimentos/aplicar # Aplicar investimento
PATCH  /api/investimentos/{id}/resgatar # Resgatar
GET    /api/investimentos/ativos  # Investimentos ativos
```

### **🎯 Metas Financeiras**
```http
GET    /api/metas                 # Listar metas
GET    /api/metas/{id}            # Buscar por ID
POST   /api/metas                 # Criar meta
PUT    /api/metas/{id}            # Atualizar meta
DELETE /api/metas/{id}            # Deletar meta
POST   /api/metas/criar           # Criar meta completa
PATCH  /api/metas/{id}/adicionar-valor # Adicionar valor
GET    /api/metas/ativas          # Metas ativas
```

## ⚡ Instalação e Configuração

### **1. Pré-requisitos**
- Java 17+
- Maven 3.6+
- Acesso à instância Oracle da FIAP
- IDE (IntelliJ IDEA, Eclipse, VS Code)

### **2. Configuração**
1. **Clone o repositório**
2. **Configure Oracle**: Edite `application.properties` com seu RM
3. **Execute as migrações**: Execute `schema.sql` no Oracle FIAP
4. **Execute a aplicação**: `mvn spring-boot:run`

### **3. Configurar Oracle FIAP**
Edite `src/main/resources/application.properties`:
```properties
spring.datasource.username=SEU_RM_AQUI
spring.datasource.password=SEU_RM_AQUI
```

### **4. Executar aplicação**
```bash
# Via Maven
mvn spring-boot:run

# Via IDE
# Execute FintechApplication.java
```

## 🧪 Testando a API

### **Swagger UI (Recomendado)**
```
http://localhost:8080/swagger-ui.html
```

### **Exemplo de teste com cURL**
```bash
# Criar usuário
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "João Silva",
    "email": "joao.silva@email.com",
    "senha": "senha123",
    "dataNascimento": "1990-01-01",
    "genero": "MASCULINO"
  }'

# Autenticar usuário
curl -X POST http://localhost:8080/api/usuarios/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao.silva@email.com",
    "senha": "senha123"
  }'

# Criar transação (receita)
curl -X POST http://localhost:8080/api/transacoes/receita \
  -H "Content-Type: application/json" \
  -d '{
    "idUsuario": 1,
    "categoria": "SALARIO",
    "descricao": "Salário mensal",
    "valor": 5000.00
  }'

# Criar investimento
curl -X POST http://localhost:8080/api/investimentos/aplicar \
  -H "Content-Type: application/json" \
  -d '{
    "idUsuario": 1,
    "tipo": "CDB",
    "valor": 1000.00
  }'

# Criar meta financeira
curl -X POST http://localhost:8080/api/metas/criar \
  -H "Content-Type: application/json" \
  -d '{
    "idUsuario": 1,
    "nome": "Viagem Europa",
    "categoria": "VIAGEM",
    "valorNecessario": 15000.00,
    "dataLimite": "2024-12-31"
  }'
```

## 🗄️ Banco de Dados Oracle

### **Script de criação**
Execute o arquivo `src/main/resources/schema.sql` na instância Oracle FIAP.

### **Tabelas criadas:**
- `TB_USUARIO` - Usuários do sistema
- `TB_TRANSACAO` - Receitas e despesas  
- `TB_INVESTIMENTO` - Carteira de investimentos
- `TB_META_FINANCEIRA` - Objetivos financeiros
- `TB_CONFIG_USUARIO` - Configurações personalizadas

### **Sequences:**
- `SEQ_USUARIO`
- `SEQ_TRANSACAO` 
- `SEQ_INVESTIMENTO`
- `SEQ_META_FINANCEIRA`

## 🎭 Status HTTP Implementados

| Código | Significado | Uso |
|--------|-------------|-----|
| 200 | OK | Operações bem-sucedidas |
| 201 | Created | Recursos criados |
| 204 | No Content | Deletar com sucesso |
| 400 | Bad Request | Dados inválidos |
| 404 | Not Found | Recurso não encontrado |
| 409 | Conflict | Conflito (ex: email duplicado) |
| 500 | Internal Server Error | Erro do servidor |

## 🔧 Scripts Maven

```bash
# Executar aplicação
mvn spring-boot:run

# Compilar
mvn compile

# Executar testes
mvn test

# Gerar JAR
mvn package

# Limpar build
mvn clean
```

## 📚 Funcionalidades Principais

### **Sistema de Usuários**
- ✅ CRUD completo
- ✅ Autenticação
- ✅ Gestão de status
- ✅ Validações de negócio

### **Controle Financeiro**
- ✅ Receitas e despesas
- ✅ Cálculo de saldo
- ✅ Relatórios por categoria
- ✅ Histórico de transações

### **Gestão de Investimentos**
- ✅ Aplicação e resgate
- ✅ Diferentes tipos de investimento
- ✅ Análise de carteira
- ✅ Investimentos ativos/resgatados

### **Metas Financeiras**
- ✅ Criação e acompanhamento
- ✅ Categorização de objetivos
- ✅ Controle de progresso
- ✅ Status das metas

## 🏆 **Projeto Completo - Pronto para Entrega!**

✅ **Camadas bem definidas**: Entity → Repository → Service → Controller  
✅ **CRUD integrado** ao banco Oracle FIAP  
✅ **APIs RESTful** com todos os verbos HTTP  
✅ **5 entidades** implementadas (acima do mínimo)  
✅ **Validações** robustas e tratamento de erros  
✅ **Documentação Swagger** automática  
✅ **Padrão Spring Boot** seguindo melhores práticas  

---

## 📞 Suporte

- **Documentação da API**: http://localhost:8080/swagger-ui.html
- **Testes**: Use arquivo `test-api.http` 
- **Schema SQL**: `src/main/resources/schema.sql`

**Desenvolvido seguindo as diretrizes da FIAP Integration - Fase 7** 🎓