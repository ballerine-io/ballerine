import { generateHashedKey } from '@/customer/api-key/utils';
import { PrismaClient } from '@prisma/client';

export const createCustomerOnly = async (
  client: PrismaClient,
  id: string,
  logoImageUri: string,
  faviconImageUri: string,
  webhookSharedSecret: string,
) => {
  return createCustomer(client, id, undefined, logoImageUri, faviconImageUri, webhookSharedSecret);
};

export const createCustomer = async (
  client: PrismaClient,
  id: string,
  apiKey: string | undefined,
  logoImageUri: string,
  faviconImageUri: string,
  webhookSharedSecret: string,
) => {
  const { hashedKey, type } = await generateHashedKey({ key: apiKey });

  const apiKeys = apiKey
    ? {
        create: {
          type,
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
