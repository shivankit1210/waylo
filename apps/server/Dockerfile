FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations and workspace manifests
COPY package*.json tsconfig.base.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/server/package*.json ./apps/server/

# Install dependencies across workspaces
RUN npm ci

# Copy shared package and server code
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build shared package and prisma client
RUN npm run build --workspace=@waylo/shared
RUN npx prisma generate --schema=apps/server/prisma/schema.prisma
RUN npm run build --workspace=@waylo/server

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/server/package*.json ./apps/server/

RUN npm ci --omit=dev

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3001

CMD ["node", "apps/server/dist/server.js"]
