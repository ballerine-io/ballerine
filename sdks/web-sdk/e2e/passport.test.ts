import { expect, test } from '@playwright/test';

test('Passport', async ({ page }) => {
  // The page should load
  await page.goto('http://localhost:3000/');

  // The page should not be empty
  const button = page.getByRole('button', { name: /choose\sdocument\stype/i });

  // The page should be interactive
  await button.click();

  const title = page.getByRole('heading', { name: /upload\sid/i });

  await expect(title).toBeVisible();

  // Step 1
  const passport = page.getByText(/^passport$/i);

  await passport.click();

  let takePicture = page.locator('button[aria-label="take picture"]');

  await takePicture.click();

  let submit = page.getByRole('button', { name: /looks\sgood/i }).first();

  await submit.click();

  // Step 2
  const selfie = page.getByRole('button', { name: /take\sa\sselfie/i });

  await selfie.click();

  takePicture = page.locator('button[aria-label="take picture"]').first();

  await takePicture.click();

  submit = page.getByRole('button', { name: /looks\sgood/i }).first();

  await submit.click();

  // Final step - wait for result
  const success = page.getByRole('heading', { name: /success/i });

  await expect(success).toBeVisible();
});
