import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DataMigrationVersion, PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import { env } from '@/env';
import { DataMigrationRepository } from '@/data-migration/data-migration.repository';
import console from 'console';
import { DATA_MIGRATION_FOLDER_RELATIVE_PATH } from './consts';

interface IMigrationProcess {
  version: string; // also the timestamp
  migrate: (client: PrismaClient, app: INestApplicationContext) => Promise<void>;
  fileName: string;
}

const fetchMigrationFiles = async (migrationFolderPath: string) => {
  if (!fs.existsSync(migrationFolderPath)) {
    console.log(`Missing Migration Folder ${migrationFolderPath}`);
    return [];
  }

  const fullFilePath = (await fs.promises.readdir(migrationFolderPath)).map(fileName =>
    path.join(migrationFolderPath, fileName),
  );

  return fullFilePath;
};

const fetchEnvMigrationFiles = async () => {
  let migrationFiles: Array<string> = [];
  const commonMigrations = path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH, 'common');
  migrationFiles = migrationFiles.concat(await fetchMigrationFiles(commonMigrations));

  const environmentName = env.ENVIRONMENT_NAME || '';

  if (['local'].includes(environmentName)) {
    migrationFiles = migrationFiles.concat(
      await fetchMigrationFiles(path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH, 'local')),
    );
  }

  if (['dev', 'development', 'demo'].includes(environmentName)) {
    migrationFiles = migrationFiles.concat(
      await fetchMigrationFiles(path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH, 'dev')),
    );
  }

  if (['sandbox', 'sb', 'staging'].includes(environmentName)) {
    migrationFiles = migrationFiles.concat(
      await fetchMigrationFiles(path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH, 'sb')),
    );
  }

  if (['prod', 'production'].includes(environmentName)) {
    migrationFiles = migrationFiles.concat(
      await fetchMigrationFiles(path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH, 'prod')),
    );
  }

  return migrationFiles;
};

export const sync = async () => {
  console.log('Starting migration process');
};

const calculateMigrationProcessToRun = async (
  migrationFilesPath: string[],
  latestSuccessfulMigration: DataMigrationVersion,
) => {
  return (
    await Promise.all(
      migrationFilesPath
        .filter(filePath => filePath.match(/\d{14}/)?.[0] !== null)
        .filter(filePath => !filePath.includes('.map'))
        .map(async filePath => {
          const { migrate } = (await import(filePath)) as {
            migrate: IMigrationProcess['migrate'];
          };

          const version = filePath.match(/\d{14}/)![0]!;
          return {
            version: version,
            fileName: filePath,
            migrate,
          } satisfies IMigrationProcess;
        }),
    )
  )
    .filter(migrationProcess => {
      const latestMigrationVersion = latestSuccessfulMigration?.version
        ? Number(latestSuccessfulMigration?.version)
        : 0;
      return Number(migrationProcess.version) > latestMigrationVersion;
    })
    .sort((a, b) => Number(a.version) - Number(b.version));
};

sync()
  .then(() => {
    console.log('Migration finished');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error during application context initialization:', err);
    process.exit(1);
  });
