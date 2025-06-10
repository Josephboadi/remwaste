FROM node:22-alpine3.22 AS builder

WORKDIR /app
COPY package.json ./
COPY tsconfig*.json ./
RUN npm install -g pnpm
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
# Bundle app source
RUN pnpm run build

FROM nginx:stable-alpine

WORKDIR /app
COPY --from=builder /app/build /app/html
COPY nginx.conf /app
RUN mkdir -p /app/run && apk add --no-cache bash && apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-c", "/app/nginx.conf"]
