import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // Cast to any to access $on since type narrowing may differ with generated client versions
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
