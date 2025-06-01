import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { IDocument, IFormElement, TBaseFields } from '@ballerine/ui';
import { generateGranularRevisionFields } from './generate-granular-revision-fields';

describe('generateGranularRevisionFields', () => {
  const mockContext = {
    documents: [
      {
        id: 'doc1',
        _document: {
          id: 'doc1',
          status: 'requested',
          decision: 'revisions',
          decisionReason: 'needs_review',
          comment: 'please fix this',
        },
      },
    ],
  } as unknown as CollectionFlowContext;

  const mockElements = [
    {
      element: 'documentfield',
      id: 'document-1',
      valueDestination: 'documents',
      params: {
        template: {
          id: 'doc1',
        },
      },
    },
  ] as Array<IFormElement<TBaseFields, any>>;

  it('should return empty array when no revision fields found', () => {
    const result = generateGranularRevisionFields({
      context: mockContext,
      documents: [],
      elements: [],
    });
    expect(result).toEqual([]);
  });

  it('should generate revision fields for document elements', () => {
    const result = generateGranularRevisionFields({
      context: mockContext,
      documents: [
        {
          id: 'testdoc-id',
          decision: 'revisions',
          decisionReason: 'needs_review',
          comment: 'please fix this',
        } as IDocument,
      ],
      elements: mockElements,
    });

    expect(result).toEqual([
      {
        id: 'document-1',
        reason: 'needs_review - please fix this',
      },
    ]);
  });
});
