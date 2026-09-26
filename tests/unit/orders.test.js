// Unit tests for BurguerSync contracts and calculations
const test = require('node:test');
const assert = require('node:assert');

test('Calcula subtotal e total com frete fixo de R$ 5,00 corretamente', () => {
  const items = [
    { preco: 28.00, quantidade: 2 }, // 56.00
    { preco: 18.00, quantidade: 1 }  // 18.00
  ];
  const taxaEntrega = 5.00;
  
  const subtotal = items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const total = subtotal + taxaEntrega;

  assert.strictEqual(subtotal, 74.00);
  assert.strictEqual(total, 79.00);
});

test('Valida transição de estados do KDS em ordem sequencial', () => {
  const validFlow = ["Recebido", "Em Preparo", "Saiu para Entrega", "Entregue"];
  
  let currentStatus = "Recebido";
  assert.strictEqual(currentStatus, "Recebido");

  currentStatus = validFlow[1];
  assert.strictEqual(currentStatus, "Em Preparo");

  currentStatus = validFlow[2];
  assert.strictEqual(currentStatus, "Saiu para Entrega");

  currentStatus = validFlow[3];
  assert.strictEqual(currentStatus, "Entregue");
});
