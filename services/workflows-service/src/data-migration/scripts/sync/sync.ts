import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  AlertDefinitionPayload,
  DataSyncTables,
  PrismaClient,
  UiDefinitionPayload,
  WorkflowDefinitionPayload,
} from '@prisma/client';
import * as path from 'path';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import { MD5 as objectMd5 } from 'object-hash';
import deepDiff from 'deep-diff';
import stableStringify from 'json-stable-stringify';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { InputJsonValue, NullableJsonNullValueInput } from '@/types';
import { env } from '@/env';

type Envionment = 'sandbox' | 'production' | 'development' | 'local';
export type TableName = 'WorkflowDefinition' | 'UiDefinition' | 'AlertDefinition';

export type SyncedObject = {
  crossEnvKey: string;
  tableName: TableName;
  syncConfig: {
    strategy: 'update' | 'partial-deep-merge' | 'upsert';
  };
  syncedEnvironments: Envionment[];
  dryRunEnvironments: Envionment[];
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

const tableNamesMap: Record<TableName, string> = {
  WorkflowDefinition: 'workflowDefinition',
  AlertDefinition: 'alertDefinition',
  UiDefinition: 'uiDefinition',
} as const;

export const sync = async (objectsToSync: SyncedObject[]) => {
  const client = new PrismaClient();
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const workflowDefinitionRepository = appContext.get(WorkflowDefinitionRepository);
  const appLoggerService = appContext.get(AppLoggerService);

  appLoggerService.log('Starting sync process', {
    objectsToSync: objectsToSync.map(obj => ({
      crossEnvKey: obj.crossEnvKey,
      tableName: obj.tableName,
    })),
  });

  await client.$transaction(async transaction => {
    for (const object of objectsToSync) {
      const {
        crossEnvKey,
        tableName,
        columns,
        syncConfig,
        dryRunEnvironments,
        syncedEnvironments,
      } = object;

      const environmentName = env.ENVIRONMENT_NAME || '';
      const dryRun = dryRunEnvironments.includes(environmentName);

      if (!syncedEnvironments.includes(environmentName) && !dryRun) {
        appLoggerService.log(
          `Skipping sync for ${crossEnvKey} in ${tableName} in ${environmentName}`,
        );
        continue;
      }

      appLoggerService.log('Syncing object', {
        crossEnvKey,
        tableName,
      });
      let existingRecord;
      try {
        const columnsHash = objectMd5(columns);
        existingRecord = await transaction.dataSync.findUnique({
          where: { table_crossEnvKey: { table: tableName as DataSyncTables, crossEnvKey } },
        });

        if (!existingRecord) {
          existingRecord = await transaction.dataSync.create({
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
          });

          appLoggerService.log(`Created ${tableName}-${crossEnvKey} in DataSync table`, {
            existingRecord: {
              ...existingRecord,
              columns: undefined,
              diff: undefined,
              auditLog: undefined,
            },
          });
        } else {
          appLoggerService.log(
            `Found existing record for ${tableName}-${crossEnvKey} in DataSync table`,
            {
              existingRecord: {
                ...existingRecord,
                columns: undefined,
                diff: undefined,
                auditLog: undefined,
              },
            },
          );
        }

        if (existingRecord.fullDataHash === columnsHash) {
          appLoggerService.log(`No changes detected for ${crossEnvKey} in ${tableName}`);

          continue;
        }

        const dbRecord = await (transaction as { [key: string]: any })[
          tableNamesMap[tableName as keyof typeof tableNamesMap]
        ].findUnique({
          where: { id: crossEnvKey },
        });

        let diff = {} as any;
        if (Array.isArray(existingRecord.syncedColumns) && dbRecord) {
          const dbSyncedColumnsData = existingRecord.syncedColumns.reduce(
            (acc: any, column: any) => {
              acc[column] = dbRecord[column];
              return acc;
            },
            {},
          );
          const dbRecordJson = dbSyncedColumnsData;
          const columnsJson = columns;
          diff = deepDiff(dbRecordJson, columnsJson);

          appLoggerService.log(`Detected changes for ${crossEnvKey} in ${tableName}`, {
            diff,
          });

          if (
            objectMd5(stableStringify(dbRecordJson)) !== objectMd5(stableStringify(columnsJson))
          ) {
            appLoggerService.warn(
              `Data integrity error for ${crossEnvKey} in ${tableName}: MD5 mismatch`,
            );
          }
        }

        if (syncConfig.strategy === 'update') {
          await (transaction as { [key: string]: any })[
            tableNamesMap[tableName as keyof typeof tableNamesMap]
          ].update({
            where: { crossEnvKey },
            data: columns,
          });
          appLoggerService.log(`Replaced ${crossEnvKey} in ${tableName}`, {
            columns: Object.keys,
          });
        } else if (syncConfig.strategy === 'upsert') {
          await (transaction as { [key: string]: any })[
            tableNamesMap[tableName as keyof typeof tableNamesMap]
          ].upsert({
            where: { crossEnvKey },
            update: columns,
            create: {
              crossEnvKey,
              ...columns,
            },
          });

          appLoggerService.log(`Upserted ${crossEnvKey} in ${tableName}`, {
            columns: Object.keys(columns),
          });
        }

        const updatedRecord = await transaction.dataSync.update({
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

        appLoggerService.log(`Sync Done on ${crossEnvKey} in ${tableName}`, {
          updatedRecord: {
            ...updatedRecord,
            columns: undefined,
            diff: undefined,
            auditLog: undefined,
          },
        });
      } catch (error) {
        appLoggerService.error(`Error syncing ${crossEnvKey} in ${tableName}:`, {
          error: error as Error,
        });

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
    }

    // Mark rows in the DataSync table as unsynced if they don't exist in objectsToSync
    const tableNames = [...new Set(objectsToSync.map(obj => obj.tableName))];
    const crossEnvKeys = objectsToSync.map(obj => obj.crossEnvKey);

    const unsyncedRecords = await client.dataSync.findMany({
      where: {
        table: { in: tableNames as DataSyncTables[] },
        crossEnvKey: { notIn: crossEnvKeys },
      },
    });

    appLoggerService.log('Marking unsynced records', {
      unsyncedRecords,
    });

    await client.dataSync.updateMany({
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
  });

  appLoggerService.log('Sync completed successfully');
};
