import { expect, test } from '@playwright/test';

test.describe('should keep basic functionality #e2e #smoke', async () => {
  test('when navigating to the root page the sign up form renders', async ({ page }) => {
    await page.goto('/');

    const welcome = page.getByText(/welcome/i);

    const firstInput = page.getByLabel(/first\sname|business\sname/i);
    const secondInput = page.getByLabel(/last\sname|registration\snumber/i);

    const signUpBtn = page.getByRole('button', { name: /sign\sup/i });

    await expect(welcome).toBeVisible();

    await expect(firstInput).toBeVisible();
    await expect(secondInput).toBeVisible();

    await expect(signUpBtn).toBeVisible();
  });

  test('when navigating to the root page clear user button renders', async ({ page }) => {
    await page.goto('/');

    const clearUserBtn = page.getByRole('button', { name: /clear\suser/i });

    await expect(clearUserBtn).toBeVisible();
  });
});
