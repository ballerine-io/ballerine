FROM node:18.17.1-bullseye-slim

WORKDIR /app

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN apt update; apt-get install -y xdg-utils

RUN mv /app/.env.example /app/.env

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm run build

ENV PATH="$PATH:/app/node_modules/.bin"

RUN chmod a+x /app/entrypoint.sh

EXPOSE 5137

RUN rm -rf /root/.cache /root/.npm /usr/local/share/doc /usr/share/doc /usr/share/man /var/lib/apt/lists/* /tmp/*

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
