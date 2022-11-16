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
- Ajouter kick
- Rendre le owner invulnerable **OK**
- Mettre le password de Adam/Eve dans .env

TO-DO M'hamed:
- Seed avatars pour les users Seed ➔ **OK**
- Add a stat component in the user profile (rating, wins, and losses) ➔ **OK**
- Implement data validation for all user inputs and forms


TO-DO Anton:
- Texte pour les customization du game
- Reduire plus le game en taille minimale, responsiveness
- Optional customization
	- Ball's speed
	- Map/Images background

BONUS:
- Generer une <datalist> de nickname pour les suggestions dans les <input type="text">


TESTS TO DO:
- Run tests on each browser (Chrome, Firefox)
- Monitor warnings and unhandled errors in the console

TO DO
- Update npm/prisma dans Dockerfile ➔ **Finalement non, il n'y a pas de version node avec la dernière version de npm**
- Voir pour input field plein d'espaces, interdire les espaces comme caracteres 
- Apres changement d'avatar, cancel fait un probleme
- Tester 42auth + 2FA ➔ **Normalement OK, cas d'usage standard**
- Voir Modal Profile popup, l'avatar ne change pas quand on regarde des profils differents ➔ **OK**
- Ajouter Match History dans Profile Modal ➔ **OK**
- Refaire une passe sur les services prisma et les proteger avec Try catch si besoin






TO KNOW ABOUT THE PROJECT
- The Http Status 210 means that the avatar is not found and should be replaced with a default one