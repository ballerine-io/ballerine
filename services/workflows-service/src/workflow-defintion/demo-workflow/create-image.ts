import { PrismaClient } from '@prisma/client';

import { PrismaTransactionClient } from '@/types';

export const createImage =
  ({ client, projectId }: { client: PrismaTransactionClient | PrismaClient; projectId: string }) =>
  async (uri: string) => {
    const file = await client.file.create({
      data: {
        userId: '',
        fileNameOnDisk: uri,
        uri,
        projectId,
      },
    });

    return file.id;
  };
