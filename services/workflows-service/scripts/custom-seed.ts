import { PrismaClient } from '@prisma/client';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { CustomerService } from '@/customer/customer.service';
import { hashKey } from '../src/customer/api-key/utils';
import {
  kycOnboardingSierraLeoneDefinition,
  kybOnboardingSierraLeoneFormalDefinition,
  kybOnboardingSierraLeoneInformalDefinition,
  loanKycKybSierraLeoneDefinition,
} from './workflows/sl';

/**
 * Per-entity idempotent seed for Sierra Leone data.
 *
 * This is called by the main seed.ts script (`npm run seed`).
 * It is NOT run on Cloud Run container startup (production runs only migrations).
 *
 * Design: Each entity is upserted independently, so:
 *  - Re-running after partial failure completes the missing entities
 *  - Adding new entities later just means adding a new upsert block
 *  - Never fails on "already exists" conflicts
 */
export async function customSeed() {
  const client = new PrismaClient();
  const email = 'admin@admin.com';

  // Ensure default admin user exists
  await client.user.update({
    where: { email: email },
    data: { email },
  });

  // Seed Sierra Leone customers, projects, and workflow definitions
  console.info('=== Seeding Sierra Leone ===');

  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });

  try {
    // ── 1. Customers ──
    // Using Prisma directly for upsert (CustomerService doesn't support it)
    console.info('  Upserting SL tenant customers...');

    const customerSpecs = [
      {
        id: 'customer-mikashboks-sl',
        name: 'mikashboks-sl',
        displayName: 'MiKashBoks Sierra Leone',
        apiKeyPlain: 'mk-sl-api-key-default',
        webhookSharedSecret: 'mk-sl-webhook-secret-default',
        config: {},
      },
      {
        id: 'customer-loancube',
        name: 'loancube',
        displayName: 'LoanCube',
        apiKeyPlain: 'lc-sl-api-key-prod',
        webhookSharedSecret: 'lc-sl-webhook-secret-prod',
        config: { disableBusinessSyncToUnifiedApi: true },
      },
      {
        id: 'customer-namk-mobile',
        name: 'namk-mobile',
        displayName: 'MiKashBoks Mobile',
        apiKeyPlain: 'mk-mobile-api-key-prod',
        webhookSharedSecret: 'mk-mobile-webhook-secret-prod',
        config: {},
      },
      {
        id: 'customer-namk-ussd',
        name: 'namk-ussd',
        displayName: 'MiKashBoks USSD/WhatsApp',
        apiKeyPlain: 'mk-ussd-api-key-prod',
        webhookSharedSecret: 'mk-ussd-webhook-secret-prod',
        config: {},
      },
    ] as const;

    for (const spec of customerSpecs) {
      await client.customer.upsert({
        where: { id: spec.id },
        update: {
          displayName: spec.displayName,
          authenticationConfiguration: { webhookSharedSecret: spec.webhookSharedSecret },
          config: spec.config,
        },
        create: {
          id: spec.id,
          name: spec.name,
          displayName: spec.displayName,
          apiKeys: { create: { hashedKey: await hashKey(spec.apiKeyPlain) } },
          authenticationConfiguration: { webhookSharedSecret: spec.webhookSharedSecret },
          logoImageUri: '',
          faviconImageUri: '',
          country: 'SL',
          language: 'en',
          config: spec.config,
        },
      });
      console.info(`    ✓ ${spec.id}`);
    }

    // ── 2. Projects ──
    console.info('  Upserting SL projects...');

    const projectSpecs = [
      { id: 'project-sl-default', name: 'Sierra Leone Default', customerId: 'customer-mikashboks-sl' },
      { id: 'project-loancube-sl', name: 'LoanCube Sierra Leone', customerId: 'customer-loancube' },
      { id: 'project-namk-mobile-sl', name: 'Mobile App Sierra Leone', customerId: 'customer-namk-mobile' },
      { id: 'project-namk-ussd-sl', name: 'USSD/WhatsApp Sierra Leone', customerId: 'customer-namk-ussd' },
    ] as const;

    for (const spec of projectSpecs) {
      await client.project.upsert({
        where: { id: spec.id },
        update: { name: spec.name },
        create: { id: spec.id, name: spec.name, customerId: spec.customerId },
      });
      console.info(`    ✓ ${spec.id}`);
    }

    // ── 3. Workflow Definitions ──
    // Each uses a known ID — upsert by that ID
    console.info('  Upserting SL workflow definitions...');

    const workflowDefs = [
      { def: kycOnboardingSierraLeoneDefinition, label: 'kyc_onboarding_sierra_leone' },
      { def: kybOnboardingSierraLeoneFormalDefinition, label: 'kyb_onboarding_sierra_leone_formal' },
      { def: kybOnboardingSierraLeoneInformalDefinition, label: 'kyb_onboarding_sierra_leone_informal' },
      { def: loanKycKybSierraLeoneDefinition, label: 'loan_kyc_kyb_sierra_leone' },
    ] as const;

    for (const { def, label } of workflowDefs) {
      await client.workflowDefinition.upsert({
        where: { id: def.id },
        update: {
          definition: def.definition as any,
          config: def.config as any,
          contextSchema: def.contextSchema as any,
          extensions: def.extensions as any,
        },
        create: { ...(def as any) },
      });
      console.info(`    ✓ ${label}`);
    }

    // ── 4. Admin User ──
    console.info('  Upserting SL admin user...');

    await client.user.upsert({
      where: { id: 'user-sl-admin' },
      update: {
        firstName: 'Admin',
        lastName: 'MiKashBoks',
      },
      create: {
        id: 'user-sl-admin',
        email: 'admin@mikashboks.com',
        firstName: 'Admin',
        lastName: 'MiKashBoks',
        password: '', // Set via admin panel or auth provider
        roles: ['admin'],
        userToProjects: {
          create: [{ projectId: 'project-sl-default' }],
        },
      },
    });
    console.info('    ✓ user-sl-admin');

    console.info('=== Sierra Leone seed complete ===');
  } catch (error) {
    console.error('SL seed error (non-fatal, continuing):', error);
  } finally {
    await app.close();
    await client.$disconnect();
  }
}
