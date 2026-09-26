# 📋 Instruções de Execução e Operação: BurguerSync Ourinhos

Este documento reúne os comandos determinísticos de linha de comando (CLI) para validação, testes, inicialização local e deploy do sistema.

---

## 🛠️ Comandos Rápidos (CLI)

### 1. Inicialização e Servidor Local
Para rodar a aplicação localmente no Windows:
- Dê um duplo clique no arquivo `executar.bat` OU execute no terminal:
```bash
npm start
# ou
npx serve . -l 3000
```
Acesse a aplicação no navegador em: `http://localhost:3000/`

---

### 2. Validação Determinística de Schema (Layer 3)
Executa a verificação estática do payload contra o contrato canônico em `directives/contracts/pedidos.schema.json` e cálculos matemáticos:
```bash
npm run validate
# ou
node execution/validate-schema.js
```

---

### 3. Testes Unitários Automatizados
Executa a suíte de testes com o test runner nativo do Node.js:
```bash
npm test
# ou
node --test tests/unit/orders.test.js
```

---

### 4. Checagem de Arquivos e Build
Garante a existência de todos os artefatos obrigatórios do SOP:
```bash
npm run build
# ou
node scripts/build.js
```

---

### 5. Deploy no GitHub e GitHub Pages
Publica ou atualiza o código no repositório remoto do GitHub e habilita o GitHub Pages:
```bash
npm run deploy
# ou
node execution/deploy-github.js
```

---

## 🏗️ Arquitetura das Camadas
- **Layer 1 (Diretivas & Contratos):** `/directives/`
- **Layer 2 (Orquestração & Decisão):** Agente Google Antigravity
- **Layer 3 (Execução Determinística):** `/execution/` e `/frontend/`
