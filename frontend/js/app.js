// BurguerSync Ourinhos - Core Application Logic
// ES6 Modules with Firebase v10 Firestore Integration

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
let app;
let db;
let isFirestoreConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirestoreConnected = true;
  console.log("🔥 Firebase Firestore conectado com sucesso!");
} catch (err) {
  console.warn("⚠️ Falha ao inicializar Firebase (utilizando modo offline resiliente):", err);
}

// Global Application State
export const state = {
  cart: [
    {
      id: "item-smash-default",
      name: "Ourinhos Smash Burguer",
      price: 28.0,
      qty: 1,
      obs: "Sem cebola, cheddar no ponto"
    },
    {
      id: "item-fries-default",
      name: "Batata Rústica Suprema",
      price: 18.0,
      qty: 1,
      obs: ""
    }
  ],
  deliveryFee: 5.0,
  paymentMethod: "Pix",
  activeFilter: "all",
  kdsFilter: "all",
  orders: [],
  activeTrackOrderId: null,
  soundAlertsEnabled: true
};

// Web Audio API Beep Generator for Kitchen Alerts
function playKitchenNotificationSound() {
  if (!state.soundAlertsEnabled) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.log("Audio notification skipped:", e);
  }
}

// Navigation between views (SPA router)
export function switchView(viewName) {
  const views = {
    cliente: document.getElementById("view-cliente"),
    cozinha: document.getElementById("view-cozinha"),
    rastreador: document.getElementById("view-rastreador")
  };

  const navLinks = document.querySelectorAll("[data-nav-target]");

  Object.keys(views).forEach(key => {
    if (views[key]) {
      if (key === viewName) {
        views[key].classList.remove("hidden");
      } else {
        views[key].classList.add("hidden");
      }
    }
  });

  navLinks.forEach(link => {
    if (link.dataset.navTarget === viewName) {
      link.classList.add("bg-surface-container-high", "text-primary-container", "font-bold");
      link.classList.remove("text-on-surface-variant");
    } else {
      link.classList.remove("bg-surface-container-high", "text-primary-container", "font-bold");
      link.classList.add("text-on-surface-variant");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Cart Calculations & DOM Rendering
export function recalculateCart() {
  const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal > 0 ? subtotal + state.deliveryFee : 0;
  const totalQty = state.cart.reduce((acc, item) => acc + item.qty, 0);

  const subEl = document.getElementById("displaySubtotal");
  const feeEl = document.getElementById("displayFee");
  const totEl = document.getElementById("displayTotal");
  const badgeEl = document.getElementById("cartCountBadge");
  const headerCartBadge = document.getElementById("headerCartCount");

  if (subEl) subEl.textContent = `R$ ${subtotal.toFixed(2).replace(".", ",")}`;
  if (feeEl) feeEl.textContent = `R$ ${state.deliveryFee.toFixed(2).replace(".", ",")}`;
  if (totEl) totEl.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  if (badgeEl) badgeEl.textContent = `${totalQty} ${totalQty === 1 ? "item" : "itens"}`;
  if (headerCartBadge) headerCartBadge.textContent = totalQty;
}

export function renderCartList() {
  const container = document.getElementById("cartItemsContainer");
  if (!container) return;

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="py-8 flex flex-col items-center justify-center text-center gap-2">
        <span class="material-symbols-outlined text-text-muted text-[36px]">remove_shopping_cart</span>
        <span class="font-body-md text-text-muted">Sua sacola está vazia.<br>Adicione hambúrgueres artesanais!</span>
      </div>
    `;
    return;
  }

  container.innerHTML = state.cart
    .map(
      item => `
      <div class="cart-item p-3 rounded-2xl bg-bg-surface-2 flex flex-col gap-2 border border-border-subtle/40" data-id="${item.id}">
        <div class="flex items-start justify-between gap-2">
          <div class="flex flex-col">
            <span class="font-label-lg text-text-primary">${item.name}</span>
            <span class="font-label-md text-primary-container font-bold">
              R$ ${(item.price * item.qty).toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div class="flex items-center gap-1 bg-surface-container rounded-lg p-1">
            <button type="button" data-action="decrease-qty" data-item-id="${item.id}" class="w-6 h-6 rounded flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span class="font-label-md text-text-primary px-1.5 font-bold">${item.qty}</span>
            <button type="button" data-action="increase-qty" data-item-id="${item.id}" class="w-6 h-6 rounded flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-container-high transition-colors">
              <span class="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-1.5 bg-surface-container/70 rounded-xl px-2.5 py-1.5 border border-border-subtle/30">
          <span class="material-symbols-outlined ${item.obs ? "text-accent-yellow-neon" : "text-text-muted"} text-[16px]">
            ${item.obs ? "sticky_note_2" : "edit_note"}
          </span>
          <input type="text" value="${item.obs || ""}" data-item-id="${item.id}" data-action="edit-obs" placeholder="Observações (ex: sem salada, molho à parte)" class="obs-input bg-transparent w-full text-text-primary font-body-sm text-xs focus:outline-none placeholder:text-text-muted" />
          <button type="button" data-action="remove-item" data-item-id="${item.id}" class="text-text-muted hover:text-red-400 transition-colors p-1" title="Remover item">
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

export function addToCart(name, price, uniqueKey) {
  const existing = state.cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: `item-${Date.now()}-${uniqueKey || Math.random().toString(36).substr(2, 5)}`,
      name: name,
      price: Number(price),
      qty: 1,
      obs: ""
    });
  }
  renderCartList();
  recalculateCart();

  // Highlight feedback on cart badge
  const headerCartBadge = document.getElementById("headerCartCount");
  if (headerCartBadge) {
    headerCartBadge.classList.add("scale-125");
    setTimeout(() => headerCartBadge.classList.remove("scale-125"), 300);
  }
}

export function updateItemQty(itemId, delta) {
  const item = state.cart.find(i => i.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter(i => i.id !== itemId);
  }
  renderCartList();
  recalculateCart();
}

export function removeItem(itemId) {
  state.cart = state.cart.filter(i => i.id !== itemId);
  renderCartList();
  recalculateCart();
}

export function updateObs(itemId, text) {
  const item = state.cart.find(i => i.id === itemId);
  if (item) {
    item.obs = text;
  }
}

// Payment method setter
export function setPaymentMethod(method) {
  state.paymentMethod = method;

  const btnPix = document.getElementById("pay-pix");
  const btnCard = document.getElementById("pay-card");
  const btnCash = document.getElementById("pay-cash");
  const cashChangeBox = document.getElementById("cashChangeBox");
  const pixInfoBox = document.getElementById("pixInfoBox");

  [btnPix, btnCard, btnCash].forEach(btn => {
    if (btn) {
      btn.classList.remove("bg-surface-container-high", "text-primary-container", "border-primary-container");
      btn.classList.add("bg-bg-surface-2", "text-text-secondary");
    }
  });

  if (method === "Pix" || method === "pix") {
    btnPix?.classList.add("bg-surface-container-high", "text-primary-container", "border-primary-container");
    cashChangeBox?.classList.add("hidden");
    pixInfoBox?.classList.remove("hidden");
  } else if (method === "Cartao_Entrega" || method === "card") {
    btnCard?.classList.add("bg-surface-container-high", "text-primary-container", "border-primary-container");
    cashChangeBox?.classList.add("hidden");
    pixInfoBox?.classList.add("hidden");
  } else if (method === "Dinheiro_Entrega" || method === "cash") {
    btnCash?.classList.add("bg-surface-container-high", "text-primary-container", "border-primary-container");
    cashChangeBox?.classList.remove("hidden");
    pixInfoBox?.classList.add("hidden");
  }
}

// Submit Order (Client View -> Firebase Firestore)
export async function handleCheckout(event) {
  if (event) event.preventDefault();

  if (state.cart.length === 0) {
    alert("⚠️ Seu carrinho está vazio! Adicione ao menos 1 item antes de finalizar.");
    return;
  }

  const custName = document.getElementById("custName")?.value.trim();
  const custPhone = document.getElementById("custPhone")?.value.trim();
  const custAddress = document.getElementById("custAddress")?.value.trim();
  const custInstructions = document.getElementById("custInstructions")?.value.trim() || "";
  const custTroco = document.getElementById("custTroco")?.value.trim() || "";

  if (!custName || !custPhone || !custAddress) {
    alert("⚠️ Por favor, preencha todos os campos obrigatórios (Nome, Celular/WhatsApp e Endereço).");
    return;
  }

  const subtotal = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total = subtotal + state.deliveryFee;

  const payload = {
    cliente: {
      nome: custName,
      celular: custPhone,
      endereco: custAddress,
      obsEntrega: custInstructions
    },
    itens: state.cart.map(item => ({
      nome: item.name,
      preco: item.price,
      quantidade: item.qty,
      obsItem: item.obs || ""
    })),
    pagamento: {
      metodo: state.paymentMethod,
      troco: state.paymentMethod.toLowerCase().includes("dinheiro") || state.paymentMethod === "cash" ? custTroco : null
    },
    valores: {
      subtotal: subtotal,
      taxaEntrega: state.deliveryFee,
      total: total
    },
    status: "Recebido",
    horario: serverTimestamp()
  };

  const submitBtn = document.getElementById("btnSubmitOrder");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span><span>Enviando Pedido...</span>`;
  }

  try {
    let orderId = `BS-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isFirestoreConnected && db) {
      const docRef = await addDoc(collection(db, "pedidos"), payload);
      orderId = docRef.id;
      console.log("✅ Pedido gravado no Firestore com ID:", docRef.id);
    } else {
      // Local fallback simulation
      payload.id = orderId;
      payload.createdAt = new Date().toISOString();
      state.orders.unshift(payload);
      renderKDS();
    }

    state.activeTrackOrderId = orderId;

    // Show Success Modal with Order Details
    const modal = document.getElementById("successModal");
    const modalOrderCode = document.getElementById("modalOrderCode");
    const modalTotal = document.getElementById("modalTotal");
    const modalPaymentMethod = document.getElementById("modalPaymentMethod");

    if (modalOrderCode) modalOrderCode.textContent = `#${orderId.slice(-6).toUpperCase()}`;
    if (modalTotal) modalTotal.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
    if (modalPaymentMethod) modalPaymentMethod.textContent = state.paymentMethod;
    if (modal) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }

    // Clear Cart
    state.cart = [];
    renderCartList();
    recalculateCart();
  } catch (error) {
    console.error("❌ Erro ao enviar pedido:", error);
    alert("Ocorreu um erro ao registrar o pedido. Verifique sua conexão.");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[22px]">bolt</span><span>Finalizar e Enviar para Cozinha</span>`;
    }
  }
}

// Real-time Firestore Listener for Kitchen KDS
export function setupRealtimeKDS() {
  if (!isFirestoreConnected || !db) {
    console.warn("Modo local ativo para KDS.");
    renderKDS();
    return;
  }

  try {
    const q = query(collection(db, "pedidos"), orderBy("horario", "desc"));
    onSnapshot(
      q,
      snapshot => {
        const previousCount = state.orders.length;
        state.orders = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));

        // Trigger sound alert on new incoming orders
        if (state.orders.length > previousCount && previousCount > 0) {
          playKitchenNotificationSound();
        }

        renderKDS();
        updateKDSMetrics();
        if (state.activeTrackOrderId) {
          updateTrackView(state.activeTrackOrderId);
        }
      },
      error => {
        console.error("Erro no onSnapshot do Firestore:", error);
      }
    );
  } catch (err) {
    console.error("Falha ao configurar escutador em tempo real:", err);
  }
}

// Advance Order Status (KDS Action)
export async function advanceOrderStatus(orderId, nextStatus) {
  if (!orderId || !nextStatus) return;

  try {
    if (isFirestoreConnected && db) {
      const orderRef = doc(db, "pedidos", orderId);
      await updateDoc(orderRef, { status: nextStatus });
      console.log(`Status do pedido ${orderId} atualizado para ${nextStatus}`);
    } else {
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = nextStatus;
        renderKDS();
        updateKDSMetrics();
      }
    }
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    alert("Falha ao atualizar status do pedido.");
  }
}

// Render KDS Kanban Board
export function renderKDS() {
  const container = document.getElementById("kdsOrdersGrid");
  if (!container) return;

  let filtered = state.orders;
  if (state.kdsFilter !== "all") {
    filtered = state.orders.filter(o => o.status === state.kdsFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 flex flex-col items-center justify-center text-center gap-3 bg-surface-container rounded-2xl border border-border-subtle/40">
        <span class="material-symbols-outlined text-text-muted text-[48px]">check_circle_outline</span>
        <h3 class="font-headline-md text-text-primary">Nenhum pedido nesta fila</h3>
        <p class="font-body-md text-text-secondary">Tudo pronto e expedido! Novos pedidos aparecerão automaticamente.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map(order => {
      const isRecebido = order.status === "Recebido";
      const isPreparo = order.status === "Em Preparo";
      const isEntrega = order.status === "Saiu para Entrega";
      const isEntregue = order.status === "Entregue";

      let statusColor = "bg-accent-yellow-neon";
      let statusTextColor = "text-accent-yellow-neon";
      let statusBadgeBg = "bg-accent-yellow-neon/20";
      let statusGlow = "shadow-[0_0_12px_rgba(255,208,0,0.8)]";
      let nextActionBtn = "";

      if (isRecebido) {
        statusColor = "bg-accent-yellow-neon";
        statusTextColor = "text-accent-yellow-neon";
        statusBadgeBg = "bg-accent-yellow-neon/20";
        statusGlow = "shadow-[0_0_12px_rgba(255,208,0,0.8)]";
        nextActionBtn = `
          <button type="button" onclick="window.BurguerSync.advanceOrderStatus('${order.id}', 'Em Preparo')" class="w-full py-2.5 px-4 rounded-xl bg-primary-container hover:bg-accent-orange-hover text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(255,122,0,0.35)] transition-all active:scale-98">
            <span>Iniciar Preparo</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        `;
      } else if (isPreparo) {
        statusColor = "bg-status-purple";
        statusTextColor = "text-status-purple";
        statusBadgeBg = "bg-status-purple/20";
        statusGlow = "shadow-[0_0_12px_rgba(157,78,221,0.8)]";
        nextActionBtn = `
          <button type="button" onclick="window.BurguerSync.advanceOrderStatus('${order.id}', 'Saiu para Entrega')" class="w-full py-2.5 px-4 rounded-xl bg-status-purple hover:bg-status-purple/90 text-white font-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(157,78,221,0.4)] transition-all active:scale-98">
            <span>Despachar Motoboy</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        `;
      } else if (isEntrega) {
        statusColor = "bg-status-blue";
        statusTextColor = "text-status-blue";
        statusBadgeBg = "bg-status-blue/20";
        statusGlow = "shadow-[0_0_12px_rgba(41,121,255,0.8)]";
        nextActionBtn = `
          <button type="button" onclick="window.BurguerSync.advanceOrderStatus('${order.id}', 'Entregue')" class="w-full py-2.5 px-4 rounded-xl bg-secondary hover:bg-accent-green-hover text-on-secondary font-label-lg font-bold flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(125,255,162,0.4)] transition-all active:scale-98">
            <span class="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Confirmar Entrega</span>
          </button>
        `;
      } else if (isEntregue) {
        statusColor = "bg-secondary";
        statusTextColor = "text-secondary";
        statusBadgeBg = "bg-secondary/20";
        statusGlow = "shadow-[0_0_12px_rgba(0,230,118,0.8)]";
        nextActionBtn = `
          <div class="w-full py-2 px-4 rounded-xl bg-surface-container-high text-secondary font-label-md font-semibold flex items-center justify-center gap-1">
            <span class="material-symbols-outlined text-[18px]">done_all</span>
            <span>Pedido Finalizado</span>
          </div>
        `;
      }

      const formattedTotal = order.valores?.total
        ? `R$ ${Number(order.valores.total).toFixed(2).replace(".", ",")}`
        : "R$ 0,00";

      const itemsHtml = (order.itens || [])
        .map(
          item => `
          <div class="flex flex-col gap-1 bg-surface-container-low p-2.5 rounded-lg">
            <div class="flex items-center justify-between">
              <span class="font-label-lg text-text-primary">${item.quantidade}x ${item.nome}</span>
              <span class="font-label-sm text-text-muted">R$ ${(Number(item.preco) * Number(item.quantidade)).toFixed(2).replace(".", ",")}</span>
            </div>
            ${
              item.obsItem
                ? `
              <div class="mt-0.5 px-2 py-1 rounded bg-accent-yellow-neon/15 text-accent-yellow-neon font-label-sm flex items-start gap-1">
                <span class="material-symbols-outlined text-[14px] shrink-0 mt-0.5">warning</span>
                <span><strong>Obs:</strong> ${item.obsItem}</span>
              </div>
            `
                : ""
            }
          </div>
        `
        )
        .join("");

      return `
        <article class="flex flex-col rounded-2xl bg-surface-container shadow-xl overflow-hidden relative border border-border-subtle/50 transition-all duration-300 hover:border-primary-container/40">
          <div class="h-1.5 w-full ${statusColor} ${statusGlow}"></div>
          <div class="p-4 sm:p-5 flex flex-col flex-1 gap-4">
            <div class="flex items-start justify-between gap-2">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-headline-lg text-text-primary tracking-tight font-bold">#${order.id.slice(-4).toUpperCase()}</span>
                  <span class="px-2.5 py-0.5 rounded-full ${statusBadgeBg} ${statusTextColor} font-label-sm font-bold tracking-wider uppercase">
                    ${order.status}
                  </span>
                </div>
                <span class="font-body-sm text-text-secondary mt-1 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px]">schedule</span>
                  ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <button type="button" onclick="window.BurguerSync.printOrderReceipt('${order.id}')" class="p-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-text-secondary hover:text-text-primary transition-colors" title="Imprimir Comanda">
                <span class="material-symbols-outlined text-[18px]">print</span>
              </button>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest flex flex-col gap-1 border border-border-subtle/30">
              <div class="flex items-center justify-between text-text-primary font-label-md">
                <span class="flex items-center gap-1.5 font-bold">
                  <span class="material-symbols-outlined text-[16px] text-primary-container">person</span>
                  ${order.cliente?.nome || "Cliente"}
                </span>
                <span class="text-text-secondary font-body-sm">${order.cliente?.celular || ""}</span>
              </div>
              <div class="flex items-center gap-1 text-text-secondary font-body-sm truncate">
                <span class="material-symbols-outlined text-[14px] shrink-0 text-text-muted">place</span>
                <span class="truncate">${order.cliente?.endereco || "Ourinhos / SP"}</span>
              </div>
              ${
                order.cliente?.obsEntrega
                  ? `<div class="text-xs text-text-muted mt-1 italic">Ref: ${order.cliente.obsEntrega}</div>`
                  : ""
              }
            </div>

            <div class="flex flex-col gap-2 flex-1 max-h-48 overflow-y-auto pr-1">
              ${itemsHtml}
            </div>

            <div class="pt-2 border-t border-border-subtle/40 flex items-center justify-between text-body-sm text-text-secondary">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-secondary">payments</span>
                <span>${order.pagamento?.metodo || "Pix"}</span>
              </span>
              <span class="font-headline-sm text-text-primary font-bold">${formattedTotal}</span>
            </div>

            <div class="mt-auto pt-1">
              ${nextActionBtn}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

// Update KDS Header Metrics
export function updateKDSMetrics() {
  const pendingCount = state.orders.filter(o => o.status === "Recebido").length;
  const prepCount = state.orders.filter(o => o.status === "Em Preparo").length;
  const dispatchCount = state.orders.filter(o => o.status === "Saiu para Entrega").length;
  const activeCount = state.orders.filter(o => o.status !== "Entregue").length;

  const metricPending = document.getElementById("metricPending");
  const metricPrep = document.getElementById("metricPrep");
  const metricDispatch = document.getElementById("metricDispatch");
  const badgeKdsActive = document.getElementById("badgeKdsActive");
  const navKdsBadge = document.getElementById("navKdsBadge");

  if (metricPending) metricPending.textContent = pendingCount;
  if (metricPrep) metricPrep.textContent = prepCount;
  if (metricDispatch) metricDispatch.textContent = dispatchCount;
  if (badgeKdsActive) badgeKdsActive.textContent = `${activeCount} Pedidos Ativos`;
  if (navKdsBadge) navKdsBadge.textContent = activeCount;
}

// Update Tracking View for customer
export function updateTrackView(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  const trackContainer = document.getElementById("trackOrderResult");
  if (!trackContainer) return;

  if (!order) {
    trackContainer.innerHTML = `
      <div class="p-8 bg-surface-container rounded-2xl text-center flex flex-col items-center gap-3">
        <span class="material-symbols-outlined text-accent-yellow-neon text-[40px]">search_off</span>
        <h3 class="font-headline-md text-text-primary">Pedido #${orderId} não encontrado</h3>
        <p class="font-body-md text-text-secondary">Verifique o código informado ou faça um novo pedido no cardápio.</p>
      </div>
    `;
    return;
  }

  const steps = [
    { title: "Pedido Recebido", desc: "A cozinha confirmou sua comanda.", key: "Recebido" },
    { title: "Em Preparo na Chapa", desc: "Smash burgers sendo prensados e montados.", key: "Em Preparo" },
    { title: "Saiu para Entrega", desc: "Motoboy a caminho do seu endereço em Ourinhos.", key: "Saiu para Entrega" },
    { title: "Entregue & Saboreado", desc: "Bom apetite!", key: "Entregue" }
  ];

  const statusOrder = ["Recebido", "Em Preparo", "Saiu para Entrega", "Entregue"];
  const currentIdx = statusOrder.indexOf(order.status);

  const stepsHtml = steps
    .map((step, idx) => {
      const isPassed = idx <= currentIdx;
      const isCurrent = idx === currentIdx;

      return `
      <div class="flex items-start gap-4 relative">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            isPassed
              ? "bg-secondary text-on-secondary shadow-[0_0_12px_rgba(0,230,118,0.5)]"
              : "bg-surface-container-high text-text-muted"
          }">
            ${isPassed ? '<span class="material-symbols-outlined text-[20px]">check</span>' : idx + 1}
          </div>
          ${idx < steps.length - 1 ? `<div class="w-0.5 h-12 ${idx < currentIdx ? "bg-secondary" : "bg-border-subtle"}"></div>` : ""}
        </div>
        <div class="flex flex-col pt-1.5">
          <span class="font-headline-sm text-text-primary ${isCurrent ? "text-primary-container font-bold" : ""}">${step.title}</span>
          <span class="font-body-sm text-text-secondary">${step.desc}</span>
        </div>
      </div>
    `;
    })
    .join("");

  trackContainer.innerHTML = `
    <div class="p-6 sm:p-8 bg-bg-surface-1 rounded-3xl border border-border-subtle shadow-2xl flex flex-col gap-6 max-w-2xl mx-auto">
      <div class="flex items-center justify-between border-b border-border-subtle pb-4">
        <div class="flex flex-col">
          <span class="font-label-sm text-secondary uppercase tracking-widest font-bold">Acompanhamento ao Vivo</span>
          <h2 class="font-headline-lg text-text-primary">Pedido #${order.id.slice(-6).toUpperCase()}</h2>
        </div>
        <span class="px-3 py-1 rounded-full bg-primary-container/20 text-primary-container font-label-md font-bold">
          ${order.status}
        </span>
      </div>

      <div class="flex flex-col gap-2 py-2">
        ${stepsHtml}
      </div>

      <div class="p-4 bg-surface-container rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div class="flex items-center gap-2 text-text-secondary">
          <span class="material-symbols-outlined text-primary-container">location_on</span>
          <span>Entrega em: <strong>${order.cliente?.endereco || "Ourinhos / SP"}</strong></span>
        </div>
        <div class="font-bold text-secondary text-base">
          Total: R$ ${Number(order.valores?.total || 0).toFixed(2).replace(".", ",")}
        </div>
      </div>
    </div>
  `;
}

// Print Order Thermal Receipt
export function printOrderReceipt(orderId) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  const printWindow = window.open("", "_blank", "width=380,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Comanda #${order.id.slice(-6).toUpperCase()}</title>
      <style>
        body { font-family: monospace; font-size: 13px; line-height: 1.4; padding: 10px; color: #000; }
        .center { text-align: center; }
        .line { border-bottom: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; }
        .bold { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="center bold">BURGUERSYNC OURINHOS</div>
      <div class="center">Artesanal & Kitchen Sync</div>
      <div class="line"></div>
      <div><strong>Comanda:</strong> #${order.id.slice(-6).toUpperCase()}</div>
      <div><strong>Data/Hora:</strong> ${new Date().toLocaleString("pt-BR")}</div>
      <div><strong>Cliente:</strong> ${order.cliente?.nome || "Cliente"}</div>
      <div><strong>Tel:</strong> ${order.cliente?.celular || "-"}</div>
      <div><strong>Endereço:</strong> ${order.cliente?.endereco || "-"}</div>
      ${order.cliente?.obsEntrega ? `<div><strong>Ref:</strong> ${order.cliente.obsEntrega}</div>` : ""}
      <div class="line"></div>
      <div class="bold">ITENS DO PEDIDO:</div>
      ${(order.itens || [])
        .map(
          i => `
        <div class="row">
          <span>${i.quantidade}x ${i.nome}</span>
          <span>R$ ${(Number(i.preco) * Number(i.quantidade)).toFixed(2)}</span>
        </div>
        ${i.obsItem ? `<div style="font-size: 11px; padding-left: 10px;">>> Obs: ${i.obsItem}</div>` : ""}
      `
        )
        .join("")}
      <div class="line"></div>
      <div class="row"><span>Subtotal:</span><span>R$ ${Number(order.valores?.subtotal || 0).toFixed(2)}</span></div>
      <div class="row"><span>Taxa Entrega:</span><span>R$ ${Number(order.valores?.taxaEntrega || 5).toFixed(2)}</span></div>
      <div class="row bold" style="font-size: 15px;"><span>TOTAL:</span><span>R$ ${Number(order.valores?.total || 0).toFixed(2)}</span></div>
      <div class="row"><span>Pagamento:</span><span>${order.pagamento?.metodo || "Pix"}</span></div>
      ${order.pagamento?.troco ? `<div class="row"><span>Troco para:</span><span>${order.pagamento.troco}</span></div>` : ""}
      <div class="line"></div>
      <div class="center" style="font-size: 11px;">Impresso via BurguerSync KDS Ourinhos</div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// Global Exposure for inline HTML handlers
window.BurguerSync = {
  switchView,
  addToCart,
  updateItemQty,
  removeItem,
  updateObs,
  setPaymentMethod,
  handleCheckout,
  advanceOrderStatus,
  printOrderReceipt,
  trackOrder: orderId => {
    state.activeTrackOrderId = orderId;
    switchView("rastreador");
    updateTrackView(orderId);
  }
};

// Initialization on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  renderCartList();
  recalculateCart();
  setupRealtimeKDS();

  // Category Filter Listener
  document.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(b => {
        b.classList.remove("bg-primary-container", "text-on-primary", "shadow-[0_0_16px_rgba(255,122,0,0.35)]");
        b.classList.add("bg-bg-surface-1", "text-text-secondary");
      });
      btn.classList.add("bg-primary-container", "text-on-primary", "shadow-[0_0_16px_rgba(255,122,0,0.35)]");
      btn.classList.remove("bg-bg-surface-1", "text-text-secondary");

      const filter = btn.dataset.filter;
      document.querySelectorAll(".product-card").forEach(card => {
        if (filter === "all" || card.dataset.category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // KDS Filter Listener
  document.querySelectorAll("[data-kds-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-kds-filter]").forEach(b => {
        b.classList.remove("bg-surface-container-high", "border-primary-container");
        b.classList.add("bg-surface-container");
      });
      btn.classList.add("bg-surface-container-high", "border-primary-container");
      btn.classList.remove("bg-surface-container");

      state.kdsFilter = btn.dataset.kdsFilter;
      renderKDS();
    });
  });

  // Navigation Links Listener
  document.querySelectorAll("[data-nav-target]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      switchView(btn.dataset.navTarget);
    });
  });

  // Event Delegation for Cart Actions
  const cartContainer = document.getElementById("cartItemsContainer");
  if (cartContainer) {
    cartContainer.addEventListener("click", e => {
      const target = e.target.closest("button");
      if (!target) return;
      const action = target.dataset.action;
      const itemId = target.dataset.itemId;
      if (action === "increase-qty") updateItemQty(itemId, 1);
      if (action === "decrease-qty") updateItemQty(itemId, -1);
      if (action === "remove-item") removeItem(itemId);
    });

    cartContainer.addEventListener("input", e => {
      if (e.target.dataset.action === "edit-obs") {
        updateObs(e.target.dataset.itemId, e.target.value);
      }
    });
  }

  // Checkout Form Listener
  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("submit", handleCheckout);
  }

  // Live Clock Updater for KDS
  function updateKDSClock() {
    const clockEl = document.getElementById("kds-clock");
    if (clockEl) {
      clockEl.textContent = new Date().toLocaleTimeString("pt-BR");
    }
  }
  setInterval(updateKDSClock, 1000);
  updateKDSClock();

  // Search / Track form listener
  const trackForm = document.getElementById("trackOrderForm");
  if (trackForm) {
    trackForm.addEventListener("submit", e => {
      e.preventDefault();
      const codeInput = document.getElementById("trackCodeInput");
      if (codeInput && codeInput.value.trim()) {
        window.BurguerSync.trackOrder(codeInput.value.trim());
      }
    });
  }
});
