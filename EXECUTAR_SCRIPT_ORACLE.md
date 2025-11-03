# 🗄️ Como Executar o Script no Oracle FIAP

## 📋 **Arquivo a executar:**
`src/main/resources/schema.sql`

---

## 🎯 **Método 1: SQL Developer (Recomendado)**

### **1. Abrir SQL Developer**
- Baixe em: https://www.oracle.com/tools/downloads/sqldev-downloads.html
- Ou use o SQL Developer disponível no laboratório FIAP

### **2. Configurar Conexão**
```
Connection Name: FIAP Oracle
Username: SEU_RM_AQUI (ex: RM123456)
Password: SEU_RM_AQUI (ex: RM123456)
Hostname: oracle.fiap.com.br
Port: 1521
Service Name: orcl
```

### **3. Testar Conexão**
- Clique em **"Test"**
- Deve aparecer: **"Status: Success"**

### **4. Conectar**
- Clique em **"Connect"**

### **5. Executar Script**
- Clique em **"File" → "Open"**
- Navegue até: `FIAP-Fintech/src/main/resources/schema.sql`
- Clique no botão **"Run Script"** (F5)
- Aguarde execução completa

---

## 🎯 **Método 2: Copiar e Colar (Simples)**

### **1. Abrir arquivo `schema.sql`**
```bash
# No VS Code, IntelliJ ou qualquer editor
# Arquivo: src/main/resources/schema.sql
```

### **2. Selecionar TODO o conteúdo (Ctrl+A)**

### **3. Conectar no Oracle FIAP (SQL Developer)**
- Use as mesmas configurações do Método 1

### **4. Colar e executar**
- Cole o conteúdo na janela SQL
- Selecione tudo (Ctrl+A)
- Execute com F5 ou botão "Run Script"

---

## 🎯 **Método 3: SQL*Plus (Terminal)**

### **Pré-requisito:** Oracle Client instalado

### **1. Conectar via terminal**
```bash
sqlplus SEU_RM@oracle.fiap.com.br:1521/orcl
```

### **2. Digite sua senha quando solicitado**

### **3. Executar script**
```sql
@/caminho/completo/para/FIAP-Fintech/src/main/resources/schema.sql
```

---

## 🎯 **Método 4: Interface Web Oracle (Se disponível)**

### **1. Acessar portal Oracle FIAP**
- URL fornecida pela FIAP (varia por semestre)

### **2. Login com seu RM**

### **3. SQL Workshop**
- Busque opção "SQL Commands" ou "SQL Workshop"

### **4. Copiar e colar**
- Cole o conteúdo completo do `schema.sql`
- Execute

---

## ✅ **Como Verificar se Funcionou**

### **Execute estas queries para confirmar:**

```sql
-- Verificar tabelas criadas
SELECT table_name FROM user_tables 
WHERE table_name LIKE 'TB_%'
ORDER BY table_name;

-- Deve retornar:
-- TB_INVESTIMENTO
-- TB_META_FINANCEIRA
-- TB_TRANSACAO
-- TB_USUARIO

-- Verificar sequences criadas
SELECT sequence_name FROM user_sequences 
WHERE sequence_name LIKE 'SEQ_%'
ORDER BY sequence_name;

-- Deve retornar:
-- SEQ_INVESTIMENTO
-- SEQ_META_FINANCEIRA
-- SEQ_TRANSACAO
-- SEQ_USUARIO

-- Contar registros (deve ser 0 inicialmente)
SELECT COUNT(*) as TOTAL_USUARIOS FROM TB_USUARIO;
```

---

## ⚠️ **ANTES DE EXECUTAR**

### **1. Substituir RM no script**
Abra `schema.sql` e substitua:
```sql
-- De:
INSERT INTO TB_USUARIO (ID_USUARIO, NOME_COMPLETO, EMAIL, SENHA, DATA_NASCIMENTO, GENERO, ATIVO) 
VALUES (SEQ_USUARIO.NEXTVAL, 'Usuário Teste', 'teste@fiap.com.br', ...

-- Para:
INSERT INTO TB_USUARIO (ID_USUARIO, NOME_COMPLETO, EMAIL, SENHA, DATA_NASCIMENTO, GENERO, ATIVO) 
VALUES (SEQ_USUARIO.NEXTVAL, 'Usuário Teste', 'teste@fiap.com.br', ...
-- (manter como está, é só um exemplo)
```

### **2. Verificar conexão**
```sql
-- Teste básico de conexão
SELECT SYSDATE FROM DUAL;
-- Deve retornar a data/hora atual
```

---

## ❌ **Problemas Comuns**

### **Erro: "ORA-00955: name is already used by an existing object"**
**Causa**: Tabelas já existem  
**Solução**: Normal, algumas tabelas podem já existir. Continue a execução.

### **Erro: "ORA-01017: invalid username/password"**
**Causa**: RM incorreto  
**Solução**: Confirme seu RM com a FIAP

### **Erro: "ORA-12541: TNS:no listener"**
**Causa**: Não conectado à rede FIAP  
**Solução**: 
- Use VPN da FIAP
- Ou execute do campus

### **Script muito longo**
**Solução**: Execute por partes:
1. Primeiro: CREATE SEQUENCE (linhas 1-50)
2. Depois: CREATE TABLE (linhas 51-200)
3. Por último: CREATE INDEX (linhas 201-fim)

---

## 🎯 **Dica FIAP**

**Se estiver no laboratório da FIAP:**
- Use o SQL Developer já instalado
- A conexão pode já estar configurada
- Peça ajuda ao monitor se necessário

**Se estiver em casa:**
- Use VPN da FIAP se disponível
- Ou execute remotamente via portal web

---

## 📞 **Contatos para Suporte**

- **Professor** da disciplina Integration
- **Monitor** do laboratório
- **Suporte técnico** FIAP
- **Colegas de classe** 😊

---

**⭐ Recomendação: Use o SQL Developer (Método 1) - é o mais confiável e visual!**



