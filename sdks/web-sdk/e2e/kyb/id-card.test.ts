import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYB ID Card', async ({ page, context }) => {
  await new RunFlow(page, 'idCard', true).start();
});
