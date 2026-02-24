# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Copy source code
COPY . .

# Accept GTM ID as build argument (PUBLIC_ prefix required by Astro/Vite)
ARG PUBLIC_GTM_ID=""
ENV PUBLIC_GTM_ID=${PUBLIC_GTM_ID}

# Build the Astro project
RUN pnpm build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app

# Copy built output and runtime deps
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

EXPOSE 4321

RUN chown -R node:node /app
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4321/ || exit 1

CMD ["node", "./dist/server/entry.mjs"]
