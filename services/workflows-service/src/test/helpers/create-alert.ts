import { AppLoggerService } from '../../common/app-logger/app-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertDefinition } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { AlertService } from '@/alert/alert.service';
import { AlertRepository } from '@/alert/alert.repository';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { ClsService } from 'nestjs-cls';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { ProjectScopeService } from '@/project/project-scope.service';

export const createAlert = async (projectId: string, AlertDefinition: AlertDefinition) => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      AlertService,
      ClsService,
      PrismaService,
      DataAnalyticsService,
      AlertDefinitionRepository,
      ProjectScopeService,
      AppLoggerService,
      {
        provide: AlertRepository,
        useClass: AlertRepository,
      },
      {
        provide: 'LOGGER',
        useValue: {
          setContext: jest.fn(),
          log: jest.fn(),
          error: jest.fn(),
          warn: jest.fn(),
          debug: jest.fn(),
        },
      },
    ],
  }).compile();

  const alertService = moduleRef.get<AlertService>(AlertService);

  // Accessing private method for testing purposes while maintaining types
  return await alertService.createAlert(
    {
      id: AlertDefinition.id,
      projectId: AlertDefinition.projectId,
      defaultSeverity: AlertDefinition.defaultSeverity,
    },
    [],
    {},
    {},
  );
};
