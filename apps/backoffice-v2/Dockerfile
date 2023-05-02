
FROM node:18.15 AS base

WORKDIR /app

COPY . .
RUN rm -rf /app/node_modules
RUN npm install 1> /dev/null
RUN npm run build 1> /dev/null

FROM node:18.15 AS prod

WORKDIR /app

COPY --from=base /app/node_modules/ ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/vite.config.ts ./vite.config.ts
COPY --from=base /app/dist ./dist
COPY --from=base /app/tsconfig* ./

ENV VITE_API_URL=http://localhost:3000/api/internal
ENV VITE_API_KEY=KVfOlhMgK1V3MXTSHOTACgrAUK9qeI
ENV VITE_AUTH_ENABLED=false
ENV VITE_MOCK_SERVER=false
ENV PATH="$PATH:./node_modules/.bin"
EXPOSE ${BACKOFFICE_PORT}

CMD [ "vite", "preview", "--port", "5173", "--host", "--no-open"]
