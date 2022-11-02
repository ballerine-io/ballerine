import { expect, test } from '@playwright/test';

test('smoke', async ({ page }) => {
  // The page should load
  await page.goto('http://localhost:3000/');

  // The page should not be empty
  const button = page.getByRole('button', { name: /choose\sdocument\stype/i });

  // The page should be interactive
  await button.click();

  const title = page.getByRole('heading', { name: /upload\sid/i });

  await expect(title).toBeVisible();
});
