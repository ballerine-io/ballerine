/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ISupabaseService } from './types';
import { SentryService } from '@/sentry/sentry.service';

@Injectable()
export class SupabaseService implements ISupabaseService {
  private readonly supabaseClient!: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly sentry: SentryService,
  ) {
    const telemetryEnabled = this.configService.get('TELEMETRY_ENABLED');
    const supabaseUrl = this.configService.get<string>('TELEMETRY_SUPABASE_URL');
    const supabaseApiKey = this.configService.get<string>('TELEMETRY_SUPABASE_API_KEY');

    if (telemetryEnabled) {
      if (!supabaseUrl || !supabaseApiKey) {
        throw new Error('Supabase URL or API key is missing in configuration');
      } else {
        this.supabaseClient = createClient(supabaseUrl, supabaseApiKey, {
          db: { schema: 'public' },
        });
        this.logger.log('Supabase client initialized.');
        // This log is created as part of the entrypoint script
        // which gather details of the infrastructure.
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const infradata = require('/tmp/infra.json');
          void this.logInfraData(infradata);
        } catch (error: Error | any) {
          if (error.code === 'MODULE_NOT_FOUND') {
            this.logger.error(`file not present: ${error.message}`);
            this.sentry.captureException(error.message);
          } else {
            this.logger.error(`Exception infra data not present: ${error.message}`);
          }
        }
      }
    } else {
      this.logger.log('Telemetry disabled.');
    }
  }

  async logSignIn(url: string): Promise<void> {
    try {
      const { data, error } = await this.supabaseClient.from('logins').insert([{ url }]);

      if (error) {
        this.logger.error(`Failed to log sign-in: ${error.message}`);
      } else {
        this.logger.log(`Sign-in logged successfully: ${data}`);
      }
    } catch (error: Error | any) {
      this.logger.error(`Exception to log sign in data: ${error.message}`);
      this.sentry.captureException(error.message);
    }
  }

  async logInfraData(infradata: JSON): Promise<void> {
    try {
      const { data, error } = await this.supabaseClient.from('infra').insert([infradata]);

      if (error) {
        this.logger.error(`Failed to log infra data: ${error.message}`);
      } else {
        this.logger.log(`logged infra data successfully: ${data}`);
      }
    } catch (error: Error | any) {
      this.logger.error(`Exception to log infra data: ${error.message}`);
      this.sentry.captureException(error.message);
    }
  }
}
