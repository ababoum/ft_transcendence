FROM node:16.17.0-alpine

WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./public ./public

RUN npm run-script build

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

CMD [ "npm", "start" ]