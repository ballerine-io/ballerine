import { generateHashedKey } from '@/customer/api-key/utils';
import { PrismaClient } from '@prisma/client';

export const createCustomer = async (
  client: PrismaClient,
  id: string,
  apiKey: string | undefined,
  logoImageUri: string,
  faviconImageUri: string,
  webhookSharedSecret: string,
) => {
  const { hashedKey } = await generateHashedKey({ key: apiKey });

  const apiKeys = apiKey
    ? {
        create: {
          hashedKey,
        },
      }
    : undefined;

  return await client.customer.create({
    data: {
      id: `customer-${id}`,
      name: `Customer ${id}`,
      displayName: `Customer ${id}`,
      authenticationConfiguration: {
        webhookSharedSecret,
      },
      apiKeys,
      logoImageUri: logoImageUri,
      faviconImageUri,
      country: 'GB',
      language: 'en',
    },
  });
};
