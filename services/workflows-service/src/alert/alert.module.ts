import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { AlertControllerInternal } from '@/alert/alert.controller.internal';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertService } from '@/alert/alert.service';
import { AlertControllerExternal } from '@/alert/alert.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [ACLModule, PrismaModule],
  controllers: [AlertControllerInternal, AlertControllerExternal],
  providers: [AlertService, AlertRepository],
  exports: [ACLModule, AlertService],
})
export class AlertModule {}
