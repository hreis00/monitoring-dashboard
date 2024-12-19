# Build stage
FROM node:20-alpine3.20 as builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies and update package-lock.json
RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine3.20

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/index.js"]
