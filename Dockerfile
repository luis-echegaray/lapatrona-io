# Build stage - compile TypeScript and bundle with Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (outputs to /app/dist)
# Note: We DON'T set VITE_* env vars here - they'll be injected at runtime
RUN npm run build

# Runtime stage - serve with nginx
FROM nginx:alpine

# Install envsubst for runtime config generation
RUN apk add --no-cache bash

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy entrypoint script for runtime env var injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use custom entrypoint that generates config.js from env vars
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
