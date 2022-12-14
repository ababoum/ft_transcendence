###################
# BUILD FOR PRODUCTION
###################

FROM node:16.17.0-alpine As build

RUN apk update
RUN apk upgrade

WORKDIR /usr/src/app

COPY --chown=node:node package*.json 	./
COPY --chown=node:node prisma/ 			./prisma/
COPY --chown=node:node seed_assets/ 	./seed_assets/

# Install app dependencies
RUN npm install
RUN npm upgrade

# Copy src/ files and all nestjs files
COPY . .

RUN npm run build

USER node

###################
# PRODUCTION
###################

FROM node:16.17.0-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules 	./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma 		./prisma
COPY --chown=node:node --from=build /usr/src/app/seed_assets 	./seed_assets
COPY --chown=node:node --from=build /usr/src/app/package*.json 	./
COPY --chown=node:node --from=build /usr/src/app/dist 			./dist

EXPOSE 3000
CMD [  "npm", "run", "start:migrate:init" ]