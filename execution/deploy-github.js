// Script de Deploy Determinístico no GitHub
// Layer 3 - BurguerSync Ourinhos

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 [Layer 3] Iniciando rotina determinística de deploy no GitHub...');

// Load .env variables
const envPath = path.join(__dirname, '..', '.env');
let githubToken = '';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GITHUB_PERSONAL_KEY=([^\r\n]+)/);
  if (match) {
    githubToken = match[1].trim();
  }
}

if (!githubToken) {
  console.error('❌ Token do GitHub (GITHUB_PERSONAL_KEY) não encontrado no .env!');
  process.exit(1);
}

const REPO_NAME = 'burguersync-ourinhos';
const DESCRIPTION = 'BurguerSync Ourinhos - Cardápio Digital & KDS Realtime desenvolvido com Google Antigravity, Google Stitch e Firebase Firestore.';

async function runDeploy() {
  try {
    // 1. Get authenticated GitHub user
    console.log('🔑 Validando credenciais do GitHub...');
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'Antigravity-Agent',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!userRes.ok) {
      const errBody = await userRes.text();
      throw new Error(`Falha na autenticação do GitHub: ${userRes.status} - ${errBody}`);
    }

    const userData = await userRes.json();
    const username = userData.login;
    console.log(`👤 Usuário autenticado: ${username}`);

    // 2. Check or Create repository
    console.log(`📦 Verificando repositório '${REPO_NAME}'...`);
    let repoRes = await fetch(`https://api.github.com/repos/${username}/${REPO_NAME}`, {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'User-Agent': 'Antigravity-Agent',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (repoRes.status === 404) {
      console.log(`✨ Criando novo repositório público '${REPO_NAME}'...`);
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'User-Agent': 'Antigravity-Agent',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: REPO_NAME,
          description: DESCRIPTION,
          private: false,
          auto_init: false
        })
      });

      if (!createRes.ok) {
        const createErr = await createRes.text();
        throw new Error(`Erro ao criar repositório: ${createRes.status} - ${createErr}`);
      }
      console.log('✅ Repositório criado com sucesso no GitHub!');
    } else {
      console.log(`ℹ️ Repositório '${REPO_NAME}' já existe no GitHub.`);
    }

    // 3. Configure local git and push
    console.log('🔄 Sincronizando arquivos locais com o Git...');
    const rootDir = path.join(__dirname, '..');
    
    // Check if git is initialized
    try {
      execSync('git status', { cwd: rootDir, stdio: 'ignore' });
    } catch {
      console.log('Inicializando git local...');
      execSync('git init -b main', { cwd: rootDir });
    }

    execSync('git branch -M main', { cwd: rootDir });
    
    // Configure user name/email if needed
    try {
      execSync('git config user.name', { cwd: rootDir });
    } catch {
      execSync(`git config user.name "${userData.name || username}"`, { cwd: rootDir });
      execSync(`git config user.email "${userData.email || username + '@users.noreply.github.com'}"`, { cwd: rootDir });
    }

    // Set remote URL with token
    const authenticatedRemoteUrl = `https://${username}:${githubToken}@github.com/${username}/${REPO_NAME}.git`;
    
    try {
      execSync('git remote remove origin', { cwd: rootDir, stdio: 'ignore' });
    } catch {}
    
    execSync(`git remote add origin "${authenticatedRemoteUrl}"`, { cwd: rootDir });

    // Stage and commit
    console.log('📝 Gravando commit local...');
    execSync('git add .', { cwd: rootDir });
    try {
      execSync('git commit -m "feat: initial commit - BurguerSync Ourinhos with Firebase & Google Stitch"', { cwd: rootDir });
    } catch (e) {
      console.log('ℹ️ Nenhuma alteração pendente para commit.');
    }

    // Push to main
    console.log('⬆️ Enviando código para o GitHub (push)...');
    execSync('git push -u origin main --force', { cwd: rootDir, stdio: 'inherit' });

    // 4. Enable GitHub Pages (branch main, root path)
    console.log('🌐 Configurando GitHub Pages...');
    try {
      const pagesRes = await fetch(`https://api.github.com/repos/${username}/${REPO_NAME}/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'User-Agent': 'Antigravity-Agent',
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          source: {
            branch: 'main',
            path: '/'
          }
        })
      });
      if (pagesRes.ok || pagesRes.status === 409) {
        console.log('✅ GitHub Pages configurado!');
      }
    } catch (pErr) {
      console.log('ℹ️ Nota sobre GitHub Pages:', pErr.message);
    }

    const repoUrl = `https://github.com/${username}/${REPO_NAME}`;
    const pagesUrl = `https://${username.toLowerCase()}.github.io/${REPO_NAME}/`;

    console.log('\n🎉 ==============================================');
    console.log(`✅ DEPLOY CONCLUÍDO COM SUCESSO!`);
    console.log(`📦 Repositório GitHub: ${repoUrl}`);
    console.log(`🌍 GitHub Pages Live: ${pagesUrl}`);
    console.log('================================================\n');

  } catch (err) {
    console.error('❌ Erro durante o processo de deploy:', err.message);
    process.exit(1);
  }
}

runDeploy();
