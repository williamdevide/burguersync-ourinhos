// Script de build e checagem de integridade dos arquivos
const fs = require('fs');
const path = require('path');

console.log('🚀 [Layer 3] Iniciando rotina determinística de verificação e build...');

const requiredFiles = [
  'index.html',
  'frontend/index.html',
  'frontend/js/app.js',
  'frontend/js/firebase-config.js',
  'frontend/styles/custom.css',
  'directives/projeto.md',
  'directives/design/design.md',
  'directives/contracts/pedidos.schema.json',
  'documentation/promptHistory.md'
];

let hasErrors = false;
for (const relPath of requiredFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Arquivo obrigatório não encontrado: ${relPath}`);
    hasErrors = true;
  } else {
    const stats = fs.statSync(fullPath);
    console.log(`✅ [OK] ${relPath} (${stats.size} bytes)`);
  }
}

// Ensure .tmp directories exist
const tmpDir = path.join(__dirname, '..', '.tmp', 'build-cache');
fs.mkdirSync(tmpDir, { recursive: true });

if (hasErrors) {
  process.exit(1);
} else {
  console.log('✨ Build e checagem de arquivos concluídos com sucesso!');
  process.exit(0);
}
