import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYB Passport', async ({ page }) => {
  await new RunFlow(page, 'passport', true).start();
});
