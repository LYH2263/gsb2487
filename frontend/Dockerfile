# Build stage
FROM node:20-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci
COPY . .
# Set build-time env
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine
# Add custom nginx config for SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
