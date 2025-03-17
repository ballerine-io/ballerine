import { PostHog } from 'posthog-node';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { env } from '@/env';

export const EventNamesMap = {
  USER_SIGNUP: 'user signed up',
  USER_LOGIN: 'user logged in',
  USER_MAGIC_LINK_LOGIN: 'user logged in magic link',
  CUSTOMER_CREATED: 'customer created',
  USER_CREATED: 'user created',
} as const;

type AnalyticsEvents = {
  [EventNamesMap.USER_SIGNUP]: { username: string; email: string };
  [EventNamesMap.USER_LOGIN]: { email: string; customerId: string };
  [EventNamesMap.USER_MAGIC_LINK_LOGIN]: { email: string; customerId: string };
  [EventNamesMap.CUSTOMER_CREATED]: { isDemoAccount: boolean };
  [EventNamesMap.USER_CREATED]: { email: string; fullName: string };
};

@Injectable()
export class AnalyticsService implements OnModuleDestroy {
  private readonly client: PostHog | null = null;

  constructor() {
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

  track<Event extends keyof AnalyticsEvents>({
    event,
    distinctId = '',
    properties,
  }: {
    event: Event;
    distinctId?: string;
    properties?: AnalyticsEvents[Event];
  }) {
    if (!this.client) {
      return;
    }

    this.client.capture({
      distinctId,
      event,
      properties,
    });
  }
}
