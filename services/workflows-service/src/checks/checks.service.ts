import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetChecksDto } from './dto/get-checks.dto';
import { HttpService } from '@nestjs/axios';
import { CustomerService } from '@/customer/customer.service';
import { TProjectId } from '@/types';
import { env } from '@/env';
import { lastValueFrom } from 'rxjs';
import { GetKybAndOwnershipChecksDto } from './dto/get-kyb-and-ownership-checks.dto';

@Injectable()
export class ChecksService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly customerService: CustomerService,
  ) {}

  async getChecks(query: GetChecksDto) {
    throw new InternalServerErrorException('Not implemented');
  }

  async getKybAndOwnershipChecks(query: GetKybAndOwnershipChecksDto, projectId: TProjectId) {
    try {
      const customer = await this.customerService.getByProjectId(projectId);
      const url = `${env.UNIFIED_API_URL}/checks/kyb_and_ownership`;
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

  async createCheck(
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
      const url = `${env.UNIFIED_API_URL}/checks/${payload.type}`;
      const token = `Bearer ${env.UNIFIED_API_TOKEN as string}`;
      const data = {
        registrationNumber: payload.registrationNumber,
        companyName: payload.companyName,
        country: payload.country,
        state: payload.state,
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
