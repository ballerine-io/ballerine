import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';
import { beforeEachKyc } from '../fixtures/before-each.mjs';

test.beforeEach(beforeEachKyc);

test('KYC Voter ID', async ({ page }) => {
  await new RunFlow(page, 'voterId').start();
});
