# Development Dockerfile for Backend

FROM node:18-slim

# Install OpenSSL 1.1 and procps for Prisma and NestJS watch mode
RUN apt-get update && \
    apt-get install -y openssl libssl1.1 procps && \
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
