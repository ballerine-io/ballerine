import { Module } from '@nestjs/common';
import { ChecksService } from './checks.service';
import { ChecksController } from './checks.controller';
import { CustomerModule } from '@/customer/customer.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [CustomerModule, HttpModule],
  controllers: [ChecksController],
  providers: [ChecksService],
})
export class ChecksModule {}
