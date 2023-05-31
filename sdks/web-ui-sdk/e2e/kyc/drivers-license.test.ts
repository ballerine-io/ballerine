import { test } from '@playwright/test';
import { RunFlow } from '../fixtures/run-flow.mjs';
import { beforeEachKyc } from '../fixtures/before-each.mjs';

test.beforeEach(beforeEachKyc);

test('KYC Drivers License', async ({ page }) => {
  await new RunFlow(page, 'driversLicense').start();
});
