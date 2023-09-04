FROM node:18.17.1-bullseye-slim as dev

WORKDIR /app

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN mv /app/.env.example /app/.env
RUN npm run build

ENV PATH="$PATH:/app/node_modules/.bin"

EXPOSE 5137

CMD ["npm", "run", "dev", "--host"]

FROM nginx:stable-alpine as prod

COPY --from=dev /app/dist /usr/share/nginx/html

COPY example.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
