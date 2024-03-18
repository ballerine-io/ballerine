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
  CUSTOMER_FEATURES,
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
      this.logger.warn('Lock not acquired, another instance might be running the job.');

      return;
    }

    try {
      const customers = await this.customerService.list({
        select: { projects: true, features: true, definitionConfigs: true, id: true },
      });

      const processConfiguration = await this.fetchCustomerProcessConfiguration(customers);

      for (const {
        projectIds,
        workflowDefinition,
        definitionConfig: customerDefinitionConfig,
      } of processConfiguration) {
        const businesses = await this.businessService.list({}, projectIds);

        for (const business of businesses) {
          const workflowDefinitionConfig =
            this.findDefinitionConfig(business.definitionConfigs) || customerDefinitionConfig;

          if (!workflowDefinitionConfig?.active) continue;

          const intervalInDays = workflowDefinitionConfig.intervalInDays;
          const lastRunDate = (
            business.metadata as { lastOngoingAuditReportRunDate?: number } | undefined
          )?.lastOngoingAuditReportRunDate;

          const lastReceivedReport = (
            await this.businessReportService.findMany(
              {
                where: {
                  businessId: business.id,
                  projectId: business.projectId,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
              projectIds,
            )
          )[0];

          if (!lastReceivedReport) {
            return this.invokeOngoingAuditReport({
              business,
              workflowDefinitionConfig,
              workflowDefinitionId: workflowDefinition.id,
              currentProjectId: business.projectId,
              projectIds: projectIds,
            });
          }

          const nextRunDate = lastReceivedReport.createdAt; // might change to business metadata mutation to "invokedAt" and not to "receivedAt"
          nextRunDate.setDate(nextRunDate.getDate() + intervalInDays);

          if (nextRunDate <= new Date()) {
            await this.invokeOngoingAuditReport({
              business,
              workflowDefinitionConfig,
              workflowDefinitionId: workflowDefinition.id,
              currentProjectId: business.projectId,
              projectIds: projectIds,
              lastReportId: lastReceivedReport.id,
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

  private async fetchCustomerProcessConfiguration(customers: TCustomerWithDefinitionsFeatures[]) {
    const customersWithDefinitionsPromise = customers
      .filter(customer => {
        customer.features &&
          customer.features.find(feature => {
            return (
              feature.name === CUSTOMER_FEATURES.ONGOING_AUDIT_REPORT.name &&
              feature.enabled &&
              customer.definitionConfigs
            );
          });
      })
      .map(async customer => {
        const definitionConfig = this.findDefinitionConfig(customer.definitionConfigs);
        const projectIds = customer.projects.map((project: Project) => project.id);

        const workflowDefinition = await this.workflowDefinitionService.getLastVersionByName(
          definitionConfig!.definitionName,
          projectIds,
        );
        return {
          workflowDefinition: workflowDefinition,
          projectIds: projectIds,
          definitionConfig: definitionConfig,
        };
      });

    return Promise.all(customersWithDefinitionsPromise);
  }

  private findDefinitionConfig(
    definitionConfigs: TOngoingAuditReportDefinitionConfig[] | null | undefined,
  ) {
    return (
      definitionConfigs &&
      definitionConfigs.find(definition => {
        definition.definitionName === CUSTOMER_FEATURES.ONGOING_AUDIT_REPORT.definitionName &&
          definition.active;
      })
    );
  }

  async fetchWorkflowsByState(
    state: string[],
    { limit = 100, offset = 0 }: { limit?: number; offset?: number },
  ) {
    return await this.workflowService.getWorkflowsByState(this.PENDING_ONGOING_MONITORING_STATE, {
      skip: offset,
      take: limit,
    });
  }

  private async invokeOngoingAuditReport({
    business,
    workflowDefinitionConfig,
    workflowDefinitionId,
    projectIds,
    currentProjectId,
    lastReportId,
  }: {
    business: Business;
    workflowDefinitionConfig: TOngoingAuditReportDefinitionConfig;
    workflowDefinitionId: string;
    projectIds: TProjectIds;
    currentProjectId: string;
    lastReportId?: string;
  }) {
    const context = {
      entity: {
        id: business.id,
        type: 'business',
        data: {
          websiteUrl: business.website,
          companyName: business.companyName,
          proxyViaCountry: workflowDefinitionConfig.proxyViaCountry,
          previousReportId: lastReportId || null,
        },
        documents: [],
      },
    };

    const validate = ajv.compile(defaultContextSchema);

    const isValid = validate(context);

    if (!isValid) {
      throw ValidationError.fromAjvError(validate.errors!);
    }

    return this.workflowService.createOrUpdateWorkflowRuntime({
      workflowDefinitionId: workflowDefinitionId,
      projectIds: projectIds,
      currentProjectId: currentProjectId,
      config: { reportConfig: workflowDefinitionConfig },
      context: context as unknown as DefaultContextSchema,
    });
  }
}
