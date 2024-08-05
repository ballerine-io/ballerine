import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  AlertDefinitionPayload,
  DataSyncPayload,
  DataSyncTables,
  PrismaClient,
  UiDefinitionPayload,
  WorkflowDefinitionPayload,
} from '@prisma/client';
import { MD5 as objectMd5 } from 'object-hash';
import deepDiff from 'deep-diff';
import stableStringify from 'json-stable-stringify';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { InputJsonValue, NullableJsonNullValueInput } from '@/types';
import { env } from '@/env';
import { SentryService } from '@/sentry/sentry.service';

type Envionment = 'sandbox' | 'production' | 'development' | 'local';
export type TableName = 'WorkflowDefinition' | 'UiDefinition' | 'AlertDefinition';

export type EnvironmentConfig = {
  additionalColumns?: {
    projectId?: string;
  };
};

export type SyncedObject = {
  crossEnvKey: string;
  tableName: TableName;
  syncConfig: {
    strategy: 'update' | 'partial-deep-merge' | 'upsert';
  };
  syncedEnvironments: Envionment[];
  dryRunEnvironments: Envionment[];
  environmentSpecificConfig?: Partial<Record<Envionment, EnvironmentConfig>>;
} & (
  | {
      tableName: 'WorkflowDefinition';
      columns: Partial<WorkflowDefinitionPayload['scalars']>;
    }
  | {
      tableName: 'UiDefinition';
      columns: Partial<UiDefinitionPayload['scalars']>;
    }
  | {
      tableName: 'AlertDefinition';
      columns: Partial<AlertDefinitionPayload['scalars']>;
    }
);

export const mergeSyncObjects = (relevantObjects: SyncedObject[]): Record<string, SyncedObject> => {
  return relevantObjects.reduce<Record<string, SyncedObject>>((acc: any, obj: any) => {
    const key = obj.crossEnvKey;
    if (!acc[key]) {
      acc[key] = { ...obj };
      return acc;
    }
    if (acc[key].tableName !== obj.tableName) {
      acc[`${key}_${Object.keys(acc).length}`] = { ...obj };
      return acc;
    }
    const sharedEnvironments = obj.syncedEnvironments.filter((env: any) =>
      acc[key]?.syncedEnvironments.includes(env),
    );
    const sharedDryRunEnvironments = obj.dryRunEnvironments.filter((env: any) =>
      acc[key]?.dryRunEnvironments.includes(env),
    );

    if (sharedEnvironments.length === 0 && sharedDryRunEnvironments.length === 0) {
      acc[`${key}_${Object.keys(acc).length}`] = { ...obj };
      return acc;
    }

    mergeEnvironmentConfigs(acc, key, obj);
    return acc;
  }, {});
};

const tableNamesMap: Record<TableName, string> = {
  WorkflowDefinition: 'workflowDefinition',
  AlertDefinition: 'alertDefinition',
  UiDefinition: 'uiDefinition',
} as const;

export type PrismaTransactionalClient = Parameters<Parameters<PrismaClient['$transaction']>[0]>[0];

export const sync = async (objectsToSync: SyncedObject[]) => {
  const client = new PrismaClient();
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const appLoggerService = appContext.get(AppLoggerService);
  const sentryService = appContext.get(SentryService);
  try {
    const environmentName = (env.ENVIRONMENT_NAME as Envionment) || 'development';

    // Filter objects that are relevant for the current environment
    const relevantObjects = objectsToSync.filter(
      obj =>
        obj.syncedEnvironments.includes(environmentName) ||
        obj.dryRunEnvironments.includes(environmentName),
    );

    const mergedObjects = mergeSyncObjects(relevantObjects);

    const finalObjectsToSync = Object.values(mergedObjects);

    appLoggerService.log('Filtered and merged objects for sync', {
      totalOriginalObjects: objectsToSync.length,
      totalRelevantObjects: relevantObjects.length,
      totalMergedObjects: finalObjectsToSync.length,
    });

    // Replace the original objectsToSync with the filtered and merged list
    objectsToSync = finalObjectsToSync;
    appLoggerService.log('Starting sync process', {
      objectsToSync: objectsToSync.map(obj => ({
        crossEnvKey: obj.crossEnvKey,
        tableName: obj.tableName,
      })),
    });

    const stats = {
      totalSyncObjectsForCurrentEnv: 0,
      totalSyncObjects: objectsToSync.length,
      skipped: 0,
      skippedForCurrentEnv: 0,
      envCheckSkips: 0,
      dataHashCheckSkips: 0,
      diffCheckSkips: 0,
      successfulSyncs: 0,
      failedSyncs: 0,
      newSyncs: 0,
      markUnsyncedRecords: 0,
    };
    await client.$transaction(
      async (transaction: PrismaTransactionalClient) => {
        for (const object of objectsToSync) {
          const {
            crossEnvKey,
            tableName,
            columns,
            syncConfig,
            dryRunEnvironments = [],
            syncedEnvironments,
            environmentSpecificConfig,
          } = object;

          if (columns.id || columns.createdAt || columns.updatedAt) {
            // needs some adjsutments for upsert operations
            appLoggerService.error(
              `Error syncing ${crossEnvKey} in ${tableName}: columns contain reserved keys`,
            );
            const err = new Error('Columns contain reserved keys');
            sentryService.captureException(err);

            throw err;
          }

          const environmentName = env.ENVIRONMENT_NAME || '';
          const dryRun = dryRunEnvironments.includes(environmentName);

          if (!syncedEnvironments.includes(environmentName) && !dryRun) {
            appLoggerService.log(
              `Skipping sync for ${crossEnvKey} in ${tableName} in ${environmentName}`,
            );
            stats.envCheckSkips++;
            stats.skipped++;
            continue;
          }
          stats.totalSyncObjectsForCurrentEnv++;

          appLoggerService.log(`Stating object sync for ${crossEnvKey} in ${tableName}`);
          let existingRecord: DataSyncPayload['scalars'] | null = null;
          try {
            const columnsHash = objectMd5(stableStringify(columns));
            existingRecord = (await transaction.dataSync.findUnique({
              where: { table_crossEnvKey: { table: tableName as DataSyncTables, crossEnvKey } },
            })) as DataSyncPayload['scalars'] | null;

            if (!existingRecord) {
              existingRecord = await createSyncRecord(
                transaction,
                tableName,
                crossEnvKey,
                columns,
                appLoggerService,
              );
              stats.newSyncs++;
            } else {
              appLoggerService.log(
                `Found existing record for ${tableName}-${crossEnvKey} in DataSync table`,
              );
            }

            if (existingRecord?.fullDataHash === columnsHash) {
              appLoggerService.log(
                `No changes detected for ${crossEnvKey} in ${tableName} via hash check, Skipping...`,
              );
              stats.dataHashCheckSkips++;
              stats.skipped++;
              stats.skippedForCurrentEnv++;
              continue;
            }

            const dbRecord = await (transaction as { [key: string]: any })[
              tableNamesMap[tableName as keyof typeof tableNamesMap]
            ].findUnique({
              where: { crossEnvKey },
            });

            let diff = {} as any;
            let hasDiff = false;
            if (Array.isArray(existingRecord.syncedColumns) && dbRecord) {
              const diffResults = createDiff(
                existingRecord,
                dbRecord,
                columns,
                diff,
                crossEnvKey,
                tableName,
                appLoggerService,
              );
              hasDiff = diffResults.hasDiff;

              if (!hasDiff) {
                appLoggerService.log(
                  `No changes detected for ${crossEnvKey} in ${tableName} via diff check, Skipping...`,
                );
                stats.diffCheckSkips++;
                stats.skipped++;
                stats.skippedForCurrentEnv++;

                continue;
              }

              diff = diffResults.diff;
            }

            await preformDataSync(
              syncConfig,
              transaction,
              tableName,
              crossEnvKey,
              columns,
              appLoggerService,
              dbRecord,
              environmentSpecificConfig && environmentSpecificConfig[environmentName as Envionment],
            );

            const updatedRecord = await updateSynced(
              transaction,
              existingRecord,
              diff,
              columnsHash,
              columns,
            );

            appLoggerService.log(`Sync Done on ${crossEnvKey} in ${tableName}`, {
              updatedRecord: {
                ...updatedRecord,
                columns: undefined,
                diff: undefined,
                auditLog: undefined,
              },
            });
            stats.successfulSyncs++;
          } catch (error) {
            // I had to add console.error here  because the logger failed to print error object
            console.error(error);
            appLoggerService.error(`Error syncing ${crossEnvKey} in ${tableName}:`, {
              error: error as Error,
            });
            sentryService.captureException(error as Error);

            await upsertFailedSync(
              transaction,
              tableName,
              crossEnvKey,
              error,
              existingRecord,
              columns,
            );
            stats.failedSyncs++;
          }
        }

        // Mark rows in the DataSync table as unsynced if they don't exist in objectsToSync
        const tableNames = [...new Set(objectsToSync.map(obj => obj.tableName))];
        const crossEnvKeys = objectsToSync.map(obj => obj.crossEnvKey);

        const unsyncedRecords = await transaction.dataSync.findMany({
          where: {
            table: { in: tableNames as DataSyncTables[] },
            crossEnvKey: { notIn: crossEnvKeys },
          },
        });

        if (unsyncedRecords.length > 0) {
          appLoggerService.log('Marking unsynced records', {
            unsyncedRecords,
          });

          stats.markUnsyncedRecords = unsyncedRecords.length;

          await transaction.dataSync.updateMany({
            where: {
              table: { in: tableNames as DataSyncTables[] },
              crossEnvKey: { notIn: crossEnvKeys },
            },
            data: {
              status: 'unsynced',
              lastCheckAt: new Date(),
              auditLog: {
                [`${new Date().toISOString()}`]: {
                  action: 'unsynced',
                },
              },
            },
          });
        }
      },
      { timeout: 1000 * 60 * 5, maxWait: 1000 * 60 * 5 },
    );

    appLoggerService.log('Sync completed successfully', { stats });
  } catch (err) {
    console.error(err);
    sentryService.captureException(err as Error);
    throw err;
  }
};
function mergeEnvironmentConfigs(acc: any, key: any, obj: any) {
  acc[key].columns = {
    ...acc[key].columns,
    ...obj.columns,
  } as Partial<
    | WorkflowDefinitionPayload['scalars']
    | UiDefinitionPayload['scalars']
    | AlertDefinitionPayload['scalars']
  >;
  acc[key].syncedEnvironments = [
    ...new Set([...acc[key].syncedEnvironments, ...obj.syncedEnvironments]),
  ];
  acc[key].dryRunEnvironments = [
    ...new Set([...acc[key].dryRunEnvironments, ...obj.dryRunEnvironments]),
  ];

  if (acc[key].environmentSpecificConfig || obj.environmentSpecificConfig) {
    acc[key].environmentSpecificConfig = {
      ...acc[key].environmentSpecificConfig,
      ...obj.environmentSpecificConfig,
    };
  }
}

async function createSyncRecord(
  transaction: PrismaTransactionalClient,
  tableName: string,
  crossEnvKey: string,
  columns: any,
  appLoggerService: AppLoggerService,
): Promise<DataSyncPayload['scalars']> {
  const newSyncRecord = (await transaction.dataSync.create({
    data: {
      table: tableName as DataSyncTables,
      crossEnvKey,
      fullDataHash: 'empty',
      status: 'new',
      syncedColumns: Object.keys(columns),
      auditLog: {
        [`${new Date().toISOString()}`]: {
          action: 'create',
          columns: Object.keys(columns),
        },
      },
    },
  })) as DataSyncPayload['scalars'];

  appLoggerService.log(`Created ${tableName}-${crossEnvKey} in DataSync table`, {
    newSyncRecord: {
      ...newSyncRecord,
      columns: undefined,
      diff: undefined,
      auditLog: undefined,
    },
  });
  return newSyncRecord;
}
function createDiff(
  existingRecord: DataSyncPayload['scalars'],
  dbRecord: any,
  columns: any,
  diff: any,
  crossEnvKey: string,
  tableName: string,
  appLoggerService: AppLoggerService,
) {
  let hasDiff = false;
  if (Array.isArray(existingRecord.syncedColumns)) {
    const dbSyncedColumnsData = existingRecord.syncedColumns.reduce((acc: any, column: any) => {
      acc[column] = dbRecord[column];
      return acc;
    }, {});
    const dbRecordJson = dbSyncedColumnsData;
    const columnsJson = columns;
    diff = deepDiff(dbRecordJson, columnsJson);

    hasDiff = diff && Object.keys(diff).length > 0;
    if (!hasDiff) {
      appLoggerService.log(`No changes detected for ${crossEnvKey} in ${tableName}`);
    } else {
      appLoggerService.log(`Detected changes for ${crossEnvKey} in ${tableName}`, {
        diff,
      });
    }
    if (
      !hasDiff &&
      objectMd5(stableStringify(dbRecordJson)) !== objectMd5(stableStringify(columnsJson))
    ) {
      appLoggerService.warn(
        `Data integrity error for ${crossEnvKey} in ${tableName}: MD5 mismatch`,
      );
    }
  } else {
    appLoggerService.error(
      `Error syncing ${crossEnvKey} in ${tableName}: syncedColumns is not an array`,
    );
  }

  return { diff, hasDiff };
}
async function preformDataSync(
  syncConfig: { strategy: 'update' | 'partial-deep-merge' | 'upsert' },
  transaction: PrismaTransactionalClient,
  tableName: string,
  crossEnvKey: string,
  columns: any,
  appLoggerService: AppLoggerService,
  dbRecord: any,
  environmentConfig: EnvironmentConfig = {
    additionalColumns: {},
  },
) {
  if (syncConfig.strategy === 'update') {
    if (!dbRecord) {
      throw new Error(`Can't update, No record found for ${crossEnvKey} in ${tableName}`);
    }
    await (transaction as { [key: string]: any })[
      tableNamesMap[tableName as keyof typeof tableNamesMap]
    ].update({
      where: { crossEnvKey },
      data: columns,
    });
    appLoggerService.log(`Replaced ${crossEnvKey} in ${tableName}`, {
      columns: Object.keys,
    });

    return;
  } else if (syncConfig.strategy === 'upsert') {
    await (transaction as { [key: string]: any })[
      tableNamesMap[tableName as keyof typeof tableNamesMap]
    ].upsert({
      where: { crossEnvKey },
      update: columns,
      create: {
        crossEnvKey,
        ...(environmentConfig.additionalColumns ? environmentConfig.additionalColumns : {}),
        ...columns,
      },
    });

    appLoggerService.log(`Upserted ${crossEnvKey} in ${tableName}`, {
      columns: Object.keys(columns),
    });

    return;
  }

  throw new Error(`Unsupported sync strategy: ${syncConfig.strategy}`);
}

async function upsertFailedSync(
  transaction: PrismaTransactionalClient,
  tableName: string,
  crossEnvKey: string,
  error: unknown,
  existingRecord: DataSyncPayload['scalars'] | null,
  columns: any,
) {
  await transaction.dataSync.upsert({
    where: { table_crossEnvKey: { table: tableName as DataSyncTables, crossEnvKey } },
    update: {
      status: 'failed',
      failureReason: (error as Error).message,
      lastCheckAt: new Date(),
      auditLog: {
        ...(existingRecord?.auditLog && typeof existingRecord.auditLog === 'object'
          ? existingRecord.auditLog
          : {}),
        [`${new Date().toISOString()}`]: {
          action: 'syncFailed',
          error: (error as Error).message,
        },
      } as NullableJsonNullValueInput | InputJsonValue | undefined,
    },
    create: {
      table: tableName as DataSyncTables,
      crossEnvKey,
      fullDataHash: '',
      status: 'failed',
      failureReason: (error as Error).message,
      syncedColumns: columns as InputJsonValue,
      auditLog: {
        [`${new Date().toISOString()}`]: {
          action: 'syncFailed',
          error: (error as Error).message,
        },
      },
    },
  });
}

async function updateSynced(
  transaction: PrismaTransactionalClient,
  existingRecord: DataSyncPayload['scalars'],
  diff: any,
  columnsHash: string,
  columns: any,
) {
  return await transaction.dataSync.update({
    where: { id: existingRecord.id },
    data: {
      status: 'synced',
      diff: diff as InputJsonValue | undefined,
      fullDataHash: columnsHash,
      lastCheckAt: new Date(),
      lastSyncAt: new Date(),
      auditLog: {
        ...(existingRecord.auditLog && typeof existingRecord.auditLog === 'object'
          ? existingRecord.auditLog
          : {}),
        [`${new Date().toISOString()}`]: {
          action: 'update',
          columns: Object.keys(columns),
          diff,
        },
      } as NullableJsonNullValueInput | InputJsonValue | undefined,
    },
  });
}
