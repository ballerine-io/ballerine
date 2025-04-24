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
    return await this.prismaService.$transaction(async transaction => {
      const workflowRuntimeData =
        await this.workflowService.getWorkflowRuntimeDataByIdAndLockUnscoped({
          id: workflowId,
          transaction,
        });

      if (!workflowRuntimeData.businessId) {
        throw new BadRequestException(
          `Attempted to create an end-user for a workflow without a business`,
        );
      }

      const { additionalInfo, dateOfBirth, gender, ...entityRest } = entity;
      const {
        gender: genderAdditionalInfo,
        dateOfBirth: additionalDateOfBirth,
        ...additionalInfoRest
      } = additionalInfo ?? {};

      const endUser = await this.endUserService.create({
        data: {
          ...entityRest,
          additionalInfo: additionalInfoRest,
          gender: gender?.toLowerCase() ?? genderAdditionalInfo?.toLowerCase(),
          dateOfBirth: dateOfBirth ?? additionalDateOfBirth,
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

  async updateEntity(entityId: string, entity: EntityCreateDto) {
    return await this.prismaService.$transaction(async transaction => {
      const { additionalInfo, dateOfBirth, gender, ...entityRest } = entity;
      const {
        gender: genderAdditionalInfo,
        dateOfBirth: additionalDateOfBirth,
        ...additionalInfoRest
      } = additionalInfo ?? {};

      const endUser = await transaction.endUser.update({
        where: {
          id: entityId,
        },
        data: {
          ...entityRest,
          additionalInfo: additionalInfoRest,
          gender: gender?.toLowerCase() ?? genderAdditionalInfo?.toLowerCase(),
          dateOfBirth: dateOfBirth ?? additionalDateOfBirth,
        },
      });

      return {
        entityId: endUser.id,
      };
    });
  }

  async deleteEntity(entityId: string) {
    return await this.prismaService.$transaction(async transaction => {
      await transaction.endUsersOnBusinesses.deleteMany({
        where: {
          endUserId: entityId,
        },
      });

      await transaction.endUser.delete({
        where: {
          id: entityId,
        },
      });

      await transaction.document.deleteMany({
        where: {
          endUserId: entityId,
        },
      });
    });
  }
}
