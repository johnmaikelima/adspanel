# 🚀 Deploy no Coolify - Guia Simplificado

## ✅ Solução Implementada

Agora o sistema detecta **automaticamente** a URL da API! 
- Em **localhost**: usa `http://localhost:3001/api`
- Em **produção**: usa a mesma URL do site + `/api`

**Não precisa mais configurar variáveis de ambiente!** 🎉

---

## 📦 Deploy no Coolify - UM ÚNICO SERVIÇO

Agora você precisa fazer deploy de **apenas 1 serviço** que serve tanto o backend quanto o frontend!

### **Configuração no Coolify:**

#### 1. Criar novo serviço:
- **Tipo:** Node.js
- **Repositório:** Seu GitHub
- **Branch:** main

#### 2. Build Settings:
```
Build Command: npm install && npm run build
Start Command: node server.js
Port: 3001
```

#### 3. Environment Variables (opcional):
```
PORT=3001
NODE_ENV=production
JWT_SECRET=sua-chave-secreta-aqui
```

#### 4. Domínio:
Configure seu domínio (ex: `adspanel-sub.altusci.com.br`)

---

## 🔧 Como Funciona

### Estrutura após build:
```
adspanel/
├── dist/              ← Frontend compilado
│   ├── index.html
│   └── assets/
├── server.js          ← Backend
├── data.json          ← Dados (criado automaticamente)
└── auth.json          ← Autenticação (criado automaticamente)
```

### Rotas:
```
https://seu-dominio.com/          → Frontend (React)
https://seu-dominio.com/api/login → Backend (API)
https://seu-dominio.com/api/clients → Backend (API)
```

O servidor Express serve:
- **Frontend:** Arquivos estáticos do `/dist`
- **Backend:** Rotas `/api/*`

---

## 🧪 Testar Localmente (Modo Produção)

### 1. Build do frontend:
```bash
npm run build
```

### 2. Iniciar servidor:
```bash
node server.js
```

### 3. Acessar:
```
http://localhost:3001
```

Deve funcionar igual à produção!

---

## ✅ Checklist de Deploy

- [ ] Código commitado no GitHub
- [ ] Criar serviço no Coolify (Node.js)
- [ ] Configurar Build Command: `npm install && npm run build`
- [ ] Configurar Start Command: `node server.js`
- [ ] Configurar Port: `3001`
- [ ] Fazer deploy
- [ ] Acessar URL e testar login

---

## 🔍 Verificar se está funcionando

### 1. Acesse a URL principal:
```
https://adspanel-sub.altusci.com.br
```
Deve mostrar a tela de login

### 2. Teste a API:
```
https://adspanel-sub.altusci.com.br/api/health
```
Deve retornar: `{"status":"ok","message":"Servidor rodando"}`

### 3. Faça login:
```
Usuário: admin
Senha: admin123
```

---

## 🐛 Problemas Comuns

### "Failed to fetch" no login
**Causa:** API não está respondendo

**Verificar:**
1. Abra o console do navegador (F12)
2. Vá em Network
3. Veja qual URL está sendo chamada
4. Deve ser: `https://seu-dominio.com/api/login`

**Solução:**
- Verifique se o build foi feito corretamente
- Veja os logs no Coolify
- Teste a rota `/api/health`

### "404 Not Found" nas rotas da API
**Causa:** Servidor não está rodando ou rotas não configuradas

**Solução:**
- Veja os logs no Coolify
- Verifique se o `server.js` está sendo executado
- Teste: `curl https://seu-dominio.com/api/health`

### Frontend não carrega
**Causa:** Pasta `dist/` não foi criada

**Solução:**
- Verifique se o build command está correto
- Veja os logs do build no Coolify
- Certifique-se que `npm run build` foi executado

---

## 📊 Estrutura de URLs

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | Frontend | Tela de login |
| `/api/login` | Backend | Endpoint de login |
| `/api/clients` | Backend | CRUD de clientes |
| `/api/health` | Backend | Health check |
| `/api/change-password` | Backend | Alterar senha |

---

## 🔒 Segurança

### Alterar senha padrão:
1. Faça login com `admin` / `admin123`
2. Use o sistema normalmente
3. **Importante:** Altere a senha depois!

### Backup dos dados:
Os arquivos `data.json` e `auth.json` ficam no servidor.
Para fazer backup:
1. Acesse o terminal do Coolify
2. Copie os arquivos
3. Guarde em local seguro

---

## 🎯 Resumo

**Antes (complicado):**
- Deploy do backend separado
- Deploy do frontend separado
- Configurar CORS
- Configurar variáveis de ambiente
- Problemas de comunicação

**Agora (simples):**
- ✅ Deploy de 1 serviço só
- ✅ Detecção automática da URL
- ✅ Sem configuração de variáveis
- ✅ Tudo funciona automaticamente

---

**Faça o deploy e teste!** 🚀✨
