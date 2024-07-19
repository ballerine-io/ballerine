import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { PrismaTransaction } from '@/types';
import { GetWorkflowDefinitionListDto } from '@/workflow-defintion/dtos/get-workflow-definition-list.dto';
import { validateDefinitionLogic } from '@ballerine/workflow-core';
import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient, WorkflowDefinition } from '@prisma/client';

@Injectable()
export class WorkflowDefinitionRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
  ): Promise<WorkflowDefinition> {
    validateDefinitionLogic(args.data);

    return await this.prisma.workflowDefinition.create<T>(args);
  }

  async createUnscoped<T extends Prisma.WorkflowDefinitionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCreateArgs>,
  ): Promise<WorkflowDefinition> {
    validateDefinitionLogic(args.data);

    return await this.prisma.workflowDefinition.create<T>(args);
  }

  async findMany<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition[]> {
    const queryArgs = this.scopeService.scopeFindMany(args, projectIds);

    if (args.where?.projectId) {
      queryArgs.where = {
        OR: [
          {
            ...queryArgs.where,
          },
          {
            ...queryArgs.where,
            projectId: null,
            isPublic: true,
          },
        ],
      };
    }

    return await this.prisma.workflowDefinition.findMany(queryArgs);
  }

  async count<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCountArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.workflowDefinition.count({
      //@ts-ignore
      where: {
        ...args.where,
        projectId: {
          in: projectIds,
        },
      },
    });
  }

  async countUnscoped<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionCountArgs>,
  ) {
    return await this.prisma.workflowDefinition.count({
      //@ts-ignore
      ...args,
    });
  }

  async findById<T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
    transaction: PrismaTransaction | PrismaClient = this.prisma,
  ): Promise<WorkflowDefinition> {
    const queryArgs = args as Prisma.WorkflowDefinitionFindFirstOrThrowArgs;

    queryArgs.where = {
      ...queryArgs.where,
      OR: [
        {
          id,
          projectId: null,
          isPublic: true,
        },
        {
          AND: [{ id, project: { id: { in: projectIds! } } }],
        },
      ],
    };

    return await transaction.workflowDefinition.findFirstOrThrow(queryArgs);
  }

  async findTemplateByIdUnscoped<
    T extends Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>,
  >(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionFindFirstOrThrowArgs, 'where'>>,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: { id, isPublic: true },
      ...args,
    });
  }

  async updateById(
    id: string,
    args: Pick<Prisma.WorkflowDefinitionUpdateArgs, 'data'>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    const scopedArgs = this.scopeService.scopeUpdate(
      {
        ...args,
        where: { id },
      },
      projectIds,
    );
    if (args.data?.definition) {
      validateDefinitionLogic(args.data.definition as any);
    }

    return await this.prisma.workflowDefinition.update(scopedArgs);
  }

  async deleteById<T extends Omit<Prisma.WorkflowDefinitionDeleteArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.WorkflowDefinitionDeleteArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<WorkflowDefinition> {
    return await this.prisma.workflowDefinition.delete(
      this.scopeService.scopeDelete(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findByLatestVersion<T extends Prisma.WorkflowDefinitionFindManyArgs>(
    name: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Prisma.WorkflowDefinitionFindManyArgs>,
  ) {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      ...args,
      where: {
        ...(args?.where ?? {}),
        OR: [
          {
            name,
            projectId: { in: projectIds },
          },
          {
            name,
            projectId: null,
            isPublic: true,
          },
        ],
      },
      orderBy: { version: 'desc' },
    });
  }

  async findLatestVersionByVariant(variant: string, projectIds: TProjectIds) {
    return await this.prisma.workflowDefinition.findFirstOrThrow({
      where: {
        OR: [
          {
            variant,
            projectId: { in: projectIds },
          },
          {
            variant,
            projectId: null,
            isPublic: true,
          },
        ],
      },
      orderBy: { version: 'desc' },
    });
  }

  async getListCount(dto: GetWorkflowDefinitionListDto, projectIds: TProjectIds) {
    const result = await this.prisma.$queryRaw(
      Prisma.sql`
        SELECT COUNT(*) AS total_count FROM (
          SELECT * FROM "WorkflowDefinition"
          WHERE "isPublic" = true
          UNION ALL
          SELECT * FROM "WorkflowDefinition"
          WHERE "projectId" IN (${Prisma.join(projectIds || [])}) AND "isPublic" = false
        ) AS combined_results
    `,
    );

    //@ts-ignore
    return Number(result[0]?.total_count) || 0;
  }

  async getList(dto: GetWorkflowDefinitionListDto, projectIds: TProjectIds) {
    return await this.prisma.$queryRaw(
      Prisma.sql`
        SELECT * FROM (
        SELECT * FROM "WorkflowDefinition"
        WHERE "isPublic" = true
        UNION ALL
        SELECT * FROM "WorkflowDefinition"
        WHERE "projectId" IN (${Prisma.join(projectIds || [])}) AND "isPublic" = false
        ) AS combined_results
        ORDER BY "createdAt" desc
        LIMIT ${dto.limit}
        OFFSET ${dto.limit * (dto.page - 1)}
    `,
    );
  }
}
