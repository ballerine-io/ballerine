FROM node:18.17.1-bullseye-slim

WORKDIR /app

COPY ./package.json .

RUN npm install --legacy-peer-deps

COPY . .

RUN mv /app/.env.example /app/.env

ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm run build

ENV PATH="$PATH:/app/node_modules/.bin"

EXPOSE 5137

# Always build the application during container startup
RUN npm install -g serve

ENTRYPOINT [ "sh" ]

# Command to build and serve the application
CMD ["-c", "npm run build && serve -s dist -l 5137"]