FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /tmp

COPY package*.json ./

RUN --mount=type=cache,target=/.npm \
    npm ci

# Build the source code
FROM base AS builder

WORKDIR /tmp

COPY --from=deps /tmp/node_modules ./node_modules
COPY . .

RUN npm run build

# Copy all files to production image
FROM base AS runner

WORKDIR /walletwatch

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /tmp/public ./public
COPY --from=builder --chown=nextjs:nodejs /tmp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /tmp/.next/static ./.next/static

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
