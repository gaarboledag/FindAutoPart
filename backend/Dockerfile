# Development Dockerfile for Backend

FROM node:20-bullseye-slim

# Install OpenSSL and procps for Prisma and NestJS watch mode
RUN apt-get update && \
    apt-get install -y openssl procps && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 4000

# Start in development mode
CMD ["npm", "run", "start:dev"]
