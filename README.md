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
- Comment gerer les mute avec le chat en websocket ?
	- A chaque message recu, check si le sender est mute par le receiver ?
	- A chaque message envoye, check si le receiver a mute le sender ?
	- Conserver en variable local le login des muted users pour filtrer sans appels a la DB ?
- On utilise login pour identifier les Users dans le back, mais on veut en general afficher le nickname sur le front, il serait mieux d'utiliser le nickname partout, mais on ne recupere que le login via JWTAuth. Sinon on envoie le nickname dans les requetes et les messages Websocket ?