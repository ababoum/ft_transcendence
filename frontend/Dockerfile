###################
# PRODUCTION
###################

FROM node:16.17.0-alpine As build

RUN apk update
RUN apk upgrade


WORKDIR /app

# Copy src/ | package*.json | static/ | public/ without build folders
COPY . .

# Install app dependencies
RUN npm install
RUN npm upgrade

RUN npm run build


EXPOSE 8080
ENV HOST=0.0.0.0

CMD [ "npm", "run", "start" ]