import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';
import { LogInPage } from '../../pageFactory/logIn-page.po';
require('dotenv').config();

test(qase([1], 'Home page login to dashboard'), async ({ page }) => {
    const logInPage = new LogInPage(page);

    await test.step('Open the page', async () => {
        await logInPage.navigate('/');
    });
    await test.step('Fill input fields', async () => {
        await logInPage.setEmailInput(process.env.LOGIN_EMAIL);
        await logInPage.setPasswordInput(process.env.LOGIN_PASSWORD);
    });
    await test.step('Click on the button', async () => {
        await logInPage.clickSignInButton();
    });
    await test.step('Check the dashboard is displayed', async () => {
        expect(await logInPage.isSearchInputVisible()).toBe(true);
    });
});
