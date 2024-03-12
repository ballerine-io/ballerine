import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DataMigrationVersion, PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import { env } from '@/env';
import { DataMigrationRepository } from '@/data-migration/data-migration.repository';
import { WorkflowDefinitionRepository } from '@/workflow-defintion/workflow-definition.repository';
import console from 'console';
import { DATA_MIGRATION_FOLDER_RELATIVE_PATH } from './consts';

interface IMigrationProcess {
  version: string; // also the timestamp
  migrate: (client: PrismaClient, app: INestApplicationContext) => Promise<void>;
  fileName: string;
}
const sync = async () => {
  console.log('Migration started');
};

sync()
  .then(async () => {
    const client = new PrismaClient();
    const appContext = await NestFactory.createApplicationContext(AppModule);

    const workflowDefinitionRepository = appContext.get(WorkflowDefinitionRepository);
    const filePath = path.join(
      __dirname,
      DATA_MIGRATION_FOLDER_RELATIVE_PATH,
      'synced-objects/index.js',
    );
    const syncService = await import(filePath);
    const objectToSync = [
      {
        crossEnvKey: 'DEFAULT_KYB_DEFINITION_V1',
        tableName: 'WorkflowDefinition',
        columns: {
          definition: {},
        },
        syncConfig: {
          stragety: 'replace',
        },
        syncedEnvs: ['local'],
      },
    ]; //syncService.getSyncedObjects();

    for (const object of objectToSync) {
      console.log('Syncing object', object);
      workflowDefinitionRepository.findByCrossEnvKey(object.crossEnvKey);
      workflowDefinitionRepository.updateById(object);
    }

    console.log('Migration finished', objectToSync);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during application context initialization:', err);
    process.exit(1);
  });
