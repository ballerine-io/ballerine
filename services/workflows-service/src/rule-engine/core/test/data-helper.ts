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
      name: 'kyb',
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
      name: 'company_sanctions',
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
