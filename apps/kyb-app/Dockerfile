FROM node:18.17.1-bullseye-slim as dev

WORKDIR /app

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN mv /app/.env.example /app/.env

RUN npm run build

ENV PATH="$PATH:/app/node_modules/.bin"

EXPOSE 5201

CMD ["npm", "run", "dev", "--host"]

FROM nginx:stable-alpine as prod

WORKDIR /app

COPY --from=dev /app/dist /usr/share/nginx/html

COPY --from=dev /app/entrypoint.sh /app/entrypoint.sh

COPY example.nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod a+x /app/entrypoint.sh;

EXPOSE 80

ENTRYPOINT [ "/app/entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
