export const certificateOfResidenceGH = {
  category: 'POR',
  type: 'certificateOfResidence',
  issuer: {
    type: 'government',
    name: 'Ghana Government - Ministry of Foreign Affairs and Regional Integration',
    country: 'GH',
  },
  issuingVersion: 1,
  version: 1,
  propertiesSchema: {
    type: 'object',
    properties: {
      userNationalId: {
        type: 'string',
        pattern: '^GHA-\\d{9}-\\d{1}$',
      },
      docNumber: {
        type: 'number',
      },
      userAddress: {
        type: 'string',
      },
      website: {
        type: 'string',
        format: 'uri',
      },
      expiryDate: {
        type: 'string',
        format: 'date',
      },
      email: {
        type: 'string',
        format: 'email',
      },
    },
  },
};
