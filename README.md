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
- Pouvoir aller sur le profil de quelqu'un en cliquant dessus
- Pouvoir inviter quelqu'un via le chat
- Private messages
	- Chatroom a 2 participants
	- Impossible a Join ou Leave
	- Pas d'owner et admin
	- Pas de mode

TO-DO M'hamed:

- Créer la liste des matchs passés pour un joueur
- Modifier le endpoint/strategy login simple pour vérifier si le 2FA est activé et renvoyer une réponse correspondante (http code 202)
- Ajouter page de profil pour les autres users


BONUS:
- Generer une <datalist> de nickname pour les suggestions dans les <input type="text">

