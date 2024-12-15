import { Injectable, Logger } from '@nestjs/common';
import { ISupabaseService } from './types';

@Injectable()
export class MockSupabaseService implements ISupabaseService {
  private readonly logger = new Logger(MockSupabaseService.name);

  async logSignIn(url: string): Promise<void> {
    this.logger.debug(`Mock log: Sign-in recorded for URL: ${url}`);
  }

  async logInfraData(infradata: JSON): Promise<void> {
    this.logger.debug(`Mock log: ${infradata} Infra data logged`);
  }
}
