import * as common from '@nestjs/common';
import { CompaniesService } from '@/companies/companies.serivce';
import { HttpModule } from '@nestjs/axios';
import { CompaniesController } from '@/companies/companies.controller';

@common.Module({
  imports: [HttpModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
