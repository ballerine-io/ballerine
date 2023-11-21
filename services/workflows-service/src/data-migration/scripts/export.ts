import { env } from '../../env'; // THIS IS A SCRIPT. IT REQUIRES THE RELATIVE PATH TO BE CORRECT
import { AwsS3FileConfig } from '../../providers/file/file-provider/aws-s3-file.config'; // THIS IS A SCRIPT. IT REQUIRES THE RELATIVE PATH TO BE CORRECT
import { AwsS3FileService } from '../..//providers/file/file-provider/aws-s3-file.service'; // THIS IS A SCRIPT. IT REQUIRES THE RELATIVE PATH TO BE CORRECT
import console from 'console';
import path from 'path';
import { DATA_MIGRATION_FOLDER_RELATIVE_PATH } from './consts';

const exportMigrations = async () => {
  const dataMigrationConfig = AwsS3FileConfig.fetchClientConfig(process.env, 'DATA_MIGRATION_');
  const s3FileService = new AwsS3FileService(dataMigrationConfig);

  await s3FileService.uploadFolderContent(
    path.join(__dirname, DATA_MIGRATION_FOLDER_RELATIVE_PATH),
    { bucketName: env.DATA_MIGRATION_BUCKET_NAME! },
    '.ts',
  );
};
exportMigrations()
  .then(() => {
    console.log('Data Migration synced');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error Syncing Migrations: ', err);
    process.exit(1);
  });
