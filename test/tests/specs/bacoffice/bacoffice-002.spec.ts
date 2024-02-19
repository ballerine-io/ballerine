import { test, expect, Page } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';
import { LogInPage } from '../../pageFactory/logIn-page.po';
import { DashboardPage } from '../../pageFactory/dasboard-page.po';
import { SideMenuButton, SideMenuIndividualsLink } from '../../enums/backoffice.enum';

let logInPage: LogInPage;
let dashboardPage: DashboardPage;
const configData = {
    ID: '483fb098-16da-450a-8d39-e78b6cc9ed16',
    ENTITY_ID: 'clpvdz7hy005n23isepjs8gp3',
    BALLERINE_ENTITY_ID: 'ckkt3t2bw000aqxtt0hj4pw4c',
    FIRST_NAME: 'Dorothea',
    LAST_NAME: 'Maggio',
    EMAIL: 'Nakia71@yahoo.com',
    PHONE: '991-382-8483 x75169'
};
let page: Page;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    logInPage = new LogInPage(page);
    dashboardPage = new DashboardPage(page);

    await test.step('Preconditions', async () => {
        await logInPage.login();
    });
    await test.step('Switch to the Individuals, Risk Score Improvement', async () => {
        await dashboardPage.clickSideMenuButton(SideMenuButton.INDIVIDUALS);
        await dashboardPage.clickSideMenuLink(SideMenuIndividualsLink.ONBOARDING);
        expect(await dashboardPage.isSideMenuLinkActive(SideMenuIndividualsLink.ONBOARDING)).toBe(true);
    });
});

test(qase([4], 'Exact Match Search @search'), async () => {
    await test.step('Enter an exact id into the search field and initiate the search', async () => {
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(configData.ID);
        const response = await dashboardPage.catchIncludesResponse(configData.ID, 200, 20000);
        expect(response.status()).toBe(200);
        expect(
            (await response.json()).data[0].entity.id,
            `Expected: ballerineEntityId - ${configData.BALLERINE_ENTITY_ID}`
        ).toBe(configData.BALLERINE_ENTITY_ID);
    });
    await test.step('Enter an exact lastName into the search field and initiate the search.', async () => {
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(configData.BALLERINE_ENTITY_ID);
        const response = await dashboardPage.catchIncludesResponse(configData.BALLERINE_ENTITY_ID, 200, 20000);
        expect(response.status()).toBe(200);
        const responseData = await response.json();
        expect(responseData.data[0].entity.id, `Expected: id - ${configData.BALLERINE_ENTITY_ID}`).toBe(
            configData.BALLERINE_ENTITY_ID
        );
    });
    await test.step('Enter an exact ballerineEntityId into the search field and initiate the search.', async () => {
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(configData.LAST_NAME);
        const response = await dashboardPage.catchIncludesResponse(configData.LAST_NAME, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getLastName(), `Expected: lastName - ${configData.LAST_NAME}`).toBe(
            configData.LAST_NAME
        );
    });
});

test(qase([5], 'Combined Fields Search @search'), async () => {
    await test.step('Enter a combination of firstName and email into the search field and initiate the search.', async () => {
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(`${configData.FIRST_NAME} ${configData.EMAIL}`);
        const response = await dashboardPage.catchIncludesResponse(configData.FIRST_NAME, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getFirstName(), `Expected: lastName - ${configData.FIRST_NAME}`).toBe(
            configData.FIRST_NAME
        );
        expect(await dashboardPage.getEmail(), `Expected: email - ${configData.EMAIL}`).toBe(configData.EMAIL);
    });

    await test.step('Enter a combination of lastName and phone into the search field and initiate the search.', async () => {
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(`${configData.LAST_NAME} ${configData.PHONE}`);
        const response = await dashboardPage.catchIncludesResponse(configData.LAST_NAME, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getLastName(), `Expected: lastName - ${configData.LAST_NAME}`).toBe(
            configData.LAST_NAME
        );
        expect(await dashboardPage.getPhone(), `Expected: phone - ${configData.PHONE}`).toBe(configData.PHONE);
    });

    await test.step('Enter a combination of firstName and middleName into the search field and initiate the search.', async () => {
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(`${configData.FIRST_NAME} ${configData.LAST_NAME}`);
        const response = await dashboardPage.catchIncludesResponse(configData.FIRST_NAME, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getFirstName(), `Expected: lastName - ${configData.FIRST_NAME}`).toBe(
            configData.FIRST_NAME
        );
        expect(await dashboardPage.getLastName(), `Expected: lastName - ${configData.LAST_NAME}`).toBe(
            configData.LAST_NAME
        );
    });
});

test(qase([6], 'Special Characters and Whitespace Handling @search'), async () => {
    await test.step('Enter an email address with special characters (like a period or underscore) into the search field and initiate the search.', async () => {
        const email_underscore = 'Tobin_Schultz@gmail.com';
        const email_period = 'Paxton.Halvorson70@yahoo.com';
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(email_underscore);
        const response = await dashboardPage.catchIncludesResponse(email_underscore, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getEmail(), `Expected: email - ${email_underscore}`).toBe(email_underscore);

        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(email_period);
        const response2 = await dashboardPage.catchIncludesResponse(email_period, 200, 20000);
        expect(response2.status()).toBe(200);
        expect(await dashboardPage.getEmail(), `Expected: email - ${email_period}`).toBe(email_period);
    });

    await test.step('Enter a phone number with whitespace and special characters (like parentheses and hyphens) into the search field and initiate the search.', async () => {
        const phone = '(398) 676-7505 x345';
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(phone);
        const response = await dashboardPage.catchIncludesResponse(phone, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getPhone(), `Expected: phone with hyphens - ${phone}`).toBe(phone);
    });

    await test.step("Enter a lastName with an apostrophe (e.g., O'Connor) into the search field and initiate the search.", async () => {
        const firstName = 'San-Martin';
        const lastName = "O'Connor";
        expect(await dashboardPage.isSearchInputVisible()).toBe(true);
        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(lastName);
        const response = await dashboardPage.catchIncludesResponse(lastName, 200, 20000);
        expect(response.status()).toBe(200);
        expect(await dashboardPage.getLastName(), `Expected: lastName - ${lastName}`).toBe(lastName);

        await dashboardPage.setSearchInputValue('');
        await dashboardPage.setSearchInputValue(firstName);
        const response2 = await dashboardPage.catchIncludesResponse(firstName, 200, 20000);
        expect(response2.status()).toBe(200);
        expect(await dashboardPage.getFirstName(), `Expected: firstName - ${firstName}`).toBe(firstName);
    });
});
