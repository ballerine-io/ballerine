FROM node:18.15 as dev

WORKDIR /app

COPY . .

RUN npm install -g pnpm; pnpm install; cd services/workflows-service; pnpm run prisma:generate; pnpm run build

FROM node:18.16-alpine3.17 as prod

WORKDIR /app

RUN npm install -g pnpm; mkdir -p /app/services/workflows-service;

COPY services/workflows-service/.env.example ./services/workflows-service/.env

COPY --from=dev /app/node_modules ./node_modules
COPY --from=dev /app/services/workflows-service/dist ./services/workflows-service/dist
COPY --from=dev /app/services/workflows-service/node_modules ./services/workflows-service/node_modules
COPY --from=dev /app/sdks ./sdks
COPY --from=dev /app/packages ./packages
COPY --from=dev /app/services/workflows-service/prisma ./services/workflows-service/prisma
COPY --from=dev /app/services/workflows-service/scripts ./services/workflows-service/scripts
COPY --from=dev /app/services/workflows-service/package.json ./services/workflows-service/package.json

ENV PATH="$PATH:/app/services/workflows-service/node_modules/.bin"

EXPOSE 3000

WORKDIR /app/services/workflows-service

CMD ["pnpm", "run", "prod"]
