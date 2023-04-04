# FT_TRANSCENDENCE: A FULL-STACK WEB PROJECT

FT_TRANSCENDENCE is a onepage full-stack website where you can play pong with online players. Features include JWT / 2FA authentication, a chat, private messages, friends list, profiles, a match-making system, a spectating system, and customizations to the pong game such as different backgrounds and colors.


* Backend:
    * NestJS
    * Prisma for the Object Relational Mapping (ORM)
* Frontend:
    * SvelteJS
* Database:
    * PostgreSQL





## HOW TO LAUNCH THE PROJECT

For a 1st launch:
- Copy/Paste config/backend.env => backend/.env
- DB_HOST='postgres' => DB_HOST='localhost'
- docker-compose up postgres -d
- Delete migration folders in backend/prisma/migrations
- cd backend/
- npx prisma migrate dev
- npx prisma generate
- cd ..
- make



## HOW TO LAUNCH ON THE CLOUD
- prepare backend.env (DATABASE_URL + correct API KEY for 42 Auth)
- update domain.js with the right urls
- update backend Dockerfile to launch the right CMD (with or without db reset: init vs prod)]
