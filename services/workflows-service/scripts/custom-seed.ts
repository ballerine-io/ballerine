import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { CustomerService } from '@/customer/customer.service';
import { hashKey } from '../src/customer/api-key/utils';
import {
  generateKycOnboardingSierraLeone,
  generateKybOnboardingSierraLeoneFormal,
  generateKybOnboardingSierraLeoneInformal,
  generateLoanKycKybSierraLeone,
} from './workflows/sl';

export async function customSeed() {
  const client = new PrismaClient();
  const email = 'admin@admin.com';

  // Ensure default admin user exists
  await client.user.update({
    where: { email: email },
    data: {
      email,
    },
  });

  // Seed Sierra Leone customers, projects, and workflow definitions
  console.info('=== Seeding Sierra Leone ===');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const customerService = app.get(CustomerService);

  try {
    // Check if SL customer already exists to make seed idempotent
    const existingCustomer = await client.customer.findUnique({
      where: { id: 'customer-mikashboks-sl' },
    });

    if (existingCustomer) {
      console.info('  SL data already seeded — skipping');
    } else {
      // 1. Create tenant customers
      console.info('  Creating SL tenant customers...');

      const customerDefault = await customerService.create({
        data: {
          id: 'customer-mikashboks-sl',
          name: 'mikashboks-sl',
          displayName: 'MiKashBoks Sierra Leone',
          apiKeys: { create: { hashedKey: await hashKey('mk-sl-api-key-default') } },
          authenticationConfiguration: { webhookSharedSecret: 'mk-sl-webhook-secret-default' },
          logoImageUri: '',
          faviconImageUri: '',
          country: 'SL',
          language: 'en',
          config: {},
        },
      });

      const customerLoanCube = await customerService.create({
        data: {
          id: 'customer-loancube',
          name: 'loancube',
          displayName: 'LoanCube',
          apiKeys: { create: { hashedKey: await hashKey('lc-sl-api-key-prod') } },
          authenticationConfiguration: { webhookSharedSecret: 'lc-sl-webhook-secret-prod' },
          logoImageUri: '',
          faviconImageUri: '',
          country: 'SL',
          language: 'en',
          config: { disableBusinessSyncToUnifiedApi: true },
        },
      });

      const customerMobile = await customerService.create({
        data: {
          id: 'customer-namk-mobile',
          name: 'namk-mobile',
          displayName: 'MiKashBoks Mobile',
          apiKeys: { create: { hashedKey: await hashKey('mk-mobile-api-key-prod') } },
          authenticationConfiguration: { webhookSharedSecret: 'mk-mobile-webhook-secret-prod' },
          logoImageUri: '',
          faviconImageUri: '',
          country: 'SL',
          language: 'en',
          config: {},
        },
      });

      const customerUssd = await customerService.create({
        data: {
          id: 'customer-namk-ussd',
          name: 'namk-ussd',
          displayName: 'MiKashBoks USSD/WhatsApp',
          apiKeys: { create: { hashedKey: await hashKey('mk-ussd-api-key-prod') } },
          authenticationConfiguration: { webhookSharedSecret: 'mk-ussd-webhook-secret-prod' },
          logoImageUri: '',
          faviconImageUri: '',
          country: 'SL',
          language: 'en',
          config: {},
        },
      });

      // 2. Create projects
      console.info('  Creating SL projects...');

      const projectDefault = await client.project.create({
        data: { id: 'project-sl-default', name: 'Sierra Leone Default', customerId: customerDefault.id },
      });
      await client.project.create({
        data: { id: 'project-loancube-sl', name: 'LoanCube Sierra Leone', customerId: customerLoanCube.id },
      });
      await client.project.create({
        data: { id: 'project-namk-mobile-sl', name: 'Mobile App Sierra Leone', customerId: customerMobile.id },
      });
      await client.project.create({
        data: { id: 'project-namk-ussd-sl', name: 'USSD/WhatsApp Sierra Leone', customerId: customerUssd.id },
      });

      // 3. Seed workflow definitions
      console.info('  Seeding SL workflow definitions...');
      await generateKycOnboardingSierraLeone(client);
      await generateKybOnboardingSierraLeoneFormal(client);
      await generateKybOnboardingSierraLeoneInformal(client);
      await generateLoanKycKybSierraLeone(client);

      // 4. Create SL admin user
      console.info('  Creating SL admin user...');
      await client.user.create({
        data: {
          id: 'user-sl-admin',
          email: 'admin@mikashboks.com',
          firstName: 'Admin',
          lastName: 'MiKashBoks',
          password: '', // Set via admin panel or auth provider
          roles: ['admin'],
          userToProjects: {
            create: [{ projectId: projectDefault.id }],
          },
        },
      });

      console.info('=== Sierra Leone seed complete ===');
    }
  } catch (error) {
    console.error('SL seed error (non-fatal, continuing):', error);
  } finally {
    await app.close();
  }

  client.$disconnect();
}
