# ==========================================
# Naruto RPG - Мультистейдж Dockerfile
# Собирает React/Vite клиент и запускает production Node.js сервер
# Подходит для Render, Railway, Fly.io и любого VPS
# ==========================================

# --- СТЕЙДЖ 1: Сборка фронтенда ---
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# --- СТЕЙДЖ 2: Production сервер ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV DATA_DIR=/app/data

# Установка зависимостей сервера
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

WORKDIR /app
# Копирование исходников сервера
COPY server/ ./server/
# Копирование файлов правил (0.3.2, 0.3.3 и будущих)
COPY rules/ ./rules/
# Копирование скомпилированного фронтенда в статику
COPY --from=client-builder /app/client/dist ./client/dist

# Создание директории для постоянного хранилища
RUN mkdir -p /app/data && chown -R node:node /app

USER node
EXPOSE 4000

# Точка входа
CMD ["node", "server/index.js"]
