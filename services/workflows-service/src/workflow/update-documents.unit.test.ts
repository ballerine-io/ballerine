import { updateDocuments } from '@/workflow/update-documents';
import { DefaultContextSchema } from '@ballerine/common';

type Documents = DefaultContextSchema['documents'];

const getMockDocuments = (): Documents => [
  {
    id: 'id-1',
    version: 1,
    decision: {
      revisionReason: 'Blurry image',
      status: 'revision',
      rejectionReason: '',
    },
    issuingVersion: 1,
    type: 'photo',
    category: 'ID',
    pages: [
      {
        metadata: {
          pageNumber: '1',
        },
        ballerineFileId: 'fa679251-d4c9-4b1e-b53a-7a5a98b8420a',
        uri: 'http://extroverted-capon.biz',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
      {
        metadata: {
          pageNumber: '2',
        },
        ballerineFileId: 'f14717de-5f61-4732-9e01-46667098616d',
        uri: 'https://bubbly-software.name',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
      {
        metadata: {
          pageNumber: '3',
        },
        ballerineFileId: 'f14717de-5f61-4732-9e01-466670986162',
        uri: 'https://bubbly-software.name',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
    ],
    issuer: {
      city: 'Rowland Heights',
      type: 'government',
      name: 'Government',
      additionalInfo: {},
      country: 'Grenada',
    },
    properties: {
      // @ts-ignore
      nationality: 'Panama',
      fullName: 'Constance Kuvalis',
      dateOfBirth: '2002-04-03',
    },
  },
  {
    id: 'id-2',
    version: 1,
    decision: {
      revisionReason: 'Blurry image',
      status: 'revision',
      rejectionReason: '',
    },
    issuingVersion: 1,
    type: 'photo',
    category: 'driving_license',
    pages: [
      {
        metadata: {
          side: 'front',
          pageNumber: '1',
        },
        ballerineFileId: 'fa679251-d4c9-4b1e-b53a-7a5a98b84202',
        uri: 'http://extroverted-capon.biz',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
      {
        metadata: {
          side: 'back',
          pageNumber: '1',
        },
        ballerineFileId: 'f14717de-5f61-4732-9e01-466670986162',
        uri: 'https://bubbly-software.name',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
    ],
    issuer: {
      city: 'Rowland Heights',
      type: 'government',
      name: 'Government',
      additionalInfo: {},
      country: 'Grenada',
    },
    properties: {
      // @ts-ignore
      nationality: 'Panama',
      fullName: 'Constance Kuvalis',
      dateOfBirth: '2002-04-03',
    },
  },
  {
    id: 'id-3',
    version: 1,
    decision: {
      revisionReason: 'Blurry image',
      status: 'revision',
      rejectionReason: '',
    },
    issuingVersion: 1,
    type: 'photo',
    category: 'selfie',
    pages: [
      {
        metadata: {
          side: 'front',
          pageNumber: '1',
        },
        ballerineFileId: 'fa679251-d4c9-4b1e-b53a-7a5a98b84203',
        uri: 'http://extroverted-capon.biz',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
      {
        metadata: {
          side: 'back',
          pageNumber: '1',
        },
        ballerineFileId: 'f14717de-5f61-4732-9e01-466670986163',
        uri: 'https://bubbly-software.name',
        type: 'jpg',
        provider: 'http',
        data: '',
      },
    ],
    issuer: {
      city: 'Rowland Heights',
      type: 'government',
      name: 'Government',
      additionalInfo: {},
      country: 'Grenada',
    },
    properties: {
      // @ts-ignore
      nationality: 'Panama',
      fullName: 'Constance Kuvalis',
      dateOfBirth: '2002-04-03',
    },
  },
];

describe('updateDocuments', () => {
  describe('When adding a new document', () => {
    it('Should add the new document to the list', () => {
      const documents = getMockDocuments();
      const documentsToUpdate: Documents = [
        {
          version: 1,
          decision: {
            revisionReason: 'Blurry image',
            status: 'revision',
            rejectionReason: '',
          },
          issuingVersion: 1,
          type: 'photo',
          category: 'passport',
          pages: [
            {
              metadata: {
                pageNumber: '1',
              },
              ballerineFileId: 'fa679251-d4c9-4b1e-b53a-7a5a98b8420a',
              uri: 'http://extroverted-capon.biz',
              type: 'jpg',
              provider: 'http',
              data: '',
            },
          ],
          issuer: {
            city: 'Rowland Heights',
            type: 'government',
            name: 'Government',
            additionalInfo: {},
            country: 'Israel',
          },
          properties: {
            // @ts-ignore
            nationality: 'Panama',
            fullName: 'Constance Kuvalis',
            dateOfBirth: '2002-04-03',
          },
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result).toEqual([...documents, ...documentsToUpdate]);
    });
  });

  describe('When updating an existing document', () => {
    it('Should override the existing document with the new one', () => {
      const documents = getMockDocuments();
      const documentsToUpdate: Documents = [
        {
          id: 'id-1',
          version: 1,
          decision: {
            revisionReason: '',
            status: 'approved',
            rejectionReason: '',
          },
          issuingVersion: 1,
          type: 'photo',
          category: 'ID',
          pages: [
            {
              metadata: {
                pageNumber: '1',
              },
              uri: 'http://extroverted-capon.biz',
              type: 'jpg',
              provider: 'http',
              data: '',
            },
          ],
          issuer: {
            city: 'Rowland Heights',
            type: 'government',
            name: 'Government',
            additionalInfo: {},
            country: 'Grenada',
          },
          properties: {
            // @ts-ignore
            nationality: 'Panama',
            fullName: 'Lorem',
            dateOfBirth: '2002-04-03',
          },
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result).toEqual([documentsToUpdate[0], ...documents.slice(1)]);
    });
  });

  describe('When not adding or updating documents', () => {
    it('Should remain the same', () => {
      const documents = getMockDocuments();
      const documentsToUpdate: Documents = [];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result).toEqual(documents);
    });
  });
});
