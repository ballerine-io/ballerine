FROM node:18.12.1 AS base

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /app

COPY package.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/

RUN npm run prisma:generate

COPY . .

RUN npm run build

FROM node:18.12.1 AS prod

WORKDIR /app

COPY --from=base /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=base /app/node_modules/ ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/scripts ./scripts
COPY --from=base /app/src ./src
COPY --from=base /app/tsconfig* ./

EXPOSE 3007

CMD [ "dumb-init", "npm", "run", "prod" ]
