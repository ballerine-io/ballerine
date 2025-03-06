import { PrismaTransactionClient } from '@/types';
import { TDefaultSchemaDocumentPage } from '@ballerine/common';
import { PrismaClient } from '@prisma/client';
import { createImage } from './create-image';

export const generateDocumentPageFactory =
  ({ client, projectId }: { client: PrismaTransactionClient | PrismaClient; projectId: string }) =>
  async ({
    uri,
    metadata,
  }: {
    uri: string;
    metadata?: Extract<
      TDefaultSchemaDocumentPage,
      {
        uri: string;
      }
    >['metadata'];
  }) => {
    return {
      provider: 'http',
      uri,
      type: 'jpg',
      ballerineFileId: await createImage({
        client,
        projectId,
      })(uri),
      metadata,
    } satisfies TDefaultSchemaDocumentPage;
  };
