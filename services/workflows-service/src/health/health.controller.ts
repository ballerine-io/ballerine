import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import type { Response } from 'express';
import { Public } from '@/common/decorators/public.decorator';

@Public()
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
