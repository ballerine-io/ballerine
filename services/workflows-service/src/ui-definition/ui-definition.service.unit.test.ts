import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { TranslationService } from '@/providers/translation/translation.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';

import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { UiDefinitionRepository } from './ui-definition.repository';

describe('UiDefinitionService', () => {
  let uiSchema: Record<string, unknown>;
  let context: Record<string, unknown>;

  let uiDefinitionService: UiDefinitionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UiDefinitionRepository,
          useValue: noop,
        },
        {
          provide: WorkflowRuntimeDataRepository,
          useValue: noop,
        },
        UiDefinitionService,
      ],
    }).compile();

    uiDefinitionService = module.get<UiDefinitionService>(UiDefinitionService);
  });

  beforeEach(() => {
    uiSchema = {
      title: 'Title',
      description: 'Description',
      nested: {
        label: 'Label',
        inner: {
          text: 'Inner Text',
        },
      },
      array: ['Item 1', 'Item 2'],
    };

    context = {};
  });

  it('should translate leaf nodes of the uiSchema', () => {
    const language = 'fr';
    const expectedUiSchema = {
      title: 'Translated Title',
      description: 'Translated Description',
      nested: {
        label: 'Translated Label',
        inner: {
          text: 'Translated Inner Text',
        },
      },
      array: ['Translated Item 1', 'Translated Item 2'],
    };

    const translationService = new TranslationService();

    translationService.translate = jest.fn((text, lang) =>
      lang === 'fr' ? `Translated ${text}` : text,
    );

    const result = uiDefinitionService.traverseUiSchema(
      uiSchema,
      context,
      language,
      translationService,
    );
    expect(result).toEqual(expectedUiSchema);
  });
});
