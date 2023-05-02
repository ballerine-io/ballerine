import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';
import { BusinessControllerInternal } from './business.controller.internal';
import { BusinessControllerExternal } from './business.controller.external';

@Module({
  controllers: [BusinessControllerInternal, BusinessControllerExternal],
  providers: [BusinessRepository, BusinessService],
})
export class BusinessModule {}
