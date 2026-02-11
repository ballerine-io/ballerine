/**
 * Sierra Leone Seed Script
 *
 * Seeds the Ballerine database with:
 * 1. SL tenant customers (LoanCube, Mobile, USSD, Default)
 * 2. Projects scoped to each customer
 * 3. All 4 SL workflow definitions (KYC, KYB Formal, KYB Informal, Loan KYC/KYB)
 * 4. UI definitions for backoffice case management
 * 5. Default admin user
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/sierraleone-seed.ts
 */

import { Customer, Prisma, PrismaClient, Project } from '@prisma/client';
import { hashKey } from '../src/customer/api-key/utils';
import { hash } from 'bcrypt';
import {
  generateKycOnboardingSierraLeone,
  generateKybOnboardingSierraLeoneFormal,
  generateKybOnboardingSierraLeoneInformal,
  generateLoanKycKybSierraLeone,
} from './workflows/sl';

const BCRYPT_SALT: string | number = 10;

async function createSLCustomer(
  client: PrismaClient,
  id: string,
  displayName: string,
  apiKey: string,
  webhookSharedSecret: string,
  config: Record<string, unknown> = {},
) {
  // Avoid bootstrapping the full NestJS AppModule in seed scripts; Prisma is sufficient.
  // This makes seeding deterministic and avoids waiting on optional runtime services.
  const customer = await client.customer.upsert({
    where: { name: id },
    update: {
      displayName,
      authenticationConfiguration: { webhookSharedSecret } as Prisma.InputJsonValue,
      logoImageUri: '',
      faviconImageUri: '',
      country: 'SL',
      language: 'en',
      config: { ...config } as Prisma.InputJsonValue,
    },
    create: {
      id: `customer-${id}`,
      name: id,
      displayName,
      authenticationConfiguration: { webhookSharedSecret } as Prisma.InputJsonValue,
      logoImageUri: '',
      faviconImageUri: '',
      country: 'SL',
      language: 'en',
      config: { ...config } as Prisma.InputJsonValue,
    },
  });

  // Ensure an API key exists (hash is deterministic because HASHING_KEY_SECRET is a bcrypt salt).
  const hashedKey = await hashKey(apiKey);
  await client.apiKey.upsert({
    where: { hashedKey },
    update: {
      customerId: customer.id,
      deletedAt: null,
    },
    create: {
      customerId: customer.id,
      hashedKey,
    },
  });

  return customer;
}

async function createSLProject(client: PrismaClient, customer: Customer, id: string, name: string) {
  return client.project.upsert({
    where: { id: `project-${id}` },
    update: {
      name,
      customerId: customer.id,
    },
    create: {
      id: `project-${id}`,
      name,
      customerId: customer.id,
    },
  });
}

async function seedWorkflowDefinitions(client: PrismaClient, projectId: string) {
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

async function linkWorkflowToProject(
  client: PrismaClient,
  workflowDefinitionId: string,
  projectId: string,
) {
  // Ballerine uses WorkflowDefinition.projectId to scope workflows
  // For shared workflows, we create a copy per project or link via
  // the WorkflowDefinitionToProject junction (if it exists in schema)
  // For now, update the definition to set the projectId
  await client.workflowDefinition.update({
    where: { id: workflowDefinitionId },
    data: { projectId },
  });
}

async function seedUiDefinitions(client: PrismaClient, projectId: string) {
  console.info('  Seeding SL UI definitions...');

  // KYC individual case review
  await client.uiDefinition.upsert({
    where: { id: `ui-sl-kyc-individual-${projectId}` },
    update: {
      name: 'SL KYC Individual Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'personal-info',
            label: 'Personal Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'firstName', label: 'First Name' },
              { type: 'field', name: 'lastName', label: 'Last Name' },
              { type: 'field', name: 'nationalId', label: 'National ID (SL)' },
              { type: 'field', name: 'dateOfBirth', label: 'Date of Birth' },
              { type: 'field', name: 'phoneNumber', label: 'Phone (232XXXXXXXX)' },
              { type: 'field', name: 'email', label: 'Email' },
              { type: 'field', name: 'gender', label: 'Gender' },
            ],
          },
          {
            type: 'document-review',
            name: 'identity-documents',
            label: 'Identity Documents',
            documents: [
              'national_id',
              'passport',
              'voter_id',
              'drivers_license',
              'school_id',
              'employee_id',
            ],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'document-review',
            name: 'facial-match',
            label: 'Facial Verification',
            documents: ['selfie'],
            showFacialMatchScore: true,
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'kyc_onboarding_sierra_leone',
    },
    create: {
      id: `ui-sl-kyc-individual-${projectId}`,
      name: 'SL KYC Individual Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'personal-info',
            label: 'Personal Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'firstName', label: 'First Name' },
              { type: 'field', name: 'lastName', label: 'Last Name' },
              { type: 'field', name: 'nationalId', label: 'National ID (SL)' },
              { type: 'field', name: 'dateOfBirth', label: 'Date of Birth' },
              { type: 'field', name: 'phoneNumber', label: 'Phone (232XXXXXXXX)' },
              { type: 'field', name: 'email', label: 'Email' },
              { type: 'field', name: 'gender', label: 'Gender' },
            ],
          },
          {
            type: 'document-review',
            name: 'identity-documents',
            label: 'Identity Documents',
            documents: [
              'national_id',
              'passport',
              'voter_id',
              'drivers_license',
              'school_id',
              'employee_id',
            ],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'document-review',
            name: 'facial-match',
            label: 'Facial Verification',
            documents: ['selfie'],
            showFacialMatchScore: true,
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'kyc_onboarding_sierra_leone',
    },
  });

  // KYB formal case review
  await client.uiDefinition.upsert({
    where: { id: `ui-sl-kyb-formal-${projectId}` },
    update: {
      name: 'SL KYB Formal Business Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'business-info',
            label: 'Business Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'companyName', label: 'Company Name' },
              { type: 'field', name: 'tradingName', label: 'Trading Name' },
              { type: 'field', name: 'registrationNumber', label: 'Registration Number' },
              { type: 'field', name: 'businessType', label: 'Business Type' },
              { type: 'field', name: 'taxIdNumber', label: 'Tax ID' },
              { type: 'field', name: 'industry', label: 'Industry' },
              { type: 'field', name: 'phoneNumber', label: 'Phone' },
              { type: 'field', name: 'email', label: 'Email' },
            ],
          },
          {
            type: 'container',
            name: 'business-address',
            label: 'Business Address',
            valueDestination: 'entity.data.address',
            elements: [
              { type: 'field', name: 'line1', label: 'Address Line 1' },
              { type: 'field', name: 'city', label: 'City' },
              { type: 'field', name: 'district', label: 'District' },
            ],
          },
          {
            type: 'document-review',
            name: 'business-documents',
            label: 'Business Documents',
            documents: [
              'certificate_of_incorporation',
              'business_registration_certificate',
              'trade_license',
              'corporate_tax_certificate',
              'certificate_of_directors_and_shareholders',
            ],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'document-review',
            name: 'financial-documents',
            label: 'Financial Documents',
            documents: [
              'bank_statement',
              'orange_money_statement',
              'afrimoney_statement',
              'transaction_data_last_3_6_months',
            ],
            showOcrResults: true,
          },
          {
            type: 'document-review',
            name: 'address-proof',
            label: 'Address Proof',
            documents: [
              'electricity_bill',
              'water_bill',
              'tenancy_agreement',
              'local_council_tax_receipt',
              'community_leader_letter',
              'front_door_photo',
              'interior_office_photo',
            ],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'child-workflows',
            name: 'director-kyc',
            label: 'Director/UBO Verification',
            childDefinitionId: 'kyc_onboarding_sierra_leone',
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'kyb_onboarding_sierra_leone_formal',
    },
    create: {
      id: `ui-sl-kyb-formal-${projectId}`,
      name: 'SL KYB Formal Business Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'business-info',
            label: 'Business Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'companyName', label: 'Company Name' },
              { type: 'field', name: 'tradingName', label: 'Trading Name' },
              { type: 'field', name: 'registrationNumber', label: 'Registration Number' },
              { type: 'field', name: 'businessType', label: 'Business Type' },
              { type: 'field', name: 'taxIdNumber', label: 'Tax ID' },
              { type: 'field', name: 'industry', label: 'Industry' },
              { type: 'field', name: 'phoneNumber', label: 'Phone' },
              { type: 'field', name: 'email', label: 'Email' },
            ],
          },
          {
            type: 'container',
            name: 'business-address',
            label: 'Business Address',
            valueDestination: 'entity.data.address',
            elements: [
              { type: 'field', name: 'line1', label: 'Address Line 1' },
              { type: 'field', name: 'city', label: 'City' },
              { type: 'field', name: 'district', label: 'District' },
            ],
          },
          {
            type: 'document-review',
            name: 'business-documents',
            label: 'Business Documents',
            documents: [
              'certificate_of_incorporation',
              'business_registration_certificate',
              'trade_license',
              'corporate_tax_certificate',
              'certificate_of_directors_and_shareholders',
            ],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'document-review',
            name: 'financial-documents',
            label: 'Financial Documents',
            documents: [
              'bank_statement',
              'orange_money_statement',
              'afrimoney_statement',
              'transaction_data_last_3_6_months',
            ],
            showOcrResults: true,
          },
          {
            type: 'document-review',
            name: 'address-proof',
            label: 'Address Proof',
            documents: [
              'electricity_bill',
              'water_bill',
              'tenancy_agreement',
              'local_council_tax_receipt',
              'community_leader_letter',
              'front_door_photo',
              'interior_office_photo',
            ],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'child-workflows',
            name: 'director-kyc',
            label: 'Director/UBO Verification',
            childDefinitionId: 'kyc_onboarding_sierra_leone',
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'kyb_onboarding_sierra_leone_formal',
    },
  });

  // KYB informal case review
  await client.uiDefinition.upsert({
    where: { id: `ui-sl-kyb-informal-${projectId}` },
    update: {
      name: 'SL KYB Informal/Sole Proprietorship Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'business-info',
            label: 'Business Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'businessName', label: 'Business/Trading Name' },
              { type: 'field', name: 'businessType', label: 'Business Type' },
              { type: 'field', name: 'industry', label: 'Industry/Trade' },
              { type: 'field', name: 'phoneNumber', label: 'Phone' },
            ],
          },
          {
            type: 'container',
            name: 'owner-info',
            label: 'Owner Information',
            valueDestination: 'entity.data.additionalInfo.owner',
            elements: [
              { type: 'field', name: 'firstName', label: 'First Name' },
              { type: 'field', name: 'lastName', label: 'Last Name' },
              { type: 'field', name: 'nationalId', label: 'National ID' },
              { type: 'field', name: 'dateOfBirth', label: 'Date of Birth' },
            ],
          },
          {
            type: 'container',
            name: 'business-location',
            label: 'Business Location',
            valueDestination: 'entity.data.address',
            elements: [
              { type: 'field', name: 'market', label: 'Market Name' },
              { type: 'field', name: 'line1', label: 'Address' },
              { type: 'field', name: 'city', label: 'City' },
              { type: 'field', name: 'district', label: 'District' },
            ],
          },
          {
            type: 'document-review',
            name: 'market-card',
            label: 'Market Association Card',
            documents: ['market_association_card'],
            showOcrResults: true,
          },
          {
            type: 'document-review',
            name: 'location-proof',
            label: 'Location Proof',
            documents: ['community_leader_letter', 'front_door_photo', 'local_council_tax_receipt'],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'document-review',
            name: 'financial-activity',
            label: 'Financial Activity',
            documents: [
              'orange_money_statement',
              'afrimoney_statement',
              'bank_statement',
              'transaction_data_last_3_6_months',
            ],
            showOcrResults: true,
          },
          {
            type: 'child-workflows',
            name: 'owner-kyc',
            label: 'Owner Identity Verification',
            childDefinitionId: 'kyc_onboarding_sierra_leone',
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'kyb_onboarding_sierra_leone_informal',
    },
    create: {
      id: `ui-sl-kyb-informal-${projectId}`,
      name: 'SL KYB Informal/Sole Proprietorship Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'business-info',
            label: 'Business Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'businessName', label: 'Business/Trading Name' },
              { type: 'field', name: 'businessType', label: 'Business Type' },
              { type: 'field', name: 'industry', label: 'Industry/Trade' },
              { type: 'field', name: 'phoneNumber', label: 'Phone' },
            ],
          },
          {
            type: 'container',
            name: 'owner-info',
            label: 'Owner Information',
            valueDestination: 'entity.data.additionalInfo.owner',
            elements: [
              { type: 'field', name: 'firstName', label: 'First Name' },
              { type: 'field', name: 'lastName', label: 'Last Name' },
              { type: 'field', name: 'nationalId', label: 'National ID' },
              { type: 'field', name: 'dateOfBirth', label: 'Date of Birth' },
            ],
          },
          {
            type: 'container',
            name: 'business-location',
            label: 'Business Location',
            valueDestination: 'entity.data.address',
            elements: [
              { type: 'field', name: 'market', label: 'Market Name' },
              { type: 'field', name: 'line1', label: 'Address' },
              { type: 'field', name: 'city', label: 'City' },
              { type: 'field', name: 'district', label: 'District' },
            ],
          },
          {
            type: 'document-review',
            name: 'market-card',
            label: 'Market Association Card',
            documents: ['market_association_card'],
            showOcrResults: true,
          },
          {
            type: 'document-review',
            name: 'location-proof',
            label: 'Location Proof',
            documents: ['community_leader_letter', 'front_door_photo', 'local_council_tax_receipt'],
            showOcrResults: true,
            showVerificationDecision: true,
          },
          {
            type: 'document-review',
            name: 'financial-activity',
            label: 'Financial Activity',
            documents: [
              'orange_money_statement',
              'afrimoney_statement',
              'bank_statement',
              'transaction_data_last_3_6_months',
            ],
            showOcrResults: true,
          },
          {
            type: 'child-workflows',
            name: 'owner-kyc',
            label: 'Owner Identity Verification',
            childDefinitionId: 'kyc_onboarding_sierra_leone',
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'kyb_onboarding_sierra_leone_informal',
    },
  });

  // Loan application case review
  await client.uiDefinition.upsert({
    where: { id: `ui-sl-loan-kyc-kyb-${projectId}` },
    update: {
      name: 'SL Loan Application Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'loan-summary',
            label: 'Loan Application',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'loanApplicationId', label: 'Application ID' },
              { type: 'field', name: 'loanAmount', label: 'Loan Amount' },
              { type: 'field', name: 'loanPurpose', label: 'Purpose' },
              { type: 'field', name: 'loanTerm', label: 'Term (months)' },
            ],
          },
          {
            type: 'container',
            name: 'applicant-info',
            label: 'Applicant Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'firstName', label: 'First Name' },
              { type: 'field', name: 'lastName', label: 'Last Name' },
              { type: 'field', name: 'nationalId', label: 'National ID' },
              { type: 'field', name: 'phoneNumber', label: 'Phone' },
              { type: 'field', name: 'email', label: 'Email' },
              { type: 'field', name: 'businessName', label: 'Business Name' },
              { type: 'field', name: 'businessType', label: 'Business Type' },
            ],
          },
          {
            type: 'document-review',
            name: 'loan-documents',
            label: 'Loan Documents',
            documents: [
              'payslip',
              'appointment_letter',
              'bank_statement',
              'orange_money_statement',
              'afrimoney_statement',
              'transaction_data_last_3_6_months',
            ],
            showOcrResults: true,
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'loan_kyc_kyb_sierra_leone',
    },
    create: {
      id: `ui-sl-loan-kyc-kyb-${projectId}`,
      name: 'SL Loan Application Review',
      uiContext: 'back_office',
      uiSchema: {
        elements: [
          {
            type: 'container',
            name: 'loan-summary',
            label: 'Loan Application',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'loanApplicationId', label: 'Application ID' },
              { type: 'field', name: 'loanAmount', label: 'Loan Amount' },
              { type: 'field', name: 'loanPurpose', label: 'Purpose' },
              { type: 'field', name: 'loanTerm', label: 'Term (months)' },
            ],
          },
          {
            type: 'container',
            name: 'applicant-info',
            label: 'Applicant Information',
            valueDestination: 'entity.data',
            elements: [
              { type: 'field', name: 'firstName', label: 'First Name' },
              { type: 'field', name: 'lastName', label: 'Last Name' },
              { type: 'field', name: 'nationalId', label: 'National ID' },
              { type: 'field', name: 'phoneNumber', label: 'Phone' },
              { type: 'field', name: 'email', label: 'Email' },
              { type: 'field', name: 'businessName', label: 'Business Name' },
              { type: 'field', name: 'businessType', label: 'Business Type' },
            ],
          },
          {
            type: 'document-review',
            name: 'loan-documents',
            label: 'Loan Documents',
            documents: [
              'payslip',
              'appointment_letter',
              'bank_statement',
              'orange_money_statement',
              'afrimoney_statement',
              'transaction_data_last_3_6_months',
            ],
            showOcrResults: true,
          },
          {
            type: 'verification-summary',
            name: 'verification-results',
            label: 'Verification Results',
            valueDestination: 'pluginsOutput',
          },
        ],
      } as Prisma.InputJsonValue,
      definition: {} as Prisma.InputJsonValue,
      projectId,
      workflowDefinitionId: 'loan_kyc_kyb_sierra_leone',
    },
  });
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
        where: {
          workflowDefinitionId: 'kyc_onboarding_sierra_leone',
        },
      } as Prisma.InputJsonValue,
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
        where: {
          workflowDefinitionId: 'kyc_onboarding_sierra_leone',
        },
      } as Prisma.InputJsonValue,
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
          workflowDefinitionId: true,
          assigneeId: true,
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
      } as Prisma.InputJsonValue,
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
      } as Prisma.InputJsonValue,
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
          workflowDefinitionId: true,
          assigneeId: true,
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
      } as Prisma.InputJsonValue,
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
      } as Prisma.InputJsonValue,
    },
  });
}

async function main() {
  console.info('=== Sierra Leone Identity Seed ===');

  const client = new PrismaClient();

  try {
    // 1. Create tenant customers
    console.info('Creating SL tenant customers...');

    const customerDefault = (await createSLCustomer(
      client,
      'mikashboks-sl',
      'MiKashBoks Sierra Leone',
      'mk-sl-api-key-default',
      'mk-sl-webhook-secret-default',
    )) as Customer;

    const customerLoanCube = (await createSLCustomer(
      client,
      'loancube',
      'LoanCube',
      'lc-sl-api-key-prod',
      'lc-sl-webhook-secret-prod',
      { disableBusinessSyncToUnifiedApi: true },
    )) as Customer;

    const customerMobile = (await createSLCustomer(
      client,
      'namk-mobile',
      'MiKashBoks Mobile',
      'mk-mobile-api-key-prod',
      'mk-mobile-webhook-secret-prod',
    )) as Customer;

    const customerUssd = (await createSLCustomer(
      client,
      'namk-ussd',
      'MiKashBoks USSD/WhatsApp',
      'mk-ussd-api-key-prod',
      'mk-ussd-webhook-secret-prod',
    )) as Customer;

    // 2. Create projects
    console.info('Creating SL projects...');

    const projectDefault = await createSLProject(
      client,
      customerDefault,
      'sl-default',
      'Sierra Leone Default',
    );
    const projectLoanCube = await createSLProject(
      client,
      customerLoanCube,
      'loancube-sl',
      'LoanCube Sierra Leone',
    );
    const projectMobile = await createSLProject(
      client,
      customerMobile,
      'namk-mobile-sl',
      'Mobile App Sierra Leone',
    );
    const projectUssd = await createSLProject(
      client,
      customerUssd,
      'namk-ussd-sl',
      'USSD/WhatsApp Sierra Leone',
    );

    // 3. Seed workflow definitions
    console.info('Seeding workflow definitions...');
    const workflows = await seedWorkflowDefinitions(client, projectDefault.id);

    // 4. Seed UI definitions for the default project
    console.info('Seeding UI definitions...');
    await seedUiDefinitions(client, projectDefault.id);

    // 5. Seed filters
    console.info('Seeding filters...');
    await seedFilters(client, projectDefault.id);

    // 6. Create default admin user
    console.info('Creating default admin user...');
    const adminUser = await client.user.upsert({
      where: { email: 'admin@mikashboks.com' },
      update: {
        firstName: 'Admin',
        lastName: 'MiKashBoks',
        password: await hash('admin', BCRYPT_SALT),
        roles: ['admin'],
        status: 'Active',
      },
      create: {
        id: 'user-sl-admin',
        email: 'admin@mikashboks.com',
        firstName: 'Admin',
        lastName: 'MiKashBoks',
        password: await hash('admin', BCRYPT_SALT),
        roles: ['admin'],
        status: 'Active',
      },
    });

    await client.userToProject.createMany({
      data: [
        { userId: adminUser.id, projectId: projectDefault.id },
        { userId: adminUser.id, projectId: projectLoanCube.id },
        { userId: adminUser.id, projectId: projectMobile.id },
        { userId: adminUser.id, projectId: projectUssd.id },
      ],
      skipDuplicates: true,
    });

    console.info('=== Sierra Leone seed complete ===');
    console.info(
      `  Customers: ${customerDefault.id}, ${customerLoanCube.id}, ${customerMobile.id}, ${customerUssd.id}`,
    );
    console.info(
      `  Projects: ${projectDefault.id}, ${projectLoanCube.id}, ${projectMobile.id}, ${projectUssd.id}`,
    );
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
