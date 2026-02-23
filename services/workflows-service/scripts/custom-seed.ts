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
  const isProduction =
    process.env.NODE_ENV === 'production' || process.env.ENVIRONMENT_NAME === 'production';

  const getSeedSecret = (envName: string, devDefault: string) => {
    const value = process.env[envName];
    if (value) return value;
    if (isProduction) {
      throw new Error(`Missing ${envName} (required for production seeding)`);
    }
    console.warn(`  ⚠ ${envName} not set — using dev default. Set this in production!`);
    return devDefault;
  };

  const getSeedSecretAny = (envNames: string[], devDefault: string) => {
    const found = envNames
      .map(name => ({ name, value: process.env[name] }))
      .filter((x): x is { name: string; value: string } => !!x.value);

    if (found.length > 1) {
      const uniqueValues = [...new Set(found.map(x => x.value))];
      if (uniqueValues.length > 1) {
        const msg = `${envNames.join(' and ')} are both set but differ. They must be identical.`;
        if (isProduction) {
          throw new Error(msg);
        }
        console.warn(`  ⚠ ${msg} Using ${found[0]!.name}.`);
      }
    }

    if (found[0]) return found[0].value;

    if (isProduction) {
      throw new Error(`Missing ${envNames.join(' or ')} (required for production seeding)`);
    }

    console.warn(`  ⚠ ${envNames.join('/')} not set — using dev default. Set this in production!`);

    return devDefault;
  };

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

    // Keep backwards compatibility with older env naming.
    // The value must match what LoanCube verifies under BALLERINE_WEBHOOK_SECRET.
    const webhookSecret = getSeedSecretAny(
      ['LOANCUBE_WEBHOOK_SECRET', 'BALLERINE_WEBHOOK_SECRET'],
      'mk-sl-webhook-secret-default',
    );

    const customerSpecs = [
      {
        id: 'customer-mikashbokssl',
        name: 'mikashbokssl',
        displayName: 'MiKashBoks Sierra Leone',
        apiKeyPlain: getSeedSecret('MK_SL_API_KEY', 'mk-sl-api-key-default'),
        webhookSharedSecret: webhookSecret,
        config: {},
      },
      {
        id: 'customer-actbsl',
        name: 'actbsl',
        displayName: 'ACTB Sierra Leone',
        apiKeyPlain: getSeedSecret('ACTB_SL_API_KEY', 'actb-sl-api-key-default'),
        webhookSharedSecret: webhookSecret,
        config: {},
      },
      {
        id: 'customer-demosl',
        name: 'demosl',
        displayName: 'Demo Sierra Leone',
        apiKeyPlain: getSeedSecret('DEMO_SL_API_KEY', 'demo-sl-api-key-default'),
        webhookSharedSecret: webhookSecret,
        config: {},
      },
    ];

    for (const spec of customerSpecs) {
      await client.customer.upsert({
        where: { id: spec.id },
        update: {
          displayName: spec.displayName,
          authenticationConfiguration: { webhookSharedSecret: spec.webhookSharedSecret },
          logoImageUri: '/images/mikashboks-logo-horizontal.png',
          faviconImageUri: '/favicon.ico',
          config: spec.config,
        },
        create: {
          id: spec.id,
          name: spec.name,
          displayName: spec.displayName,
          apiKeys: { create: { hashedKey: await hashKey(spec.apiKeyPlain) } },
          authenticationConfiguration: { webhookSharedSecret: spec.webhookSharedSecret },
          logoImageUri: '/images/mikashboks-logo-horizontal.png',
          faviconImageUri: '/favicon.ico',
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
      { id: 'project-mikashbokssl-main', name: 'Main', customerId: 'customer-mikashbokssl' },
      { id: 'project-actbsl-main', name: 'Main', customerId: 'customer-actbsl' },
      { id: 'project-demosl-main', name: 'Main', customerId: 'customer-demosl' },
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
      {
        def: kybOnboardingSierraLeoneFormalDefinition,
        label: 'kyb_onboarding_sierra_leone_formal',
      },
      {
        def: kybOnboardingSierraLeoneInformalDefinition,
        label: 'kyb_onboarding_sierra_leone_informal',
      },
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

    // ── 4. Collection Flow UI Definitions ──
    console.info('  Upserting SL collection flow UI definitions...');

    const allProjectIds = projectSpecs.map(p => p.id);

    const NEXT_PLUGIN = {
      name: 'event',
      params: { eventName: 'NEXT' },
      runOn: [{ type: 'onSubmit' }],
    };

    const buildLinearCollectionFlowDefinition = (id: string, steps: string[]) => {
      const states: Record<string, unknown> = {};

      steps.forEach((step, index) => {
        const on: Record<string, string> = {};

        if (index < steps.length - 1) {
          on['NEXT'] = steps[index + 1]!;
        } else {
          on['NEXT'] = 'done';
        }

        if (index > 0) {
          on['PREVIOUS'] = steps[index - 1]!;
        }

        states[step] = { on };
      });

      states['done'] = { on: { FAILED: 'failed', COMPLETED: 'completed' } };
      states['completed'] = { type: 'final' };
      states['failed'] = { type: 'final' };

      return {
        definitionType: 'statechart-json',
        definition: {
          id,
          predictableActionArguments: true,
          initial: steps[0]!,
          context: {},
          states,
        },
        extensions: { apiPlugins: [] },
      };
    };

    const upsertCollectionFlowUi = async ({
      uiDefinitionId,
      name,
      workflowDefinitionId,
      projectId,
      pages,
      steps,
    }: {
      uiDefinitionId: string;
      name: string;
      workflowDefinitionId: string;
      projectId: string;
      pages: unknown[];
      steps: string[];
    }) => {
      const definition = buildLinearCollectionFlowDefinition(`${uiDefinitionId}-definition`, steps);

      await client.uiDefinition.upsert({
        where: { id: uiDefinitionId },
        update: {
          name,
          uiContext: 'collection_flow',
          uiSchema: { elements: pages } as any,
          definition: definition as any,
          workflowDefinitionId,
          version: 2,
          projectId,
          crossEnvKey: workflowDefinitionId,
        } as any,
        create: {
          id: uiDefinitionId,
          name,
          uiContext: 'collection_flow',
          uiSchema: { elements: pages } as any,
          definition: definition as any,
          workflowDefinitionId,
          version: 2,
          projectId,
          crossEnvKey: workflowDefinitionId,
        } as any,
      });
    };

    // Create collection flow UIs and case filters for each project
    for (const projectId of allProjectIds) {
      console.info(`    Creating UIs and filters for ${projectId}...`);

      // KYC Collection Flow
      await upsertCollectionFlowUi({
        uiDefinitionId: `ui-sl-kyc-collection-${projectId}`,
        name: 'SL KYC Collection Flow',
        workflowDefinitionId: 'kyc_onboarding_sierra_leone',
        projectId,
        steps: ['personal_information', 'kyc_documents'],
        pages: [
          {
            type: 'page',
            number: 1,
            stateName: 'personal_information',
            name: 'Personal information',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyc-personal-information',
                element: 'column',
                children: [
                  {
                    id: 'sl-kyc-personal-information-title',
                    element: 'h1',
                    params: { text: 'Personal information' },
                  },
                  {
                    id: 'sl-kyc-first-name',
                    element: 'textfield',
                    valueDestination: 'entity.data.firstName',
                    params: { label: 'First name' },
                    validate: [{ type: 'required', message: 'First name is required' }],
                  },
                  {
                    id: 'sl-kyc-last-name',
                    element: 'textfield',
                    valueDestination: 'entity.data.lastName',
                    params: { label: 'Last name' },
                    validate: [{ type: 'required', message: 'Last name is required' }],
                  },
                  {
                    id: 'sl-kyc-national-id',
                    element: 'textfield',
                    valueDestination: 'entity.data.nationalId',
                    params: { label: 'National ID (optional)', placeholder: 'SL123456789' },
                  },
                  {
                    id: 'sl-kyc-dob',
                    element: 'datefield',
                    valueDestination: 'entity.data.dateOfBirth',
                    params: { label: 'Date of birth (optional)' },
                  },
                  {
                    id: 'sl-kyc-phone',
                    element: 'phonefield',
                    valueDestination: 'entity.data.phoneNumber',
                    params: { label: 'Phone number (optional)' },
                  },
                  {
                    id: 'sl-kyc-email',
                    element: 'textfield',
                    valueDestination: 'entity.data.email',
                    params: { label: 'Email (optional)' },
                  },
                  {
                    id: 'sl-kyc-gender',
                    element: 'selectfield',
                    valueDestination: 'entity.data.gender',
                    params: {
                      label: 'Gender (optional)',
                      options: [
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                      ],
                    },
                  },
                  {
                    id: 'sl-kyc-address-district',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.district',
                    params: { label: 'District (optional)' },
                  },
                  {
                    id: 'sl-kyc-address-city',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.city',
                    params: { label: 'City / Town (optional)' },
                  },
                  {
                    id: 'sl-kyc-personal-next-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyc-personal-next',
                        element: 'submitbutton',
                        params: { text: 'Continue' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [NEXT_PLUGIN],
          },
          {
            type: 'page',
            number: 2,
            stateName: 'kyc_documents',
            name: 'Documents',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyc-documents',
                element: 'column',
                children: [
                  { id: 'sl-kyc-documents-title', element: 'h1', params: { text: 'Documents' } },
                  {
                    id: 'sl-kyc-national-id-document',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'National ID (front)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyc-national-id',
                        category: 'proof_of_identity',
                        type: 'national_id',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                    validate: [
                      {
                        type: 'document',
                        considerRequired: true,
                        message: 'National ID is required',
                        value: { id: 'sl-kyc-national-id' },
                      },
                    ],
                  },
                  {
                    id: 'sl-kyc-selfie-document',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Selfie',
                      documentType: 'selfie',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyc-selfie',
                        category: 'proof_of_identity_ownership',
                        type: 'selfie',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                    validate: [
                      {
                        type: 'document',
                        considerRequired: true,
                        message: 'Selfie is required',
                        value: { id: 'sl-kyc-selfie' },
                      },
                    ],
                  },
                  {
                    id: 'sl-kyc-documents-finish-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyc-documents-finish',
                        element: 'submitbutton',
                        params: { text: 'Finish' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [],
          },
        ],
      });

      // KYB Formal Collection Flow
      await upsertCollectionFlowUi({
        uiDefinitionId: `ui-sl-kyb-formal-collection-${projectId}`,
        name: 'SL KYB Formal Collection Flow',
        workflowDefinitionId: 'kyb_onboarding_sierra_leone_formal',
        projectId,
        steps: ['business_information', 'business_address', 'business_documents'],
        pages: [
          {
            type: 'page',
            number: 1,
            stateName: 'business_information',
            name: 'Business information',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyb-formal-business-information',
                element: 'column',
                children: [
                  {
                    id: 'sl-kyb-formal-business-information-title',
                    element: 'h1',
                    params: { text: 'Business information' },
                  },
                  {
                    id: 'sl-kyb-formal-company-name',
                    element: 'textfield',
                    valueDestination: 'entity.data.companyName',
                    params: { label: 'Company name' },
                    validate: [{ type: 'required', message: 'Company name is required' }],
                  },
                  {
                    id: 'sl-kyb-formal-registration-number',
                    element: 'textfield',
                    valueDestination: 'entity.data.registrationNumber',
                    params: { label: 'Registration number (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-business-type',
                    element: 'textfield',
                    valueDestination: 'entity.data.businessType',
                    params: { label: 'Business type (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-phone',
                    element: 'phonefield',
                    valueDestination: 'entity.data.phoneNumber',
                    params: { label: 'Phone number (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-email',
                    element: 'textfield',
                    valueDestination: 'entity.data.email',
                    params: { label: 'Email (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-business-information-next-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyb-formal-business-information-next',
                        element: 'submitbutton',
                        params: { text: 'Continue' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [NEXT_PLUGIN],
          },
          {
            type: 'page',
            number: 2,
            stateName: 'business_address',
            name: 'Business address',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyb-formal-business-address',
                element: 'column',
                children: [
                  {
                    id: 'sl-kyb-formal-business-address-title',
                    element: 'h1',
                    params: { text: 'Business address' },
                  },
                  {
                    id: 'sl-kyb-formal-address-line1',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.line1',
                    params: { label: 'Street address (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-address-city',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.city',
                    params: { label: 'City (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-address-district',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.district',
                    params: { label: 'District (optional)' },
                  },
                  {
                    id: 'sl-kyb-formal-business-address-next-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyb-formal-business-address-next',
                        element: 'submitbutton',
                        params: { text: 'Continue' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [NEXT_PLUGIN],
          },
          {
            type: 'page',
            number: 3,
            stateName: 'business_documents',
            name: 'Business documents',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyb-formal-business-documents',
                element: 'column',
                children: [
                  {
                    id: 'sl-kyb-formal-business-documents-title',
                    element: 'h1',
                    params: { text: 'Business documents' },
                  },
                  {
                    id: 'sl-kyb-formal-certificate-of-incorporation',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Certificate of incorporation',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-formal-certificate-of-incorporation',
                        category: 'business_document',
                        type: 'certificate_of_incorporation',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-formal-trade-license',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Trade license',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-formal-trade-license',
                        category: 'business_document',
                        type: 'trade_license',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-formal-electricity-bill',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Proof of address (electricity bill)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-formal-electricity-bill',
                        category: 'proof_of_address',
                        type: 'electricity_bill',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-formal-business-documents-finish-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyb-formal-business-documents-finish',
                        element: 'submitbutton',
                        params: { text: 'Finish' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [],
          },
        ],
      });

      // KYB Informal Collection Flow
      await upsertCollectionFlowUi({
        uiDefinitionId: `ui-sl-kyb-informal-collection-${projectId}`,
        name: 'SL KYB Informal Collection Flow',
        workflowDefinitionId: 'kyb_onboarding_sierra_leone_informal',
        projectId,
        steps: ['owner_and_business', 'informal_documents'],
        pages: [
          {
            type: 'page',
            number: 1,
            stateName: 'owner_and_business',
            name: 'Owner and business',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyb-informal-owner-and-business',
                element: 'column',
                children: [
                  {
                    id: 'sl-kyb-informal-owner-and-business-title',
                    element: 'h1',
                    params: { text: 'Owner and business' },
                  },
                  {
                    id: 'sl-kyb-informal-business-name',
                    element: 'textfield',
                    valueDestination: 'entity.data.businessName',
                    params: { label: 'Business / trading name (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-business-type',
                    element: 'textfield',
                    valueDestination: 'entity.data.businessType',
                    params: { label: 'Business type' },
                    validate: [{ type: 'required', message: 'Business type is required' }],
                  },
                  {
                    id: 'sl-kyb-informal-market',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.market',
                    params: { label: 'Market name (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-city',
                    element: 'textfield',
                    valueDestination: 'entity.data.address.city',
                    params: { label: 'City (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-phone',
                    element: 'phonefield',
                    valueDestination: 'entity.data.phoneNumber',
                    params: { label: 'Phone number (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-email',
                    element: 'textfield',
                    valueDestination: 'entity.data.email',
                    params: { label: 'Email (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-owner-section-title',
                    element: 'h3',
                    params: { text: 'Owner information' },
                  },
                  {
                    id: 'sl-kyb-informal-owner-first-name',
                    element: 'textfield',
                    valueDestination: 'entity.data.additionalInfo.owner.firstName',
                    params: { label: 'Owner first name' },
                    validate: [{ type: 'required', message: 'Owner first name is required' }],
                  },
                  {
                    id: 'sl-kyb-informal-owner-last-name',
                    element: 'textfield',
                    valueDestination: 'entity.data.additionalInfo.owner.lastName',
                    params: { label: 'Owner last name' },
                    validate: [{ type: 'required', message: 'Owner last name is required' }],
                  },
                  {
                    id: 'sl-kyb-informal-owner-national-id',
                    element: 'textfield',
                    valueDestination: 'entity.data.additionalInfo.owner.nationalId',
                    params: { label: 'Owner national ID (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-owner-dob',
                    element: 'datefield',
                    valueDestination: 'entity.data.additionalInfo.owner.dateOfBirth',
                    params: { label: 'Owner date of birth (optional)' },
                  },
                  {
                    id: 'sl-kyb-informal-owner-and-business-next-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyb-informal-owner-and-business-next',
                        element: 'submitbutton',
                        params: { text: 'Continue' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [NEXT_PLUGIN],
          },
          {
            type: 'page',
            number: 2,
            stateName: 'informal_documents',
            name: 'Documents',
            pageValidation: [],
            elements: [
              {
                id: 'sl-kyb-informal-documents',
                element: 'column',
                children: [
                  {
                    id: 'sl-kyb-informal-documents-title',
                    element: 'h1',
                    params: { text: 'Documents' },
                  },
                  {
                    id: 'sl-kyb-informal-owner-national-id-document',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Owner national ID (front)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-informal-owner-national-id',
                        category: 'proof_of_identity',
                        type: 'national_id',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-informal-owner-selfie-document',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Owner selfie',
                      documentType: 'selfie',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-informal-owner-selfie',
                        category: 'proof_of_identity_ownership',
                        type: 'selfie',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-informal-market-card',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Market association card (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-informal-market-association-card',
                        category: 'business_document',
                        type: 'market_association_card',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-informal-address-proof',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Proof of address (community leader letter) (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-informal-community-leader-letter',
                        category: 'proof_of_address',
                        type: 'community_leader_letter',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-informal-business-photo',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Business photo (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-informal-business-photo',
                        category: 'proof_of_location',
                        type: 'front_door_photo',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-informal-momo-statement',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Mobile money statement (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-kyb-informal-momo-statement',
                        category: 'financial_information',
                        type: 'momo_statement',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-kyb-informal-documents-finish-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-kyb-informal-documents-finish',
                        element: 'submitbutton',
                        params: { text: 'Finish' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [],
          },
        ],
      });

      // Loan Documents Collection Flow
      await upsertCollectionFlowUi({
        uiDefinitionId: `ui-sl-loan-collection-${projectId}`,
        name: 'SL Loan Documents Collection Flow',
        workflowDefinitionId: 'loan_kyc_kyb_sierra_leone',
        projectId,
        steps: ['loan_documents'],
        pages: [
          {
            type: 'page',
            number: 1,
            stateName: 'loan_documents',
            name: 'Loan documents',
            pageValidation: [],
            elements: [
              {
                id: 'sl-loan-documents',
                element: 'column',
                children: [
                  {
                    id: 'sl-loan-documents-title',
                    element: 'h1',
                    params: { text: 'Loan documents' },
                  },
                  {
                    id: 'sl-loan-momo-statement',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Mobile money statement (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-loan-momo-statement',
                        category: 'financial_information',
                        type: 'momo_statement',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-loan-orange-money-statement',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Orange Money statement (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-loan-orange-money-statement',
                        category: 'financial_information',
                        type: 'orange_money_statement',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-loan-afrimoney-statement',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Afrimoney statement (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-loan-afrimoney-statement',
                        category: 'financial_information',
                        type: 'afrimoney_statement',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-loan-payslip',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Payslip (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-loan-payslip',
                        category: 'proof_of_employment',
                        type: 'payslip',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-loan-employment-letter',
                    element: 'documentfield',
                    valueDestination: 'documents',
                    params: {
                      label: 'Employment letter (optional)',
                      documentType: 'document',
                      documentVariant: 'front',
                      template: {
                        id: 'sl-loan-employment-letter',
                        category: 'proof_of_employment',
                        type: 'employment_letter',
                        issuer: { country: 'SL' },
                        version: '1',
                        issuingVersion: 1,
                        properties: {},
                      },
                      uploadOn: 'submit',
                    },
                  },
                  {
                    id: 'sl-loan-documents-finish-row',
                    element: 'row',
                    params: { className: 'justify-end' },
                    children: [
                      {
                        id: 'sl-loan-documents-finish',
                        element: 'submitbutton',
                        params: { text: 'Finish' },
                      },
                    ],
                  },
                ],
              },
            ],
            plugins: [],
          },
        ],
      });

      // Case Filters
      await client.filter.upsert({
        where: { name_projectId: { name: 'SL Individual KYC', projectId } },
        update: {
          entity: 'individuals',
          query: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              state: true,
              context: true,
              workflowDefinitionId: true,
              assigneeId: true,
              endUser: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  correlationId: true,
                },
              },
            },
            where: { workflowDefinitionId: 'kyc_onboarding_sierra_leone' },
          } as any,
        },
        create: {
          id: `filter-sl-kyc-individuals-${projectId}`,
          name: 'SL Individual KYC',
          entity: 'individuals',
          projectId,
          query: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              state: true,
              context: true,
              workflowDefinitionId: true,
              assigneeId: true,
              endUser: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  correlationId: true,
                },
              },
            },
            where: { workflowDefinitionId: 'kyc_onboarding_sierra_leone' },
          } as any,
        },
      });

      await client.filter.upsert({
        where: { name_projectId: { name: 'SL Business KYB', projectId } },
        update: {
          entity: 'businesses',
          query: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              state: true,
              context: true,
              workflowDefinitionId: true,
              assigneeId: true,
              business: { select: { id: true, companyName: true, correlationId: true } },
            },
            where: {
              workflowDefinitionId: {
                in: ['kyb_onboarding_sierra_leone_formal', 'kyb_onboarding_sierra_leone_informal'],
              },
            },
          } as any,
        },
        create: {
          id: `filter-sl-kyb-businesses-${projectId}`,
          name: 'SL Business KYB',
          entity: 'businesses',
          projectId,
          query: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              state: true,
              context: true,
              workflowDefinitionId: true,
              assigneeId: true,
              business: { select: { id: true, companyName: true, correlationId: true } },
            },
            where: {
              workflowDefinitionId: {
                in: ['kyb_onboarding_sierra_leone_formal', 'kyb_onboarding_sierra_leone_informal'],
              },
            },
          } as any,
        },
      });

      await client.filter.upsert({
        where: { name_projectId: { name: 'SL Loan Applications', projectId } },
        update: {
          entity: 'individuals',
          query: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              state: true,
              context: true,
              workflowDefinitionId: true,
              assigneeId: true,
              endUser: {
                select: { id: true, firstName: true, lastName: true, correlationId: true },
              },
            },
            where: { workflowDefinitionId: 'loan_kyc_kyb_sierra_leone' },
          } as any,
        },
        create: {
          id: `filter-sl-loan-applications-${projectId}`,
          name: 'SL Loan Applications',
          entity: 'individuals',
          projectId,
          query: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              state: true,
              context: true,
              workflowDefinitionId: true,
              assigneeId: true,
              endUser: {
                select: { id: true, firstName: true, lastName: true, correlationId: true },
              },
            },
            where: { workflowDefinitionId: 'loan_kyc_kyb_sierra_leone' },
          } as any,
        },
      });

      console.info(`    ✓ ${projectId} (4 UIs + 3 filters)`);
    }

    // ── 5. Admin User ──
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
          create: [
            { projectId: 'project-mikashbokssl-main' },
            { projectId: 'project-actbsl-main' },
            { projectId: 'project-demosl-main' },
          ],
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
