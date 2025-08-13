# Use official Node.js image to build the app
FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./
COPY . .

RUN yarn install --frozen-lockfile || npm ci
RUN yarn build || npm run build

# Use a lightweight web server to serve the built files
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]