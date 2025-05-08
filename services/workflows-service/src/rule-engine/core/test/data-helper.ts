export const context = {
  id: '527658792383',
  entity: {
    data: {
      country: 'AF',
      companyName: 'Airstar',
      additionalInfo: {
        mainRepresentative: {
          email: 'test1287888920@ballerine.com',
          lastName: 'Zamir',
          firstName: 'Lior',
        },
      },
    },
  },
  type: 'business',
  state: 'company_documents',
  customerName: 'Customer',
  pluginsOutput: {
    businessInformation: {
      data: [
        {
          type: 'COM',
          number: '201621146H',
          shares: [
            {
              shareType: 'Ordinary',
              issuedCapital: '30002',
              paidUpCapital: '30002',
              shareAllotted: '30002',
              shareCurrency: 'SINGAPORE, DOLLARS',
            },
          ],
          status: 'Live Company',
          expiryDate: '',
          statusDate: '2024-01-02',
          companyName: 'SINGAPORE PTE. LTD.',
          companyType: 'EXEMPT PRIVATE COMPANY LIMITED BY SHARES',
          lastUpdated: '2024-06-12 15:47:26',
          historyNames: ['AIR STAR ALLIANCE GOLBAL SINGAPORE PTE. LTD.'],
          businessScope: {
            code: '46306',
            description: 'WHOLESALE OF HEALTH SUPPLEMENTS',
            otherDescription: '',
          },
          establishDate: '2024-01-02',
          lastFinancialDate: '2023-08-31',
          registeredAddress: {
            postalCode: '560232',
            streetName: 'ANG MO KIO AVENUE 3',
            unitNumber: '1212',
            levelNumber: '07',
            buildingName: 'KEBUN BARU PALM VIEW',
            blockHouseNumber: '232',
          },
          lastAnnualReturnDate: '2024-02-27',
          lastAnnualGeneralMeetingDate: '2024-02-27',
        },
      ],
      name: 'businessInformation',
      status: 'SUCCESS',
      orderId: 'av202406121547221341867814',
      invokedAt: 1718178448068,
    },
    companySanctions: {
      data: [
        {
          entity: {
            name: 'REDIA S.R.L.',
            places: [
              {
                city: 'Trelew',
                type: '',
                address: 'Chubut 9100',
                country: 'Argentina',
                location: '',
              },
            ],
            sources: [
              {
                url: 'https://servicioscf.afip.gob.ar/Facturacion/facturasApocrifas/default.aspx',
                dates: [],
                categories: ['Corporate/Business', 'Regulatory Enforcement List'],
              },
            ],
            category: 'SIE',
            countries: [],
            enterDate: '',
            categories: ['Special Interest Entity (SIE) - Regulatory Enforcement'],
            identities: [],
            otherNames: [],
            generalInfo: {
              website: '',
              nationality: '',
              alternateTitle: '',
              businessDescription: '',
            },
            subcategory: '',
            descriptions: [
              {
                description1: 'Special Interest Entity (SIE)',
                description2: 'Regulatory Enforcement',
                description3: '',
              },
            ],
            lastReviewed: '',
            officialLists: [],
            linkedCompanies: [],
            primaryLocation: 'Chubut 9100, Trelew, Argentina',
            linkedIndividuals: [],
            furtherInformation: [],
            originalScriptNames: [],
          },
          matchedFields: ['PrimaryName'],
        },
      ],
      name: 'companySanctions',
      status: 'SUCCESS',
      invokedAt: 1716447914675,
    },
  },
  workflowRuntimeId: '1',
};

export const amlContext = {
  childWorkflows: {
    kyc_email_session_example: {
      example_id_001: {
        tags: ['approved'],
        state: 'approved',
        result: {
          childEntity: {
            email: 'test.user+1234567890@example.com',
            lastName: 'Doe',
            firstName: 'John',
            nationalId: '123456789012345678',
            additionalInfo: {
              companyName: 'Example Company',
              fullAddress: '123 Example Street, Example City',
              nationality: 'XX',
              customerCompany: 'SampleCorp',
              percentageOfOwnership: 25,
              __isGeneratedAutomatically: true,
            },
            ballerineEntityId: 'example_entity_001',
          },
          vendorResult: {
            aml: {
              id: 'example_aml_id_001',
              hits: [
                {
                  pep: [
                    {
                      date: null,
                      sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                      sourceName:
                        'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                    },
                  ],
                  warnings: [
                    {
                      date: null,
                      sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                      sourceName:
                        'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                    },
                  ],
                  countries: [],
                  sanctions: [
                    {
                      date: null,
                      sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                      sourceName:
                        'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                    },
                  ],
                  matchTypes: ['name_exact'],
                  matchedName: 'Jane Smith',
                  adverseMedia: [
                    {
                      date: null,
                      sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                      sourceName:
                        'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                    },
                  ],
                  fitnessProbity: [
                    {
                      date: null,
                      sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                      sourceName:
                        'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
                    },
                  ],
                },
                {
                  pep: [],
                  warnings: [],
                  countries: [],
                  sanctions: [],
                  matchTypes: ['name_fuzzy'],
                  matchedName: 'Janet Smyth',
                  adverseMedia: [],
                  fitnessProbity: [
                    {
                      date: null,
                      sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                      sourceName:
                        'Example Ministry of Corporate Affairs List of Disqualified Directors Section XYZ (Suspended)',
                    },
                  ],
                },
              ],
              clientId: 'example_client_id_001',
              checkType: 'initial_result',
              createdAt: '2024-06-26T09:16:17.562Z',
              endUserId: 'example_entity_001',
              matchStatus: 'no_match',
            },
            entity: {
              data: {
                lastName: null,
                firstName: 'JANE SMITH',
                dateOfBirth: '1990-01-01',
                additionalInfo: {
                  gender: null,
                  nationality: null,
                },
              },
              type: 'individual',
            },
            decision: {
              status: 'declined',
              decisionScore: 0.47,
            },
          },
        },
        status: 'completed',
      },
    },
  },
};

export const amlV2ContextNoHits = {
  entity: {
    data: {
      additionalInfo: {
        mainRepresentative: {
          ballerineEntityId: 'NO_HITS',
        },
      },
    },
  },
};

export const amlV2ContextWithMainRepresentative = {
  entity: {
    data: {
      additionalInfo: {
        mainRepresentative: {
          ballerineEntityId: '123',
        },
      },
    },
  },
};

export const amlV2ContextWithUbos = {
  entity: {
    data: {
      additionalInfo: {
        ubos: [
          {
            ballerineEntityId: '123',
          },
        ],
      },
    },
  },
};

export const amlV2ContextWithDirectors = {
  entity: {
    data: {
      additionalInfo: {
        directors: [
          {
            ballerineEntityId: '123',
          },
        ],
      },
    },
  },
};

export const helpers = {
  getEndUserById: async (id: string) => {
    if (id === 'NO_HITS') {
      return {
        amlHits: [],
      };
    } else {
      return {
        amlHits: [
          {
            pep: [
              {
                date: null,
                type: null,
                sourceUrl: 'https://www.cia.gov/resources/world-leaders/foreign-governments/',
                sourceName: 'Central Intelligence Agency Foreign Governments Leadership',
              },
            ],
            other: [],
            vendor: 'veriff',
            warnings: [],
            countries: ['Austria', 'Brazil', 'Germany', 'Switzerland', 'United Kingdom'],
            sanctions: [
              {
                sourceUrl:
                  'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
                sourceName: 'OFAC SDN List',
                date: '2023-05-08T00:00:00Z',
              },
            ],
            matchTypes: ['name_exact'],
            matchedName: 'Charles Philip Arthur George',
            adverseMedia: [
              {
                date: '2023-09-06T00:00:00Z',
                type: null,
                sourceUrl:
                  'https://www.connexionfrance.com/news/while-the-world-mocks-the-british-royal-family-france-remains-loyal/218884',
                sourceName:
                  "'While the world mocks the British Royal Family, France remains loyal'",
              },
            ],
            fitnessProbity: [
              {
                date: null,
                sourceUrl: 'http://example.gov/disqualifieddirectorslist.html',
                sourceName:
                  'Example Ministry of Corporate Affairs List of Disqualified Directors Division XYZ (Suspended)',
              },
            ],
          },
        ],
      };
    }
  },
};

export const ubosMismatchContext = Object.freeze({
  state: 'personal_details',
  entity: {
    id: '0067x00000OExFJAA1',
    data: {
      address: {
        city: 'Tel-Aviv',
        street: 'Lincoln',
        country: 'AX',
        postalCode: '978333',
        streetNumber: '20',
      },
      country: 'GB',
      companyName: '2 PAY PEOPLE LTD',
      businessType: 'Private Limited Company',
      additionalInfo: {
        apm: {
          email: 'jod@ballerine.com',
          jobTitle: 'Manager1',
          lastName: 'MAnager',
          firstName: 'APM',
          secretWord: 'dsadasdsadsa',
          phoneNumber: '11234543212',
        },
        dba: 'ASSISTED SALE PROPERTY',
        mcc: '8931',
        ubos: [
          {
            city: 'Tel-Aviv',
            role: 'Alon Peretz',
            email: 'alon+3232@ballerine.com',
            phone: '12121121221',
            street: 'Lincoln 20',
            country: 'AL',
            lastName: 'SEYMOUR',
            firstName: 'JUDITH',
            sourceOfFunds: 'Ballerine',
            sourceOfWealth: 'Ballerine',
            ballerineEntityId: 'cm8houie1000drt0knmynbu98',
            ownershipPercentage: 29,
          },
          {
            city: 'Tel-Aviv',
            role: 'Alon Peretz',
            email: 'alon+3232@ballerine.com',
            phone: '12121121221',
            street: 'Lincoln 20',
            country: 'AL',
            lastName: 'MOFFAT',
            firstName: 'ANNE',
            sourceOfFunds: 'Ballerine',
            sourceOfWealth: 'Ballerine',
            ballerineEntityId: 'cm8houie1000drt0knmynbu98',
            ownershipPercentage: 29,
          },
        ],
        cPanel: {
          email: 'dudi@12.com',
          jobTitle: 'Test',
          lastName: 'Test',
          firstName: 'Test',
          secretWord: 'Test',
          phoneNumber: '11234321234',
        },
        industry: 'Accounting, Auditing, and Bookkeeping Services',
        websites: [
          {
            url: 'https://ballerine2.com',
            isLoginRequired: false,
          },
        ],
        directors: [
          {
            city: 'Tel-Aviv',
            role: 'Alon Peretz',
            email: 'alon+3232@ballerine.com',
            phone: '11234532132',
            street: 'Lincoln 20',
            country: 'DZ',
            lastName: 'Peretz',
            firstName: 'Alon',
            sourceOfFunds: 'Ballerine',
            sourceOfWealth: 'Ballerine',
            ballerineEntityId: 'cm8houi9i0009n30k3rnwyd65',
            ownershipPercentage: 29,
          },
        ],
        taxIdType: 'ABN',
        taxNumber: '1234434343',
        iAmDirector: true,
        mainWebsite: {
          url: 'https://ballerine.com',
          password: 'DAS',
          username: 'FA',
          isLoginRequired: true,
        },
        headquarters: {
          physical: {
            city: 'Tel-Aviv',
            street: 'Lincoln',
            country: 'AS',
            postalCode: '978333',
            streetNumber: '20',
          },
          isDifferentFromPhysical: true,
        },
        chargingModel: 'one-of',
        imShareholder: true,
        openCorporate: {
          vat: '',
          name: '2 PAY PEOPLE LTD',
          companyType: 'Private Limited Company',
          companyNumber: '11906892',
          currentStatus: 'Active',
          jurisdictionCode: 'gb',
          incorporationDate: '2019-03-26',
        },
        targetMarkets: ['AL'],
        bankInformation: {
          iban: 'GB29NWBK60161331926819',
          name: '222',
          country: 'AL',
          swiftCode: '222211221',
          accountNumber: '213',
          accountHolderName: '32311',
        },
        servicesOffered: 'fdas',
        underwriterEmail: 'underwriting@customer.com.invalid',
        incorporationDate: '2019-03-26',
        otherProviderInfo: 'ADS',
        processingDetails: {
          averageFullfilmentPeriod: '11',
          averageRefundAmountRatio: 1,
          averageChargebackAmountRatio: 2,
        },
        mainRepresentative: {
          email: 'alon+3232@ballerine.com',
          lastName: 'Peretz',
          firstName: 'Alon',
          additionalInfo: {
            jobTitle: 'CTO',
          },
          ballerineEntityId: 'cm8hoi4ik0004rw0kljqryuil',
        },
        maximumTicketValue: 22,
        minimumTicketValue: 22,
        associatedCompanies: [
          {
            dba: '2121',
            country: 'AX',
            taxIdType: 'BN',
            taxNumber: '12212121',
            companyName: '2121',
            businessType: 'Limited Liability Partnership',
            registrationNumber: '21211221',
            dateOfEstablishment: '2025-03-03T22:00:00.000Z',
            paymentStatementPhoneNumber: '12121211221',
          },
        ],
        processingCurrencies: ['AFN'],
        underwriterFirstName: 'Underwriting',
        expectedMonthlyVolume: 4422,
        averageTransactionValue: 22,
        fullfilmentCycleDetails: 'trew',
        paymentStatementPhoneNumber: '12212121212',
        expectedIntegrationStartDate: '2025-03-19T22:00:00.000Z',
        expectedIntegrationGoLiveDate: '2025-03-20T22:00:00.000Z',
        expectedNumberOfTransactionsPerMonth: 33,
        iHaveAnotherAccountWithAnotherAcquirerOrProvider: true,
        thereAreNoCompaniesWithMoreThan25PercentOfTheCompany: false,
      },
      registrationNumber: '11906892',
      taxIdentificationNumber: '',
    },
    type: 'business',
    ballerineEntityId: 'cm8ho6gpt002ru70k2crkcahg',
  },
  metadata: {
    token: '7399db0d-8b60-400e-8f8d-aaff7fc6fb48',
    customerId: 'cm2iz3ql60003ptnpqnpor2d1',
    customerName: 'customer',
    collectionFlowUrl: 'https://collection-sb.ballerine.app',
    customerNormalizedName: 'customer',
  },
  documents: [],
  customerName: 'customer',
  pluginsInput: {
    ubo: {
      status: 'SUCCESS',
      requestPayload: {
        vendor: 'kyckr',
        callbackUrl:
          '{secret.APP_API_URL}/api/v1/external/workflows/cm8hoi4ib0002rw0kqjjkmup1/hook/VENDOR_DONE?resultDestination=pluginsOutput.ubo.data&processName=ubo-unified-api',
      },
    },
  },
  pluginsOutput: {
    ubo: {
      code: 200001,
      data: {
        edges: [
          {
            id: 'f5b56379-e109-4eeb-890d-8d9edb6a8ccb->38466223-6d2f-4279-b018-1a7a594de68d',
            data: {
              sharePercentage: 50,
            },
            source: 'f5b56379-e109-4eeb-890d-8d9edb6a8ccb',
            target: '38466223-6d2f-4279-b018-1a7a594de68d',
          },
          {
            id: 'f5b56379-e109-4eeb-890d-8d9edb6a8ccb->067b0564-7585-4acd-a31f-cc45bd085ba1',
            data: {
              sharePercentage: 50,
            },
            source: 'f5b56379-e109-4eeb-890d-8d9edb6a8ccb',
            target: '067b0564-7585-4acd-a31f-cc45bd085ba1',
          },
        ],
        nodes: [
          {
            id: 'f5b56379-e109-4eeb-890d-8d9edb6a8ccb',
            data: {
              name: '2 PAY PEOPLE LTD',
              type: 'COMPANY',
            },
          },
          {
            id: '38466223-6d2f-4279-b018-1a7a594de68d',
            data: {
              name: 'ANNE MOFFAT',
              type: 'PERSON',
              sharePercentage: 50,
            },
          },
          {
            id: '067b0564-7585-4acd-a31f-cc45bd085ba1',
            data: {
              name: 'JUDITH SEYMOUR',
              type: 'PERSON',
              sharePercentage: 50,
            },
          },
        ],
      },
      name: 'ubo',
      status: 'SUCCESS',
      orderId: '3274409',
      invokedAt: 1742495553890,
    },
  },
  collectionFlow: {
    state: {
      steps: [
        {
          stepName: 'personal_details',
          isCompleted: true,
        },
        {
          stepName: 'company_details',
          isCompleted: true,
        },
        {
          stepName: 'company_address_page',
          isCompleted: true,
        },
        {
          stepName: 'company_activity',
          isCompleted: true,
        },
        {
          stepName: 'security_questions',
          isCompleted: true,
        },
        {
          stepName: 'processing_details',
          isCompleted: true,
        },
        {
          stepName: 'company_contacts',
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
      apiUrl: 'https://api-sb.ballerine.app',
    },
    additionalInformation: {
      customerCompany: 'customer',
    },
  },
});
