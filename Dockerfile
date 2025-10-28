# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build do frontend
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production

# Copiar arquivos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Expor porta
EXPOSE 3001

# Comando para iniciar
CMD ["node", "server.js"]
