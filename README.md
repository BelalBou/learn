# Learn Platform Monorepo

## Structure
- apps/api : Backend NestJS + Prisma
- apps/web : Frontend React + Vite + Monaco Editor
- packages/ui : Composants UI partagés
- packages/types : Types partagés

## Démarrage
Créer un fichier `.env` à la racine ou dans `apps/api` avec:
```
DATABASE_URL=postgresql://one:skylineGTR48@51.210.243.145:5432/learn
JWT_SECRET=q+GkQgfcteIERYAuw0i0sZ8sgisnW/qlxOSq1rQfzPCIKmhsDIo3xLa+L3N6Z6kFbt/fp/csQiF1rtbjssS+bA==
PORT=3001
```

Installer les dépendances et lancer le dev:
```
npm install
npm run migrate
npm run seed
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Fonctionnalités prévues
- Auth JWT (login/register)
- Liste des cours + leçons
- Monaco Editor avec word wrap
- Sauvegarde progression utilisateur
- Responsive / Accessible

## Prochaines étapes
- Implémenter persistance du code utilisateur + exécution sandbox future
- Ajout markdown parser sécurisé (actuellement innerHTML)
- Système de thèmes (clair/sombre)
