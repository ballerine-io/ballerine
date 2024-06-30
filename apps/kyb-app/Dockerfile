FROM node:18.17.1-bullseye-slim

WORKDIR /app

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN apt update; apt-get install -y xdg-utils

RUN npm run build

ENV PATH="$PATH:./node_modules/.bin"

EXPOSE 5201

RUN chmod a+x /app/entrypoint.sh

RUN rm -rf /root/.cache /root/.npm /usr/local/share/doc /usr/share/doc /usr/share/man /var/lib/apt/lists/* /tmp/*

ENTRYPOINT [ "/app/entrypoint.sh" ]
