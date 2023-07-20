FROM node:18.15 as dev

WORKDIR /app

COPY . .

RUN npm install -g pnpm; pnpm install; cd services/websocket-service; pnpm run build

FROM node:18.16-alpine3.17 as prod

WORKDIR /app

RUN npm install -g pnpm; mkdir -p /app/services/websocket-service;

COPY services/websocket-service/.env.example ./services/websocket-service/.env

COPY --from=dev /app/node_modules ./node_modules
COPY --from=dev /app/services/websocket-service/dist ./services/websocket-service/dist
COPY --from=dev /app/services/websocket-service/node_modules ./services/websocket-service/node_modules
COPY --from=dev /app/services/websocket-service/package.json ./services/websocket-service/package.json

ENV PATH="$PATH:/app/services/websocket-service/node_modules/.bin"

ENV PORT=3500
ENV NODE_ENV=development
ENV COMPOSE_PROJECT_NAME=ballerine-x

EXPOSE 3500

WORKDIR /app/services/websocket-service

CMD ["pnpm", "run", "start:prod"]
