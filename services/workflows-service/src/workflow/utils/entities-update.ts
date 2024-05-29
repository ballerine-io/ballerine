import { BusinessPosition, EndUser, Prisma } from '@prisma/client';
import { ARRAY_MERGE_OPTION, BUILT_IN_EVENT, WorkflowEvent } from '@ballerine/workflow-core';
import { EndUserService } from '@/end-user/end-user.service';

export const entitiesUpdate = async ({
  payload,
  projectId,
  businessId,
  endUserService,
  sendEvent,
}: {
  payload: any;
  projectId: string;
  businessId: string | null;
  endUserService: EndUserService;
  sendEvent: (event: Omit<WorkflowEvent, 'state'>) => Promise<void>;
}) => {
  if (!payload) {
    return;
  }

  const promises = [];
  const { ubos, directors } = payload;

  const updatedUbos: Array<{ ballerineEntityId: string }> = [];
  const updatedDirectors: Array<{ ballerineEntityId: string }> = [];

  if (ubos && Array.isArray(ubos)) {
    promises.push(
      ...ubos.map(async ubo => {
        const data = ubo as Partial<EndUser>;

        const { id: endUserId } = await endUserService.create({
          data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            nationalId: data.nationalId,
            additionalInfo: data.additionalInfo,
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
        const data = director as Partial<EndUser>;

        const { id: endUserId } = await endUserService.create({
          data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            nationalId: data.nationalId,
            additionalInfo: data.additionalInfo,
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
