FROM node:18.16-alpine3.17 as dev

WORKDIR /app

COPY . .
RUN npm install; npm run build

EXPOSE 3500

ENV PORT=3500
ENV NODE_ENV=development
ENV COMPOSE_PROJECT_NAME=ballerine-x

CMD [ "npm", "run", "dev", "--host"]

FROM node:18.16-alpine3.17 as prod

WORKDIR /app
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/node_modules ./node_modules
COPY --from=dev /app/package.json ./package.json
COPY .env.example /app/.env

ENV PATH="$PATH:./node_modules/.bin"
ENV PORT=3500
ENV NODE_ENV=development
ENV COMPOSE_PROJECT_NAME=ballerine-x

EXPOSE 3500

CMD [ "npm", "run", "start:prod" ]
