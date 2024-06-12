FROM oven/bun:1.1.12-alpine as base

RUN addgroup -S appgroup && adduser -S app -G appgroup
USER app

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY --chown=app:app . /app
RUN echo JWT_SECRETS=$(echo \$RANDOM | md5sum | head -c 10; echo;) > .env
RUN chmod 755 /app/migration.sh
CMD ["/bin/sh", "-c", "env;./migration.sh && HOST=api PORT=${API_PORT} bun start"]