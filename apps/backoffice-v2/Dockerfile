
FROM node:18.12.1 AS base

WORKDIR /app

COPY . .
RUN rm -rf /app/node_modules
RUN npm install 1> /dev/null
RUN npm run build 1> /dev/null

FROM node:18.12.1 AS prod

WORKDIR /app

COPY --from=base /app/node_modules/ ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/vite.config.ts ./vite.config.ts
COPY --from=base /app/dist ./dist
COPY --from=base /app/tsconfig* ./

ENV PATH="$PATH:./node_modules/.bin"
EXPOSE ${BACKOFFICE_PORT}

CMD [ "vite", "preview", "--port", "5173", "--host", "--no-open"]
