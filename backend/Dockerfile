###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Base image (same as Linux Dumps' version in Sept 2022)
FROM node:16.17.0-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node prisma/ ./

RUN npm ci

ENV DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

RUN npx prisma migrate dev --name init
RUN npx prisma generate

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################


FROM node:16.17.0-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:16.17.0-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]