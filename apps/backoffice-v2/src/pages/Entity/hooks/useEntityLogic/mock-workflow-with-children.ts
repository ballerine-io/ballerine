import { StateTag } from '@ballerine/common';
import { faker } from '@faker-js/faker';

export const workflow = {
  id: 'clkb7ougv000wy8fhwnechfg3',
  state: 'manual_review',
  status: 'active',
  context: {
    entity: {
      data: {
        address: { text: 'dwadaw' },
        website: 'dwadwa',
        companyName: 'Gocardless LTD',
        additionalInfo: {
          ubos: [
            {
              entity: {
                id: '74a38dd6-58b4-4fae-9457-2d2fd6708eb3',
                data: {
                  email: 'danielb@ballerine.com',
                  lastName: 'Blokh',
                  firstName: 'Daniel',
                  additionalInfo: { companyName: 'Gocardless LTD', customerCompany: 'PayLink' },
                },
                type: 'individual',
              },
            },
          ],
        },
        registrationNumber: '07495895',
        countryOfIncorporation: 'Great Britain',
      },
      type: 'business',
      endUserId: 'clkb7o20g000my8fhf3xsc89r',
      ballerineEntityId: 'clkb7o20h000ny8fhwf07zzxo',
    },
    documents: [
      {
        id: '5fa0f704-4f46-47de-9c1b-df2b99c83046',
        type: 'utility_bill',
        pages: [{ ballerineFileId: 'clkb7oufr000sy8fh8i5tzwmz' }],
        issuer: { country: 'GH' },
        version: '1',
        category: 'proof_of_address',
        properies: {},
        issuingVersion: 1,
        propertiesSchema: {},
      },
      {
        id: '7d2193da-f216-4d50-af06-d648d6c84977',
        type: 'certificate_of_incorporation',
        pages: [{ ballerineFileId: 'clkb7oufw000uy8fhz4liqkro' }],
        issuer: { country: 'GH' },
        version: '1',
        category: 'registration_document',
        properies: {},
        issuingVersion: 1,
        propertiesSchema: {},
      },
    ],
    pluginsOutput: {
      open_corporates: {
        name: 'GOCARDLESS LTD',
        source: {
          url: 'http://xmlgw.companieshouse.gov.uk/',
          publisher: 'UK Companies House',
          retrievedAt: '2023-05-09T05:03:38+00:00',
        },
        isBranch: true,
        officers: [
          {
            name: 'EREZ SHEMER MATHAN',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: '2021-10-12',
            position: 'secretary',
            startDate: '2015-08-21',
            isInactive: true,
            occupation: null,
            currentStatus: null,
          },
          {
            name: 'MATT JACK ROBINSON',
            address: '338-346 GOSWELL ROAD, LONDON, EC1V 7LQ, ENGLAND',
            endDate: '2015-03-01',
            position: 'secretary',
            startDate: '2011-01-17',
            isInactive: true,
            occupation: null,
            currentStatus: null,
          },
          {
            name: 'MATTHEW JACK ROBINSON',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: null,
            position: 'secretary',
            startDate: '2015-03-01',
            isInactive: false,
            occupation: null,
            currentStatus: null,
          },
          {
            name: 'HIROKI JAMES TAKEUCHI',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: null,
            position: 'secretary',
            startDate: '2015-03-01',
            isInactive: false,
            occupation: null,
            currentStatus: null,
          },
          {
            name: 'TOM BLOMFIELD',
            address: '338-346 GOSWELL ROAD, LONDON, EC1V 7LQ',
            endDate: '2013-09-09',
            position: 'director',
            startDate: '2011-01-17',
            isInactive: true,
            occupation: 'MANAGEMENT CONSULTANT',
            currentStatus: null,
          },
          {
            name: 'TIMOTHY BRIAN BUNTING',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: null,
            position: 'director',
            startDate: '2014-01-17',
            isInactive: false,
            occupation: 'DIRECTOR',
            currentStatus: null,
          },
          {
            name: 'MATT JACK ROBINSON',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: null,
            position: 'director',
            startDate: '2011-01-17',
            isInactive: false,
            occupation: 'MANAGEMENT CONSULTANT',
            currentStatus: null,
          },
          {
            name: 'HIROKI JAMES TAKEUCHI',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: null,
            position: 'director',
            startDate: '2011-01-17',
            isInactive: false,
            occupation: 'MANAGEMENT CONSULTANT',
            currentStatus: null,
          },
          {
            name: 'STEPHEN CHARLES CHANDLER',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: '2022-11-01',
            position: 'director',
            startDate: '2016-03-24',
            isInactive: true,
            occupation: 'COMPANY DIRECTOR',
            currentStatus: null,
          },
          {
            name: 'MICHAEL TRESKOW',
            address: '338-346 GOSWELL ROAD, LONDON, EC1V 7LQ, ENGLAND',
            endDate: '2016-09-21',
            position: 'director',
            startDate: '2014-03-19',
            isInactive: true,
            occupation: 'DIRECTOR',
            currentStatus: null,
          },
          {
            name: 'MARK XAVIER ZALESKI',
            address: '338-346 GOSWELL ROAD, LONDON, EC1V 7LQ, ENGLAND',
            endDate: '2016-09-24',
            position: 'director',
            startDate: '2014-10-01',
            isInactive: true,
            occupation: 'NON EXECUTIVE DIRECTOR',
            currentStatus: null,
          },
          {
            name: 'FREDERIC GEOFFREY ALBERT DESTIN',
            address: '338-346 GOSWELL ROAD, LONDON, EC1V 7LQ',
            endDate: '2017-04-24',
            position: 'director',
            startDate: '2016-09-21',
            isInactive: true,
            occupation: 'VENTURE CAPITAL INVESTOR',
            currentStatus: null,
          },
          {
            name: 'MARTIN CHARLES GIBSON',
            address: 'SUTTON YARD 65 GOSWELL ROAD, LONDON, EC1V 7EN, ENGLAND',
            endDate: null,
            position: 'director',
            startDate: '2017-04-20',
            isInactive: false,
            occupation: 'VENTURE CAPITAL INVESTOR',
            currentStatus: null,
          },
        ],
        agentName: null,
        industries: [
          {
            uid: 'uk_sic_2007-6209',
            code: '62.09',
            description: 'Other information technology and computer service activities',
            codeSchemeId: 'uk_sic_2007',
            codeSchemeName: 'UK SIC Classification 2007',
          },
          {
            uid: 'eu_nace_2-6209',
            code: '62.09',
            description: 'Other information technology and computer service activities',
            codeSchemeId: 'eu_nace_2',
            codeSchemeName: 'European Community NACE Rev 2',
          },
          {
            uid: 'isic_4-6209',
            code: '6209',
            description: 'Other information technology and computer service activities',
            codeSchemeId: 'isic_4',
            codeSchemeName: 'UN ISIC Rev 4',
          },
        ],
        isInactive: false,
        companyType: 'Private Limited Company',
        identifiers: [
          {
            uid: '212690528',
            identifierSystemCode: 'gb_vat',
            identifierSystemName: 'GB VAT Number',
          },
        ],
        registryUrl: 'https://beta.companieshouse.gov.uk/company/07495895',
        branchStatus: null,
        companyNumber: '07495895',
        currentStatus: 'Active',
        previousNames: [
          {
            type: null,
            endDate: '2011-08-25',
            language: null,
            startDate: '2011-01-17',
            companyName: 'GROUPAY LIMITED',
          },
        ],
        dissolutionDate: null,
        alternativeNames: [],
        jurisdictionCode: 'gb',
        incorporationDate: '2011-01-17',
        numberOfEmployees: null,
        registeredAddress: {
          region: null,
          country: 'England',
          locality: 'London',
          postalCode: 'EC1V 7EN',
          streetAddress: 'Sutton Yard\n65 Goswell Road',
        },
        registeredAddressInFull: 'Sutton Yard\n65 Goswell Road, London, EC1V 7EN',
      },
    },
    childWorkflows: {
      kyc_email_session_example: {
        clkb7ouhw0010y8fh4cx05gr3: {
          result: {
            childEntity: {
              email: 'danielb@ballerine.com',
              lastName: 'Blokh',
              firstName: 'Daniel',
              additionalInfo: { companyName: 'Gocardless LTD', customerCompany: 'PayLink' },
            },
            vendorResult: {
              entity: {
                data: {
                  lastName: 'BLOKH',
                  firstName: 'DANIEL',
                  nationalId: '305508673',
                  dateOfBirth: '1990-12-14',
                  additionalInfo: {
                    gender: null,
                    addresses: [],
                    nationality: null,
                    yearOfBirth: null,
                    placeOfBirth: null,
                  },
                },
                type: 'individual',
              },
              decision: {
                decision: { decision: 'approved', riskLabels: [], decisionReason: null },
              },
              metadata: {
                id: 'eeb2967c-10b6-4ad9-b9e7-ddce68867296',
                url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk4NjExNDAsInNlc3Npb25faWQiOiJlZWIyOTY3Yy0xMGI2LTRhZDktYjllNy1kZGNlNjg4NjcyOTYiLCJpaWQiOiI0NGFhNDc1Ny02NzdhLTQ3ZWUtYTE3Ny0zZjA2MmY1NjI0OTkifQ.bAq1VFSgNbps1bu1dEouz79JXQUSY9Gn38SchgmVYzs',
              },
            },
          },
          entityId: '74a38dd6-58b4-4fae-9457-2d2fd6708eb3',
        },
      },
    },
    workflowRuntimeId: 'clkb7ougv000wy8fhwnechfg3',
  },
  assignee: null,
  createdAt: '2023-07-20T13:52:17.216Z',
  assigneeId: null,
  workflowDefinition: {
    id: 'kyb_parent_kyc_session_example',
    name: 'kyb_parent_kyc_session_example',
    config: {
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
        },
      ],
    },
    definition: {
      id: 'kyb_parent_kyc_session_example_v1',
      states: {
        idle: { on: { start: 'run_ubos' } },
        reject: { tags: [StateTag.REJECTED], type: 'final' },
        approve: { tags: [StateTag.APPROVED], type: 'final' },
        revision: { tags: [StateTag.REVISION], type: 'final' },
        run_ubos: {
          on: {
            FAILED: [{ target: 'auto_reject' }],
            CONTINUE: [{ target: 'run_kyb_enrichment' }],
          },
        },
        auto_reject: { tags: [StateTag.REJECTED], type: 'final' },
        manual_review: {
          tags: [StateTag.MANUAL_REVIEW],
          on: { reject: 'reject', approve: 'approve', revision: 'revision' },
        },
        run_kyb_enrichment: {
          on: {
            FAILED: [{ target: 'auto_reject' }],
            KYB_DONE: [{ target: 'pending_kyc_response_to_finish' }],
          },
        },
        pending_kyc_response_to_finish: {
          on: {
            KYC_RESPONDED: [
              {
                cond: {
                  type: 'jmespath',
                  options: {
                    rule: 'length(childWorkflows.kyc_email_session_example.*.[result.vendorResult.decision][]) == length(childWorkflows.kyc_email_session_example.*[])',
                  },
                },
                target: 'manual_review',
              },
            ],
          },
        },
      },
      context: { documents: [] },
      initial: 'idle',
      predictableActionArguments: true,
    },
    contextSchema: null,
  },
  childWorkflowsRuntimeData: [
    {
      id: 'clkb7ouhw0010y8fh4cx05gr3',
      state: 'kyc_manual_review',
      status: 'completed',
      context: {
        entity: {
          id: '74a38dd6-58b4-4fae-9457-2d2fd6708eb3',
          data: {
            email: 'danielb@ballerine.com',
            lastName: 'Blokh',
            firstName: 'Daniel',
            additionalInfo: { companyName: 'Gocardless LTD', customerCompany: 'PayLink' },
          },
          type: 'individual',
        },
        documents: [
          { id: '3c320e93-1ae6-4401-805d-a7e92406b69c' },
          {
            id: '92d90775-aadd-4498-ba40-9843c6d6896e',
            type: 'identification_document',
            pages: [
              {
                uri: '/tmp/tmp-89981-fIh611Tr7Dwm',
                type: 'png',
                metadata: { side: 'face' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjww0012y8fhwswdmljw',
              },
              {
                uri: '/tmp/tmp-89981-Rb3cispk5fvE',
                type: 'png',
                metadata: { side: 'face-pre' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjzu001cy8fhqunotnbr',
              },
              {
                uri: '/tmp/tmp-89981-TP3ngSh1Zvp6',
                type: 'png',
                metadata: { side: 'front-pre' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjxk0014y8fhht6zviwa',
              },
              {
                uri: '/tmp/tmp-89981-mhhBL7VhHYeF',
                type: 'png',
                metadata: { side: 'front' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjyb0016y8fhevexwb4a',
              },
              {
                uri: '/tmp/tmp-89981-Ch15f3EIZiAw',
                type: 'png',
                metadata: { side: 'back-pre' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjz8001ay8fhyx060lml',
              },
              {
                uri: '/tmp/tmp-89981-K92h4r8z8XAu',
                type: 'png',
                metadata: { side: 'back' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjyv0018y8fh7d1elxv9',
              },
            ],
            issuer: {
              city: null,
              name: null,
              country: 'IL',
              issuingVersion: null,
              additionalInfo: {
                validFrom: '2017-04-21',
                firstIssue: null,
                validUntil: '2026-12-14',
              },
            },
            category: 'drivers_license',
            properties: {
              idNumber: '305508673',
              validFrom: '2017-04-21',
              expiryDate: '2026-12-14',
              firstIssue: null,
              validUntil: '2026-12-14',
            },
          },
        ],
        pluginsOutput: {
          kyc_session: {
            kyc_session_1: {
              type: 'kyc',
              result: {
                entity: {
                  data: {
                    lastName: 'BLOKH',
                    firstName: 'DANIEL',
                    nationalId: '305508673',
                    dateOfBirth: '1990-12-14',
                    additionalInfo: {
                      gender: null,
                      addresses: [],
                      nationality: null,
                      yearOfBirth: null,
                      placeOfBirth: null,
                    },
                  },
                  type: 'individual',
                },
                decision: {
                  decision: { decision: 'approved', riskLabels: [], decisionReason: null },
                },
                metadata: {
                  id: 'eeb2967c-10b6-4ad9-b9e7-ddce68867296',
                  url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk4NjExNDAsInNlc3Npb25faWQiOiJlZWIyOTY3Yy0xMGI2LTRhZDktYjllNy1kZGNlNjg4NjcyOTYiLCJpaWQiOiI0NGFhNDc1Ny02NzdhLTQ3ZWUtYTE3Ny0zZjA2MmY1NjI0OTkifQ.bAq1VFSgNbps1bu1dEouz79JXQUSY9Gn38SchgmVYzs',
                },
              },
              vendor: 'veriff',
            },
          },
        },
        workflowRuntimeId: 'clkb7ouhw0010y8fh4cx05gr3',
      },
      assignee: null,
      business: null,
      createdAt: '2023-07-20T13:52:17.253Z',
      assigneeId: null,
      workflowDefinition: {
        id: 'kyc_email_session_example',
        name: 'kyc_email_session_example',
        config: {
          callbackResult: {
            deliverEvent: 'KYC_DONE',
            transformers: [{ mapping: '{data: @}', transformer: 'jmespath' }],
          },
        },
        definition: {
          id: 'kyc_email_session_example_v1',
          states: {
            idle: { on: { start: 'get_kyc_session' } },
            reject: { tags: [StateTag.REJECTED], type: 'final' },
            approve: { tags: [StateTag.APPROVED], type: 'final' },
            email_sent: {
              tags: [StateTag.REVISION],
              on: { KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }] },
            },
            get_kyc_session: {
              tags: [StateTag.PENDING_PROCESS],
              on: {
                SEND_EMAIL: [{ target: 'email_sent' }],
                API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
              },
            },
            kyc_auto_reject: { tags: [StateTag.REJECTED], type: 'final' },
            kyc_manual_review: { tags: [StateTag.MANUAL_REVIEW], type: 'final' },
          },
          initial: 'idle',
          predictableActionArguments: true,
        },
        contextSchema: null,
      },
      endUser: {
        id: 'clkb7ouhs000yy8fh9ei4psov',
        isContactPerson: false,
        correlationId: '74a38dd6-58b4-4fae-9457-2d2fd6708eb3',
        endUserType: 'individual',
        approvalState: 'NEW',
        stateReason: null,
        firstName: 'Daniel',
        lastName: 'Blokh',
        email: 'danielb@ballerine.com',
        phone: null,
        country: null,
        dateOfBirth: null,
        avatarUrl: null,
        nationalId: null,
        additionalInfo: { companyName: 'Gocardless LTD', customerCompany: 'PayLink' },
        createdAt: '2023-07-20T13:52:17.248Z',
        updatedAt: '2023-07-20T13:52:17.248Z',
      },
    },
  ],
  entity: {
    id: 'clkb7o20h000ny8fhwf07zzxo',
    name: 'Gocardless LTD',
    avatarUrl: null,
    approvalState: 'NEW',
  },
  nextEvents: ['UPDATE_CONTEXT', 'reject', 'approve', 'revision'],
  childWorkflows: [
    {
      id: 'clkb7ouhw0010y8fh4cx05gr3',
      state: 'kyc_manual_review',
      status: 'completed',
      context: {
        entity: {
          id: '74a38dd6-58b4-4fae-9457-2d2fd6708eb3',
          data: {
            email: 'danielb@ballerine.com',
            lastName: 'Blokh',
            firstName: 'Daniel',
            additionalInfo: { companyName: 'Gocardless LTD', customerCompany: 'PayLink' },
          },
          type: 'individual',
        },
        documents: [
          { id: '3c320e93-1ae6-4401-805d-a7e92406b69c', propertiesSchema: {} },
          {
            id: '92d90775-aadd-4498-ba40-9843c6d6896e',
            type: 'identification_document',
            pages: [
              {
                uri: '/tmp/tmp-89981-fIh611Tr7Dwm',
                type: 'png',
                metadata: { side: 'face' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjww0012y8fhwswdmljw',
              },
              {
                uri: '/tmp/tmp-89981-Rb3cispk5fvE',
                type: 'png',
                metadata: { side: 'face-pre' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjzu001cy8fhqunotnbr',
              },
              {
                uri: '/tmp/tmp-89981-TP3ngSh1Zvp6',
                type: 'png',
                metadata: { side: 'front-pre' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjxk0014y8fhht6zviwa',
              },
              {
                uri: '/tmp/tmp-89981-mhhBL7VhHYeF',
                type: 'png',
                metadata: { side: 'front' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjyb0016y8fhevexwb4a',
              },
              {
                uri: '/tmp/tmp-89981-Ch15f3EIZiAw',
                type: 'png',
                metadata: { side: 'back-pre' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjz8001ay8fhyx060lml',
              },
              {
                uri: '/tmp/tmp-89981-K92h4r8z8XAu',
                type: 'png',
                metadata: { side: 'back' },
                provider: 'file-system',
                ballerineFileId: 'clkb7sjyv0018y8fh7d1elxv9',
              },
            ],
            issuer: {
              city: null,
              name: null,
              country: 'IL',
              issuingVersion: null,
              additionalInfo: {
                validFrom: '2017-04-21',
                firstIssue: null,
                validUntil: '2026-12-14',
              },
            },
            category: 'drivers_license',
            properties: {
              idNumber: '305508673',
              validFrom: '2017-04-21',
              expiryDate: '2026-12-14',
              firstIssue: null,
              validUntil: '2026-12-14',
            },
            propertiesSchema: {},
          },
        ],
        pluginsOutput: {
          kyc_session: {
            kyc_session_1: {
              type: 'kyc',
              result: {
                vendorResult: {
                  aml: {
                    totalHits: 1,
                    createdAt: faker.date.recent().toISOString(),
                    hits: [
                      {
                        aka: ['John Doe', 'John Smith'],
                        dateOfBirth: '1992-04-13',
                        countries: ['US', 'GB'],
                        matchTypes: ['year_of_birth', 'full_name', 'last_name'],
                        matchedName: `John Doe`,
                        listingsRelatedToMatch: {
                          warnings: [
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'FBI Most Wanted',
                              date: faker.date.recent().toISOString(),
                            },
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'FBI Most Wanted',
                              date: faker.date.recent().toISOString(),
                            },
                          ],
                          sanctions: [
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'OFAC SDN List',
                              date: faker.date.recent().toISOString(),
                            },
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'OFAC SDN List',
                              date: faker.date.recent().toISOString(),
                            },
                          ],
                          pep: [
                            {
                              sourceName:
                                'United Kingdom Insolvency Service Disqualified Directors',
                              sourceUrl: 'https://www.navy.mil/Leadership/Biographies',
                              date: '2020-01-01',
                            },
                          ],
                          adverseMedia: [
                            {
                              sourceName: "SNA's Old Salt Award Passed to Adm. Davidson",
                              sourceUrl:
                                'https://www.marinelink.com/amp/news/snas-old-salt-award-passed-adm-davidson-443093',
                              date: '2021-03-09',
                            },
                          ],
                        },
                      },
                      {
                        aka: ['John Doe', 'John Smith'],
                        dateOfBirth: '1992-04-13',
                        countries: ['US', 'GB'],
                        matchTypes: ['year_of_birth', 'full_name', 'last_name'],
                        matchedName: `John Doe`,
                        listingsRelatedToMatch: {
                          warnings: [
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'FBI Most Wanted',
                              date: faker.date.recent().toISOString(),
                            },
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'FBI Most Wanted',
                              date: faker.date.recent().toISOString(),
                            },
                          ],
                          sanctions: [
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'OFAC SDN List',
                              date: faker.date.recent().toISOString(),
                            },
                            {
                              sourceUrl:
                                'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                              sourceName: 'OFAC SDN List',
                              date: faker.date.recent().toISOString(),
                            },
                          ],
                          pep: [
                            {
                              sourceName:
                                'United Kingdom Insolvency Service Disqualified Directors',
                              sourceUrl: 'https://www.navy.mil/Leadership/Biographies',
                              date: '2020-01-01',
                            },
                          ],
                          adverseMedia: [
                            {
                              sourceName: "SNA's Old Salt Award Passed to Adm. Davidson",
                              sourceUrl:
                                'https://www.marinelink.com/amp/news/snas-old-salt-award-passed-adm-davidson-443093',
                              date: '2021-03-09',
                            },
                          ],
                        },
                      },
                    ],
                  },
                  entity: {
                    data: {
                      lastName: 'BLOKH',
                      firstName: 'DANIEL',
                      nationalId: '305508673',
                      dateOfBirth: '1990-12-14',
                      additionalInfo: {
                        gender: null,
                        addresses: [],
                        nationality: null,
                        yearOfBirth: null,
                        placeOfBirth: null,
                      },
                    },
                    type: 'individual',
                  },
                  decision: {
                    decision: { decision: 'approved', riskLabels: [], decisionReason: null },
                  },
                  metadata: {
                    id: 'eeb2967c-10b6-4ad9-b9e7-ddce68867296',
                    url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk4NjExNDAsInNlc3Npb25faWQiOiJlZWIyOTY3Yy0xMGI2LTRhZDktYjllNy1kZGNlNjg4NjcyOTYiLCJpaWQiOiI0NGFhNDc1Ny02NzdhLTQ3ZWUtYTE3Ny0zZjA2MmY1NjI0OTkifQ.bAq1VFSgNbps1bu1dEouz79JXQUSY9Gn38SchgmVYzs',
                  },
                },
              },
              vendor: 'veriff',
            },
          },
        },
        workflowRuntimeId: 'clkb7ouhw0010y8fh4cx05gr3',
      },
      assignee: null,
      createdAt: '2023-07-20T13:52:17.253Z',
      assigneeId: null,
      workflowDefinition: {
        id: 'kyc_email_session_example',
        name: 'kyc_email_session_example',
        config: {
          callbackResult: {
            deliverEvent: 'KYC_DONE',
            transformers: [{ mapping: '{data: @}', transformer: 'jmespath' }],
          },
        },
        definition: {
          id: 'kyc_email_session_example_v1',
          states: {
            idle: { on: { start: 'get_kyc_session' } },
            reject: { tags: [StateTag.REJECTED], type: 'final' },
            approve: { tags: [StateTag.APPROVED], type: 'final' },
            email_sent: {
              tags: [StateTag.REVISION],
              on: { KYC_HOOK_RESPONDED: [{ target: 'kyc_manual_review' }] },
            },
            get_kyc_session: {
              tags: [StateTag.PENDING_PROCESS],
              on: {
                SEND_EMAIL: [{ target: 'email_sent' }],
                API_CALL_ERROR: [{ target: 'kyc_auto_reject' }],
              },
            },
            kyc_auto_reject: { tags: [StateTag.REJECTED], type: 'final' },
            kyc_manual_review: { tags: [StateTag.MANUAL_REVIEW], type: 'final' },
          },
          initial: 'idle',
          predictableActionArguments: true,
        },
        contextSchema: null,
      },
      entity: {
        id: 'clkb7ouhs000yy8fh9ei4psov',
        name: 'Daniel Blokh',
        avatarUrl: null,
        approvalState: 'NEW',
      },
    },
  ],
};
