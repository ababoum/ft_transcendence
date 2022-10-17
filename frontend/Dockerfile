###################
# BUILD FOR PRODUCTION
###################

FROM node:16.17.0-alpine As build

WORKDIR /app

# Copy src/ | package*.json | static/ | public/ without build folders
COPY . .

# Install app dependencies
RUN npm install
RUN npm run build


###################
# PRODUCTION
###################

FROM node:16.17.0-alpine As production

COPY --from=build /app/* ./
RUN  cp -r ./static ./public/static


EXPOSE 8080

CMD [ "npm", "run", "start" ]