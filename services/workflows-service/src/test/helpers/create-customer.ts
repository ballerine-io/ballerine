import { PrismaClient } from '@prisma/client';

export async function createCustomer(
  client: PrismaClient,
  id: string,
  apiKey: string,
  logoImageUri: string,
  webhookSharedSecret: string,
) {
  return await client.customer.create({
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
      country: 'GB',
      language: 'en',
    },
  });
}
