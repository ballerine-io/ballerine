import { Injectable } from '@nestjs/common';
import { DataMigrationRepository } from "@/data-migration/data-migration.repository";
import { CustomerRepository } from "@/customer/customer.repository";
import { AwsS3FileService } from "@/providers/file/file-provider/aws-s3-file.service";
import { AwsS3FileConfig } from "@/providers/file/file-provider/aws-s3-file.config";

@Injectable()
export class DataMigrationService {
  constructor(
    protected readonly dataMigrationRepository: DataMigrationRepository,
  ) {}

  async migrate() {

    const dataMigrationConfig = AwsS3FileConfig.fetchClientConfig(process.env, 'DATA_MIGRATION_');
    const s3FileService = new AwsS3FileService(dataMigrationConfig)

    s3FileService.download({ bucket: 'ballerine-data-migration', key: 'data-migration.json' }, 'data-migration')

    const latestDataMigration =  await this.dataMigrationRepository.getLatestTimestamp();
    const lastMigrationTimestamp = latestDataMigration?.migratedAt || 0;

  }


  async fetchMigrationProcesses (lastMigrationTimestamp: Date) {

  }

  fetchAllMigrationFileNames (environment: string){
  //   default environment files
  //   additionalEncionment files

  }

  const sync(){

  }

}
