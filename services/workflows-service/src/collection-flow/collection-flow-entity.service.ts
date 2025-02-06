import { EndUserService } from '@/end-user/end-user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { TProjectId } from '@/types';
import { WorkflowService } from '@/workflow/workflow.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BusinessPosition } from '@prisma/client';
import { EntityCreateDto } from './dto/create-entity-input.dto';

@Injectable()
export class CollectionFlowEntityService {
  constructor(
    protected readonly workflowService: WorkflowService,
    protected readonly prismaService: PrismaService,
    protected readonly endUserService: EndUserService,
  ) {}

  async createEntity(
    workflowId: string,
    entityType: BusinessPosition,
    entity: EntityCreateDto,
    projectId: TProjectId,
  ) {
    await this.prismaService.$transaction(async transaction => {
      const workflowRuntimeData =
        await this.workflowService.getWorkflowRuntimeDataByIdAndLockUnscoped({
          id: workflowId,
          transaction,
        });

      if (!workflowRuntimeData.businessId) {
        throw new BadRequestException(
          `Attempted to create a Entity to a parent workflow without a business`,
        );
      }

      const endUser = await this.endUserService.create({
        data: {
          ...entity,
          projectId,
        },
      });
      await transaction.endUsersOnBusinesses.create({
        data: {
          endUserId: endUser.id,
          businessId: workflowRuntimeData.businessId,
          position: entityType,
        },
      });

      return {
        entityId: endUser.id,
      };
    });
  }

  async deleteEntity(entityId: string) {
    await this.prismaService.endUser.delete({
      where: {
        id: entityId,
      },
    });
  }
}
