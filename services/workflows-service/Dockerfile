FROM node:18.16-alpine3.17 as dev

RUN apk add dumb-init

WORKDIR /app

COPY . .

RUN npm install; npm run prisma:generate ; npm run build;

CMD [ "dumb-init", "npm", "run", "dev", "--host" ]

FROM node:18.16-alpine3.17 as prod

WORKDIR /app

COPY --from=dev /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=dev /app/node_modules/ ./node_modules
COPY --from=dev /app/package.json ./package.json
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/prisma ./prisma
COPY --from=dev /app/scripts ./scripts

EXPOSE 3000

CMD [ "dumb-init", "npm", "run", "prod" ]
