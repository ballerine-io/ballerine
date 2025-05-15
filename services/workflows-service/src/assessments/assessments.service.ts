import { CustomerService } from '@/customer/customer.service';
import { env } from '@/env';
import { TProjectId } from '@/types';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { GetAssessmentsDto } from './dtos/get-assessments.dto';
import { GetKybAndOwnershipAssessmentsDto } from './dtos/get-kyb-and-ownership-assessments.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly customerService: CustomerService,
  ) {}

  async getAssessments(query: GetAssessmentsDto) {
    throw new InternalServerErrorException('Not implemented');
  }

  async getKybAndOwnershipAssessments(
    query: GetKybAndOwnershipAssessmentsDto,
    projectId: TProjectId,
  ) {
    try {
      const customer = await this.customerService.getByProjectId(projectId);
      const url = `${env.UNIFIED_API_URL}/assessments/kyb_and_ownership`;
      const token = `Bearer ${env.UNIFIED_API_TOKEN as string}`;

      const queryParams = {
        page: query.page,
        limit: query.limit,
        customerId: customer.id,
        projectId,
      };

      const request$ = await this.httpService.get(url, {
        params: queryParams,
        headers: {
          Authorization: token,
        },
      });

      const result = await lastValueFrom(request$);

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createAssessment(
    payload: {
      type: 'kyb_and_ownership';
      registrationNumber: string;
      companyName: string;
      country: string;
      state?: string;
    },
    projectId: TProjectId,
  ) {
    try {
      const url = `${env.UNIFIED_API_URL}/assessments/${payload.type}`;
      const token = `Bearer ${env.UNIFIED_API_TOKEN as string}`;
      const data = {
        registrationNumber: payload.registrationNumber,
        companyName: payload.companyName,
        country: [payload.country, payload.state].filter(Boolean).join('-'),
        //@TODO: remove this once we have the businessId
        businessId: '1234567890',
        projectId,
      };

      const request$ = await this.httpService.post(url, data, {
        headers: {
          Authorization: token,
        },
      });

      const result = await lastValueFrom(request$);

      return result.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
