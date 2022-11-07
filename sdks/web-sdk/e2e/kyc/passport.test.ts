import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYC Passport', async ({ page }) => {
  await new RunFlow(page, 'passport').start();
});
