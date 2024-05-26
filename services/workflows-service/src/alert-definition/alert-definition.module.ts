import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { AlertDefinitionService } from '@/alert-definition/alert-definition.service';

@Module({
  imports: [PrismaModule, ProjectModule],
  providers: [AlertDefinitionService, AlertDefinitionRepository],
  exports: [AlertDefinitionService, AlertDefinitionRepository],
})
export class AlertDefinitionModule {}
