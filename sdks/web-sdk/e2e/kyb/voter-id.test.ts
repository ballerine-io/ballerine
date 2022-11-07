import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYB Voter ID', async ({ page }) => {
  await new RunFlow(page, 'voterId', true).start();
});
