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

  const course = await prisma.course.create({
    data: {
      slug: 'intro-typescript',
      title: 'Introduction à TypeScript',
      description: 'Les bases modernes de TypeScript',
      sections: {
        create: [
          {
            title: 'Bases',
            position: 1,
            lessons: {
              create: [
                {
                  title: 'Hello TypeScript',
                  position: 1,
                  content: '# Hello TS\nCeci est votre premier cours.',
                  exampleCode: 'const msg: string = "Hello";\nconsole.log(msg);',
                  exerciseStarter: 'function sum(a: number, b: number) {\n  // TODO: retourner la somme\n}\n',
                  solutionCode: 'function sum(a:number,b:number){return a+b}',
                  language: 'typescript',
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
