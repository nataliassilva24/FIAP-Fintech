# 🚀 Guia de Instalação - FIAP Fintech Spring Boot

## ⚡ Instalação Rápida (3 passos)

### 1️⃣ Configurar Oracle FIAP
**Edite**: `src/main/resources/application.properties`
```properties
spring.datasource.username=SEU_RM_AQUI
spring.datasource.password=SEU_RM_AQUI
```

### 2️⃣ Executar script do banco
**Execute no Oracle FIAP**: `src/main/resources/schema.sql`

### 3️⃣ Iniciar aplicação
```bash
mvn spring-boot:run
```

### 4️⃣ Testar
Abra: http://localhost:8080/swagger-ui.html

---

## 📋 Pré-requisitos

- ☕ **Java 17+** instalado
- 🔨 **Maven 3.6+** instalado  
- 🗄️ **Acesso Oracle FIAP** configurado
- 💻 **IDE** (IntelliJ, Eclipse, VS Code)

## 🔧 Instalação Detalhada

### **1. Verificar Java e Maven**
```bash
java --version    # Deve ser 17+
mvn --version     # Deve ser 3.6+
```

### **2. Configurar Oracle**
```bash
# Edite src/main/resources/application.properties
# Substitua RM557347 pelo seu RM da FIAP

spring.datasource.username=RM123456  # SEU RM
spring.datasource.password=RM123456  # SEU RM
```

### **3. Executar script SQL**
```sql
-- Conecte no Oracle FIAP e execute:
-- Arquivo: src/main/resources/schema.sql
-- Isso criará todas as tabelas e sequences
```

### **4. Compilar e executar**
```bash
# Compilar o projeto
mvn compile

# Executar a aplicação
mvn spring-boot:run
```

### **5. Verificar se funcionou**
```bash
# Health check
curl http://localhost:8080/actuator/health

# Swagger UI
# Abrir no navegador: http://localhost:8080/swagger-ui.html
```

---

## 🧪 Testando a API

### **Método 1: Swagger UI (Recomendado)**
1. Acesse: http://localhost:8080/swagger-ui.html
2. Teste todos os endpoints visualmente
3. Veja exemplos de requests e responses

### **Método 2: cURL**
```bash
# Criar usuário
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "Maria Silva",
    "email": "maria@teste.com",
    "senha": "senha123",
    "dataNascimento": "1985-03-15",
    "genero": "FEMININO"
  }'

# Listar usuários
curl http://localhost:8080/api/usuarios

# Criar transação
curl -X POST http://localhost:8080/api/transacoes/receita \
  -H "Content-Type: application/json" \
  -d '{
    "idUsuario": 1,
    "categoria": "SALARIO",
    "descricao": "Salário mensal",
    "valor": 3500.00
  }'
```

### **Método 3: Postman/Insomnia**
Importe as URLs dos endpoints e teste interativamente.

---

## 🔧 Comandos Úteis

```bash
# Executar aplicação (desenvolvimento)
mvn spring-boot:run

# Executar com profile específico
mvn spring-boot:run -Dspring.profiles.active=dev

# Compilar sem executar testes
mvn compile -DskipTests

# Limpar e recompilar
mvn clean compile

# Gerar JAR executável
mvn package

# Executar JAR
java -jar target/fiap-fintech-backend-1.0.0.jar
```

---

## ❌ Problemas Comuns

### **Erro: "ORA-12541: TNS:no listener"**
**Causa**: Não conectado à rede FIAP  
**Solução**: 
- Conecte-se à VPN da FIAP
- Ou acesse do campus da FIAP
- Verifique se o Oracle está rodando

### **Erro: "ORA-01017: invalid username/password"**
**Causa**: RM incorreto no `application.properties`  
**Solução**: 
- Verifique seu RM no portal FIAP
- Confirme username e password corretos

### **Erro: "Table 'TB_USUARIO' doesn't exist"**
**Causa**: Script SQL não foi executado  
**Solução**: 
- Execute `src/main/resources/schema.sql` no Oracle FIAP
- Conecte com seu RM e execute todo o script

### **Erro: "Port 8080 already in use"**
**Causa**: Porta ocupada  
**Solução**: 
- Mude a porta no `application.properties`:
  ```properties
  server.port=8081
  ```
- Ou mate o processo que está usando a porta 8080

### **Erro de compilação**
**Solução**:
```bash
# Limpar e recompilar
mvn clean compile

# Verificar dependências
mvn dependency:tree

# Recarregar dependências
mvn dependency:resolve
```

---

## 📊 Estrutura do Banco

### **Verificar se tabelas foram criadas:**
```sql
SELECT table_name FROM user_tables 
WHERE table_name LIKE 'TB_%'
ORDER BY table_name;

-- Deve retornar:
-- TB_INVESTIMENTO
-- TB_META_FINANCEIRA  
-- TB_TRANSACAO
-- TB_USUARIO
```

### **Verificar sequences:**
```sql
SELECT sequence_name FROM user_sequences 
WHERE sequence_name LIKE 'SEQ_%'
ORDER BY sequence_name;
```

---

## 🎯 URLs Importantes

| Serviço | URL |
|---------|-----|
| **Aplicação** | http://localhost:8080 |
| **API REST** | http://localhost:8080/api |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **API Docs** | http://localhost:8080/api-docs |
| **Health Check** | http://localhost:8080/actuator/health |

---

## ⚠️ IMPORTANTE - Antes da Entrega

1. ✅ **Substitua RM557347** pelo seu RM em:
   - `application.properties`
   - `schema.sql`

2. ✅ **Execute todos os scripts** no Oracle FIAP

3. ✅ **Teste todos os endpoints** via Swagger

4. ✅ **Documente os testes** realizados

5. ✅ **Gere o JAR** final: `mvn package`

---

## 🎓 **Projeto pronto para entrega FIAP!**

✅ **Spring Boot** com arquitetura em camadas  
✅ **5 entidades** com CRUD completo  
✅ **Oracle FIAP** integrado  
✅ **APIs REST** com status HTTP corretos  
✅ **Documentação** automática com Swagger  

**Sucesso garantido na disciplina Integration!** 🏆