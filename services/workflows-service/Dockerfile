FROM node:18.20.4-bullseye-slim as dev

RUN apt-get update
RUN apt-get install dumb-init

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run prisma:generate
RUN npm run build

CMD [ "dumb-init", "npm", "run", "dev", "--host" ]

FROM node:18.20.4-bullseye-slim as prod

WORKDIR /app

COPY --from=dev /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=dev /app/node_modules/ ./node_modules
COPY --from=dev /app/package.json ./package.json
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/prisma ./prisma
COPY --from=dev /app/scripts ./scripts

EXPOSE 3000

CMD [ "dumb-init", "npm", "run", "prod" ]
