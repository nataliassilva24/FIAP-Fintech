# 🚀 FIAP FINTECH - GUIA DE INÍCIO RÁPIDO

## ⚡ COMANDO ÚNICO PARA TUDO

```bash
# Inicia projeto completo (frontend + backend + oracle)
make start-all
```

**Isso vai:**
1. ✅ Instalar dependências (Java, Maven, SQLcl)
2. ✅ Verificar Oracle e recriar tabelas se necessário
3. ✅ Iniciar backend Spring Boot
4. ✅ Iniciar frontend React
5. ✅ Testar integração completa

---

## 📋 OUTROS COMANDOS ÚTEIS

```bash
# Ver todos os comandos disponíveis
make help

# Apenas verificar/recriar tabelas Oracle
make check-oracle

# Parar todos os serviços
make stop-all

# Ver logs em tempo real
make logs

# Console Oracle interativo
make oracle-console

# Status das tabelas
make oracle-status

# Limpar tudo
make clean
```

---

## 🎯 APÓS EXECUTAR `make start-all`

### ✅ **Acessos:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8080/api
- **Oracle:** Tabelas criadas automaticamente

### 📝 **Logs:**
- Frontend: `logs/frontend.log`
- Backend: `logs/backend.log`

### 🧪 **Testar cadastro:**
1. Abra http://localhost:3000
2. Clique em "Cadastrar-se"
3. Preencha o formulário
4. **AGORA VAI FUNCIONAR** ✨

---

## 🔧 TROUBLESHOOTING

### Se der erro:
```bash
# 1. Limpar e tentar novamente
make clean
make start-all

# 2. Verificar logs
make logs

# 3. Testar Oracle manualmente
make oracle-console
```

### Se Oracle não conectar:
- Verifique conexão FIAP/VPN
- Confirme credenciais: rm557347/311000

### Se tabelas sumirem (Oracle FIAP deleta):
```bash
# Recriar automaticamente
make check-oracle
```

---

## 🎉 BENEFÍCIOS DO MAKEFILE

✅ **Automação completa** - Um comando para tudo  
✅ **Detecção de problemas** - Verifica Oracle automaticamente  
✅ **Recriação inteligente** - Recria tabelas apenas se necessário  
✅ **Logs organizados** - Tudo salvo em arquivos  
✅ **Cleanup fácil** - Para e limpa tudo com um comando  

---

**🎯 Agora seu projeto FIAP Fintech está 100% automatizado!**
