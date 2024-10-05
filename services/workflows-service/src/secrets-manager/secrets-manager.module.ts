import { Module } from '@nestjs/common';
import { SecretsManagerFactory } from '@/secrets-manager/secrets-manager.factory';
import { SecretControllerExternal } from '@/secrets-manager/secret.controller.external';
import { CustomerModule } from '@/customer/customer.module';

@Module({
  imports: [CustomerModule],
  providers: [SecretsManagerFactory],
  controllers: [SecretControllerExternal],
  exports: [SecretsManagerFactory],
})
export class SecretsManagerModule {}
