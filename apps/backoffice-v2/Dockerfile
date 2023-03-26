FROM node:18.12.1

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

EXPOSE 5173
CMD [ "npm", "start"]
