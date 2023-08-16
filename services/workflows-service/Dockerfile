FROM node:18.12.1 as dev

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /app

COPY . .

RUN npm install; npm run prisma:generate ; npm run build;

CMD [ "dumb-init", "npm", "run", "dev", "--host" ]

FROM node:18.12.1 as prod

WORKDIR /app

COPY --from=dev /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=dev /app/node_modules/ ./node_modules
COPY --from=dev /app/package.json ./package.json
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/prisma ./prisma
COPY --from=dev /app/scripts ./scripts
COPY --from=dev /app/src ./src

EXPOSE 3000

CMD [ "dumb-init", "npm", "run", "prod" ]
