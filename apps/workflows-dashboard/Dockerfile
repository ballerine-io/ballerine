FROM node:18.15 as dev

WORKDIR /app

COPY . .

RUN npm install -g pnpm; pnpm install; cd /app/apps/workflows-dashboard; pnpm run build


FROM nginx:stable-alpine as prod

COPY --from=dev /app/apps/workflows-dashboard/dist /usr/share/nginx/html

COPY --from=dev /app/apps/workflows-dashboard/example.nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
