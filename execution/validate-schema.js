// Execution Script: Validate JSON Schema and Math Contracts
// Layer 3 Deterministic Tool

const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'directives', 'contracts', 'pedidos.schema.json');

console.log('🔍 [Layer 3] Iniciando validação determinística de contrato de dados...');

if (!fs.existsSync(schemaPath)) {
  console.error('❌ Arquivo de schema não encontrado em:', schemaPath);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

// Sample Test Payload
const validPayload = {
  cliente: {
    nome: "Lucas Moretti",
    email: "lucas@example.com",
    celular: "(14) 99872-4510",
    endereco: "Rua Antônio Prado, 340 - Vila Nova Sá",
    obsEntrega: "Apto 42"
  },
  itens: [
    {
      id: "item-1",
      nome: "Ourinhos Smash Burguer",
      preco: 28.00,
      quantidade: 2,
      obsItem: "Sem cebola"
    },
    {
      id: "item-2",
      nome: "Batata Rústica Suprema",
      preco: 18.00,
      quantidade: 1,
      obsItem: ""
    }
  ],
  pagamento: {
    metodo: "Pix",
    troco: null
  },
  valores: {
    subtotal: 74.00,
    taxaEntrega: 5.00,
    total: 79.00
  },
  status: "Recebido"
};

// Validation checks
function validatePayload(payload) {
  const errors = [];

  // Check required root fields
  for (const field of schema.required) {
    if (payload[field] === undefined || payload[field] === null) {
      errors.push(`Campo obrigatório ausente: ${field}`);
    }
  }

  // Check client fields
  if (!payload.cliente.nome || payload.cliente.nome.length < 2) {
    errors.push('Nome do cliente inválido');
  }
  if (!payload.cliente.celular || payload.cliente.celular.length < 8) {
    errors.push('Celular do cliente inválido');
  }
  if (!payload.cliente.endereco || payload.cliente.endereco.length < 5) {
    errors.push('Endereço do cliente inválido');
  }

  // Check items
  if (!Array.isArray(payload.itens) || payload.itens.length === 0) {
    errors.push('O pedido deve conter pelo menos 1 item');
  }

  // Mathematical accuracy test
  const calculatedSubtotal = payload.itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  if (Math.abs(calculatedSubtotal - payload.valores.subtotal) > 0.01) {
    errors.push(`Subtotal incorreto: calculado ${calculatedSubtotal}, informado ${payload.valores.subtotal}`);
  }

  const calculatedTotal = calculatedSubtotal + payload.valores.taxaEntrega;
  if (Math.abs(calculatedTotal - payload.valores.total) > 0.01) {
    errors.push(`Total incorreto: calculado ${calculatedTotal}, informado ${payload.valores.total}`);
  }

  // Check status
  const validStatuses = ["Recebido", "Em Preparo", "Saiu para Entrega", "Entregue"];
  if (!validStatuses.includes(payload.status)) {
    errors.push(`Status inválido: ${payload.status}`);
  }

  return errors;
}

const errors = validatePayload(validPayload);

if (errors.length > 0) {
  console.error('❌ Falha na validação do payload:', errors);
  process.exit(1);
} else {
  console.log('✅ Contrato e cálculos matemáticos validados com sucesso! (Exit Code: 0)');
  process.exit(0);
}
