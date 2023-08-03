import { TDocument } from '@/schemas';

export const canadaDocuments: TDocument[] = [
  {
    category: 'incorporation',
    type: 'pdf',
    issuer: {
      type: 'local_authority',
      country: 'CA',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      properties: {
        businessName: {
          type: 'string',
        },
        website: {
          type: 'string',
        },
        phone: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        owner: {
          type: 'string',
        },
        tin: {
          type: 'string',
        },
      },
    },
  },
  {
    category: 'id',
    type: 'photo',
    issuer: {
      type: 'local_authority',
      country: 'CA',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        middleName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        authority: {
          type: 'string',
        },
        placeOfIssue: {
          type: 'string',
        },
        issueDate: {
          type: 'string',
        },
        expires: {
          type: 'string',
        },
        dateOfBirth: {
          type: 'string',
        },
        placeOfBirth: {
          type: 'string',
        },
        sex: {
          type: 'string',
        },
      },
    },
  },
  {
    category: 'selfie',
    type: 'photo',
    issuer: {
      type: 'local_authority',
      country: 'CA',
    },
    issuingVersion: 1,
    version: 1,
    propertiesSchema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
        },
        middleName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        authority: {
          type: 'string',
        },
        placeOfIssue: {
          type: 'string',
        },
        issueDate: {
          type: 'string',
        },
        expires: {
          type: 'string',
        },
        dateOfBirth: {
          type: 'string',
        },
        placeOfBirth: {
          type: 'string',
        },
        sex: {
          type: 'string',
        },
      },
    },
  },
];
