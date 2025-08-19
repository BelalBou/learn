import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.course.findMany({
      include: { sections: { include: { lessons: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  findLesson(lessonId: string) {
    return this.prisma.lesson.findUnique({ where: { id: lessonId } });
  }
}
