# Development Dockerfile for Backend

FROM node:18-slim

# Install procps for NestJS watch mode (provides 'ps' command)
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

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
