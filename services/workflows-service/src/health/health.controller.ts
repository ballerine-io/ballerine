import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import type { Response } from 'express';
import { Public } from '@/common/decorators/public.decorator';
import { CONTROLLER_NAME, ROUTES } from './consts';
import { ApiExcludeController } from '@nestjs/swagger';

@Public()
@ApiExcludeController()
@Controller(CONTROLLER_NAME)
export class HealthController {
  constructor(protected readonly healthService: HealthService) {}
  @Get(ROUTES.LIVE)
  healthLive(@Res() response: Response): Response<unknown> {
    return response.status(HttpStatus.NO_CONTENT).send();
  }
  @Get(ROUTES.READY)
  async healthReady(@Res() response: Response): Promise<Response<void>> {
    // Readiness gates only on primary datastore availability.
    // Redis-dependent subsystems are non-critical for serving core API routes.
    const dbReady = await this.healthService.isDbReady();

    if (!dbReady) {
      return response.status(HttpStatus.NOT_FOUND).send();
    }

    return response.status(HttpStatus.NO_CONTENT).send();
  }
}
