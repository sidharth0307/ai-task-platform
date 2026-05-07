# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
# Assignment Requirement: Using an unprivileged (non-root) Nginx image
FROM nginxinc/nginx-unprivileged:alpine
# Copy the Vite build output (dist) to the Nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]