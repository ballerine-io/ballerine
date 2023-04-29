import { test } from '@playwright/test';

test('smoke', async ({ page }) => {
  await page.goto('http://localhost:5137/');
});
