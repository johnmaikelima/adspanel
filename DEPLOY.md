# 🚀 Deploy em Produção - Guia Completo

## 📋 Pré-requisitos

Você precisa fazer deploy de **2 partes**:
1. **Backend** (Node.js/Express) - Porta 3001
2. **Frontend** (React/Vite) - Porta 5173

---

## 🔧 Configuração no Coolify

### **1. Deploy do Backend**

#### Criar novo serviço:
- Tipo: **Node.js**
- Repositório: Seu GitHub
- Branch: `main`

#### Configurações:
```
Build Command: npm install
Start Command: node server.js
Port: 3001
```

#### Variáveis de Ambiente:
```
NODE_ENV=production
PORT=3001
```

#### Após deploy, anote a URL:
```
Exemplo: https://adspanel-backend.seu-dominio.com
```

---

### **2. Deploy do Frontend**

#### Criar novo serviço:
- Tipo: **Static Site** ou **Node.js**
- Repositório: Seu GitHub
- Branch: `main`

#### Configurações:
```
Build Command: npm install && npm run build
Start Command: npm run preview
Port: 4173
```

#### ⚠️ **IMPORTANTE - Variável de Ambiente:**
```
VITE_API_URL=https://adspanel-backend.seu-dominio.com/api
```

**Substitua pela URL real do seu backend!**

---

## 🌐 Configuração de Domínio

### Opção 1: Subdomínios separados
```
Backend:  https://api.adspanel.com
Frontend: https://adspanel.com
```

### Opção 2: Mesmo domínio, paths diferentes
```
Backend:  https://adspanel.com/api
Frontend: https://adspanel.com
```

---

## 🔒 CORS - Configuração Importante

No arquivo `server.js`, atualize o CORS:

```javascript
app.use(cors({
  origin: 'https://adspanel.seu-dominio.com', // URL do frontend
  credentials: true
}));
```

---

## 📝 Checklist de Deploy

### Backend:
- [ ] Deploy realizado
- [ ] Porta 3001 configurada
- [ ] URL anotada
- [ ] CORS configurado com URL do frontend
- [ ] Arquivo `auth.json` será criado automaticamente
- [ ] Arquivo `data.json` será criado automaticamente

### Frontend:
- [ ] Deploy realizado
- [ ] Variável `VITE_API_URL` configurada
- [ ] Apontando para URL do backend
- [ ] Build executado com sucesso

---

## 🧪 Testar Deploy

### 1. Acesse a URL do frontend:
```
https://adspanel.seu-dominio.com
```

### 2. Deve aparecer a tela de login

### 3. Faça login:
```
Usuário: admin
Senha: admin123
```

### 4. Se aparecer "Failed to fetch":
- ✅ Verifique se o backend está rodando
- ✅ Verifique a variável `VITE_API_URL`
- ✅ Verifique o CORS no backend
- ✅ Veja o console do navegador (F12)

---

## 🐛 Problemas Comuns

### "Failed to fetch"
**Causa:** Frontend não consegue acessar o backend

**Soluções:**
1. Verifique se `VITE_API_URL` está correta
2. Verifique se o backend está rodando
3. Teste a URL do backend diretamente:
   ```
   https://seu-backend.com/api/health
   ```
   Deve retornar: `{"status":"ok","message":"Servidor rodando"}`

### "CORS Error"
**Causa:** Backend bloqueando requisições do frontend

**Solução:** Atualize o CORS no `server.js`:
```javascript
app.use(cors({
  origin: 'https://seu-frontend.com',
  credentials: true
}));
```

### "Token inválido"
**Causa:** Token JWT com chave diferente

**Solução:** O token é gerado com timestamp, então cada deploy cria uma nova chave. Faça logout e login novamente.

---

## 📁 Estrutura de Arquivos em Produção

```
Backend (Coolify):
├── server.js
├── package.json
├── data.json (criado automaticamente)
└── auth.json (criado automaticamente)

Frontend (Coolify):
├── dist/ (gerado pelo build)
├── .env (com VITE_API_URL)
└── package.json
```

---

## 🔐 Segurança em Produção

### 1. Altere a senha padrão:
Após primeiro login, altere `admin123` para uma senha forte!

### 2. Use HTTPS:
Coolify já fornece SSL automático ✅

### 3. Backup regular:
- Baixe o arquivo `data.json` periodicamente
- Guarde em local seguro

### 4. Monitore acessos:
- Veja os logs no Coolify
- Identifique tentativas de login suspeitas

---

## 📊 Exemplo de Configuração Completa

### Backend (.env no Coolify):
```
NODE_ENV=production
PORT=3001
```

### Frontend (.env no Coolify):
```
VITE_API_URL=https://adspanel-api.seu-dominio.com/api
```

### CORS no server.js:
```javascript
app.use(cors({
  origin: 'https://adspanel.seu-dominio.com',
  credentials: true
}));
```

---

## ✅ Deploy Bem-Sucedido

Se tudo estiver correto:
1. ✅ Frontend carrega
2. ✅ Tela de login aparece
3. ✅ Login funciona
4. ✅ Dados são salvos
5. ✅ Logout funciona

---

## 🆘 Precisa de Ajuda?

1. Veja os logs no Coolify
2. Abra o console do navegador (F12)
3. Teste a URL do backend diretamente
4. Verifique as variáveis de ambiente

---

**Boa sorte com o deploy!** 🚀✨
