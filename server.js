import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'data.json');
const AUTH_FILE = path.join(__dirname, 'auth.json');
const ORDERS_FILE = path.join(__dirname, 'service-orders.json');
const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura-' + Date.now();

// Middleware - CORS configurado para produção
app.use(cors({
  origin: '*', // Permite todas as origens (simplificado)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Servir arquivos estáticos do frontend (em produção)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log('📦 Servindo frontend do diretório dist/');
}

// Criar arquivo de dados se não existir
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ clients: [] }, null, 2));
  console.log('✅ Arquivo data.json criado');
}

// Criar arquivo de ordens de serviço se não existir
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify({ serviceOrders: [] }, null, 2));
  console.log('✅ Arquivo service-orders.json criado');
}

// Criar usuário padrão se não existir
if (!fs.existsSync(AUTH_FILE)) {
  const defaultPassword = 'admin123'; // ALTERE ESTA SENHA!
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);
  const authData = {
    username: 'admin',
    password: hashedPassword
  };
  fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2));
  console.log('🔐 Usuário padrão criado:');
  console.log('   Usuário: admin');
  console.log('   Senha: admin123');
  console.log('   ⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
}

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Endpoint de login (público)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Ler dados de autenticação
    const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
    
    // Verificar usuário
    if (username !== authData.username) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    // Verificar senha
    const validPassword = await bcrypt.compare(password, authData.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });
    }
    
    // Gerar token JWT
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    
    console.log(`✅ Login bem-sucedido: ${username}`);
    res.json({ token, username });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Endpoint para alterar senha (protegido)
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Ler dados de autenticação
    const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf8'));
    
    // Verificar senha atual
    const validPassword = await bcrypt.compare(currentPassword, authData.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Senha atual incorreta' });
    }
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    authData.password = hashedPassword;
    
    // Salvar
    fs.writeFileSync(AUTH_FILE, JSON.stringify(authData, null, 2));
    
    console.log('🔐 Senha alterada com sucesso');
    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

// Endpoint para ler dados (protegido)
app.get('/api/clients', authenticateToken, (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const jsonData = JSON.parse(data);
    res.json(jsonData.clients || []);
  } catch (error) {
    console.error('❌ Erro ao ler dados:', error);
    res.status(500).json({ error: 'Erro ao ler dados' });
  }
});

// Endpoint para salvar dados (protegido)
app.post('/api/clients', authenticateToken, (req, res) => {
  try {
    const clients = req.body;
    const data = { 
      clients, 
      lastUpdated: new Date().toISOString() 
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Dados salvos em data.json');
    res.json({ success: true, message: 'Dados salvos com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao salvar dados:', error);
    res.status(500).json({ error: 'Erro ao salvar dados' });
  }
});

// Endpoints de Ordens de Serviço (protegidos)
app.get('/api/service-orders', authenticateToken, (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('❌ Erro ao ler ordens:', error);
    res.status(500).json({ error: 'Erro ao ler ordens de serviço' });
  }
});

app.post('/api/service-orders', authenticateToken, (req, res) => {
  try {
    const { serviceOrders } = req.body;
    const data = { 
      serviceOrders, 
      lastUpdated: new Date().toISOString() 
    };
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
    console.log('💾 Ordens de serviço salvas');
    res.json({ success: true, message: 'Ordens salvas com sucesso' });
  } catch (error) {
    console.error('❌ Erro ao salvar ordens:', error);
    res.status(500).json({ error: 'Erro ao salvar ordens de serviço' });
  }
});

// Endpoint de health check (público)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor rodando' });
});

// Servir o frontend para todas as outras rotas (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend não encontrado. Execute: npm run build');
  }
});

app.listen(PORT, () => {
  console.log('🚀 Servidor backend rodando!');
  console.log(`📡 API disponível em: http://localhost:${PORT}`);
  console.log(`📁 Dados salvos em: ${DATA_FILE}`);
  console.log('');
  console.log('💡 Endpoints disponíveis:');
  console.log(`   GET  http://localhost:${PORT}/api/clients - Ler dados`);
  console.log(`   POST http://localhost:${PORT}/api/clients - Salvar dados`);
  console.log('');
});
