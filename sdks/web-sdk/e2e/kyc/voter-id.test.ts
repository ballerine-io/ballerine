import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';

test('KYC Voter ID', async ({ page }) => {
  await new RunFlow(page, 'voterId').start();
});
