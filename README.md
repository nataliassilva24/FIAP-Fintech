# 🏦 FIAP Fintech - Sistema de Controle Financeiro

Sistema Fintech completo desenvolvido com **Spring Boot (Backend)** e **React/TypeScript (Frontend)** para a disciplina de **Integration** da FIAP.

## 🚀 **Como Executar o Projeto**

### **📋 Pré-requisitos**
- **Acesso Oracle FIAP** credenciais válidas
- **macOS/Linux** com Homebrew

### **⚡ Execução Simples (Recomendado)**

```bash

# 1. Instalar dependências (apenas uma vez)
make install

# 2. Iniciar projeto completo
make start

# ✅ Pronto! O sistema estará rodando:
# 🎨 Frontend: http://localhost:3000
# 🔧 Backend:  http://localhost:8080/api
# 📚 Swagger:  http://localhost:8080/api/swagger-ui.html
```

> **💡 Dois comandos simples:**
> 
> **`make install`** (executar apenas uma vez):
> - Instala Java, Maven (se necessário)
> - Instala dependências npm do frontend
> 
> **`make start`** (executar sempre que quiser iniciar):
> - **Oracle conecta automaticamente** via Spring Boot
> - Inicia backend e frontend
> - Testa integração completa

## 🎯 **Como Usar o Sistema**

### **🚀 Passo 1: Iniciar Projeto**
```bash
make install  # Instalar dependências (uma vez)
make start    # Iniciar sistema completo
```

### **👤 Passo 2: Escolher Forma de Acesso**

#### **📋 Opção A: Dados de Demonstração**
```bash
# Em outro terminal, obter credenciais de teste:
make create-demo-data
```

#### **📋 Opção B: Criar Seu Próprio Usuário, depois de iniciar o projeto**
1. **Acesse:** http://localhost:3000
2. **Clique:** "→ Iniciar sessão"
3. **Aba:** "CADASTRAR"
4. **Preencha:** seus dados pessoais
5. **Explore:** todas as funcionalidades do sistema

---

## 🏗️ **Arquitetura do Sistema**

### **Backend (Spring Boot)** 
```
backend/
├── src/main/java/com/fintech/
│   ├── entity/          # 4 Entidades JPA
│   ├── repository/      # 4 Repositories JPA  
│   ├── service/         # 4 Services (regras negócio)
│   ├── controller/      # 4 Controllers REST
│   ├── dto/             # 4 DTOs para API
│   ├── mapper/          # 4 Mappers Entity↔DTO
│   └── exception/       # Tratamento de erros
├── src/main/resources/
│   ├── application.properties  # Config Oracle
│   └── schema.sql              # Scripts banco
└── pom.xml                     # Dependencies Maven
```

### **Frontend (React/TypeScript)**
```
frontend/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/           # 6 Páginas principais  
│   ├── services/        # 5 Services API
│   ├── hooks/           # Hooks customizados
│   ├── contexts/        # Estado global
│   ├── routes/          # Rotas SPA
│   └── types/           # Interfaces TypeScript
├── package.json         # Dependencies npm
└── vite.config.ts       # Config Vite
```

---

## 🎨 **Tecnologias Utilizadas**

### **Backend:**
- **Java 17** + **Spring Boot 3.2.0**
- **Spring Data JPA** + **Oracle Database**
- **Spring Validation** + **Swagger OpenAPI**
- **Maven** para build e dependências

### **Frontend:**
- **React 18** + **TypeScript 5**
- **Vite** para build e desenvolvimento
- **React Router** para SPA
- **CSS-in-JS** para estilização

---

## 📱 **Páginas do Sistema**

| Página | URL | Funcionalidade | Status |
|--------|-----|----------------|--------|
| **Homepage** | `/` | Apresentação do sistema | ✅ |
| **Login** | `/login` | Autenticação + Cadastro | ✅ |
| **Dashboard** | `/dashboard` | Visão geral financeira | ✅ |
| **Transações** | `/transacoes` | CRUD transações | ✅ |
| **Investimentos** | `/investimentos` | CRUD investimentos | ✅ |
| **Metas** | `/metas` | CRUD metas + contribuições | ✅ |

---