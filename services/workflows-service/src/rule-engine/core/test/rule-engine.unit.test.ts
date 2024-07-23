import { RuleEngine, runRuleSet } from '@/rule-engine/core/rule-engine';
import {
  DataValueNotFoundError,
  MissingKeyError,
  OPERATION,
  OperationNotFoundError,
  OPERATOR,
  RuleResultSet,
  RuleSet,
  RuleResult,
} from '@ballerine/common';
import { context } from './data-helper';
import z from 'zod';

const mockData = {
  country: 'US',
  name: 'John',
  age: 35,
};

describe('Rule Engine', () => {
  it('should validate a simple rule set', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operation: OPERATION.EQUALS,
          value: 'US',
        },
        {
          operator: OPERATOR.AND,
          rules: [
            {
              key: 'name',
              operation: OPERATION.EQUALS,
              value: 'John',
            },
            {
              operator: OPERATOR.OR,
              rules: [
                {
                  key: 'age',
                  operation: OPERATION.GT,
                  value: 40,
                },
                {
                  key: 'age',
                  operation: OPERATION.LTE,
                  value: 35,
                },
              ],
            },
          ],
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);

    expect(validationResults).toBeDefined();
    expect(validationResults).toHaveLength(2);

    expect(validationResults[0]!.status).toBe('PASSED');

    expect(validationResults[1]!.status).toBe('PASSED');
  });

  it('should handle missing key in rule', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'nonexistent',
          operation: OPERATION.EQUALS,
          value: 'US',
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toBe(
      'Field nonexistent is missing or null',
    );
    expect((validationResults[0] as RuleResult).error).toBeInstanceOf(DataValueNotFoundError);
  });

  it('should throw an error for unknown operation', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          // @ts-ignore - intentionally using an unknown operation
          operation: 'UNKNOWN',
          value: 'US',
        },
      ],
    };

    const result = runRuleSet(ruleSetExample, mockData);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      error: expect.any(OperationNotFoundError),
      message: 'Unknown operation UNKNOWN',
      rule: {
        key: 'country',
        operation: 'UNKNOWN',
        value: 'US',
      },
      status: 'FAILED',
    });
  });

  it('should fail for incorrect value', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'country',
          operation: OPERATION.EQUALS,
          value: 'CA',
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).error).toBe(undefined);
  });

  it.only('should validate custom operation with additional params', () => {
    // TODO: should spy Date.now() to return a fixed date
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'createdAt',
          operation: OPERATION.LAST_YEAR,
          value: { years: 2 },
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, {
      ...mockData,
      createdAt: '2023-02-01',
    });
    expect(validationResults[0]!.status).toBe('PASSED');
  });

  it('should fail custom operation with missing additional params', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: 'age',
          operation: OPERATION.LAST_YEAR,
          value: { years: 'two' }, // Invalid type for years
        },
      ],
    };

    const validationResults: RuleResultSet = runRuleSet(ruleSetExample, mockData);
    expect(validationResults[0]!.status).toBe('FAILED');
    expect((validationResults[0] as RuleResult).message).toContain(
      `Validation failed for 'LAST_YEAR', message: Invalid condition value`,
    );
  });

  it('should throw MissingKeyError when rule is missing key field', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.OR,
      rules: [
        {
          key: '',
          operation: OPERATION.EQUALS,
          value: 'US',
        },
      ],
    };

    const result = runRuleSet(ruleSetExample, mockData);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      error: expect.any(MissingKeyError),
      message: 'Rule is missing the key field',
      rule: {
        key: '',
        operation: 'EQUALS',
        value: 'US',
      },
      status: 'FAILED',
    });
  });

  it('should resolve a nested property from context', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.businessInformation.data[0].establishDate',
          operation: OPERATION.LAST_YEAR,
          value: { years: 1 },
        },
      ],
    };

    const engine = RuleEngine(ruleSetExample);
    let result = engine.run(context);

    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "rule": {
          "key": "pluginsOutput.businessInformation.data[0].establishDate",
          "operation": "LAST_YEAR",
          "value": {
            "years": 1,
          },
        },
        "status": "PASSED",
      }
    `);

    const context2 = JSON.parse(JSON.stringify(context));

    // @ts-ignore
    context2.pluginsOutput.businessInformation.data[0].establishDate = '2020-01-01';

    result = engine.run(context2 as any);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchInlineSnapshot(`
      {
        "error": undefined,
        "rule": {
          "key": "pluginsOutput.businessInformation.data[0].establishDate",
          "operation": "LAST_YEAR",
          "value": {
            "years": 1,
          },
        },
        "status": "FAILED",
      }
    `);
  });
  it('should evaluate to true if establishDate is within the last year', () => {
    const ruleSetExample: RuleSet = {
      operator: OPERATOR.AND,
      rules: [
        {
          key: 'pluginsOutput.businessInformation.data[0].establishDate',
          operation: OPERATION.LAST_YEAR,
          value: { years: 1 },
        },
      ],
    };

    const engine = RuleEngine(ruleSetExample);

    // Test with a date from 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const context1 = {
      id: '892398749',
      data: {
        companyName: '1618 Air Conditioning co',
        additionalInfo: {
          mainRepresentative: {
            email: 'nitzan+demo82918739@ballerine.com',
            lastName: 'guy',
            firstName: 'nitzan',
          },
        },
      },
      type: 'business',
      state: 'personal_details',
      entity: {
        id: '892398749',
        data: {
          country: 'SG',
          companyName: '1618 AIR CONDITIONING PTE. LTD.',
          businessType: 'Local Company - EXEMPT PRIVATE COMPANY LIMITED BY SHARES',
          additionalInfo: {
            bank: {
              iban: '123412351251253',
              bankName: 'Madeline Haynes',
              currency: 'USD',
              subBranch: '12341243',
              swiftCode: '1234123442',
              bankAddress: 'Dicta cupiditate ali',
              accountNumber: '2291241414',
              cardholderName: 'Anderson Johnston Associates',
              residentAddress: 'Autem cum modi quibu',
            },
            ubos: [
              {
                email: 'nitzan+demo82918739@ballerine.com',
                lastName: 'guy',
                firstName: 'nitzan',
                additionalInfo: {
                  address: '22, Chaoyangmen, Chaoyang District, Beijing',
                  ownership: 25,
                  companyName: '1618 AIR CONDITIONING PTE. LTD.',
                  nationality: 'IL',
                  identityNumber: '021573872',
                  customerCompany: 'AXS',
                  __isGeneratedAutomatically: true,
                },
                ballerineEntityId: 'clykbql2c0019uv30xw7x9rmn',
              },
            ],
            store: {
              dba: 'Qui reiciendis sunt',
              industry: 'Adult Entertainment and Products',
              products: 'watches, books, shoes',
              websiteUrl: 'https://www.thursdayboots.com',
              established: '2020-10-19T21:00:00.000Z',
              averagePrice: 631,
              productsAndServiceDescription: 'Qui ab quia et dolor',
            },
            directors: [
              {
                email: 'nitzan+demo82918739@ballerine.com',
                lastName: 'Doe',
                firstName: 'John',
                legalName: 'nitzan guy',
                additionalInfo: {
                  address: '22, Chaoyangmen, Chaoyang District, Beijing',
                  documents: [
                    {
                      id: 'director-passport-photo-document-[index:0]',
                      type: 'passport',
                      pages: [
                        {
                          type: 'image/jpeg',
                          fileName: 'USA_Passport.jpg',
                          ballerineFileId: 'clykbnvuv000zuv30ktirq06x',
                        },
                      ],
                      issuer: {
                        country: 'ZZ',
                      },
                      version: '1',
                      category: 'proof_of_identity',
                      decision: {},
                      properties: {},
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
                      id: 'director-selfie-photo-[index:0]',
                      type: 'selfie',
                      pages: [
                        {
                          type: 'image/png',
                          fileName: 'USA_Passport Selfie.png',
                          ballerineFileId: 'clykboexb0011uv30euiqhcjx',
                        },
                      ],
                      issuer: {
                        country: 'ZZ',
                      },
                      version: '1',
                      category: 'proof_of_identity_ownership',
                      decision: {},
                      properties: {},
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
                  companyName: '1618 AIR CONDITIONING PTE. LTD.',
                  nationality: 'IL',
                  identityNumber: '2389387927',
                  customerCompany: 'AXS',
                  __isGeneratedAutomatically: true,
                },
                ballerineEntityId: 'clykbql33001auv30cb8k3jbq',
              },
            ],
            taxNumber: '1893918893',
            imDirector: true,
            companyType: 'Partnership',
            headquarters: {
              city: 'Sed deserunt itaque ',
              street: 'Consectetur id fuga',
              country: 'IR',
              physical: {},
              streetNumber: 978,
              isDifferentFromPhysical: false,
            },
            imShareholder: true,
            openCorporate: {
              vat: '',
              name: '1618 AIR CONDITIONING PTE. LTD.',
              companyType: 'Local Company - EXEMPT PRIVATE COMPANY LIMITED BY SHARES',
              companyNumber: '202400701R',
              jurisdictionCode: 'sg',
              incorporationDate: '2024-01-04',
            },
            registeredCapital: 10000000,
            mainRepresentative: {
              email: 'nitzan+demo82918739@ballerine.com',
              phone: '13231312312',
              lastName: 'guy',
              firstName: 'nitzan',
              dateOfBirth: '1986-12-01T22:00:00.000Z',
              additionalInfo: {
                jobTitle: 'CPO',
              },
            },
            thereNoCompaniesWithMoreThan25: true,
          },
          numberOfEmployees: 50,
          registrationNumber: '202400701R',
          taxIdentificationNumber: '',
        },
        type: 'business',
        ballerineEntityId: 'clykbgvzf000wta30lv1zrzsq',
      },
      metadata: {
        token: '2da44cc2-555a-43d4-a7cd-7ebab9bc715d',
        customerName: 'AXS',
        collectionFlowUrl: 'https://collection-dev.ballerine.io',
        customerNormalizedName: 'axs',
      },
      documents: [
        {
          id: 'document-certificate-of-incorporation',
          type: 'certificate_of_incorporation',
          pages: [
            {
              type: 'image/jpeg',
              fileName: 'COI3.jpeg',
              ballerineFileId: 'clykbqayw001eta30xnhwu6q5',
            },
          ],
          issuer: {
            country: 'ZZ',
          },
          version: '1',
          category: 'proof_of_registration',
          decision: {},
          properties: {},
          issuingVersion: 1,
          propertiesSchema: {
            type: 'object',
            properties: {
              issueDate: {
                type: 'string',
                format: 'date',
                formatMaximum: '2024-07-13',
              },
              businessName: {
                type: 'string',
              },
              registrationNumber: {
                type: 'string',
                pattern: '^[a-zA-Z0-9]*$',
              },
            },
          },
        },
        {
          id: 'document-business-registration-certificate',
          type: 'business_registration_certificate',
          pages: [
            {
              type: 'image/jpeg',
              fileName: 'COI1.jpeg',
              ballerineFileId: 'clykbqdwe0016uv304fa37i98',
            },
          ],
          issuer: {
            country: 'ZZ',
          },
          version: '1',
          category: 'proof_of_registration',
          decision: {},
          properties: {},
          issuingVersion: 1,
          propertiesSchema: {
            type: 'object',
            properties: {
              issueDate: {
                type: 'string',
                format: 'date',
                formatMaximum: '2024-07-13',
              },
              businessName: {
                type: 'string',
              },
              registrationNumber: {
                type: 'string',
                pattern: '^[a-zA-Z0-9]*$',
              },
            },
          },
        },
        {
          id: 'document-certificate-of-directors-and-shareholders',
          type: 'certificate_of_directors_and_shareholders',
          pages: [
            {
              type: 'image/png',
              fileName: 'company structure.png',
              ballerineFileId: 'clykbqhv9001ita30d2vqrp9z',
            },
          ],
          issuer: {
            country: 'ZZ',
          },
          version: '1',
          category: 'proof_of_ownership',
          decision: {},
          properties: {},
          issuingVersion: 1,
          propertiesSchema: {
            type: 'object',
            properties: {
              directors: {
                type: 'string',
              },
              issueDate: {
                type: 'string',
                format: 'date',
                formatMaximum: '2024-07-13',
              },
              businessName: {
                type: 'string',
              },
              shareholders: {
                type: 'string',
              },
            },
          },
        },
      ],
      flowConfig: {
        apiUrl: 'https://api-dev.ballerine.io',
        tokenId: '2da44cc2-555a-43d4-a7cd-7ebab9bc715d',
        appState: 'finish',
        stepsProgress: {
          store_info: {
            number: 7,
            isCompleted: true,
          },
          banking_details: {
            number: 5,
            isCompleted: true,
          },
          personal_details: {
            number: 1,
            isCompleted: true,
          },
          company_documents: {
            number: 10,
            isCompleted: false,
          },
          company_ownership: {
            number: 4,
            isCompleted: true,
          },
          business_information: {
            number: 2,
            isCompleted: true,
          },
          business_address_information: {
            number: 3,
            isCompleted: true,
          },
        },
        customerCompany: 'AXS',
      },
      customerName: 'AXS',
      pluginsOutput: {
        ubo: {
          code: 200,
          data: {
            layers: '2',
            uboList: [
              {
                name: 'HAO JIAN',
                type: 'PERSON',
                enName: 'HAO JIAN',
                uboPaths: [
                  {
                    no: 1,
                    uboPath: [
                      {
                        name: '1618 AIR CONDITIONING PTE. LTD.',
                        level: '1',
                        share: '100',
                        nodeId: 'uboNode202407140011360958434933',
                      },
                      {
                        name: 'HAO JIAN',
                        level: '2',
                        share: '100.00',
                        nodeId: 'uboNode202407140011361717272568',
                      },
                    ],
                    uboShare: '100.00',
                  },
                ],
                companyId: '',
                personalId: 'SGPS8567940F',
                jurisdiction: 'Singapore',
                reasonForType: '',
                sharePercentage: '100.00',
              },
            ],
            uboGraph: [
              {
                id: 'SGPS8567940F',
                name: 'HAO JIAN',
                node: 'uboNode202407140011361717272568',
                type: 'PERSON',
                level: '2',
                enName: 'HAO JIAN',
                reason: '',
                bizStatus: '',
                regNumber: '',
                enBizStatus: '',
                jurisdiction: 'Singapore',
                shareHolders: [],
                establishedDate: '',
              },
              {
                id: 'SGP202400701R',
                name: '1618 AIR CONDITIONING PTE. LTD.',
                node: 'uboNode202407140011360958434933',
                type: 'COMPANY',
                level: '1',
                enName: '1618 AIR CONDITIONING PTE. LTD.',
                reason: '',
                bizStatus: 'Live Company',
                regNumber: '202400701R',
                enBizStatus: 'Live Company',
                jurisdiction: 'Singapore',
                shareHolders: [
                  {
                    nodeId: 'uboNode202407140011361717272568',
                    sharePercentage: '100.00',
                  },
                ],
                establishedDate: '2024-01-04',
              },
            ],
            fullUBOGraph: [
              {
                id: 'SGPS8567940F',
                name: 'HAO JIAN',
                node: 'uboNode202407140011361717272568',
                type: 'PERSON',
                level: '2',
                enName: 'HAO JIAN',
                reason: '',
                bizStatus: '',
                regNumber: '',
                enBizStatus: '',
                jurisdiction: 'Singapore',
                shareHolders: [],
                establishedDate: '',
              },
              {
                id: 'SGP202400701R',
                name: '1618 AIR CONDITIONING PTE. LTD.',
                node: 'uboNode202407140011360958434933',
                type: 'COMPANY',
                level: '1',
                enName: '1618 AIR CONDITIONING PTE. LTD.',
                reason: '',
                bizStatus: 'Live Company',
                regNumber: '202400701R',
                enBizStatus: 'Live Company',
                jurisdiction: 'Singapore',
                shareHolders: [
                  {
                    nodeId: 'uboNode202407140011361717272568',
                    sharePercentage: '100.00',
                  },
                ],
                establishedDate: '2024-01-04',
              },
            ],
            otherUBOList: [],
          },
          name: 'ubo',
          status: 'SUCCESS',
          orderId: 'ubo202407140011351558978752',
          invokedAt: 1720887096055,
        },
        risk_evaluation: {
          success: true,
          riskScore: 60,
          rulesResults: [
            {
              id: 'store-info-high-risk-sector',
              domain: 'Store Info',
              result: [
                {
                  rule: {
                    key: 'entity.data.additionalInfo.store.industry',
                    value: [
                      'Adult Entertainment and Products',
                      'Gambling and Casinos',
                      'eSports and Betting',
                      'Leisure and Travel',
                      'Travel Agencies and Tour Operators',
                      'E-commerce',
                      'Telemarketing',
                      'Nutraceuticals and Supplements',
                      'Financial Services',
                      'Pharmaceuticals',
                      'Pharmaceuticals and Drug Stores',
                      'Multi-Level Marketing (MLM)',
                      'Dating Services',
                      'Event Ticket Brokers',
                      'Events Services',
                      'Pawn Shops',
                      'Bail Bonds',
                      'Weapons and Knives Sales',
                      'Forex Trading',
                      'Timeshares',
                      'Antiques',
                      'Collectibles',
                      'Auctions and Auctioneering',
                      'Auctions and Penny Auctions',
                      'Charities and Non-Profits',
                      'Automotive',
                    ],
                    operation: 'IN',
                  },
                  status: 'PASSED',
                },
              ],
              ruleSet: {
                rules: [
                  {
                    key: 'entity.data.additionalInfo.store.industry',
                    value: [
                      'Adult Entertainment and Products',
                      'Gambling and Casinos',
                      'eSports and Betting',
                      'Leisure and Travel',
                      'Travel Agencies and Tour Operators',
                      'E-commerce',
                      'Telemarketing',
                      'Nutraceuticals and Supplements',
                      'Financial Services',
                      'Pharmaceuticals',
                      'Pharmaceuticals and Drug Stores',
                      'Multi-Level Marketing (MLM)',
                      'Dating Services',
                      'Event Ticket Brokers',
                      'Events Services',
                      'Pawn Shops',
                      'Bail Bonds',
                      'Weapons and Knives Sales',
                      'Forex Trading',
                      'Timeshares',
                      'Antiques',
                      'Collectibles',
                      'Auctions and Auctioneering',
                      'Auctions and Penny Auctions',
                      'Charities and Non-Profits',
                      'Automotive',
                    ],
                    operation: 'IN',
                  },
                ],
                operator: 'and',
              },
              indicator: 'High risk sector',
              maxRiskScore: 60,
              minRiskScore: 60,
              baseRiskScore: 60,
              additionalRiskScore: 8,
            },
          ],
          riskIndicatorsByDomain: {
            'Store Info': [
              {
                name: 'High risk sector',
                domain: 'Store Info',
              },
            ],
          },
        },
        companySanctions: {
          data: [],
          name: 'company_sanctions',
          status: 'SUCCESS',
          invokedAt: 1720887095823,
        },
        merchantMonitoring: {
          name: 'merchant_monitoring',
          status: 'IN_PROGRESS',
          reportId: 'xz1relb64ydv8lmfqsgnzvsd',
          invokedAt: 1720887085222,
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
                  paidUpCapital: '1000',
                  shareAllotted: '100000',
                  shareCurrency: 'SINGAPORE, DOLLARS',
                },
              ],
              status: 'Live Company',
              expiryDate: '',
              statusDate: '2024-01-04',
              companyName: '1618 AIR CONDITIONING PTE. LTD.',
              companyType: 'EXEMPT PRIVATE COMPANY LIMITED BY SHARES',
              lastUpdated: '2024-07-14 00:11:33',
              historyNames: [],
              businessScope: {
                code: '43220',
                description:
                  'INSTALLATION OF PLUMBING, HEATING (NON-ELECTRIC) AND AIR-CONDITIONING SYSTEMS',
                otherDescription: '',
              },
              establishDate: '2024-01-04',
              lastFinancialDate: '',
              registeredAddress: {
                postalCode: '048545',
                streetName: 'ROBINSON ROAD',
                unitNumber: '01A',
                levelNumber: '08',
                buildingName: 'FAR EAST FINANCE BUILDING',
                blockHouseNumber: '14',
              },
              lastAnnualReturnDate: '',
              lastAnnualGeneralMeetingDate: '',
            },
          ],
          name: 'kyb',
          status: 'SUCCESS',
          orderId: 'av202407140011262014213702',
          invokedAt: 1720887093031,
        },
        collection_invite_email: {},
      },
      childWorkflows: {
        kyc_email_session_example: {
          clykbql7a001euv30ruqmnluk: {
            tags: ['manual_review'],
            state: 'kyc_manual_review',
            result: {
              childEntity: {
                email: 'nitzan+demo82918739@ballerine.com',
                lastName: 'guy',
                firstName: 'nitzan',
                additionalInfo: {
                  address: '22, Chaoyangmen, Chaoyang District, Beijing',
                  ownership: 25,
                  companyName: '1618 AIR CONDITIONING PTE. LTD.',
                  nationality: 'IL',
                  identityNumber: '021573872',
                  customerCompany: 'AXS',
                  __isGeneratedAutomatically: true,
                },
                ballerineEntityId: 'clykbql2c0019uv30xw7x9rmn',
              },
              vendorResult: {
                aml: {
                  id: '484b572e-e814-416f-a127-b8ccbe95451a',
                  hits: [],
                  clientId: '7a5a10eb-e01d-4896-a717-9017ab3f84d1',
                  checkType: 'initial_result',
                  createdAt: '2024-07-13T16:26:38.397Z',
                  endUserId: 'clykbql2c0019uv30xw7x9rmn',
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
                  decisionScore: 0.96,
                },
                metadata: {
                  id: '484b572e-e814-416f-a127-b8ccbe95451a',
                  url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjA4ODcwODUsInNlc3Npb25faWQiOiI0ODRiNTcyZS1lODE0LTQxNmYtYTEyNy1iOGNjYmU5NTQ1MWEiLCJpaWQiOiI5ZTEzOGE1OC0xZWU4LTQzNzctYjE1Yy0xMzNmNDZiNDU0ZmIifQ._t6SdAwfC2CxYrr2BxMnxgQ_aklL5w7MBaFDnRCycr0',
                },
              },
            },
            status: 'active',
          },
        },
      },
      workflowRuntimeId: '1',
    };

    let result = engine.run(context1);
    expect(result).toBeDefined();
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('PASSED');

    // Test with a date from 11 months ago
    const elevenMonthsAgo = new Date();
    elevenMonthsAgo.setMonth(elevenMonthsAgo.getMonth() - 11);
    const context2 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: elevenMonthsAgo.toISOString() }],
        },
      },
    };

    result = engine.run(context2);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('PASSED');

    // Test with a date from exactly one year ago (edge case)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const context3 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: oneYearAgo.toISOString() }],
        },
      },
    };

    result = engine.run(context3);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('PASSED');

    // Test with a date from 13 months ago (should fail)
    const thirteenMonthsAgo = new Date();
    thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13);
    const context4 = {
      pluginsOutput: {
        businessInformation: {
          data: [{ establishDate: thirteenMonthsAgo.toISOString() }],
        },
      },
    };

    result = engine.run(context4);
    expect(result).toHaveLength(1);
    expect(result[0]?.status).toBe('FAILED');
  });

  describe('exists operation', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].shares',
            operation: OPERATION.EXISTS,
            value: {},
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operation": "EXISTS",
            "value": {},
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = [];

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operation": "EXISTS",
            "value": {},
          },
          "status": "FAILED",
        }
      `);

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = {};

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operation": "EXISTS",
            "value": {},
          },
          "status": "FAILED",
        }
      `);

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = { item: 1 };

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.businessInformation.data[0].shares",
            "operation": "EXISTS",
            "value": {},
          },
          "status": "PASSED",
        }
      `);
    });

    it('should check with schema', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.businessInformation.data[0].shares',
            operation: OPERATION.EXISTS,
            value: {
              schema: z.object({
                item: z.coerce.number().int().positive(),
              }),
            },
          },
        ],
      };

      const context2 = JSON.parse(JSON.stringify(context));

      const engine = RuleEngine(ruleSetExample);

      let result = engine.run(context2 as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('FAILED');

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = { item: 1 };

      result = engine.run(context2 as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.status).toBe('PASSED');

      // @ts-ignore
      context2.pluginsOutput.businessInformation.data[0].shares = {};

      result = engine.run(context2 as any);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]?.error).toMatchInlineSnapshot(`undefined`);
      expect(result[0]?.status).toBe('FAILED');
    });
  });

  describe('not_equals operation', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'pluginsOutput.companySanctions.data.length',
            operation: OPERATION.NOT_EQUALS,
            value: 0,
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.companySanctions.data.length",
            "operation": "NOT_EQUALS",
            "value": 0,
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.pluginsOutput.companySanctions.data = [];

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "pluginsOutput.companySanctions.data.length",
            "operation": "NOT_EQUALS",
            "value": 0,
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('in operation', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'entity.data.country',
            operation: OPERATION.IN,
            value: ['IL', 'AF', 'US', 'GB'],
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operation": "IN",
            "value": [
              "IL",
              "AF",
              "US",
              "GB",
            ],
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.entity.data.country = 'CA';

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operation": "IN",
            "value": [
              "IL",
              "AF",
              "US",
              "GB",
            ],
          },
          "status": "FAILED",
        }
      `);
    });
  });

  describe('not_in operation', () => {
    it('should resolve a nested property from context', () => {
      const ruleSetExample: RuleSet = {
        operator: OPERATOR.AND,
        rules: [
          {
            key: 'entity.data.country',
            operation: OPERATION.NOT_IN,
            value: ['IL', 'CA', 'US', 'GB'],
          },
        ],
      };

      const engine = RuleEngine(ruleSetExample);
      let result = engine.run(context);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operation": "NOT_IN",
            "value": [
              "IL",
              "CA",
              "US",
              "GB",
            ],
          },
          "status": "PASSED",
        }
      `);

      const context2 = JSON.parse(JSON.stringify(context));

      // @ts-ignore
      context2.entity.data.country = 'CA';

      result = engine.run(context2 as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchInlineSnapshot(`
        {
          "error": undefined,
          "rule": {
            "key": "entity.data.country",
            "operation": "NOT_IN",
            "value": [
              "IL",
              "CA",
              "US",
              "GB",
            ],
          },
          "status": "FAILED",
        }
      `);
    });
  });
});
