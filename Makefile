# ====================================
# FIAP FINTECH - MAKEFILE COMPLETO
# ====================================
# Automatiza setup completo do projeto
# Frontend + Backend + Oracle Database

.PHONY: help install setup-oracle start-frontend start-backend start-all check-oracle create-tables test-integration clean stop-all

# Variáveis de configuração
ORACLE_USER := rm557347
ORACLE_PASS := 311000
ORACLE_HOST := oracle.fiap.com.br:1521/orcl
FRONTEND_PORT := 3000
BACKEND_PORT := 8080

# Java e Oracle paths
JAVA_HOME := /Library/Java/JavaVirtualMachines/temurin-25.jdk/Contents/Home
SQLCL_PATH := /opt/homebrew/Caskroom/sqlcl/25.3.0.274.1210/sqlcl/bin
PATH := $(JAVA_HOME)/bin:$(SQLCL_PATH):$(PATH)

# ====================================
# COMANDOS PRINCIPAIS
# ====================================

help: ## Mostra ajuda com todos os comandos disponíveis
	@echo "🚀 FIAP FINTECH - COMANDOS DISPONÍVEIS"
	@echo "======================================"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "🎯 COMANDO PRINCIPAL:"
	@echo "   make start-all    # Inicia projeto completo"
	@echo ""

install: ## Instala todas as dependências necessárias
	@echo "📦 Instalando dependências..."
	@if ! command -v java >/dev/null 2>&1; then \
		echo "☕ Instalando Java..."; \
		brew install --cask temurin; \
	fi
	@if ! command -v sql >/dev/null 2>&1; then \
		echo "🗄️  Instalando Oracle SQLcl..."; \
		brew install --cask sqlcl; \
	fi
	@if ! command -v mvn >/dev/null 2>&1; then \
		echo "🔧 Instalando Maven..."; \
		brew install maven; \
	fi
	@echo "✅ Dependências instaladas!"

check-oracle: ## Verifica se Oracle está acessível e se tabelas existem
	@echo "🔍 Verificando conexão Oracle..."
	@if ! echo "SELECT 1 FROM DUAL;" | JAVA_HOME=$(JAVA_HOME) PATH=$(PATH) sql -S $(ORACLE_USER)/$(ORACLE_PASS)@$(ORACLE_HOST) >/dev/null 2>&1; then \
		echo "❌ Erro: Oracle inacessível. Verifique VPN/conexão FIAP"; \
		exit 1; \
	fi
	@echo "✅ Oracle acessível!"
	
	@echo "🔍 Verificando se tabelas existem..."
	@TABLE_COUNT=$$(echo "SELECT COUNT(*) FROM user_tables WHERE table_name LIKE 'TB_%';" | JAVA_HOME=$(JAVA_HOME) PATH=$(PATH) sql -S $(ORACLE_USER)/$(ORACLE_PASS)@$(ORACLE_HOST) | grep -o '[0-9]*' | head -1); \
	if [ "$$TABLE_COUNT" -lt 2 ]; then \
		echo "⚠️  Tabelas não existem ou incompletas ($$TABLE_COUNT/4)"; \
		echo "🔧 Recriando tabelas..."; \
		$(MAKE) create-tables; \
	else \
		echo "✅ Tabelas OK ($$TABLE_COUNT encontradas)"; \
	fi

create-tables: ## Cria/recria tabelas essenciais no Oracle
	@echo "🗄️  Criando tabelas Oracle..."
	@echo "-- Criando tabelas essenciais FIAP Fintech\n\
-- Tabela de Usuários\n\
DROP TABLE TB_TRANSACAO CASCADE CONSTRAINTS;\n\
DROP TABLE TB_USUARIO CASCADE CONSTRAINTS;\n\
DROP SEQUENCE SEQ_USUARIO;\n\
DROP SEQUENCE SEQ_TRANSACAO;\n\
\n\
CREATE SEQUENCE SEQ_USUARIO START WITH 1 INCREMENT BY 1;\n\
CREATE SEQUENCE SEQ_TRANSACAO START WITH 1 INCREMENT BY 1;\n\
\n\
CREATE TABLE TB_USUARIO (\n\
    ID_USUARIO NUMBER PRIMARY KEY,\n\
    NOME_COMPLETO VARCHAR2(100) NOT NULL,\n\
    EMAIL VARCHAR2(100) NOT NULL UNIQUE,\n\
    SENHA VARCHAR2(255) NOT NULL,\n\
    DATA_NASCIMENTO DATE NOT NULL,\n\
    GENERO VARCHAR2(20) NOT NULL,\n\
    DATA_CADASTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n\
    ATIVO CHAR(1) DEFAULT 'S'\n\
);\n\
\n\
CREATE TABLE TB_TRANSACAO (\n\
    ID_TRANSACAO NUMBER PRIMARY KEY,\n\
    ID_USUARIO NUMBER NOT NULL,\n\
    TIPO_TRANSACAO VARCHAR2(20) NOT NULL,\n\
    DESCRICAO VARCHAR2(255),\n\
    VALOR NUMBER(12,2) NOT NULL,\n\
    DATA_TRANSACAO DATE DEFAULT SYSDATE,\n\
    CONSTRAINT FK_TRANSACAO_USUARIO FOREIGN KEY (ID_USUARIO) REFERENCES TB_USUARIO(ID_USUARIO)\n\
);\n\
\n\
-- Inserir usuário de teste\n\
INSERT INTO TB_USUARIO (ID_USUARIO, NOME_COMPLETO, EMAIL, SENHA, DATA_NASCIMENTO, GENERO, ATIVO) \n\
VALUES (SEQ_USUARIO.NEXTVAL, 'Usuário FIAP Demo', 'demo@fiap.com.br', 'e10adc3949ba59abbe56e057f20f883e', DATE '1990-01-01', 'MASCULINO', 'S');\n\
\n\
COMMIT;" | JAVA_HOME=$(JAVA_HOME) PATH=$(PATH) sql $(ORACLE_USER)/$(ORACLE_PASS)@$(ORACLE_HOST)
	@echo "✅ Tabelas criadas com sucesso!"

start-frontend: ## Inicia o frontend React em background
	@echo "🎨 Iniciando frontend..."
	@cd frontend && npm run dev > ../logs/frontend.log 2>&1 &
	@sleep 5
	@if curl -s http://localhost:$(FRONTEND_PORT) >/dev/null; then \
		echo "✅ Frontend rodando: http://localhost:$(FRONTEND_PORT)"; \
	else \
		echo "❌ Erro ao iniciar frontend"; \
		exit 1; \
	fi

start-backend: ## Inicia o backend Spring Boot em background
	@echo "🔧 Iniciando backend..."
	@mvn spring-boot:run > logs/backend.log 2>&1 &
	@echo "⏳ Aguardando backend inicializar..."
	@for i in $$(seq 1 30); do \
		if curl -s http://localhost:$(BACKEND_PORT)/api/usuarios >/dev/null 2>&1; then \
			echo "✅ Backend rodando: http://localhost:$(BACKEND_PORT)/api"; \
			exit 0; \
		fi; \
		sleep 2; \
	done; \
	echo "❌ Timeout: Backend não inicializou"; \
	exit 1

setup-logs: ## Cria diretório de logs
	@mkdir -p logs

start-all: setup-logs install check-oracle start-backend start-frontend test-integration ## 🚀 Inicia projeto completo (comando principal)
	@echo ""
	@echo "🎉 SISTEMA FIAP FINTECH INICIADO!"
	@echo "=================================="
	@echo "🎨 Frontend: http://localhost:$(FRONTEND_PORT)"
	@echo "🔧 Backend:  http://localhost:$(BACKEND_PORT)/api"
	@echo "🗄️  Oracle:   Tabelas criadas e funcionais"
	@echo ""
	@echo "📝 Logs disponíveis em:"
	@echo "   - Frontend: logs/frontend.log"
	@echo "   - Backend:  logs/backend.log"
	@echo ""
	@echo "🛑 Para parar: make stop-all"

test-integration: ## Testa integração completa frontend-backend-oracle
	@echo "🧪 Testando integração..."
	@sleep 3
	@if curl -s http://localhost:$(FRONTEND_PORT) >/dev/null && \
	   curl -s http://localhost:$(BACKEND_PORT)/api/usuarios >/dev/null; then \
		echo "✅ Integração OK: Frontend ↔ Backend"; \
		echo "🎯 Teste criar usuário via API:"; \
		echo "   curl -X POST http://localhost:$(BACKEND_PORT)/api/usuarios/registrar \\"; \
		echo "        -H 'Content-Type: application/json' \\"; \
		echo "        -d '{\"nome\":\"Teste\",\"email\":\"teste@fiap.com\",\"senha\":\"123456\",\"dataNascimento\":\"1990-01-01\",\"genero\":\"MASCULINO\"}'"; \
	else \
		echo "❌ Falha na integração"; \
	fi

stop-all: ## Para todos os serviços
	@echo "🛑 Parando serviços..."
	@-pkill -f "vite" 2>/dev/null || true
	@-pkill -f "spring-boot" 2>/dev/null || true
	@-pkill -f "mvn.*spring-boot:run" 2>/dev/null || true
	@echo "✅ Serviços parados"

clean: stop-all ## Limpa logs e processos
	@echo "🧹 Limpando..."
	@rm -rf logs/
	@rm -f *.log
	@echo "✅ Limpeza concluída"

# ====================================
# COMANDOS UTILITÁRIOS
# ====================================

oracle-console: ## Abre console Oracle interativo
	@echo "🗄️  Abrindo console Oracle..."
	@JAVA_HOME=$(JAVA_HOME) PATH=$(PATH) sql $(ORACLE_USER)/$(ORACLE_PASS)@$(ORACLE_HOST)

oracle-status: ## Mostra status das tabelas Oracle
	@echo "📊 Status Oracle:"
	@echo "SELECT table_name, num_rows FROM user_tables WHERE table_name LIKE 'TB_%';" | \
		JAVA_HOME=$(JAVA_HOME) PATH=$(PATH) sql -S $(ORACLE_USER)/$(ORACLE_PASS)@$(ORACLE_HOST) | \
		grep -E "(TB_|TABLE_NAME)" || echo "❌ Nenhuma tabela encontrada"

logs: ## Mostra logs em tempo real
	@echo "📋 Logs do sistema (Ctrl+C para sair):"
	@tail -f logs/*.log 2>/dev/null || echo "Nenhum log disponível"

dev: ## Modo desenvolvimento (logs visíveis)
	@echo "🔧 Iniciando em modo desenvolvimento..."
	@$(MAKE) setup-logs install check-oracle
	@echo "🎨 Frontend (terminal 1):"
	@echo "cd frontend && npm run dev"
	@echo ""
	@echo "🔧 Backend (terminal 2):"
	@echo "mvn spring-boot:run"

# Comando padrão
.DEFAULT_GOAL := help
