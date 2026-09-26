# 🍔 BurguerSync Ourinhos (Full-Stack Realtime & KDS)

<p align="center">
  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK0cS4u70ZGVu9aT8FxrUghRH5mqVNL-sCvbcg64oQ5cOzmkLQ6QD-196AV3wkwwWS3r_TaauExbFW5eEjanv86UGrNhDSSNYpGlNMdy9ejU0BINJJMP3V2yk481YVbIKywLX6D6tj8r2o1kZ3ASUaJ0y2onbOGfIWKaUZRlVEtk37Vlaor8tGK3LiXgn_2hGV8mXKXfi8xvq6h_pE6XFztYoaN10RrWOvbZMDCgaTIBTXeqf7ohE-hQ" alt="BurguerSync Ourinhos Banner" width="700" style="border-radius: 16px; box-shadow: 0 0 30px rgba(255,122,0,0.3);"/>
</p>

<p align="center">
  <!-- Badges Tecnológicos -->
  <img src="https://img.shields.io/badge/Google_Antigravity-v2.5.5-FF5500?style=for-the-badge&logo=google&logoColor=white" alt="Google Antigravity" />
  <img src="https://img.shields.io/badge/Google_Stitch-Dark_Neon-FFB800?style=for-the-badge&logo=figma&logoColor=white" alt="Google Stitch" />
  <img src="https://img.shields.io/badge/Firebase_Firestore-Realtime_NoSQL-FFA000?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase Firestore" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-ES6_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/SENAI-Ourinhos_SP-ED1C24?style=for-the-badge" alt="SENAI Ourinhos" />
  <img src="https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages" />
</p>

---

## 🇧🇷 Português (Brasil)

### 📖 Sobre o Projeto
O **BurguerSync Ourinhos** é uma aplicação web full-stack de delivery e gestão de pedidos em tempo real (KDS - *Kitchen Display System*) voltada ao mercado gastronômico artesanal de Ourinhos/SP.

O projeto unifica a experiência de compra do cliente (cardápio interativo, carrinho reativo, cálculo determinístico de taxas e checkout instantâneo) com a operação da cozinha da hamburgueria através de sincronização bidirecional via **Firebase Cloud Firestore**.

### 🌟 Destaque Tecnológico: Google Antigravity & Stitch
Desenvolvido com o ecossistema **Google Antigravity**, o projeto implementa uma **Arquitetura em 3 Camadas** de alta confiabilidade:
* **Layer 1 (Estratégia & Diretivas):** Contratos em JSON Schema e diretrizes de design em Markdown (`/directives/`).
* **Layer 2 (Orquestrador de IA):** Tomada de decisões, supervisão e ciclo de autorrecuperação (*Self-Annealing*).
* **Layer 3 (Execução Determinística):** Código-fonte client-side e scripts de automação em CLI (`/execution/` e `/frontend/`).
* **Google Stitch Integration:** Prototipação e design tokens importados diretamente do projeto Stitch `11212219604664198673` (*Dark Neon Gastronomy*).

### 🤖 Agentes e Skill Packs Utilizados
- **Agent:** `@[orchestrator]` (Agente Coordenador de Arquitetura e Pipeline)
- **Skill Packs:**
  - `@[clean-code]`: Código pragmático, modular e sem sobre-engenharia.
  - `@[frontend-design]`: Design UI/UX Dark Mode gastronômico com microinterações.
  - `@[deployment-procedures]`: Pipeline determinístico de CI/CD para GitHub Pages.
  - `@[systematic-debugging]`: Rastreamento e mitigação de falhas em tempo de execução.

### 🚀 Funcionalidades Principais
1. **Área do Cliente (Cardápio Digital):**
   - Vitrine de smash burgers com fotos de alto apelo visual.
   - Filtros por categoria (Smash Burgers, Artesanais, Porções, Bebidas, Sobremesas).
   - Carrinho reativo com controle de quantidade (+/-) e campo de observação por item.
   - Checkout completo com validação de endereço em Ourinhos e formas de pagamento (Pix, Cartão, Dinheiro com troco).
2. **Painel da Cozinha (KDS Real-time):**
   - Sincronização em tempo real com o Firestore (`onSnapshot`).
   - Kanban de produção com status dinâmicos (*Recebido* ➔ *Em Preparo* ➔ *Saiu para Entrega* ➔ *Entregue*).
   - Alertas sonoros sintetizados via Web Audio API na chegada de novos pedidos.
   - Botão para impressão de comanda térmica física.
3. **Rastreamento de Pedidos:**
   - Consulta ao vivo do status do pedido com timeline passo a passo.

### 💻 Como Executar Localmente
1. **Pelo Executável (Windows):**
   - Dê um duplo clique no arquivo [`executar.bat`](./executar.bat).
2. **Via Linha de Comando (CLI):**
   ```bash
   # 1. Validar contratos e schemas
   npm run validate

   # 2. Executar testes unitários
   npm test

   # 3. Iniciar servidor local
   npm start
   ```
   Acesse no navegador: `http://localhost:3000/`

---

## 🇺🇸 English

### 📖 About The Project
**BurguerSync Ourinhos** is a full-stack real-time food delivery and Kitchen Display System (KDS) tailored for artisan burger joints in Ourinhos/SP, Brazil.

The system unifies customer online ordering (interactive menu, reactive cart, fee calculation, fast checkout) with kitchen operations via WebSocket streaming using **Firebase Cloud Firestore**.

### 🌟 Powered by Google Antigravity & Stitch
Crafted using the **Google Antigravity** framework with a reliable **3-Layer Architecture**:
* **Layer 1 (Directives & Contracts):** Strict schema definitions and design tokens (`/directives/`).
* **Layer 2 (AI Orchestrator):** Decision logic, supervision, and *Self-Annealing* loop.
* **Layer 3 (Deterministic Execution):** Modular frontend ES6 client and CLI automation scripts (`/execution/` and `/frontend/`).
* **Google Stitch Design:** UI aesthetics and color tokens sourced from Stitch project `11212219604664198673` (*Dark Neon Gastronomy*).

### 🤖 AI Agents & Skill Packs
- **Agent:** `@[orchestrator]`
- **Skill Packs:** `@[clean-code]`, `@[frontend-design]`, `@[deployment-procedures]`, `@[systematic-debugging]`.

### 🚀 Key Features
- **Client Digital Menu & Fast Checkout:** Live cart, item modifiers, address validation, and payment methods (Pix, Card, Cash).
- **Real-Time Kitchen Display (KDS):** Live order dispatching, status pipeline, synthetic sound notifications, and thermal receipt printing.
- **Live Order Tracker:** Step-by-step illuminated order tracker.

### 💻 Local Run Instructions
```bash
# Validate data contracts
npm run validate

# Run unit test suite
npm test

# Launch local preview server
npm start
```

---

## 👥 Autoria & Créditos
* **Desenvolvedor:** William — SENAI Ourinhos / SP
* **Ambiente de Engenharia:** Google Antigravity IDE v2.5.5
* **Persistência de Dados:** Google Firebase Firestore
* **Design & UI System:** Google Stitch Studio
