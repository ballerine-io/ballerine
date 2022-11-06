import { expect, test } from '@playwright/test';

test('ID Card', async ({ page }) => {
  // The page should load
  await page.goto('http://localhost:3000/');

  // The page should not be empty
  const button = page.getByRole('button', { name: /choose\sdocument\stype/i });

  // The page should be interactive
  await button.click();

  const title = page.getByRole('heading', { name: /upload\sid/i });

  await expect(title).toBeVisible();

  // Step 1
  const idCard = page.getByText(/^id\scard$/i);

  await idCard.click();

  let takePicture = page.locator('button[aria-label="take picture"]');

  await takePicture.click();

  let submit = page.getByRole('button', { name: /looks\sgood/i });

  await submit.click();

  // Step 2
  const idBackSide = page.getByRole('button', {
    name: /take\sphoto/i,
  });

  await idBackSide.click();

  takePicture = page.locator('button[aria-label="take picture"]').first();

  await takePicture.click();

  submit = page.getByRole('button', { name: /looks\sgood/i });

  await submit.click();

  // Step 3
  const selfie = page.getByRole('button', { name: /take\sa\sselfie/i });

  await selfie.click();

  takePicture = page.locator('button[aria-label="take picture"]').first();

  await takePicture.click();

  submit = page.getByRole('button', { name: /looks\sgood/i });

  await submit.click();

  // Final step - wait for result
  const success = page.getByRole('heading', { name: /success/i });

  await expect(success).toBeVisible();
});
