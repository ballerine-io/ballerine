import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import { env } from '@/env';
import { DataMigrationRepository } from '@/data-migration/data-migration.repository';
import { DATA_MIGRATION_FOLDER_RELATIVE_PATH } from './consts';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { SentryService } from '@/sentry/sentry.service';

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

export const migrate = async (appContext: INestApplicationContext) => {
  const client = new PrismaClient();

  const dataMigrationRepository = appContext.get(DataMigrationRepository);

  const logger = appContext.get(AppLoggerService);

  const sentryService = appContext.get(SentryService);

  logger.log('Starting Data Migration');

  const migrationFilesPath = await fetchEnvMigrationFiles();

  const migrationProcessesToRun = await calculateMigrationProcessToRun(
    migrationFilesPath,
    dataMigrationRepository,
    logger,
  );

  for (const migrationProcess of migrationProcessesToRun) {
    const migrationVersion = migrationProcess.version;

    const fileName = migrationProcess.fileName.split('/').pop()!.replace('.js', '');

    logger.log(`Running Data Migration: ${fileName}`);

    const runningMigration = await dataMigrationRepository.create({
      data: {
        fileName,
        version: migrationVersion,
        status: 'in_progress',
      },
    });

    try {
      await migrationProcess.migrate(client, appContext);

      await dataMigrationRepository.updateById(runningMigration.id, {
        data: {
          version: migrationVersion,
          status: 'completed',
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        sentryService.captureException(error);

        await dataMigrationRepository.updateById(runningMigration.id, {
          data: {
            version: migrationVersion,
            status: 'failed',
            failureReason: `Error in migration file: ${migrationProcess.fileName}: \n ${error.stack}`,
          },
        });
      } else {
        await dataMigrationRepository.updateById(runningMigration.id, {
          data: {
            version: migrationVersion,
            status: 'failed',
            failureReason: `Error in migration file: ${migrationProcess.fileName}, ${error}`,
          },
        });
      }

      throw error;
    }
  }
};

const calculateMigrationProcessToRun = async (
  migrationFilesPath: string[],
  dataMigrationRepository: DataMigrationRepository,
  logger: AppLoggerService,
) => {
  const migrationRows = await dataMigrationRepository.list();

  const oldMigrationsSet = new Set(migrationRows.map(row => row.version));

  const relevantMigrationFilesPath = migrationFilesPath.filter(filePath => {
    if (filePath.includes('.map')) {
      return false;
    }

    const fileVersionMatches = filePath.match(/\d{14}/) || [];

    if (fileVersionMatches.length === 0 || !fileVersionMatches[0]) {
      logger.warn('Migration file does not have a valid file version', { filePath });
      return false;
    }

    return !oldMigrationsSet.has(fileVersionMatches[0]);
  });

  return (
    await Promise.all(
      relevantMigrationFilesPath.map(async filePath => {
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
  ).sort((a, b) => Number(a.version) - Number(b.version));
};

const main = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();

  const logger = app.get(AppLoggerService);
  const sentryService = app.get(SentryService);

  try {
    await migrate(app);

    setTimeout(() => {
      return process.exit(0);
    }, 2000);
  } catch (error: unknown) {
    logger.error('Error during running migration', { error });
    console.error(error);

    if (error instanceof Error || typeof error === 'string') {
      sentryService.captureException(error);
    }

    setTimeout(() => {
      return process.exit(1);
    }, 2000);
  } finally {
    await app.close();
  }
};

main();
