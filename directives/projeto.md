O plano foi traçado separando estritamente regras estratégicas e contratos em Layer 1, orquestração no Layer 2 e código determinístico no Layer 3, com pipeline isolado para `.tmp/`, deploy cloud e ciclo robusto de Self-Annealing.

```markdown
# 📘 SOP Mestre: BurguerSync Ourinhos
**Status:** Planejamento / Inicialização | **Versão:** 2.5.5

## 1. Visão Geral e Objetivo Principal
O **BurguerSync Ourinhos** é uma aplicação web full-stack de delivery e gestão de pedidos em tempo real (KDS - Kitchen Display System) voltada ao mercado gastronômico local de Ourinhos[cite: 1, 3]. O sistema elimina gargalos de atendimento via WhatsApp e telas de PDV isoladas ao unificar a experiência do cliente (cardápio dinâmico, carrinho reativo, cálculo de frete e checkout multimeio) com o painel operacional da cozinha, que atualiza comandas e status instantaneamente via streaming de dados NoSQL, sem necessidade de recarregamento de página[cite: 1, 3].

## 2. Arquitetura do Projeto (Antigravity v2.5.5)
O sistema adota uma separação rígida de responsabilidades em 3 camadas complementares:

* **Layer 1 (Diretivas, Estratégia & Regras de Negócio):**
  - Diretrizes canônicas em `directives/design/design.md` (Design System, cores, hierarquia tipográfica, CSS Dark Mode e HTML semântico)[cite: 1].
  - Contratos de dados e regras de negócio documentados em `directives/contracts/pedidos.schema.json` e neste SOP Mestre (`projeto.md`)[cite: 2].
  - Regras de validação de payload: obrigatoriedade de cliente, endereço completo em Ourinhos, ao menos um item válido no carrinho, taxa fixa de entrega (R$ 5,00) e cálculo determinístico de totais[cite: 1, 3].
  - Não contém código executável nem chamadas de rede diretas.

* **Layer 2 (Orquestração & Supervisão - Gemini 3.8 Flash):**
  - Agente coordenador responsável por ler as diretivas do Layer 1, interpretar as alterações de estado do pipeline e acionar as ferramentas de automação e validação[cite: 2].
  - Monitoramento de pipelines de build, verificação estática de conformidade contra o Design System e execução dos testes de schema antes do empacotamento.
  - Mediação dos ciclos de auto-reparo (*Self-Annealing*) caso testes unitários ou scripts determinísticos falhem[cite: 2].

* **Layer 3 (Execução Determinística & Ferramentas):**
  - Código-fonte da aplicação client-side (`src/index.html`, `src/styles/`, `src/js/`).
  - Módulos ES6 puros integrando o SDK Web v10 do Firebase Firestore (`addDoc`, `onSnapshot`, `updateDoc`)[cite: 3].
  - Scripts determinísticos de automação em CLI (`scripts/build.js`, `scripts/validate-schema.js`).
  - Suítes de testes automatizados (`tests/unit/`, `tests/e2e/`).
  - Todo e qualquer arquivo intermediário, relatório transitório de compilação, cache de build ou artefato de validação **deve residir obrigatoriamente na pasta `.tmp/`** (ignorada no versionamento).
  - Entregáveis compilados finais são despachados para a nuvem (deploy estático automatizado via GitHub Pages e banco de dados gerenciado no Firebase Cloud Firestore)[cite: 3].

## 3. Escopo Tecnológico & Requisitos (Tech Stack)
- **Frontend / Interface:** HTML5 Semântico, CSS3 Moderno (Custom Properties, Flexbox, CSS Grid, Glassmorphism e Dark Mode Neon nativo) e Vanilla JavaScript (ES6 Modules) sem dependência de frameworks pesados[cite: 1, 3].
- **Backend-as-a-Service & Realtime:** Firebase Cloud Firestore SDK v10 (importado via CDN/ES6), fornecendo sincronização bidirecional por WebSockets nativos (`onSnapshot`)[cite: 3].
- **Persistência / Dados:**
  - Coleção NoSQL: `pedidos`[cite: 3].
  - Modelo do Documento:
    ```json
    {
      "cliente": {
        "nome": "string",
        "email": "string",
        "celular": "string",
        "endereco": "string",
        "obsEntrega": "string"
      },
      "itens": [
        {
          "nome": "string",
          "preco": 0.0,
          "quantidade": 1,
          "obsItem": "string"
        }
      ],
      "pagamento": {
        "metodo": "Pix | Cartao_Entrega | Dinheiro_Entrega",
        "troco": 0.0
      },
      "valores": {
        "subtotal": 0.0,
        "taxaEntrega": 5.0,
        "total": 0.0
      },
      "status": "Recebido | Em Preparo | Saiu para Entrega | Entregue",
      "horario": "FieldValue.serverTimestamp()"
    }
    ```
- **Ambiente & Credenciais:** Configurações carregadas em tempo de inicialização via variáveis em `.env` (expostas em pipeline para `src/js/config/firebase-config.js`)[cite: 2, 3].

## 4. Diretrizes de UX/UI e Referências Visuais
- **Inspiração Real:** Padrões ergonômicos de checkout rápido do iFood e visual industrial moderno de terminais KDS profissionais[cite: 1, 3].
- **Tema Visual:** Dark Mode Premium permanente[cite: 1].
  - Fundo: `#0D0E11` (body) e `#20232A` (cards)[cite: 1].
  - Destaques operacionais: Laranja/Amarelo Neon (`#FF8A00` / `#FFC700`) para botões de conversão e badges de atenção[cite: 1].
  - Confirmações: Verde Neon (`#00E065`) com sombra difusa (`box-shadow: 0 0 16px rgba(0, 224, 101, 0.45)`) para fechamento de pedido e status da cozinha[cite: 1].
- **Ergonomia e Responsividade:**
  - Mobile-First: Interface do cliente adaptada com drawer de carrinho deslizante e botões com área de toque mínima de 48px[cite: 1].
  - Desktop/Monitor de Cozinha: Grid responsivo de comandas em 3 a 4 colunas para telas a partir de 1024px e monitores ultra-wide[cite: 1].

## 5. Fluxo Operacional de Execução
1. **Kickoff & Validação de Contratos:**
   - Leitura de `ideia-projeto.md` e consolidação das diretivas visuais em `directives/design/design.md`[cite: 1, 3].
   - Alocação dos diretórios locais (`.tmp/`, `src/`, `scripts/`, `directives/`, `tests/`).
2. **Setup do Pipeline Determinístico (Layer 3):**
   - Criação dos scripts de validação de schema local e mock de carga do Firestore.
   - Configuração de isolamento: saída temporária de bundlers ou linters direcionada a `.tmp/build-cache/`.
3. **Desenvolvimento da Interface (Client View & Kitchen View):**
   - Implementação do HTML semântico com IDs canônicos (`#carrinho`, `#nomeCliente`, `#tipoPagamento`, `#listaPedidos`, `#contadorCarrinho`)[cite: 1].
   - Conexão do script do carrinho reativo e integrador com Firebase Firestore[cite: 3].
4. **Validação & Testes:**
   - Execução de testes automatizados com Node.js test runner validando integridade do schema NoSQL e cálculo matemático de valores.
5. **Empacotamento & Deploy:**
   - Execução do script determinístico de deploy na nuvem (`scripts/deploy.js` via GitHub Actions -> GitHub Pages)[cite: 3].
   - Entrega do guia de terminal `instruction.md` e do launcher local `executar.bat`[cite: 2].

## 6. Definição de Sucesso (Deliverables)
- **Entregáveis em Nuvem:**
  - Aplicação Web acessível via HTTPS no GitHub Pages[cite: 3].
  - Banco de Dados Firestore operante com regras de segurança ativas e coleção `pedidos` sincronizando em tempo real[cite: 3].
- **Artefatos Locais de Repositório:**
  - `directives/design/design.md`: Especificação técnica de UI/UX completa[cite: 1].
  - `README.md`: Documentação visual, instrução de arquitetura e manual de uso do sistema[cite: 2].
  - `instruction.md`: Guia sucinto de comandos CLI de provisionamento e testes[cite: 2].
  - `executar.bat`: Script determinístico em lote para inicialização de servidor estático local e rotinas de validação no Windows[cite: 2].

## 7. Tratamento de Erros, Resiliência e Self-Annealing

O mecanismo de **Self-Annealing** assegura que o sistema se recupere autonomamente de incongruências entre as diretivas do Layer 1 e as execuções do Layer 3 através de um ciclo contínuo de 4 etapas:


```

[Falha Detectada] ➔ [Isolamento em .tmp/] ➔ [Análise de Causa Raiz (L2)] ➔ [Patch Determinístico (L3)] ➔ [Revalidação]

```

1. **Detecção e Captura de Falhas:**
   - **Falhas de Conexão Firestore:** Se a conexão em tempo real cair durante a execução, o cliente transiciona de forma transparente para polling com backoff exponencial (1s, 2s, 4s, até 16s), exibindo um badge discreto de reconexão sem interromper a navegação da UI.
   - **Falhas de Validação de Payload:** Disparos de pedidos que não passem pelo schema determinístico são bloqueados no client, gravando o dump do erro em `.tmp/logs/failed-payloads.log` para depuração e emitindo alerta visual acessível no formulário.
   - **Falhas de Build e Deploy:** Qualquer erro gerado por scripts em CLI gera um traceback completo capturado em `.tmp/reports/error-[timestamp].json`.

2. **Protocolo de Auto-Reparo e Ciclo de Feedback:**
   - Ao identificar uma quebra em testes automatizados ou scripts de validação, o orquestrador (Layer 2) isola o script problemático, analisa o diff com as diretivas do Layer 1 e aplica a correção diretamente no arquivo de execução (Layer 3)[cite: 2].
   - O teste que falhou é re-executado determinística e imediatamente. O avanço para o próximo estágio do pipeline só é liberado mediante saída `0` (Exit Code 0).

3. **Evolução Documental e Bloqueio de Regressão:**
   - Erros recorrentes que exijam adequação de regras de negócio devem promover a atualização formal deste SOP ou dos schemas em `directives/` antes de qualquer alteração de código produtivo.
   - Toda saída intermediária gerada durante as tentativas de reparo do Self-Annealing é purgada de `.tmp/` ao final da operação bem-sucedida, mantendo o repositório limpo.

```