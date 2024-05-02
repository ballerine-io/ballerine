import { CaseManagementService } from '@/case-management/case-management.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TransactionService } from '@/transaction/transaction.service';
import type { AuthenticatedEntity, TProjectId, TProjectIds } from '@/types';
import { UserData } from '@/user/user-data.decorator';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowRunDto } from '@/workflow/dtos/workflow-run';
import { WorkflowService } from '@/workflow/workflow.service';
import * as common from '@nestjs/common';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiExcludeController, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { EndUserService } from '@/end-user/end-user.service';
import { StateTag, TStateTag } from '@ballerine/common';
import { AlertService } from '@/alert/alert.service';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { ListIndividualsProfilesSchema } from '@/case-management/dtos/list-individuals-profiles.dto';
import { z } from 'zod';

@Controller('case-management')
@ApiExcludeController()
export class CaseManagementController {
  constructor(
    protected readonly workflowDefinitionService: WorkflowDefinitionService,
    protected readonly workflowService: WorkflowService,
    protected readonly caseManagementService: CaseManagementService,
    protected readonly logger: AppLoggerService,
    protected readonly transactionService: TransactionService,
    protected readonly endUserService: EndUserService,
    protected readonly alertsService: AlertService,
  ) {}

  @Get('workflow-definition/:workflowDefinitionId')
  async getCaseDefinitionById(
    @Param('workflowDefinitionId') workflowDefinitionId: string,
    @ProjectIds() projectIds: TProjectId[],
  ) {
    return this.workflowDefinitionService.getLatestVersion(workflowDefinitionId, projectIds);
  }

  @Post()
  @ApiOkResponse()
  @HttpCode(200)
  @ApiForbiddenResponse({ type: ForbiddenException })
  async createCase(
    @Body() body: WorkflowRunDto,
    @UserData() authenticatedEntity: AuthenticatedEntity,
    @ProjectIds() projectIds: TProjectIds,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const result = await this.caseManagementService.create(body, projectIds!, currentProjectId);

    this.logger.log(
      `User ${authenticatedEntity?.user?.id} created workflow ${(await result).workflowRuntimeId}`,
    );

    return result;
  }

  @Get('transactions')
  async getTransactions(@CurrentProject() projectId: TProjectId) {
    return this.transactionService.getAll({}, projectId);
  }

  @Get('profiles/individuals')
  @common.UsePipes(new ZodValidationPipe(ListIndividualsProfilesSchema, 'query'))
  async listIndividualsProfiles(
    @CurrentProject() projectId: TProjectId,
    @Query() searchQueryParams: z.infer<typeof ListIndividualsProfilesSchema>,
  ) {
    const endUsers = await this.endUserService.list(
      {
        select: {
          id: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          businesses: {
            select: {
              companyName: true,
            },
          },
          amlHits: true,
          updatedAt: true,
        },
        take: searchQueryParams.page.size,
        skip: (searchQueryParams.page.number - 1) * searchQueryParams.page.size,
      },
      [projectId],
    );
    const typedEndUsers = endUsers as Array<
      (typeof endUsers)[number] & {
        businesses: Array<{
          companyName: string;
        }>;
      }
    >;
    const tagToKyc = {
      [StateTag.COLLECTION_FLOW]: 'PENDING',
      [StateTag.APPROVED]: 'APPROVED',
      [StateTag.REJECTED]: 'REJECTED',
      [StateTag.REVISION]: 'REVISIONS',
      [StateTag.PENDING_PROCESS]: 'PROCESSED',
      [StateTag.DATA_ENRICHMENT]: 'PROCESSED',
      [StateTag.MANUAL_REVIEW]: 'PROCESSED',
    } as const satisfies Record<
      Exclude<TStateTag, 'failure' | 'flagged' | 'resolved' | 'dismissed'>,
      'APPROVED' | 'REJECTED' | 'REVISIONS' | 'PROCESSED' | 'PENDING'
    >;
    const formattedEndUsers = await Promise.all(
      typedEndUsers.map(async endUser => {
        const workflowRuntimeData = await this.workflowService.getByEntityId(endUser.id, projectId);
        const tag = (workflowRuntimeData?.tags as string[])?.find(
          tag => !!tagToKyc[tag as keyof typeof tagToKyc],
        );
        const alerts = await this.alertsService.getAlertsByEntityId(endUser.id, projectId);
        const getSanctions = () => {
          if (Array.isArray(endUser.amlHits) && endUser.amlHits?.length) {
            const isPlural = endUser.amlHits?.length > 1;

            return `${endUser.amlHits?.length} ${isPlural ? 'matches' : 'match'}`;
          }

          if (Array.isArray(endUser.activeMonitorings) && endUser.activeMonitorings?.length) {
            return 'MONITORED';
          }

          return 'NOT_MONITORED';
        };
        const sanctions = getSanctions();

        return {
          id: endUser.id,
          createdAt: endUser.createdAt,
          name: `${endUser.firstName} ${endUser.lastName}`,
          businesses: endUser.businesses?.map(business => business.companyName).join(', '),
          role: 'UBO',
          kyc: tagToKyc[tag as keyof typeof tagToKyc],
          sanctions,
          alerts: alerts?.length ?? 0,
          updatedAt: endUser.updatedAt,
        };
      }),
    );

    return formattedEndUsers;
  }
}
