# 🚀 Configuração do Backend - Salvamento em Arquivo

## ✅ O que mudou?

Agora os dados são salvos automaticamente em um arquivo `data.json` na pasta raiz do projeto!

### Vantagens:
- ✅ Dados salvos em arquivo (não perde ao trocar de navegador)
- ✅ Backup automático no localStorage
- ✅ Funciona offline
- ✅ Fácil fazer backup (só copiar o arquivo data.json)

---

## 📋 Instalação (Primeira vez)

### 1. Instalar dependências do backend:

```bash
npm install
```

Isso vai instalar:
- `express` - Servidor web
- `cors` - Permitir requisições do frontend

---

## 🎯 Como Usar

### ⚡ Opção 1: Comando Único (RECOMENDADO)

Rode tudo de uma vez com um único comando:

```bash
npm start
```

Você verá:
```
[BACKEND] 🚀 Servidor backend rodando!
[BACKEND] 📡 API disponível em: http://localhost:3001
[BACKEND] 📁 Dados salvos em: C:\Users\...\adspanel\data.json
[FRONTEND] VITE v7.1.7  ready in 500 ms
[FRONTEND] ➜  Local:   http://localhost:5173/
```

### 📋 Opção 2: Comandos Separados (se preferir)

#### Terminal 1 - Backend:
```bash
npm run server
```

#### Terminal 2 - Frontend:
```bash
npm run dev
```

---

## 🔄 Migração Automática

**Seus dados atuais NÃO serão perdidos!**

Na primeira vez que você abrir o sistema com o backend rodando:
1. O sistema detecta que o arquivo `data.json` está vazio
2. Busca os dados do localStorage
3. Migra automaticamente para o arquivo
4. Você verá no console: "🔄 Migrando dados do localStorage para o arquivo..."
5. Depois: "✅ Migração concluída! Dados salvos em data.json"

---

## 📁 Onde ficam os dados?

Os dados ficam salvos em:
```
adspanel/
├── data.json  ← SEUS DADOS AQUI!
├── server.js
└── src/
```

### Estrutura do data.json:
```json
{
  "clients": [
    {
      "id": "...",
      "name": "Cliente X",
      "email": "cliente@email.com",
      "monthlyData": [...],
      "organicData": [...],
      "control": {...}
    }
  ],
  "lastUpdated": "2025-10-27T16:55:00.000Z"
}
```

---

## 💾 Backup

### Fazer backup:
Simplesmente copie o arquivo `data.json` para um local seguro!

### Restaurar backup:
1. Pare o servidor (Ctrl+C no terminal do backend)
2. Substitua o arquivo `data.json` pelo backup
3. Inicie o servidor novamente

---

## ⚠️ Importante

### O sistema funciona em 2 modos:

#### Modo 1: Com Backend (Recomendado)
- ✅ Dados salvos em arquivo
- ✅ Funciona em qualquer navegador
- ✅ Não perde dados ao limpar cache
- ⚠️ Precisa rodar 2 comandos

#### Modo 2: Sem Backend (Fallback)
- ✅ Funciona automaticamente se o backend não estiver rodando
- ✅ Usa localStorage
- ⚠️ Perde dados ao limpar cache do navegador

---

## 🐛 Problemas Comuns

### "Erro ao salvar na API"
**Solução:** Certifique-se que o backend está rodando (`npm run server`)

### "Porta 3001 já está em uso"
**Solução:** Feche outros programas usando a porta ou altere a porta no `server.js`

### Dados não aparecem
**Solução:** 
1. Verifique se o backend está rodando
2. Abra o console do navegador (F12)
3. Veja se há mensagens de erro

---

## 📞 Resumo Rápido

```bash
# 1. Instalar (só na primeira vez)
npm install

# 2. Rodar sempre (UM ÚNICO COMANDO):
npm start

# 3. Acessar:
http://localhost:5173
```

**Pronto! Seus dados agora estão seguros em arquivo!** 🎉

---

## 💡 Dica

Para parar o sistema, pressione **Ctrl+C** no terminal. Isso vai parar tanto o backend quanto o frontend automaticamente!
