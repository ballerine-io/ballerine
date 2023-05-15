import { Module } from '@nestjs/common';
import { SecretsManagerService } from './secrets-manager.service';

@Module({
  providers: [SecretsManagerService],
  exports: [SecretsManagerService],
})
export class SecretsManagerModule {}
