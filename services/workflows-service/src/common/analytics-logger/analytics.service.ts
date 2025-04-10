import { PostHog } from 'posthog-node';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { env } from '@/env';
import { AppLoggerService } from '../app-logger/app-logger.service';

export const EventNamesMap = {
  USER_SIGNUP: 'user.signup',
  USER_LOGIN: 'user.login',
  USER_MAGIC_LINK_LOGIN: 'user.magic_link_login',
  CUSTOMER_CREATED: 'customer.created',
  USER_CREATED: 'user.created',
  BUSINESS_REPORT_REQUESTED: 'business_report.requested',
} as const;

type AnalyticsEvents = {
  [EventNamesMap.USER_SIGNUP]: { username: string; email: string };
  [EventNamesMap.USER_LOGIN]: { email: string; customerId: string };
  [EventNamesMap.USER_MAGIC_LINK_LOGIN]: { email: string; customerId: string };
  [EventNamesMap.CUSTOMER_CREATED]: { isDemoAccount: boolean };
  [EventNamesMap.USER_CREATED]: { email: string; fullName: string };
  [EventNamesMap.BUSINESS_REPORT_REQUESTED]: {
    reportType: string;
    businessId: string;
    customerId: string;
  };
};

type TrackParams<Event extends keyof AnalyticsEvents> = {
  event: Event;
  distinctId?: string;
  properties?: AnalyticsEvents[Event];
  customerId: string;
};

@Injectable()
export class AnalyticsService implements OnModuleDestroy {
  private readonly client: PostHog | null = null;

  constructor(protected readonly logger: AppLoggerService) {
    if (!env.POSTHOG_KEY) {
      return;
    }

    this.client = new PostHog(env.POSTHOG_KEY, {
      host: env.POSTHOG_HOST,
    });
  }

  async onModuleDestroy() {
    if (!this.client) {
      return;
    }

    await this.client.shutdown();
  }

  private _trackEvent<Event extends keyof AnalyticsEvents>({
    event,
    distinctId = '',
    properties,
    customerId,
  }: TrackParams<Event>) {
    if (!this.client) {
      return;
    }

    this.client.capture({
      distinctId,
      event,
      properties,
      groups: { company: customerId },
    });
  }

  track<Event extends keyof AnalyticsEvents>(params: TrackParams<Event>) {
    this._trackEvent(params);
  }

  trackSafe<Event extends keyof AnalyticsEvents>(params: TrackParams<Event>) {
    try {
      this._trackEvent(params);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
