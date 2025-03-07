import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';
import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import { generateDocumentPageFactory } from './generate-document-page-factory';
import { TCustomerWithFeatures } from '@/customer/types';

type TDemoEnv = {
  customer: {
    id: string;
  };
};

export const generateKycChildWorkflowMockData = async ({
  client,
  projectId,
  customerName,
  customer,
  demoEnv,
}: {
  client: PrismaClient;
  projectId: string;
  customerName: string;
  customer: TCustomerWithFeatures;
  demoEnv: TDemoEnv;
}) => {
  const generateDocumentPage = generateDocumentPageFactory({
    client,
    projectId,
  });

  const children = [
    {
      id: randomUUID(),
      email: faker.internet.email('Carlton', 'Cushnie'),
      firstName: 'Carlton',
      lastName: 'Ellington Cushnie',
      role: faker.name.jobTitle(),
      companyName: faker.company.name(),
      dateOfBirth: faker.date.past().toISOString(),
    },
    {
      id: randomUUID(),
      email: faker.internet.email('Johnathan', 'Reed'),
      firstName: 'Johnathan',
      lastName: 'Reed',
      role: faker.name.jobTitle(),
      companyName: faker.company.name(),
      dateOfBirth: faker.date.past().toISOString(),
    },
    {
      id: randomUUID(),
      email: faker.internet.email('Robert', 'Carter'),
      firstName: 'Robert',
      lastName: 'Carter',
      role: faker.name.jobTitle(),
      companyName: faker.company.name(),
      dateOfBirth: faker.date.past().toISOString(),
    },
  ];

  return [
    {
      entity: {
        data: {
          email: children[2]?.email,
          lastName: children[2]?.lastName,
          firstName: children[2]?.firstName,
          additionalInfo: {
            role: children[2]?.role,
            companyName: children[2]?.companyName,
            dateOfBirth: children[2]?.dateOfBirth,
            customerCompany: customer.displayName,
            __isGeneratedAutomatically: true,
          },
        },
        type: 'individual',
        ballerineEntityId: randomUUID(),
      },
      metadata: {
        customerId: demoEnv.customer.id,
        customerName,
        customerNormalizedName: customerName,
      },
      documents: [
        {
          id: randomUUID(),
          type: 'identification_document',
          pages: [
            await generateDocumentPage({
              uri: 'https://cdn.ballerine.io/merch-ss/Armenia_selfie.jpg',
              metadata: { side: 'face' },
            }),

            await generateDocumentPage({
              uri: 'https://cdn.ballerine.io/merch-ss/canada-license-front.jpg',
              metadata: { side: 'front' },
            }),
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
      customerName,
      pluginsOutput: {
        kyc_session: {
          kyc_session_1: {
            type: 'kyc',
            result: {
              aml: {
                id: randomUUID(),
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
                vendor: faker.helpers.arrayElement(['dow-jones', 'veriff']),
                clientId: randomUUID(),
                checkType: 'initial_result',
                createdAt: new Date().toISOString(),
                endUserId: randomUUID(),
                matchStatus: 'possible_match',
              },
              entity: {
                data: {
                  lastName: children[2]?.lastName,
                  firstName: children[2]?.firstName,
                  dateOfBirth: dayjs(children[2]?.dateOfBirth).format('YYYY-MM-DD'),
                  additionalInfo: { gender: 'M', nationality: 'IL' },
                },
                type: 'individual',
              },
              decision: { status: 'approved', decisionScore: 1 },
              metadata: {
                id: randomUUID(),
                url: '',
              },
            },
            vendor: 'veriff',
          },
        },
      },
    },
    {
      entity: {
        data: {
          email: children[1]?.email,
          lastName: children[1]?.lastName,
          firstName: children[1]?.firstName,
          additionalInfo: {
            role: children[1]?.role,
            companyName: children[1]?.companyName,
            dateOfBirth: children[1]?.dateOfBirth,
            customerCompany: customer.displayName,
            __isGeneratedAutomatically: true,
          },
        },
        type: 'individual',
        ballerineEntityId: randomUUID(),
      },
      metadata: {
        customerId: demoEnv.customer.id,
        customerName,
        customerNormalizedName: customerName,
      },
      documents: [
        {
          id: randomUUID(),
          type: 'identification_document',
          pages: [
            await generateDocumentPage({
              uri: 'https://cdn.ballerine.io/merch-ss/us_green_card-selfie.jpg',
              metadata: { side: 'face-pre' },
            }),
            await generateDocumentPage({
              uri: 'https://cdn.ballerine.io/merch-ss/us_green_card.jpg',
              metadata: { side: 'front' },
            }),
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
      customerName,
      pluginsOutput: {
        kyc_session: {
          kyc_session_1: {
            type: 'kyc',
            result: {
              aml: {
                id: randomUUID(),
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
                vendor: faker.helpers.arrayElement(['dow-jones', 'veriff']),
                clientId: randomUUID(),
                checkType: 'initial_result',
                createdAt: new Date().toISOString(),
                endUserId: randomUUID(),
                matchStatus: 'possible_match',
              },
              entity: {
                data: {
                  lastName: children[1]?.lastName,
                  firstName: children[1]?.firstName,
                  dateOfBirth: dayjs(children[1]?.dateOfBirth).format('YYYY-MM-DD'),
                  additionalInfo: { gender: 'M', nationality: 'IL' },
                },
                type: 'individual',
              },
              decision: { status: 'approved', decisionScore: 1 },
              metadata: {
                id: randomUUID(),
                url: '',
              },
            },
            vendor: 'veriff',
          },
        },
      },
    },
    {
      entity: {
        data: {
          email: children[0]?.email,
          lastName: children[0]?.lastName,
          firstName: children[0]?.firstName,
          additionalInfo: {
            role: children[0]?.role,
            companyName: children[0]?.companyName,
            dateOfBirth: children[0]?.dateOfBirth,
            customerCompany: customer.displayName,
            __isGeneratedAutomatically: true,
          },
        },
        type: 'individual',
        ballerineEntityId: randomUUID(),
      },
      metadata: {
        customerId: demoEnv.customer.id,
        customerName,
        customerNormalizedName: customerName,
      },
      documents: [
        {
          id: randomUUID(),
          type: 'identification_document',
          pages: [
            await generateDocumentPage({
              uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport-Selfie.jpg',
              metadata: { side: 'face' },
            }),

            await generateDocumentPage({
              uri: 'https://cdn.ballerine.io/merch-ss/USA_Passport-12313.jpg',
              metadata: { side: 'front' },
            }),
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
      customerName,
      pluginsOutput: {
        kyc_session: {
          kyc_session_1: {
            type: 'kyc',
            result: {
              aml: {
                id: randomUUID(),
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
                        sourceName: 'Previously shut-down fraudulent payment scheme investigation',
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
                vendor: faker.helpers.arrayElement(['dow-jones', 'veriff']),
                clientId: randomUUID(),
                checkType: 'initial_result',
                createdAt: new Date().toISOString(),
                endUserId: randomUUID(),
                matchStatus: 'possible_match',
              },
              entity: {
                data: {
                  lastName: children[0]?.lastName,
                  firstName: children[0]?.firstName,
                  dateOfBirth: dayjs(children[0]?.dateOfBirth).format('YYYY-MM-DD'),
                  additionalInfo: { gender: 'M', nationality: 'IL' },
                },
                type: 'individual',
              },
              decision: { status: 'approved', decisionScore: 1 },
              metadata: {
                id: randomUUID(),
                url: '',
              },
            },
            vendor: 'veriff',
          },
        },
      },
    },
  ];
};
