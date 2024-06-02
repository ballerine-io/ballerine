import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { createClient } from '@supabase/supabase-js';
import { env } from '@/env';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context);
    const request = context.switchToHttp().getRequest<Request>();

    await super.logIn(request);

    if (env.TELEMETRY_ENABLED && env.TELEMETRY_SUPABASE_URL && env.TELEMETRY_SUPABASE_API_KEY) {
      const SupabaseClient = createClient(
        env.TELEMETRY_SUPABASE_URL,
        env.TELEMETRY_SUPABASE_API_KEY,
        {
          db: { schema: 'public' },
        },
      );

      const fullUrl = `${request.protocol}://${request.get('Host')}${request.originalUrl}`;

      await SupabaseClient.from('logins').insert([{ url: fullUrl }]);

      // @TODO: Set timeout
      // @TODO: Handle errors
    }

    return result as boolean;
  }
}
