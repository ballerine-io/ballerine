import { UIPage } from '@/domains/collection-flow';
import { CollectionFlowContext } from '@/domains/collection-flow/types/flow-context.types';
import { getFieldDefinitionsFromSchema, IFormElement, TBaseFields } from '@ballerine/ui';
import { describe, expect, it, vi } from 'vitest';
import { checkIfStepInRevision } from '../../../../helpers/check-if-step-in-revision';
import { generateFieldsForRevision } from './generate-fields-for-revision';
import { generateGranularRevisionFields } from './helpers/generate-granular-revision-fields';
import { generateRevisionFieldsForAllElements } from './helpers/generate-revision-fields-for-all-elements';

// Mock dependencies
vi.mock('../../../../helpers/check-if-step-in-revision');
vi.mock('./helpers/generate-granular-revision-fields');
vi.mock('./helpers/generate-revision-fields-for-all-elements');
vi.mock('@ballerine/ui', async () => {
  const actual = await vi.importActual('@ballerine/ui');

  return {
    //@ts-ignore
    ...actual,
    getFieldDefinitionsFromSchema: vi.fn(),
  };
});

describe('generateFieldsForRevision', () => {
  // Arrange
  const mockPages = [
    {
      stateName: 'page1',
      elements: [{ id: 'element1' }],
    },
    {
      stateName: 'page2',
      elements: [{ id: 'element2' }],
    },
  ] as Array<UIPage<'v2'>>;

  const mockContext = {
    documents: [],
  } as unknown as CollectionFlowContext;

  const mockFieldDefinitions = [{ id: 'field1' }, { id: 'field2' }] as Array<
    IFormElement<TBaseFields, any>
  >;

  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(checkIfStepInRevision).mockImplementation(stateName => stateName === 'page1');
    vi.mocked(generateRevisionFieldsForAllElements).mockReturnValue([{ id: 'field1', reason: '' }]);
    vi.mocked(generateGranularRevisionFields).mockReturnValue([
      { id: 'field2', reason: 'some reason' },
    ]);
    vi.mocked(getFieldDefinitionsFromSchema).mockReturnValue(mockFieldDefinitions);
  });

  it('should return undefined when no revision fields are found', () => {
    // Arrange
    vi.mocked(generateRevisionFieldsForAllElements).mockReturnValue([]);
    vi.mocked(generateGranularRevisionFields).mockReturnValue([]);

    // Act
    const result = generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should generate revision fields for all pages', () => {
    // Act
    const result = generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(result).toEqual([
      { id: 'field1', reason: '' },
      { id: 'field2', reason: 'some reason' },
    ]);
    expect(checkIfStepInRevision).toHaveBeenCalledTimes(2);
    expect(checkIfStepInRevision).toHaveBeenCalledWith('page1', mockContext);
    expect(checkIfStepInRevision).toHaveBeenCalledWith('page2', mockContext);
  });

  it('should use generateRevisionFieldsForAllElements for pages in revision', () => {
    // Act
    generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(generateRevisionFieldsForAllElements).toHaveBeenCalledWith(
      mockContext,
      mockFieldDefinitions,
    );
    expect(generateRevisionFieldsForAllElements).toHaveBeenCalledTimes(1);
  });

  it('should use generateGranularRevisionFields for pages not in revision', () => {
    // Act
    generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(generateGranularRevisionFields).toHaveBeenCalledWith(mockContext, mockFieldDefinitions);
    expect(generateGranularRevisionFields).toHaveBeenCalledTimes(1);
  });

  it('should concatenate results from both generators', () => {
    // Arrange
    vi.mocked(generateRevisionFieldsForAllElements).mockReturnValue([
      { id: 'field1', reason: '' },
      { id: 'field3', reason: '' },
    ]);
    vi.mocked(generateGranularRevisionFields).mockReturnValue([
      { id: 'field2', reason: 'reason2' },
      { id: 'field4', reason: 'reason4' },
    ]);

    // Act
    const result = generateFieldsForRevision(mockPages, mockContext);

    // Assert
    expect(result).toEqual([
      { id: 'field1', reason: '' },
      { id: 'field3', reason: '' },
      { id: 'field2', reason: 'reason2' },
      { id: 'field4', reason: 'reason4' },
    ]);
  });
});
