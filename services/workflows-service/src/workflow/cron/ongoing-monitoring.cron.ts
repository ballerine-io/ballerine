import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessService } from '@/business/business.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import {
  FEATURE_LIST,
  TCustomerFeatures,
  TCustomerWithDefinitionsFeatures,
} from '@/customer/types';
import { PrismaService } from '@/prisma/prisma.service';
import { TProjectIds } from '@/types';
import { ONGOING_MONITORING_LOCK_KEY } from '@/workflow/cron/lock-keys';
import { WorkflowService } from '@/workflow/workflow.service';
import { isErrorWithMessage, ObjectValues } from '@ballerine/common';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Business, BusinessReportType } from '@prisma/client';
import get from 'lodash/get';

const ONE_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class OngoingMonitoringCron {
  private readonly lockKey = ONGOING_MONITORING_LOCK_KEY;
  private readonly processFeatureName = FEATURE_LIST.ONGOING_MERCHANT_REPORT_T1;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly workflowService: WorkflowService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    protected readonly businessReportService: BusinessReportService,
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const lockAcquired = await this.prisma.acquireLock(this.lockKey);

    if (!lockAcquired) {
      this.logger.log('Lock not acquired, another instance might be running the job.');

      return;
    }

    try {
      const customers = await this.customerService.list({
        select: { projects: true, features: true, id: true },
      });

      const featureConfiguration = await this.fetchCustomerFeatureConfiguration(customers);

      for (const { projectIds } of featureConfiguration) {
        const businesses = await this.businessService.list({}, projectIds);

        for (const business of businesses) {
          try {
            const lastReceivedReport = await this.findLastBusinessReport(business, projectIds);

            if (!lastReceivedReport?.reportId) {
              this.logger.debug(`No initial report found for business: ${business.id}`);

              continue;
            }

            const dateToRunReport = new Date(
              new Date().setTime(
                // lastReceivedReport.createdAt.getTime() + processConfig.intervalInDays * ONE_DAY,
                lastReceivedReport.createdAt.getTime() + 1000,
              ),
            );

            if (dateToRunReport <= new Date()) {
              await this.invokeOngoingAuditReport({
                business: business as Business & {
                  metadata?: { featureConfig?: Record<string, TCustomerFeatures> };
                },
                currentProjectId: business.projectId,
                lastReportId: lastReceivedReport.reportId,
                workflowVersion: '2',
                reportType: this.processFeatureName,
              });
            }
          } catch (error) {
            this.logger.error(
              `Failed to Invoke Ongoing Report for businessId: ${
                business.id
              } - An error occurred: ${isErrorWithMessage(error) && error.message}`,
            );
          }
        }
      }
    } catch (error) {
      this.logger.error(`An error occurred: ${isErrorWithMessage(error) && error.message}`);
    } finally {
      await this.prisma.releaseLock(this.lockKey);
    }
  }

  private async findLastBusinessReport(business: Business, projectIds: TProjectIds) {
    const businessReports = await this.businessReportService.findMany(
      {
        where: {
          businessId: business.id,
          projectId: business.projectId,
          type: {
            in: ['ONGOING_MERCHANT_REPORT_T1', 'MERCHANT_REPORT_T1'],
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
      projectIds,
    );

    return businessReports[0];
  }

  private async fetchCustomerFeatureConfiguration(customers: TCustomerWithDefinitionsFeatures[]) {
    return customers.filter(
      customer =>
        customer.features &&
        Object.entries(customer.features).find(
          ([featureName, featureConfig]) =>
            featureName === this.processFeatureName && featureConfig.enabled,
        ),
    );
  }

  private async invokeOngoingAuditReport({
    business,
    currentProjectId,
    lastReportId,
    workflowVersion,
    reportType,
  }: {
    business: Business & { metadata?: { featureConfig?: Record<string, TCustomerFeatures> } };
    currentProjectId: string;
    lastReportId: string;
    workflowVersion: '1' | '2' | '3';
    reportType: ObjectValues<typeof BusinessReportType>;
  }) {
    const {
      id: customerId,
      displayName: customerName,
      config,
    } = await this.customerService.getByProjectId(currentProjectId);

    const { maxBusinessReports, withQualityControl } = config || {};
    await this.businessReportService.checkBusinessReportsLimit(
      maxBusinessReports,
      currentProjectId,
    );

    await this.businessReportService.createBusinessReportAndTriggerReportCreation({
      reportType,
      business,
      currentProjectId,
      websiteUrl: this.getWebsiteUrl(business),
      merchantName: business.companyName,
      compareToReportId: lastReportId,
      workflowVersion,
      withQualityControl,
      customerId,
      customerName,
    });

    await this.businessService.updateById(business.id, {
      data: {
        metadata: {
          ...((business.metadata ?? {}) as Record<string, unknown>),
          lastOngoingAuditReportInvokedAt: new Date().getTime(),
        },
      },
    });
  }

  private getWebsiteUrl(business: Business) {
    return business.website || get(business, 'additionalInfo.store.website.mainWebsite', '');
  }
}
