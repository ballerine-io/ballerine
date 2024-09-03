import { AlertDefinitionsController } from '@/alert-definition/alert-definition.controller.external';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { AlertDefinitionService } from '@/alert-definition/alert-definition.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectModule } from '@/project/project.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule, ProjectModule],
  providers: [AlertDefinitionService, AlertDefinitionRepository],
  exports: [AlertDefinitionService, AlertDefinitionRepository],
  controllers: [AlertDefinitionsController],
})
export class AlertDefinitionModule {}
