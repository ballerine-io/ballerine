import * as common from '@nestjs/common';
import { HttpException, HttpStatus, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { SalesforceService } from '@/salesforce/salesforce.service';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds } from '@/types';

@common.Controller('salesforce')
export class SalesforceController {
  constructor(public salesforceService: SalesforceService) {}

  @common.Get('redirect')
  public async redirect(@ProjectIds() projectIds: TProjectIds, @Res() res: Response) {
    const salesforceIntegration = await this.salesforceService.findByProjectId(projectIds![0]!);

    if (salesforceIntegration) {
      throw new HttpException(
        'This project already has a Salesforce integration.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const authorizationUrl = this.salesforceService.getAuthorizationUrl();

    return res.redirect(authorizationUrl);
  }

  @common.Get('callback')
  public async callback(@ProjectIds() projectIds: TProjectIds, @common.Req() req: Request) {
    const salesforceIntegration = await this.salesforceService.findByProjectId(projectIds![0]!);

    if (salesforceIntegration) {
      throw new HttpException(
        'This project already has a Salesforce integration.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { code } = req.query;

    if (typeof code !== 'string') {
      throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
    }

    return await this.salesforceService.authorize(projectIds![0]!, {
      code,
    });
  }
}
