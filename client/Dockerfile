FROM oven/bun:1.1.12-alpine as base

FROM base AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM node:20-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nextjs
RUN adduser -S nextjs -u 1001

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY . .

RUN echo SECRET=$(echo \$RANDOM | md5sum | head -c 10; echo;) >> .env.production

USER nextjs

CMD NODE_ENV=production npx next start -p $CLIENT_PORT -H client