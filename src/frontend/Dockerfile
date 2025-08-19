FROM node:24 AS builder

WORKDIR /app

# copy across dependencies and install them.
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24

WORKDIR /app
# copy source code
COPY . .
ENV NODE_ENV development

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
