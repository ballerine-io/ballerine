import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { alertControllerInternal } from '@/alert/alert.controller.internal';
import { alertRepository } from '@/alert/alert.repository';
import { alertService } from '@/alert/alert.service';
import { alertControllerExternal } from '@/alert/alert.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [ACLModule, PrismaModule],
  controllers: [alertControllerInternal, alertControllerExternal],
  providers: [alertService, alertRepository],
  exports: [ACLModule, alertService],
})
export class alertModule {}
