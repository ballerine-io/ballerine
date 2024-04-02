import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { ONGOING_MONITORING_LOCK_KEY } from '@/workflow/cron/lock-keys';
import { DefaultContextSchema, defaultContextSchema, isErrorWithMessage } from '@ballerine/common';
import { WorkflowService } from '@/workflow/workflow.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { Business, Project } from '@prisma/client';
import {
  FEATURE_LIST,
  TCustomerFeatures,
  TCustomerWithDefinitionsFeatures,
  TOngoingAuditReportDefinitionConfig,
} from '@/customer/types';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { BusinessReportService } from '@/business-report/business-report.service';
import { TProjectIds } from '@/types';
import { ajv } from '@/common/ajv/ajv.validator';
import { ValidationError } from '@/errors';

@Injectable()
export class OngoingMonitoringCron {
  private readonly lockKey = ONGOING_MONITORING_LOCK_KEY;
  private readonly processFeatureName = FEATURE_LIST.ONGOING_MERCHANT_REPORT_T1;
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly workflowService: WorkflowService,
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    protected readonly businessReportService: BusinessReportService,
  ) {}

  private readonly PENDING_ONGOING_MONITORING_STATE = ['pending-ongoing-monitoring'];

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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

      const processConfiguration = await this.fetchCustomerFeatureConfiguration(customers);

      for (const {
        projectIds,
        workflowDefinition,
        definitionConfig: customerProcessConfig,
      } of processConfiguration) {
        const businesses = await this.businessService.list({}, projectIds);

        for (const business of businesses) {
          const businessProcessConfig =
            business.metadata &&
            business.metadata.featureConfig &&
            this.extractDefinitionConfig(business.metadata.featureConfig);

          const { options: processConfig } = (businessProcessConfig || customerProcessConfig)!;
          const intervalInDays = processConfig.intervalInDays;
          const lastReceivedReport = await this.findLastBusinessReport(business, projectIds);

          if (!lastReceivedReport) {
            this.logger.error(`No initial report found for business: ${business.id}`);

            continue;
          }

          const lastReportFinishedDate = lastReceivedReport.createdAt;
          const dateToRunReport = new Date(
            new Date().setTime(
              lastReportFinishedDate.getTime() + intervalInDays * 24 * 60 * 60 * 1000,
            ),
          );

          if (dateToRunReport <= new Date()) {
            await this.invokeOngoingAuditReport({
              business: business as Business & {
                metadata?: { featureConfig?: Record<string, TCustomerFeatures> };
              },
              workflowDefinitionConfig: processConfig,
              workflowDefinitionId: workflowDefinition.id,
              currentProjectId: business.projectId,
              projectIds: projectIds,
              lastReportId: lastReceivedReport.id,
              checkTypes: processConfig?.checkTypes,
              reportType: this.processFeatureName,
            });
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
    return (
      await this.businessReportService.findMany(
        {
          where: {
            businessId: business.id,
            projectId: business.projectId,
            type: {
              in: [
                'ONGOING_MERCHANT_REPORT_T1',
                'ONGOING_MERCHANT_REPORT_T2',
                'MERCHANT_REPORT_T1',
              ],
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        projectIds,
      )
    )[0];
  }

  private async fetchCustomerFeatureConfiguration(customers: TCustomerWithDefinitionsFeatures[]) {
    const customersWithDefinitionsPromise = customers
      .filter(customer => {
        return (
          customer.features &&
          Object.entries(customer.features).find(([featureName, featureConfig]) => {
            return (
              featureName === this.processFeatureName &&
              featureConfig.enabled &&
              featureConfig.options.active
            );
          })
        );
      })
      .map(async customer => {
        const processConfig = this.extractDefinitionConfig(customer.features);
        const projectIds = customer.projects.map((project: Project) => project.id);

        const workflowDefinition = await this.workflowDefinitionService.getLastVersionByVariant(
          processConfig!.options!.definitionVariation,
          projectIds,
        );

        return {
          workflowDefinition: workflowDefinition,
          projectIds: projectIds,
          definitionConfig: processConfig,
        };
      });

    return await Promise.all(customersWithDefinitionsPromise);
  }

  private extractDefinitionConfig(
    featureConfig: Record<string, TCustomerFeatures> | null | undefined,
  ) {
    if (!featureConfig) return null;

    return Object.entries(featureConfig).find(([featureName, featureConfig]) => {
      return (
        featureName === this.processFeatureName &&
        featureConfig.enabled &&
        featureConfig.options.active
      );
    })?.[1];
  }

  private async invokeOngoingAuditReport({
    business,
    workflowDefinitionConfig,
    workflowDefinitionId,
    projectIds,
    currentProjectId,
    lastReportId,
    checkTypes,
    reportType,
  }: {
    business: Business & { metadata?: { featureConfig?: Record<string, TCustomerFeatures> } };
    workflowDefinitionConfig: TOngoingAuditReportDefinitionConfig;
    workflowDefinitionId: string;
    projectIds: TProjectIds;
    currentProjectId: string;
    lastReportId: string;
    reportType: string;
    checkTypes: string[] | undefined;
  }) {
    const context = {
      entity: {
        id: business.id,
        type: 'business',
        data: {
          website: business.website,
          companyName: business.companyName,
          additionalIfo: {
            report: {
              proxyViaCountry: workflowDefinitionConfig.proxyViaCountry,
              previousReportId: lastReportId,
              checkTypes: checkTypes,
              reportType: this.processFeatureName,
            },
          },
        },
      },
      documents: [],
    };

    const validate = ajv.compile(defaultContextSchema);

    const isValid = validate(context);

    if (!isValid) {
      throw ValidationError.fromAjvError(validate.errors!);
    }

    await this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: workflowDefinitionId,
      projectIds: projectIds,
      currentProjectId: currentProjectId,
      config: { reportConfig: workflowDefinitionConfig },
      context: context as unknown as DefaultContextSchema,
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
}
