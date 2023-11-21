import { AwsS3FileConfig } from '../../providers/file/file-provider/aws-s3-file.config';
import { AwsS3FileService } from '../../providers/file/file-provider/aws-s3-file.service';
import { env } from '../../env';
import { DATA_MIGRATION_FOLDER_RELATIVE_PATH } from './consts';
import console from 'console';
import path from 'path';

const importMigrations = async () => {
  const dataMigrationConfig = AwsS3FileConfig.fetchClientConfig(process.env, 'DATA_MIGRATION_');
  const s3FileService = new AwsS3FileService(dataMigrationConfig);

  await s3FileService.downloadFolderContent(
    { bucketName: env.DATA_MIGRATION_BUCKET_NAME! },
    path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH),
  );
};
importMigrations()
  .then(() => {
    console.log('Data Migration synced');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error Syncing Migrations: ', err);
    process.exit(1);
  });
