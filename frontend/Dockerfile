FROM node:16.17.0-alpine

WORKDIR /usr/src/app

COPY rollup.config.js ./
COPY package*.json ./

RUN npm install
RUN npm install bootstrap
RUN npm install svelte-spa-router
RUN npm install url-slug timeago.js
RUN npm install rollup-plugin-copy -D

COPY ./src ./src
COPY ./public ./public

RUN npm run-script build

EXPOSE 9000

ENV HOST=0.0.0.0
ENV PORT=9000

CMD [ "npm", "start" ]