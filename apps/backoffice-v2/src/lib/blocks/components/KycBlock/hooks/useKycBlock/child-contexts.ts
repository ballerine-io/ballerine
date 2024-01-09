export const childContexts = [
  {
    entity: {
      id: '1b8a738e-cebe-4f49-b167-b04a19613824',
      data: {
        email: 'alon@ballerine.com',
        lastName: 'peretz',
        firstName: 'alon',
        additionalInfo: { companyName: 'PayLynk', customerCompany: 'Fido' },
      },
      type: 'individual',
      ballerineEntityId: 'ckkt3t2bw000aqxtt0hj4pw4h',
    },
    pluginsOutput: {
      kyc_session: {
        kyc_session_1: {
          type: 'kyc',
          result: {
            entity: {
              data: {
                lastName: 'PERETZ',
                firstName: 'ALON',
                nationalId: '301124897',
                dateOfBirth: '1987-11-03',
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
            decision: { decision: { decision: 'approved', riskLabels: [], decisionReason: null } },
            metadata: {
              id: 'a5a52bfd-9960-4740-aba9-34efccd7e837',
              url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk4NDExMDYsInNlc3Npb25faWQiOiJhNWE1MmJmZC05OTYwLTQ3NDAtYWJhOS0zNGVmY2NkN2U4MzciLCJpaWQiOiJhN2IxYTQ3Mi04OTNkLTQwYjgtYWVhZi05ZmI3MmJkOGMxNGEifQ.C17Y6GoVHySzoIe2BLOl0LEJNoCwJ8uJKStrpFow_vA',
            },
            documents: [
              {
                type: 'identification_document',
                pages: [
                  {
                    uri: '/tmp/tmp-29952-GqMkV0ic69WN',
                    type: 'png',
                    metadata: { side: 'face' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavw6sf000ey840xznt41tz',
                  },
                  {
                    uri: '/tmp/tmp-29952-dggbjpY60LDY',
                    type: 'png',
                    metadata: { side: 'face-pre' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavw6sz000gy840mviyvwkb',
                  },
                  {
                    uri: '/tmp/tmp-29952-jQl4TvPQdRFD',
                    type: 'png',
                    metadata: { side: 'front-pre' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavw6w1000ky840f3ejjgti',
                  },
                  {
                    uri: '/tmp/tmp-29952-d74fYabKkM1S',
                    type: 'png',
                    metadata: { side: 'front' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavw6sc000cy840mtsvgdrk',
                  },
                  {
                    uri: '/tmp/tmp-29952-9Pjolbc2w70s',
                    type: 'png',
                    metadata: { side: 'back-pre' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavw6rl000ay840kp55eurx',
                  },
                  {
                    uri: '/tmp/tmp-29952-gS1uK1NQuTl3',
                    type: 'png',
                    metadata: { side: 'back' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavw6v8000iy8403zrps6pa',
                  },
                ],
                issuer: {
                  city: null,
                  name: null,
                  country: 'IL',
                  issuingVersion: null,
                  additionalInfo: {
                    validFrom: '2021-12-11',
                    firstIssue: null,
                    validUntil: '2057-11-03',
                  },
                },
                category: 'drivers_license',
                properties: {
                  idNumber: '301124897',
                  validFrom: '2021-12-11',
                  expiryDate: '2057-11-03',
                  firstIssue: null,
                  validUntil: '2057-11-03',
                },
              },
            ],
          },
          vendor: 'veriff',
        },
      },
    },
    workflowRuntimeId: 'clkavriif0006y840gowcj428',
  },
  {
    entity: {
      id: 'f5b5e6ab-3a80-4ba7-98e4-d9fa2d2b6676',
      data: {
        email: 'danielb@ballerine.com',
        lastName: 'Blokh',
        firstName: 'Daniel',
        additionalInfo: { companyName: 'PayLynk', customerCompany: 'Fido' },
      },
      type: 'individual',
      ballerineEntityId: 'ckkt3t2bw000aqxtt0hj4pw4i',
    },
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
            decision: { decision: { decision: 'approved', riskLabels: [], decisionReason: null } },
            metadata: {
              id: '7f13ae49-e6d1-4479-9beb-be8e5d55cb37',
              url: 'https://alchemy.veriff.com/v/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODk4NDExMDYsInNlc3Npb25faWQiOiI3ZjEzYWU0OS1lNmQxLTQ0NzktOWJlYi1iZThlNWQ1NWNiMzciLCJpaWQiOiJhN2IxYTQ3Mi04OTNkLTQwYjgtYWVhZi05ZmI3MmJkOGMxNGEifQ.bhzkKj2CYGUb6n5RYdpvmU9Z0RaVlGZDtxr6l_-hTog',
            },
            documents: [
              {
                type: 'identification_document',
                pages: [
                  {
                    uri: '/tmp/tmp-29952-CPFZAr69yPn5',
                    type: 'png',
                    metadata: { side: 'face' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavxcs1000oy8409bqnywj6',
                  },
                  {
                    uri: '/tmp/tmp-29952-ofe76Cjw0lTt',
                    type: 'png',
                    metadata: { side: 'face-pre' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavxcz4000uy840alavdrq9',
                  },
                  {
                    uri: '/tmp/tmp-29952-cexkZmPaUNAa',
                    type: 'png',
                    metadata: { side: 'front' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavxd0a000wy8403h2qtw9o',
                  },
                  {
                    uri: '/tmp/tmp-29952-s7JcLjJEyQCh',
                    type: 'png',
                    metadata: { side: 'front-pre' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavxcq7000my840jhesrgmv',
                  },
                  {
                    uri: '/tmp/tmp-29952-N1m8K1FzdRwV',
                    type: 'png',
                    metadata: { side: 'back-pre' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavxcs6000qy840v7r4eghx',
                  },
                  {
                    uri: '/tmp/tmp-29952-45OsBmIVcmm5',
                    type: 'png',
                    metadata: { side: 'back' },
                    provider: 'file-system',
                    ballerineFileId: 'clkavxcta000sy840kdk9pof7',
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
          },
          vendor: 'veriff',
        },
      },
    },
    workflowRuntimeId: 'clkavriig0008y840n7j1x5dn',
  },
] as const;
