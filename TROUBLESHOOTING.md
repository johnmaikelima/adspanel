# 🔍 Troubleshooting - Coolify Deploy

## ❌ Problema: "Failed to fetch" ou erro de login

### 🧪 **Teste 1: Verificar se o backend está rodando**

Acesse no navegador:
```
https://adspanel-sub.altusci.com.br/api/health
```

**Resultado esperado:**
```json
{"status":"ok","message":"Servidor rodando"}
```

**Se retornar 404 ou erro:**
→ O backend NÃO está rodando! ❌

---

## ✅ **Soluções:**

### **Solução 1: Verificar Start Command**

No Coolify, vá em **Settings** → **Build & Deploy**

Certifique-se que está:
```
Build Command: npm install && npm run build
Start Command: node server.js
Port: 3001
```

**Salve e faça Redeploy!**

---

### **Solução 2: Usar Dockerfile (Recomendado)**

O Dockerfile garante que tudo seja configurado corretamente.

#### No Coolify:
1. Vá em **Settings**
2. Ative **"Use Dockerfile"**
3. Certifique-se que o Dockerfile está no repositório
4. Faça **Redeploy**

---

### **Solução 3: Verificar Logs**

No Coolify, vá em **Logs** e procure por:

#### ✅ **Logs corretos:**
```
🚀 Servidor backend rodando!
📡 API disponível em: http://localhost:3001
📁 Dados salvos em: /app/data.json
✅ Arquivo data.json criado
🔐 Usuário padrão criado:
   Usuário: admin
   Senha: admin123
```

#### ❌ **Logs de erro:**
```
Error: Cannot find module 'express'
→ Dependências não instaladas

ENOENT: no such file or directory, open 'dist/index.html'
→ Build do frontend não foi feito

Port 3001 is already in use
→ Porta em conflito
```

---

## 🔧 **Teste Manual no Terminal do Coolify**

Acesse o terminal do container e execute:

```bash
# Verificar se o server.js existe
ls -la server.js

# Verificar se o dist existe
ls -la dist/

# Verificar se as dependências estão instaladas
ls -la node_modules/express

# Tentar rodar manualmente
node server.js
```

---

## 📊 **Checklist de Verificação**

### Backend:
- [ ] `server.js` existe no repositório
- [ ] Dependências no `package.json` incluem: express, cors, bcrypt, jsonwebtoken
- [ ] Start Command é `node server.js`
- [ ] Porta configurada é `3001`
- [ ] Logs mostram "Servidor backend rodando"
- [ ] `/api/health` retorna 200 OK

### Frontend:
- [ ] `npm run build` gera pasta `dist/`
- [ ] `dist/index.html` existe
- [ ] Build Command inclui `npm run build`
- [ ] `src/config.ts` existe com detecção automática de URL

### Rede:
- [ ] URL do site funciona
- [ ] Console do navegador (F12) mostra requisições para `/api/login`
- [ ] Requisições vão para `https://seu-dominio.com/api/login` (não localhost)
- [ ] Não há erros de CORS

---

## 🎯 **Teste Rápido**

### 1. Acesse o site:
```
https://adspanel-sub.altusci.com.br
```

### 2. Abra o console (F12) e digite:
```javascript
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
```

**Deve retornar:**
```json
{status: "ok", message: "Servidor rodando"}
```

**Se retornar erro:**
→ Backend não está rodando!

---

## 🚨 **Erro Comum: Coolify rodando apenas o frontend**

### Sintomas:
- ✅ Site carrega
- ✅ Tela de login aparece
- ❌ Login não funciona
- ❌ `/api/health` retorna 404

### Causa:
Coolify está usando `vite preview` ou similar em vez de `node server.js`

### Solução:
1. Vá em **Settings** → **Build & Deploy**
2. Mude **Start Command** para: `node server.js`
3. **Redeploy**

---

## 📝 **Configuração Correta no Coolify**

### Para Node.js (sem Dockerfile):
```
Type: Node.js
Build Command: npm install && npm run build
Start Command: node server.js
Port: 3001
```

### Para Docker (com Dockerfile):
```
Type: Docker
Dockerfile: ./Dockerfile
Port: 3001
```

---

## 🔄 **Fluxo Correto de Deploy**

```
1. Git push
   ↓
2. Coolify detecta mudança
   ↓
3. Executa: npm install
   ↓
4. Executa: npm run build (gera dist/)
   ↓
5. Executa: node server.js
   ↓
6. Servidor Express inicia
   ↓
7. Serve frontend (dist/) e backend (/api)
   ↓
8. ✅ Tudo funcionando!
```

---

## 💡 **Dica Final**

Se nada funcionar, tente:

1. **Delete o serviço no Coolify**
2. **Crie um novo** do zero
3. **Use o Dockerfile**
4. **Configure corretamente**
5. **Deploy**

Às vezes o Coolify fica com configurações antigas em cache.

---

**Ainda com problemas? Compartilhe os logs do Coolify!** 🔍
