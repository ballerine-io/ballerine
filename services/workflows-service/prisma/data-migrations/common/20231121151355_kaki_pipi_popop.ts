import { PrismaClient } from '@prisma/client';
import { INestApplicationContext } from '@nestjs/common';
import { BusinessService } from '@/business/business.service';

export const migrate = async (client: PrismaClient, app: INestApplicationContext) => {
  await client.$transaction(async () => {
    await app.get(BusinessService).create(
      {
        data: {
          companyName: '23123',
        },
      },
      'project-1',
    );
  });
};
