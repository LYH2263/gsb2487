# Build stage
FROM node:20-bookworm-slim AS builder
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci
COPY . .
RUN npx prisma generate

# Final stage
FROM node:20-bookworm-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app /app
ENV NODE_ENV=production
ENV PORT=8000

RUN chmod +x ./start.sh

EXPOSE 8000
CMD ["./start.sh"]
