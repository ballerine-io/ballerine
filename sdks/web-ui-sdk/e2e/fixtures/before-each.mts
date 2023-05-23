import type { Page } from '@playwright/test';
import { Flow, TFlow } from './enums.mjs';

declare global {
  interface Window {
    BallerineSDK: {
      flows: {
        mount: (config: { flowName: string; useModal: boolean }) => void;
      };
    };
  }
}

export const beforeEach =
  (flow: TFlow) =>
  async ({ page }: { page: Page }) => {
    const onEvaluate = (() => {
      // evaluate does not work with variables from the outer scope
      switch (flow) {
        case Flow.MY_KYB_FLOW:
          return () => {
            window.BallerineSDK.flows.mount({
              flowName: 'my-kyb-flow',
              useModal: true,
            });
          };

        case Flow.MY_KYC_FLOW:
          return () => {
            window.BallerineSDK.flows.mount({
              flowName: 'my-kyc-flow',
              useModal: true,
            });
          };
        default:
          throw new Error(`Unknown flow: ${JSON.stringify(flow)}`);
      }
    })();

    await page.goto('/');
    await page.waitForTimeout(500);
    await page.evaluate(onEvaluate);
  };

export const beforeEachKyb = beforeEach(Flow.MY_KYB_FLOW);
export const beforeEachKyc = beforeEach(Flow.MY_KYC_FLOW);
