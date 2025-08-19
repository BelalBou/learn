import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  upsert(userId: string, lessonId: string, status: string, lastCode?: string) {
    return this.prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { status: status as any, lastCode },
      create: { userId, lessonId, status: status as any, lastCode },
    });
  }

  listForUser(userId: string) {
    return this.prisma.progress.findMany({ where: { userId } });
  }
}
