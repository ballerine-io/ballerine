import { BusinessReportService } from '@/business-report/business-report.service';
import { BusinessService } from '@/business/business.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { FEATURE_LIST, TCustomerFeaturesConfig } from '@/customer/types';
import { env } from '@/env';
import { PrismaService } from '@/prisma/prisma.service';
import { TProjectIds } from '@/types';
import { ONGOING_MONITORING_LOCK_KEY } from '@/workflow/cron/lock-keys';
import { WorkflowService } from '@/workflow/workflow.service';
import { isErrorWithMessage, isObject, ObjectValues } from '@ballerine/common';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Business, BusinessReportType } from '@prisma/client';
import get from 'lodash/get';

const ONE_DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class OngoingMonitoringCron {
  private readonly lockKey = ONGOING_MONITORING_LOCK_KEY;
  private readonly processFeatureName = FEATURE_LIST.ONGOING_MERCHANT_REPORT;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly workflowService: WorkflowService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    protected readonly businessReportService: BusinessReportService,
  ) {}

  // @Cron(CronExpression.EVERY_10_MINUTES)
  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const lockAcquired = await this.prisma.acquireLock(this.lockKey);

    if (!lockAcquired) {
      this.logger.log('Lock not acquired, another instance might be running the job.');

      return;
    }

    let ongoingReportsCounter = 0;

    try {
      const customers = await this.customerService.list({
        select: { projects: true, features: true, id: true },
      });

      for (const { projects, features } of customers) {
        const featureConfig = features?.[this.processFeatureName];

        if (
          !featureConfig ||
          (isObject(featureConfig) &&
            'enabled' in featureConfig &&
            (!featureConfig.enabled || !featureConfig?.options.runByDefault))
        ) {
          continue;
        }

        const projectIds = projects.map(({ id }: { id: string }) => id);
        const businesses = await this.businessService.list({}, projectIds);

        for (const business of businesses) {
          try {
            const businessFeatureConfig =
              business.metadata?.featureConfig?.[this.processFeatureName];

            if (
              isObject(businessFeatureConfig) &&
              'enabled' in businessFeatureConfig &&
              !businessFeatureConfig.enabled
            ) {
              this.logger.debug(`Ongoing monitoring is not enabled for business ${business.id}.`);

              continue;
            }

            const lastReceivedReport = await this.findLastBusinessReport(business, projectIds);

            if (!lastReceivedReport?.reportId) {
              this.logger.debug(`No initial report found for business: ${business.id}`);

              continue;
            }

            const now = new Date().getTime();
            const { options } = featureConfig;

            const lastReceivedReportTime = lastReceivedReport.createdAt.getTime();

            if (
              (options.scheduleType === 'specific' &&
                new Date().getDate() !== options.specificDates.dayInMonth &&
                lastReceivedReportTime + 32 * ONE_DAY < now) ||
              (options.scheduleType === 'interval' &&
                now - lastReceivedReportTime < options.intervalInDays * ONE_DAY)
            ) {
              this.logger.debug(`Skipping ongoing report for business: ${business.id}`);

              continue;
            }

            if (ongoingReportsCounter >= env.ONGOING_REPORTS_LIMIT) {
              this.logger.debug(`Ongoing reports limit reached for current cron run`);

              continue;
            }

            await this.invokeOngoingMerchantReport({
              currentProjectId: business.projectId,
              lastReportId: lastReceivedReport.reportId,
              workflowVersion: options.workflowVersion ?? '2',
              reportType: options.reportType ?? 'ONGOING_MERCHANT_REPORT_T1',
              business: business as Business & {
                metadata?: { featureConfig?: Record<string, TCustomerFeaturesConfig> };
              },
            });

            ongoingReportsCounter++;
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

  private async invokeOngoingMerchantReport({
    business,
    reportType,
    lastReportId,
    workflowVersion,
    currentProjectId,
  }: {
    lastReportId: string;
    currentProjectId: string;
    workflowVersion: '1' | '2' | '3';
    reportType: ObjectValues<typeof BusinessReportType>;
    business: Business & { metadata?: { featureConfig?: Record<string, TCustomerFeaturesConfig> } };
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
          lastOngoingReportInvokedAt: new Date().getTime(),
        },
      },
    });
  }

  private getWebsiteUrl(business: Business) {
    return business.website || get(business, 'additionalInfo.store.website.mainWebsite', '');
  }
}
