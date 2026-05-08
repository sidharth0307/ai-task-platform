# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# Copy the built artifacts from the builder stage
COPY --from=builder /app ./

#Use non-root user
USER node

EXPOSE 5000
# Run the application
CMD ["node", "src/index.js"]