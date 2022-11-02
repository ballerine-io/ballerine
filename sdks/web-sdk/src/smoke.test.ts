import { test } from '@playwright/test';

test('smoke', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const title = page.locator('text=Playwright');
});
