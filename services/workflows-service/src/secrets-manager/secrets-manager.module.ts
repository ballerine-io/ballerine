import { Module } from '@nestjs/common';
import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';

@Module({
  providers: [SecretsManagerFactory],
  exports: [SecretsManagerFactory],
})
export class SecretsManagerModule {}
