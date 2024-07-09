FROM node:20.15.0-alpine AS base

# Install dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /tmp

COPY --link package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Build the source code
FROM base AS builder

WORKDIR /tmp

COPY --link --from=deps /tmp/node_modules ./node_modules
COPY . .

RUN npm run build

# Copy all files to production image
FROM base AS runner

ARG UID=1001 \
    GID=1001

WORKDIR /walletwatch

RUN addgroup -S nodejs -g ${GID} && \
    adduser -S nextjs -u ${UID}

COPY --link --from=builder /tmp/public ./public
COPY --link --from=builder --chown=${UID}:${GID} /tmp/.next/standalone ./
COPY --link --from=builder --chown=${UID}:${GID} /tmp/.next/static ./.next/static

USER nextjs

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
