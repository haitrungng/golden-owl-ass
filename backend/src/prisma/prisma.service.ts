import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { PrismaClient, Prisma } from '../../generated/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    await this.$connect();

    this.$on('query' as never, (e: Prisma.QueryEvent) => {
      this.logger.log(`Query: ${e.query}`);
      this.logger.log(`Params: ${e.params}`);
      this.logger.log(`Thời gian: ${e.duration}ms`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
