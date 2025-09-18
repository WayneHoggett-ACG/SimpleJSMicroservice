# Multi-stage build: install production dependencies in a small builder stage,
# then copy only what is needed into the final runtime image.
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install production dependencies only for a smaller final image.
RUN npm ci --production

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
EXPOSE 5001
CMD ["node", "src/index.js"]
