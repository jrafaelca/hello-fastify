# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY ../package.json ../pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
RUN pnpm install --frozen-lockfile --prod
COPY ../src ./src

# Production Stage
FROM node:22-alpine AS runner

# Enable rootless mode
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nodeuser
USER nodeuser
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY ../package.json ./

CMD ["node", "src/server.js"]
