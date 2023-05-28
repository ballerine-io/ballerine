import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';
import { beforeEachKyc } from '../fixtures/before-each.mjs';

test.beforeEach(beforeEachKyc);

test('KYC Passport', async ({ page }) => {
  await new RunFlow(page, 'passport').start();
});
