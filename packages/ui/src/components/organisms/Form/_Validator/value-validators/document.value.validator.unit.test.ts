import { DocumentValueValidator } from './document.value.validator';

describe('DocumentValueValidator', () => {
  describe('validation will fail', () => {
    test('when document is not found', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'form.documents',
      });

      expect(() => validator.validate(null as any, {} as any)).toThrowError(
        'Document is required.',
      );
    });

    test('when document not found at specific page index', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'form.documents',
        pageIndex: 1,
      });

      expect(() => validator.validate(null as any, {} as any)).toThrowError(
        'Document is required.',
      );
    });

    test('when document is not found in nested data structure', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'data.items[$0].documents',
      });

      expect(() =>
        validator.validate(
          null as any,
          {
            stack: [1],
            context: {
              data: {
                items: [
                  {
                    documents: [],
                  },
                  {
                    documents: [],
                  },
                ],
              },
            },
          } as any,
        ),
      ).toThrowError('Document is required.');
    });

    test('when document not found at specific page index in nested data structure', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'data.items[$0].documents',
        pageIndex: 1,
      });

      expect(() =>
        validator.validate(
          null as any,
          {
            stack: [1],
            context: {},
          } as any,
        ),
      ).toThrowError('Document is required.');
    });
  });

  describe('validation will pass', () => {
    test('when document is found', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'documents',
      });

      const context = {
        documents: [
          {
            id: '123',
            pages: [
              {
                ballerineFileId: 'someFileId',
              },
            ],
          },
        ],
      };

      expect(() => validator.validate(null as any, { context, stack: [] })).not.toThrow();
    });

    test('when document is found at specific page index', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'documents',
        pageIndex: 1,
      });

      const context = {
        documents: [
          {
            id: '123',
            pages: [
              {},
              {
                ballerineFileId: 'someFileId',
              },
            ],
          },
        ],
      };

      expect(() => validator.validate(null as any, { context, stack: [] })).not.toThrow();
    });

    test.each([
      ['single level nesting', 'data.items[$0].documents', [0]],
      ['two levels of nesting', 'data.items[$0].subitems[$1].documents', [0, 1]],
      [
        'three levels of nesting',
        'data.items[$0].subitems[$1].subsubitems[$2].documents',
        [0, 1, 1],
      ],
    ])('when document is found in nested data structure - %s', (_, pathToDocuments, stack) => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments,
      });

      const context = {
        data: {
          items: [
            {
              documents: [{ id: '123', pages: [{ ballerineFileId: 'someFileId' }] }],
              subitems: [
                {},
                {
                  documents: [{ id: '123', pages: [{ ballerineFileId: 'someFileId' }] }],
                  subsubitems: [
                    {},
                    {
                      documents: [{ id: '123', pages: [{ ballerineFileId: 'someFileId' }] }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      expect(() => validator.validate(null as any, { context, stack })).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'documents',
      });

      expect(() => validator.validate(null as any, { context: {}, stack: [] })).toThrowError(
        'Document is required.',
      );
    });

    test('should return custom error message when message is provided', () => {
      const validator = new DocumentValueValidator({
        documentId: '123',
        pathToDocuments: 'documents',
        message: 'Custom error message.',
      });

      expect(() => validator.validate(null as any, { context: {}, stack: [] })).toThrowError(
        'Custom error message.',
      );
    });
  });
});
