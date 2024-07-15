import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RiskRuleSetRepository {
  constructor(private readonly prismeService: PrismaService) {}
}
