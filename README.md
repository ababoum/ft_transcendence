Pour un 1er lancement
- C/C config/backend.env => backend/.env
- DB_HOST='postgres' => DB_HOST='localhost'
- docker-compose up postgres -d
- Supprimer les dossiers de migration dans backend/prisma/migrations
- cd backend/
- npx prisma migrate dev
- npx prisma generate
- cd ..
- make

TESTS TO DO:
- Run tests on each browser (Chrome, Firefox)
- Monitor warnings and unhandled errors in the console

TO DO
- Voir pour input field plein d'espaces, interdire les espaces comme caracteres **OK**
- Tester 42auth + 2FA ➔ **Normalement OK, cas d'usage standard**

HOW TO LAUNCH ON THE CLOUD
- prepare backend.env (DATABASE_URL + correct API KEY)
- update domain.js with the right urls
- update backend Dockerfile to launch the right CMD (with or without db reset: init vs prod)]

LAST TESTS:
- 