import { DefaultContextSchema } from '@/workflow/schemas/context';
import { PartialDeep } from 'type-fest';
import { updateDocuments } from '@/workflow/update-documents';

type Documents = DefaultContextSchema['documents'];

const documents: Documents = [
  {
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
      additionalDetails: {},
      country: 'Grenada',
    },
    properties: {
      nationality: 'Panama',
      fullName: 'Constance Kuvalis',
      dateOfBirth: '2002-04-03',
    },
  },
  {
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
      additionalDetails: {},
      country: 'Grenada',
    },
    properties: {
      nationality: 'Panama',
      fullName: 'Constance Kuvalis',
      dateOfBirth: '2002-04-03',
    },
  },
  {
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
      additionalDetails: {},
      country: 'Grenada',
    },
    properties: {
      nationality: 'Panama',
      fullName: 'Constance Kuvalis',
      dateOfBirth: '2002-04-03',
    },
  },
];

describe('Update documents', () => {
  describe('When there are multiple documents and some of them are updated', () => {
    it('Should return the existing documents with the updated ones', () => {
      const documentsToUpdate: PartialDeep<Documents> = [
        {
          type: 'photo',
          category: 'ID',
          issuer: {
            country: 'Grenada',
            city: 'Tel Aviv',
          },

          properties: {
            nationality: 'Israeli',
          },
          decision: {
            status: 'approved',
            revisionReason: '',
          },
        },
        {
          type: 'photo',
          category: 'selfie',
          issuer: {
            country: 'Grenada',
            city: 'Berlin',
          },
          properties: {
            nationality: 'German',
          },
          decision: {
            status: 'approved',
            revisionReason: '',
          },
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result).toHaveLength(3);
      expect(result[0]?.issuer.city).toEqual('Tel Aviv');
      expect(result[0]?.properties).toEqual({
        nationality: 'Israeli',
        fullName: 'Constance Kuvalis',
        dateOfBirth: '2002-04-03',
      });
      expect(result[0]?.decision).toEqual({
        status: 'approved',
        revisionReason: '',
        rejectionReason: '',
      });
      expect(result[2]?.issuer.city).toEqual('Berlin');
      expect(result[2]?.properties).toEqual({
        nationality: 'German',
        fullName: 'Constance Kuvalis',
        dateOfBirth: '2002-04-03',
      });
      expect(result[2]?.decision).toEqual({
        status: 'approved',
        revisionReason: '',
        rejectionReason: '',
      });
    });
  });

  describe('When there are multiple documents and new documents are added', () => {
    it('Should return the existing documents with the new ones', () => {
      const documentsToUpdate: PartialDeep<Documents> = [
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
                side: 'front',
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
            additionalDetails: {},
            country: 'Grenada',
          },
          properties: {
            nationality: 'Panama',
            fullName: 'Constance Kuvalis',
            dateOfBirth: '2002-04-03',
          },
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result).toHaveLength(4);
      expect(result).toEqual([...documents, ...documentsToUpdate]);
    });
  });

  describe('When there are multiple documents and none are updated', () => {
    it('Should return the documents without changes', () => {
      const documentsToUpdate: PartialDeep<Documents> = [];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result).toEqual(documents);
    });
  });

  describe('When there are multiple pages and some of them are updated', () => {
    it('Should update only the given pages', () => {
      const documentsToUpdate: PartialDeep<Documents> = [
        {
          type: 'photo',
          category: 'ID',
          issuer: {
            country: 'Grenada',
          },
          pages: [
            {
              ballerineFileId: 'f14717de-5f61-4732-9e01-46667098616d',
              metadata: {
                pageNumber: '3',
              },
            },
            {
              ballerineFileId: 'f14717de-5f61-4732-9e01-466670986162',
              data: 'lorem ipsum',
            },
          ],
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result[0]?.pages).toHaveLength(3);
      expect(result[0]?.pages[1]?.metadata).toEqual({ pageNumber: '3' });
      expect(result[0]?.pages[2]?.data).toBe('lorem ipsum');
      expect(result[0]?.pages[0]).toEqual(documents[0]?.pages[0]);
    });
  });

  describe('When there are multiple pages and new pages are added', () => {
    it('Should add the new pages and drop the old ones', () => {
      const documentsToUpdate: PartialDeep<Documents> = [
        {
          type: 'photo',
          category: 'ID',
          issuer: {
            country: 'Grenada',
          },
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
            {
              metadata: {
                pageNumber: '2',
              },
              uri: 'http://extroverted-capon.biz',
              type: 'jpg',
              provider: 'http',
              data: '',
            },
          ],
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result[0]?.pages).toHaveLength(2);
      expect(result[0]?.pages).toEqual(documentsToUpdate[0]?.pages);
    });
  });

  describe('When there are multiple pages and none are updated', () => {
    it('Should return the pages without changes', () => {
      const documentsToUpdate: PartialDeep<Documents> = [
        {
          type: 'photo',
          category: 'ID',
          issuer: {
            country: 'Grenada',
          },
          pages: [],
        },
      ];

      const result = updateDocuments(documents, documentsToUpdate);

      expect(result[0]?.pages).toEqual(documents[0]?.pages);
    });
  });
});
