
FROM node:latest AS base

# Устанавливаем pnpm
RUN npm install -g pnpm

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем приложение
RUN pnpm run build

# Production этап
FROM node:18-alpine AS production

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Устанавливаем только production зависимости
RUN pnpm install --frozen-lockfile --prod

# Копируем собранное приложение
COPY --from=base /app/.output ./.output

# Копируем папку public
COPY --from=base /app/public ./public

# Production port and env
ENV NODE_ENV=production
ENV PORT=3002
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3002

# Run Nitro server directly (recommended for production, not nuxt preview)
CMD ["node", ".output/server/index.mjs"]

