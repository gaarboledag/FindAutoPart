# Development Dockerfile for Backend

FROM node:18-alpine

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl1.1-compat

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
