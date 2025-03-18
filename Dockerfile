# Install dependencies only when needed
FROM node:22.14.0-bullseye AS deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production \
    && yarn add puppeteer --no-save

# Rebuild the source code only when needed
FROM node:22.14.0-bullseye AS builder
WORKDIR /app

# Copy only what's needed for the build
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Add yarn cache mount to speed up builds
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn build

# Production image, copy all the files and run next
FROM node:22.14.0-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create a non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -m -u 1001 -g nodejs nextjs

# Install Chromium and its dependencies (works on ARM64)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    chromium \
    libxss1 \
    dbus \
    dbus-x11 \
    fonts-liberation \
    fontconfig \
    unzip \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /usr/share/fonts/truetype/inter \
    && wget -q https://github.com/rsms/inter/releases/download/v3.19/Inter-3.19.zip \
    && unzip Inter-3.19.zip -d /tmp/inter \
    && cp /tmp/inter/Inter\ Desktop/Inter-*.ttf /usr/share/fonts/truetype/inter/ \
    && fc-cache -f -v \
    && rm -rf /tmp/inter Inter-3.19.zip

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server ./server
COPY --from=builder /app/tsconfig.server.json ./
COPY --from=builder /app/tsconfig.json ./

# Use non-root user
USER nextjs

EXPOSE 3000

CMD ["yarn", "start"]
