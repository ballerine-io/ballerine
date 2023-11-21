import { PrismaClient } from '@prisma/client';
import { INestApplicationContext } from '@nestjs/common';
import { BusinessRepository } from '@/business/business.repository';

export const migrate = async (client: PrismaClient, app: INestApplicationContext) => {
  await client.$transaction(async () => {
    await app.get(BusinessRepository).create(
      {
        data: {
          id: 'test',
          companyName: 'test',
        },
      },
      'project-1',
    );
  });
};
