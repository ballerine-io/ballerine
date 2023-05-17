import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';
import { BusinessControllerInternal } from './business.controller.internal';
import { BusinessControllerExternal } from './business.controller.external';
import { FilterService } from '@/filter/filter.service';
import { FilterRepository } from '@/filter/filter.repository';

@Module({
  controllers: [BusinessControllerInternal, BusinessControllerExternal],
  providers: [BusinessRepository, BusinessService, FilterRepository, FilterService],
})
export class BusinessModule {}
