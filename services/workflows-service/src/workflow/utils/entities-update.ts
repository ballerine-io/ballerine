import { BusinessPosition } from '@prisma/client';
import type { EndUser, Prisma } from '@prisma/client';
import type { EndUserService } from '@/end-user/end-user.service';
import {
  ARRAY_MERGE_OPTION,
  BUILT_IN_EVENT,
  WorkflowEventWithoutState,
} from '@ballerine/workflow-core';

export const entitiesUpdate = async ({
  payload: { ubos, directors },
  projectId,
  businessId,
  endUserService,
  sendEvent,
}: {
  payload: { ubos: Array<Partial<EndUser>>; directors: Array<Partial<EndUser>> };
  projectId: string;
  businessId: string | null;
  endUserService: EndUserService;
  sendEvent: (event: WorkflowEventWithoutState) => Promise<void>;
}) => {
  const promises: Array<Promise<void>> = [];

  const updatedUbos: Array<{ ballerineEntityId: string }> = [];
  const updatedDirectors: Array<{ ballerineEntityId: string }> = [];

  if (ubos && Array.isArray(ubos)) {
    promises.push(
      ...ubos.map(async ubo => {
        const { id: endUserId } = await endUserService.create({
          data: {
            email: ubo.email,
            firstName: ubo.firstName,
            lastName: ubo.lastName,
            nationalId: ubo.nationalId,
            additionalInfo: ubo.additionalInfo,
            project: { connect: { id: projectId } },
            endUsersOnBusinesses: {
              create: {
                position: [BusinessPosition.ubo],
                business: {
                  connect: { id: businessId },
                },
              },
            },
          } as Prisma.EndUserCreateInput,
          select: {
            id: true,
          },
        });

        updatedUbos.push({ ballerineEntityId: endUserId });
      }),
    );
  }

  if (directors && Array.isArray(directors)) {
    promises.push(
      ...directors.map(async director => {
        const { id: endUserId } = await endUserService.create({
          data: {
            email: director.email,
            firstName: director.firstName,
            lastName: director.lastName,
            nationalId: director.nationalId,
            additionalInfo: director.additionalInfo,
            project: { connect: { id: projectId } },
            endUsersOnBusinesses: {
              create: {
                position: [BusinessPosition.director],
                business: {
                  connect: { id: businessId },
                },
              },
            },
          } as Prisma.EndUserCreateInput,
          select: {
            id: true,
          },
        });

        updatedDirectors.push({ ballerineEntityId: endUserId });
      }),
    );
  }

  await Promise.all(promises);

  await sendEvent({
    type: BUILT_IN_EVENT.DEEP_MERGE_CONTEXT,
    payload: {
      arrayMergeOption: ARRAY_MERGE_OPTION.BY_INDEX,
      newContext: {
        entity: {
          data: {
            additionalInfo: {
              ubos: updatedUbos,
              directors: updatedDirectors,
            },
          },
        },
      },
    },
  });
};
