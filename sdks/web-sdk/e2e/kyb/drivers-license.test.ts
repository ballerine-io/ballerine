import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYB Drivers License', async ({ page }) => {
  await new RunFlow(page, 'driversLicense', true).start();
});
