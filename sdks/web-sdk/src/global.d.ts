/// <reference types="svelte" />

// Importing into global.d.ts breaks global types such as RecursivePartial

enum DecisionStatus {
  APPROVED = 'approved',
  RESUBMISSION_REQUESTED = 'resubmission_requested',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  ABANDONED = 'abandoned',
  REVIEW = 'review',
}

type AnyRecord = Record<PropertyKey, any>;

// Should use Posthog's types here instead
interface IPosthog {
  capture(event: string, payload?: AnyRecord): void;
}

interface DevMocks {
  resultTime: number | string;
  reasonCode: number;
  code: number;
  idvResult: DecisionStatus;
}

declare global {
  var __APP_VERSION__: string;

  interface Window {
    isProd: boolean;
    __blrn_context: {
      mockReasonCode: DevMocks["reasonCode"];
      mockResultTime: DevMocks["resultTime"];
      mockCode: DevMocks["code"];
      mockIdvResult: DevMocks["idvResult"];
    };
    posthog: IPosthog;
  }
}

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

type StringKV = { [key: string]: string };
