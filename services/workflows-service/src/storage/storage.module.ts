import { Module } from '@nestjs/common';
import { StorageControllerExternal } from './storage.controller.external';
import { StorageControllerInternal } from './storage.controller.internal';
import { FileRepository } from './storage.repository';
import { StorageService } from './storage.service';
import { ProjectModule } from '@/project/project.module';
import { CustomerModule } from '@/customer/customer.module';
import { initHttpMoudle } from '@/common/http-service/http-config.service';

@Module({
  imports: [ProjectModule, CustomerModule, initHttpMoudle()],
  controllers: [StorageControllerInternal, StorageControllerExternal],
  providers: [StorageService, FileRepository],
  exports: [StorageService],
})
export class StorageModule {}
