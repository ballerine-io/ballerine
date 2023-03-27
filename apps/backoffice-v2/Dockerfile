
FROM node:18.12.1 AS base

WORKDIR /app

COPY . .
RUN rm -rf /app/node_modules
RUN npm install
RUN npm run build

ENV PATH="$PATH:./node_modules/.bin"
EXPOSE 5173

CMD [ "vite", "preview", "--port", "5137", "--host"]


# FROM node:18.12.1 AS base

# WORKDIR /app

# COPY . .
# RUN rm -rf /app/node_modules
# RUN npm install
# RUN npm run build

# FROM node:18.12.1 AS prod

# WORKDIR /app

# COPY --from=base /app/node_modules/ ./node_modules
# COPY --from=base /app/package.json ./package.json
# COPY --from=base /app/vite.config.ts ./vite.config.ts
# COPY --from=base /app/dist ./dist
# COPY --from=base /app/tsconfig* ./

# ENV PATH="$PATH:./node_modules/.bin"
# EXPOSE 5173

# CMD [ "vite", "preview", "--port", "5137", "--host"]
