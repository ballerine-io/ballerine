FROM node:18.15 as dev

WORKDIR /app

COPY . .

RUN npm install -g pnpm; pnpm install; cd apps/backoffice-v2; pnpm run build


FROM nginx:stable-alpine as prod

COPY --from=dev /app/apps/backoffice-v2/dist /usr/share/nginx/html

COPY apps/backoffice-v2/example.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
