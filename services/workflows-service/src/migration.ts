import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { DataMigrationVersion, PrismaClient } from "@prisma/client";
import * as path from 'path';
import { promises as fs } from 'fs';
import { INestApplicationContext } from "@nestjs/common";
import { env } from '@/env';
import { DataMigrationRepository } from "@/data-migration/data-migration.repository";
import { isErrorWithMessage } from "@ballerine/common";

const MIGRATION_RELATIVE_PATH = '../prisma/data-migrations';
interface IMigrationProcess {
  version: string; // also the timestamp
  migrate: (client: PrismaClient, app: INestApplicationContext) => Promise<void>;
  fileName: string;
}

const fetchEnvMigrationFiles = async () =>  {
  const environmentName = env.ENVIRONMENT_NAME || '';
  if (['local', 'dev', 'development', 'demo'].includes(environmentName)) {
    return await fs.readdir(path.join(__dirname, MIGRATION_RELATIVE_PATH, 'dev'))
  };

  if (['sandbox', 'sb'].includes(environmentName)) {
    return await fs.readdir(path.join(__dirname, MIGRATION_RELATIVE_PATH, 'sb'))
  }

  if (['prod', 'production'].includes(environmentName)) {
    return await fs.readdir(path.join(__dirname, MIGRATION_RELATIVE_PATH, 'prod'))
  }

  return []
}
export const migrate = async() => {
  const client = new PrismaClient();
  const appContext = await NestFactory.createApplicationContext(AppModule);

  const dataMigrationRepository = appContext.get(DataMigrationRepository);
  const defaultMigrations = path.join(__dirname, MIGRATION_RELATIVE_PATH, 'default');
  const files = await fs.readdir(defaultMigrations);
  const additionalFiles = await fetchEnvMigrationFiles();

  const latestSuccessfulMigration = await dataMigrationRepository.getLatestTimestamp();
  const migrationProcessesToRun = await calculateMigrationProcessToRun(files, additionalFiles, defaultMigrations, latestSuccessfulMigration as DataMigrationVersion);

  for (const migrationProcess of migrationProcessesToRun) {
    const migrationVersion = migrationProcess.version as string;

    try {
      await migrationProcess.migrate(client, appContext);

      await dataMigrationRepository.create(
        {
          data: {
            version: migrationVersion,
            success: true
          },
        }
      )
    } catch (error) {
      await dataMigrationRepository.create(
        {
          data: {
            version: migrationVersion,
            success: false,
            failureReason: `Error in migration file: ${migrationProcess.fileName}: ${isErrorWithMessage(error) && error.message}`,
          },
        }
      )
      throw error;
    }
  }
  await appContext.close();
}

const calculateMigrationProcessToRun = async (files: string[], additionalFiles: string[] | any[], defaultMigrations: string, latestSuccessfulMigration: DataMigrationVersion) => {
  return (await Promise.all(files.concat(additionalFiles)
      .filter((file) => file.match(/^\d{14}_/)?.[1] !== null)
      .map(async (file) => {
        const { migrate } = await import(path.join(defaultMigrations, file, 'index')) as { migrate: IMigrationProcess['migrate'] };

        const version = file.match(/^\d{14}_/)![1]! as string;
        return {
            version: version,
            fileName: file,
            migrate
          } satisfies IMigrationProcess
        }
      ))
  ).filter((migrationProcess) => Number(migrationProcess.version) > Number(latestSuccessfulMigration))
    .sort((a, b) => Number(a.version) - Number(b.version));
}

migrate().then(() => {
  console.log("Migration finished")
  process.exit(0);
}).catch((err) => {
  console.error('Error during application context initialization:', err);
  process.exit(1);
});;

