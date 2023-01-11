import type { Page } from '@playwright/test';
import { EFlow } from './enums.mjs';

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
  (flow: EFlow) =>
  async ({ page }: { page: Page }) => {
    const onEvaluate = (() => {
      // evaluate does not work with variables from the outer scope
      switch (flow) {
        case EFlow.MY_KYB_FLOW:
          return () => {
            window.BallerineSDK.flows.mount({
              flowName: 'my-kyb-flow',
              useModal: true,
            });
          };

        case EFlow.MY_KYC_FLOW:
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

export const beforeEachKyb = beforeEach(EFlow.MY_KYB_FLOW);
export const beforeEachKyc = beforeEach(EFlow.MY_KYC_FLOW);
