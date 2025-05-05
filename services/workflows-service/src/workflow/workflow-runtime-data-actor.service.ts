import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkflowRuntimeDataActorService {
  constructor(private readonly cls: ClsService) {}

  addActorIds<
    T extends
      | Prisma.WorkflowRuntimeDataCreateInput
      | Prisma.WorkflowRuntimeDataUncheckedUpdateInput,
  >(data: T): T {
    const entity = this.cls.get('entity');
    return {
      ...data,
      actorEndUserId: entity?.endUser?.endUserId || null,
      actorUserId: entity?.user?.id || null,
    };
  }
}
