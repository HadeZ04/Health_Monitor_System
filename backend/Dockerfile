FROM node:20-alpine

# Build context is repository root (see `docker-compose.yml`)
WORKDIR /app/backend

# Copy deps + Prisma schema early so `@prisma/client` postinstall can run `prisma generate`
COPY backend/package*.json ./
COPY database ../database

RUN npm install

# Copy backend source
COPY backend/. ./

CMD ["npm", "run", "dev"]
