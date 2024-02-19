import { test, expect, Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';
import { LogInPage } from '../../pageFactory/logIn-page.po';
require('dotenv').config();

let logInPage;
LogInPage;
let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    logInPage = new LogInPage(page);
    await test.step('Open the page', async () => {
        await logInPage.navigate('/');
    });
});

test(qase([1], 'Login with invalid email @login'), async () => {
    await test.step('Fill input fields', async () => {
        await logInPage.setEmailInput('invalid@email');
        await logInPage.setPasswordInput('invalidpassword');
    });
    await test.step('Click on the button', async () => {
        await logInPage.clickSignInButton();
    });
    await test.step('Check the error email notice is displayed', async () => {
        expect(await logInPage.isNoticeEmailInputVisible()).toBe(true);
    });
});

test(qase([2], 'Login with invalid password @login'), async () => {
    await test.step('Fill input fields', async () => {
        await logInPage.setEmailInput(process.env.LOGIN_EMAIL);
        await logInPage.setPasswordInput('invalidpassword');
    });
    await test.step('Click on the button', async () => {
        await logInPage.clickSignInButton();
    });
    await test.step('Check the error message is displayed', async () => {
        expect(await logInPage.isErrorMessageVisible()).toBe(true);
    });
});

test(qase([3], 'Login with valid credential @login'), async () => {
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
