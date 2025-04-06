import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';
import { HttpModule } from '@nestjs/axios';
import { FileRepository } from '@/storage/storage.repository';
import { StorageService } from '@/storage/storage.service';
import { CustomerService } from '@/customer/customer.service';
import { ProjectModule } from '@/project/project.module';
import { CustomerModule } from '@/customer/customer.module';
import { MerchantMonitoringModule } from '@/merchant-monitoring/merchant-monitoring.module';

@Module({
  imports: [
    HttpModule, // TODO: register with config and set retry mechanisem for http calls
    ProjectModule,
    CustomerModule,
    MerchantMonitoringModule,
  ],
  controllers: [],
  providers: [FileService, FileRepository, StorageService, CustomerService],
  exports: [FileService],
})
export class FileModule {}
