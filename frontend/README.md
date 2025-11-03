# 🏦 FIAP Fintech Frontend - React + TypeScript

Frontend desenvolvido em **React + TypeScript + Vite** para a disciplina **Integration** da FIAP, implementando todas as funcionalidades do sistema Fintech com **design system inspirado no BTG**.

## ✅ Requisitos FIAP Atendidos

✅ **1.** Estruturar o projeto com componentização  
✅ **2.** Implementar rotas de navegação SPA (React Router)  
✅ **3.** Utilizar props e estado (Hooks) para comunicação  
✅ **4.** Criar página de autenticação (Login)  
✅ **5.** Criar página inicial e página de erro personalizada  
✅ **6.** Criar páginas para cada Controller do Backend (4+ entidades)  
✅ **7.** Conectar frontend ao backend via APIs REST  

## 🚀 Tecnologias Utilizadas

- **React 18** com Hooks
- **TypeScript** para tipagem forte
- **Vite** para build e desenvolvimento
- **React Router DOM** para navegação SPA
- **Styled Components** para estilização
- **Axios** para consumo de APIs REST
- **React Hook Form** para formulários
- **Lucide React** para ícones
- **React Hot Toast** para notificações

## 🎨 Design System BTG

### **Características:**
- 🎨 **Paleta de cores** inspirada no BTG
- 🌙 **Tema escuro** predominante
- ✨ **Gradientes** e efeitos visuais
- 📱 **Design responsivo** mobile-first
- ⚡ **Animações suaves** e transitions
- 🧩 **Componentes reutilizáveis**

### **Componentes implementados:**
- `Button` - Botões com variantes BTG
- `Input` - Campos de entrada estilizados
- `Card` - Cards com gradientes
- `Layout` - Estrutura da aplicação
- `ProtectedRoute` - Rotas protegidas

## 🏗️ Estrutura do Projeto

```
frontend/src/
├── 📱 App.tsx                    # Aplicação principal
├── 🚀 main.tsx                   # Entry point
├── 🎯 components/
│   ├── ui/                      # Componentes base UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   └── layout/                  # Componentes de layout
│       ├── Layout.tsx
│       └── ProtectedRoute.tsx
├── 📄 pages/
│   ├── auth/                    # Páginas de autenticação
│   │   └── LoginPage.tsx
│   ├── dashboard/               # Dashboard principal
│   │   └── DashboardPage.tsx
│   ├── home/                    # Página inicial
│   │   └── HomePage.tsx
│   ├── errors/                  # Páginas de erro
│   │   ├── ErrorPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── usuarios/                # CRUD Usuários
│   │   └── UsuariosPage.tsx
│   ├── transacoes/              # CRUD Transações
│   │   └── TransacoesPage.tsx
│   ├── investimentos/           # CRUD Investimentos
│   │   └── InvestimentosPage.tsx
│   └── metas/                   # CRUD Metas
│       └── MetasPage.tsx
├── 🔌 services/
│   └── api.ts                   # Cliente API REST
├── 🎭 contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── 📝 types/
│   └── entities.ts              # Tipos TypeScript
└── 🎨 styles/
    ├── tokens.ts                # Design tokens BTG
    └── GlobalStyles.ts          # Estilos globais
```

## 📡 Funcionalidades Implementadas

### **🔐 Sistema de Autenticação**
- ✅ Login com validação
- ✅ Context API para state global
- ✅ Proteção de rotas
- ✅ Persistência de login
- ✅ Logout automático

### **🏠 Navegação SPA**
- ✅ React Router configurado
- ✅ Sidebar com navegação
- ✅ Layout responsivo
- ✅ Breadcrumbs e navegação

### **👤 Gestão de Usuários**
- ✅ Listar usuários
- ✅ Buscar e filtrar
- ✅ Visualizar detalhes
- ✅ Ações de CRUD

### **💰 Controle Financeiro**
- ✅ Dashboard com resumo financeiro
- ✅ Listagem de transações
- ✅ Cálculo de saldo automático
- ✅ Categorização de receitas/despesas

### **📈 Carteira de Investimentos**
- ✅ Visualização da carteira
- ✅ Diferentes tipos de investimento
- ✅ Controle de aplicação/resgate
- ✅ Resumo de performance

### **🎯 Metas Financeiras**
- ✅ Criação e acompanhamento de metas
- ✅ Barra de progresso visual
- ✅ Status de metas (ativa, concluída, vencida)
- ✅ Adição de valores às metas

## 🛠️ Como Executar

### **1. Instalar dependências**
```bash
cd frontend
npm install
```

### **2. Executar em desenvolvimento**
```bash
npm run dev
```

### **3. Acessar aplicação**
```
http://localhost:3000
```

### **4. Build para produção**
```bash
npm run build
npm run preview
```

## 🎯 Páginas Implementadas

### **📊 Páginas Principais**
- **Home** (`/home`) - Landing page do sistema
- **Login** (`/login`) - Autenticação de usuários
- **Dashboard** (`/dashboard`) - Resumo financeiro
- **404** (`/*`) - Página não encontrada
- **Error** (`/error`) - Página de erro personalizada

### **🗂️ Páginas CRUD (4 entidades)**
- **Usuários** (`/usuarios`) - Gerenciamento de usuários
- **Transações** (`/transacoes`) - Receitas e despesas
- **Investimentos** (`/investimentos`) - Carteira de investimentos
- **Metas** (`/metas`) - Objetivos financeiros

## 🔗 Integração com Backend

### **API Base URL**
```typescript
const API_URL = 'http://localhost:8080/api'
```

### **Autenticação**
```typescript
// Login automático via Context API
const { login, logout, user, isAuthenticated } = useAuth();
```

### **Consumo de APIs**
```typescript
// Exemplo: Listar usuários
const usuarios = await usuariosAPI.listar();

// Exemplo: Criar transação
const novaTransacao = await transacoesAPI.criarReceita({
  idUsuario: 1,
  categoria: 'SALARIO',
  descricao: 'Salário mensal',
  valor: 5000.00
});
```

## 🎨 Componentes e Props

### **Exemplo de componentização:**
```typescript
// Componente Button com props
<Button 
  variant="primary"
  size="lg"
  isLoading={isSubmitting}
  leftIcon={<Plus />}
  onClick={handleClick}
  fullWidth
>
  Salvar Usuário
</Button>

// Componente Input com state
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  leftIcon={<Mail />}
  required
/>
```

## 📱 Responsividade

- ✅ **Desktop first** design
- ✅ **Tablet** adaptações
- ✅ **Mobile** otimizado
- ✅ **Touch friendly** elementos
- ✅ **Sidebar responsiva**

## 🧪 Como Testar

### **1. Executar backend (H2 mode)**
```bash
cd ../
mvn spring-boot:run -Dspring.profiles.active=dev
```

### **2. Executar frontend**
```bash
cd frontend
npm run dev
```

### **3. Testar funcionalidades**
1. **Homepage**: http://localhost:3000/home
2. **Login**: http://localhost:3000/login
   - Email: `joao.silva@email.com`
   - Senha: `senha123`
3. **Dashboard**: http://localhost:3000/dashboard
4. **Páginas CRUD**: Navegue pela sidebar

## 🎯 Demonstração das Funcionalidades

### **Login Flow:**
1. Acesse `/login`
2. Use credenciais demo ou preencha manualmente
3. Sistema salva token e usuário no localStorage
4. Redireciona para dashboard automaticamente

### **CRUD Operations:**
- **Usuários**: Listar, buscar, visualizar (ações preparadas)
- **Transações**: Visualizar receitas/despesas, saldo automático
- **Investimentos**: Carteira visual, resgates funcionais
- **Metas**: Progresso visual, adicionar valores funcionando

### **Navegação SPA:**
- Navegação instantânea entre páginas
- Estado mantido entre rotas
- Sidebar responsiva com menu mobile

## 🛡️ Recursos de Segurança

- ✅ **Rotas protegidas** com ProtectedRoute
- ✅ **Token JWT** gerenciado automaticamente
- ✅ **Logout automático** em caso de token expirado
- ✅ **Validação de formulários** client-side
- ✅ **Sanitização de inputs**

## 🎨 Customização BTG

### **Cores principais:**
- **Primary**: #6366F1 (BTG Blue)
- **Background**: Gradientes escuros
- **Cards**: Gradientes sutis
- **Success**: #10B981
- **Error**: #EF4444

### **Tipografia:**
- **Font**: Inter (similar BTG)
- **Weights**: 300, 400, 500, 600, 700
- **Scales**: xs (12px) até 5xl (48px)

## 🏆 **Frontend COMPLETO e FUNCIONAL!**

### **✨ Destaques:**
- 🎨 **Design profissional** inspirado BTG
- ⚡ **Performance otimizada** com Vite
- 📱 **Totalmente responsivo**
- 🧩 **Componentes reutilizáveis**
- 🔄 **State management** com Hooks e Context
- 🌐 **Integração completa** com backend Spring Boot
- 📋 **4+ páginas CRUD** funcionais
- 🛡️ **Sistema de autenticação** robusto

---

## 🎓 **Projeto pronto para apresentação FIAP!**

**Desenvolvido seguindo todas as diretrizes do curso Integration, com componentização, rotas SPA, hooks, props e consumo de APIs REST.** ✅



