FROM node:18.15 as dev

WORKDIR /app

COPY . .

RUN npm install -g pnpm; pnpm install; cd examples/headless-example; pnpm run build


FROM nginx:stable-alpine as prod

COPY --from=dev /app/examples/headless-example/dist /usr/share/nginx/html

COPY examples/headless-example/example.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
