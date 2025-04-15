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
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController, ApiForbiddenResponse, ApiOkResponse } from '@nestjs/swagger';
import { EndUserService } from '@/end-user/end-user.service';
import { StateTag, TStateTag, EndUserAmlHitsSchema } from '@ballerine/common';
import { AlertService } from '@/alert/alert.service';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { ListIndividualsProfilesSchema } from '@/case-management/dtos/list-individuals-profiles.dto';
import { z } from 'zod';
import type { Business, EndUsersOnBusinesses, UiDefinition } from '@prisma/client';
import { TranslationService } from '@/providers/translation/translation.service';
import { UiDefinitionService } from '@/ui-definition/ui-definition.service';

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
    protected readonly uiDefinitionService: UiDefinitionService,
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
    return this.transactionService.getTransactions(projectId);
  }

  @Get('profiles/individuals')
  @common.UsePipes(new ZodValidationPipe(ListIndividualsProfilesSchema, 'query'))
  async listIndividualsProfiles(
    @CurrentProject() projectId: TProjectId,
    @Query() searchQueryParams: z.infer<typeof ListIndividualsProfilesSchema>,
  ) {
    const tagToKyc = {
      [StateTag.COLLECTION_FLOW]: 'PENDING',
      [StateTag.APPROVED]: 'APPROVED',
      [StateTag.REJECTED]: 'REJECTED',
      [StateTag.REVISION]: 'REVISIONS',
      [StateTag.PENDING_PROCESS]: 'PROCESSED',
      [StateTag.DATA_ENRICHMENT]: 'PROCESSED',
      [StateTag.MANUAL_REVIEW]: 'PROCESSED',
    } as const satisfies Record<
      Exclude<TStateTag, 'failure' | 'flagged' | 'resolved' | 'dismissed' | 'edit'>,
      'APPROVED' | 'REJECTED' | 'REVISIONS' | 'PROCESSED' | 'PENDING'
    >;

    const endUsers = await this.endUserService.list(
      {
        select: {
          id: true,
          correlationId: true,
          createdAt: true,
          firstName: true,
          lastName: true,
          endUsersOnBusinesses: {
            select: {
              position: true,
              business: {
                select: {
                  companyName: true,
                },
              },
            },
          },
          businesses: {
            select: {
              companyName: true,
            },
          },
          Counterparty: {
            select: {
              alerts: true,
            },
          },
          workflowRuntimeData: {
            select: {
              tags: true,
            },
            where: {
              OR: Object.keys(tagToKyc).map(key => ({
                tags: {
                  array_contains: key,
                },
              })),
            },
            take: 1,
          },
          amlHits: true,
          activeMonitorings: true,
          updatedAt: true,
        },
        where: {
          Counterparty: {
            every: {
              endUserId: null,
            },
          },
        },
        take: searchQueryParams.page.size,
        skip: (searchQueryParams.page.number - 1) * searchQueryParams.page.size,
      },
      [projectId],
    );

    const typedEndUsers = endUsers as Array<
      (typeof endUsers)[number] & {
        endUsersOnBusinesses: Array<{
          position: EndUsersOnBusinesses['position'];
          business: Pick<Business, 'companyName'>;
        }>;
        workflowRuntimeData: Array<{
          tags: string[];
        }>;
        businesses: Array<Pick<Business, 'companyName'>>;
        Counterparty: {
          alerts: Array<{
            id: string;
          }>;
        };
      }
    >;

    return typedEndUsers.map(endUser => {
      const tag = endUser.workflowRuntimeData?.[0]?.tags?.find(
        tag => !!tagToKyc[tag as keyof typeof tagToKyc],
      );
      const alerts = endUser.Counterparty?.alerts;
      const checkIsMonitored = () =>
        Array.isArray(endUser.activeMonitorings) && !!endUser.activeMonitorings?.length;
      const getMatches = () => {
        const amlHits = (endUser.amlHits as z.infer<typeof EndUserAmlHitsSchema>)?.length ?? 0;
        const isPlural = amlHits > 1 || amlHits === 0;

        return `${amlHits} ${isPlural ? 'matches' : 'match'}`;
      };
      const isMonitored = checkIsMonitored();
      const matches = getMatches();

      const businesses = endUser.businesses?.length
        ? endUser.businesses.map(business => business.companyName).join(', ')
        : endUser.endUsersOnBusinesses
            ?.map(endUserOnBusiness => endUserOnBusiness.business.companyName)
            .join(', ');

      return {
        correlationId: endUser.correlationId,
        createdAt: endUser.createdAt,
        name: `${endUser.firstName} ${endUser.lastName}`,
        businesses,
        roles: endUser.endUsersOnBusinesses?.flatMap(
          endUserOnBusiness => endUserOnBusiness.position,
        ),
        kyc: tagToKyc[tag as keyof typeof tagToKyc],
        isMonitored,
        matches,
        alerts: alerts?.length ?? 0,
        updatedAt: endUser.updatedAt,
      };
    });
  }

  @common.Post('/ui-definition/:id/translate/:language')
  async translateUiDefinition(
    @common.Param('id') id: string,
    @common.Param('language') language: string,
    @common.Body()
    body: {
      partialUiDefinition: Partial<UiDefinition>;
    },
    @CurrentProject() projectId: TProjectId,
  ) {
    const uiDefinition = await this.uiDefinitionService.getById(id, {}, [projectId]);
    const translationService = new TranslationService(
      this.uiDefinitionService.getTranslationServiceResources(uiDefinition),
    );

    await translationService.init();

    const elements = this.uiDefinitionService.traverseUiSchema(
      // @ts-expect-error - error from Prisma types fix
      body.partialUiDefinition.elements,
      {},
      language,
      translationService,
    );

    return {
      ...body.partialUiDefinition,
      elements,
    };
  }

  @common.Post('/workflows/:workflowId/ubos')
  async createUbo(
    @common.Param('workflowId') workflowId: string,
    @common.Body() body: Record<string, unknown>,
    @CurrentProject() projectId: TProjectId,
  ) {
    await this.caseManagementService.createUbo({
      workflowId,
      ubo: body,
      projectId,
    });
  }

  @common.Delete('/workflows/:workflowId/ubos')
  async deleteUbosByIds(
    @common.Param('workflowId') workflowId: string,
    @common.Body()
    body: {
      ids: string[];
    },
    @CurrentProject() projectId: TProjectId,
    @UserData() authenticatedEntity: AuthenticatedEntity,
  ) {
    if (!authenticatedEntity?.user?.id) {
      throw new UnauthorizedException();
    }

    await this.caseManagementService.deleteUbosByIds({
      workflowId,
      ids: body.ids,
      projectId,
      deletedBy: authenticatedEntity?.user?.id,
    });
  }
}
