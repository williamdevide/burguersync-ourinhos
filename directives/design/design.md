# 🎨 Especificação de Design e UI/UX: BurguerSync Ourinhos

> **Projeto Stitch:** `projects/11212219604664198673` ("Dark Neon Gastronomy")  
> **Tema:** Dark Mode Gastronômico Neon com Microinterações Fluidas

---

## 1. Identidade Visual & Design Tokens

### 1.1 Paleta de Cores (Dark Mode & Acentos Neon)
O sistema visual é projetado com fundo escuro profundo, superfícies modulares em cinza escuro, contraste ergonômico e acentos vibrantes inspirados em neon gastronômico.

| Nome do Token | Hexadecimal | Uso Principal |
| :--- | :--- | :--- |
| `--bg-base` | `#0C0C0E` | Fundo principal da aplicação (Body Canvas) |
| `--bg-surface-1` | `#16161A` | Cards de produtos, modais e containers |
| `--bg-surface-2` | `#222227` | Inputs, sub-cards, cabeçalhos de seções |
| `--surface-container` | `#1f1f23` | Elementos de apoio, caixas de botões |
| `--surface-container-high` | `#2a292e` | Botões secundários e hovers |
| `--border-subtle` | `#2E2E36` | Bordas padrão, divisórias de lista |
| `--border-focus` | `#FF9E00` | Foco em campos de texto e seletores |
| `--primary-container` / `--accent-orange` | `#FF7A00` | Cor primária (CTA principal, botões de ação) |
| `--accent-orange-hover` | `#FF9E00` | Estado hover de botões e destaques |
| `--accent-yellow-neon` | `#FFD000` | Alertas visuais, badges de status "Recebido", observações |
| `--accent-green-neon` / `--secondary` | `#00E676` | Sucesso, confirmação de pedido, status "Entregue" |
| `--accent-green-hover` | `#00C853` | Hover em botões de sucesso |
| `--status-purple` | `#9D4EDD` | Status: *Em Preparo* (Chapa / Fritadeira) |
| `--status-blue` | `#2979FF` | Status: *Saiu para Entrega* (Motoboy) |
| `--text-primary` | `#F4F4F6` | Títulos, preços e textos de alta legibilidade |
| `--text-secondary` | `#A1A1AA` | Descrições de lanches, legendas e placeholders |
| `--text-muted` | `#63636E` | Textos desativados e metadados secundários |

---

## 2. Tipografia & Escala Modular
- **Família de Títulos e Display:** `Plus Jakarta Sans`, sans-serif (Pesos: `600`, `700`, `800`)
- **Família de Texto e Labels:** `Inter`, sans-serif (Pesos: `400`, `600`, `700`)
- **Ícones:** `Material Symbols Outlined` (Google Fonts)

---

## 3. Estrutura de Componentes e IDs Canônicos

- `#view-cliente`: Seção do cardápio digital, seleção de categorias e carrinho.
- `#view-cozinha`: Seção KDS (Kitchen Display System) em Kanban com cards em tempo real.
- `#view-rastreador`: Seção de rastreamento do pedido do cliente com timeline interativa.
- `#cartItemsContainer`: Container da lista de itens adicionados ao carrinho.
- `#cartCountBadge`: Contador numérico de itens no cabeçalho e na sacola.
- `#displaySubtotal`, `#displayFee`, `#displayTotal`: Resumos financeiros reativos.
- `#checkoutForm`: Formulário com validação de campos obrigatórios:
  - `#custName`: Nome completo do cliente.
  - `#custPhone`: WhatsApp / Celular.
  - `#custAddress`: Endereço completo em Ourinhos (Rua, Número, Bairro).
  - `#custInstructions`: Complemento e ponto de referência.
- `#pay-pix`, `#pay-card`, `#pay-cash`: Seletores da forma de pagamento.
- `#cashChangeBox`: Input dinâmico de troco em dinheiro.
- `#kdsOrdersGrid`: Grid do Kanban da cozinha com atualização reativa via Firestore.

---

## 4. Efeitos Visuais e Microanimações
- Efeito **Glow Neon** nos botões de conversão e badges de status.
- Transições de `scale(0.98)` no clique ativo de botões.
- Backdrop blur em cabeçalhos fixos e modais (`backdrop-blur-xl`).
- Indicadores pulsantes em status ativos (ping animation).