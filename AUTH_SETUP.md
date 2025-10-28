# 🔐 Sistema de Autenticação - Guia Completo

## ✅ O que foi implementado?

Sistema de login seguro com:
- ✅ Tela de login
- ✅ Senha criptografada (bcrypt)
- ✅ Token JWT (sessão de 24h)
- ✅ Proteção de todas as rotas da API
- ✅ Botão de logout
- ✅ Alteração de senha

---

## 🚀 Como Usar

### 1. Instalar dependências:

```bash
npm install
```

### 2. Iniciar o sistema:

```bash
npm start
```

### 3. Acessar:

```
http://localhost:5173
```

Você verá a **tela de login**!

---

## 🔑 Credenciais Padrão

**Na primeira vez que o backend rodar, será criado um usuário padrão:**

```
Usuário: admin
Senha: admin123
```

⚠️ **IMPORTANTE:** Altere a senha após o primeiro login!

---

## 🛡️ Como Funciona

### Fluxo de Autenticação:

```
1. Você acessa o sistema
   ↓
2. Aparece tela de login
   ↓
3. Digita usuário e senha
   ↓
4. Backend verifica credenciais
   ↓
5. Gera token JWT (válido por 24h)
   ↓
6. Token é salvo no navegador
   ↓
7. Todas as requisições incluem o token
   ↓
8. Backend valida o token antes de responder
```

### Segurança:

- ✅ **Senha criptografada** - Usa bcrypt com salt
- ✅ **Token JWT** - Assinado digitalmente
- ✅ **Sessão temporária** - Expira em 24h
- ✅ **Proteção de rotas** - API só responde com token válido
- ✅ **Logout seguro** - Remove token do navegador

---

## 🔄 Alterar Senha

### Opção 1: Pelo Backend (Recomendado)

1. Pare o servidor (Ctrl+C)
2. Abra o arquivo `auth.json`
3. Delete o arquivo
4. Inicie o servidor novamente
5. Um novo usuário será criado com a senha padrão
6. Faça login e altere a senha

### Opção 2: Programaticamente

Você pode adicionar um endpoint no backend para alterar a senha.
O endpoint já está implementado: `POST /api/change-password`

---

## 📁 Arquivos Criados

### Backend:
- `server.js` - Atualizado com autenticação
- `auth.json` - Credenciais do usuário (criado automaticamente)

### Frontend:
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/components/Login.tsx` - Tela de login
- `src/hooks/useClients.ts` - Atualizado para incluir token

---

## 🔒 Segurança para Produção

### O que já está implementado:
- ✅ Senha criptografada
- ✅ Token JWT
- ✅ Proteção de rotas
- ✅ Sessão temporária

### O que você deve fazer:

#### 1. Alterar a chave JWT:
No `server.js`, linha 16:
```javascript
const JWT_SECRET = 'sua-chave-secreta-super-segura-' + Date.now();
```

Troque por uma chave fixa e segura:
```javascript
const JWT_SECRET = 'SuaChaveSecretaMuitoSeguraEComplexa123!@#';
```

#### 2. Usar HTTPS:
- Configure SSL/TLS no servidor
- Use certificado válido

#### 3. Configurar CORS:
No `server.js`, especifique os domínios permitidos:
```javascript
app.use(cors({
  origin: 'https://seudominio.com'
}));
```

#### 4. Variáveis de Ambiente:
Crie um arquivo `.env`:
```
JWT_SECRET=sua-chave-secreta
PORT=3001
```

---

## 🌐 Colocar na Web

### Opções de Hospedagem:

#### 1. **Heroku** (Simples)
- Deploy gratuito
- HTTPS automático
- Fácil configuração

#### 2. **Railway** (Recomendado)
- Deploy automático do GitHub
- HTTPS incluído
- Banco de dados PostgreSQL disponível

#### 3. **DigitalOcean / AWS**
- Mais controle
- Requer configuração manual
- Mais caro

### Passos Gerais:

1. Criar conta no serviço escolhido
2. Conectar repositório GitHub
3. Configurar variáveis de ambiente
4. Deploy automático!

---

## 🐛 Problemas Comuns

### "Usuário ou senha inválidos"
- Verifique se digitou corretamente
- Use as credenciais padrão: admin / admin123

### "Token inválido"
- Faça logout e login novamente
- Token pode ter expirado (24h)

### "Erro ao fazer login"
- Verifique se o backend está rodando
- Veja o console do navegador (F12)

---

## 📊 Resumo

| Recurso | Status |
|---------|--------|
| **Tela de Login** | ✅ Implementado |
| **Senha Criptografada** | ✅ bcrypt |
| **Token JWT** | ✅ 24h de validade |
| **Proteção de Rotas** | ✅ Todas protegidas |
| **Logout** | ✅ Funcional |
| **Alteração de Senha** | ✅ Endpoint criado |
| **HTTPS** | ⚠️ Configure para produção |
| **Múltiplos Usuários** | ❌ Apenas 1 usuário |

---

## 🎯 Próximos Passos (Opcional)

Se quiser melhorar ainda mais:

1. **Múltiplos usuários** - Adicionar tabela de usuários
2. **Recuperação de senha** - Email com link de reset
3. **2FA** - Autenticação de dois fatores
4. **Logs de acesso** - Registrar quem acessou e quando
5. **Permissões** - Admin vs Usuário comum

---

**Agora seu sistema está seguro para uso pessoal na web!** 🎉🔒
