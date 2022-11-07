import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYC ID Card', async ({ page }) => {
  await new RunFlow(page, 'idCard').start();
});
