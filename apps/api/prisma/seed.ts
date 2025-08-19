import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const password = await argon2.hash('password');
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', password, displayName: 'Demo User' },
  });

  // Reset existing learning content (courses, sections, lessons, progress)
  await prisma.progress.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.course.deleteMany({});

  // JavaScript Level 1 - Lesson 1
  const course = await prisma.course.create({
    data: {
      slug: 'javascript-niveau-1',
      title: 'JavaScript – Niveau 1',
      description: 'Bases absolues du JavaScript',
      sections: {
        create: [
          {
            title: 'Fondamentaux',
            position: 1,
            lessons: {
              create: [
                {
                  title: '1. Introduction à JavaScript',
                  position: 1,
                  content: `# Introduction à JavaScript\n\nJavaScript est un langage de **programmation** créé en 1995 par Brendan Eich en seulement 10 jours pour ajouter de l'interactivité aux pages web.\n\n### Objectif initial\nRendre les pages web dynamiques dans le **navigateur**.\n\n### Aujourd'hui\nJavaScript est partout :\n- Frontend (navigateur)\n- Backend (Node.js)\n- Mobile (React Native)\n- Desktop (Electron)\n- Scripts / CLI / IoT\n\n### Exécution\nUn code JS a besoin d'un *moteur* pour tourner :\n- V8 (Chrome, Node.js)\n- SpiderMonkey (Firefox)\n- JavaScriptCore (Safari)\n\nDans un navigateur, il peut manipuler le **DOM** (structure de la page). Dans Node.js, il peut accéder au système de fichiers, au réseau, etc.\n\n### Pourquoi si populaire ?\n1. Installé dans tous les navigateurs\n2. Écosystème énorme (npm)\n3. Permet de tout faire (fullstack)\n\n> Astuce: Ne cherche pas tout à comprendre d'un coup. Concentre-toi sur la pratique pas à pas.\n\n---\n\n## Démonstration (afficher un message)\nNous allons simplement afficher un message dans la console.\n`,
                  exampleCode: `// Affiche un message dans la console du navigateur ou de Node.js\nconsole.log('Bienvenue dans JavaScript !');\n\n// On peut afficher des nombres\nconsole.log(2025);\n\n// On peut aussi combiner du texte et des variables\nconst nom = 'Alex';\nconsole.log('Bonjour', nom);`,
                  exerciseStarter: `// Exercice :\n// 1. Déclare une variable 'ville' avec le nom de ta ville.\n// 2. Déclare une variable 'annee' avec l'année en cours.\n// 3. Affiche: "Je suis à <ville> en <annee>" dans la console.\n// 4. Ajoute ensuite un console.log qui affiche la longueur du nom de la ville.\n\n// Écris ton code ci-dessous :\n\n`,
                  solutionCode: `const ville = 'Paris';\nconst annee = 2025;\nconsole.log('Je suis à', ville, 'en', annee);\nconsole.log('Longueur du nom de la ville :', ville.length);`,
                  language: 'javascript',
                },
              ],
            },
          },
        ],
      },
    },
    include: { sections: { include: { lessons: true } } },
  });
  console.log({ user, course });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
