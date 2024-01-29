import { Injectable } from '@nestjs/common';
import { alertRepository } from '@/alert/alert.repository';
import { alertCreateDto } from './dtos/alert-create';
import { alertEntityMapper } from './alert.mapper';
import { Prisma, alert } from '@prisma/client';
import { sleep } from '@ballerine/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Injectable()
export class alertService {
  constructor(
    protected readonly repository: alertRepository,
    protected readonly logger: AppLoggerService,
  ) {}

  async create(payload: alertCreateDto): Promise<alert> {
    const alertEntity: Prisma.alertCreateInput = {
      ...alertEntityMapper.toEntity(payload),
      project: {
        connect: { id: payload.projectId },
      },
      // #TODO: fix types - this is a workaround, prisma defines jsonb's as prsima "json input"
      tags: payload.tags as any,
      auditTrail: payload.auditTrail as any,
      unusualActivityFlags: payload.unusualActivityFlags as any,
      additionalInfo: payload.additionalInfo as any,
    };

    return this.repository.create({ data: alertEntity });
  }

  async createBatch(payload: alertCreateDto[]): Promise<{
    txCreationResponse: {
      txid: string;
      status: 'success' | 'failed';
      txCorrelationId: string;
      errorMessage?: string;
    }[];
    overallStatus: 'success' | 'partial';
  }> {
    // TEMP IMPLEMENTATION - REMOVE WHEN TASK BASED BATCH CREATE IS IMPLEMENTED

    const txCreationResponse: {
      txid: string;
      status: 'success' | 'failed';
      txCorrelationId: string;
      errorMessage?: string;
    }[] = [];
    let overallStatus: 'success' | 'partial' = 'success';

    for (const alert of payload) {
      const alertEntity: Prisma.alertCreateInput = {
        ...alertEntityMapper.toEntity(alert),
        project: {
          connect: { id: alert.projectId },
        },
        // #TODO: fix types - this is a workaround, prisma defines jsonb's as prsima "json input"
        tags: alert.tags as any,
        auditTrail: alert.auditTrail as any,
        unusualActivityFlags: alert.unusualActivityFlags as any,
        additionalInfo: alert.additionalInfo as any,
      };

      await sleep(200);

      let res;
      try {
        res = await this.repository.create({ data: alertEntity });
        txCreationResponse.push({
          txid: res.id,
          txCorrelationId: alert.correlationId,
          status: 'success',
        });
      } catch (error: unknown) {
        overallStatus = 'partial';

        txCreationResponse.push({
          txid: res?.id ?? '',
          status: 'failed',
          txCorrelationId: alert.correlationId,
          errorMessage: (error as Error).message ?? '',
        });
      }
    }
    this.logger.log('txCreationResponse', txCreationResponse);

    return { txCreationResponse, overallStatus };
  }

  // async list(args?: Parameters<alertRepository['findMany']>[0]) {
  //   return this.repository.findMany(args);
  // }

  // async getById(id: string, args?: Parameters<alertRepository['findById']>[1]) {
  //   return this.repository.findById(id, args);
  // }

  // async getByApiKey(apiKey: string) {
  //   return this.repository.findByApiKey(apiKey);
  // }

  // async getByProjectId(
  //   projectId: string,
  //   args?: Omit<Prisma.alertFindFirstArgsBase, 'where'>,
  // ) {
  //   return this.repository.findByProjectId(projectId, args);
  // }

  // async updateById(id: string, args: Parameters<alertRepository['updateById']>[1]) {
  //   return this.repository.updateById(id, args);
  // }

  // async deleteById(id: string, args?: Parameters<alertRepository['deleteById']>[1]) {
  //   return this.repository.deleteById(id, args);
  // }
}
