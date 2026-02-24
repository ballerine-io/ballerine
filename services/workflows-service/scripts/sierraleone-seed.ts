/**
 * Sierra Leone Seed Script (Idempotent)
 *
 * Seeds the Ballerine database with:
 * 1. Single MiKashBoks Default customer (shared by LoanCube, Mobile, USSD)
 * 2. Single SL Default project
 * 3. All 4 SL workflow definitions (KYC, KYB Formal, KYB Informal, Loan KYC/KYB)
 * 4. UI definitions for backoffice case management
 * 5. Case filters for dashboard views
 * 6. Default admin user
 *
 * All operations use upsert() so this script is safe to re-run multiple times.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/sierraleone-seed.ts
 */

import { Customer, Prisma, PrismaClient, Project } from '@prisma/client';
import { hash } from 'bcrypt';
import { hashKey } from '../src/customer/api-key/utils';
import {
  generateKycOnboardingSierraLeone,
  generateKybOnboardingSierraLeoneFormal,
  generateKybOnboardingSierraLeoneInformal,
  generateLoanKycKybSierraLeone,
} from './workflows/sl';

const isPlaceholderSecret = (value?: string | null) => {
  const normalized = String(value || '').trim();
  return normalized.length === 0 || normalized === 'TODO_SET_ME';
};

async function upsertSLCustomer(
  client: PrismaClient,
  id: string,
  displayName: string,
  apiKey: string,
  webhookSharedSecret: string,
  config: Prisma.InputJsonValue = {},
): Promise<Customer> {
  const customerId = `customer-${id}`;

  const customer = await client.customer.upsert({
    where: { name: id },
    update: {
      displayName,
      authenticationConfiguration: {
        webhookSharedSecret,
      },
      logoImageUri: '/images/mikashboks-logo-horizontal.png',
      faviconImageUri: '/favicon.ico',
      country: 'SL',
      language: 'en',
      config,
    },
    create: {
      id: customerId,
      name: id,
      displayName,
      authenticationConfiguration: {
        webhookSharedSecret,
      },
      logoImageUri: '/images/mikashboks-logo-horizontal.png',
      faviconImageUri: '/favicon.ico',
      country: 'SL',
      language: 'en',
      config,
    },
  });

  // Ensure API key exists (check by hashed value to avoid duplicates)
  const hashedApiKey = await hashKey(apiKey);
  const existingKey = await client.apiKey.findFirst({
    where: { customerId: customer.id, hashedKey: hashedApiKey },
  });

  if (!existingKey) {
    // Check if customer has any API key at all
    const anyKey = await client.apiKey.findFirst({
      where: { customerId: customer.id },
    });

    if (!anyKey) {
      await client.apiKey.create({
        data: {
          hashedKey: hashedApiKey,
          customerId: customer.id,
        },
      });
    }
  }

  return customer;
}

async function upsertSLProject(
  client: PrismaClient,
  customer: Customer,
  id: string,
  name: string,
): Promise<Project> {
  return client.project.upsert({
    where: {
      name_customerId: {
        name,
        customerId: customer.id,
      },
    },
    update: {},
    create: {
      id: `project-${id}`,
      name,
      customerId: customer.id,
    },
  });
}

async function seedWorkflowDefinitions(client: PrismaClient) {
  console.info('  Seeding SL KYC workflow definition...');
  const kycDef = await generateKycOnboardingSierraLeone(client);

  console.info('  Seeding SL KYB formal workflow definition...');
  const kybFormalDef = await generateKybOnboardingSierraLeoneFormal(client);

  console.info('  Seeding SL KYB informal workflow definition...');
  const kybInformalDef = await generateKybOnboardingSierraLeoneInformal(client);

  console.info('  Seeding SL Loan KYC/KYB workflow definition...');
  const loanDef = await generateLoanKycKybSierraLeone(client);

  return { kycDef, kybFormalDef, kybInformalDef, loanDef };
}

async function seedUiDefinitions(client: PrismaClient, projectId: string) {
  console.info('  Seeding SL UI definitions...');

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

  const upsertCollectionFlowUiDefinition = async ({
    uiDefinitionId,
    name,
    workflowDefinitionId,
    pages,
    steps,
  }: {
    uiDefinitionId: string;
    name: string;
    workflowDefinitionId: string;
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

  // ─────────────────────────────────────────────────────────────────────
  // SL KYC (Individual)
  // ─────────────────────────────────────────────────────────────────────
  await upsertCollectionFlowUiDefinition({
    uiDefinitionId: `ui-sl-kyc-collection-${projectId}`,
    name: 'SL KYC Collection Flow',
    workflowDefinitionId: 'kyc_onboarding_sierra_leone',
    steps: ['personal_information', 'kyc_documents', 'address_proof'],
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
              {
                id: 'sl-kyc-documents-title',
                element: 'h1',
                params: { text: 'Documents' },
              },
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
      // Page 3: Proof of Address
      // This evidence is consumed by the address_verification state in
      // kyc-onboarding-sierra-leone.ts.
      {
        type: 'page',
        number: 3,
        stateName: 'address_proof',
        name: 'Proof of address',
        pageValidation: [],
        elements: [
          {
            id: 'sl-kyc-address-proof',
            element: 'column',
            children: [
              {
                id: 'sl-kyc-address-proof-title',
                element: 'h1',
                params: { text: 'Proof of address' },
              },
              {
                id: 'sl-kyc-address-proof-subtitle',
                element: 'description',
                params: {
                  text: 'Please upload a utility bill, bank statement, or government letter showing your current address (issued within the last 3 months).',
                },
              },
              {
                id: 'sl-kyc-address-proof-document',
                element: 'documentfield',
                valueDestination: 'documents',
                params: {
                  label: 'Proof of address document',
                  documentType: 'document',
                  documentVariant: 'front',
                  template: {
                    id: 'sl-kyc-proof-of-address',
                    category: 'proof_of_address',
                    type: 'utility_bill',
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
                    message: 'Proof of address is required',
                    value: { id: 'sl-kyc-proof-of-address' },
                  },
                ],
              },
              {
                id: 'sl-kyc-address-proof-finish-row',
                element: 'row',
                params: { className: 'justify-end' },
                children: [
                  {
                    id: 'sl-kyc-address-proof-finish',
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

  // ─────────────────────────────────────────────────────────────────────
  // SL KYB Formal (Registered Business)
  // ─────────────────────────────────────────────────────────────────────
  await upsertCollectionFlowUiDefinition({
    uiDefinitionId: `ui-sl-kyb-formal-collection-${projectId}`,
    name: 'SL KYB Formal Collection Flow',
    workflowDefinitionId: 'kyb_onboarding_sierra_leone_formal',
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

  // ─────────────────────────────────────────────────────────────────────
  // SL KYB Informal (Sole Proprietor / Trader)
  // ─────────────────────────────────────────────────────────────────────
  await upsertCollectionFlowUiDefinition({
    uiDefinitionId: `ui-sl-kyb-informal-collection-${projectId}`,
    name: 'SL KYB Informal Collection Flow',
    workflowDefinitionId: 'kyb_onboarding_sierra_leone_informal',
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

  // ─────────────────────────────────────────────────────────────────────
  // SL Loan (Financial Docs Collection Flow)
  // ─────────────────────────────────────────────────────────────────────
  await upsertCollectionFlowUiDefinition({
    uiDefinitionId: `ui-sl-loan-collection-${projectId}`,
    name: 'SL Loan Documents Collection Flow',
    workflowDefinitionId: 'loan_kyc_kyb_sierra_leone',
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

  // ─────────────────────────────────────────────────────────────────────
  // Case Management UI Definitions (G6)
  // ─────────────────────────────────────────────────────────────────────
  // These define how the backoffice-v2 renders case review screens.
  // The backoffice reads the uiDefinition with uiContext 'back_office'
  // for the corresponding workflowDefinitionId and uses its uiSchema
  // to build the case detail view.
  // ─────────────────────────────────────────────────────────────────────
  console.info('  Seeding case management UI definitions...');

  // DRY helper — each upsert duplicated the entire uiSchema between create and update.
  async function upsertCaseMgmtUi(
    id: string,
    name: string,
    workflowDefinitionId: string,
    blocks: unknown[],
  ) {
    const data = {
      name,
      uiContext: 'back_office' as const,
      uiSchema: { blocks } as any,
      workflowDefinitionId,
      version: 1,
      projectId,
    };
    await client.uiDefinition.upsert({
      where: { id },
      update: data as any,
      create: { id, ...data } as any,
    });
  }

  // KYC Case Management UI
  await upsertCaseMgmtUi(
    `ui-sl-kyc-case-management-${projectId}`,
    'SL KYC Case Management',
    'kyc_onboarding_sierra_leone',
    [
      {
        id: 'sl-kyc-cm-personal-info',
        type: 'entity-details',
        title: 'Personal Information',
        fields: [
          { key: 'entity.data.firstName', label: 'First Name' },
          { key: 'entity.data.lastName', label: 'Last Name' },
          { key: 'entity.data.nationalId', label: 'National ID' },
          { key: 'entity.data.dateOfBirth', label: 'Date of Birth' },
          { key: 'entity.data.gender', label: 'Gender' },
          { key: 'entity.data.phoneNumber', label: 'Phone' },
          { key: 'entity.data.email', label: 'Email' },
          { key: 'entity.data.fingerprintJsDeviceId', label: 'FingerprintJS Device ID' },
          { key: 'entity.data.deviceFingerprint', label: 'Device Fingerprint' },
          { key: 'entity.data.deviceFirebaseInstallationId', label: 'Firebase Installation ID' },
          { key: 'entity.data.deviceLocalInstallationId', label: 'Local Installation ID' },
          { key: 'entity.data.deviceIp', label: 'Device IP' },
          { key: 'entity.data.address.district', label: 'District' },
          { key: 'entity.data.address.city', label: 'City' },
        ],
      },
      {
        id: 'sl-kyc-cm-documents',
        type: 'document-review',
        title: 'Identity Documents',
        categories: ['proof_of_identity', 'proof_of_identity_ownership', 'proof_of_address'],
      },
      {
        id: 'sl-kyc-cm-verification-summary',
        type: 'verification-summary',
        title: 'Verification Results',
        sections: [
          { key: 'pluginsOutput.document_verification', label: 'Document Verification' },
          { key: 'pluginsOutput.facial_verification', label: 'Facial Verification' },
          { key: 'pluginsOutput.address_verification', label: 'Address Verification' },
          { key: 'pluginsOutput.device_dedup_check', label: 'Device Deduplication Check' },
        ],
      },
    ],
  );

  // KYB Formal Case Management UI
  await upsertCaseMgmtUi(
    `ui-sl-kyb-formal-case-management-${projectId}`,
    'SL KYB Formal Case Management',
    'kyb_onboarding_sierra_leone_formal',
    [
      {
        id: 'sl-kyb-formal-cm-business-info',
        type: 'entity-details',
        title: 'Business Information',
        fields: [
          { key: 'entity.data.companyName', label: 'Company Name' },
          { key: 'entity.data.registrationNumber', label: 'Registration Number' },
          { key: 'entity.data.taxIdNumber', label: 'Tax ID' },
          { key: 'entity.data.industry', label: 'Industry' },
          { key: 'entity.data.phoneNumber', label: 'Phone' },
          { key: 'entity.data.email', label: 'Email' },
          { key: 'entity.data.address.line1', label: 'Address' },
          { key: 'entity.data.address.city', label: 'City' },
          { key: 'entity.data.address.district', label: 'District' },
        ],
      },
      {
        id: 'sl-kyb-formal-cm-documents',
        type: 'document-review',
        title: 'Business Documents',
        categories: [
          'proof_of_registration',
          'business_document',
          'proof_of_address',
          'proof_of_ownership',
        ],
      },
      {
        id: 'sl-kyb-formal-cm-directors',
        type: 'child-workflows',
        title: 'Director KYC Results',
        definitionId: 'kyc_onboarding_sierra_leone',
      },
      {
        id: 'sl-kyb-formal-cm-verification-summary',
        type: 'verification-summary',
        title: 'Verification Results',
        sections: [
          { key: 'pluginsOutput.business_document_verification', label: 'Document Verification' },
          { key: 'pluginsOutput.business_registry_check', label: 'Business Registry' },
          { key: 'pluginsOutput.address_verification', label: 'Address Verification' },
        ],
      },
    ],
  );

  // KYB Informal Case Management UI
  await upsertCaseMgmtUi(
    `ui-sl-kyb-informal-case-management-${projectId}`,
    'SL KYB Informal Case Management',
    'kyb_onboarding_sierra_leone_informal',
    [
      {
        id: 'sl-kyb-informal-cm-business-info',
        type: 'entity-details',
        title: 'Business & Owner Information',
        fields: [
          { key: 'entity.data.businessName', label: 'Business Name' },
          { key: 'entity.data.businessType', label: 'Business Type' },
          { key: 'entity.data.address.market', label: 'Market' },
          { key: 'entity.data.address.city', label: 'City' },
          { key: 'entity.data.phoneNumber', label: 'Phone' },
          { key: 'entity.data.additionalInfo.owner.firstName', label: 'Owner First Name' },
          { key: 'entity.data.additionalInfo.owner.lastName', label: 'Owner Last Name' },
          { key: 'entity.data.additionalInfo.owner.nationalId', label: 'Owner National ID' },
          { key: 'entity.data.additionalInfo.owner.dateOfBirth', label: 'Owner Date of Birth' },
          { key: 'entity.data.ownerPhoneNumber', label: 'Owner Phone' },
          { key: 'entity.data.ownerEmail', label: 'Owner Email' },
          { key: 'entity.data.additionalInfo.owner.phoneNumber', label: 'Owner Phone (Legacy)' },
          { key: 'entity.data.additionalInfo.owner.email', label: 'Owner Email (Legacy)' },
          {
            key: 'entity.data.device.fingerprintJsDeviceId',
            label: 'Owner Device FingerprintJS ID',
          },
          { key: 'entity.data.device.deviceFingerprint', label: 'Owner Device Fingerprint' },
          {
            key: 'entity.data.device.deviceFirebaseInstallationId',
            label: 'Owner Device Firebase Installation ID',
          },
          { key: 'entity.data.device.deviceIp', label: 'Owner Device IP' },
          {
            key: 'entity.data.fingerprintJsDeviceId',
            label: 'Owner Device FingerprintJS ID (Legacy)',
          },
          { key: 'entity.data.deviceIp', label: 'Owner Device IP (Legacy)' },
        ],
      },
      {
        id: 'sl-kyb-informal-cm-documents',
        type: 'document-review',
        title: 'Business Documents',
        categories: [
          'proof_of_identity',
          'proof_of_identity_ownership',
          'business_document',
          'proof_of_address',
          'proof_of_location',
          'financial_information',
        ],
      },
      {
        id: 'sl-kyb-informal-cm-owner-kyc',
        type: 'child-workflows',
        title: 'Owner KYC Results',
        definitionId: 'kyc_onboarding_sierra_leone',
      },
      {
        id: 'sl-kyb-informal-cm-verification-summary',
        type: 'verification-summary',
        title: 'Verification Results',
        sections: [
          { key: 'pluginsOutput.business_photo_classification', label: 'Business Photo Analysis' },
          { key: 'pluginsOutput.market_card_verification', label: 'Market Card Verification' },
          { key: 'pluginsOutput.address_verification', label: 'Address Verification' },
        ],
      },
    ],
  );

  // Loan Case Management UI
  await upsertCaseMgmtUi(
    `ui-sl-loan-case-management-${projectId}`,
    'SL Loan Case Management',
    'loan_kyc_kyb_sierra_leone',
    [
      {
        id: 'sl-loan-cm-applicant-info',
        type: 'entity-details',
        title: 'Loan Applicant',
        fields: [
          { key: 'entity.data.firstName', label: 'First Name' },
          { key: 'entity.data.lastName', label: 'Last Name' },
          { key: 'entity.data.nationalId', label: 'National ID' },
          { key: 'entity.data.phoneNumber', label: 'Phone' },
          { key: 'entity.data.businessName', label: 'Business Name' },
          { key: 'entity.data.businessType', label: 'Business Type' },
          { key: 'entity.data.registrationNumber', label: 'Registration Number' },
          { key: 'entity.data.loanApplicationId', label: 'Loan Application ID' },
          { key: 'entity.data.loanAmount', label: 'Loan Amount' },
          { key: 'entity.data.loanCurrency', label: 'Loan Currency' },
          { key: 'entity.data.loanPurpose', label: 'Loan Purpose' },
          { key: 'entity.data.loanTerm', label: 'Loan Term' },
          { key: 'entity.data.fingerprintJsDeviceId', label: 'Applicant Device FingerprintJS ID' },
          { key: 'entity.data.deviceFingerprint', label: 'Applicant Device Fingerprint' },
          {
            key: 'entity.data.deviceFirebaseInstallationId',
            label: 'Applicant Device Firebase ID',
          },
          { key: 'entity.data.deviceLocalInstallationId', label: 'Applicant Device Local ID' },
          { key: 'entity.data.deviceIp', label: 'Applicant Device IP' },
        ],
      },
      {
        id: 'sl-loan-cm-documents',
        type: 'document-review',
        title: 'Loan Documents',
        categories: ['proof_of_identity', 'financial_information', 'proof_of_employment'],
      },
      {
        id: 'sl-loan-cm-child-workflows',
        type: 'child-workflows',
        title: 'Verification Results',
        definitionIds: [
          'kyc_onboarding_sierra_leone',
          'kyb_onboarding_sierra_leone_formal',
          'kyb_onboarding_sierra_leone_informal',
        ],
      },
      {
        id: 'sl-loan-cm-financial-analysis',
        type: 'verification-summary',
        title: 'Financial Analysis',
        sections: [
          { key: 'pluginsOutput.loan_financial_analysis', label: 'Financial Document Analysis' },
        ],
      },
    ],
  );

  console.info('  Case management UI definitions seeded.');
}

async function seedFilters(client: PrismaClient, projectId: string) {
  console.info('  Seeding SL case filters...');

  // Filter: All individual KYC cases
  await client.filter.upsert({
    where: {
      name_projectId: {
        name: 'SL Individual KYC',
        projectId,
      },
    },
    update: {
      entity: 'individuals',
      query: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          state: true,
          context: true,
          tags: true,
          workflowDefinitionId: true,
          assigneeId: true,
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
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
        where: {
          workflowDefinitionId: 'kyc_onboarding_sierra_leone',
        },
        orderBy: [{ createdAt: 'desc' }],
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
          tags: true,
          workflowDefinitionId: true,
          assigneeId: true,
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
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
        where: {
          workflowDefinitionId: 'kyc_onboarding_sierra_leone',
        },
        orderBy: [{ createdAt: 'desc' }],
      } as any,
    },
  });

  // Filter: All business KYB cases (both formal and informal)
  await client.filter.upsert({
    where: {
      name_projectId: {
        name: 'SL Business KYB',
        projectId,
      },
    },
    update: {
      entity: 'businesses',
      query: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          state: true,
          context: true,
          tags: true,
          workflowDefinitionId: true,
          assigneeId: true,
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          business: {
            select: {
              id: true,
              companyName: true,
              correlationId: true,
            },
          },
        },
        where: {
          workflowDefinitionId: {
            in: ['kyb_onboarding_sierra_leone_formal', 'kyb_onboarding_sierra_leone_informal'],
          },
        },
        orderBy: [{ createdAt: 'desc' }],
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
          tags: true,
          workflowDefinitionId: true,
          assigneeId: true,
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          business: {
            select: {
              id: true,
              companyName: true,
              correlationId: true,
            },
          },
        },
        where: {
          workflowDefinitionId: {
            in: ['kyb_onboarding_sierra_leone_formal', 'kyb_onboarding_sierra_leone_informal'],
          },
        },
        orderBy: [{ createdAt: 'desc' }],
      } as any,
    },
  });

  // Filter: Loan application cases
  await client.filter.upsert({
    where: {
      name_projectId: {
        name: 'SL Loan Applications',
        projectId,
      },
    },
    update: {
      entity: 'individuals',
      query: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          state: true,
          context: true,
          tags: true,
          workflowDefinitionId: true,
          assigneeId: true,
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          endUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              correlationId: true,
            },
          },
        },
        where: {
          workflowDefinitionId: 'loan_kyc_kyb_sierra_leone',
        },
        orderBy: [{ createdAt: 'desc' }],
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
          tags: true,
          workflowDefinitionId: true,
          assigneeId: true,
          assignee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          endUser: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              correlationId: true,
            },
          },
        },
        where: {
          workflowDefinitionId: 'loan_kyc_kyb_sierra_leone',
        },
        orderBy: [{ createdAt: 'desc' }],
      } as any,
    },
  });
}

async function main() {
  console.info('=== Sierra Leone Identity Seed (Idempotent) ===');

  const client = new PrismaClient();

  try {
    // 1. Upsert the single MiKashBoks Default tenant
    // All services (LoanCube, namk mobile, namk USSD) share this one tenant.
    console.info('Upserting MiKashBoks Default customer...');

    const isProduction =
      process.env.NODE_ENV === 'production' || process.env.ENVIRONMENT_NAME === 'production';

    // Never seed production with guessable credentials.
    const apiKeyEnv = process.env.MK_SL_API_KEY;
    // Keep backwards compatibility with older env naming.
    // The value must match what LoanCube verifies under BALLERINE_WEBHOOK_SECRET.
    const loancubeWebhookSecretEnv = process.env.LOANCUBE_WEBHOOK_SECRET;
    const ballerineWebhookSecretEnv = process.env.BALLERINE_WEBHOOK_SECRET;

    if (
      loancubeWebhookSecretEnv &&
      ballerineWebhookSecretEnv &&
      loancubeWebhookSecretEnv !== ballerineWebhookSecretEnv
    ) {
      const msg =
        'LOANCUBE_WEBHOOK_SECRET and BALLERINE_WEBHOOK_SECRET are both set but differ. They must be identical.';
      throw new Error(msg);
    }

    const webhookSecretEnv = loancubeWebhookSecretEnv || ballerineWebhookSecretEnv;

    if (isProduction) {
      if (!apiKeyEnv) {
        throw new Error('Missing MK_SL_API_KEY (required for production seeding)');
      }
      if (isPlaceholderSecret(webhookSecretEnv)) {
        throw new Error(
          'Missing/placeholder LOANCUBE_WEBHOOK_SECRET (or BALLERINE_WEBHOOK_SECRET). Refusing to seed production with TODO_SET_ME.',
        );
      }
    }

    const apiKey = apiKeyEnv || 'mk-sl-api-key-default';
    const webhookSecret = webhookSecretEnv || 'mk-sl-webhook-secret-default';

    if (!apiKeyEnv) {
      console.warn('  ⚠ MK_SL_API_KEY not set — using dev default. Set this in production!');
    }
    if (isPlaceholderSecret(webhookSecretEnv)) {
      console.warn(
        '  ⚠ LOANCUBE_WEBHOOK_SECRET/BALLERINE_WEBHOOK_SECRET missing or TODO_SET_ME — using dev default. Set this in production!',
      );
    }

    const customerDefault = await upsertSLCustomer(
      client,
      'mikashboks-default',
      'MiKashBoks',
      apiKey,
      webhookSecret,
      { createIdentityVerification: true },
    );

    // 2. Upsert the single SL project
    console.info('Upserting SL Default project...');

    const projectDefault = await upsertSLProject(
      client,
      customerDefault,
      'sl-default',
      'Sierra Leone Default',
    );

    // 3. Seed workflow definitions (already use upsert via generators)
    console.info('Seeding workflow definitions...');
    const workflows = await seedWorkflowDefinitions(client);

    // 4. Seed UI definitions for the default project
    console.info('Seeding UI definitions...');
    await seedUiDefinitions(client, projectDefault.id);

    // 5. Seed filters
    console.info('Seeding filters...');
    await seedFilters(client, projectDefault.id);

    // 6. Upsert default admin user
    // IMPORTANT: Change this password immediately after first login!
    const initialAdminPasswordEnv = process.env.ADMIN_INITIAL_PASSWORD;
    if (isProduction && !initialAdminPasswordEnv) {
      throw new Error('Missing ADMIN_INITIAL_PASSWORD (required for production seeding)');
    }
    const INITIAL_ADMIN_PASSWORD = initialAdminPasswordEnv || 'change-me-immediately';
    const hashedPassword = await hash(INITIAL_ADMIN_PASSWORD, 10);

    console.info('Upserting default admin user (salton@mikashboks.com)...');
    const adminUser = await client.user.upsert({
      where: { email: 'salton@mikashboks.com' },
      update: {
        firstName: 'Salton',
        lastName: 'Massally',
        roles: ['admin'],
      },
      create: {
        id: 'user-sl-admin',
        email: 'salton@mikashboks.com',
        firstName: 'Salton',
        lastName: 'Massally',
        password: hashedPassword,
        roles: ['admin'],
      },
    });

    // 7. Upsert user-to-project association
    await client.userToProject.upsert({
      where: {
        projectId_userId: {
          projectId: projectDefault.id,
          userId: adminUser.id,
        },
      },
      update: {},
      create: {
        projectId: projectDefault.id,
        userId: adminUser.id,
      },
    });

    // 8. Seed the SLA_BREACH_MANUAL_REVIEW AlertDefinition
    //    Required by SlaCheckController (POST /api/internal/sla-check).
    //    Uses transaction_monitoring as monitoringType since no workflow_monitoring enum exists yet.
    console.info('Upserting SLA_BREACH AlertDefinition...');
    await client.alertDefinition.upsert({
      where: { crossEnvKey: 'SLA_BREACH_MANUAL_REVIEW' },
      update: {
        name: 'SLA Breach — Manual Review',
        description:
          'Fires when a workflow has been in manual_review state for longer than the SLA threshold (default 24h).',
        enabled: true,
        defaultSeverity: 'medium',
      },
      create: {
        crossEnvKey: 'SLA_BREACH_MANUAL_REVIEW',
        correlationId: 'SLA_BREACH_MANUAL_REVIEW',
        name: 'SLA Breach — Manual Review',
        description:
          'Fires when a workflow has been in manual_review state for longer than the SLA threshold (default 24h).',
        monitoringType: 'transaction_monitoring', // No workflow_monitoring enum yet
        enabled: true,
        defaultSeverity: 'medium',
        inlineRule: {
          id: 'SLA_BREACH_MANUAL_REVIEW',
          fnName: 'slaCheckController', // Driven by SlaCheckController, not data-analytics
          subjects: ['workflowRuntimeDataId'],
          options: { slaThresholdHours: 24 },
        },
        dedupeStrategy: {
          cooldownTimeframeInMinutes: 60 * 24, // 24h cooldown
          dedupeWindow: { timeAmount: 7, timeUnit: 'days' },
        },
        config: {},
        tags: ['sla', 'workflow'],
        additionalInfo: {},
        createdBy: 'SYSTEM',
        project: { connect: { id: projectDefault.id } },
      },
    });

    console.info('=== Sierra Leone seed complete ===');
    console.info(`  Customer: ${customerDefault.id}`);
    console.info(`  Project: ${projectDefault.id}`);
    console.info(
      `  Workflows: kyc_onboarding_sierra_leone, kyb_onboarding_sierra_leone_formal, kyb_onboarding_sierra_leone_informal, loan_kyc_kyb_sierra_leone`,
    );
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await client.$disconnect();
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
