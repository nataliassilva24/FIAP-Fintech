# 🚀 Como Executar o Projeto FIAP Fintech

**Problema detectado**: Maven não está instalado via terminal

---

## 🎯 **SOLUÇÃO RÁPIDA: Usar IDE**

### **1. Executar Backend (Spring Boot)**

#### **No IntelliJ IDEA:**
1. Abra o projeto `FIAP-Fintech` no IntelliJ
2. Aguarde o Maven baixar dependências automaticamente
3. Vá em `src/main/java/com/fintech/FintechApplication.java`
4. Clique com botão direito → **"Run 'FintechApplication'"**
5. **IMPORTANTE**: Adicione VM option: `-Dspring.profiles.active=dev`
   - Run → Edit Configurations → VM options: `-Dspring.profiles.active=dev`

#### **No VS Code:**
1. Instale extensão **"Extension Pack for Java"**
2. Abra pasta `FIAP-Fintech`
3. Aguarde setup automático
4. Abra terminal integrado (Ctrl+`)
5. Execute: `./mvnw spring-boot:run -Dspring.profiles.active=dev`

#### **No Eclipse:**
1. File → Import → Existing Maven Projects
2. Selecione pasta `FIAP-Fintech`
3. Clique direito no projeto → Run As → Spring Boot App
4. Configure VM arguments: `-Dspring.profiles.active=dev`

### **2. Executar Frontend (React)**

#### **Terminal separado:**
```bash
cd FIAP-Fintech/frontend
npm install
npm run dev
```

#### **No VS Code:**
1. Abra pasta `FIAP-Fintech/frontend`
2. Terminal integrado: `npm install && npm run dev`

---

## 🎯 **URLs após executar:**

- **🌐 Frontend**: http://localhost:3000
- **🖥️ Backend API**: http://localhost:8080/api
- **📋 Swagger**: http://localhost:8080/swagger-ui.html
- **🗄️ H2 Console**: http://localhost:8080/h2-console

---

## 🧪 **Login de teste:**
- **Email**: `joao.silva@email.com`
- **Senha**: `senha123`

---

## 📱 **O que você verá funcionando:**

### **✅ Homepage** (`localhost:3000/home`)
- Landing page com design BTG
- Navegação para login

### **✅ Login** (`localhost:3000/login`) 
- Tela de login profissional
- Botão "Usar Credenciais Demo" 
- Autenticação JWT funcionando

### **✅ Dashboard** (`localhost:3000/dashboard`)
- Resumo financeiro com dados reais
- Cards de saldo, receitas, despesas
- Sidebar de navegação

### **✅ Páginas CRUD:**
- **👤 Usuários** (`/usuarios`) - Lista com 3 usuários
- **💰 Transações** (`/transacoes`) - 8 transações fictícias
- **📈 Investimentos** (`/investimentos`) - 5 investimentos
- **🎯 Metas** (`/metas`) - 5 metas com progresso visual

---

## ⚡ **ALTERNATIVA: Instalar Maven**

Se quiser usar terminal:

### **macOS (Homebrew):**
```bash
brew install maven
```

### **Depois:**
```bash
cd FIAP-Fintech
mvn spring-boot:run -Dspring.profiles.active=dev
```

---

## 🎯 **RECOMENDAÇÃO:**

**Use o IntelliJ IDEA** - é o mais fácil:
1. **Importar projeto Maven** 
2. **Run** `FintechApplication` com profile `dev`
3. **Terminal separado** para frontend

**Em 2 minutos** você terá todo o sistema funcionando! 🚀



