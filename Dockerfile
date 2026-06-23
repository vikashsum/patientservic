# ---------- Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ---------- Runtime Stage ----------
FROM node:18-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Create writable logs directory
RUN mkdir -p /app/logs && \
    chown -R nodejs:nodejs /app

EXPOSE 3001

USER nodejs

CMD ["npm","start"]