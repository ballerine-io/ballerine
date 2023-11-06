import { PasswordService } from '@/auth/password/password.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { BusinessRepository } from '@/business/business.repository';
import { EntityRepository } from '@/common/entity/entity.repository';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { EndUserService } from '@/end-user/end-user.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FilterService } from '@/filter/filter.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { FileService } from '@/providers/file/file.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { FileRepository } from '@/storage/storage.repository';
import { StorageService } from '@/storage/storage.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { fetchServiceFromModule } from '@/test/helpers/nest-app-helper';
import { UserRepository } from '@/user/user.repository';
import { UserService } from '@/user/user.service';
import { WorkflowDefinitionRepository } from '@/workflow/workflow-definition.repository';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import {
  ArrayMergeOption,
  WorkflowRuntimeDataRepository,
} from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Project } from '@prisma/client';
import { PrismaModule } from 'nestjs-prisma';

describe('#Workflow Runtime Repository Integration Tests', () => {
  let workflowRuntimeRepository: WorkflowRuntimeDataRepository;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let project: Project;
  // beforeEach(cleanupDatabase);
  // afterEach(tearDownDatabase);

  beforeAll(async () => {
    await cleanupDatabase();

    const servicesProviders = [
      EndUserRepository,
      EndUserService,
      FilterService,
      FilterRepository,
      ProjectScopeService,
      FileRepository,
      FileService,
      StorageService,
      WorkflowEventEmitterService,
      BusinessRepository,
      WorkflowDefinitionRepository,
      WorkflowService,
      EventEmitter2,
      PrismaService,
      EntityRepository,
      UserService,
      UserRepository,
      SalesforceService,
      SalesforceIntegrationRepository,
      PasswordService,
      WorkflowTokenService,
      WorkflowTokenRepository,
      WorkflowRuntimeDataRepository,
    ];

    workflowRuntimeRepository = (await fetchServiceFromModule(
      WorkflowRuntimeDataRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as WorkflowRuntimeDataRepository;

    workflowDefinitionRepository = (await fetchServiceFromModule(
      WorkflowDefinitionRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as WorkflowDefinitionRepository;

    const prismaService = (await fetchServiceFromModule(PrismaService, servicesProviders, [
      PrismaModule,
    ])) as unknown as PrismaService;

    const customer = await createCustomer(
      prismaService,
      '1',
      'secret',
      '',
      '',
      'webhook-shared-secret',
    );
    project = await createProject(prismaService, customer, '5');
  });

  afterAll(async () => {
    await cleanupDatabase();
    await tearDownDatabase();
  });

  describe('Workflow Runtime Data Repository: Jsonb Merge', () => {
    beforeAll(async () => {
      await workflowDefinitionRepository.create({
        data: {
          id: 'test-definition',
          name: 'test',
          version: 1,
          definitionType: 'statechart-json',
          definition: {
            id: 'Manual Review',
          },
        },
      });
    });
    it('updateById: Merge context with nested entities - will preserve "replacment" behaviour for merging arrays', async () => {
      // Set up initial data

      const createRes = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: {
              entity: {
                id: '1',
                name: 'TestEntity',
              },
              documents: ['file1', 'file2'],
            },
          },
        },
        project.id,
      );

      // Update the context with a new object
      const updatedContext = {
        entity: {
          id: '2',
          name: 'UpdatedEntity',
        },
        documents: ['file3'],
      };

      const res = await workflowRuntimeRepository.updateById(
        createRes.id,
        {
          data: {
            context: updatedContext,
          },
        },
        project.id,
      );

      // The expected result should be the merged version of initial and updated context
      expect(res.context).toMatchObject({
        entity: {
          id: '2',
          name: 'UpdatedEntity',
        },
        documents: ['file3'],
      });
    });

    it('updateById: Merge context with nested entities - will preserve "replacment" behaviour for merging objects', async () => {
      const createRes = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: {
              entity: {
                id: '1',
              },
            },
          },
        },
        project.id,
      );

      const res = await workflowRuntimeRepository.updateById(
        createRes.id,
        {
          data: {
            context: {
              entity: {
                id: '2',
              },
              documents: [],
            },
          },
        },
        project.id,
      );

      expect(res).toMatchObject({
        endUserId: null,
        businessId: null,
        assigneeId: null,
        workflowDefinitionId: 'test-definition',
        workflowDefinitionVersion: 1,
        context: { entity: { id: '2' }, documents: [] },
        config: null,
        state: null,
        status: 'active',
        createdBy: 'SYSTEM',
        resolvedAt: null,
        assignedAt: null,
      });
    });

    it('should merge the existing and new context data when updateContextById is called', async () => {
      const createRes = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
          },
        },
        project.id,
      );
      const newContext = {
        key2: 'new-value',
        key3: 'value3',
        documents: [
          { id: '1', name: 'doc2' },
          { id: '2', name: 'doc3' },
        ],
      };

      const arrayMergeOption: ArrayMergeOption = 'by_id';
      await workflowRuntimeRepository.updateContextById(
        createRes.id,
        newContext,
        arrayMergeOption,
        [project.id],
      );

      const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
        project.id,
      ]);

      const expectedContext = {
        key1: 'value1',
        key2: 'new-value',
        key3: 'value3',
        documents: [
          { id: '1', name: 'doc2' },
          { id: '2', name: 'doc3' },
        ],
      };
      expect(updatedContext).toEqual(expectedContext);
    });
    it('should not change existing context when the new context is empty', async () => {
      const createRes = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
          },
        },
        project.id,
      );
      const newContext = {};

      const arrayMergeOption: ArrayMergeOption = 'by_id';
      await workflowRuntimeRepository.updateContextById(
        createRes.id,
        newContext,
        arrayMergeOption,
        [project.id],
      );

      const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
        project.id,
      ]);

      const expectedContext = {
        key1: 'value1',
        key2: 'value2',
        documents: [{ id: '1', name: 'doc1' }],
      };
      expect(updatedContext).toEqual(expectedContext);
    });
    it('should add new key from the new context to the existing context', async () => {
      const createRes = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
          },
        },
        project.id,
      );
      const newContext = { key3: 'value3' };

      const arrayMergeOption: ArrayMergeOption = 'by_id';
      await workflowRuntimeRepository.updateContextById(
        createRes.id,
        newContext,
        arrayMergeOption,
        [project.id],
      );

      const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
        project.id,
      ]);

      const expectedContext = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
        documents: [{ id: '1', name: 'doc1' }],
      };
      expect(updatedContext).toEqual(expectedContext);
    });

    it('should update the value of an existing key when the new context has a different value for that key', async () => {
      const createRes = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
          },
        },
        project.id,
      );
      const newContext = { key2: 'new-value2' };

      const arrayMergeOption: ArrayMergeOption = 'by_id';
      await workflowRuntimeRepository.updateContextById(
        createRes.id,
        newContext,
        arrayMergeOption,
        [project.id],
      );

      const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
        project.id,
      ]);

      const expectedContext = {
        key1: 'value1',
        key2: 'new-value2',
        documents: [{ id: '1', name: 'doc1' }],
      };
      expect(updatedContext).toEqual(expectedContext);
    });
  });
  it('should merge nested objects in the context', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: { nestedKey1: 'nestedValue1' },
            documents: [{ id: '1', name: 'doc1' }],
          },
        },
      },
      project.id,
    );
    const newContext = { key2: { nestedKey2: 'nestedValue2' } };

    const arrayMergeOption: ArrayMergeOption = 'by_id';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: { nestedKey1: 'nestedValue1', nestedKey2: 'nestedValue2' },
      documents: [{ id: '1', name: 'doc1' }],
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should update values in nested objects in the context', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: { nestedKey1: 'nestedValue1' },
            documents: [{ id: '1', name: 'doc1' }],
          },
        },
      },
      project.id,
    );
    const newContext = { key2: { nestedKey1: 'new-nestedValue1' } };

    const arrayMergeOption: ArrayMergeOption = 'by_id';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: { nestedKey1: 'new-nestedValue1' },
      documents: [{ id: '1', name: 'doc1' }],
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should add a new element to an array in the context', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: { key1: 'value1', key2: ['element1'], documents: [{ id: '1', name: 'doc1' }] },
        },
      },
      project.id,
    );
    const newContext = { key2: ['element2'] };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: ['element1', 'element2'],
      documents: [{ id: '1', name: 'doc1' }],
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should replace an element from an array in the context when the new context have it on the same index', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: ['element1', 'element2'],
            documents: [{ id: '1', name: 'doc1' }],
          },
        },
      },
      project.id,
    );
    const newContext = { key2: ['element3'] };

    const arrayMergeOption: ArrayMergeOption = 'by_index';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: ['element3', 'element2'],
      documents: [{ id: '1', name: 'doc1' }],
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should throw an error when trying to update context of a non-existing ID', async () => {
    const newContext = { key1: 'value1' };

    const arrayMergeOption: ArrayMergeOption = 'by_id';
    await expect(
      workflowRuntimeRepository.updateContextById('non-existing-id', newContext, arrayMergeOption, [
        project.id,
      ]),
    ).rejects.toThrow();
  });

  it('should be able to handle large context objects', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: { key1: 'value1', largeKey: new Array(1000).fill('value').join('') },
        },
      },
      project.id,
    );
    const newContext = { key2: 'value2' };

    const arrayMergeOption: ArrayMergeOption = 'by_id';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: 'value2',
      largeKey: new Array(1000).fill('value').join(''),
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should concatenate array in a nested object when array_merge_option is "concat"', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: { nestedKey: ['value2'] },
          },
        },
      },
      project.id,
    );

    const newContext = {
      key2: { nestedKey: ['value3'] },
    };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: { nestedKey: ['value2', 'value3'] },
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should concatenate array of objects in a nested object when array_merge_option is "concat"', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: { nestedKey: [{ id: '1', value: 'value2' }] },
          },
        },
      },
      project.id,
    );

    const newContext = {
      key2: { nestedKey: [{ id: '2', value: 'value3' }] },
    };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: {
        nestedKey: [
          { id: '1', value: 'value2' },
          { id: '2', value: 'value3' },
        ],
      },
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should concatenate deeply nested arrays when array_merge_option is "concat"', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: { nestedKey: { anotherNestedKey: ['value2'] } },
          },
        },
      },
      project.id,
    );

    const newContext = {
      key2: { nestedKey: { anotherNestedKey: ['value3'] } },
    };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: 'value1',
      key2: { nestedKey: { anotherNestedKey: ['value2', 'value3'] } },
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should correctly merge context data with high nesting level', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: { key2: { key3: { key4: { key5: 'value1' } } } },
          },
        },
      },
      project.id,
    );

    const newContext = {
      key1: { key2: { key3: { key4: { key5: 'value2', key6: 'value3' } } } },
    };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: { key2: { key3: { key4: { key5: 'value2', key6: 'value3' } } } },
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should correctly merge context data with mixed data types', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: {
            key1: 'value1',
            key2: { nestedKey1: 'value2', nestedKey2: ['value3'] },
          },
        },
      },
      project.id,
    );

    const newContext = {
      key1: { nestedKey1: 'new-value1' },
      key2: { nestedKey1: 'new-value2', nestedKey3: 'value4' },
    };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: { nestedKey1: 'new-value1' },
      key2: { nestedKey1: 'new-value2', nestedKey2: ['value3'], nestedKey3: 'value4' },
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should correctly merge deeply nested arrays with the by_id strategy', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: { key1: [{ id: '1', data: 'data1' }], key2: [{ id: '1', data: 'data1' }] },
        },
      },
      project.id,
    );
    const newContext = { key1: [{ id: '1', data: 'data2' }], key2: [{ id: '2', data: 'data2' }] };

    const arrayMergeOption: ArrayMergeOption = 'by_id';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: [{ id: '1', data: 'data2' }],
      key2: [
        { id: '1', data: 'data1' },
        { id: '2', data: 'data2' },
      ],
    };
    expect(updatedContext).toEqual(expectedContext);
  });

  it('should correctly merge deeply nested arrays with the by_index strategy', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: { key1: ['element1', 'element2'], key2: ['element1', 'element2'] },
        },
      },
      project.id,
    );
    const newContext = { key1: ['element3'], key2: ['element3', 'element4'] };

    const arrayMergeOption: ArrayMergeOption = 'by_index';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: ['element3', 'element2'],
      key2: ['element3', 'element4'],
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should correctly merge deeply nested arrays with the concat strategy', async () => {
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: { key1: ['element1', 'element2'], key2: ['element1', 'element2'] },
        },
      },
      project.id,
    );
    const newContext = { key1: ['element3'], key2: ['element3', 'element4'] };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);

    const expectedContext = {
      key1: ['element1', 'element2', 'element3'],
      key2: ['element1', 'element2', 'element3', 'element4'],
    };
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should merge the nested entity data when updateContextById is called', async () => {
    const initialContext = {
      entity: {
        type: 'individual',
        data: {
          name: 'John Doe',
          age: 30,
          additionalInfo: {
            hobbies: ['running', 'reading'],
          },
        },
        id: '123',
      },
      documents: [],
    };

    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: initialContext,
        },
      },
      project.id,
    );
    const newContext = {
      entity: {
        data: {
          age: 35,
          additionalInfo: {
            hobbies: ['cycling'],
            occupation: 'engineer',
          },
        },
      },
    };

    const arrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const expectedContext = {
      entity: {
        type: 'individual',
        data: {
          name: 'John Doe',
          age: 35,
          additionalInfo: {
            hobbies: ['running', 'reading', 'cycling'],
            occupation: 'engineer',
          },
        },
        id: '123',
      },
      documents: [],
    };

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should merge the documents array by id when updateContextById is called', async () => {
    const initialContext = {
      entity: {
        type: 'individual',
        id: '123',
      },
      documents: [
        {
          id: 'doc1',
          category: 'category1',
          // other properties...
        },
      ],
    };
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: initialContext,
        },
      },
      project.id,
    );
    const newContext = {
      documents: [
        {
          id: 'doc1',
          category: 'category2',
          // other properties...
        },
      ],
    };

    const arrayMergeOption = 'by_id';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const expectedContext = {
      entity: {
        type: 'individual',
        id: '123',
      },
      documents: [
        {
          id: 'doc1',
          category: 'category2',
          // other properties...
        },
      ],
    };

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should merge nested arrays in additionalInfo when updateContextById is called', async () => {
    const initialContext = {
      entity: {
        type: 'individual',
        data: {
          additionalInfo: {
            hobbies: ['running', 'reading'],
          },
        },
        id: '123',
      },
      documents: [
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['photo', 'signature'],
            },
          },
          // other properties...
        },
      ],
    };
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: initialContext,
        },
      },
      project.id,
    );
    const newContext = {
      entity: {
        data: {
          additionalInfo: {
            hobbies: ['cycling'],
          },
        },
      },
      documents: [
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['address'],
            },
          },
          // other properties...
        },
      ],
    };

    const arrayMergeOption: ArrayMergeOption = 'concat';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const expectedContext = {
      entity: {
        type: 'individual',
        data: {
          additionalInfo: {
            hobbies: ['running', 'reading', 'cycling'],
          },
        },
        id: '123',
      },
      documents: [
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['photo', 'signature'],
            },
          },
        },
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['address'],
            },
          },
        },
      ],
    };

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);
    expect(updatedContext).toEqual(expectedContext);
  });
  it('should merge nested arrays in additionalInfo when updateContextById is called', async () => {
    const initialContext = {
      entity: {
        type: 'individual',
        data: {
          additionalInfo: {
            hobbies: ['running', 'reading'],
          },
        },
        id: '123',
      },
      documents: [
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['photo', 'signature'],
            },
          },
          // other properties...
        },
      ],
    };
    const createRes = await workflowRuntimeRepository.create(
      {
        data: {
          workflowDefinitionId: 'test-definition',
          workflowDefinitionVersion: 1,
          context: initialContext,
        },
      },
      project.id,
    );
    const newContext = {
      entity: {
        data: {
          additionalInfo: {
            hobbies: ['cycling'],
          },
        },
      },
      documents: [
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['address'],
            },
          },
          // other properties...
        },
      ],
    };

    const arrayMergeOption: ArrayMergeOption = 'replace';
    await workflowRuntimeRepository.updateContextById(createRes.id, newContext, arrayMergeOption, [
      project.id,
    ]);

    const expectedContext = {
      entity: {
        type: 'individual',
        data: {
          additionalInfo: {
            hobbies: ['cycling'],
          },
        },
        id: '123',
      },
      documents: [
        {
          id: 'doc1',
          issuer: {
            additionalInfo: {
              requirements: ['address'],
            },
          },
          // other properties...
        },
      ],
    };

    const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [project.id]);
    expect(updatedContext).toEqual(expectedContext);
  });

  describe('patchDocumentById', () => {
    it('will patch document by id', async () => {
      const testDocumentId = 'document-1';
      const patchDocumnent = {
        id: testDocumentId,
        properties: {
          prop2: 'some-prop2-value',
        },
      };

      const testWorkflow = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: {
              entity: {
                id: '1',
                name: 'TestEntity',
              },
              documents: [
                {
                  id: testDocumentId,
                  properties: {
                    prop1: 'some-prop-value',
                  },
                },
              ],
            },
            tags: [],
          },
        },
        project.id,
      );

      const updatedWorkflow = await workflowRuntimeRepository.patchDocumentById(
        testWorkflow.id as string,
        testDocumentId,
        patchDocumnent as any,
        project.id,
      );

      expect(updatedWorkflow.context.documents[0]).toEqual(patchDocumnent);
    });

    it('wont perform any modifications if document not found', async () => {
      const nonExistingDocumentId = 'non-existing-document';
      const existingDocument = {
        id: 'some-id',
        properties: {
          foo: 'bar',
        },
      };

      const documents = [existingDocument];

      const testWorkflow = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: {
              entity: {
                id: '1',
                name: 'TestEntity',
              },
              documents: documents,
            },
            tags: [],
          },
        },
        project.id,
      );

      const updatedWorkflow = await workflowRuntimeRepository.patchDocumentById(
        testWorkflow.id as string,
        nonExistingDocumentId,
        {} as any,
        project.id,
      );

      expect(updatedWorkflow.context.documents[0]).toEqual(existingDocument);
      expect(updatedWorkflow.context.documents.length).toBe(documents.length);
    });

    it('wont insert any items to documents if not found by id', async () => {
      const nonExistingDocumentId = 'non-existing-document';

      const documents: any[] = [];

      const testWorkflow = await workflowRuntimeRepository.create(
        {
          data: {
            workflowDefinitionId: 'test-definition',
            workflowDefinitionVersion: 1,
            context: {
              entity: {
                id: '1',
                name: 'TestEntity',
              },
              documents: documents,
            },
            tags: [],
          },
        },
        project.id,
      );

      const updatedWorkflow = await workflowRuntimeRepository.patchDocumentById(
        testWorkflow.id as string,
        nonExistingDocumentId,
        {} as any,
        project.id,
      );

      expect(updatedWorkflow.context.documents.length).toBe(documents.length);
    });
  });
});
