FROM node:18.17.1-bullseye-slim as dev

RUN apt-get update && apt-get install -y dumb-init \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG RELEASE
ENV RELEASE=${RELEASE:-unknown}
ARG SHORT_SHA
ENV SHORT_SHA=${SHORT_SHA}

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run prisma:generate && npm run build

CMD [ "dumb-init", "npm", "run", "dev", "--host" ]

FROM node:18.17.1-bullseye-slim as prod

ARG RELEASE
ENV RELEASE=${RELEASE:-unknown}
ARG SHORT_SHA
ENV SHORT_SHA=${SHORT_SHA}

WORKDIR /app

COPY --from=dev /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=dev /app/node_modules/ ./node_modules
COPY --from=dev /app/package.json ./package.json
COPY --from=dev /app/dist ./dist
COPY --from=dev /app/prisma ./prisma
COPY --from=dev /app/scripts ./scripts
COPY --from=dev /app/src ./src
COPY --from=dev /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=dev /app/tsconfig.json ./tsconfig.json

# Create a non-root user and group and Change ownership of the app directory to the non-root user
RUN groupadd -r app && useradd -r -g app -s /bin/bash app && chown -R app:app /app

# Switch to the non-root user
USER app

EXPOSE 3000

CMD [ "dumb-init", "npm", "run", "prod" ]

