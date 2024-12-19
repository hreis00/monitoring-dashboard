# Build stage
FROM node:20-alpine3.20 as builder

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy nginx configurations
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built files and health check
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY public/health.html /usr/share/nginx/html/health.html

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
