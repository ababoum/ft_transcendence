FROM node:16.17.0-alpine

RUN mkdir frontend

COPY ./ frontend/

WORKDIR frontend

RUN npm install

CMD ["npm", "run", "dev"]
