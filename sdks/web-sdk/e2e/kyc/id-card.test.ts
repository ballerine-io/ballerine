import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';
import { beforeEachKyc } from '../fixtures/before-each.mjs';

test.beforeEach(beforeEachKyc);

test('KYC ID Card', async ({ page }) => {
  await new RunFlow(page, 'idCard').start();
});
