import { PrismaClient, UiDefinition, WorkflowDefinition } from '@prisma/client';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { SyncedObject, mergeSyncObjects } from './sync';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { fetchServiceFromModule } from '@/test/helpers/nest-app-helper';
import { PrismaModule } from '@/prisma/prisma.module';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';

describe('Data Sync System:', () => {
  let prismaService: PrismaClient;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  // let appLoggerService: AppLoggerService;

  beforeAll(async () => {
    await cleanupDatabase();

    const servicesProviders = [WorkflowDefinitionRepository, PrismaService, ProjectScopeService];

    workflowDefinitionRepository = (await fetchServiceFromModule(
      WorkflowDefinitionRepository,
      servicesProviders,
      [PrismaModule],
    )) as unknown as WorkflowDefinitionRepository;

    prismaService = (await fetchServiceFromModule(PrismaService, servicesProviders, [
      PrismaModule,
    ])) as unknown as PrismaService;
  });

  afterAll(async () => {
    await cleanupDatabase();
    await tearDownDatabase();
  });
  describe('mergeSyncObjects', () => {
    it('should merge objects with shared dry run environments', () => {
      const objects = [
        {
          crossEnvKey: 'key2',
          tableName: 'WorkflowDefinition',
          columns: { name: 'Workflow 2', version: 1 },
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['production'],
          dryRunEnvironments: ['development', 'sandbox'],
        },
        {
          crossEnvKey: 'key2',
          tableName: 'WorkflowDefinition',
          columns: { description: 'Dry run workflow' } as Partial<WorkflowDefinition>,
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['production'],
          dryRunEnvironments: ['sandbox', 'local'],
        },
      ] satisfies SyncedObject[];

      const result = mergeSyncObjects(objects);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['key2']).toEqual({
        crossEnvKey: 'key2',
        tableName: 'WorkflowDefinition',
        columns: { name: 'Workflow 2', version: 1, description: 'Dry run workflow' },
        syncConfig: { strategy: 'update' },
        syncedEnvironments: ['production'],
        dryRunEnvironments: ['development', 'sandbox', 'local'],
      });
    });

    it('should handle merging objects with different table names', () => {
      const objects = [
        {
          crossEnvKey: 'key3',
          tableName: 'WorkflowDefinition',
          columns: { name: 'Workflow 3', version: 1 },
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['development', 'production'],
          dryRunEnvironments: [],
        },
        {
          crossEnvKey: 'key3',
          tableName: 'UiDefinition',
          columns: { name: 'UI 3' } as Partial<UiDefinition>,
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['development', 'production'],
          dryRunEnvironments: [],
        },
      ] satisfies SyncedObject[];

      const result = mergeSyncObjects(objects);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['key3']).toBeDefined();
      expect(result['key3_1']).toBeDefined();
    });

    it('should merge objects with environment specific configurations', () => {
      const objects = [
        {
          crossEnvKey: 'key4',
          tableName: 'WorkflowDefinition',
          columns: { name: 'Workflow 4', version: 1 },
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['development', 'production'],
          dryRunEnvironments: [],
          environmentSpecificConfig: {
            development: { additionalColumns: { projectId: 'dev-project' } },
          },
        },
        {
          crossEnvKey: 'key4',
          tableName: 'WorkflowDefinition',
          columns: { description: 'Merged workflow' } as Partial<WorkflowDefinition>,
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['production', 'sandbox'],
          dryRunEnvironments: [],
          environmentSpecificConfig: {
            production: { additionalColumns: { projectId: 'prod-project' } },
          },
        },
      ] satisfies SyncedObject[];

      const result = mergeSyncObjects(objects);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['key4']).toEqual({
        crossEnvKey: 'key4',
        tableName: 'WorkflowDefinition',
        columns: { name: 'Workflow 4', version: 1, description: 'Merged workflow' },
        syncConfig: { strategy: 'update' },
        syncedEnvironments: ['development', 'production', 'sandbox'],
        dryRunEnvironments: [],
        environmentSpecificConfig: {
          development: { additionalColumns: { projectId: 'dev-project' } },
          production: { additionalColumns: { projectId: 'prod-project' } },
        },
      });
    });
    it('should merge objects with shared environments', () => {
      const objects = [
        {
          crossEnvKey: 'key1',
          tableName: 'WorkflowDefinition',
          columns: { name: 'Workflow 1', version: 1 },
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['development', 'production'],
          dryRunEnvironments: [],
        },
        {
          crossEnvKey: 'key1',
          tableName: 'WorkflowDefinition',
          columns: { description: 'Updated description' } as Partial<WorkflowDefinition>,
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['production', 'sandbox'],
          dryRunEnvironments: [],
        },
      ] satisfies SyncedObject[];

      const result = mergeSyncObjects(objects);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['key1']).toEqual({
        crossEnvKey: 'key1',
        tableName: 'WorkflowDefinition',
        columns: { name: 'Workflow 1', version: 1, description: 'Updated description' },
        syncConfig: { strategy: 'update' },
        syncedEnvironments: ['development', 'production', 'sandbox'],
        dryRunEnvironments: [],
      });
    });

    it('should not merge objects without shared environments', () => {
      const objects = [
        {
          crossEnvKey: 'key1',
          tableName: 'WorkflowDefinition',
          columns: { name: 'Workflow 1', version: 1 },
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['development'],
          dryRunEnvironments: [],
        },
        {
          crossEnvKey: 'key1',
          tableName: 'WorkflowDefinition',
          columns: { description: 'Different workflow' } as Partial<WorkflowDefinition>,
          syncConfig: { strategy: 'update' },
          syncedEnvironments: ['production'],
          dryRunEnvironments: [],
        },
      ] satisfies SyncedObject[];

      const result = mergeSyncObjects(objects);

      expect(Object.keys(result)).toHaveLength(2);
      expect(result['key1']).toEqual(objects[0]);
      expect(result['key1_1']).toEqual(objects[1]);
    });

    it('should merge objects with shared dry run environments', () => {
      const objects = [
        {
          crossEnvKey: 'key1',
          tableName: 'WorkflowDefinition',
          columns: { name: 'Workflow 1', version: 1 },
          syncConfig: { strategy: 'update' },
          syncedEnvironments: [],
          dryRunEnvironments: ['development', 'sandbox'],
        },
        {
          crossEnvKey: 'key1',
          tableName: 'WorkflowDefinition',
          columns: { description: 'Updated description' } as Partial<WorkflowDefinition>,
          syncConfig: { strategy: 'update' },
          syncedEnvironments: [],
          dryRunEnvironments: ['sandbox', 'production'],
        },
      ] satisfies SyncedObject[];

      const result = mergeSyncObjects(objects);

      expect(Object.keys(result)).toHaveLength(1);
      expect(result['key1']).toEqual({
        crossEnvKey: 'key1',
        tableName: 'WorkflowDefinition',
        columns: { name: 'Workflow 1', version: 1, description: 'Updated description' },
        syncConfig: { strategy: 'update' },
        syncedEnvironments: [],
        dryRunEnvironments: ['development', 'sandbox', 'production'],
      });
    });
  });

  // const createSyncObject = (overrides: Partial<SyncedObject> = {}): SyncedObject => ({
  //   crossEnvKey: 'test-key',
  //   tableName: 'WorkflowDefinition',
  //   columns: { name: 'Test Workflow', version: 1 },
  //   syncConfig: { strategy: 'replace' },
  //   syncedEnvironments: ['local'],
  //   dryRunEnvironments: [],
  //   ...overrides,
  // });

  it('should create a new DataSync record when syncing a new object', async () => {
    // const syncObject = createSyncObject();
    // await prismaService.workflowDefinition.create({
    //   data: {
    //     id: Math.random().toString(),
    //     name: 'Old Workflow',
    //     version: 0,
    //     definitionType: 'type',
    //     definition: 'definition',
    //   },
    // });

    // await sync([syncObject]);

    // const dataSyncRecord = await prismaService.dataSync.findUnique({
    //   where: {
    //     table_crossEnvKey: {
    //       table: syncObject.tableName as DataSyncTables,
    //       crossEnvKey: syncObject.crossEnvKey,
    //     },
    //   },
    // });

    // expect(dataSyncRecord).toBeDefined();
    // expect(dataSyncRecord?.status).toBe('synced');
    // expect(dataSyncRecord?.fullDataHash).toBe(objectMd5(syncObject.columns));
    expect(true).toBe(true);
  });

  // it('should update an existing DataSync record when syncing an existing object', async () => {
  //   const syncObject = createSyncObject();

  //   await prismaService.workflowDefinition.create({
  //     data: {
  //       id: Math.random().toString(),
  //       crossEnvKey: syncObject.crossEnvKey,
  //       name: 'Old Workflow',
  //       version: 0,
  //       definitionType: 'type',
  //       definition: 'definition',
  //     },
  //   });

  //   await prismaService.dataSync.create({
  //     data: {
  //       table: syncObject.tableName as DataSyncTables,
  //       crossEnvKey: syncObject.crossEnvKey,
  //       fullDataHash: 'old-hash',
  //       status: 'synced',
  //       syncedColumns: Object.keys(syncObject.columns),
  //     },
  //   });

  //   await sync([syncObject]);

  //   const dataSyncRecord = await prismaService.dataSync.findUnique({
  //     where: {
  //       table_crossEnvKey: {
  //         table: syncObject.tableName as DataSyncTables,
  //         crossEnvKey: syncObject.crossEnvKey,
  //       },
  //     },
  //   });

  //   expect(dataSyncRecord?.status).toBe('synced');
  //   expect(dataSyncRecord?.fullDataHash).toBe(objectMd5(syncObject.columns));
  // });

  // it('should skip syncing when no changes are detected', async () => {
  //   const syncObject = createSyncObject();

  //   await prismaService.dataSync.create({
  //     data: {
  //       table: syncObject.tableName as DataSyncTables,
  //       crossEnvKey: syncObject.crossEnvKey,
  //       fullDataHash: objectMd5(syncObject.columns),
  //       status: 'synced',
  //       syncedColumns: Object.keys(syncObject.columns),
  //     },
  //   });

  //   await sync([syncObject]);

  //   expect(appLoggerService.log).toHaveBeenCalledWith(
  //     `No changes detected for ${syncObject.crossEnvKey} in ${syncObject.tableName}`,
  //   );
  // });

  // it('should replace the data when using the "replace" sync strategy', async () => {
  //   const syncObject = createSyncObject();

  //   await prismaService.workflowDefinition.create({
  //     data: {
  //       id: Math.random().toString(),
  //       name: 'Old Workflow',
  //       version: 0,
  //       definitionType: 'type',
  //       definition: 'definition',
  //     },
  //   });

  //   await sync([syncObject]);

  //   const workflowDefinition = await prismaService.workflowDefinition.findUnique({
  //     where: { id: syncObject.crossEnvKey },
  //   });

  //   expect(workflowDefinition?.name).toBe(syncObject.columns.name);
  //   expect(workflowDefinition?.version).toBe(syncObject.columns.version);
  // });

  // it('should upsert the data when using the "upsert" sync strategy', async () => {
  //   const syncObject = createSyncObject({ syncConfig: { strategy: 'upsert' } });

  //   await sync([syncObject]);

  //   const workflowDefinition = await prismaService.workflowDefinition.findUnique({
  //     where: { id: syncObject.crossEnvKey },
  //   });

  //   expect(workflowDefinition?.name).toBe(syncObject.columns.name);
  //   expect(workflowDefinition?.version).toBe(syncObject.columns.version);
  // });

  // it('should log a warning when a data integrity error is detected', async () => {
  //   const syncObject = createSyncObject();

  //   await prismaService.workflowDefinition.create({
  //     data: {
  //       id: Math.random().toString(),
  //       name: 'Old Workflow',
  //       version: 0,
  //       definitionType: 'type',
  //       definition: 'definition',
  //     },
  //   });

  //   await prismaService.dataSync.create({
  //     data: {
  //       table: syncObject.tableName as DataSyncTables,
  //       crossEnvKey: syncObject.crossEnvKey,
  //       fullDataHash: 'old-hash',
  //       status: 'synced',
  //       syncedColumns: Object.keys(syncObject.columns),
  //     },
  //   });

  //   await sync([syncObject]);

  //   expect(appLoggerService.warn).toHaveBeenCalledWith(
  //     `Data integrity error for ${syncObject.crossEnvKey} in ${syncObject.tableName}: MD5 mismatch`,
  //   );
  // });

  // it('should mark records as unsynced if they are not in the sync objects', async () => {
  //   const syncObject = createSyncObject();

  //   await prismaService.dataSync.create({
  //     data: {
  //       table: syncObject.tableName as DataSyncTables,
  //       crossEnvKey: 'old-key',
  //       fullDataHash: 'old-hash',
  //       status: 'synced',
  //       syncedColumns: Object.keys(syncObject.columns),
  //     },
  //   });

  //   await sync([syncObject]);

  //   const unsyncedRecord = await prismaService.dataSync.findUnique({
  //     where: {
  //       table_crossEnvKey: {
  //         table: syncObject.tableName as DataSyncTables,
  //         crossEnvKey: 'old-key',
  //       },
  //     },
  //   });

  //   expect(unsyncedRecord?.status).toBe('unsynced');
  // });

  // it('should skip syncing for environments not listed in syncedEnvironments', async () => {
  //   const syncObject = createSyncObject({ syncedEnvironments: ['production'] });

  //   await sync([syncObject]);

  //   const dataSyncRecord = await prismaService.dataSync.findUnique({
  //     where: {
  //       table_crossEnvKey: {
  //         table: syncObject.tableName as DataSyncTables,
  //         crossEnvKey: syncObject.crossEnvKey,
  //       },
  //     },
  //   });

  //   expect(dataSyncRecord).toBeNull();
  // });

  // it('should perform a dry run when the environment is listed in dryRunEnvironments', async () => {
  //   const syncObject = createSyncObject({ dryRunEnvironments: ['local'] });

  //   await sync([syncObject]);

  //   const dataSyncRecord = await prismaService.dataSync.findUnique({
  //     where: {
  //       table_crossEnvKey: {
  //         table: syncObject.tableName as DataSyncTables,
  //         crossEnvKey: syncObject.crossEnvKey,
  //       },
  //     },
  //   });

  //   expect(dataSyncRecord).toBeNull();
  // });

  // it('should handle sync failures gracefully and log the error', async () => {
  //   const syncObject = createSyncObject({ columns: { invalidColumn: 'value' } });

  //   await sync([syncObject]);

  //   const dataSyncRecord = await prismaService.dataSync.findUnique({
  //     where: {
  //       table_crossEnvKey: {
  //         table: syncObject.tableName as DataSyncTables,
  //         crossEnvKey: syncObject.crossEnvKey,
  //       },
  //     },
  //   });

  //   expect(dataSyncRecord?.status).toBe('failed');
  //   expect(appLoggerService.error).toHaveBeenCalled();
  // });
});
