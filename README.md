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
- Quand on recupere req.user, userId est undefined (voir requete createChatRoom dans Swagger)
- Les prisma.update renvoie la meme chose si update a eu un effet ou non.
- Ne pas utiliser le prisma filter qui interfere avec les FindUniqueOrThrow()