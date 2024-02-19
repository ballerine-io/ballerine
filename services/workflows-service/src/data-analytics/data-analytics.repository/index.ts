import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataAnalyticsRepository {
  constructor(protected readonly prisma: PrismaService) {}
}
