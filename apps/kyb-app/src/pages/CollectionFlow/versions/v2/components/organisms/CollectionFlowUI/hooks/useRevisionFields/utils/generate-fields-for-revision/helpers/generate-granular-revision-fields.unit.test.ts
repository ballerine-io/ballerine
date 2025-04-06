import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { IFormElement, TBaseFields } from '@ballerine/ui';
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
    const result = generateGranularRevisionFields(mockContext, []);
    expect(result).toEqual([]);
  });

  it('should generate revision fields for document elements', () => {
    const result = generateGranularRevisionFields(mockContext, mockElements);

    expect(result).toEqual([
      {
        id: 'document-1',
        reason: 'needs_review - please fix this',
      },
    ]);
  });

  it('should handle nested documents', () => {
    const nestedContext = {
      entries: [
        {
          documents: [
            {
              id: 'nested-doc-1',
              _document: {
                id: 'nested-doc-1',
                status: 'requested',
                decision: 'revisions',
                decisionReason: 'needs_review',
                comment: 'fix this issue',
              },
            },
          ],
        },
      ],
    } as unknown as CollectionFlowContext;

    const mockedElements = [
      {
        id: 'fieldlist',
        element: 'fieldlist',
        valueDestination: 'entries',
        children: [
          {
            id: 'document',
            element: 'documentfield',
            valueDestination: 'entries[$0].documents',
            params: {
              template: {
                id: 'nested-doc-1',
              },
            },
          },
          {
            id: 'random-element',
            element: 'random-element',
            valueDestination: 'entries[$0].random-element',
          },
        ],
      },
    ] as Array<IFormElement<TBaseFields, any>>;

    const result = generateGranularRevisionFields(nestedContext, mockedElements);

    expect(result).toEqual([
      {
        id: 'document-0',
        reason: 'needs_review - fix this issue',
      },
    ]);
  });
});
