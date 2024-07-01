import { Test, TestingModule } from '@nestjs/testing';
import { noop } from 'lodash';

import { BusinessService } from '@/business/business.service';
import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { EndUserService } from '@/end-user/end-user.service';
import { FileService } from '@/providers/file/file.service';
import { TranslationService } from '@/providers/translation/translation.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';

describe('CollectionFlowService', () => {
  let uiSchema: Record<string, unknown>;
  let context: Record<string, unknown>;

  let collectionFlowService: CollectionFlowService;
  const translationService: TranslationService = {
    // @ts-expect-error - bad type, implemented used methods only
    __i18next: {
      init: jest.fn(),
      addResourceBundle: jest.fn(),
      t: jest.fn(),
    },
    translate: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TranslationService,
          useValue: translationService,
        },
        {
          provide: AppLoggerService,
          useValue: noop,
        },
        {
          provide: EndUserService,
          useValue: noop,
        },
        {
          provide: WorkflowRuntimeDataRepository,
          useValue: noop,
        },
        {
          provide: WorkflowDefinitionRepository,
          useValue: noop,
        },
        {
          provide: WorkflowService,
          useValue: noop,
        },
        {
          provide: BusinessService,
          useValue: noop,
        },
        {
          provide: UiDefinitionService,
          useValue: noop,
        },
        {
          provide: CustomerService,
          useValue: noop,
        },
        {
          provide: FileService,
          useValue: noop,
        },
        {
          provide: UiDefinitionService,
          useValue: noop,
        },
        CollectionFlowService,
      ],
    }).compile();

    collectionFlowService = module.get<CollectionFlowService>(CollectionFlowService);
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

    translationService.translate = jest.fn((text, lang) =>
      lang === 'fr' ? `Translated ${text}` : text,
    );

    const result = collectionFlowService.traverseUiSchema(
      uiSchema,
      context,
      language,
      new TranslationService(),
    );
    expect(result).toEqual(expectedUiSchema);
  });
});
