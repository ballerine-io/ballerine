import { PostHog } from 'posthog-node';
import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { env } from '@/env';
import { AppLoggerService } from '../app-logger/app-logger.service';
import { PrismaService } from '@/prisma/prisma.service';

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
  [EventNamesMap.CUSTOMER_CREATED]: { isDemoAccount: boolean; maxBusinessReports: number };
  [EventNamesMap.USER_CREATED]: { email: string; fullName: string };
  [EventNamesMap.BUSINESS_REPORT_REQUESTED]: {
    projectId: string;
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

  constructor(protected readonly logger: AppLoggerService, private readonly prisma: PrismaService) {
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

  private async _trackEvent<Event extends keyof AnalyticsEvents>({
    event,
    distinctId = '',
    properties,
    customerId,
  }: TrackParams<Event>) {
    if (!this.client) {
      return;
    }

    try {
      // Get the customer hubspotCustomerId
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
        select: { hubspotCustomerId: true },
      });

      // Merge hubspotCustomerId into properties if it exists
      const enhancedProperties = {
        ...properties,
        ...(customer?.hubspotCustomerId && { hubspotCustomerId: customer.hubspotCustomerId }),
        environment: env.ENVIRONMENT_NAME,
      };

      this.client.capture({
        distinctId,
        event,
        properties: enhancedProperties,
        groups: { company: customerId },
      });
    } catch (error) {
      this.logger.error(`Failed to track event with hubspotCustomerId: ${error}`);

      // Fallback to the original tracking without hubspotCustomerId but still include environment
      this.client.capture({
        distinctId,
        event,
        properties: {
          ...properties,
          environment: env.ENVIRONMENT_NAME,
        },
        groups: { company: customerId },
      });
    }
  }

  async track<Event extends keyof AnalyticsEvents>(params: TrackParams<Event>) {
    await this._trackEvent(params);
  }

  async trackSafe<Event extends keyof AnalyticsEvents>(params: TrackParams<Event>) {
    try {
      await this._trackEvent(params);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
