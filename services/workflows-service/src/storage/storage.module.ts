import { forwardRef, Module } from '@nestjs/common';
import { StorageControllerExternal } from './storage.controller.external';
import { StorageControllerInternal } from './storage.controller.internal';
import { StorageControllerPublic } from './storage.controller.public';
import { FileRepository } from './storage.repository';
import { StorageService } from './storage.service';
import { ProjectModule } from '@/project/project.module';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';
import { FileModule } from '@/providers/file/file.module';

@Module({
  imports: [ProjectModule, CustomerModule, HttpModule, forwardRef(() => FileModule)],
  controllers: [StorageControllerInternal, StorageControllerExternal, StorageControllerPublic],
  providers: [StorageService, FileRepository],
  exports: [StorageService],
})
export class StorageModule {}
