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


ISSUES:
- Les prisma.update renvoie la meme chose si update a eu un effet ou non.
- UTILISER EXCEPTIONFILTER pour les FindUniqueorThrow
- Pour socket et Gateway, il faut verifier le token dans handleConnection et disconnect en cas d'erreur, car UseGuards() ne permet pas d'empecher la connection

TO-DO Eliot:
- Gerer l'affichage si le socket n'est pas connecte
- Nettoyer l'interface Swagger

TO-DO M'hamed:

- Se débarrasser des window.location.reload() dans le frontend
- Implement data validation for all user inputs and forms
- Add a stat component in the profile (rating, wins, and losses)

BONUS:
- Generer une <datalist> de nickname pour les suggestions dans les <input type="text">


TESTS TO DO:

- Run tests on each browser (Chrome, Firefox)
- Monitor warnings and unhandled errors in the console

