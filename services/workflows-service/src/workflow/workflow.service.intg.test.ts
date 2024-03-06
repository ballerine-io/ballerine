import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { fetchServiceFromModule } from '@/test/helpers/nest-app-helper';
import { PrismaModule } from 'nestjs-prisma';
import { EndUserRepository } from '@/end-user/end-user.repository';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';
import { FileRepository } from '@/storage/storage.repository';
import { FileService } from '@/providers/file/file.service';
import { StorageService } from '@/storage/storage.service';
import { WorkflowEventEmitterService } from '@/workflow/workflow-event-emitter.service';
import { BusinessRepository } from '@/business/business.repository';
import { WorkflowRuntimeDataRepository } from '@/workflow/workflow-runtime-data.repository';
import { WorkflowService } from '@/workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/prisma/prisma.service';
import { EntityRepository } from '@/common/entity/entity.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { EndUserService } from '@/end-user/end-user.service';
import { Business, Project, WorkflowDefinition } from '@prisma/client';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { UserService } from '@/user/user.service';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { SalesforceIntegrationRepository } from '@/salesforce/salesforce-integration.repository';
import { UserRepository } from '@/user/user.repository';
import { PasswordService } from '@/auth/password/password.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';
import { UiDefinitionRepository } from '@/ui-definition/ui-definition.repository';
import { faker } from '@faker-js/faker';
import { ARRAY_MERGE_OPTION, ArrayMergeOption, BUILT_IN_EVENT } from '@ballerine/workflow-core';
import { BusinessService } from '@/business/business.service';

describe('WorkflowService', () => {
  let workflowRuntimeRepository: WorkflowRuntimeDataRepository;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let project: Project;
  let workflowRuntimeService: WorkflowService;
  let workflowDefinition: WorkflowDefinition;
  let business: Business;

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
      BusinessService,
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
      UiDefinitionService,
      UiDefinitionRepository,
    ];

    workflowRuntimeService = (await fetchServiceFromModule(WorkflowService, servicesProviders, [
      PrismaModule,
    ])) as unknown as WorkflowService;

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

    const businessRepository = (await fetchServiceFromModule(
      BusinessRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as BusinessRepository;

    const prismaService = (await fetchServiceFromModule(PrismaService, servicesProviders, [
      PrismaModule,
    ])) as unknown as PrismaService;

    const customer = await createCustomer(
      prismaService,
      faker.datatype.uuid(),
      'secret',
      '',
      '',
      'webhook-shared-secret',
    );
    project = await createProject(prismaService, customer, '5');

    workflowDefinition = await workflowDefinitionRepository.create({
      data: {
        id: faker.datatype.uuid(),
        name: 'test',
        version: 1,
        definitionType: 'statechart-json',
        definition: {
          id: 'Manual Review',
          initial: 'pending',
          states: {
            pending: {
              on: {
                APPROVE: 'approved',
                REJECT: 'rejected',
              },
            },
            approved: {},
            rejected: {},
          },
        },
        projectId: project.id,
      },
    });

    business = await businessRepository.create({
      data: {
        companyName: 'Test Company',
        project: {
          connect: {
            id: project.id,
          },
        },
      },
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
    await tearDownDatabase();
  });

  describe('event', () => {
    describe(BUILT_IN_EVENT.DEEP_MERGE_CONTEXT, () => {
      it('should merge the existing and new context data when event is called', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = {
          key2: 'new-value',
          key3: 'value3',
          documents: [
            { id: '1', name: 'doc2' },
            { id: '2', name: 'doc3' },
          ],
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = {};

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key3: 'value3' };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: 'value2', documents: [{ id: '1', name: 'doc1' }] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key2: 'new-value2' };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
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
      it('should merge nested objects in the context', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: { nestedKey1: 'nestedValue1' },
              documents: [{ id: '1', name: 'doc1' }],
            },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key2: { nestedKey2: 'nestedValue2' } };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: { nestedKey1: 'nestedValue1', nestedKey2: 'nestedValue2' },
          documents: [{ id: '1', name: 'doc1' }],
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should update values in nested objects in the context', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: { nestedKey1: 'nestedValue1' },
              documents: [{ id: '1', name: 'doc1' }],
            },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key2: { nestedKey1: 'new-nestedValue1' } };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: { nestedKey1: 'new-nestedValue1' },
          documents: [{ id: '1', name: 'doc1' }],
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should add a new element to an array in the context', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', key2: ['element1'], documents: [{ id: '1', name: 'doc1' }] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key2: ['element2'] };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: ['element1', 'element2'],
          documents: [{ id: '1', name: 'doc1' }],
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should replace an element from an array in the context when the new context have it on the same index', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: ['element1', 'element2'],
              documents: [{ id: '1', name: 'doc1' }],
            },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key2: ['element3'] };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_INDEX;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: ['element3', 'element2'],
          documents: [{ id: '1', name: 'doc1' }],
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should be able to handle large context objects', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: 'value1', largeKey: new Array(1000).fill('value').join('') },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key2: 'value2' };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: 'value2',
          largeKey: new Array(1000).fill('value').join(''),
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should concatenate array in a nested object when array_merge_option is "concat"', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: { nestedKey: ['value2'] },
            },
            projectId: project.id,
            businessId: business.id,
          },
        });

        const newContext = {
          key2: { nestedKey: ['value3'] },
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: { nestedKey: ['value2', 'value3'] },
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should concatenate array of objects in a nested object when array_merge_option is "concat"', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: { nestedKey: [{ id: '1', value: 'value2' }] },
            },
            projectId: project.id,
            businessId: business.id,
          },
        });

        const newContext = {
          key2: { nestedKey: [{ id: '2', value: 'value3' }] },
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: { nestedKey: { anotherNestedKey: ['value2'] } },
            },
            projectId: project.id,
            businessId: business.id,
          },
        });

        const newContext = {
          key2: { nestedKey: { anotherNestedKey: ['value3'] } },
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: 'value1',
          key2: { nestedKey: { anotherNestedKey: ['value2', 'value3'] } },
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should correctly merge context data with high nesting level', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: { key2: { key3: { key4: { key5: 'value1' } } } },
            },
            projectId: project.id,
            businessId: business.id,
          },
        });

        const newContext = {
          key1: { key2: { key3: { key4: { key5: 'value2', key6: 'value3' } } } },
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: { key2: { key3: { key4: { key5: 'value2', key6: 'value3' } } } },
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should correctly merge context data with mixed data types', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: {
              key1: 'value1',
              key2: { nestedKey1: 'value2', nestedKey2: ['value3'] },
            },
            projectId: project.id,
            businessId: business.id,
          },
        });

        const newContext = {
          key1: { nestedKey1: 'new-value1' },
          key2: { nestedKey1: 'new-value2', nestedKey3: 'value4' },
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: { nestedKey1: 'new-value1' },
          key2: { nestedKey1: 'new-value2', nestedKey2: ['value3'], nestedKey3: 'value4' },
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should correctly merge deeply nested arrays with the by_id strategy', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: [{ id: '1', data: 'data1' }], key2: [{ id: '1', data: 'data1' }] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = {
          key1: [{ id: '1', data: 'data2' }],
          key2: [{ id: '2', data: 'data2' }],
        };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: ['element1', 'element2'], key2: ['element1', 'element2'] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key1: ['element3'], key2: ['element3', 'element4'] };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.BY_INDEX;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: ['element3', 'element2'],
          key2: ['element3', 'element4'],
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should correctly merge deeply nested arrays with the concat strategy', async () => {
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: { key1: ['element1', 'element2'], key2: ['element1', 'element2'] },
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = { key1: ['element3'], key2: ['element3', 'element4'] };

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);

        const expectedContext = {
          key1: ['element1', 'element2', 'element3'],
          key2: ['element1', 'element2', 'element3', 'element4'],
        };
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should merge the nested entity data when event is called', async () => {
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

        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: initialContext,
            projectId: project.id,
            businessId: business.id,
          },
        });
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

        const arrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

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

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should merge the documents array by id when event is called', async () => {
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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: initialContext,
            projectId: project.id,
            businessId: business.id,
          },
        });
        const newContext = {
          documents: [
            {
              id: 'doc1',
              category: 'category2',
              // other properties...
            },
          ],
        };

        const arrayMergeOption = ARRAY_MERGE_OPTION.BY_ID;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

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

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should merge nested arrays in additionalInfo when event is called - concat', async () => {
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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: initialContext,
            projectId: project.id,
            businessId: business.id,
          },
        });
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

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.CONCAT;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

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

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);
        expect(updatedContext).toEqual(expectedContext);
      });
      it('should merge nested arrays in additionalInfo when event is called - replace', async () => {
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
        const createRes = await workflowRuntimeRepository.create({
          data: {
            workflowDefinitionId: workflowDefinition.id,
            workflowDefinitionVersion: 1,
            context: initialContext,
            projectId: project.id,
            businessId: business.id,
          },
        });
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

        const arrayMergeOption: ArrayMergeOption = ARRAY_MERGE_OPTION.REPLACE;
        await workflowRuntimeService.event(
          {
            name: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
            id: createRes.id,
            payload: {
              newContext,
              arrayMergeOption,
            },
          },
          [project.id],
          project.id,
        );

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

        const updatedContext = await workflowRuntimeRepository.findContext(createRes.id, [
          project.id,
        ]);
        expect(updatedContext).toEqual(expectedContext);
      });
    });
  });
});
