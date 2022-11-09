import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';
import { beforeEachKyb } from '../fixtures/before-each.mjs';

test.beforeEach(beforeEachKyb);

test('KYB Voter ID', async ({ page }) => {
  await new RunFlow(page, 'voterId', true).start();
});
