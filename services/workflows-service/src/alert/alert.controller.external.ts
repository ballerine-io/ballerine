import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { AlertService } from '@/alert/alert.service';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CreateAlertDefinitionDto } from './dtos/create-alert-definition.dto';
import { AlertDefinition } from '@prisma/client';
import { type TProjectId } from '@/types';

@swagger.ApiTags('external/alerts')
@common.Controller('external/alerts')
export class AlertControllerExternal {
  constructor(
    protected readonly service: AlertService,
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
  ) {}
  @common.Post()
  @swagger.ApiCreatedResponse({
    type: 'string',
  })
  @UseCustomerAuthGuard()
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() createAlertDto: CreateAlertDefinitionDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<AlertDefinition> {
    // Assuming create method in AlertService accepts CreateAlertDto and returns AlertDefinition
    return await this.service.create(createAlertDto, currentProjectId);
  }
}
