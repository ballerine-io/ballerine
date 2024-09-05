import { AppLoggerService } from '../../common/app-logger/app-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AlertDefinition } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { AlertService } from '@/alert/alert.service';
import { AlertRepository } from '@/alert/alert.repository';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { ClsService } from 'nestjs-cls';
import { INestApplication } from '@nestjs/common';

export const createAlert = async (app: INestApplication, alertDefinition: AlertDefinition) => {
  const alertService = app.get<AlertService>(AlertService);

  // Accessing private method for testing purposes while maintaining types
  return await alertService.createAlert(alertDefinition, [], {}, {});
};
