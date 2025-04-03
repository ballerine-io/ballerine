import { apiClient } from '@/common/api-client/api-client';
import { Method, States } from '@/common/enums';
import { env } from '@/common/env/env';
import { getOriginUrl } from '@/common/utils/get-origin-url/get-url-origin';
import { handleZodError } from '@/common/utils/handle-zod-error/handle-zod-error';
import { WorkflowDefinitionByIdSchema } from '@/domains/workflow-definitions/fetchers';
import { AmlSchema } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import { ObjectWithIdSchema } from '@/lib/zod/utils/object-with-id/object-with-id';
import { zPropertyKey } from '@/lib/zod/utils/z-property-key/z-property-key';
import { CollectionFlowStatusesEnum, CollectionFlowStepStatesEnum } from '@ballerine/common';
import qs from 'qs';
import { deepCamelKeys } from 'string-ts';
import { z } from 'zod';
import { IWorkflowId } from './interfaces';

export const updateContextAndSyncEntity = async ({
  workflowId,
  data,
}: {
  workflowId: string;
  data: Partial<TWorkflowById['context']>;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `../external/workflows/${workflowId}/sync-entity`,
    method: Method.PATCH,
    body: data,
    schema: z.undefined(),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflows = async (params: {
  filterId: string;
  orderBy: string;
  page: {
    number: number;
    size: number;
  };
  filter: Record<string, unknown>;
}) => {
  const queryParams = qs.stringify(params, { encode: false });

  const [workflows, error] = await apiClient({
    endpoint: `workflows?${queryParams}`,
    method: Method.GET,
    schema: z.object({
      data: z.array(
        z.object({
          id: z.string(),
          status: z.string(),
          createdAt: z.string().datetime(),
          entity: ObjectWithIdSchema.extend({
            name: z.string(),
            avatarUrl: z.string().nullable().optional(),
            approvalState: z.enum(States),
          }),
          assignee: ObjectWithIdSchema.extend({
            firstName: z.string(),
            lastName: z.string(),
            avatarUrl: z.string().nullable().optional(),
          }).nullable(),
          tags: z.array(z.string()).nullable().optional(),
        }),
      ),
      meta: z.object({
        totalItems: z.number().nonnegative(),
        totalPages: z.number().nonnegative(),
      }),
    }),
  });

  return handleZodError(error, workflows);
};

export const BaseWorkflowByIdSchema = z.object({
  id: z.string(),
  assigneeId: z.string().nullable().optional(),
  status: z.string(),
  state: z.string().nullable(),
  nextEvents: z.array(z.any()),
  tags: z.array(z.string()).nullable().optional(),
  workflowDefinition: WorkflowDefinitionByIdSchema,
  createdAt: z.string().datetime(),
  context: z.object({
    aml: AmlSchema.extend({
      vendor: z.string().optional(),
    }).optional(),
    documents: z.array(z.record(zPropertyKey, z.any())).default([]),
    entity: z.record(z.any(), z.any()),
    parentMachine: ObjectWithIdSchema.extend({
      status: z.union([z.literal('active'), z.literal('failed'), z.literal('completed')]),
    }).optional(),
    pluginsOutput: z
      .object({
        ubo: z
          .object({
            data: z
              .object({
                // nodes: z.array(
                //   z.object({
                //     id: z.string(),
                //     data: z.object({
                //       name: z.string(),
                //       type: z.string(),
                //       sharePercentage: z.number().optional(),
                //     }),
                //   }),
                // ),
                // edges: z.array(
                //   z.object({
                //     id: z.string(),
                //     source: z.string(),
                //     target: z.string(),
                //     data: z.object({
                //       sharePercentage: z.number().optional(),
                //     }),
                //   }),
                // ),
              })
              .passthrough()
              .optional(),
            message: z.string().optional(),
            isRequestTimedOut: z.boolean().optional(),
          })
          .passthrough()
          .optional(),
        merchantMonitoring: z
          .object({
            reportId: z.string().nullish(),
          })
          .passthrough()
          .nullish(),
      })
      .passthrough()
      .optional(),
    pluginsInput: z
      .object({
        merchantScreening: z
          .object({
            requestPayload: z.record(z.string(), z.unknown()).optional(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
    metadata: z
      .object({
        collectionFlowUrl: z.string().url().optional(),
        token: z.string().optional(),
      })
      .passthrough()
      .optional(),
    collectionFlow: z
      .object({
        config: z.object({
          apiUrl: z.string().url(),
        }),
        state: z.object({
          currentStep: z.string(),
          status: z.enum(Object.values(CollectionFlowStatusesEnum) as [string, ...string[]]),
          steps: z.array(
            z.object({
              stepName: z.string(),
              // TODO: Deprecate `isCompleted` and use `state` instead.
              isCompleted: z.boolean().optional(),
              state: z
                .enum(Object.values(CollectionFlowStepStatesEnum) as [string, ...string[]])
                .optional(),
              reason: z.string().optional(),
            }),
          ),
        }),
        additionalInformation: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
    customData: z.record(z.string(), z.unknown()).optional(),
  }),
  entity: ObjectWithIdSchema.extend({
    name: z.string(),
    avatarUrl: z.string().nullable().optional(),
    approvalState: z.enum(States),
  }),
  assignee: ObjectWithIdSchema.extend({
    firstName: z.string(),
    lastName: z.string(),
    avatarUrl: z.string().nullable().optional(),
  }).nullable(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const WorkflowByIdSchema = BaseWorkflowByIdSchema.extend({
  childWorkflows: z
    .array(
      BaseWorkflowByIdSchema.omit({
        context: true,
      }).extend({
        context: BaseWorkflowByIdSchema.shape.context.omit({
          collectionFlow: true,
        }),
      }),
    )
    .optional(),
});

export type TWorkflowById = z.output<typeof WorkflowByIdSchema>;

export const fetchWorkflowById = async ({
  workflowId,
  filterId,
}: {
  workflowId: string;
  filterId: string;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}?filterId=${filterId}`,
    method: Method.GET,
    schema: WorkflowByIdSchema.transform(data => ({
      ...data,
      context: {
        ...data.context,
        pluginsOutput: {
          ...data.context?.pluginsOutput,
          // TODO: Upgrade workflows-service TypeScript version to >= 5 and use `string-ts`'s `deepCamelCase` instead on the server side in `formatWorkflow`.
          // Currently, `nest-access-control` v2.2.0 is incompatible with TypeScript >= 5.
          website_monitoring: {
            ...data.context?.pluginsOutput?.website_monitoring,
            data: deepCamelKeys(data.context?.pluginsOutput?.website_monitoring?.data ?? {}),
          },
        },
      },
    })).transform(() => ({
      id: 'cm7thumym031rs40k00gmt64v',
      tags: ['manual_review'],
      state: 'manual_review',
      config: {
        example: true,
      },
      status: 'active',
      context: {
        id: 'e7869864213',
        data: {
          companyName: 'GreenTech Solutions Ltd.',
          additionalInfo: {
            mainRepresentative: {
              email: 'david+98429862f@ballerine.com',
              lastName: 'guy',
              firstName: 'david',
            },
          },
        },
        type: 'business',
        state: 'business_address_information',
        entity: {
          id: 'e7869864213',
          data: {
            country: 'UK',
            companyName: 'GreenTech Solutions Ltd.',
            businessType: 'Local Company - PRIVATE LIMITED COMPANY',
            additionalInfo: {
              bank: {
                name: 'Tech Bank',
                country: 'UK',
                holderName: 'GreenTech Solutions Ltd.',
                accountNumber: '74231865',
              },
              ubos: [
                {
                  email: 'nitzan+98429862f@ballerine.com',
                  lastName: 'guy',
                  firstName: 'david',
                  additionalInfo: {
                    role: 'CEO',
                    companyName: 'GreenTech Solutions Ltd.',
                    dateOfBirth: '1990-01-01T22:00:00.000Z',
                    __isGeneratedAutomatically: true,
                  },
                },
              ],
              store: {
                dba: 'GreenTech Solutions',
                website: {
                  mainWebsite: 'https://green-tech-solutions.com',
                  contactDetails: '17 Frishman St, London, UK',
                  productQuantity: 100,
                  websiteLanguage: 'english',
                  productDescription: 'We offer eco conscious products',
                  averageProductPrice: '$25',
                },
                industry: 'eco consulting',
                products: 'Eco-friendly products',
                established: '2023-08-31T21:00:00.000Z',
                websiteUrls: 'https://green-tech-solutions.com',
                hasMobileApp: false,
                hasActiveWebsite: true,
                processingDetails: {
                  mainCategory: 'B2C',
                  businessModel: 'Direct Purchase',
                  monthlySalesVolume: '$5000000',
                  averageTicketAmount: '$25',
                  monthlyTransactions: '$500',
                },
              },
              industry: 'Information Technology',
              directors: [
                {
                  email: 'kian.mueller@green-tech-solutions.com',
                  lastName: 'Mueller',
                  firstName: 'Kian',
                  nationalId: '9204469328432',
                  additionalInfo: {
                    documents: [
                      {
                        id: 'directors:passport-document-[index:0]',
                        type: 'passport',
                        pages: [
                          {
                            uri: 'https://cdn.ballerine.io/merch-ss/canada%20license%20front.png',
                            type: 'jpg',
                            metadata: {
                              side: 'front',
                            },
                            provider: 'http',
                            ballerineFileId: 'cm7thumxp030ts40k12juxe1y',
                          },
                        ],
                        issuer: {
                          country: 'ZZ',
                        },
                        version: '1',
                        category: 'proof_of_identity',
                        decision: {},
                        properties: {
                          idNumber: '1234567890',
                          validFrom: '2024-01-01',
                          expiryDate: '2025-01-01',
                          validUntil: '2025-01-01',
                        },
                        issuingVersion: 1,
                        propertiesSchema: {
                          type: 'object',
                          properties: {
                            lastName: {
                              type: 'string',
                            },
                            firstName: {
                              type: 'string',
                            },
                            documentNumber: {
                              type: 'string',
                            },
                          },
                        },
                      },
                      {
                        id: 'directors:passport-selfie-[index:0]',
                        type: 'selfie',
                        pages: [
                          {
                            uri: 'https://cdn.ballerine.io/merch-ss/Armenia_selfie.png',
                            type: 'jpg',
                            metadata: {
                              side: 'face',
                            },
                            provider: 'http',
                            ballerineFileId: 'cm7thumxs030vs40kw7h47dyw',
                          },
                        ],
                        issuer: {
                          country: 'ZZ',
                        },
                        version: '1',
                        category: 'proof_of_identity_ownership',
                        decision: {},
                        properties: {
                          idNumber: '1234567890',
                          validFrom: '2024-01-01',
                          expiryDate: '2025-01-01',
                          validUntil: '2025-01-01',
                        },
                        issuingVersion: 1,
                        propertiesSchema: {
                          type: 'object',
                          properties: {
                            lastName: {
                              type: 'string',
                            },
                            firstName: {
                              type: 'string',
                            },
                            documentNumber: {
                              type: 'string',
                            },
                          },
                        },
                      },
                    ],
                    companyName: 'Powlowski - Nolan',
                    fullAddress: '71949 Greenville Road Apt. 192',
                    nationality: 'IO',
                    customerCompany: 'ClipsPay',
                    __isGeneratedAutomatically: true,
                  },
                },
              ],
              annualVolume: 1000000,
              headquarters: {
                city: 'London',
                street: 'Tech Street',
                country: 'UK',
                postalCode: 'SW1A 1AA',
                streetNumber: 1,
              },
              businessModel: 'Software Development',
              imShareholder: true,
              openCorporate: {
                vat: 'GB123456789',
                name: 'Tech Solutions Ltd',
                companyType: 'Local Company - PRIVATE LIMITED COMPANY',
                companyNumber: '12345678',
                currentStatus: 'Live Company',
                jurisdictionCode: 'uk',
                incorporationDate: '2010-01-01',
              },
              companyWebsite: 'www.techsolutions.com',
              transactionValue: 10000,
              mainRepresentative: {
                email: 'nitzan+98429862f@ballerine.com',
                lastName: 'guy',
                firstName: 'nitzan',
                ballerineEntityId: 'cm2llwsm60005xl306njsjh0e',
              },
              associatedCompanies: [
                {
                  country: 'USA',
                  companyName: 'Tech Innovations Ltd',
                  additionalInfo: {
                    headquarters: {
                      city: 'San Francisco',
                      state: 'CA',
                      postalCode: '94043',
                      streetAddress: '123 Innovation Drive',
                    },
                    mainRepresentative: {
                      email: 'john.doe@techinnovations.com',
                      lastName: 'Doe',
                      firstName: 'John',
                    },
                    associationRelationship: 'Member',
                  },
                  registrationNumber: 'TI123456',
                },
                {
                  country: 'Canada',
                  companyName: 'Green Solutions Inc',
                  additionalInfo: {
                    headquarters: {
                      city: 'Vancouver',
                      province: 'BC',
                      postalCode: 'V5K 0A1',
                      streetAddress: '789 Eco Lane',
                    },
                    mainRepresentative: {
                      email: 'lisa.white@greensolutions.com',
                      lastName: 'White',
                      firstName: 'Lisa',
                    },
                    associationRelationship: 'Partner',
                  },
                  registrationNumber: 'GS789101',
                },
                {
                  country: 'UK',
                  companyName: 'Global Tech Ventures',
                  additionalInfo: {
                    headquarters: {
                      city: 'London',
                      postalCode: 'EC1A 1BB',
                      streetAddress: '101 Tech Park',
                    },
                    mainRepresentative: {
                      email: 'mark.brown@globaltechventures.com',
                      lastName: 'Brown',
                      firstName: 'Mark',
                    },
                    associationRelationship: 'Affiliate',
                  },
                  registrationNumber: 'GT112233',
                },
              ],
              dateOfEstablishment: '2010-01-01T22:00:00.000Z',
            },
            numberOfEmployees: 50,
            registrationNumber: '12345678',
            taxIdentificationNumber: 'GB123456789',
          },
          type: 'business',
          ballerineEntityId: 'cm2llwsez0001xl30hj6vv49w',
        },
        metadata: {
          token: 'dd228d09-6e3f-4471-a4b4-14845fe83c8e',
          customerId: 'ballerinedemo_ongoing_monitoring',
          customerName: 'Ballerine Demo',
          collectionFlowUrl: 'https://collection-dev.ballerine.io',
          customerNormalizedName: 'ballerinedemo_ongoing_monitoring',
        },
        documents: [
          {
            id: 'document-proof-of-address',
            type: 'water_bill',
            pages: [
              {
                uri: 'https://cdn.ballerine.io/merch-ss/utility%20bill2.jpeg',
                type: 'jpg',
                provider: 'http',
                ballerineFileId: 'cm7thumxt030xs40k9sa7xf0f',
              },
            ],
            issuer: {
              country: 'GH',
            },
            version: '1',
            category: 'proof_of_address',
            decision: {},
            properties: {},
            issuingVersion: 1,
            propertiesSchema: {
              type: 'object',
              properties: {
                nationalIdNumber: {
                  type: 'string',
                  pattern: '^$|^GHA-\\d{9}-\\d{1}$',
                },
                docNumber: {
                  type: 'string',
                  pattern: '^[a-zA-Z0-9]*$',
                },
                userAddress: {
                  type: 'string',
                },
                physicalAddress: {
                  type: 'string',
                },
                amountDue: {
                  type: 'number',
                },
                issuingDate: {
                  type: 'string',
                  format: 'date',
                },
              },
            },
          },
          {
            id: 'document-certificate-of-registration',
            type: 'bank_statement',
            pages: [
              {
                uri: 'https://cdn.ballerine.io/merch-ss/Bank%20Statement3.jpeg',
                type: 'jpg',
                provider: 'http',
                ballerineFileId: 'cm7thumxv030zs40k2h3yrmdq',
              },
            ],
            issuer: {
              country: 'GH',
            },
            version: '1',
            category: 'business_document',
            decision: {},
            properties: {},
            issuingVersion: 1,
            propertiesSchema: {
              type: 'object',
              properties: {
                issuer: {
                  type: 'string',
                  enum: [
                    'Absa Bank Ghana Limited',
                    'Access Bank Ghana Plc',
                    'Agricultural Development Bank of Ghana',
                    'Bank of Africa Ghana Limited',
                    'CalBank Limited',
                    'Consolidated Bank Ghana Limited',
                    'Ecobank Ghana Limited',
                    'FBN Bank Ghana Limited',
                    'Fidelity Bank Ghana Limited',
                    'First Atlantic Bank Limited',
                    'First National Bank Ghana',
                    'GCB Bank Limited',
                    'Guaranty Trust Bank Ghana Limited',
                    'National Investment Bank Limited',
                    'OmniBSIC Bank Ghana Limited',
                    'Prudential Bank Limited',
                    'Republic Bank Ghana',
                    'Societe Generale Ghana Limited',
                    'Stanbic Bank Ghana Limited',
                    'Standard Chartered Bank Ghana Limited',
                    'United Bank for Africa Ghana Limited',
                    'Universal Merchant Bank',
                    'Zenith Bank Ghana Limited',
                  ],
                  dropdownOptions: [
                    {
                      value: 'Absa Bank Ghana Limited',
                      label: 'Absa Bank Ghana Limited',
                    },
                    {
                      value: 'Access Bank Ghana Plc',
                      label: 'Access Bank Ghana Plc',
                    },
                    {
                      value: 'Agricultural Development Bank of Ghana',
                      label: 'Agricultural Development Bank of Ghana',
                    },
                    {
                      value: 'Bank of Africa Ghana Limited',
                      label: 'Bank of Africa Ghana Limited',
                    },
                    {
                      value: 'CalBank Limited',
                      label: 'CalBank Limited',
                    },
                    {
                      value: 'Consolidated Bank Ghana Limited',
                      label: 'Consolidated Bank Ghana Limited',
                    },
                    {
                      value: 'Ecobank Ghana Limited',
                      label: 'Ecobank Ghana Limited',
                    },
                    {
                      value: 'FBN Bank Ghana Limited',
                      label: 'FBN Bank Ghana Limited',
                    },
                    {
                      value: 'Fidelity Bank Ghana Limited',
                      label: 'Fidelity Bank Ghana Limited',
                    },
                    {
                      value: 'First Atlantic Bank Limited',
                      label: 'First Atlantic Bank Limited',
                    },
                    {
                      value: 'First National Bank Ghana',
                      label: 'First National Bank Ghana',
                    },
                    {
                      value: 'GCB Bank Limited',
                      label: 'GCB Bank Limited',
                    },
                    {
                      value: 'Guaranty Trust Bank Ghana Limited',
                      label: 'Guaranty Trust Bank Ghana Limited',
                    },
                    {
                      value: 'National Investment Bank Limited',
                      label: 'National Investment Bank Limited',
                    },
                    {
                      value: 'OmniBSIC Bank Ghana Limited',
                      label: 'OmniBSIC Bank Ghana Limited',
                    },
                    {
                      value: 'Prudential Bank Limited',
                      label: 'Prudential Bank Limited',
                    },
                    {
                      value: 'Republic Bank Ghana',
                      label: 'Republic Bank Ghana',
                    },
                    {
                      value: 'Societe Generale Ghana Limited',
                      label: 'Societe Generale Ghana Limited',
                    },
                    {
                      value: 'Stanbic Bank Ghana Limited',
                      label: 'Stanbic Bank Ghana Limited',
                    },
                    {
                      value: 'Standard Chartered Bank Ghana Limited',
                      label: 'Standard Chartered Bank Ghana Limited',
                    },
                    {
                      value: 'United Bank for Africa Ghana Limited',
                      label: 'United Bank for Africa Ghana Limited',
                    },
                    {
                      value: 'Universal Merchant Bank',
                      label: 'Universal Merchant Bank',
                    },
                    {
                      value: 'Zenith Bank Ghana Limited',
                      label: 'Zenith Bank Ghana Limited',
                    },
                  ],
                },
                printDate: {
                  format: 'date-time',
                  type: 'string',
                },
                accountHolderName: {
                  minLength: 1,
                  type: 'string',
                },
                from: {
                  format: 'date',
                  type: 'string',
                },
                to: {
                  format: 'date',
                  type: 'string',
                },
                accountNumber: {
                  type: 'string',
                },
              },
              required: ['issuer', 'printDate', 'accountHolderName', 'from', 'to'],
            },
          },
          {
            id: 'document-proof-of-address',
            type: 'certificate_of_incorporation',
            pages: [
              {
                uri: 'https://cdn.ballerine.io/merch-ss/COI1.jpeg',
                type: 'jpg',
                provider: 'http',
                ballerineFileId: 'cm7thumxw0311s40kfwrj14qt',
              },
            ],
            issuer: {
              country: 'ZZ',
            },
            version: '1',
            category: 'proof_of_registration',
            decision: {},
            properties: {
              amountDue: 2500.75,
              docNumber: 'A987654321',
              issuingDate: '2024-09-30',
              userAddress: '15 Tech Avenue, Accra, Ghana',
              physicalAddress: 'Unit 5, Innovation Park, Accra, Ghana',
              nationalIdNumber: 'GHA-123456789-0',
            },
            issuingVersion: 1,
            propertiesSchema: {
              type: 'object',
              properties: {
                businessName: {
                  type: 'string',
                },
                registrationNumber: {
                  pattern: '^[a-zA-Z0-9]*$',
                  type: 'string',
                },
                issueDate: {
                  format: 'date',
                  formatMaximum: '2025-04-03',
                  type: 'string',
                },
              },
            },
          },
        ],
        customData: {
          accountAge: '4 years',
          creditScore: 720,
          InternalNotes: 'Customer has shown improved compliance practices over the last quarter.',
          loginIpAddress: '192.168.1.1',
          escalationCount: 1,
          outstandingLoans: '150K USD',
          cashFlowStability: 'Moderate',
          internalRiskScore: 68,
          lastScreeningDate: '2024-04-20',
          profitabilityTrend: 'Increasing',
          lastInteractionDate: '2024-05-15',
          previousAlertsCount: 5,
          supportTicketsCount: 4,
          paymentReliabilityScore: 85,
          largestTransactionAmount: '45K USD',
          highRiskTransactionsCount: 3,
          enhancedDueDiligenceRequired: true,
          internationalTransactionsRatio: 0.35,
          averageMonthlyTransactionVolume: '250K USD',
        },
        customerName: 'GreenTech Solutions Ltd.',
        pluginsOutput: {
          ubo: {
            code: 200,
            data: {
              edges: [
                {
                  id: 'GreenTechSolutions->JohnathanReed',
                  data: {
                    sharePercentage: 30,
                  },
                  source: 'GreenTechSolutions',
                  target: 'JohnathanReed',
                },
                {
                  id: 'GreenTechSolutions->RobertCarter',
                  data: {
                    sharePercentage: 30,
                  },
                  source: 'GreenTechSolutions',
                  target: 'RobertCarter',
                },
                {
                  id: 'GreenTechSolutions->CaymanHoldings',
                  data: {
                    sharePercentage: 40,
                  },
                  source: 'GreenTechSolutions',
                  target: 'CaymanHoldings',
                },
                {
                  id: 'CaymanHoldings->CarltonEllingtonCushnie',
                  data: {
                    sharePercentage: 100,
                  },
                  source: 'CaymanHoldings',
                  target: 'CarltonEllingtonCushnie',
                },
              ],
              nodes: [
                {
                  id: 'GreenTechSolutions',
                  data: {
                    name: 'GreenTech Solutions Ltd',
                    type: 'COMPANY',
                  },
                },
                {
                  id: 'JohnathanReed',
                  data: {
                    name: 'Johnathan Reed',
                    type: 'PERSON',
                  },
                },
                {
                  id: 'RobertCarter',
                  data: {
                    name: 'Robert Carter',
                    type: 'PERSON',
                  },
                },
                {
                  id: 'CaymanHoldings',
                  data: {
                    name: 'Cayman Holdings Ltd.',
                    type: 'COMPANY',
                  },
                },
                {
                  id: 'CarltonEllingtonCushnie',
                  data: {
                    name: 'Carlton Ellington Cushnie',
                    type: 'PERSON',
                  },
                },
              ],
            },
            name: 'ubo',
            status: 'SUCCESS',
            orderId: 'ubo202410231626591961979300',
            invokedAt: 1729672019867,
          },
          invitation: {},
          riskEvaluation: {
            success: true,
            riskScore: 80,
            rulesResults: [
              {
                id: 'store-info-content-violations',
                domain: 'Website Analysis',
                result: [
                  {
                    rule: {
                      key: 'pluginsOutput.merchantMonitoring.data.lineOfBusiness.riskIndicators.length',
                      value: 0,
                      operator: 'NOT_EQUALS',
                    },
                    status: 'PASSED',
                  },
                ],
                ruleSet: {
                  rules: [
                    {
                      key: 'pluginsOutput.merchantMonitoring.data.lineOfBusiness.riskIndicators.length',
                      value: 0,
                      operator: 'NOT_EQUALS',
                    },
                  ],
                  operator: 'and',
                },
                indicator: 'Website has content violations',
                maxRiskScore: 98,
                minRiskScore: 60,
                baseRiskScore: 70,
                additionalRiskScore: 8,
              },
              {
                id: 'store-info-forbidden-mcc-provided-by-user',
                domain: 'Store Info',
                result: [
                  {
                    rule: {
                      key: 'entity.data.additionalInfo.mcc',
                      value: [
                        '5932',
                        '5399',
                        '5931',
                        '5533',
                        '7392',
                        '5499',
                        '8398',
                        '5972',
                        '7273',
                        '7995',
                        '5818',
                        '7922',
                        '8999',
                        '6211',
                        '4722',
                        '7399',
                        '5499',
                        '5999',
                        '5912',
                        '5122',
                        '6513',
                        '5941',
                        '7929',
                      ],
                      operator: 'IN',
                    },
                    status: 'PASSED',
                  },
                ],
                ruleSet: {
                  rules: [
                    {
                      key: 'entity.data.additionalInfo.mcc',
                      value: [
                        '5932',
                        '5399',
                        '5931',
                        '5533',
                        '7392',
                        '5499',
                        '8398',
                        '5972',
                        '7273',
                        '7995',
                        '5818',
                        '7922',
                        '8999',
                        '6211',
                        '4722',
                        '7399',
                        '5499',
                        '5999',
                        '5912',
                        '5122',
                        '6513',
                        '5941',
                        '7929',
                      ],
                      operator: 'IN',
                    },
                  ],
                  operator: 'and',
                },
                indicator: 'Forbidden MCC provided',
                maxRiskScore: 98,
                minRiskScore: 60,
                baseRiskScore: 70,
                additionalRiskScore: 8,
              },
              {
                id: 'store-info-website-compliance',
                domain: 'Website Analysis',
                result: [
                  {
                    rule: {
                      key: 'pluginsOutput.merchantMonitoring.data.transactionLaundering.websiteStructureEvaluation.indicators.length',
                      value: 0,
                      operator: 'NOT_EQUALS',
                    },
                    status: 'PASSED',
                  },
                ],
                ruleSet: {
                  rules: [
                    {
                      key: 'pluginsOutput.merchantMonitoring.data.transactionLaundering.websiteStructureEvaluation.indicators.length',
                      value: 0,
                      operator: 'NOT_EQUALS',
                    },
                  ],
                  operator: 'and',
                },
                indicator: 'Website missing policy pages',
                maxRiskScore: 98,
                minRiskScore: 60,
                baseRiskScore: 60,
                additionalRiskScore: 8,
              },
              {
                id: 'store-info-high-risk-sector',
                domain: 'Store Info',
                result: [
                  {
                    rule: {
                      key: 'entity.data.additionalInfo.industry',
                      value: [
                        'Antiques dealer',
                        'Miscellaneous General Merchandise Stores (Ecom & Retail)',
                        'Online marketplaces',
                        'Automotive Parts, Accessories Stores',
                        'Consulting, Management, and Public Relations Services',
                        'CBD based products',
                        'Organizations, Charitable and Social Service',
                        'Stamp and Coin Stores: Philatelic and Numismatic Supplies',
                        'Dating',
                        'Gaming',
                        'Online retail',
                        'Events selling tickets',
                        'Bands, Orchestras, and Miscellaneous Entertainers (not elsewhere classified)',
                        'Professional Services',
                        'Binary Options',
                        'Travel and Tour',
                        'Business Services',
                        'Miscellaneous Food Stores / Food Supplements',
                        'Miscellaneous And Specialty Retail Stores',
                        'Pharma',
                        'Drugstores and Druggists',
                        'Real Estate Agents and Managers - Rentals',
                        'Sporting Goods Stores',
                      ],
                      operator: 'IN',
                    },
                    status: 'PASSED',
                  },
                ],
                ruleSet: {
                  rules: [
                    {
                      key: 'entity.data.additionalInfo.industry',
                      value: [
                        'Antiques dealer',
                        'Miscellaneous General Merchandise Stores (Ecom & Retail)',
                        'Online marketplaces',
                        'Automotive Parts, Accessories Stores',
                        'Consulting, Management, and Public Relations Services',
                        'CBD based products',
                        'Organizations, Charitable and Social Service',
                        'Stamp and Coin Stores: Philatelic and Numismatic Supplies',
                        'Dating',
                        'Gaming',
                        'Online retail',
                        'Events selling tickets',
                        'Bands, Orchestras, and Miscellaneous Entertainers (not elsewhere classified)',
                        'Professional Services',
                        'Binary Options',
                        'Travel and Tour',
                        'Business Services',
                        'Miscellaneous Food Stores / Food Supplements',
                        'Miscellaneous And Specialty Retail Stores',
                        'Pharma',
                        'Drugstores and Druggists',
                        'Real Estate Agents and Managers - Rentals',
                        'Sporting Goods Stores',
                      ],
                      operator: 'IN',
                    },
                  ],
                  operator: 'and',
                },
                indicator: 'High risk sector',
                maxRiskScore: 98,
                minRiskScore: 60,
                baseRiskScore: 60,
                additionalRiskScore: 8,
              },
              {
                id: 'comp-info-high-risk-country',
                domain: 'Company Information',
                result: [
                  {
                    rule: {
                      key: 'entity.data.address.country',
                      value: [
                        'AF',
                        'AL',
                        'DZ',
                        'AO',
                        'BS',
                        'BB',
                        'BZ',
                        'BJ',
                        'BA',
                        'BW',
                        'BF',
                        'MM',
                        'BI',
                        'KH',
                        'CM',
                        'CF',
                        'TD',
                        'KM',
                        'CD',
                        'CG',
                        'CI',
                        'CU',
                        'DJ',
                        'DM',
                        'EC',
                        'GQ',
                        'ER',
                        'FJ',
                        'GA',
                        'GH',
                        'GN',
                        'GW',
                        'HT',
                        'IR',
                        'IQ',
                        'JM',
                        'KE',
                        'LA',
                        'LB',
                        'LR',
                        'LY',
                        'MG',
                        'MW',
                        'ML',
                        'MT',
                        'MR',
                        'MU',
                        'MD',
                        'MN',
                        'MA',
                        'MZ',
                        'NA',
                        'NP',
                        'NI',
                        'NE',
                        'NG',
                        'KP',
                        'PK',
                        'PA',
                        'PG',
                        'PY',
                        'PH',
                        'RU',
                        'RW',
                        'WS',
                        'SN',
                        'SL',
                        'SB',
                        'SO',
                        'SS',
                        'SD',
                        'SY',
                        'TZ',
                        'TG',
                        'TT',
                        'TN',
                        'UG',
                        'UA',
                        'VU',
                        'VE',
                        'YE',
                        'ZM',
                        'ZW',
                      ],
                      operator: 'IN',
                    },
                    status: 'PASSED',
                  },
                ],
                ruleSet: {
                  rules: [
                    {
                      key: 'entity.data.address.country',
                      value: [
                        'AF',
                        'AL',
                        'DZ',
                        'AO',
                        'BS',
                        'BB',
                        'BZ',
                        'BJ',
                        'BA',
                        'BW',
                        'BF',
                        'MM',
                        'BI',
                        'KH',
                        'CM',
                        'CF',
                        'TD',
                        'KM',
                        'CD',
                        'CG',
                        'CI',
                        'CU',
                        'DJ',
                        'DM',
                        'EC',
                        'GQ',
                        'ER',
                        'FJ',
                        'GA',
                        'GH',
                        'GN',
                        'GW',
                        'HT',
                        'IR',
                        'IQ',
                        'JM',
                        'KE',
                        'LA',
                        'LB',
                        'LR',
                        'LY',
                        'MG',
                        'MW',
                        'ML',
                        'MT',
                        'MR',
                        'MU',
                        'MD',
                        'MN',
                        'MA',
                        'MZ',
                        'NA',
                        'NP',
                        'NI',
                        'NE',
                        'NG',
                        'KP',
                        'PK',
                        'PA',
                        'PG',
                        'PY',
                        'PH',
                        'RU',
                        'RW',
                        'WS',
                        'SN',
                        'SL',
                        'SB',
                        'SO',
                        'SS',
                        'SD',
                        'SY',
                        'TZ',
                        'TG',
                        'TT',
                        'TN',
                        'UG',
                        'UA',
                        'VU',
                        'VE',
                        'YE',
                        'ZM',
                        'ZW',
                      ],
                      operator: 'IN',
                    },
                  ],
                  operator: 'and',
                },
                indicator: 'Registered in high-risk country',
                maxRiskScore: 98,
                minRiskScore: 30,
                baseRiskScore: 60,
                additionalRiskScore: 10,
              },
            ],
            riskIndicatorsByDomain: {
              KYB: [
                {
                  name: 'Business Name Mismatch',
                  domain: 'KYB',
                },
                {
                  name: 'Undeclared UBOs',
                  domain: 'KYB',
                },
              ],
              KYC: [
                {
                  name: 'UBO has Adverse Media',
                  domain: 'KYC',
                },
              ],
              Store: [
                {
                  name: 'Line of Business Mismatch',
                  domain: 'Store',
                },
              ],
              'Web Presence': [
                {
                  name: 'Cryptocurrency',
                  domain: 'Web Presence',
                },
                {
                  name: 'Regulatory Compliance Risk',
                  domain: 'Web Presence',
                },
                {
                  name: 'Chargeback Fraud Risk',
                  domain: 'Web Presence',
                },
              ],
            },
          },
          companySanctions: {
            data: [
              {
                entity: {
                  name: 'Tech Solutions Ltd',
                  places: [
                    {
                      city: 'London',
                      type: 'Headquarters',
                      address: '1 Tech Street',
                      country: 'UK',
                      location: 'Central London',
                    },
                  ],
                  sources: [
                    {
                      url: 'https://news.techupdates.com/article-tech-solutions',
                      dates: ['2024-02-15', '2024-03-01'],
                      categories: ['financial report', 'compliance notice'],
                    },
                  ],
                  category: 'Information Technology',
                  countries: ['UK', 'Germany'],
                  enterDate: '2024-02-01',
                  categories: ['OFAC'],
                  identities: ['Legal', 'Financial'],
                  otherNames: [
                    {
                      name: 'GreenTech Solutions Ltd',
                      type: 'Former Name',
                    },
                  ],
                  generalInfo: {
                    website: 'https://green-tech-solutions.com',
                    nationality: 'British',
                    alternateTitle: 'GreenTech Solutions Global',
                    businessDescription: 'Eco-friendly products and services',
                  },
                  subcategory: 'Eco Consulting',
                  descriptions: [
                    {
                      description1: 'Leading provider of eco consulting solutions in Europe.',
                      description2: 'Specializes in eco-friendly products and services.',
                      description3: 'Known for high standards in sustainability and innovation.',
                    },
                  ],
                  lastReviewed: '2024-10-31',
                  officialLists: [
                    {
                      keyword: 'Sanctioned',
                      isCurrent: 'true',
                      description:
                        'OFAC - Specially Designated Nationals and Blocked Persons List (SDN List)',
                    },
                  ],
                  additionalInfo: {
                    declaredMCC: '5111 – Stationery, Office Supplies, and Printing Paper',
                  },
                  linkedCompanies: [
                    {
                      name: 'GreenTech Solutions Ltd.',
                      categories: ['eco consulting'],
                      description: 'Subsidiary focusing on eco-friendly products',
                      subcategories: ['eco consulting'],
                    },
                  ],
                  primaryLocation: 'London, UK',
                  linkedIndividuals: [
                    {
                      lastName: 'Cushnie',
                      firstName: 'Carlton',
                      middleName: 'Ellington',
                      description: 'CEO and primary shareholder',
                      subcategories: ['eco consulting'],
                      otherCategories: ['leadership', 'ownership'],
                    },
                  ],
                  furtherInformation: [],
                  originalScriptNames: ['GreenTech Solutions Ltd'],
                },
                matchedFields: ['name'],
              },
            ],
            name: 'companySanctions',
            status: 'SUCCESS',
            invokedAt: 1729672019301,
          },
          merchantScreening: {
            raw: {
              TerminationInquiry: {
                Ref: 'https://sandbox.api.mastercard.com/fraud/merchant/v3/termination-inquiry/19962024090205928',
                PageOffset: 0,
                PossibleInquiryMatches: [
                  {
                    TotalLength: 1,
                    InquiredMerchant: [
                      {
                        Merchant: {
                          Name: 'Green-Tech Solutions Ltd',
                          Address: {
                            City: 'London',
                            Line1: '23 Tech Street',
                            Country: 'GBR',
                            PostalCode: 'SW1A 1AA',
                          },
                          Principal: [
                            {
                              Address: {
                                City: 'London',
                                Line1: '23 Tech Street',
                                Country: 'GBR',
                                PostalCode: 'SW1A 1AA',
                              },
                              LastName: 'Smith',
                              FirstName: 'John',
                              DriversLicense: {},
                            },
                          ],
                          AddedOnDate: '09/02/2024',
                          MerchantMatch: {
                            Name: 'M02',
                            Address: 'M01',
                            PhoneNumber: 'M00',
                            NationalTaxId: 'M00',
                            AltPhoneNumber: 'M00',
                            PrincipalMatch: [
                              {
                                Name: 'M02',
                                Address: 'M01',
                                NationalId: 'M00',
                                PhoneNumber: 'M00',
                                AltPhoneNumber: 'M00',
                                DriversLicense: 'M00',
                              },
                            ],
                            ServiceProvDBA: 'M00',
                            ServiceProvLegal: 'M00',
                            DoingBusinessAsName: 'M00',
                            CountrySubdivisionTaxId: 'M00',
                          },
                        },
                      },
                    ],
                  },
                ],
                PossibleMerchantMatches: [
                  {
                    TotalLength: 0,
                    TerminatedMerchant: [],
                  },
                ],
                TransactionReferenceNumber: '',
              },
            },
            name: 'merchantScreening',
            status: 'SUCCESS',
            vendor: 'mastercard',
            logoUrl: 'https://cdn.ballerine.io/logos/Mastercard%20logo.svg',
            invokedAt: 1725307701422,
            processed: {
              checkDate: '9/2/2024',
              inquiredMatchedMerchants: [
                {
                  raw: {
                    Merchant: {
                      Name: 'Green-Tech Solutions Ltd',
                      Address: {
                        City: 'London',
                        Line1: '23 Tech Street',
                        Country: 'GBR',
                        PostalCode: 'SW1A 1AA',
                      },
                      Principal: [
                        {
                          Address: {
                            City: 'London',
                            Line1: '23 Tech Street',
                            Country: 'GBR',
                            PostalCode: 'SW1A 1AA',
                          },
                          LastName: 'Smith',
                          FirstName: 'John',
                          DriversLicense: {},
                        },
                      ],
                      AddedOnDate: '09/02/2024',
                      MerchantMatch: {
                        Name: 'M02',
                        Address: 'M01',
                        PhoneNumber: 'M00',
                        NationalTaxId: 'M00',
                        AltPhoneNumber: 'M00',
                        PrincipalMatch: [
                          {
                            Name: 'M01',
                            Address: 'M01',
                            NationalId: 'M00',
                            PhoneNumber: 'M00',
                            AltPhoneNumber: 'M00',
                            DriversLicense: 'M00',
                          },
                        ],
                        ServiceProvDBA: 'M00',
                        ServiceProvLegal: 'M00',
                        DoingBusinessAsName: 'M00',
                        CountrySubdivisionTaxId: 'M00',
                      },
                    },
                  },
                  name: 'Green-Tech Solutions Ltd',
                  urls: [],
                  dateAdded: '09/02/2024',
                  principals: [
                    {
                      exactMatches: {
                        address: {
                          City: 'London',
                          Line1: '23 Tech Street',
                          Country: 'GBR',
                          PostalCode: 'SW1A 1AA',
                        },
                      },
                      partialMatches: {
                        name: 'Green-Tech Solutions Ltd',
                      },
                    },
                  ],
                  exactMatches: {
                    address: {
                      City: 'London',
                      Line1: '23 Tech Street',
                      Country: 'GBR',
                      PostalCode: 'SW1A 1AA',
                    },
                  },
                  partialMatches: {
                    name: 'Green Tech Solutions Ltd.',
                  },
                  exactMatchesAmount: 2,
                  partialMatchesAmount: 1,
                },
              ],
              terminatedMatchedMerchants: [],
            },
          },
          merchantMonitoring: {
            data: {
              summary: {
                summary:
                  "GreenTech Solutions Ltd's website has been assigned a risk score of 63, indicating moderate risk. This assessment is primarily due to significant structural deficiencies identified on the website, including the absence of critical pages such as Terms and Conditions, Privacy Policy, About Us, and Contact Us. These omissions suggest a lack of transparency and potential non-compliance with regulations, which are considerable risk factors for transaction laundering by indicating the possibility of a shell company set up for illicit activities. Despite these concerns, there is no evidence to classify the company as involved in fraudulent activities, and no violations were found in the social analysis and ads, company name analysis, or ecosystem analysis. The absence of product information or reputation data limits a comprehensive risk analysis, but the structural issues alone are sufficient to warrant a moderate risk rating.",
                website: {
                  url: 'https://www.green-tech-solutions.com/',
                },
                riskScore: 63,
                riskLevels: {
                  legalRisk: 'moderate',
                  chargebackRisk: 'moderate',
                  reputationRisk: 'moderate',
                  transactionLaunderingRisk: 'moderate',
                },
                creationDate: 1729672029079,
                recommendations: [],
                riskIndicatorsByDomain: {
                  tldViolations: [
                    {
                      id: 'website-structure-missing-terms-and-conditions-(t&c)',
                      name: 'Missing Terms and Conditions (T&C)',
                      domain: 'website structure',
                      reason: 'The website does not have a Terms And Conditions page',
                      pageUrl: '',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                      description: 'The website does not have a Terms and Conditions page',
                      pageContext: 'Terms And Conditions',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      fullViolation: {
                        id: 'website-structure-missing-terms-and-conditions-(t&c)',
                        name: 'Missing Terms and Conditions (T&C)',
                        domain: 'website structure',
                        riskLevel: 'moderate',
                        triggerOn:
                          'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                        minRiskScore: 40,
                        baseRiskScore: 40,
                        riskTypeLevels: {
                          legalRisk: 'moderate',
                          chargebackRisk: 'moderate',
                          reputationRisk: 'moderate',
                          transactionLaunderingRisk: 'moderate',
                        },
                        recommendations: [],
                        additionRiskScore: 1,
                        maxRiskScoreForAddition: 98,
                      },
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    {
                      id: 'website-structure-missing-privacy-policy',
                      name: 'Missing Privacy Policy',
                      domain: 'website structure',
                      reason: 'The website does not have a Privacy Policy page',
                      pageUrl: '',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                      description: 'The website does not have a Privacy Policy page',
                      pageContext: 'Privacy Policy',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      fullViolation: {
                        id: 'website-structure-missing-privacy-policy',
                        name: 'Missing Privacy Policy',
                        domain: 'website structure',
                        riskLevel: 'moderate',
                        triggerOn:
                          'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                        minRiskScore: 40,
                        baseRiskScore: 40,
                        riskTypeLevels: {
                          legalRisk: 'moderate',
                          chargebackRisk: 'moderate',
                          reputationRisk: 'moderate',
                          transactionLaunderingRisk: 'moderate',
                        },
                        recommendations: [],
                        additionRiskScore: 1,
                        maxRiskScoreForAddition: 98,
                      },
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    {
                      id: 'website-structure-missing-about-us',
                      name: 'Missing About Us',
                      domain: 'website structure',
                      reason: 'The website does not have an About Us page',
                      pageUrl: '',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website does not have an about us page or offer general information surrounding the business',
                      description: 'The website does not have an About Us page',
                      pageContext: 'About Us',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      fullViolation: {
                        id: 'website-structure-missing-about-us',
                        name: 'Missing About Us',
                        domain: 'website structure',
                        riskLevel: 'moderate',
                        triggerOn:
                          'Alert this when the website does not have an about us page or offer general information surrounding the business',
                        minRiskScore: 40,
                        baseRiskScore: 40,
                        riskTypeLevels: {
                          legalRisk: 'moderate',
                          chargebackRisk: 'moderate',
                          reputationRisk: 'moderate',
                          transactionLaunderingRisk: 'moderate',
                        },
                        recommendations: [],
                        additionRiskScore: 1,
                        maxRiskScoreForAddition: 98,
                      },
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    {
                      id: 'website-structure-missing-contact-us',
                      name: 'Missing Contact Us',
                      domain: 'website structure',
                      reason: 'The website does not have a Contact Us page',
                      pageUrl: '',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                      description: 'The website does not have a Contact Us page',
                      pageContext: 'Contact Us',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      fullViolation: {
                        id: 'website-structure-missing-contact-us',
                        name: 'Missing Contact Us',
                        domain: 'website structure',
                        riskLevel: 'moderate',
                        triggerOn:
                          'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                        minRiskScore: 40,
                        baseRiskScore: 40,
                        riskTypeLevels: {
                          legalRisk: 'moderate',
                          chargebackRisk: 'moderate',
                          reputationRisk: 'moderate',
                          transactionLaunderingRisk: 'moderate',
                        },
                        recommendations: [],
                        additionRiskScore: 1,
                        maxRiskScoreForAddition: 98,
                      },
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                  ],
                  ecosystemViolations: [],
                  companyNameViolations: [],
                  adsAndSocialViolations: [],
                  lineOfBusinessViolations: [],
                },
              },
              ecosystem: {
                domains: [],
                website: {
                  url: 'https://www.thusrdayboots.com/',
                },
              },
              socialMedia: {
                ads: null,
                website: {
                  url: 'https://www.thusrdayboots.com/',
                },
                pickedAds: [],
                relatedAds: {
                  summary:
                    "No advertisements related to the merchant's social media presence were provided for assessment. Therefore, no content summary can be generated, and no potential risks can be identified from social media advertisements.",
                  violations: [],
                },
                facebookData: {
                  id: null,
                  name: null,
                  email: null,
                  address: null,
                  pageUrl: null,
                  pageName: null,
                  likesCount: null,
                  phoneNumber: null,
                  creationDate: null,
                  numberOfLikes: null,
                  screenshotUrl: null,
                  pageCategories: null,
                  facebookAdsLink: null,
                  facebookAboutUsLink: null,
                },
                instagramData: {
                  id: null,
                  pageUrl: null,
                  pageName: null,
                  username: null,
                  biography: null,
                  isVerified: null,
                  postsCount: null,
                  followsCount: null,
                  screenshotUrl: null,
                  pageCategories: null,
                  isBusinessAccount: null,
                  numberOfFollowers: null,
                },
                socialRawData: {},
                riskIndicators: [],
              },
              lineOfBusiness: {
                mcc: null,
                website: {
                  url: 'https://www.thusrdayboots.com/',
                },
                mccProvided: null,
                formattedMcc: null,
                lobDescription: 'Custom software solutions provider.',
                riskIndicators: [],
              },
              homepageScreenshot: null,
              transactionLaundering: {
                website: {
                  url: 'https://www.thusrdayboots.com/',
                },
                reputation: null,
                scamOrFraud: {
                  summary:
                    'No definitive evidence was found to classify thusrdayboots.com as a scam or involved in fraudulent activities.',
                  blacklist: false,
                  indicators: [],
                },
                riskIndicators: [
                  {
                    id: 'website-structure-missing-terms-and-conditions-(t&c)',
                    name: 'Missing Terms and Conditions (T&C)',
                    domain: 'website structure',
                    reason: 'The website does not have a Terms And Conditions page',
                    pageUrl: '',
                    riskLevel: 'moderate',
                    triggerOn:
                      'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                    description: 'The website does not have a Terms and Conditions page',
                    pageContext: 'Terms And Conditions',
                    minRiskScore: 40,
                    baseRiskScore: 40,
                    fullViolation: {
                      id: 'website-structure-missing-terms-and-conditions-(t&c)',
                      name: 'Missing Terms and Conditions (T&C)',
                      domain: 'website structure',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website does not provide a Terms and Conditions (T&C) page, which is crucial for setting clear expectations and legal agreements with customers. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    riskTypeLevels: {
                      legalRisk: 'moderate',
                      chargebackRisk: 'moderate',
                      reputationRisk: 'moderate',
                      transactionLaunderingRisk: 'moderate',
                    },
                    recommendations: [],
                    additionRiskScore: 1,
                    maxRiskScoreForAddition: 98,
                  },
                  {
                    id: 'website-structure-missing-privacy-policy',
                    name: 'Missing Privacy Policy',
                    domain: 'website structure',
                    reason: 'The website does not have a Privacy Policy page',
                    pageUrl: '',
                    riskLevel: 'moderate',
                    triggerOn:
                      'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                    description: 'The website does not have a Privacy Policy page',
                    pageContext: 'Privacy Policy',
                    minRiskScore: 40,
                    baseRiskScore: 40,
                    fullViolation: {
                      id: 'website-structure-missing-privacy-policy',
                      name: 'Missing Privacy Policy',
                      domain: 'website structure',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website lacks a Privacy Policy page, potentially putting customer data privacy at risk and violating legal requirements. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    riskTypeLevels: {
                      legalRisk: 'moderate',
                      chargebackRisk: 'moderate',
                      reputationRisk: 'moderate',
                      transactionLaunderingRisk: 'moderate',
                    },
                    recommendations: [],
                    additionRiskScore: 1,
                    maxRiskScoreForAddition: 98,
                  },
                  {
                    id: 'website-structure-missing-about-us',
                    name: 'Missing About Us',
                    domain: 'website structure',
                    reason: 'The website does not have an About Us page',
                    pageUrl: '',
                    riskLevel: 'moderate',
                    triggerOn:
                      'Alert this when the website does not have an about us page or offer general information surrounding the business',
                    description: 'The website does not have an About Us page',
                    pageContext: 'About Us',
                    minRiskScore: 40,
                    baseRiskScore: 40,
                    fullViolation: {
                      id: 'website-structure-missing-about-us',
                      name: 'Missing About Us',
                      domain: 'website structure',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website does not have an about us page or offer general information surrounding the business',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    riskTypeLevels: {
                      legalRisk: 'moderate',
                      chargebackRisk: 'moderate',
                      reputationRisk: 'moderate',
                      transactionLaunderingRisk: 'moderate',
                    },
                    recommendations: [],
                    additionRiskScore: 1,
                    maxRiskScoreForAddition: 98,
                  },
                  {
                    id: 'website-structure-missing-contact-us',
                    name: 'Missing Contact Us',
                    domain: 'website structure',
                    reason: 'The website does not have a Contact Us page',
                    pageUrl: '',
                    riskLevel: 'moderate',
                    triggerOn:
                      'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                    description: 'The website does not have a Contact Us page',
                    pageContext: 'Contact Us',
                    minRiskScore: 40,
                    baseRiskScore: 40,
                    fullViolation: {
                      id: 'website-structure-missing-contact-us',
                      name: 'Missing Contact Us',
                      domain: 'website structure',
                      riskLevel: 'moderate',
                      triggerOn:
                        'Alert this when the website does not offer a Contact Us page, which is essential for customer trust and satisfaction. Do not trigger if the website does not offer any products or services for sale with an option to add them to a cart.',
                      minRiskScore: 40,
                      baseRiskScore: 40,
                      riskTypeLevels: {
                        legalRisk: 'moderate',
                        chargebackRisk: 'moderate',
                        reputationRisk: 'moderate',
                        transactionLaunderingRisk: 'moderate',
                      },
                      recommendations: [],
                      additionRiskScore: 1,
                      maxRiskScoreForAddition: 98,
                    },
                    riskTypeLevels: {
                      legalRisk: 'moderate',
                      chargebackRisk: 'moderate',
                      reputationRisk: 'moderate',
                      transactionLaunderingRisk: 'moderate',
                    },
                    recommendations: [],
                    additionRiskScore: 1,
                    maxRiskScoreForAddition: 98,
                  },
                ],
                pricingAnalysis: {
                  summary:
                    'No products were provided for pricing analysis, therefore no pricing violations or risks have been detected.',
                  indicators: [],
                },
                trafficAnalysis: {
                  engagements: [],
                  trafficSources: [],
                  montlyVisitsIndicators: [],
                },
                businessConsitency: {
                  summary: 'No inconsistency found',
                  indicators: [],
                },
                transactionAnalysis: null,
                websiteStructureEvaluation: {
                  summary:
                    "The website is missing several critical pages including 'Terms and Conditions', 'Privacy Policy', 'About Us', 'Contact Us', and 'Return Policy'. The absence of these pages indicates a lack of transparency and could lead to legal and reputation risks, as well as potential non-compliance with various regulations.",
                  indicators: [
                    'The website does not have a Terms And Conditions page',
                    'The website does not have a Privacy Policy page',
                    'The website does not have an About Us page',
                    'The website does not have a Contact Us page',
                  ],
                },
              },
              websiteCompanyAnalysis: {
                website: {
                  url: 'https://www.thusrdayboots.com/',
                },
                companyName: 'Thursday Boot Company',
                scamOrFraud: {
                  summary:
                    'No definitive evidence was found to classify Thursday Boot Company as a scam or involved in fraudulent activities.',
                  indicators: [],
                },
                companyAnalysis: {
                  indicators: [],
                },
                businessConsistency: {
                  summary: '',
                  indicators: [],
                },
              },
            },
            name: 'merchantMonitoring',
            status: 'SUCCESS',
            reportId: 'vqtr1gk5tq3k1dvb8t68xmy3',
            invokedAt: 1729672000635,
          },
          businessInformation: {
            data: [
              {
                type: 'COM',
                number: '202400701R',
                shares: [
                  {
                    shareType: 'Ordinary',
                    issuedCapital: '100000',
                    paidUpCapital: '100000',
                    shareAllotted: '100000',
                    shareCurrency: 'GBP',
                  },
                ],
                status: 'Live Company',
                expiryDate: '2026-01-04',
                statusDate: '2024-01-04',
                companyName: 'GreenTech Solutions Ltd.',
                companyType: 'Private Limited Company',
                lastUpdated: '2024-10-23 16:26:54',
                historyNames: ['GreenTech Solutions Ltd.', 'GreenTech Solutions Ltd'],
                businessScope: {
                  code: '62020',
                  description: 'Information Technology Consultancy Activities',
                  otherDescription: 'Software development and digital services',
                },
                establishDate: '2010-01-01',
                lastFinancialDate: '2024-01-04',
                registeredAddress: {
                  postalCode: 'SW1A 1AA',
                  streetName: 'Tech Street',
                  unitNumber: '1',
                  levelNumber: '08',
                  buildingName: 'Tech Plaza',
                  blockHouseNumber: '1',
                },
                lastAnnualReturnDate: '2023-12-31',
                lastAnnualGeneralMeetingDate: '2024-01-05',
              },
            ],
            name: 'businessInformation',
            status: 'SUCCESS',
            orderId: 'av202410231626431206512666',
            invokedAt: 1729672014266,
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            'a177d4bd-5e1f-48cf-ab3e-b770b861ee58': {
              tags: ['manual_review'],
              state: 'kyc_manual_review',
              result: {
                childEntity: {
                  email: 'nitzan+testco1289971932@ballerine.com',
                  lastName: 'guy',
                  firstName: 'nitzan',
                  additionalInfo: {
                    role: 'CPO',
                    companyName: '1618 AIR CONDITIONING PTE. LTD.',
                    dateOfBirth: '1986-12-11T22:00:00.000Z',
                    customerCompany: 'Ballerine Demo',
                    __isGeneratedAutomatically: true,
                  },
                },
                vendorResult: {
                  aml: {
                    id: '93620665-15ca-4408-ab2c-42024e4d74d7',
                    hits: [],
                    clientId: '7a5a10eb-e01d-4896-a717-9017ab3f84d1',
                    checkType: 'initial_result',
                    createdAt: '2024-10-10T13:59:16.639Z',
                    endUserId: 'cm23d4npc00wyu530tstxtbp0',
                    matchStatus: 'no_match',
                  },
                  entity: {
                    data: {
                      lastName: 'GUY GELBARD',
                      firstName: 'NITZAN',
                      dateOfBirth: '1986-02-12',
                      additionalInfo: {
                        gender: 'M',
                        nationality: 'IL',
                      },
                    },
                    type: 'individual',
                  },
                  decision: {
                    status: 'approved',
                    decisionScore: 1,
                  },
                  metadata: {
                    id: '93620665-15ca-4408-ab2c-42024e4d74d7',
                    url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3Mjg1Njg2MjYsInNlc3Npb25faWQiOiI5MzYyMDY2NS0xNWNhLTQ0MDgtYWIyYy00MjAyNGU0ZDc0ZDciLCJpaWQiOiI5ZTEzOGE1OC0xZWU4LTQzNzctYjE1Yy0xMzNmNDZiNDU0ZmIifQ.5Z1VDgc8hDJv5xR6rH0hh1Ti3Zn_gQYp92i_is30NPE',
                  },
                },
              },
              status: 'active',
            },
          },
        },
        collectionFlow: {
          state: {
            steps: [
              {
                stepName: 'company_information',
                isCompleted: true,
              },
              {
                stepName: 'business_address_information',
                isCompleted: true,
              },
              {
                stepName: 'company_activity',
                isCompleted: true,
              },
              {
                stepName: 'bank_information',
                isCompleted: true,
              },
              {
                stepName: 'company_ownership',
                isCompleted: true,
              },
              {
                stepName: 'company_documents',
                isCompleted: true,
              },
            ],
            status: 'completed',
            currentStep: 'company_documents',
          },
          config: {
            apiUrl: 'https://api-dev.ballerine.io',
          },
          additionalInformation: {
            customerCompany: 'Ballerine Demo',
          },
        },
        ballerineEntityId: '82e06a10-09bb-4818-ad2d-9eb5008f2253',
        workflowRuntimeId: '1',
      },
      assignee: {
        id: 'cm7thulfm027qtk0kmobem36g',
        lastName: 'Ben Amram',
        avatarUrl: null,
        firstName: 'Gadi',
      },
      createdAt: '2025-03-03T20:09:48.408Z',
      assigneeId: 'cm7thulfm027qtk0kmobem36g',
      workflowDefinition: {
        id: 'gadiinc_demo_ongoing_monitoring_kyb',
        name: 'gadiinc_demo_ongoing_monitoring_kyb',
        config: {
          language: 'en',
          initialEvent: 'START',
          supportedLanguages: ['en', 'cn'],
          childCallbackResults: [
            {
              definitionId: 'kyc_email_session_example',
              deliverEvent: 'KYC_RESPONDED',
              transformers: [
                {
                  mapping:
                    '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}',
                  transformer: 'jmespath',
                },
              ],
              persistenceStates: ['kyc_manual_review'],
            },
            {
              definitionId: 'kyc_email_session_example',
              deliverEvent: 'KYC_REVISION',
              transformers: [
                {
                  mapping:
                    '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}',
                  transformer: 'jmespath',
                },
              ],
              persistenceStates: ['revision_email_sent'],
            },
            {
              definitionId: 'gadiinc_demo_ongoing_monitoring_child_associated_company',
              deliverEvent: 'ASSOCIATED_COMPANY_KYB_FINISHED',
              transformers: [
                {
                  mapping: '{childEntity: entity.data}',
                  transformer: 'jmespath',
                },
              ],
              persistenceStates: ['manual_review'],
            },
            {
              definitionId: 'gadiinc_demo_ongoing_monitoring_child_associated_company',
              deliverEvent: 'ASSOCIATED_COMPANY_IN_KYB',
              transformers: [
                {
                  mapping: '{childEntity: entity.data}',
                  transformer: 'jmespath',
                },
              ],
              persistenceStates: ['pending_associated_kyb_collection_flow'],
            },
            {
              definitionId: 'gadiinc_demo_ongoing_monitoring_child_associated_company',
              deliverEvent: 'revision',
              transformers: [
                {
                  mapping: '{childEntity: entity.data}',
                  transformer: 'jmespath',
                },
              ],
              persistenceStates: ['revision'],
            },
          ],
          enableManualCreation: false,
          isCaseOverviewEnabled: true,
          workflowLevelResolution: true,
          createCollectionFlowToken: true,
          isCaseRiskOverviewEnabled: true,
          isAssociatedCompanyKybEnabled: false,
        },
        version: 1,
        definition: {
          id: 'gadiinc_demo_ongoing_monitoring_kyb_v1',
          states: {
            idle: {
              on: {
                START: 'collection_invite',
              },
              meta: {
                inputSchema: {
                  uiSchema: {
                    entity: {
                      id: {
                        'ui:title': 'Entity ID (As represented in your system)',
                      },
                      data: {
                        'ui:label': false,
                        companyName: {
                          'ui:title': 'Company Name',
                        },
                        additionalInfo: {
                          'ui:label': false,
                          mainRepresentative: {
                            email: {
                              'ui:title': 'Email',
                            },
                            lastName: {
                              'ui:title': 'Last Name',
                            },
                            'ui:label': false,
                            'ui:order': ['email', 'firstName', 'lastName'],
                            firstName: {
                              'ui:title': 'First Name',
                            },
                          },
                        },
                      },
                      type: {
                        hidden: true,
                      },
                      'ui:label': false,
                    },
                  },
                  dataSchema: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        required: ['id', 'type', 'data'],
                        properties: {
                          id: {
                            type: 'string',
                          },
                          data: {
                            type: 'object',
                            required: ['companyName', 'additionalInfo'],
                            properties: {
                              companyName: {
                                type: 'string',
                              },
                              additionalInfo: {
                                type: 'object',
                                required: ['mainRepresentative'],
                                properties: {
                                  mainRepresentative: {
                                    type: 'object',
                                    required: ['firstName', 'lastName', 'email'],
                                    properties: {
                                      email: {
                                        type: 'string',
                                        format: 'email',
                                      },
                                      lastName: {
                                        type: 'string',
                                      },
                                      firstName: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          type: {
                            type: 'string',
                            default: 'business',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            error: {
              tags: ['failure'],
            },
            failed: {
              tags: ['failure'],
              type: 'final',
            },
            approved: {
              tags: ['approved'],
              type: 'final',
            },
            rejected: {
              tags: ['rejected'],
              type: 'final',
            },
            revision: {
              on: {
                COLLECTION_FLOW_FINISHED: [
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`) &&\n                    (entity.data.additionalInfo.associatedCompanies == null || length(entity.data.additionalInfo.associatedCompanies) == `0` || entity.childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(entity.data.additionalInfo.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0`) &&\n                    ((childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0` || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*.state[?@ == 'idle' || @ == 'manual_review']) == length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*)))",
                      },
                    },
                    target: 'manual_review',
                  },
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "!(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`) &&\n                    (entity.data.additionalInfo.associatedCompanies == null || length(entity.data.additionalInfo.associatedCompanies) == `0` || entity.childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(entity.data.additionalInfo.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0`) &&\n                    ((childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0` || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*.state[?@ == 'idle' || @ == 'manual_review']) == length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*)))",
                      },
                    },
                    target: 'pending_kyc_response_to_finish',
                  },
                ],
              },
              tags: ['revision'],
            },
            run_ubos: {
              on: {
                EMAIL_SENT_TO_UBOS: [
                  {
                    target: 'run_vendor_data',
                  },
                ],
                FAILED_EMAIL_SENT_TO_UBOS: [
                  {
                    target: 'failed',
                  },
                ],
              },
              tags: ['collection_flow'],
            },
            manual_review: {
              on: {
                reject: 'rejected',
                approve: 'approved',
                revision: 'pending_resubmission',
                KYC_REVISION: 'pending_kyc_response_to_finish',
              },
              tags: ['manual_review'],
            },
            collection_flow: {
              on: {
                COLLECTION_FLOW_FINISHED: [
                  {
                    target: 'update_entities',
                  },
                ],
              },
              tags: ['collection_flow'],
            },
            run_vendor_data: {
              on: {
                VENDOR_DONE: [
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "!((childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`)) && \n  \n(\n  (\n    pluginsOutput.businessInformation.data ||\n    pluginsOutput.businessInformation.error != null\n  ) ||\n  contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], pluginsOutput.businessInformation.reason)\n) &&\n  \n(\n  (\n    pluginsOutput.ubo.data ||\n    pluginsOutput.ubo.error != null\n  ) ||\n  contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], pluginsOutput.ubo.reason)\n) &&\n  pluginsOutput.companySanctions.data != null\n && pluginsOutput.merchantMonitoring.data != null",
                      },
                    },
                    target: 'pending_kyc_response_to_finish',
                  },
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`) && \n  \n(\n  (\n    pluginsOutput.businessInformation.data ||\n    pluginsOutput.businessInformation.error != null\n  ) ||\n  contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], pluginsOutput.businessInformation.reason)\n) &&\n  \n(\n  (\n    pluginsOutput.ubo.data ||\n    pluginsOutput.ubo.error != null\n  ) ||\n  contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], pluginsOutput.ubo.reason)\n) &&\n  pluginsOutput.companySanctions.data != null\n && pluginsOutput.merchantMonitoring.data != null",
                      },
                    },
                    target: 'manual_review',
                  },
                ],
                KYC_RESPONDED: [
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`) && \n  \n(\n  (\n    pluginsOutput.businessInformation.data ||\n    pluginsOutput.businessInformation.error != null\n  ) ||\n  contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], pluginsOutput.businessInformation.reason)\n) &&\n  \n(\n  (\n    pluginsOutput.ubo.data ||\n    pluginsOutput.ubo.error != null\n  ) ||\n  contains(['NOT_IMPLEMENTED', 'NOT_AVAILABLE'], pluginsOutput.ubo.reason)\n) &&\n  pluginsOutput.companySanctions.data != null\n && pluginsOutput.merchantMonitoring.data != null",
                      },
                    },
                    target: 'manual_review',
                  },
                ],
                VENDOR_FAILED: 'failed',
              },
              tags: ['data_enrichment'],
            },
            update_entities: {
              on: {
                UPDATE_ENTITIES_FAILED: [
                  {
                    target: 'error',
                  },
                ],
                ENTITIES_UPDATED_SUCCESSFULLY: [
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: 'entity.data.additionalInfo.associatedCompanies == null || length(entity.data.additionalInfo.associatedCompanies) == `0`',
                      },
                    },
                    target: 'run_merchant_monitoring',
                  },
                  {
                    target: 'generate_associated_companies',
                  },
                ],
              },
              tags: ['collection_flow'],
            },
            collection_invite: {
              on: {
                INVITATION_SENT: 'collection_flow',
                INVITATION_FAILURE: 'failed',
              },
            },
            pending_resubmission: {
              on: {
                EMAIL_SENT: 'revision',
                EMAIL_FAILURE: 'failed',
              },
              tags: ['revision'],
            },
            run_merchant_monitoring: {
              on: {
                MERCHANT_MONITORING_FAILED: [
                  {
                    target: 'failed',
                  },
                ],
                MERCHANT_MONITORING_SUCCESS: [
                  {
                    target: 'run_ubos',
                  },
                ],
              },
              tags: ['collection_flow'],
            },
            generate_associated_companies: {
              on: {
                ASSOCIATED_COMPANIES_FAILED: [
                  {
                    target: 'failed',
                  },
                ],
                ASSOCIATED_COMPANIES_GENERATED: [
                  {
                    target: 'run_merchant_monitoring',
                  },
                ],
              },
              tags: ['collection_flow'],
            },
            pending_kyb_response_to_finish: {
              on: {
                reject: 'rejected',
                revision: 'pending_resubmission',
                ASSOCIATED_COMPANY_KYB_FINISHED: [
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0` || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*.state[?@ == 'idle' || @ == 'manual_review']) == length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*))",
                      },
                    },
                    target: 'manual_review',
                  },
                ],
              },
              tags: ['collection_flow'],
            },
            pending_kyc_response_to_finish: {
              on: {
                reject: 'rejected',
                revision: 'pending_resubmission',
                KYC_RESPONDED: [
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`) &&\n                    (entity.data.additionalInfo.associatedCompanies == null || length(entity.data.additionalInfo.associatedCompanies) == `0` || entity.childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(entity.data.additionalInfo.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0`) ||\n                    ((childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0` || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*.state[?@ == 'idle' || @ == 'manual_review']) == length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*)))",
                      },
                    },
                    target: 'manual_review',
                  },
                  {
                    cond: {
                      type: 'jmespath',
                      options: {
                        rule: "(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision] != null && length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[]) && length(childWorkflows.kyc_email_session_example.* | [?state == 'revision']) == `0`) &&\n                    !(entity.data.additionalInfo.associatedCompanies == null || length(entity.data.additionalInfo.associatedCompanies) == `0`) && !((childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company == null || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company) == `0` || length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*.state[?@ == 'idle' || @ == 'manual_review']) == length(childWorkflows.gadiinc_demo_ongoing_monitoring_child_associated_company.*)))",
                      },
                    },
                    target: 'pending_kyb_response_to_finish',
                  },
                ],
              },
              tags: ['pending_process'],
            },
          },
          context: {
            documents: [],
          },
          initial: 'idle',
          predictableActionArguments: true,
        },
        contextSchema: {
          type: 'json-schema',
          schema: {
            type: 'object',
            required: ['entity', 'documents'],
            properties: {
              aml: {
                type: 'object',
                required: [
                  'hits',
                  'id',
                  'clientId',
                  'createdAt',
                  'endUserId',
                  'matchStatus',
                  'checkType',
                  'vendor',
                ],
                properties: {
                  id: {
                    type: 'string',
                  },
                  hits: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: [
                        'matchedName',
                        'countries',
                        'matchTypes',
                        'pep',
                        'warnings',
                        'sanctions',
                        'adverseMedia',
                        'fitnessProbity',
                      ],
                      properties: {
                        pep: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['date', 'sourceUrl', 'sourceName'],
                            properties: {
                              date: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceUrl: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceName: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                            },
                          },
                        },
                        warnings: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['date', 'sourceUrl', 'sourceName'],
                            properties: {
                              date: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceUrl: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceName: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                            },
                          },
                        },
                        countries: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        sanctions: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['date', 'sourceUrl', 'sourceName'],
                            properties: {
                              date: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceUrl: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceName: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                            },
                          },
                        },
                        matchTypes: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                        },
                        matchedName: {
                          type: 'string',
                        },
                        adverseMedia: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['date', 'sourceUrl', 'sourceName'],
                            properties: {
                              date: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceUrl: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceName: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                            },
                          },
                        },
                        fitnessProbity: {
                          type: 'array',
                          items: {
                            type: 'object',
                            required: ['date', 'sourceUrl', 'sourceName'],
                            properties: {
                              date: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceUrl: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                              sourceName: {
                                anyOf: [
                                  {
                                    type: 'null',
                                  },
                                  {
                                    type: 'string',
                                  },
                                ],
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  vendor: {
                    enum: ['veriff', 'dow-jones'],
                    type: 'string',
                  },
                  clientId: {
                    type: 'string',
                  },
                  checkType: {
                    enum: ['initial_result', 'updated_result'],
                    type: 'string',
                  },
                  createdAt: {
                    type: 'string',
                  },
                  endUserId: {
                    type: 'string',
                  },
                  matchStatus: {
                    type: 'string',
                  },
                },
              },
              entity: {
                anyOf: [
                  {
                    type: 'object',
                    required: ['type', 'data', 'ballerineEntityId'],
                    properties: {
                      data: {
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              email: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              phone: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              country: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    description: 'ISO 3166-1 alpha-2 country code',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              lastName: {
                                type: 'string',
                              },
                              avatarUrl: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              firstName: {
                                type: 'string',
                              },
                              nationalId: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              dateOfBirth: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    format: 'date',
                                  },
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              endUserType: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              correlationId: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              additionalInfo: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              isContactPerson: {
                                type: 'boolean',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['companyName'],
                            properties: {
                              email: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              address: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              country: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    description: 'ISO 3166-1 alpha-2 country code',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              mccCode: {
                                type: 'number',
                              },
                              website: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              industry: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              metadata: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              avatarUrl: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              legalForm: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              vatNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              companyName: {
                                type: 'string',
                                maxLength: 100,
                                minLength: 2,
                              },
                              phoneNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              businessType: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              correlationId: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              additionalInfo: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {
                                      mainRepresentative: {
                                        type: 'object',
                                        properties: {
                                          email: {
                                            type: 'string',
                                          },
                                          lastName: {
                                            type: 'string',
                                          },
                                          firstName: {
                                            type: 'string',
                                          },
                                        },
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              bankInformation: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              businessPurpose: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              numberOfEmployees: {
                                type: 'number',
                              },
                              registrationNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              dateOfIncorporation: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    format: 'date',
                                  },
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              shareholderStructure: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              countryOfIncorporation: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    description: 'ISO 3166-1 alpha-2 country code',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              taxIdentificationNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      type: {
                        enum: ['individual', 'business'],
                        type: 'string',
                      },
                      ballerineEntityId: {
                        type: 'string',
                      },
                    },
                  },
                  {
                    type: 'object',
                    required: ['type', 'data', 'id'],
                    properties: {
                      id: {
                        type: 'string',
                      },
                      data: {
                        anyOf: [
                          {
                            type: 'object',
                            properties: {
                              email: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              phone: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              country: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    description: 'ISO 3166-1 alpha-2 country code',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              lastName: {
                                type: 'string',
                              },
                              avatarUrl: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              firstName: {
                                type: 'string',
                              },
                              nationalId: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              dateOfBirth: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    format: 'date',
                                  },
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              endUserType: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              correlationId: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              additionalInfo: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              isContactPerson: {
                                type: 'boolean',
                              },
                            },
                          },
                          {
                            type: 'object',
                            required: ['companyName'],
                            properties: {
                              email: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              address: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              country: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    description: 'ISO 3166-1 alpha-2 country code',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              mccCode: {
                                type: 'number',
                              },
                              website: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              industry: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              metadata: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              avatarUrl: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              legalForm: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              vatNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              companyName: {
                                type: 'string',
                                maxLength: 100,
                                minLength: 2,
                              },
                              phoneNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              businessType: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              correlationId: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              additionalInfo: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {
                                      mainRepresentative: {
                                        type: 'object',
                                        properties: {
                                          email: {
                                            type: 'string',
                                          },
                                          lastName: {
                                            type: 'string',
                                          },
                                          firstName: {
                                            type: 'string',
                                          },
                                        },
                                      },
                                    },
                                    additionalProperties: true,
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              bankInformation: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              businessPurpose: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              numberOfEmployees: {
                                type: 'number',
                              },
                              registrationNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              dateOfIncorporation: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    format: 'date',
                                  },
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              shareholderStructure: {
                                anyOf: [
                                  {
                                    type: 'object',
                                    properties: {},
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              countryOfIncorporation: {
                                anyOf: [
                                  {
                                    type: 'string',
                                    description: 'ISO 3166-1 alpha-2 country code',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                              taxIdentificationNumber: {
                                anyOf: [
                                  {
                                    type: 'string',
                                  },
                                  {
                                    type: 'null',
                                  },
                                ],
                              },
                            },
                          },
                        ],
                      },
                      type: {
                        enum: ['individual', 'business'],
                        type: 'string',
                      },
                    },
                  },
                ],
              },
              documents: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['category', 'type', 'issuer', 'pages', 'properties'],
                  properties: {
                    id: {
                      type: 'string',
                    },
                    type: {
                      type: 'string',
                      transform: ['trim', 'toLowerCase'],
                    },
                    pages: {
                      type: 'array',
                      items: {
                        anyOf: [
                          {
                            type: 'object',
                            required: ['ballerineFileId'],
                            properties: {
                              type: {
                                enum: [
                                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                  'application/vnd.ms-excel',
                                  'text/csv',
                                  'application/csv',
                                  'application/pdf',
                                  'image/png',
                                  'image/jpg',
                                  'image/jpeg',
                                  'pdf',
                                  'png',
                                  'jpg',
                                ],
                                type: 'string',
                              },
                              fileName: {
                                type: 'string',
                              },
                              ballerineFileId: {
                                type: 'string',
                              },
                            },
                            additionalProperties: false,
                          },
                          {
                            type: 'object',
                            required: ['provider', 'uri'],
                            properties: {
                              uri: {
                                type: 'string',
                                format: 'uri',
                              },
                              data: {
                                type: 'string',
                              },
                              type: {
                                enum: [
                                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                  'application/vnd.ms-excel',
                                  'text/csv',
                                  'application/csv',
                                  'application/pdf',
                                  'image/png',
                                  'image/jpg',
                                  'image/jpeg',
                                  'pdf',
                                  'png',
                                  'jpg',
                                ],
                                type: 'string',
                              },
                              fileName: {
                                type: 'string',
                              },
                              metadata: {
                                type: 'object',
                                properties: {
                                  side: {
                                    type: 'string',
                                  },
                                  pageNumber: {
                                    type: 'string',
                                  },
                                },
                                additionalProperties: false,
                              },
                              provider: {
                                enum: ['gcs', 'http', 'stream', 'file-system', 'ftp', 'base64'],
                                type: 'string',
                              },
                              ballerineFileId: {
                                type: 'string',
                              },
                            },
                            additionalProperties: false,
                          },
                        ],
                      },
                    },
                    issuer: {
                      type: 'object',
                      required: ['country'],
                      properties: {
                        city: {
                          type: 'string',
                        },
                        name: {
                          type: 'string',
                        },
                        type: {
                          type: 'string',
                        },
                        country: {
                          enum: [
                            'ZZ',
                            'AF',
                            'AX',
                            'AL',
                            'DZ',
                            'AS',
                            'AD',
                            'AO',
                            'AI',
                            'AQ',
                            'AG',
                            'AR',
                            'AM',
                            'AW',
                            'AU',
                            'AT',
                            'AZ',
                            'BS',
                            'BH',
                            'BD',
                            'BB',
                            'BY',
                            'BE',
                            'BZ',
                            'BJ',
                            'BM',
                            'BT',
                            'BO',
                            'BQ',
                            'BA',
                            'BW',
                            'BV',
                            'BR',
                            'IO',
                            'BN',
                            'BG',
                            'BF',
                            'BI',
                            'KH',
                            'CM',
                            'CA',
                            'CV',
                            'KY',
                            'CF',
                            'TD',
                            'CL',
                            'CN',
                            'CX',
                            'CC',
                            'CO',
                            'KM',
                            'CG',
                            'CD',
                            'CK',
                            'CR',
                            'CI',
                            'HR',
                            'CU',
                            'CW',
                            'CY',
                            'CZ',
                            'DK',
                            'DJ',
                            'DM',
                            'DO',
                            'EC',
                            'EG',
                            'SV',
                            'GQ',
                            'ER',
                            'EE',
                            'ET',
                            'FK',
                            'FO',
                            'FJ',
                            'FI',
                            'FR',
                            'GF',
                            'PF',
                            'TF',
                            'GA',
                            'GM',
                            'GE',
                            'DE',
                            'GH',
                            'GI',
                            'GR',
                            'GL',
                            'GD',
                            'GP',
                            'GU',
                            'GT',
                            'GG',
                            'GN',
                            'GW',
                            'GY',
                            'HT',
                            'HM',
                            'VA',
                            'HN',
                            'HK',
                            'HU',
                            'IS',
                            'IN',
                            'ID',
                            'IR',
                            'IQ',
                            'IE',
                            'IM',
                            'IL',
                            'IT',
                            'JM',
                            'JP',
                            'JE',
                            'JO',
                            'KZ',
                            'KE',
                            'KI',
                            'KP',
                            'KR',
                            'KW',
                            'KG',
                            'LA',
                            'LV',
                            'LB',
                            'LS',
                            'LR',
                            'LY',
                            'LI',
                            'LT',
                            'LU',
                            'MO',
                            'MK',
                            'MG',
                            'MW',
                            'MY',
                            'MV',
                            'ML',
                            'MT',
                            'MH',
                            'MQ',
                            'MR',
                            'MU',
                            'YT',
                            'MX',
                            'FM',
                            'MD',
                            'MC',
                            'MN',
                            'ME',
                            'MS',
                            'MA',
                            'MZ',
                            'MM',
                            'NA',
                            'NR',
                            'NP',
                            'NL',
                            'NC',
                            'NZ',
                            'NI',
                            'NE',
                            'NG',
                            'NU',
                            'NF',
                            'MP',
                            'NO',
                            'OM',
                            'PK',
                            'PW',
                            'PS',
                            'PA',
                            'PG',
                            'PY',
                            'PE',
                            'PH',
                            'PN',
                            'PL',
                            'PT',
                            'PR',
                            'QA',
                            'RE',
                            'RO',
                            'RU',
                            'RW',
                            'BL',
                            'SH',
                            'KN',
                            'LC',
                            'MF',
                            'PM',
                            'VC',
                            'WS',
                            'SM',
                            'ST',
                            'SA',
                            'SN',
                            'RS',
                            'SC',
                            'SL',
                            'SG',
                            'SX',
                            'SK',
                            'SI',
                            'SB',
                            'SO',
                            'ZA',
                            'GS',
                            'SS',
                            'ES',
                            'LK',
                            'SD',
                            'SR',
                            'SJ',
                            'SZ',
                            'SE',
                            'CH',
                            'SY',
                            'TW',
                            'TJ',
                            'TZ',
                            'TH',
                            'TL',
                            'TG',
                            'TK',
                            'TO',
                            'TT',
                            'TN',
                            'TR',
                            'TM',
                            'TC',
                            'TV',
                            'UG',
                            'UA',
                            'AE',
                            'GB',
                            'US',
                            'UM',
                            'UY',
                            'UZ',
                            'VU',
                            'VE',
                            'VN',
                            'VG',
                            'VI',
                            'WF',
                            'EH',
                            'YE',
                            'ZM',
                            'ZW',
                          ],
                          type: 'string',
                          transform: ['trim', 'toUpperCase'],
                        },
                        additionalInfo: {
                          type: 'object',
                          properties: {},
                        },
                      },
                      additionalProperties: false,
                    },
                    version: {
                      type: 'number',
                    },
                    category: {
                      type: 'string',
                      transform: ['trim', 'toLowerCase'],
                    },
                    decision: {
                      type: 'object',
                      properties: {
                        status: {
                          anyOf: [
                            {
                              enum: ['new', 'pending', 'revision', 'approved', 'rejected'],
                              type: 'string',
                            },
                            {
                              type: 'null',
                            },
                          ],
                        },
                        comment: {
                          type: 'string',
                        },
                        revisionReason: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              enum: [
                                'Wrong category',
                                'Spam',
                                'Ownership mismatch - Name',
                                'Ownership mismatch - National ID',
                                'Bad image quality',
                                'Missing page',
                                'Invalid document',
                                'Expired document',
                                'Password protected',
                                'Blurry image',
                                'Short statement period',
                                'Document out of range',
                                'Outside restricted area',
                                'Other',
                                'Partial information',
                              ],
                              type: 'string',
                            },
                          ],
                        },
                        rejectionReason: {
                          anyOf: [
                            {
                              type: 'string',
                            },
                            {
                              enum: [
                                'Fraud Suspected',
                                'Suspicious document',
                                'Document does not match customer profile',
                                'Potential identity theft',
                                'Fake or altered document',
                                'Document on watchlist or blacklist',
                              ],
                              type: 'string',
                            },
                          ],
                        },
                      },
                      additionalProperties: false,
                    },
                    properties: {
                      type: 'object',
                      properties: {
                        email: {
                          type: 'string',
                          format: 'email',
                        },
                        idNumber: {
                          type: 'string',
                        },
                        expiryDate: {
                          type: 'string',
                          format: 'date',
                        },
                      },
                      additionalProperties: true,
                    },
                    issuingVersion: {
                      type: 'number',
                    },
                  },
                  additionalProperties: false,
                },
              },
              customData: {
                type: 'object',
                properties: {},
                additionalProperties: true,
              },
              pluginsOutput: {
                type: 'object',
                properties: {
                  ubo: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'number',
                      },
                      data: {
                        type: 'object',
                        patternProperties: {
                          '^(.*)$': {},
                        },
                      },
                      name: {
                        type: 'string',
                      },
                      reason: {
                        type: 'string',
                      },
                      status: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                      orderId: {
                        type: 'string',
                      },
                      invokedAt: {
                        type: 'number',
                      },
                    },
                  },
                  kyc_session: {
                    type: 'object',
                    patternProperties: {
                      '^(.*)$': {
                        type: 'object',
                        required: ['type', 'vendor', 'result'],
                        properties: {
                          type: {
                            type: 'string',
                          },
                          result: {
                            type: 'object',
                            required: ['entity', 'metadata'],
                            properties: {
                              aml: {
                                type: 'object',
                                required: [
                                  'hits',
                                  'id',
                                  'clientId',
                                  'createdAt',
                                  'endUserId',
                                  'matchStatus',
                                  'checkType',
                                  'vendor',
                                ],
                                properties: {
                                  id: {
                                    type: 'string',
                                  },
                                  hits: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      required: [
                                        'matchedName',
                                        'countries',
                                        'matchTypes',
                                        'pep',
                                        'warnings',
                                        'sanctions',
                                        'adverseMedia',
                                        'fitnessProbity',
                                      ],
                                      properties: {
                                        pep: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['date', 'sourceUrl', 'sourceName'],
                                            properties: {
                                              date: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceUrl: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceName: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                            },
                                          },
                                        },
                                        warnings: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['date', 'sourceUrl', 'sourceName'],
                                            properties: {
                                              date: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceUrl: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceName: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                            },
                                          },
                                        },
                                        countries: {
                                          type: 'array',
                                          items: {
                                            type: 'string',
                                          },
                                        },
                                        sanctions: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['date', 'sourceUrl', 'sourceName'],
                                            properties: {
                                              date: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceUrl: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceName: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                            },
                                          },
                                        },
                                        matchTypes: {
                                          type: 'array',
                                          items: {
                                            type: 'string',
                                          },
                                        },
                                        matchedName: {
                                          type: 'string',
                                        },
                                        adverseMedia: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['date', 'sourceUrl', 'sourceName'],
                                            properties: {
                                              date: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceUrl: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceName: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                            },
                                          },
                                        },
                                        fitnessProbity: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['date', 'sourceUrl', 'sourceName'],
                                            properties: {
                                              date: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceUrl: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                              sourceName: {
                                                anyOf: [
                                                  {
                                                    type: 'null',
                                                  },
                                                  {
                                                    type: 'string',
                                                  },
                                                ],
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                  vendor: {
                                    enum: ['veriff', 'dow-jones'],
                                    type: 'string',
                                  },
                                  clientId: {
                                    type: 'string',
                                  },
                                  checkType: {
                                    enum: ['initial_result', 'updated_result'],
                                    type: 'string',
                                  },
                                  createdAt: {
                                    type: 'string',
                                  },
                                  endUserId: {
                                    type: 'string',
                                  },
                                  matchStatus: {
                                    type: 'string',
                                  },
                                },
                              },
                              entity: {
                                type: 'object',
                                required: ['type', 'data'],
                                properties: {
                                  data: {
                                    type: 'object',
                                    required: ['firstName', 'lastName', 'dateOfBirth'],
                                    properties: {
                                      lastName: {
                                        anyOf: [
                                          {
                                            type: 'string',
                                          },
                                          {
                                            type: 'null',
                                          },
                                        ],
                                      },
                                      firstName: {
                                        anyOf: [
                                          {
                                            type: 'string',
                                          },
                                          {
                                            type: 'null',
                                          },
                                        ],
                                      },
                                      dateOfBirth: {
                                        anyOf: [
                                          {
                                            type: 'string',
                                          },
                                          {
                                            type: 'null',
                                          },
                                        ],
                                      },
                                      additionalInfo: {
                                        type: 'object',
                                        required: ['gender', 'nationality'],
                                        properties: {
                                          gender: {
                                            anyOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                type: 'null',
                                              },
                                            ],
                                          },
                                          nationality: {
                                            anyOf: [
                                              {
                                                type: 'string',
                                              },
                                              {
                                                type: 'null',
                                              },
                                            ],
                                          },
                                        },
                                      },
                                    },
                                  },
                                  type: {
                                    type: 'string',
                                  },
                                },
                              },
                              decision: {
                                type: 'object',
                                required: ['status', 'decisionScore'],
                                properties: {
                                  status: {
                                    type: 'string',
                                  },
                                  decisionScore: {
                                    type: 'number',
                                  },
                                },
                              },
                              metadata: {
                                type: 'object',
                                required: ['id', 'url'],
                                properties: {
                                  id: {
                                    type: 'string',
                                  },
                                  url: {
                                    type: 'string',
                                  },
                                },
                              },
                            },
                          },
                          vendor: {
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                  riskEvaluation: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                      },
                      riskScore: {
                        type: 'number',
                      },
                      rulesResults: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                            },
                            domain: {
                              type: 'string',
                            },
                            result: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  rule: {
                                    type: 'object',
                                    properties: {
                                      key: {
                                        type: 'string',
                                      },
                                      value: {},
                                      operator: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                  status: {
                                    type: 'string',
                                  },
                                },
                              },
                            },
                            ruleSet: {
                              type: 'object',
                              properties: {
                                rules: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      key: {
                                        type: 'string',
                                      },
                                      value: {},
                                      operator: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                                operator: {
                                  type: 'string',
                                },
                              },
                            },
                            indicator: {
                              type: 'string',
                            },
                            maxRiskScore: {
                              type: 'number',
                            },
                            minRiskScore: {
                              type: 'number',
                            },
                            baseRiskScore: {
                              type: 'number',
                            },
                            additionalRiskScore: {
                              type: 'number',
                            },
                          },
                        },
                      },
                      riskIndicatorsByDomain: {
                        type: 'object',
                        properties: {
                          'Store Info': {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                name: {
                                  type: 'string',
                                },
                                domain: {
                                  type: 'string',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  companySanctions: {
                    type: 'object',
                    required: ['data'],
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['entity', 'matchedFields'],
                          properties: {
                            entity: {
                              type: 'object',
                              required: [
                                'name',
                                'places',
                                'sources',
                                'category',
                                'countries',
                                'enterDate',
                                'categories',
                                'identities',
                                'otherNames',
                                'generalInfo',
                                'subcategory',
                                'descriptions',
                                'lastReviewed',
                                'officialLists',
                                'linkedCompanies',
                                'primaryLocation',
                                'linkedIndividuals',
                                'furtherInformation',
                                'originalScriptNames',
                              ],
                              properties: {
                                name: {
                                  type: 'string',
                                },
                                places: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['city', 'type', 'address', 'country', 'location'],
                                    properties: {
                                      city: {
                                        type: 'string',
                                      },
                                      type: {
                                        type: 'string',
                                      },
                                      address: {
                                        type: 'string',
                                      },
                                      country: {
                                        type: 'string',
                                      },
                                      location: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                                sources: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['url', 'dates', 'categories'],
                                    properties: {
                                      url: {
                                        type: 'string',
                                      },
                                      dates: {
                                        type: 'array',
                                        items: {
                                          type: 'string',
                                        },
                                      },
                                      categories: {
                                        type: 'array',
                                        items: {
                                          type: 'string',
                                        },
                                      },
                                    },
                                  },
                                },
                                category: {
                                  type: 'string',
                                },
                                countries: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                  },
                                },
                                enterDate: {
                                  type: 'string',
                                },
                                categories: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                  },
                                },
                                identities: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                  },
                                },
                                otherNames: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['name', 'type'],
                                    properties: {
                                      name: {
                                        type: 'string',
                                      },
                                      type: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                                generalInfo: {
                                  type: 'object',
                                  required: [
                                    'website',
                                    'nationality',
                                    'alternateTitle',
                                    'businessDescription',
                                  ],
                                  properties: {
                                    website: {
                                      type: 'string',
                                    },
                                    nationality: {
                                      type: 'string',
                                    },
                                    alternateTitle: {
                                      type: 'string',
                                    },
                                    businessDescription: {
                                      type: 'string',
                                    },
                                  },
                                },
                                subcategory: {
                                  type: 'string',
                                },
                                descriptions: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['description1', 'description2', 'description3'],
                                    properties: {
                                      description1: {
                                        type: 'string',
                                      },
                                      description2: {
                                        type: 'string',
                                      },
                                      description3: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                                lastReviewed: {
                                  type: 'string',
                                },
                                officialLists: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['isCurrent', 'description', 'keyword'],
                                    properties: {
                                      keyword: {
                                        type: 'string',
                                      },
                                      isCurrent: {
                                        type: 'string',
                                      },
                                      description: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                                linkedCompanies: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: [
                                      'name',
                                      'description',
                                      'categories',
                                      'subcategories',
                                    ],
                                    properties: {
                                      name: {
                                        type: 'string',
                                      },
                                      categories: {
                                        type: 'array',
                                        items: {
                                          type: 'string',
                                        },
                                      },
                                      description: {
                                        type: 'string',
                                      },
                                      subcategories: {
                                        type: 'array',
                                        items: {
                                          type: 'string',
                                        },
                                      },
                                    },
                                  },
                                },
                                primaryLocation: {
                                  type: 'string',
                                },
                                linkedIndividuals: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: [
                                      'firstName',
                                      'middleName',
                                      'lastName',
                                      'description',
                                      'otherCategories',
                                      'subcategories',
                                    ],
                                    properties: {
                                      lastName: {
                                        type: 'string',
                                      },
                                      firstName: {
                                        type: 'string',
                                      },
                                      middleName: {
                                        type: 'string',
                                      },
                                      description: {
                                        type: 'string',
                                      },
                                      subcategories: {
                                        type: 'array',
                                        items: {
                                          type: 'string',
                                        },
                                      },
                                      otherCategories: {
                                        type: 'array',
                                        items: {
                                          type: 'string',
                                        },
                                      },
                                    },
                                  },
                                },
                                furtherInformation: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                  },
                                },
                                originalScriptNames: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                  },
                                },
                              },
                            },
                            matchedFields: {
                              type: 'array',
                              items: {
                                type: 'string',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  merchantScreening: {
                    type: 'object',
                    properties: {
                      raw: {
                        type: 'object',
                        required: ['TerminationInquiry'],
                        properties: {
                          TerminationInquiry: {
                            type: 'object',
                            required: ['PageOffset', 'Ref', 'TransactionReferenceNumber'],
                            properties: {
                              Ref: {
                                type: 'string',
                                example:
                                  'https://api.mastercard.com/fraud/merchant/v3/termination-inquiry/1234567890',
                                description: 'Reference URL to get inquiry',
                              },
                              PageOffset: {
                                type: 'integer',
                                example: 0,
                                description: 'PageOffset for the inquiry done',
                              },
                              PossibleInquiryMatches: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  required: ['TotalLength', 'InquiredMerchant'],
                                  properties: {
                                    TotalLength: {
                                      type: 'integer',
                                      example: 2,
                                      description:
                                        'The total length of the result set from possible merchant matches of inquiry.',
                                    },
                                    InquiredMerchant: {
                                      type: 'array',
                                      items: {
                                        type: 'object',
                                        required: ['Merchant'],
                                        properties: {
                                          Merchant: {
                                            type: 'object',
                                            required: ['Name'],
                                            properties: {
                                              Url: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                              Name: {
                                                type: 'string',
                                                example: 'THE BAIT SHOP',
                                                maxLength: 60,
                                                minLength: 1,
                                                description:
                                                  'The name of the business assigned by the principal owner(s)',
                                              },
                                              Address: {
                                                type: 'object',
                                                required: [
                                                  'Line1',
                                                  'City',
                                                  'PostalCode',
                                                  'Country',
                                                ],
                                                properties: {
                                                  City: {
                                                    type: 'string',
                                                    example: 'DALLAS',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The name of the city for the location.',
                                                  },
                                                  Line1: {
                                                    type: 'string',
                                                    example: '42 ELM AVENUE',
                                                    maxLength: 60,
                                                    minLength: 1,
                                                    description:
                                                      'Line 1 of the street address for the location. Usually includes street number and name.',
                                                  },
                                                  Line2: {
                                                    type: 'string',
                                                    example: 'SUITE 201',
                                                    maxLength: 60,
                                                    description:
                                                      'Line 2 of the street address, usually an apartment number or suite number.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    minLength: 1,
                                                    description:
                                                      'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  Province: {
                                                    type: 'string',
                                                    example: 'US',
                                                    maxLength: 3,
                                                    description:
                                                      'The name of the province for the location.',
                                                  },
                                                  PostalCode: {
                                                    type: 'string',
                                                    example: '66579',
                                                    maxLength: 10,
                                                    minLength: 1,
                                                    description:
                                                      'The postal code for the location (only supported for US and Canada merchants).',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                              Comments: {
                                                type: 'string',
                                                example: 'Added for reasons of fraud',
                                                maxLength: 500,
                                                description:
                                                  'Brief comments on why the merchant is added.',
                                              },
                                              UrlGroup: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  properties: {
                                                    NoMatchUrls: {
                                                      type: 'array',
                                                      items: {
                                                        type: 'string',
                                                        example: 'www.testmerchant.com',
                                                        maxLength: 4000,
                                                        description:
                                                          'Website address of the merchant. A request may include multiple URLs.',
                                                      },
                                                    },
                                                    CloseMatchUrls: {
                                                      type: 'array',
                                                      items: {
                                                        type: 'string',
                                                        example: 'www.testmerchant.com',
                                                        maxLength: 4000,
                                                        description:
                                                          'Website address of the merchant. A request may include multiple URLs.',
                                                      },
                                                    },
                                                    ExactMatchUrls: {
                                                      type: 'array',
                                                      items: {
                                                        type: 'string',
                                                        example: 'www.testmerchant.com',
                                                        maxLength: 4000,
                                                        description:
                                                          'Website address of the merchant. A request may include multiple URLs.',
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                              Principal: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  required: ['FirstName', 'LastName', 'Address'],
                                                  properties: {
                                                    Address: {
                                                      type: 'object',
                                                      required: [
                                                        'Line1',
                                                        'City',
                                                        'PostalCode',
                                                        'Country',
                                                      ],
                                                      properties: {
                                                        City: {
                                                          type: 'string',
                                                          example: 'DALLAS',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The name of the city for the location.',
                                                        },
                                                        Line1: {
                                                          type: 'string',
                                                          example: '42 ELM AVENUE',
                                                          maxLength: 60,
                                                          minLength: 1,
                                                          description:
                                                            'Line 1 of the street address for the location. Usually includes street number and name.',
                                                        },
                                                        Line2: {
                                                          type: 'string',
                                                          example: 'SUITE 201',
                                                          maxLength: 60,
                                                          description:
                                                            'Line 2 of the street address, usually an apartment number or suite number.',
                                                        },
                                                        Country: {
                                                          type: 'string',
                                                          example: 'USA',
                                                          maxLength: 3,
                                                          minLength: 1,
                                                          description:
                                                            'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                        },
                                                        Province: {
                                                          type: 'string',
                                                          example: 'US',
                                                          maxLength: 3,
                                                          description:
                                                            'The name of the province for the location.',
                                                        },
                                                        PostalCode: {
                                                          type: 'string',
                                                          example: '66579',
                                                          maxLength: 10,
                                                          minLength: 1,
                                                          description:
                                                            'The postal code for the location (only supported for US and Canada merchants).',
                                                        },
                                                        CountrySubdivision: {
                                                          type: 'string',
                                                          example: 'IL',
                                                          maxLength: 2,
                                                          description:
                                                            'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                        },
                                                      },
                                                    },
                                                    LastName: {
                                                      type: 'string',
                                                      example: 'SMITH',
                                                      maxLength: 40,
                                                      minLength: 1,
                                                      description:
                                                        'The last name of the principal owner of the business.',
                                                    },
                                                    FirstName: {
                                                      type: 'string',
                                                      example: 'DAVID',
                                                      maxLength: 40,
                                                      minLength: 1,
                                                      description:
                                                        'The first name of the principal owner of the business.',
                                                    },
                                                    NationalId: {
                                                      type: 'string',
                                                      example: '541022104',
                                                      maxLength: 35,
                                                      description:
                                                        'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                    },
                                                    PhoneNumber: {
                                                      type: 'string',
                                                      example: '3165557625',
                                                      maxLength: 25,
                                                      description:
                                                        "The principal owner's phone number, including the area code.",
                                                    },
                                                    MiddleInitial: {
                                                      type: 'string',
                                                      example: 'P',
                                                      description:
                                                        'The middle initial of the name of the principal owner of the business.',
                                                    },
                                                    AltPhoneNumber: {
                                                      type: 'string',
                                                      example: '3165557625',
                                                      maxLength: 25,
                                                      description:
                                                        "The principal owner's alternate phone number, including the area code.",
                                                    },
                                                    DriversLicense: {
                                                      type: 'object',
                                                      properties: {
                                                        Number: {
                                                          type: 'string',
                                                          example: 'M15698025',
                                                          maxLength: 25,
                                                          description:
                                                            'The drivers license number of a principal owner.',
                                                        },
                                                        Country: {
                                                          type: 'string',
                                                          example: 'USA',
                                                          maxLength: 3,
                                                          description:
                                                            'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                        },
                                                        CountrySubdivision: {
                                                          type: 'string',
                                                          example: 'IL',
                                                          maxLength: 2,
                                                          description:
                                                            'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                              AddedOnDate: {
                                                type: 'string',
                                                example: '10/13/2015',
                                                description:
                                                  'Date the merchant was added to the MATCH database.',
                                              },
                                              PhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The Business or Merchant's phone number, including the area code.",
                                              },
                                              MerchantMatch: {
                                                type: 'object',
                                                required: [
                                                  'Name',
                                                  'DoingBusinessAsName',
                                                  'PhoneNumber',
                                                  'Address',
                                                  'AltPhoneNumber',
                                                  'CountrySubdivisionTaxId',
                                                  'NationalTaxId',
                                                  'ServiceProvLegal',
                                                  'ServiceProvDBA',
                                                ],
                                                properties: {
                                                  Name: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The name of the Business which has been terminated.',
                                                  },
                                                  Address: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'Address of the merchant location.',
                                                  },
                                                  UrlMatch: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'object',
                                                      required: ['url'],
                                                      properties: {
                                                        url: {
                                                          type: 'string',
                                                          example: 'M01',
                                                          description:
                                                            'The URL associated with the Business which has been terminated.',
                                                        },
                                                      },
                                                    },
                                                  },
                                                  PhoneNumber: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The Business or Merchant’s phone number.',
                                                  },
                                                  NationalTaxId: {
                                                    type: 'string',
                                                    example: 'M02',
                                                    description:
                                                      'The National tax ID or business registration number. Return value will be hidden.',
                                                  },
                                                  AltPhoneNumber: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The Business or Merchant’s alternate phone number.',
                                                  },
                                                  PrincipalMatch: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'object',
                                                      required: [
                                                        'FirstName',
                                                        'LastName',
                                                        'Address',
                                                      ],
                                                      properties: {
                                                        Address: {
                                                          type: 'object',
                                                          required: [
                                                            'Line1',
                                                            'City',
                                                            'PostalCode',
                                                            'Country',
                                                          ],
                                                          properties: {
                                                            City: {
                                                              type: 'string',
                                                              example: 'DALLAS',
                                                              maxLength: 40,
                                                              minLength: 1,
                                                              description:
                                                                'The name of the city for the location.',
                                                            },
                                                            Line1: {
                                                              type: 'string',
                                                              example: '42 ELM AVENUE',
                                                              maxLength: 60,
                                                              minLength: 1,
                                                              description:
                                                                'Line 1 of the street address for the location. Usually includes street number and name.',
                                                            },
                                                            Line2: {
                                                              type: 'string',
                                                              example: 'SUITE 201',
                                                              maxLength: 60,
                                                              description:
                                                                'Line 2 of the street address, usually an apartment number or suite number.',
                                                            },
                                                            Country: {
                                                              type: 'string',
                                                              example: 'USA',
                                                              maxLength: 3,
                                                              minLength: 1,
                                                              description:
                                                                'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                            },
                                                            Province: {
                                                              type: 'string',
                                                              example: 'US',
                                                              maxLength: 3,
                                                              description:
                                                                'The name of the province for the location.',
                                                            },
                                                            PostalCode: {
                                                              type: 'string',
                                                              example: '66579',
                                                              maxLength: 10,
                                                              minLength: 1,
                                                              description:
                                                                'The postal code for the location (only supported for US and Canada merchants).',
                                                            },
                                                            CountrySubdivision: {
                                                              type: 'string',
                                                              example: 'IL',
                                                              maxLength: 2,
                                                              description:
                                                                'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                            },
                                                          },
                                                        },
                                                        LastName: {
                                                          type: 'string',
                                                          example: 'SMITH',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The last name of the principal owner of the business.',
                                                        },
                                                        FirstName: {
                                                          type: 'string',
                                                          example: 'DAVID',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The first name of the principal owner of the business.',
                                                        },
                                                        NationalId: {
                                                          type: 'string',
                                                          example: '541022104',
                                                          maxLength: 35,
                                                          description:
                                                            'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                        },
                                                        PhoneNumber: {
                                                          type: 'string',
                                                          example: '3165557625',
                                                          maxLength: 25,
                                                          description:
                                                            "The principal owner's phone number, including the area code.",
                                                        },
                                                        MiddleInitial: {
                                                          type: 'string',
                                                          example: 'P',
                                                          description:
                                                            'The middle initial of the name of the principal owner of the business.',
                                                        },
                                                        AltPhoneNumber: {
                                                          type: 'string',
                                                          example: '3165557625',
                                                          maxLength: 25,
                                                          description:
                                                            "The principal owner's alternate phone number, including the area code.",
                                                        },
                                                        DriversLicense: {
                                                          type: 'object',
                                                          properties: {
                                                            Number: {
                                                              type: 'string',
                                                              example: 'M15698025',
                                                              maxLength: 25,
                                                              description:
                                                                'The drivers license number of a principal owner.',
                                                            },
                                                            Country: {
                                                              type: 'string',
                                                              example: 'USA',
                                                              maxLength: 3,
                                                              description:
                                                                'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                            },
                                                            CountrySubdivision: {
                                                              type: 'string',
                                                              example: 'IL',
                                                              maxLength: 2,
                                                              description:
                                                                'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                  ServiceProvDBA: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The name of the service provider associated with the merchant listed in the MATCH.',
                                                  },
                                                  ServiceProvLegal: {
                                                    type: 'string',
                                                    example: 'M00',
                                                    description:
                                                      'The name of the service provider associated with the merchant listed in the MATCH.',
                                                  },
                                                  DoingBusinessAsName: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The name used by a merchant that could be different from the legal name of the business.',
                                                  },
                                                  CountrySubdivisionTaxId: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
                                                  },
                                                },
                                              },
                                              NationalTaxId: {
                                                type: 'string',
                                                example: '888596927',
                                                maxLength: 35,
                                                description:
                                                  'The Merchant national tax ID, leave blank if not in the U.S region.',
                                              },
                                              AltPhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The Business or Merchant's alternate phone number, including the area code.",
                                              },
                                              SearchCriteria: {
                                                type: 'object',
                                                required: ['SearchAll'],
                                                properties: {
                                                  Region: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'string',
                                                      example: 'A',
                                                      description:
                                                        'Region in which the inquiry results must be obtained.',
                                                    },
                                                  },
                                                  Country: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'string',
                                                      example: 'USA',
                                                      description:
                                                        'The three-digit country code of the principal owner.',
                                                    },
                                                  },
                                                  SearchAll: {
                                                    type: 'string',
                                                    example: 'N',
                                                    description:
                                                      'Determines if the inquiry is worldwide or not.',
                                                  },
                                                  MinPossibleMatchCount: {
                                                    type: 'string',
                                                    example: '3',
                                                    description:
                                                      'Determines how many minimum matches present for a merchant or inquiry to appear in the results.',
                                                  },
                                                },
                                              },
                                              ServiceProvDBA: {
                                                type: 'string',
                                                example: 'XYZ FINANCIAL SERVICE',
                                                maxLength: 60,
                                                description:
                                                  'The name of the service provider associated with the merchant listed in the MATCH.',
                                              },
                                              ServiceProvLegal: {
                                                type: 'string',
                                                example: 'XYZ FINANCIAL SERVICE INCORPORATED',
                                                maxLength: 60,
                                                description:
                                                  'The name of the service provider associated with the merchant listed in the MATCH.',
                                              },
                                              AddedByAcquirerID: {
                                                type: 'string',
                                                example: '1234',
                                                maxLength: 11,
                                                description:
                                                  'The Member ICA that has added the merchant to the MATCH system.',
                                              },
                                              DoingBusinessAsName: {
                                                type: 'string',
                                                example: 'BAIT R US',
                                                maxLength: 110,
                                                description:
                                                  'The name used by a merchant that could be different from the legal name of the business.',
                                              },
                                              TerminationReasonCode: {
                                                enum: [
                                                  '00',
                                                  '01',
                                                  '02',
                                                  '03',
                                                  '04',
                                                  '05',
                                                  '06',
                                                  '08',
                                                  '09',
                                                  '10',
                                                  '11',
                                                  '12',
                                                  '13',
                                                  '14',
                                                  '20',
                                                  '21',
                                                  '24',
                                                ],
                                                type: 'string',
                                                example: '13',
                                                maxLength: 2,
                                                minLength: 2,
                                                description:
                                                  'A two-digit numeric code indicating why a particular merchant was terminated.',
                                              },
                                              CountrySubdivisionTaxId: {
                                                type: 'string',
                                                example: '492321030',
                                                maxLength: 35,
                                                description:
                                                  'The Merchant Country Subdivision tax ID, leave blank if not in the U.S region.',
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              PossibleMerchantMatches: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  required: ['TotalLength', 'TerminatedMerchant'],
                                  properties: {
                                    TotalLength: {
                                      type: 'integer',
                                      example: 2,
                                      description:
                                        'The total length of the result set from possible merchant matches of inquiry.',
                                    },
                                    TerminatedMerchant: {
                                      type: 'array',
                                      items: {
                                        type: 'object',
                                        required: ['Merchant'],
                                        properties: {
                                          Merchant: {
                                            type: 'object',
                                            required: ['Name'],
                                            properties: {
                                              Url: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                              Name: {
                                                type: 'string',
                                                example: 'THE BAIT SHOP',
                                                maxLength: 60,
                                                minLength: 1,
                                                description:
                                                  'The name of the business assigned by the principal owner(s)',
                                              },
                                              Address: {
                                                type: 'object',
                                                required: [
                                                  'Line1',
                                                  'City',
                                                  'PostalCode',
                                                  'Country',
                                                ],
                                                properties: {
                                                  City: {
                                                    type: 'string',
                                                    example: 'DALLAS',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The name of the city for the location.',
                                                  },
                                                  Line1: {
                                                    type: 'string',
                                                    example: '42 ELM AVENUE',
                                                    maxLength: 60,
                                                    minLength: 1,
                                                    description:
                                                      'Line 1 of the street address for the location. Usually includes street number and name.',
                                                  },
                                                  Line2: {
                                                    type: 'string',
                                                    example: 'SUITE 201',
                                                    maxLength: 60,
                                                    description:
                                                      'Line 2 of the street address, usually an apartment number or suite number.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    minLength: 1,
                                                    description:
                                                      'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  Province: {
                                                    type: 'string',
                                                    example: 'US',
                                                    maxLength: 3,
                                                    description:
                                                      'The name of the province for the location.',
                                                  },
                                                  PostalCode: {
                                                    type: 'string',
                                                    example: '66579',
                                                    maxLength: 10,
                                                    minLength: 1,
                                                    description:
                                                      'The postal code for the location (only supported for US and Canada merchants).',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                              Comments: {
                                                type: 'string',
                                                example: 'Added for reasons of fraud',
                                                maxLength: 500,
                                                description:
                                                  'Brief comments on why the merchant is added.',
                                              },
                                              UrlGroup: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  properties: {
                                                    NoMatchUrls: {
                                                      type: 'array',
                                                      items: {
                                                        type: 'string',
                                                        example: 'www.testmerchant.com',
                                                        maxLength: 4000,
                                                        description:
                                                          'Website address of the merchant. A request may include multiple URLs.',
                                                      },
                                                    },
                                                    CloseMatchUrls: {
                                                      type: 'array',
                                                      items: {
                                                        type: 'string',
                                                        example: 'www.testmerchant.com',
                                                        maxLength: 4000,
                                                        description:
                                                          'Website address of the merchant. A request may include multiple URLs.',
                                                      },
                                                    },
                                                    ExactMatchUrls: {
                                                      type: 'array',
                                                      items: {
                                                        type: 'string',
                                                        example: 'www.testmerchant.com',
                                                        maxLength: 4000,
                                                        description:
                                                          'Website address of the merchant. A request may include multiple URLs.',
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                              Principal: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  required: ['FirstName', 'LastName', 'Address'],
                                                  properties: {
                                                    Address: {
                                                      type: 'object',
                                                      required: [
                                                        'Line1',
                                                        'City',
                                                        'PostalCode',
                                                        'Country',
                                                      ],
                                                      properties: {
                                                        City: {
                                                          type: 'string',
                                                          example: 'DALLAS',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The name of the city for the location.',
                                                        },
                                                        Line1: {
                                                          type: 'string',
                                                          example: '42 ELM AVENUE',
                                                          maxLength: 60,
                                                          minLength: 1,
                                                          description:
                                                            'Line 1 of the street address for the location. Usually includes street number and name.',
                                                        },
                                                        Line2: {
                                                          type: 'string',
                                                          example: 'SUITE 201',
                                                          maxLength: 60,
                                                          description:
                                                            'Line 2 of the street address, usually an apartment number or suite number.',
                                                        },
                                                        Country: {
                                                          type: 'string',
                                                          example: 'USA',
                                                          maxLength: 3,
                                                          minLength: 1,
                                                          description:
                                                            'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                        },
                                                        Province: {
                                                          type: 'string',
                                                          example: 'US',
                                                          maxLength: 3,
                                                          description:
                                                            'The name of the province for the location.',
                                                        },
                                                        PostalCode: {
                                                          type: 'string',
                                                          example: '66579',
                                                          maxLength: 10,
                                                          minLength: 1,
                                                          description:
                                                            'The postal code for the location (only supported for US and Canada merchants).',
                                                        },
                                                        CountrySubdivision: {
                                                          type: 'string',
                                                          example: 'IL',
                                                          maxLength: 2,
                                                          description:
                                                            'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                        },
                                                      },
                                                    },
                                                    LastName: {
                                                      type: 'string',
                                                      example: 'SMITH',
                                                      maxLength: 40,
                                                      minLength: 1,
                                                      description:
                                                        'The last name of the principal owner of the business.',
                                                    },
                                                    FirstName: {
                                                      type: 'string',
                                                      example: 'DAVID',
                                                      maxLength: 40,
                                                      minLength: 1,
                                                      description:
                                                        'The first name of the principal owner of the business.',
                                                    },
                                                    NationalId: {
                                                      type: 'string',
                                                      example: '541022104',
                                                      maxLength: 35,
                                                      description:
                                                        'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                    },
                                                    PhoneNumber: {
                                                      type: 'string',
                                                      example: '3165557625',
                                                      maxLength: 25,
                                                      description:
                                                        "The principal owner's phone number, including the area code.",
                                                    },
                                                    MiddleInitial: {
                                                      type: 'string',
                                                      example: 'P',
                                                      description:
                                                        'The middle initial of the name of the principal owner of the business.',
                                                    },
                                                    AltPhoneNumber: {
                                                      type: 'string',
                                                      example: '3165557625',
                                                      maxLength: 25,
                                                      description:
                                                        "The principal owner's alternate phone number, including the area code.",
                                                    },
                                                    DriversLicense: {
                                                      type: 'object',
                                                      properties: {
                                                        Number: {
                                                          type: 'string',
                                                          example: 'M15698025',
                                                          maxLength: 25,
                                                          description:
                                                            'The drivers license number of a principal owner.',
                                                        },
                                                        Country: {
                                                          type: 'string',
                                                          example: 'USA',
                                                          maxLength: 3,
                                                          description:
                                                            'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                        },
                                                        CountrySubdivision: {
                                                          type: 'string',
                                                          example: 'IL',
                                                          maxLength: 2,
                                                          description:
                                                            'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                              AddedOnDate: {
                                                type: 'string',
                                                example: '10/13/2015',
                                                description:
                                                  'Date the merchant was added to the MATCH database.',
                                              },
                                              PhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The Business or Merchant's phone number, including the area code.",
                                              },
                                              MerchantMatch: {
                                                type: 'object',
                                                required: [
                                                  'Name',
                                                  'DoingBusinessAsName',
                                                  'PhoneNumber',
                                                  'Address',
                                                  'AltPhoneNumber',
                                                  'CountrySubdivisionTaxId',
                                                  'NationalTaxId',
                                                  'ServiceProvLegal',
                                                  'ServiceProvDBA',
                                                ],
                                                properties: {
                                                  Name: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The name of the Business which has been terminated.',
                                                  },
                                                  Address: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'Address of the merchant location.',
                                                  },
                                                  UrlMatch: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'object',
                                                      required: ['url'],
                                                      properties: {
                                                        url: {
                                                          type: 'string',
                                                          example: 'M01',
                                                          description:
                                                            'The URL associated with the Business which has been terminated.',
                                                        },
                                                      },
                                                    },
                                                  },
                                                  PhoneNumber: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The Business or Merchant’s phone number.',
                                                  },
                                                  NationalTaxId: {
                                                    type: 'string',
                                                    example: 'M02',
                                                    description:
                                                      'The National tax ID or business registration number. Return value will be hidden.',
                                                  },
                                                  AltPhoneNumber: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The Business or Merchant’s alternate phone number.',
                                                  },
                                                  PrincipalMatch: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'object',
                                                      required: [
                                                        'FirstName',
                                                        'LastName',
                                                        'Address',
                                                      ],
                                                      properties: {
                                                        Address: {
                                                          type: 'object',
                                                          required: [
                                                            'Line1',
                                                            'City',
                                                            'PostalCode',
                                                            'Country',
                                                          ],
                                                          properties: {
                                                            City: {
                                                              type: 'string',
                                                              example: 'DALLAS',
                                                              maxLength: 40,
                                                              minLength: 1,
                                                              description:
                                                                'The name of the city for the location.',
                                                            },
                                                            Line1: {
                                                              type: 'string',
                                                              example: '42 ELM AVENUE',
                                                              maxLength: 60,
                                                              minLength: 1,
                                                              description:
                                                                'Line 1 of the street address for the location. Usually includes street number and name.',
                                                            },
                                                            Line2: {
                                                              type: 'string',
                                                              example: 'SUITE 201',
                                                              maxLength: 60,
                                                              description:
                                                                'Line 2 of the street address, usually an apartment number or suite number.',
                                                            },
                                                            Country: {
                                                              type: 'string',
                                                              example: 'USA',
                                                              maxLength: 3,
                                                              minLength: 1,
                                                              description:
                                                                'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                            },
                                                            Province: {
                                                              type: 'string',
                                                              example: 'US',
                                                              maxLength: 3,
                                                              description:
                                                                'The name of the province for the location.',
                                                            },
                                                            PostalCode: {
                                                              type: 'string',
                                                              example: '66579',
                                                              maxLength: 10,
                                                              minLength: 1,
                                                              description:
                                                                'The postal code for the location (only supported for US and Canada merchants).',
                                                            },
                                                            CountrySubdivision: {
                                                              type: 'string',
                                                              example: 'IL',
                                                              maxLength: 2,
                                                              description:
                                                                'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                            },
                                                          },
                                                        },
                                                        LastName: {
                                                          type: 'string',
                                                          example: 'SMITH',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The last name of the principal owner of the business.',
                                                        },
                                                        FirstName: {
                                                          type: 'string',
                                                          example: 'DAVID',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The first name of the principal owner of the business.',
                                                        },
                                                        NationalId: {
                                                          type: 'string',
                                                          example: '541022104',
                                                          maxLength: 35,
                                                          description:
                                                            'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                        },
                                                        PhoneNumber: {
                                                          type: 'string',
                                                          example: '3165557625',
                                                          maxLength: 25,
                                                          description:
                                                            "The principal owner's phone number, including the area code.",
                                                        },
                                                        MiddleInitial: {
                                                          type: 'string',
                                                          example: 'P',
                                                          description:
                                                            'The middle initial of the name of the principal owner of the business.',
                                                        },
                                                        AltPhoneNumber: {
                                                          type: 'string',
                                                          example: '3165557625',
                                                          maxLength: 25,
                                                          description:
                                                            "The principal owner's alternate phone number, including the area code.",
                                                        },
                                                        DriversLicense: {
                                                          type: 'object',
                                                          properties: {
                                                            Number: {
                                                              type: 'string',
                                                              example: 'M15698025',
                                                              maxLength: 25,
                                                              description:
                                                                'The drivers license number of a principal owner.',
                                                            },
                                                            Country: {
                                                              type: 'string',
                                                              example: 'USA',
                                                              maxLength: 3,
                                                              description:
                                                                'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                            },
                                                            CountrySubdivision: {
                                                              type: 'string',
                                                              example: 'IL',
                                                              maxLength: 2,
                                                              description:
                                                                'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                  ServiceProvDBA: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The name of the service provider associated with the merchant listed in the MATCH.',
                                                  },
                                                  ServiceProvLegal: {
                                                    type: 'string',
                                                    example: 'M00',
                                                    description:
                                                      'The name of the service provider associated with the merchant listed in the MATCH.',
                                                  },
                                                  DoingBusinessAsName: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The name used by a merchant that could be different from the legal name of the business.',
                                                  },
                                                  CountrySubdivisionTaxId: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
                                                  },
                                                },
                                              },
                                              NationalTaxId: {
                                                type: 'string',
                                                example: '888596927',
                                                maxLength: 35,
                                                description:
                                                  'The Merchant national tax ID, leave blank if not in the U.S region.',
                                              },
                                              AltPhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The Business or Merchant's alternate phone number, including the area code.",
                                              },
                                              SearchCriteria: {
                                                type: 'object',
                                                required: ['SearchAll'],
                                                properties: {
                                                  Region: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'string',
                                                      example: 'A',
                                                      description:
                                                        'Region in which the inquiry results must be obtained.',
                                                    },
                                                  },
                                                  Country: {
                                                    type: 'array',
                                                    items: {
                                                      type: 'string',
                                                      example: 'USA',
                                                      description:
                                                        'The three-digit country code of the principal owner.',
                                                    },
                                                  },
                                                  SearchAll: {
                                                    type: 'string',
                                                    example: 'N',
                                                    description:
                                                      'Determines if the inquiry is worldwide or not.',
                                                  },
                                                  MinPossibleMatchCount: {
                                                    type: 'string',
                                                    example: '3',
                                                    description:
                                                      'Determines how many minimum matches present for a merchant or inquiry to appear in the results.',
                                                  },
                                                },
                                              },
                                              ServiceProvDBA: {
                                                type: 'string',
                                                example: 'XYZ FINANCIAL SERVICE',
                                                maxLength: 60,
                                                description:
                                                  'The name of the service provider associated with the merchant listed in the MATCH.',
                                              },
                                              ServiceProvLegal: {
                                                type: 'string',
                                                example: 'XYZ FINANCIAL SERVICE INCORPORATED',
                                                maxLength: 60,
                                                description:
                                                  'The name of the service provider associated with the merchant listed in the MATCH.',
                                              },
                                              AddedByAcquirerID: {
                                                type: 'string',
                                                example: '1234',
                                                maxLength: 11,
                                                description:
                                                  'The Member ICA that has added the merchant to the MATCH system.',
                                              },
                                              DoingBusinessAsName: {
                                                type: 'string',
                                                example: 'BAIT R US',
                                                maxLength: 110,
                                                description:
                                                  'The name used by a merchant that could be different from the legal name of the business.',
                                              },
                                              TerminationReasonCode: {
                                                enum: [
                                                  '00',
                                                  '01',
                                                  '02',
                                                  '03',
                                                  '04',
                                                  '05',
                                                  '06',
                                                  '08',
                                                  '09',
                                                  '10',
                                                  '11',
                                                  '12',
                                                  '13',
                                                  '14',
                                                  '20',
                                                  '21',
                                                  '24',
                                                ],
                                                type: 'string',
                                                example: '13',
                                                maxLength: 2,
                                                minLength: 2,
                                                description:
                                                  'A two-digit numeric code indicating why a particular merchant was terminated.',
                                              },
                                              CountrySubdivisionTaxId: {
                                                type: 'string',
                                                example: '492321030',
                                                maxLength: 35,
                                                description:
                                                  'The Merchant Country Subdivision tax ID, leave blank if not in the U.S region.',
                                              },
                                            },
                                          },
                                          MerchantMatch: {
                                            type: 'object',
                                            required: [
                                              'Name',
                                              'DoingBusinessAsName',
                                              'PhoneNumber',
                                              'Address',
                                              'AltPhoneNumber',
                                              'CountrySubdivisionTaxId',
                                              'NationalTaxId',
                                              'ServiceProvLegal',
                                              'ServiceProvDBA',
                                            ],
                                            properties: {
                                              Name: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The name of the Business which has been terminated.',
                                              },
                                              Address: {
                                                type: 'string',
                                                example: 'M01',
                                                description: 'Address of the merchant location.',
                                              },
                                              UrlMatch: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  required: ['url'],
                                                  properties: {
                                                    url: {
                                                      type: 'string',
                                                      example: 'M01',
                                                      description:
                                                        'The URL associated with the Business which has been terminated.',
                                                    },
                                                  },
                                                },
                                              },
                                              PhoneNumber: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The Business or Merchant’s phone number.',
                                              },
                                              NationalTaxId: {
                                                type: 'string',
                                                example: 'M02',
                                                description:
                                                  'The National tax ID or business registration number. Return value will be hidden.',
                                              },
                                              AltPhoneNumber: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The Business or Merchant’s alternate phone number.',
                                              },
                                              PrincipalMatch: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  required: ['FirstName', 'LastName', 'Address'],
                                                  properties: {
                                                    Address: {
                                                      type: 'object',
                                                      required: [
                                                        'Line1',
                                                        'City',
                                                        'PostalCode',
                                                        'Country',
                                                      ],
                                                      properties: {
                                                        City: {
                                                          type: 'string',
                                                          example: 'DALLAS',
                                                          maxLength: 40,
                                                          minLength: 1,
                                                          description:
                                                            'The name of the city for the location.',
                                                        },
                                                        Line1: {
                                                          type: 'string',
                                                          example: '42 ELM AVENUE',
                                                          maxLength: 60,
                                                          minLength: 1,
                                                          description:
                                                            'Line 1 of the street address for the location. Usually includes street number and name.',
                                                        },
                                                        Line2: {
                                                          type: 'string',
                                                          example: 'SUITE 201',
                                                          maxLength: 60,
                                                          description:
                                                            'Line 2 of the street address, usually an apartment number or suite number.',
                                                        },
                                                        Country: {
                                                          type: 'string',
                                                          example: 'USA',
                                                          maxLength: 3,
                                                          minLength: 1,
                                                          description:
                                                            'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                        },
                                                        Province: {
                                                          type: 'string',
                                                          example: 'US',
                                                          maxLength: 3,
                                                          description:
                                                            'The name of the province for the location.',
                                                        },
                                                        PostalCode: {
                                                          type: 'string',
                                                          example: '66579',
                                                          maxLength: 10,
                                                          minLength: 1,
                                                          description:
                                                            'The postal code for the location (only supported for US and Canada merchants).',
                                                        },
                                                        CountrySubdivision: {
                                                          type: 'string',
                                                          example: 'IL',
                                                          maxLength: 2,
                                                          description:
                                                            'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                        },
                                                      },
                                                    },
                                                    LastName: {
                                                      type: 'string',
                                                      example: 'SMITH',
                                                      maxLength: 40,
                                                      minLength: 1,
                                                      description:
                                                        'The last name of the principal owner of the business.',
                                                    },
                                                    FirstName: {
                                                      type: 'string',
                                                      example: 'DAVID',
                                                      maxLength: 40,
                                                      minLength: 1,
                                                      description:
                                                        'The first name of the principal owner of the business.',
                                                    },
                                                    NationalId: {
                                                      type: 'string',
                                                      example: '541022104',
                                                      maxLength: 35,
                                                      description:
                                                        'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                    },
                                                    PhoneNumber: {
                                                      type: 'string',
                                                      example: '3165557625',
                                                      maxLength: 25,
                                                      description:
                                                        "The principal owner's phone number, including the area code.",
                                                    },
                                                    MiddleInitial: {
                                                      type: 'string',
                                                      example: 'P',
                                                      description:
                                                        'The middle initial of the name of the principal owner of the business.',
                                                    },
                                                    AltPhoneNumber: {
                                                      type: 'string',
                                                      example: '3165557625',
                                                      maxLength: 25,
                                                      description:
                                                        "The principal owner's alternate phone number, including the area code.",
                                                    },
                                                    DriversLicense: {
                                                      type: 'object',
                                                      properties: {
                                                        Number: {
                                                          type: 'string',
                                                          example: 'M15698025',
                                                          maxLength: 25,
                                                          description:
                                                            'The drivers license number of a principal owner.',
                                                        },
                                                        Country: {
                                                          type: 'string',
                                                          example: 'USA',
                                                          maxLength: 3,
                                                          description:
                                                            'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                        },
                                                        CountrySubdivision: {
                                                          type: 'string',
                                                          example: 'IL',
                                                          maxLength: 2,
                                                          description:
                                                            'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                              ServiceProvDBA: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The name of the service provider associated with the merchant listed in the MATCH.',
                                              },
                                              ServiceProvLegal: {
                                                type: 'string',
                                                example: 'M00',
                                                description:
                                                  'The name of the service provider associated with the merchant listed in the MATCH.',
                                              },
                                              DoingBusinessAsName: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The name used by a merchant that could be different from the legal name of the business.',
                                              },
                                              CountrySubdivisionTaxId: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                              TransactionReferenceNumber: {
                                type: 'string',
                                example: '12345',
                                description: 'User-defined identifier for the inquiry submitted.',
                              },
                            },
                          },
                        },
                      },
                      name: {
                        type: 'string',
                        const: 'merchantScreening',
                      },
                      status: {
                        enum: ['IDLE', 'IN_PROGRESS', 'SUCCESS', 'ERROR', 'CANCELED'],
                        type: 'string',
                      },
                      vendor: {
                        type: 'string',
                        const: 'mastercard',
                      },
                      logoUrl: {
                        type: 'string',
                      },
                      invokedAt: {
                        type: 'number',
                      },
                      processed: {
                        type: 'object',
                        required: [
                          'terminatedMatchedMerchants',
                          'inquiredMatchedMerchants',
                          'checkDate',
                        ],
                        properties: {
                          checkDate: {
                            type: 'string',
                          },
                          inquiredMatchedMerchants: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: [
                                'name',
                                'exactMatchesAmount',
                                'partialMatchesAmount',
                                'exactMatches',
                                'partialMatches',
                                'principals',
                                'urls',
                                'raw',
                              ],
                              properties: {
                                raw: {
                                  type: 'object',
                                  required: ['Merchant'],
                                  properties: {
                                    Merchant: {
                                      type: 'object',
                                      required: ['Name'],
                                      properties: {
                                        Url: {
                                          type: 'array',
                                          items: {
                                            type: 'string',
                                            example: 'www.testmerchant.com',
                                            maxLength: 4000,
                                            description:
                                              'Website address of the merchant. A request may include multiple URLs.',
                                          },
                                        },
                                        Name: {
                                          type: 'string',
                                          example: 'THE BAIT SHOP',
                                          maxLength: 60,
                                          minLength: 1,
                                          description:
                                            'The name of the business assigned by the principal owner(s)',
                                        },
                                        Address: {
                                          type: 'object',
                                          required: ['Line1', 'City', 'PostalCode', 'Country'],
                                          properties: {
                                            City: {
                                              type: 'string',
                                              example: 'DALLAS',
                                              maxLength: 40,
                                              minLength: 1,
                                              description: 'The name of the city for the location.',
                                            },
                                            Line1: {
                                              type: 'string',
                                              example: '42 ELM AVENUE',
                                              maxLength: 60,
                                              minLength: 1,
                                              description:
                                                'Line 1 of the street address for the location. Usually includes street number and name.',
                                            },
                                            Line2: {
                                              type: 'string',
                                              example: 'SUITE 201',
                                              maxLength: 60,
                                              description:
                                                'Line 2 of the street address, usually an apartment number or suite number.',
                                            },
                                            Country: {
                                              type: 'string',
                                              example: 'USA',
                                              maxLength: 3,
                                              minLength: 1,
                                              description:
                                                'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                            },
                                            Province: {
                                              type: 'string',
                                              example: 'US',
                                              maxLength: 3,
                                              description:
                                                'The name of the province for the location.',
                                            },
                                            PostalCode: {
                                              type: 'string',
                                              example: '66579',
                                              maxLength: 10,
                                              minLength: 1,
                                              description:
                                                'The postal code for the location (only supported for US and Canada merchants).',
                                            },
                                            CountrySubdivision: {
                                              type: 'string',
                                              example: 'IL',
                                              maxLength: 2,
                                              description:
                                                'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                            },
                                          },
                                        },
                                        Comments: {
                                          type: 'string',
                                          example: 'Added for reasons of fraud',
                                          maxLength: 500,
                                          description:
                                            'Brief comments on why the merchant is added.',
                                        },
                                        UrlGroup: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            properties: {
                                              NoMatchUrls: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                              CloseMatchUrls: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                              ExactMatchUrls: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                            },
                                          },
                                        },
                                        Principal: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['FirstName', 'LastName', 'Address'],
                                            properties: {
                                              Address: {
                                                type: 'object',
                                                required: [
                                                  'Line1',
                                                  'City',
                                                  'PostalCode',
                                                  'Country',
                                                ],
                                                properties: {
                                                  City: {
                                                    type: 'string',
                                                    example: 'DALLAS',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The name of the city for the location.',
                                                  },
                                                  Line1: {
                                                    type: 'string',
                                                    example: '42 ELM AVENUE',
                                                    maxLength: 60,
                                                    minLength: 1,
                                                    description:
                                                      'Line 1 of the street address for the location. Usually includes street number and name.',
                                                  },
                                                  Line2: {
                                                    type: 'string',
                                                    example: 'SUITE 201',
                                                    maxLength: 60,
                                                    description:
                                                      'Line 2 of the street address, usually an apartment number or suite number.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    minLength: 1,
                                                    description:
                                                      'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  Province: {
                                                    type: 'string',
                                                    example: 'US',
                                                    maxLength: 3,
                                                    description:
                                                      'The name of the province for the location.',
                                                  },
                                                  PostalCode: {
                                                    type: 'string',
                                                    example: '66579',
                                                    maxLength: 10,
                                                    minLength: 1,
                                                    description:
                                                      'The postal code for the location (only supported for US and Canada merchants).',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                              LastName: {
                                                type: 'string',
                                                example: 'SMITH',
                                                maxLength: 40,
                                                minLength: 1,
                                                description:
                                                  'The last name of the principal owner of the business.',
                                              },
                                              FirstName: {
                                                type: 'string',
                                                example: 'DAVID',
                                                maxLength: 40,
                                                minLength: 1,
                                                description:
                                                  'The first name of the principal owner of the business.',
                                              },
                                              NationalId: {
                                                type: 'string',
                                                example: '541022104',
                                                maxLength: 35,
                                                description:
                                                  'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                              },
                                              PhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The principal owner's phone number, including the area code.",
                                              },
                                              MiddleInitial: {
                                                type: 'string',
                                                example: 'P',
                                                description:
                                                  'The middle initial of the name of the principal owner of the business.',
                                              },
                                              AltPhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The principal owner's alternate phone number, including the area code.",
                                              },
                                              DriversLicense: {
                                                type: 'object',
                                                properties: {
                                                  Number: {
                                                    type: 'string',
                                                    example: 'M15698025',
                                                    maxLength: 25,
                                                    description:
                                                      'The drivers license number of a principal owner.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    description:
                                                      'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                        AddedOnDate: {
                                          type: 'string',
                                          example: '10/13/2015',
                                          description:
                                            'Date the merchant was added to the MATCH database.',
                                        },
                                        PhoneNumber: {
                                          type: 'string',
                                          example: '3165557625',
                                          maxLength: 25,
                                          description:
                                            "The Business or Merchant's phone number, including the area code.",
                                        },
                                        MerchantMatch: {
                                          type: 'object',
                                          required: [
                                            'Name',
                                            'DoingBusinessAsName',
                                            'PhoneNumber',
                                            'Address',
                                            'AltPhoneNumber',
                                            'CountrySubdivisionTaxId',
                                            'NationalTaxId',
                                            'ServiceProvLegal',
                                            'ServiceProvDBA',
                                          ],
                                          properties: {
                                            Name: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The name of the Business which has been terminated.',
                                            },
                                            Address: {
                                              type: 'string',
                                              example: 'M01',
                                              description: 'Address of the merchant location.',
                                            },
                                            UrlMatch: {
                                              type: 'array',
                                              items: {
                                                type: 'object',
                                                required: ['url'],
                                                properties: {
                                                  url: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The URL associated with the Business which has been terminated.',
                                                  },
                                                },
                                              },
                                            },
                                            PhoneNumber: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The Business or Merchant’s phone number.',
                                            },
                                            NationalTaxId: {
                                              type: 'string',
                                              example: 'M02',
                                              description:
                                                'The National tax ID or business registration number. Return value will be hidden.',
                                            },
                                            AltPhoneNumber: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The Business or Merchant’s alternate phone number.',
                                            },
                                            PrincipalMatch: {
                                              type: 'array',
                                              items: {
                                                type: 'object',
                                                required: ['FirstName', 'LastName', 'Address'],
                                                properties: {
                                                  Address: {
                                                    type: 'object',
                                                    required: [
                                                      'Line1',
                                                      'City',
                                                      'PostalCode',
                                                      'Country',
                                                    ],
                                                    properties: {
                                                      City: {
                                                        type: 'string',
                                                        example: 'DALLAS',
                                                        maxLength: 40,
                                                        minLength: 1,
                                                        description:
                                                          'The name of the city for the location.',
                                                      },
                                                      Line1: {
                                                        type: 'string',
                                                        example: '42 ELM AVENUE',
                                                        maxLength: 60,
                                                        minLength: 1,
                                                        description:
                                                          'Line 1 of the street address for the location. Usually includes street number and name.',
                                                      },
                                                      Line2: {
                                                        type: 'string',
                                                        example: 'SUITE 201',
                                                        maxLength: 60,
                                                        description:
                                                          'Line 2 of the street address, usually an apartment number or suite number.',
                                                      },
                                                      Country: {
                                                        type: 'string',
                                                        example: 'USA',
                                                        maxLength: 3,
                                                        minLength: 1,
                                                        description:
                                                          'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                      },
                                                      Province: {
                                                        type: 'string',
                                                        example: 'US',
                                                        maxLength: 3,
                                                        description:
                                                          'The name of the province for the location.',
                                                      },
                                                      PostalCode: {
                                                        type: 'string',
                                                        example: '66579',
                                                        maxLength: 10,
                                                        minLength: 1,
                                                        description:
                                                          'The postal code for the location (only supported for US and Canada merchants).',
                                                      },
                                                      CountrySubdivision: {
                                                        type: 'string',
                                                        example: 'IL',
                                                        maxLength: 2,
                                                        description:
                                                          'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                      },
                                                    },
                                                  },
                                                  LastName: {
                                                    type: 'string',
                                                    example: 'SMITH',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The last name of the principal owner of the business.',
                                                  },
                                                  FirstName: {
                                                    type: 'string',
                                                    example: 'DAVID',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The first name of the principal owner of the business.',
                                                  },
                                                  NationalId: {
                                                    type: 'string',
                                                    example: '541022104',
                                                    maxLength: 35,
                                                    description:
                                                      'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                  },
                                                  PhoneNumber: {
                                                    type: 'string',
                                                    example: '3165557625',
                                                    maxLength: 25,
                                                    description:
                                                      "The principal owner's phone number, including the area code.",
                                                  },
                                                  MiddleInitial: {
                                                    type: 'string',
                                                    example: 'P',
                                                    description:
                                                      'The middle initial of the name of the principal owner of the business.',
                                                  },
                                                  AltPhoneNumber: {
                                                    type: 'string',
                                                    example: '3165557625',
                                                    maxLength: 25,
                                                    description:
                                                      "The principal owner's alternate phone number, including the area code.",
                                                  },
                                                  DriversLicense: {
                                                    type: 'object',
                                                    properties: {
                                                      Number: {
                                                        type: 'string',
                                                        example: 'M15698025',
                                                        maxLength: 25,
                                                        description:
                                                          'The drivers license number of a principal owner.',
                                                      },
                                                      Country: {
                                                        type: 'string',
                                                        example: 'USA',
                                                        maxLength: 3,
                                                        description:
                                                          'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                      },
                                                      CountrySubdivision: {
                                                        type: 'string',
                                                        example: 'IL',
                                                        maxLength: 2,
                                                        description:
                                                          'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                            ServiceProvDBA: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The name of the service provider associated with the merchant listed in the MATCH.',
                                            },
                                            ServiceProvLegal: {
                                              type: 'string',
                                              example: 'M00',
                                              description:
                                                'The name of the service provider associated with the merchant listed in the MATCH.',
                                            },
                                            DoingBusinessAsName: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The name used by a merchant that could be different from the legal name of the business.',
                                            },
                                            CountrySubdivisionTaxId: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
                                            },
                                          },
                                        },
                                        NationalTaxId: {
                                          type: 'string',
                                          example: '888596927',
                                          maxLength: 35,
                                          description:
                                            'The Merchant national tax ID, leave blank if not in the U.S region.',
                                        },
                                        AltPhoneNumber: {
                                          type: 'string',
                                          example: '3165557625',
                                          maxLength: 25,
                                          description:
                                            "The Business or Merchant's alternate phone number, including the area code.",
                                        },
                                        SearchCriteria: {
                                          type: 'object',
                                          required: ['SearchAll'],
                                          properties: {
                                            Region: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                example: 'A',
                                                description:
                                                  'Region in which the inquiry results must be obtained.',
                                              },
                                            },
                                            Country: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                example: 'USA',
                                                description:
                                                  'The three-digit country code of the principal owner.',
                                              },
                                            },
                                            SearchAll: {
                                              type: 'string',
                                              example: 'N',
                                              description:
                                                'Determines if the inquiry is worldwide or not.',
                                            },
                                            MinPossibleMatchCount: {
                                              type: 'string',
                                              example: '3',
                                              description:
                                                'Determines how many minimum matches present for a merchant or inquiry to appear in the results.',
                                            },
                                          },
                                        },
                                        ServiceProvDBA: {
                                          type: 'string',
                                          example: 'XYZ FINANCIAL SERVICE',
                                          maxLength: 60,
                                          description:
                                            'The name of the service provider associated with the merchant listed in the MATCH.',
                                        },
                                        ServiceProvLegal: {
                                          type: 'string',
                                          example: 'XYZ FINANCIAL SERVICE INCORPORATED',
                                          maxLength: 60,
                                          description:
                                            'The name of the service provider associated with the merchant listed in the MATCH.',
                                        },
                                        AddedByAcquirerID: {
                                          type: 'string',
                                          example: '1234',
                                          maxLength: 11,
                                          description:
                                            'The Member ICA that has added the merchant to the MATCH system.',
                                        },
                                        DoingBusinessAsName: {
                                          type: 'string',
                                          example: 'BAIT R US',
                                          maxLength: 110,
                                          description:
                                            'The name used by a merchant that could be different from the legal name of the business.',
                                        },
                                        TerminationReasonCode: {
                                          enum: [
                                            '00',
                                            '01',
                                            '02',
                                            '03',
                                            '04',
                                            '05',
                                            '06',
                                            '08',
                                            '09',
                                            '10',
                                            '11',
                                            '12',
                                            '13',
                                            '14',
                                            '20',
                                            '21',
                                            '24',
                                          ],
                                          type: 'string',
                                          example: '13',
                                          maxLength: 2,
                                          minLength: 2,
                                          description:
                                            'A two-digit numeric code indicating why a particular merchant was terminated.',
                                        },
                                        CountrySubdivisionTaxId: {
                                          type: 'string',
                                          example: '492321030',
                                          maxLength: 35,
                                          description:
                                            'The Merchant Country Subdivision tax ID, leave blank if not in the U.S region.',
                                        },
                                      },
                                    },
                                  },
                                },
                                name: {
                                  type: 'string',
                                },
                                urls: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['exactMatches', 'partialMatches'],
                                    properties: {
                                      exactMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                      partialMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                    },
                                  },
                                },
                                dateAdded: {
                                  type: 'string',
                                },
                                principals: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['exactMatches', 'partialMatches'],
                                    properties: {
                                      exactMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                      partialMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                    },
                                  },
                                },
                                exactMatches: {
                                  type: 'object',
                                  patternProperties: {
                                    '^(.*)$': {},
                                  },
                                },
                                partialMatches: {
                                  type: 'object',
                                  patternProperties: {
                                    '^(.*)$': {},
                                  },
                                },
                                exactMatchesAmount: {
                                  type: 'number',
                                },
                                partialMatchesAmount: {
                                  type: 'number',
                                },
                                terminationReasonCode: {
                                  enum: [
                                    '00',
                                    '01',
                                    '02',
                                    '03',
                                    '04',
                                    '05',
                                    '06',
                                    '08',
                                    '09',
                                    '10',
                                    '11',
                                    '12',
                                    '13',
                                    '14',
                                    '20',
                                    '21',
                                    '24',
                                  ],
                                  type: 'string',
                                  example: '13',
                                  maxLength: 2,
                                  minLength: 2,
                                  description:
                                    'A two-digit numeric code indicating why a particular merchant was terminated.',
                                },
                              },
                            },
                          },
                          terminatedMatchedMerchants: {
                            type: 'array',
                            items: {
                              type: 'object',
                              required: [
                                'name',
                                'exactMatchesAmount',
                                'partialMatchesAmount',
                                'exactMatches',
                                'partialMatches',
                                'principals',
                                'urls',
                                'raw',
                              ],
                              properties: {
                                raw: {
                                  type: 'object',
                                  required: ['Merchant'],
                                  properties: {
                                    Merchant: {
                                      type: 'object',
                                      required: ['Name'],
                                      properties: {
                                        Url: {
                                          type: 'array',
                                          items: {
                                            type: 'string',
                                            example: 'www.testmerchant.com',
                                            maxLength: 4000,
                                            description:
                                              'Website address of the merchant. A request may include multiple URLs.',
                                          },
                                        },
                                        Name: {
                                          type: 'string',
                                          example: 'THE BAIT SHOP',
                                          maxLength: 60,
                                          minLength: 1,
                                          description:
                                            'The name of the business assigned by the principal owner(s)',
                                        },
                                        Address: {
                                          type: 'object',
                                          required: ['Line1', 'City', 'PostalCode', 'Country'],
                                          properties: {
                                            City: {
                                              type: 'string',
                                              example: 'DALLAS',
                                              maxLength: 40,
                                              minLength: 1,
                                              description: 'The name of the city for the location.',
                                            },
                                            Line1: {
                                              type: 'string',
                                              example: '42 ELM AVENUE',
                                              maxLength: 60,
                                              minLength: 1,
                                              description:
                                                'Line 1 of the street address for the location. Usually includes street number and name.',
                                            },
                                            Line2: {
                                              type: 'string',
                                              example: 'SUITE 201',
                                              maxLength: 60,
                                              description:
                                                'Line 2 of the street address, usually an apartment number or suite number.',
                                            },
                                            Country: {
                                              type: 'string',
                                              example: 'USA',
                                              maxLength: 3,
                                              minLength: 1,
                                              description:
                                                'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                            },
                                            Province: {
                                              type: 'string',
                                              example: 'US',
                                              maxLength: 3,
                                              description:
                                                'The name of the province for the location.',
                                            },
                                            PostalCode: {
                                              type: 'string',
                                              example: '66579',
                                              maxLength: 10,
                                              minLength: 1,
                                              description:
                                                'The postal code for the location (only supported for US and Canada merchants).',
                                            },
                                            CountrySubdivision: {
                                              type: 'string',
                                              example: 'IL',
                                              maxLength: 2,
                                              description:
                                                'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                            },
                                          },
                                        },
                                        Comments: {
                                          type: 'string',
                                          example: 'Added for reasons of fraud',
                                          maxLength: 500,
                                          description:
                                            'Brief comments on why the merchant is added.',
                                        },
                                        UrlGroup: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            properties: {
                                              NoMatchUrls: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                              CloseMatchUrls: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                              ExactMatchUrls: {
                                                type: 'array',
                                                items: {
                                                  type: 'string',
                                                  example: 'www.testmerchant.com',
                                                  maxLength: 4000,
                                                  description:
                                                    'Website address of the merchant. A request may include multiple URLs.',
                                                },
                                              },
                                            },
                                          },
                                        },
                                        Principal: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['FirstName', 'LastName', 'Address'],
                                            properties: {
                                              Address: {
                                                type: 'object',
                                                required: [
                                                  'Line1',
                                                  'City',
                                                  'PostalCode',
                                                  'Country',
                                                ],
                                                properties: {
                                                  City: {
                                                    type: 'string',
                                                    example: 'DALLAS',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The name of the city for the location.',
                                                  },
                                                  Line1: {
                                                    type: 'string',
                                                    example: '42 ELM AVENUE',
                                                    maxLength: 60,
                                                    minLength: 1,
                                                    description:
                                                      'Line 1 of the street address for the location. Usually includes street number and name.',
                                                  },
                                                  Line2: {
                                                    type: 'string',
                                                    example: 'SUITE 201',
                                                    maxLength: 60,
                                                    description:
                                                      'Line 2 of the street address, usually an apartment number or suite number.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    minLength: 1,
                                                    description:
                                                      'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  Province: {
                                                    type: 'string',
                                                    example: 'US',
                                                    maxLength: 3,
                                                    description:
                                                      'The name of the province for the location.',
                                                  },
                                                  PostalCode: {
                                                    type: 'string',
                                                    example: '66579',
                                                    maxLength: 10,
                                                    minLength: 1,
                                                    description:
                                                      'The postal code for the location (only supported for US and Canada merchants).',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                              LastName: {
                                                type: 'string',
                                                example: 'SMITH',
                                                maxLength: 40,
                                                minLength: 1,
                                                description:
                                                  'The last name of the principal owner of the business.',
                                              },
                                              FirstName: {
                                                type: 'string',
                                                example: 'DAVID',
                                                maxLength: 40,
                                                minLength: 1,
                                                description:
                                                  'The first name of the principal owner of the business.',
                                              },
                                              NationalId: {
                                                type: 'string',
                                                example: '541022104',
                                                maxLength: 35,
                                                description:
                                                  'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                              },
                                              PhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The principal owner's phone number, including the area code.",
                                              },
                                              MiddleInitial: {
                                                type: 'string',
                                                example: 'P',
                                                description:
                                                  'The middle initial of the name of the principal owner of the business.',
                                              },
                                              AltPhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The principal owner's alternate phone number, including the area code.",
                                              },
                                              DriversLicense: {
                                                type: 'object',
                                                properties: {
                                                  Number: {
                                                    type: 'string',
                                                    example: 'M15698025',
                                                    maxLength: 25,
                                                    description:
                                                      'The drivers license number of a principal owner.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    description:
                                                      'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                        AddedOnDate: {
                                          type: 'string',
                                          example: '10/13/2015',
                                          description:
                                            'Date the merchant was added to the MATCH database.',
                                        },
                                        PhoneNumber: {
                                          type: 'string',
                                          example: '3165557625',
                                          maxLength: 25,
                                          description:
                                            "The Business or Merchant's phone number, including the area code.",
                                        },
                                        MerchantMatch: {
                                          type: 'object',
                                          required: [
                                            'Name',
                                            'DoingBusinessAsName',
                                            'PhoneNumber',
                                            'Address',
                                            'AltPhoneNumber',
                                            'CountrySubdivisionTaxId',
                                            'NationalTaxId',
                                            'ServiceProvLegal',
                                            'ServiceProvDBA',
                                          ],
                                          properties: {
                                            Name: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The name of the Business which has been terminated.',
                                            },
                                            Address: {
                                              type: 'string',
                                              example: 'M01',
                                              description: 'Address of the merchant location.',
                                            },
                                            UrlMatch: {
                                              type: 'array',
                                              items: {
                                                type: 'object',
                                                required: ['url'],
                                                properties: {
                                                  url: {
                                                    type: 'string',
                                                    example: 'M01',
                                                    description:
                                                      'The URL associated with the Business which has been terminated.',
                                                  },
                                                },
                                              },
                                            },
                                            PhoneNumber: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The Business or Merchant’s phone number.',
                                            },
                                            NationalTaxId: {
                                              type: 'string',
                                              example: 'M02',
                                              description:
                                                'The National tax ID or business registration number. Return value will be hidden.',
                                            },
                                            AltPhoneNumber: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The Business or Merchant’s alternate phone number.',
                                            },
                                            PrincipalMatch: {
                                              type: 'array',
                                              items: {
                                                type: 'object',
                                                required: ['FirstName', 'LastName', 'Address'],
                                                properties: {
                                                  Address: {
                                                    type: 'object',
                                                    required: [
                                                      'Line1',
                                                      'City',
                                                      'PostalCode',
                                                      'Country',
                                                    ],
                                                    properties: {
                                                      City: {
                                                        type: 'string',
                                                        example: 'DALLAS',
                                                        maxLength: 40,
                                                        minLength: 1,
                                                        description:
                                                          'The name of the city for the location.',
                                                      },
                                                      Line1: {
                                                        type: 'string',
                                                        example: '42 ELM AVENUE',
                                                        maxLength: 60,
                                                        minLength: 1,
                                                        description:
                                                          'Line 1 of the street address for the location. Usually includes street number and name.',
                                                      },
                                                      Line2: {
                                                        type: 'string',
                                                        example: 'SUITE 201',
                                                        maxLength: 60,
                                                        description:
                                                          'Line 2 of the street address, usually an apartment number or suite number.',
                                                      },
                                                      Country: {
                                                        type: 'string',
                                                        example: 'USA',
                                                        maxLength: 3,
                                                        minLength: 1,
                                                        description:
                                                          'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                      },
                                                      Province: {
                                                        type: 'string',
                                                        example: 'US',
                                                        maxLength: 3,
                                                        description:
                                                          'The name of the province for the location.',
                                                      },
                                                      PostalCode: {
                                                        type: 'string',
                                                        example: '66579',
                                                        maxLength: 10,
                                                        minLength: 1,
                                                        description:
                                                          'The postal code for the location (only supported for US and Canada merchants).',
                                                      },
                                                      CountrySubdivision: {
                                                        type: 'string',
                                                        example: 'IL',
                                                        maxLength: 2,
                                                        description:
                                                          'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                      },
                                                    },
                                                  },
                                                  LastName: {
                                                    type: 'string',
                                                    example: 'SMITH',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The last name of the principal owner of the business.',
                                                  },
                                                  FirstName: {
                                                    type: 'string',
                                                    example: 'DAVID',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The first name of the principal owner of the business.',
                                                  },
                                                  NationalId: {
                                                    type: 'string',
                                                    example: '541022104',
                                                    maxLength: 35,
                                                    description:
                                                      'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                                  },
                                                  PhoneNumber: {
                                                    type: 'string',
                                                    example: '3165557625',
                                                    maxLength: 25,
                                                    description:
                                                      "The principal owner's phone number, including the area code.",
                                                  },
                                                  MiddleInitial: {
                                                    type: 'string',
                                                    example: 'P',
                                                    description:
                                                      'The middle initial of the name of the principal owner of the business.',
                                                  },
                                                  AltPhoneNumber: {
                                                    type: 'string',
                                                    example: '3165557625',
                                                    maxLength: 25,
                                                    description:
                                                      "The principal owner's alternate phone number, including the area code.",
                                                  },
                                                  DriversLicense: {
                                                    type: 'object',
                                                    properties: {
                                                      Number: {
                                                        type: 'string',
                                                        example: 'M15698025',
                                                        maxLength: 25,
                                                        description:
                                                          'The drivers license number of a principal owner.',
                                                      },
                                                      Country: {
                                                        type: 'string',
                                                        example: 'USA',
                                                        maxLength: 3,
                                                        description:
                                                          'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                      },
                                                      CountrySubdivision: {
                                                        type: 'string',
                                                        example: 'IL',
                                                        maxLength: 2,
                                                        description:
                                                          'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                            ServiceProvDBA: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The name of the service provider associated with the merchant listed in the MATCH.',
                                            },
                                            ServiceProvLegal: {
                                              type: 'string',
                                              example: 'M00',
                                              description:
                                                'The name of the service provider associated with the merchant listed in the MATCH.',
                                            },
                                            DoingBusinessAsName: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The name used by a merchant that could be different from the legal name of the business.',
                                            },
                                            CountrySubdivisionTaxId: {
                                              type: 'string',
                                              example: 'M01',
                                              description:
                                                'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
                                            },
                                          },
                                        },
                                        NationalTaxId: {
                                          type: 'string',
                                          example: '888596927',
                                          maxLength: 35,
                                          description:
                                            'The Merchant national tax ID, leave blank if not in the U.S region.',
                                        },
                                        AltPhoneNumber: {
                                          type: 'string',
                                          example: '3165557625',
                                          maxLength: 25,
                                          description:
                                            "The Business or Merchant's alternate phone number, including the area code.",
                                        },
                                        SearchCriteria: {
                                          type: 'object',
                                          required: ['SearchAll'],
                                          properties: {
                                            Region: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                example: 'A',
                                                description:
                                                  'Region in which the inquiry results must be obtained.',
                                              },
                                            },
                                            Country: {
                                              type: 'array',
                                              items: {
                                                type: 'string',
                                                example: 'USA',
                                                description:
                                                  'The three-digit country code of the principal owner.',
                                              },
                                            },
                                            SearchAll: {
                                              type: 'string',
                                              example: 'N',
                                              description:
                                                'Determines if the inquiry is worldwide or not.',
                                            },
                                            MinPossibleMatchCount: {
                                              type: 'string',
                                              example: '3',
                                              description:
                                                'Determines how many minimum matches present for a merchant or inquiry to appear in the results.',
                                            },
                                          },
                                        },
                                        ServiceProvDBA: {
                                          type: 'string',
                                          example: 'XYZ FINANCIAL SERVICE',
                                          maxLength: 60,
                                          description:
                                            'The name of the service provider associated with the merchant listed in the MATCH.',
                                        },
                                        ServiceProvLegal: {
                                          type: 'string',
                                          example: 'XYZ FINANCIAL SERVICE INCORPORATED',
                                          maxLength: 60,
                                          description:
                                            'The name of the service provider associated with the merchant listed in the MATCH.',
                                        },
                                        AddedByAcquirerID: {
                                          type: 'string',
                                          example: '1234',
                                          maxLength: 11,
                                          description:
                                            'The Member ICA that has added the merchant to the MATCH system.',
                                        },
                                        DoingBusinessAsName: {
                                          type: 'string',
                                          example: 'BAIT R US',
                                          maxLength: 110,
                                          description:
                                            'The name used by a merchant that could be different from the legal name of the business.',
                                        },
                                        TerminationReasonCode: {
                                          enum: [
                                            '00',
                                            '01',
                                            '02',
                                            '03',
                                            '04',
                                            '05',
                                            '06',
                                            '08',
                                            '09',
                                            '10',
                                            '11',
                                            '12',
                                            '13',
                                            '14',
                                            '20',
                                            '21',
                                            '24',
                                          ],
                                          type: 'string',
                                          example: '13',
                                          maxLength: 2,
                                          minLength: 2,
                                          description:
                                            'A two-digit numeric code indicating why a particular merchant was terminated.',
                                        },
                                        CountrySubdivisionTaxId: {
                                          type: 'string',
                                          example: '492321030',
                                          maxLength: 35,
                                          description:
                                            'The Merchant Country Subdivision tax ID, leave blank if not in the U.S region.',
                                        },
                                      },
                                    },
                                    MerchantMatch: {
                                      type: 'object',
                                      required: [
                                        'Name',
                                        'DoingBusinessAsName',
                                        'PhoneNumber',
                                        'Address',
                                        'AltPhoneNumber',
                                        'CountrySubdivisionTaxId',
                                        'NationalTaxId',
                                        'ServiceProvLegal',
                                        'ServiceProvDBA',
                                      ],
                                      properties: {
                                        Name: {
                                          type: 'string',
                                          example: 'M01',
                                          description:
                                            'The name of the Business which has been terminated.',
                                        },
                                        Address: {
                                          type: 'string',
                                          example: 'M01',
                                          description: 'Address of the merchant location.',
                                        },
                                        UrlMatch: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['url'],
                                            properties: {
                                              url: {
                                                type: 'string',
                                                example: 'M01',
                                                description:
                                                  'The URL associated with the Business which has been terminated.',
                                              },
                                            },
                                          },
                                        },
                                        PhoneNumber: {
                                          type: 'string',
                                          example: 'M01',
                                          description: 'The Business or Merchant’s phone number.',
                                        },
                                        NationalTaxId: {
                                          type: 'string',
                                          example: 'M02',
                                          description:
                                            'The National tax ID or business registration number. Return value will be hidden.',
                                        },
                                        AltPhoneNumber: {
                                          type: 'string',
                                          example: 'M01',
                                          description:
                                            'The Business or Merchant’s alternate phone number.',
                                        },
                                        PrincipalMatch: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['FirstName', 'LastName', 'Address'],
                                            properties: {
                                              Address: {
                                                type: 'object',
                                                required: [
                                                  'Line1',
                                                  'City',
                                                  'PostalCode',
                                                  'Country',
                                                ],
                                                properties: {
                                                  City: {
                                                    type: 'string',
                                                    example: 'DALLAS',
                                                    maxLength: 40,
                                                    minLength: 1,
                                                    description:
                                                      'The name of the city for the location.',
                                                  },
                                                  Line1: {
                                                    type: 'string',
                                                    example: '42 ELM AVENUE',
                                                    maxLength: 60,
                                                    minLength: 1,
                                                    description:
                                                      'Line 1 of the street address for the location. Usually includes street number and name.',
                                                  },
                                                  Line2: {
                                                    type: 'string',
                                                    example: 'SUITE 201',
                                                    maxLength: 60,
                                                    description:
                                                      'Line 2 of the street address, usually an apartment number or suite number.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    minLength: 1,
                                                    description:
                                                      'The three-digit country code. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  Province: {
                                                    type: 'string',
                                                    example: 'US',
                                                    maxLength: 3,
                                                    description:
                                                      'The name of the province for the location.',
                                                  },
                                                  PostalCode: {
                                                    type: 'string',
                                                    example: '66579',
                                                    maxLength: 10,
                                                    minLength: 1,
                                                    description:
                                                      'The postal code for the location (only supported for US and Canada merchants).',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for the location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                              LastName: {
                                                type: 'string',
                                                example: 'SMITH',
                                                maxLength: 40,
                                                minLength: 1,
                                                description:
                                                  'The last name of the principal owner of the business.',
                                              },
                                              FirstName: {
                                                type: 'string',
                                                example: 'DAVID',
                                                maxLength: 40,
                                                minLength: 1,
                                                description:
                                                  'The first name of the principal owner of the business.',
                                              },
                                              NationalId: {
                                                type: 'string',
                                                example: '541022104',
                                                maxLength: 35,
                                                description:
                                                  'The Social Security number of a principal owner. If the principal owner is not from the U.S. Region, then use their national ID card number.',
                                              },
                                              PhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The principal owner's phone number, including the area code.",
                                              },
                                              MiddleInitial: {
                                                type: 'string',
                                                example: 'P',
                                                description:
                                                  'The middle initial of the name of the principal owner of the business.',
                                              },
                                              AltPhoneNumber: {
                                                type: 'string',
                                                example: '3165557625',
                                                maxLength: 25,
                                                description:
                                                  "The principal owner's alternate phone number, including the area code.",
                                              },
                                              DriversLicense: {
                                                type: 'object',
                                                properties: {
                                                  Number: {
                                                    type: 'string',
                                                    example: 'M15698025',
                                                    maxLength: 25,
                                                    description:
                                                      'The drivers license number of a principal owner.',
                                                  },
                                                  Country: {
                                                    type: 'string',
                                                    example: 'USA',
                                                    maxLength: 3,
                                                    description:
                                                      'The three-digit country code of the principal owner. Valid values are Three digit alpha country codes as defined in ISO 3166-1.',
                                                  },
                                                  CountrySubdivision: {
                                                    type: 'string',
                                                    example: 'IL',
                                                    maxLength: 2,
                                                    description:
                                                      'The abbreviated state or province code for a merchant location (only supported for US and Canada merchants).',
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                        ServiceProvDBA: {
                                          type: 'string',
                                          example: 'M01',
                                          description:
                                            'The name of the service provider associated with the merchant listed in the MATCH.',
                                        },
                                        ServiceProvLegal: {
                                          type: 'string',
                                          example: 'M00',
                                          description:
                                            'The name of the service provider associated with the merchant listed in the MATCH.',
                                        },
                                        DoingBusinessAsName: {
                                          type: 'string',
                                          example: 'M01',
                                          description:
                                            'The name used by a merchant that could be different from the legal name of the business.',
                                        },
                                        CountrySubdivisionTaxId: {
                                          type: 'string',
                                          example: 'M01',
                                          description:
                                            'The Merchant’s state tax ID; for the U.S region only. Return value will be hidden.',
                                        },
                                      },
                                    },
                                  },
                                },
                                name: {
                                  type: 'string',
                                },
                                urls: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['exactMatches', 'partialMatches'],
                                    properties: {
                                      exactMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                      partialMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                    },
                                  },
                                },
                                dateAdded: {
                                  type: 'string',
                                },
                                principals: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    required: ['exactMatches', 'partialMatches'],
                                    properties: {
                                      exactMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                      partialMatches: {
                                        type: 'object',
                                        patternProperties: {
                                          '^(.*)$': {},
                                        },
                                      },
                                    },
                                  },
                                },
                                exactMatches: {
                                  type: 'object',
                                  patternProperties: {
                                    '^(.*)$': {},
                                  },
                                },
                                partialMatches: {
                                  type: 'object',
                                  patternProperties: {
                                    '^(.*)$': {},
                                  },
                                },
                                exactMatchesAmount: {
                                  type: 'number',
                                },
                                partialMatchesAmount: {
                                  type: 'number',
                                },
                                terminationReasonCode: {
                                  enum: [
                                    '00',
                                    '01',
                                    '02',
                                    '03',
                                    '04',
                                    '05',
                                    '06',
                                    '08',
                                    '09',
                                    '10',
                                    '11',
                                    '12',
                                    '13',
                                    '14',
                                    '20',
                                    '21',
                                    '24',
                                  ],
                                  type: 'string',
                                  example: '13',
                                  maxLength: 2,
                                  minLength: 2,
                                  description:
                                    'A two-digit numeric code indicating why a particular merchant was terminated.',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                  merchantMonitoring: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'object',
                        properties: {},
                        additionalProperties: true,
                      },
                    },
                  },
                  businessInformation: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'number',
                      },
                      data: {
                        anyOf: [
                          {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                },
                                number: {
                                  type: 'string',
                                },
                                shares: {
                                  type: 'array',
                                  items: {
                                    type: 'object',
                                    properties: {
                                      shareType: {
                                        type: 'string',
                                      },
                                      issuedCapital: {
                                        type: 'string',
                                      },
                                      paidUpCapital: {
                                        type: 'string',
                                      },
                                      shareAllotted: {
                                        type: 'string',
                                      },
                                      shareCurrency: {
                                        type: 'string',
                                      },
                                    },
                                  },
                                },
                                status: {
                                  type: 'string',
                                },
                                expiryDate: {
                                  type: 'string',
                                },
                                statusDate: {
                                  type: 'string',
                                },
                                companyName: {
                                  type: 'string',
                                },
                                companyType: {
                                  type: 'string',
                                },
                                lastUpdated: {
                                  type: 'string',
                                },
                                historyNames: {
                                  type: 'array',
                                  items: {
                                    type: 'string',
                                  },
                                },
                                businessScope: {
                                  type: 'object',
                                  properties: {
                                    code: {
                                      type: 'string',
                                    },
                                    description: {
                                      type: 'string',
                                    },
                                    otherDescription: {
                                      type: 'string',
                                    },
                                  },
                                },
                                establishDate: {
                                  type: 'string',
                                },
                                lastFinancialDate: {
                                  type: 'string',
                                },
                                registeredAddress: {
                                  type: 'object',
                                  properties: {
                                    postalCode: {
                                      type: 'string',
                                    },
                                    streetName: {
                                      type: 'string',
                                    },
                                    unitNumber: {
                                      type: 'string',
                                    },
                                    levelNumber: {
                                      type: 'string',
                                    },
                                    buildingName: {
                                      type: 'string',
                                    },
                                    blockHouseNumber: {
                                      type: 'string',
                                    },
                                  },
                                },
                                lastAnnualReturnDate: {
                                  type: 'string',
                                },
                                lastAnnualGeneralMeetingDate: {
                                  type: 'string',
                                },
                              },
                            },
                          },
                          {
                            type: 'array',
                            items: {
                              type: 'object',
                              patternProperties: {
                                '^(.*)$': {},
                              },
                            },
                          },
                        ],
                      },
                      name: {
                        type: 'string',
                      },
                      reason: {
                        type: 'string',
                      },
                      status: {
                        type: 'string',
                      },
                      message: {
                        type: 'string',
                      },
                      invokedAt: {
                        type: 'number',
                      },
                      jurisdictionCode: {
                        type: 'string',
                      },
                    },
                  },
                },
                additionalProperties: true,
              },
              collectionFlow: {
                type: 'object',
                properties: {
                  state: {
                    type: 'object',
                    required: ['currentStep', 'status'],
                    properties: {
                      steps: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['stepName', 'isCompleted'],
                          properties: {
                            stepName: {
                              type: 'string',
                            },
                            isCompleted: {
                              type: 'boolean',
                            },
                          },
                        },
                      },
                      status: {
                        anyOf: [
                          {
                            type: 'string',
                            const: 'pending',
                          },
                          {
                            type: 'string',
                            const: 'inprogress',
                          },
                          {
                            type: 'string',
                            const: 'approved',
                          },
                          {
                            type: 'string',
                            const: 'rejected',
                          },
                          {
                            type: 'string',
                            const: 'revision',
                          },
                          {
                            type: 'string',
                            const: 'failed',
                          },
                          {
                            type: 'string',
                            const: 'completed',
                          },
                        ],
                      },
                      currentStep: {
                        type: 'string',
                      },
                    },
                  },
                  config: {
                    type: 'object',
                    required: ['apiUrl'],
                    properties: {
                      apiUrl: {
                        type: 'string',
                      },
                    },
                  },
                  additionalInformation: {
                    type: 'object',
                    properties: {
                      customerCompany: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        documentsSchema: null,
      },
      childWorkflowsRuntimeData: [
        {
          id: 'cm7thumz2031vs40k3530brlp',
          tags: null,
          state: 'kyc_manual_review',
          config: {
            language: 'en',
            callbackResult: {
              deliverEvent: 'KYC_DONE',
              transformers: [
                {
                  mapping: '{data: @}',
                  transformer: 'jmespath',
                },
              ],
            },
          },
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'Johnathan4@hotmail.com',
                lastName: 'Reed',
                firstName: 'Johnathan',
                additionalInfo: {
                  role: 'Forward Creative Officer',
                  companyName: 'Corkery, Medhurst and Waelchi',
                  dateOfBirth: '2024-07-23T11:51:25.861Z',
                  customerCompany: 'Gadi inc',
                  __isGeneratedAutomatically: true,
                },
              },
              type: 'individual',
              ballerineEntityId: '708c3049-81ed-48dc-a701-7c28a4e37ca3',
            },
            metadata: {
              customerId: 'demo-customer-id',
              customerName: 'gadiinc',
              customerNormalizedName: 'gadiinc',
            },
            documents: [
              {
                id: '09220724-092e-4c34-9538-ab8f5175b53d',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy5031bs40k37tj9h24',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy7031ds40keel3lp93',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20copy.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy9031fs40khh88h1oo',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20copy.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyc031hs40ke0oi4iw8',
                  },
                ],
                issuer: {
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2023-09-04',
                    validUntil: '2033-09-03',
                  },
                },
                category: 'passport',
                properties: {
                  idNumber: '0-2157378-7',
                  validFrom: '2023-09-04',
                  expiryDate: '2033-09-03',
                  validUntil: '2033-09-03',
                },
                issuingVersion: 1,
              },
            ],
            flowConfig: {},
            customerName: 'gadiinc',
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      id: '0014b5e8-b3b7-4f0e-a3c1-c91d097c508c',
                      hits: [
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                "China Standing Committee of Xiangxi Tujia and Miao Autonomous Prefecture People's Congress Leadership",
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'ComplyAdvantage PEP Data',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['China'],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'John Reid',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: [],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Jonathan Reid',
                          adverseMedia: [],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                'China Credit Bureau Untrustworthy Persons Subject to Enforcement (Suspended)',
                            },
                          ],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Brazil Diplomatic Missions Foreign',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Brazil'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Johnny Reed',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canada Diplomatic Missions Foreign',
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canada Diplomatic Missions Foreign Representatives',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Canada', 'China'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'John Reed',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                      ],
                      vendor: 'dow-jones',
                      clientId: '645c8604-d74c-443f-a9e3-a0f60c8af59f',
                      checkType: 'initial_result',
                      createdAt: '2025-03-03T20:09:48.468Z',
                      endUserId: '1fa9a3a3-2ebf-4841-b87a-5a34fd6c5d1d',
                      matchStatus: 'possible_match',
                    },
                    entity: {
                      data: {
                        lastName: 'Reed',
                        firstName: 'Johnathan',
                        dateOfBirth: '2024-07-23',
                        additionalInfo: {
                          gender: 'M',
                          nationality: 'IL',
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      decisionScore: 1,
                    },
                    metadata: {
                      id: 'ceae385f-2b12-47ae-a793-4662806ff924',
                      url: '',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            ballerineEntityId: '647740b9-6d0c-4fda-9201-fb60ec377687',
          },
          assignee: null,
          business: null,
          createdAt: '2025-03-03T20:09:48.408Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'kyc_email_session_example',
            name: 'kyc_email_session_example',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            version: 1,
            definition: {
              id: 'kyc_email_session_example_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          endUser: {
            id: '647740b9-6d0c-4fda-9201-fb60ec377687',
            isContactPerson: false,
            correlationId: null,
            endUserType: 'individual',
            approvalState: 'NEW',
            stateReason: null,
            firstName: 'Johnathan',
            lastName: 'Reed',
            email: null,
            phone: null,
            country: null,
            dateOfBirth: null,
            avatarUrl: null,
            nationalId: null,
            gender: null,
            nationality: null,
            passportNumber: null,
            address: null,
            additionalInfo: null,
            activeMonitorings: [],
            amlHits: [],
            createdAt: '2025-03-03T20:09:48.408Z',
            updatedAt: '2025-03-03T20:09:48.408Z',
            projectId: 'cm7thul6z02uosb0kvsoxsfxh',
          },
        },
        {
          id: 'cm7thumz7031xs40ko5gntnib',
          tags: null,
          state: 'kyc_manual_review',
          config: {
            language: 'en',
            callbackResult: {
              deliverEvent: 'KYC_DONE',
              transformers: [
                {
                  mapping: '{data: @}',
                  transformer: 'jmespath',
                },
              ],
            },
          },
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'Carlton_Cushnie60@yahoo.com',
                lastName: 'Ellington Cushnie',
                firstName: 'Carlton',
                additionalInfo: {
                  role: 'Senior Data Manager',
                  companyName: 'Rodriguez, Botsford and Romaguera',
                  dateOfBirth: '2024-04-26T04:15:12.165Z',
                  customerCompany: 'Gadi inc',
                  __isGeneratedAutomatically: true,
                },
              },
              type: 'individual',
              ballerineEntityId: 'aa1d15f6-9606-40fe-b401-492a0644c999',
            },
            metadata: {
              customerId: 'demo-customer-id',
              customerName: 'gadiinc',
              customerNormalizedName: 'gadiinc',
            },
            documents: [
              {
                id: '15632a41-58fb-411d-af3a-1b26120e03d5',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport%20Selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyd031js40k2z20nf6j',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport%20Selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumye031ls40k6mx15eb4',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport-12313.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyg031ns40kmngk2zsw',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport-12313.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyh031ps40k1d3tgt7m',
                  },
                ],
                issuer: {
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2023-09-04',
                    validUntil: '2033-09-03',
                  },
                },
                category: 'passport',
                properties: {
                  idNumber: '0-2157378-7',
                  validFrom: '2023-09-04',
                  expiryDate: '2033-09-03',
                  validUntil: '2033-09-03',
                },
                issuingVersion: 1,
              },
            ],
            flowConfig: {},
            customerName: 'gadiinc',
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      id: '19d80894-05e6-4f47-a2c0-e1112b590cbf',
                      hits: [
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom'],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Carlton Ellington Cushnie',
                          adverseMedia: [
                            {
                              date: null,
                              type: null,
                              sourceUrl:
                                'https://www.thetimes.com/business-money/companies/article/london-capital-and-finance-was-a-ponzi-scheme-judge-finds-stwrhx6v8?region=global',
                              sourceName:
                                'The Times - London Capital and Finance was a Ponzi scheme, judge finds',
                            },
                          ],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                'High-Risk UBO Connection - Linked to fraudulent payment scheme',
                            },
                          ],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom'],
                          sanctions: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'UK Financial Conduct Authority Sanctions List',
                            },
                          ],
                          matchTypes: ['name_exact'],
                          matchedName: 'Carlton E. Cushnie',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Carlton Cushnie',
                          adverseMedia: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                'Previously shut-down fraudulent payment scheme investigation',
                            },
                          ],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom', 'United States'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Carlton E. Cushnie',
                          adverseMedia: [],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Financial fraud watchlist',
                            },
                          ],
                        },
                      ],
                      vendor: 'veriff',
                      clientId: 'bbdc2fce-92af-4ab1-81dd-307c5f2474a5',
                      checkType: 'initial_result',
                      createdAt: '2025-03-03T20:09:48.474Z',
                      endUserId: '7616b3c1-7f30-4ad8-998a-ffeeb71ce0b6',
                      matchStatus: 'possible_match',
                    },
                    entity: {
                      data: {
                        lastName: 'Ellington Cushnie',
                        firstName: 'Carlton',
                        dateOfBirth: '2024-04-26',
                        additionalInfo: {
                          gender: 'M',
                          nationality: 'IL',
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      decisionScore: 1,
                    },
                    metadata: {
                      id: 'de335315-ebba-4741-922a-1903036894bf',
                      url: '',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            ballerineEntityId: '79ff1e99-414b-48e2-a667-e611068136b4',
          },
          assignee: null,
          business: null,
          createdAt: '2025-03-03T20:09:48.408Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'kyc_email_session_example',
            name: 'kyc_email_session_example',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            version: 1,
            definition: {
              id: 'kyc_email_session_example_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          endUser: {
            id: '79ff1e99-414b-48e2-a667-e611068136b4',
            isContactPerson: false,
            correlationId: null,
            endUserType: 'individual',
            approvalState: 'NEW',
            stateReason: null,
            firstName: 'Carlton',
            lastName: 'Ellington Cushnie',
            email: null,
            phone: null,
            country: null,
            dateOfBirth: null,
            avatarUrl: null,
            nationalId: null,
            gender: null,
            nationality: null,
            passportNumber: null,
            address: null,
            additionalInfo: null,
            activeMonitorings: [],
            amlHits: [],
            createdAt: '2025-03-03T20:09:48.408Z',
            updatedAt: '2025-03-03T20:09:48.408Z',
            projectId: 'cm7thul6z02uosb0kvsoxsfxh',
          },
        },
        {
          id: 'cm7thumyw031ts40kh7mhw96w',
          tags: null,
          state: 'kyc_manual_review',
          config: {
            language: 'en',
            callbackResult: {
              deliverEvent: 'KYC_DONE',
              transformers: [
                {
                  mapping: '{data: @}',
                  transformer: 'jmespath',
                },
              ],
            },
          },
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'Robert.Carter82@gmail.com',
                lastName: 'Carter',
                firstName: 'Robert',
                additionalInfo: {
                  role: 'Forward Response Orchestrator',
                  companyName: 'Von Group',
                  dateOfBirth: '2024-06-22T07:22:03.629Z',
                  customerCompany: 'Gadi inc',
                  __isGeneratedAutomatically: true,
                },
              },
              type: 'individual',
              ballerineEntityId: '419ed486-2bd6-413b-a144-332825f22c14',
            },
            metadata: {
              customerId: 'demo-customer-id',
              customerName: 'gadiinc',
              customerNormalizedName: 'gadiinc',
            },
            documents: [
              {
                id: '7c1a31c6-6935-4c06-a57c-dca1e7d71ab2',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/Armenia_selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumxz0313s40kxjmb3bid',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/Armenia_selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy10315s40kv8g23kc1',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/canada%20license%20front.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy20317s40kzaqy6pzz',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/canada%20license%20front.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy40319s40ka4lzk5k9',
                  },
                ],
                issuer: {
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2023-09-04',
                    validUntil: '2033-09-03',
                  },
                },
                category: 'passport',
                properties: {
                  idNumber: '0-2157378-7',
                  validFrom: '2023-09-04',
                  expiryDate: '2033-09-03',
                  validUntil: '2033-09-03',
                },
                issuingVersion: 1,
              },
            ],
            flowConfig: {},
            customerName: 'gadiinc',
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      id: 'fa0c3dac-fe1b-4892-a8f2-b1e31305062f',
                      hits: [
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                "U.S. Department of State's Office of Foreign Assets Control (OFAC) Sanctions List",
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'ComplyAdvantage PEP Data',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['United States'],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Rob Carter',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: [],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Robert Farter',
                          adverseMedia: [],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'National Fraud Database - High Risk Individuals',
                            },
                          ],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Brazilian Federal Police Watchlist',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Brazil'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Robbie Cartier',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canadian Government Sanctions List',
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canadian National Security Review',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Canada', 'United States'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Robbert Cartter',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                      ],
                      vendor: 'dow-jones',
                      clientId: '7429577f-cd89-46d9-ad06-70f296a62d86',
                      checkType: 'initial_result',
                      createdAt: '2025-03-03T20:09:48.461Z',
                      endUserId: 'aebe7271-b6ce-4d24-b5bc-ac03f1f8bdda',
                      matchStatus: 'possible_match',
                    },
                    entity: {
                      data: {
                        lastName: 'Carter',
                        firstName: 'Robert',
                        dateOfBirth: '2024-06-22',
                        additionalInfo: {
                          gender: 'M',
                          nationality: 'IL',
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      decisionScore: 1,
                    },
                    metadata: {
                      id: '0669fd83-6572-42e5-8f2a-dd7ca7c60db1',
                      url: '',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            ballerineEntityId: '978ebceb-e3f2-48e8-8273-376719528c17',
          },
          assignee: null,
          business: null,
          createdAt: '2025-03-03T20:09:48.408Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'kyc_email_session_example',
            name: 'kyc_email_session_example',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            version: 1,
            definition: {
              id: 'kyc_email_session_example_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          endUser: {
            id: '978ebceb-e3f2-48e8-8273-376719528c17',
            isContactPerson: false,
            correlationId: null,
            endUserType: 'individual',
            approvalState: 'NEW',
            stateReason: null,
            firstName: 'Robert',
            lastName: 'Carter',
            email: null,
            phone: null,
            country: null,
            dateOfBirth: null,
            avatarUrl: null,
            nationalId: null,
            gender: null,
            nationality: null,
            passportNumber: null,
            address: null,
            additionalInfo: null,
            activeMonitorings: [],
            amlHits: [],
            createdAt: '2025-03-03T20:09:48.408Z',
            updatedAt: '2025-03-03T20:09:48.408Z',
            projectId: 'cm7thul6z02uosb0kvsoxsfxh',
          },
        },
      ],
      entity: {
        id: '82e06a10-09bb-4818-ad2d-9eb5008f2253',
        name: 'GreenTech Solutions Ltd.',
        approvalState: 'NEW',
        avatarUrl: null,
      },
      nextEvents: [
        'UPDATE_CONTEXT',
        'DEEP_MERGE_CONTEXT',
        'reject',
        'approve',
        'revision',
        'KYC_REVISION',
      ],
      childWorkflows: [
        {
          id: 'cm7thumz2031vs40k3530brlp',
          tags: null,
          state: 'kyc_manual_review',
          config: {
            language: 'en',
            callbackResult: {
              deliverEvent: 'KYC_DONE',
              transformers: [
                {
                  mapping: '{data: @}',
                  transformer: 'jmespath',
                },
              ],
            },
          },
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'Johnathan4@hotmail.com',
                lastName: 'Reed',
                firstName: 'Johnathan',
                additionalInfo: {
                  role: 'Forward Creative Officer',
                  companyName: 'Corkery, Medhurst and Waelchi',
                  dateOfBirth: '2024-07-23T11:51:25.861Z',
                  customerCompany: 'Gadi inc',
                  __isGeneratedAutomatically: true,
                },
              },
              type: 'individual',
              ballerineEntityId: '708c3049-81ed-48dc-a701-7c28a4e37ca3',
            },
            metadata: {
              customerId: 'demo-customer-id',
              customerName: 'gadiinc',
              customerNormalizedName: 'gadiinc',
            },
            documents: [
              {
                id: '09220724-092e-4c34-9538-ab8f5175b53d',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy5031bs40k37tj9h24',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy7031ds40keel3lp93',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20copy.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy9031fs40khh88h1oo',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/us_green_card%20copy.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyc031hs40ke0oi4iw8',
                  },
                ],
                issuer: {
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2023-09-04',
                    validUntil: '2033-09-03',
                  },
                },
                category: 'passport',
                properties: {
                  idNumber: '0-2157378-7',
                  validFrom: '2023-09-04',
                  expiryDate: '2033-09-03',
                  validUntil: '2033-09-03',
                },
                issuingVersion: 1,
                propertiesSchema: {
                  properties: {},
                },
              },
            ],
            flowConfig: {},
            customerName: 'gadiinc',
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      id: '0014b5e8-b3b7-4f0e-a3c1-c91d097c508c',
                      hits: [
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                "China Standing Committee of Xiangxi Tujia and Miao Autonomous Prefecture People's Congress Leadership",
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'ComplyAdvantage PEP Data',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['China'],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'John Reid',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: [],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Jonathan Reid',
                          adverseMedia: [],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                'China Credit Bureau Untrustworthy Persons Subject to Enforcement (Suspended)',
                            },
                          ],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Brazil Diplomatic Missions Foreign',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Brazil'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Johnny Reed',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canada Diplomatic Missions Foreign',
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canada Diplomatic Missions Foreign Representatives',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Canada', 'China'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'John Reed',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                      ],
                      vendor: 'dow-jones',
                      clientId: '645c8604-d74c-443f-a9e3-a0f60c8af59f',
                      checkType: 'initial_result',
                      createdAt: '2025-03-03T20:09:48.468Z',
                      endUserId: '1fa9a3a3-2ebf-4841-b87a-5a34fd6c5d1d',
                      matchStatus: 'possible_match',
                    },
                    entity: {
                      data: {
                        lastName: 'Reed',
                        firstName: 'Johnathan',
                        dateOfBirth: '2024-07-23',
                        additionalInfo: {
                          gender: 'M',
                          nationality: 'IL',
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      decisionScore: 1,
                    },
                    metadata: {
                      id: 'ceae385f-2b12-47ae-a793-4662806ff924',
                      url: '',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            ballerineEntityId: '647740b9-6d0c-4fda-9201-fb60ec377687',
          },
          assignee: null,
          createdAt: '2025-03-03T20:09:48.408Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'kyc_email_session_example',
            name: 'kyc_email_session_example',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            version: 1,
            definition: {
              id: 'kyc_email_session_example_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          entity: {
            id: '647740b9-6d0c-4fda-9201-fb60ec377687',
            name: 'Johnathan Reed',
            avatarUrl: null,
            approvalState: 'NEW',
          },
          nextEvents: ['UPDATE_CONTEXT', 'DEEP_MERGE_CONTEXT', 'reject', 'approve', 'revision'],
          childWorkflows: [],
        },
        {
          id: 'cm7thumz7031xs40ko5gntnib',
          tags: null,
          state: 'kyc_manual_review',
          config: {
            language: 'en',
            callbackResult: {
              deliverEvent: 'KYC_DONE',
              transformers: [
                {
                  mapping: '{data: @}',
                  transformer: 'jmespath',
                },
              ],
            },
          },
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'Carlton_Cushnie60@yahoo.com',
                lastName: 'Ellington Cushnie',
                firstName: 'Carlton',
                additionalInfo: {
                  role: 'Senior Data Manager',
                  companyName: 'Rodriguez, Botsford and Romaguera',
                  dateOfBirth: '2024-04-26T04:15:12.165Z',
                  customerCompany: 'Gadi inc',
                  __isGeneratedAutomatically: true,
                },
              },
              type: 'individual',
              ballerineEntityId: 'aa1d15f6-9606-40fe-b401-492a0644c999',
            },
            metadata: {
              customerId: 'demo-customer-id',
              customerName: 'gadiinc',
              customerNormalizedName: 'gadiinc',
            },
            documents: [
              {
                id: '15632a41-58fb-411d-af3a-1b26120e03d5',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport%20Selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyd031js40k2z20nf6j',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport%20Selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumye031ls40k6mx15eb4',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport-12313.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyg031ns40kmngk2zsw',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport-12313.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumyh031ps40k1d3tgt7m',
                  },
                ],
                issuer: {
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2023-09-04',
                    validUntil: '2033-09-03',
                  },
                },
                category: 'passport',
                properties: {
                  idNumber: '0-2157378-7',
                  validFrom: '2023-09-04',
                  expiryDate: '2033-09-03',
                  validUntil: '2033-09-03',
                },
                issuingVersion: 1,
                propertiesSchema: {
                  properties: {},
                },
              },
            ],
            flowConfig: {},
            customerName: 'gadiinc',
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      id: '19d80894-05e6-4f47-a2c0-e1112b590cbf',
                      hits: [
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom'],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Carlton Ellington Cushnie',
                          adverseMedia: [
                            {
                              date: null,
                              type: null,
                              sourceUrl:
                                'https://www.thetimes.com/business-money/companies/article/london-capital-and-finance-was-a-ponzi-scheme-judge-finds-stwrhx6v8?region=global',
                              sourceName:
                                'The Times - London Capital and Finance was a Ponzi scheme, judge finds',
                            },
                          ],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                'High-Risk UBO Connection - Linked to fraudulent payment scheme',
                            },
                          ],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom'],
                          sanctions: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'UK Financial Conduct Authority Sanctions List',
                            },
                          ],
                          matchTypes: ['name_exact'],
                          matchedName: 'Carlton E. Cushnie',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Carlton Cushnie',
                          adverseMedia: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                'Previously shut-down fraudulent payment scheme investigation',
                            },
                          ],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: ['United Kingdom', 'United States'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Carlton E. Cushnie',
                          adverseMedia: [],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Financial fraud watchlist',
                            },
                          ],
                        },
                      ],
                      vendor: 'veriff',
                      clientId: 'bbdc2fce-92af-4ab1-81dd-307c5f2474a5',
                      checkType: 'initial_result',
                      createdAt: '2025-03-03T20:09:48.474Z',
                      endUserId: '7616b3c1-7f30-4ad8-998a-ffeeb71ce0b6',
                      matchStatus: 'possible_match',
                    },
                    entity: {
                      data: {
                        lastName: 'Ellington Cushnie',
                        firstName: 'Carlton',
                        dateOfBirth: '2024-04-26',
                        additionalInfo: {
                          gender: 'M',
                          nationality: 'IL',
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      decisionScore: 1,
                    },
                    metadata: {
                      id: 'de335315-ebba-4741-922a-1903036894bf',
                      url: '',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            ballerineEntityId: '79ff1e99-414b-48e2-a667-e611068136b4',
          },
          assignee: null,
          createdAt: '2025-03-03T20:09:48.408Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'kyc_email_session_example',
            name: 'kyc_email_session_example',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            version: 1,
            definition: {
              id: 'kyc_email_session_example_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          entity: {
            id: '79ff1e99-414b-48e2-a667-e611068136b4',
            name: 'Carlton Ellington Cushnie',
            avatarUrl: null,
            approvalState: 'NEW',
          },
          nextEvents: ['UPDATE_CONTEXT', 'DEEP_MERGE_CONTEXT', 'reject', 'approve', 'revision'],
          childWorkflows: [],
        },
        {
          id: 'cm7thumyw031ts40kh7mhw96w',
          tags: null,
          state: 'kyc_manual_review',
          config: {
            language: 'en',
            callbackResult: {
              deliverEvent: 'KYC_DONE',
              transformers: [
                {
                  mapping: '{data: @}',
                  transformer: 'jmespath',
                },
              ],
            },
          },
          status: 'active',
          context: {
            entity: {
              data: {
                email: 'Robert.Carter82@gmail.com',
                lastName: 'Carter',
                firstName: 'Robert',
                additionalInfo: {
                  role: 'Forward Response Orchestrator',
                  companyName: 'Von Group',
                  dateOfBirth: '2024-06-22T07:22:03.629Z',
                  customerCompany: 'Gadi inc',
                  __isGeneratedAutomatically: true,
                },
              },
              type: 'individual',
              ballerineEntityId: '419ed486-2bd6-413b-a144-332825f22c14',
            },
            metadata: {
              customerId: 'demo-customer-id',
              customerName: 'gadiinc',
              customerNormalizedName: 'gadiinc',
            },
            documents: [
              {
                id: '7c1a31c6-6935-4c06-a57c-dca1e7d71ab2',
                type: 'identification_document',
                pages: [
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/Armenia_selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumxz0313s40kxjmb3bid',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/Armenia_selfie.png',
                    type: 'jpg',
                    metadata: {
                      side: 'face-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy10315s40kv8g23kc1',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/canada%20license%20front.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy20317s40kzaqy6pzz',
                  },
                  {
                    uri: 'https://cdn.ballerine.io/merch-ss/canada%20license%20front.png',
                    type: 'jpg',
                    metadata: {
                      side: 'front-pre',
                    },
                    provider: 'http',
                    ballerineFileId: 'cm7thumy40319s40ka4lzk5k9',
                  },
                ],
                issuer: {
                  country: 'IL',
                  additionalInfo: {
                    validFrom: '2023-09-04',
                    validUntil: '2033-09-03',
                  },
                },
                category: 'passport',
                properties: {
                  idNumber: '0-2157378-7',
                  validFrom: '2023-09-04',
                  expiryDate: '2033-09-03',
                  validUntil: '2033-09-03',
                },
                issuingVersion: 1,
                propertiesSchema: {
                  properties: {},
                },
              },
            ],
            flowConfig: {},
            customerName: 'gadiinc',
            pluginsOutput: {
              kyc_session: {
                kyc_session_1: {
                  type: 'kyc',
                  result: {
                    aml: {
                      id: 'fa0c3dac-fe1b-4892-a8f2-b1e31305062f',
                      hits: [
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName:
                                "U.S. Department of State's Office of Foreign Assets Control (OFAC) Sanctions List",
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'ComplyAdvantage PEP Data',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['United States'],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Rob Carter',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [],
                          other: [],
                          warnings: [],
                          countries: [],
                          sanctions: [],
                          matchTypes: ['name_exact'],
                          matchedName: 'Robert Farter',
                          adverseMedia: [],
                          fitnessProbity: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'National Fraud Database - High Risk Individuals',
                            },
                          ],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Brazilian Federal Police Watchlist',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Brazil'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Robbie Cartier',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                        {
                          pep: [
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canadian Government Sanctions List',
                            },
                            {
                              date: null,
                              type: null,
                              sourceUrl: null,
                              sourceName: 'Canadian National Security Review',
                            },
                          ],
                          other: [],
                          warnings: [],
                          countries: ['Canada', 'United States'],
                          sanctions: [],
                          matchTypes: ['name_fuzzy'],
                          matchedName: 'Robbert Cartter',
                          adverseMedia: [],
                          fitnessProbity: [],
                        },
                      ],
                      vendor: 'dow-jones',
                      clientId: '7429577f-cd89-46d9-ad06-70f296a62d86',
                      checkType: 'initial_result',
                      createdAt: '2025-03-03T20:09:48.461Z',
                      endUserId: 'aebe7271-b6ce-4d24-b5bc-ac03f1f8bdda',
                      matchStatus: 'possible_match',
                    },
                    entity: {
                      data: {
                        lastName: 'Carter',
                        firstName: 'Robert',
                        dateOfBirth: '2024-06-22',
                        additionalInfo: {
                          gender: 'M',
                          nationality: 'IL',
                        },
                      },
                      type: 'individual',
                    },
                    decision: {
                      status: 'approved',
                      decisionScore: 1,
                    },
                    metadata: {
                      id: '0669fd83-6572-42e5-8f2a-dd7ca7c60db1',
                      url: '',
                    },
                  },
                  vendor: 'veriff',
                },
              },
            },
            ballerineEntityId: '978ebceb-e3f2-48e8-8273-376719528c17',
          },
          assignee: null,
          createdAt: '2025-03-03T20:09:48.408Z',
          assigneeId: null,
          workflowDefinition: {
            id: 'kyc_email_session_example',
            name: 'kyc_email_session_example',
            config: {
              callbackResult: {
                deliverEvent: 'KYC_DONE',
                transformers: [
                  {
                    mapping: '{data: @}',
                    transformer: 'jmespath',
                  },
                ],
              },
            },
            version: 1,
            definition: {
              id: 'kyc_email_session_example_v1',
              states: {
                idle: {
                  on: {
                    start: 'get_kyc_session',
                  },
                  tags: ['pending_process'],
                },
                approved: {
                  tags: ['approved'],
                  type: 'final',
                },
                rejected: {
                  tags: ['rejected'],
                  type: 'final',
                },
                revision: {
                  tags: ['revision'],
                  always: [
                    {
                      target: 'get_kyc_session_revision',
                    },
                  ],
                },
                email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                get_kyc_session: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['pending_process'],
                },
                kyc_auto_reject: {
                  tags: ['rejected'],
                  type: 'final',
                },
                kyc_manual_review: {
                  on: {
                    reject: {
                      target: 'rejected',
                    },
                    approve: {
                      target: 'approved',
                    },
                    revision: {
                      target: 'revision',
                    },
                  },
                  tags: ['manual_review'],
                },
                revision_email_sent: {
                  on: {
                    KYC_RESPONSE_RECEIVED: [
                      {
                        target: 'kyc_manual_review',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
                get_kyc_session_revision: {
                  on: {
                    SEND_EMAIL: [
                      {
                        target: 'revision_email_sent',
                      },
                    ],
                    API_CALL_ERROR: [
                      {
                        target: 'kyc_auto_reject',
                      },
                    ],
                  },
                  tags: ['revision'],
                },
              },
              initial: 'idle',
              predictableActionArguments: true,
            },
            contextSchema: null,
            documentsSchema: null,
          },
          childWorkflowsRuntimeData: [],
          entity: {
            id: '978ebceb-e3f2-48e8-8273-376719528c17',
            name: 'Robert Carter',
            avatarUrl: null,
            approvalState: 'NEW',
          },
          nextEvents: ['UPDATE_CONTEXT', 'DEEP_MERGE_CONTEXT', 'reject', 'approve', 'revision'],
          childWorkflows: [],
        },
      ],
    })),
  });

  return handleZodError(error, workflow);
};

export const fetchUpdateWorkflowById = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: Record<PropertyKey, unknown>;
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const updateWorkflowDocumentById = async ({
  workflowId,
  documentId,
  body,
  contextUpdateMethod,
}: IWorkflowId & {
  documentId: string;
  body: Record<PropertyKey, unknown>;
  contextUpdateMethod?: 'base' | 'director';
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/documents/${documentId}${
      contextUpdateMethod ? `?contextUpdateMethod=${contextUpdateMethod}` : ''
    }`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const updateWorkflowSetAssignById = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: { assigneeId: string | null; isAssignedToMe?: boolean };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/assign/${workflowId}`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflowEvent = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body:
    | {
        name: string;
      }
    | {
        name: string;
        document: string;
        resubmissionReason: string;
      };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/event`,
    method: Method.POST,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const updateWorkflowDecision = async ({
  workflowId,
  documentId,
  body,
  contextUpdateMethod,
}: IWorkflowId & {
  documentId: string;
  body: {
    decision: string | null;
    directorId?: string;
    reason?: string;
    comment?: string;
  };
  contextUpdateMethod: 'base' | 'director';
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/decision/${documentId}${
      contextUpdateMethod ? `?contextUpdateMethod=${contextUpdateMethod}` : ''
    }`,
    method: Method.PATCH,
    body,
    schema: WorkflowByIdSchema.pick({
      context: true,
    }),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflowEventDecision = async ({
  workflowId,
  body,
}: IWorkflowId & {
  body: {
    name: string;
    reason?: string;
  };
}) => {
  const [workflow, error] = await apiClient({
    endpoint: `workflows/${workflowId}/event-decision`,
    method: Method.PATCH,
    body,
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const createWorkflowRequest = async ({
  workflowDefinitionId,
  context,
}: {
  workflowDefinitionId: string;
  context: TWorkflowById['context'];
}) => {
  const [workflow, error] = await apiClient({
    method: Method.POST,
    url: `${getOriginUrl(env.VITE_API_URL)}/api/v1/case-management`,
    body: {
      workflowId: workflowDefinitionId,
      context,
    },
    schema: z.any(),
  });

  return handleZodError(error, workflow);
};

export const fetchWorkflowDocumentOCRResult = async ({
  workflowRuntimeId,
  documentId,
}: {
  workflowRuntimeId: string;
  documentId: string;
}) => {
  const [workflow, error] = await apiClient({
    method: Method.GET,
    url: `${getOriginUrl(
      env.VITE_API_URL,
    )}/api/v1/internal/workflows/${workflowRuntimeId}/documents/${documentId}/run-ocr`,
    schema: z.any(),
    timeout: 40_000,
  });

  return handleZodError(error, workflow);
};
