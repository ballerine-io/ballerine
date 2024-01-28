import { PrismaClient } from '@prisma/client';

export const createCustomer = async (
  client: PrismaClient,
  id: string,
  apiKey: string,
  logoImageUri: string,
  faviconImageUri: string,
  webhookSharedSecret: string,
) =>
  await client.customer.create({
    data: {
      id: `customer-${id}`,
      name: `Customer ${id}`,
      displayName: `Customer ${id}`,
      authenticationConfiguration: {
        apiType: 'API_KEY',
        authValue: apiKey,
        validUntil: '',
        isValid: '',
        webhookSharedSecret,
      },
      logoImageUri: logoImageUri,
      faviconImageUri,
      country: 'GB',
      language: 'en',
    },
  });
