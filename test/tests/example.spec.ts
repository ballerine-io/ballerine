import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';

test(qase([1], 'Home page login to dashboard'), async ({ page }) => {
    await test.step('Open the page', async () => {
        await page.goto('/');
    });
    await test.step('Fill input fields', async () => {
        await page.getByLabel('Email').fill('admin@admin.com');
        await page.getByLabel('Password').fill('admin');
    });
    await test.step('Click on the button', async () => {
        await page.getByRole('button', { name: 'Sign In' }).click();
    });
    await test.step('Check the dashboard', async () => {
        await page.getByPlaceholder('Search by user info').click();
        await expect(page.getByPlaceholder('Search by user info')).toBeVisible();
    });
    await test.step('Switch to the Individuals tab', async () => {
        await page.getByRole('button', { name: 'Individuals Toggle' }).click();
        await page.getByRole('link', { name: 'Risk Score Improvement - Individuals', exact: true }).click();
    });
    await test.step('Check the Individuals tab', async () => {
        await page.getByPlaceholder('Search by user info').click();
        await expect(page.getByPlaceholder('Search by user info')).toBeVisible();
    });
    await test.step('Search for a user', async () => {
        await page.getByPlaceholder('Search by user info').click();
        await page.getByPlaceholder('Search by user info').fill('Velma');
    });

    // await page.getByText('The user aborted a request.').click();
    // await page.getByText('UnassignedMarietta Brekke').click();
    // await page.getByText('The user aborted a request.').click();
    await page.waitForTimeout(15000);
});
