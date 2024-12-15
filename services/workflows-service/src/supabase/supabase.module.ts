import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SentryModule } from '@/sentry/sentry.module';

@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
  imports: [SentryModule],
})
export class SupabaseModule {}
