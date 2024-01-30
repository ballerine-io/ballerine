import { Controller, Get } from '@nestjs/common';
import { AlertManagerService } from './AlertManagerService';

@Controller('alert-manager')
export class AlertManagerController {
  constructor(private readonly alertManagerService: AlertManagerService) {}

  @Get('/')
  async getAlerts() {
    return await this.alertManagerService.testApiCall();
  }
}
