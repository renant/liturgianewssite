# syntax=docker/dockerfile:1

FROM oven/bun:1-debian AS base
WORKDIR /app
ENV TZ=America/Sao_Paulo

# Stage 1: Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build application
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time public environment variables (Dokploy injects build args automatically when configured)
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST=/ingest
ARG NEXT_PUBLIC_ADSENSE_CLIENT_ID
ARG NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_MID
ARG NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_BOTTOM
ARG NEXT_PUBLIC_ADSENSE_PREVIEW
ARG NEXT_PUBLIC_SITE_URL=https://www.liturgianews.site

ENV NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}
ENV NEXT_PUBLIC_POSTHOG_HOST=${NEXT_PUBLIC_POSTHOG_HOST}
ENV NEXT_PUBLIC_ADSENSE_CLIENT_ID=${NEXT_PUBLIC_ADSENSE_CLIENT_ID}
ENV NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_MID=${NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_MID}
ENV NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_BOTTOM=${NEXT_PUBLIC_ADSENSE_SLOT_LITURGY_BOTTOM}
ENV NEXT_PUBLIC_ADSENSE_PREVIEW=${NEXT_PUBLIC_ADSENSE_PREVIEW}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build

# Stage 3: Production runner
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TZ=America/Sao_Paulo
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/headers.ts ./headers.ts
COPY --from=builder /app/mdx-components.tsx ./mdx-components.tsx
COPY --from=builder /app/public ./public
COPY --from=builder /app/liturgia-content ./liturgia-content
COPY --from=builder /app/content ./content
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["bun", "run", "start"]
