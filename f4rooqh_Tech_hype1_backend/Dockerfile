# ───────────────────────────────────────────
# Stage 1 – Install dependencies
# ───────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json ./
# The project uses bun locally, which is lenient with peer deps.
# --legacy-peer-deps mirrors that behaviour for npm.
# --ignore-scripts prevents prisma generate from running before we copy the schema.
RUN npm install --legacy-peer-deps --ignore-scripts

# ───────────────────────────────────────────
# Stage 2 – Build the application
# ───────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate the Prisma client
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Build the NestJS project
RUN npx nest build

# ───────────────────────────────────────────
# Stage 3 – Production image
# ───────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed for production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# The generated Prisma client is already in node_modules/@prisma/client which is copied above.

# Copy Prisma schema & config (needed for prisma migrate deploy at runtime)
COPY --from=build /app/src/prisma ./src/prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

# Copy mail templates (nested asset referenced in nest-cli.json)
COPY --from=build /app/dist/mail ./dist/mail

EXPOSE 3000

# Run migrations then start the server
CMD ["sh", "-c", "node dist/main.js"]