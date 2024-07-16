import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RuleRepository {
  constructor(protected readonly prisma: PrismaService) {}
}
