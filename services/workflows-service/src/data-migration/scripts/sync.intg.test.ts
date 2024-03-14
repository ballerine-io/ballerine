import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { DataSyncTables, PrismaClient } from '@prisma/client';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { SyncedObject } from './sync';
import { InputJsonValue, NullableJsonNullValueInput } from '@/types';
import { env } from '@/env';
import deepDiff from 'deep-diff';
import { MD5 as objectMd5 } from 'object-hash';
import stableStringify from 'json-stable-stringify';

describe('Sync', () => {
  let prisma: PrismaClient;
  let workflowDefinitionRepository: WorkflowDefinitionRepository;
  let appLoggerService: AppLoggerService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaClient>(PrismaClient);
    workflowDefinitionRepository = moduleFixture.get<WorkflowDefinitionRepository>(
      WorkflowDefinitionRepository,
    );
    appLoggerService = moduleFixture.get<AppLoggerService>(AppLoggerService);

    await prisma.dataSync.deleteMany();
    await prisma.workflowDefinition.deleteMany();

    jest.spyOn(appLoggerService, 'log').mockImplementation(() => {});
    jest.spyOn(appLoggerService, 'warn').mockImplementation(() => {});
    jest.spyOn(appLoggerService, 'error').mockImplementation(() => {});
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  const createSyncObject = (overrides: Partial<SyncedObject> = {}): SyncedObject => ({
    crossEnvKey: 'test-key',
    tableName: 'WorkflowDefinition',
    columns: { name: 'Test Workflow', version: 1 },
    syncConfig: { strategy: 'replace' },
    syncedEnvironments: ['local'],
    dryRunEnvironments: [],
    ...overrides,
  });

  it('should create a new DataSync record when syncing a new object', async () => {
    const syncObject = createSyncObject();

    await sync([syncObject]);

    const dataSyncRecord = await prisma.dataSync.findUnique({
      where: {
        table_crossEnvKey: {
          table: syncObject.tableName as DataSyncTables,
          crossEnvKey: syncObject.crossEnvKey,
        },
      },
    });

    expect(dataSyncRecord).toBeDefined();
    expect(dataSyncRecord?.status).toBe('synced');
    expect(dataSyncRecord?.fullDataHash).toBe(objectMd5(syncObject.columns));
  });

  it('should update an existing DataSync record when syncing an existing object', async () => {
    const syncObject = createSyncObject();

    await prisma.dataSync.create({
      data: {
        table: syncObject.tableName as DataSyncTables,
        crossEnvKey: syncObject.crossEnvKey,
        fullDataHash: 'old-hash',
        status: 'synced',
        syncedColumns: Object.keys(syncObject.columns),
      },
    });

    await sync([syncObject]);

    const dataSyncRecord = await prisma.dataSync.findUnique({
      where: {
        table_crossEnvKey: {
          table: syncObject.tableName as DataSyncTables,
          crossEnvKey: syncObject.crossEnvKey,
        },
      },
    });

    expect(dataSyncRecord?.status).toBe('synced');
    expect(dataSyncRecord?.fullDataHash).toBe(objectMd5(syncObject.columns));
  });

  it('should skip syncing when no changes are detected', async () => {
    const syncObject = createSyncObject();

    await prisma.dataSync.create({
      data: {
        table: syncObject.tableName as DataSyncTables,
        crossEnvKey: syncObject.crossEnvKey,
        fullDataHash: objectMd5(syncObject.columns),
        status: 'synced',
        syncedColumns: Object.keys(syncObject.columns),
      },
    });

    await sync([syncObject]);

    expect(appLoggerService.log).toHaveBeenCalledWith(
      `No changes detected for ${syncObject.crossEnvKey} in ${syncObject.tableName}`,
    );
  });

  it('should replace the data when using the "replace" sync strategy', async () => {
    const syncObject = createSyncObject();

    await prisma.workflowDefinition.create({
      data: {
        id: syncObject.crossEnvKey,
        name: 'Old Workflow',
        version: 0,
      },
    });

    await sync([syncObject]);

    const workflowDefinition = await prisma.workflowDefinition.findUnique({
      where: { id: syncObject.crossEnvKey },
    });

    expect(workflowDefinition?.name).toBe(syncObject.columns.name);
    expect(workflowDefinition?.version).toBe(syncObject.columns.version);
  });

  it('should upsert the data when using the "upsert" sync strategy', async () => {
    const syncObject = createSyncObject({ syncConfig: { strategy: 'upsert' } });

    await sync([syncObject]);

    const workflowDefinition = await prisma.workflowDefinition.findUnique({
      where: { id: syncObject.crossEnvKey },
    });

    expect(workflowDefinition?.name).toBe(syncObject.columns.name);
    expect(workflowDefinition?.version).toBe(syncObject.columns.version);
  });

  it('should log a warning when a data integrity error is detected', async () => {
    const syncObject = createSyncObject();

    await prisma.workflowDefinition.create({
      data: {
        id: syncObject.crossEnvKey,
        name: 'Old Workflow',
        version: 0,
      },
    });

    await prisma.dataSync.create({
      data: {
        table: syncObject.tableName as DataSyncTables,
        crossEnvKey: syncObject.crossEnvKey,
        fullDataHash: 'old-hash',
        status: 'synced',
        syncedColumns: Object.keys(syncObject.columns),
      },
    });

    await sync([syncObject]);

    expect(appLoggerService.warn).toHaveBeenCalledWith(
      `Data integrity error for ${syncObject.crossEnvKey} in ${syncObject.tableName}: MD5 mismatch`,
    );
  });

  it('should mark records as unsynced if they are not in the sync objects', async () => {
    const syncObject = createSyncObject();

    await prisma.dataSync.create({
      data: {
        table: syncObject.tableName as DataSyncTables,
        crossEnvKey: 'old-key',
        fullDataHash: 'old-hash',
        status: 'synced',
        syncedColumns: Object.keys(syncObject.columns),
      },
    });

    await sync([syncObject]);

    const unsyncedRecord = await prisma.dataSync.findUnique({
      where: {
        table_crossEnvKey: {
          table: syncObject.tableName as DataSyncTables,
          crossEnvKey: 'old-key',
        },
      },
    });

    expect(unsyncedRecord?.status).toBe('unsynced');
  });

  it('should skip syncing for environments not listed in syncedEnvironments', async () => {
    const syncObject = createSyncObject({ syncedEnvironments: ['production'] });

    await sync([syncObject]);

    const dataSyncRecord = await prisma.dataSync.findUnique({
      where: {
        table_crossEnvKey: {
          table: syncObject.tableName as DataSyncTables,
          crossEnvKey: syncObject.crossEnvKey,
        },
      },
    });

    expect(dataSyncRecord).toBeNull();
  });

  it('should perform a dry run when the environment is listed in dryRunEnvironments', async () => {
    const syncObject = createSyncObject({ dryRunEnvironments: ['local'] });

    await sync([syncObject]);

    const dataSyncRecord = await prisma.dataSync.findUnique({
      where: {
        table_crossEnvKey: {
          table: syncObject.tableName as DataSyncTables,
          crossEnvKey: syncObject.crossEnvKey,
        },
      },
    });

    expect(dataSyncRecord).toBeNull();
  });

  it('should handle sync failures gracefully and log the error', async () => {
    const syncObject = createSyncObject({ columns: { invalidColumn: 'value' } });

    await sync([syncObject]);

    const dataSyncRecord = await prisma.dataSync.findUnique({
      where: {
        table_crossEnvKey: {
          table: syncObject.tableName as DataSyncTables,
          crossEnvKey: syncObject.crossEnvKey,
        },
      },
    });

    expect(dataSyncRecord?.status).toBe('failed');
    expect(appLoggerService.error).toHaveBeenCalled();
  });
});
