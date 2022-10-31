/// <reference types="svelte" />

// Should use Posthog's types here instead

import { DecisionStatus } from "./lib/utils/event-service";
import { DevMocks } from "./lib/contexts/app-state";

interface IPosthog {
  capture(event: string, payload?: Record<PropertyKey, any>): void;
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

// Otherwise the file is not being picked up by TypeScript
export {};
