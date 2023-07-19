export const childContext = {
  entity: {
    id: 'f5b5e6ab-3a80-4ba7-98e4-d9fa2d2b6676',
    data: {
      // Type individual
      email: 'danielb@ballerine.com',
      lastName: 'Treutel',
      firstName: 'Velde',
      documents: {},
      additionalInfo: { companyName: 'PayLynk', customerCompany: 'Fido' },
    },
    type: 'individual',
    ballerineEntityId: 'ckkt3t2bw000aqxtt0hj4pw4i',
  },
  // Ballerine UI, Vendor UI (collect document) -> SAME API REQUEST FOR KYC
  documents: [
    {
      id: 'ckkt3t2bw000aqxtt0hj4pw4i',
      category: 'driver_license',
      type: 'identification_document',
      issuer: {
        country: 'IL',
        city: 'Tel Aviv', // placeOfIssue
        issuingVersion: '1', // issueNumber
      },
      pages: [
        {
          uri: '/tmp/tmp-180774-ul6C1mk5YySc',
          type: 'png',
          metadata: { side: 'face' },
          provider: 'base64',
          ballerineFileId: 'clk8hoeld000ay8hiqx1wzlyv',
        },
        {
          uri: '/tmp/tmp-180774-rE73yoEruLcX',
          type: 'png',
          metadata: { side: 'front' },
          provider: 'base64',
          ballerineFileId: 'clk8hoeoq000ey8hi6an6pgzw',
        },
        {
          uri: '/tmp/tmp-180774-Sfcak52NOEeX',
          type: 'png',
          metadata: { side: 'back' },
          provider: 'base64',
          ballerineFileId: 'clk8hoemc000cy8hi9694ng2d',
        },
      ],
      properties: {
        // documents
        idNumber: null,
        expiryDate: null,
        validFrom: '',
        validUntil: '',
        issuingDate: null,
        firstIssue: null,
      },
      decision: {
        recommendation: {
          decision: 'declined',
          decisionReason: 'Suspicious behaviour',
          vendor: 'veriff',
          riskLabels: [],
        },
      },
    },
  ],
  pluginOutputs: {
    kyc: {
      id: '154f1554-8559-438e-8a81-1cbf637a3396',
      vendor: 'veriff',
      results: [
        {
          metadata: {
            id: 'kyc-2', // invokation name // id
            resultType: 'sync',
            features: ['ocr'],
          },
          entity: {}, // ocr entity data
          decision: {}, // case (AML, IDV, NAME MATCH)
          documents: [
            {
              id: 'ckkt3t2bw000aqxtt0hj4pw4i',
              properties: {
                // documents
                idNumber: null,
                expiryDate: null,
                validFrom: '',
                validUntil: '',
                issuingDate: null,
                firstIssue: null,
              },

              decision: {
                status: 'declined',
                decisionReason: 'Suspicious behaviour',
                riskLabels: [],
              },
            },
          ],
        },
      ],
    },
    kyc_session: {
      // static name // plugin type
      id: '154f1554-8559-438e-8a81-1cbf637a3396',
      vendor: 'veriff',
      results: [
        {
          metadata: {
            url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk2OTYzODUsInNlc3Npb25faWQiOiIxNTRmMTU1NC04NTU5LTQzOGUtOGE4MS0xY2JmNjM3YTMzOTYiLCJpaWQiOiJiNTNmNzJmMy03OGQzLTRmNGMtYmE5YS1hZjA1MTJkNDNkMDQifQ.McTSFtdDtI8biJZqNubJ7q8rKqHv6VtmaOYce5WVMYE',
            id: 'kyc-session-2', // invokation name // id
            resultType: 'webhook',
            features: ['ocr'],
          },
          entity: {
            firstName: 'Velda',
          }, // Type individual
          decision: {}, // case (AML, IDV, NAME MATCH)
          documents: [
            {
              category: 'driver_license',
              type: 'identification_document',
              issuer: {
                country: 'IL',
                city: 'Tel Aviv', // placeOfIssue
                issuingVersion: '1', // issueNumber
              },
              pages: [
                {
                  uri: '/tmp/tmp-180774-ul6C1mk5YySc',
                  type: 'png',
                  metadata: { side: 'face' },
                  provider: 'base64',
                  ballerineFileId: 'clk8hoeld000ay8hiqx1wzlyv',
                },
                {
                  uri: '/tmp/tmp-180774-rE73yoEruLcX',
                  type: 'png',
                  metadata: { side: 'front' },
                  provider: 'base64',
                  ballerineFileId: 'clk8hoeoq000ey8hi6an6pgzw',
                },
                {
                  uri: '/tmp/tmp-180774-Sfcak52NOEeX',
                  type: 'png',
                  metadata: { side: 'back' },
                  provider: 'base64',
                  ballerineFileId: 'clk8hoemc000cy8hi9694ng2d',
                },
              ],
              properties: {
                // documents
                idNumber: null,
                expiryDate: null,
                validFrom: '',
                validUntil: '',
                issuingDate: null,
                firstIssue: null,
              },
              decision: {
                status: 'declined',
                decisionReason: 'Suspicious behaviour',
                riskLabels: [],
              },
            },
          ],
        },
      ],
    },
  },
  workflowRuntimeId: 'clk8hln850008y8hirpjxjpby',
} as const;
