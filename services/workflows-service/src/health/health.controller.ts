import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import { Response } from 'express';

@Controller('_health')
export class HealthController {
  constructor(protected readonly healthService: HealthService) {}
  @Get('live')
  healthLive(@Res() response: Response): Response<unknown> {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
  @Get('ready')
  async healthReady(@Res() response: Response): Promise<Response<void>> {
    const dbConnection = await this.healthService.isDbReady();
    if (!dbConnection) {
      return response.status(HttpStatus.NOT_FOUND).send();
    }
    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
