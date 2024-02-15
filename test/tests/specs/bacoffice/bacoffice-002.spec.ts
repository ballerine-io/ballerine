import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';
import { LogInPage } from '../../pageFactory/logIn-page.po';
import { SideMenuButton, SideMenuIndividualsLink } from '../../enums/backoffice.enum';

let logInPage: LogInPage;

test(qase([2], 'Home page login to dashboard'), async ({ page }) => {
    logInPage = new LogInPage(page);

    await test.step('Preconditions', async () => {
        await logInPage.login();
    });
    await test.step('Switch to the Individuals, Risk Score Improvement', async () => {
        await logInPage.clickSideMenuButton(SideMenuButton.INDIVIDUALS);
        await logInPage.clickSideMenuLink(SideMenuIndividualsLink.ONBOARDING);
        expect(await logInPage.isSideMenuLinkActive(SideMenuIndividualsLink.ONBOARDING)).toBe(true);
    });
    await test.step('Check the Individuals tab', async () => {
        expect(await logInPage.isSearchInputVisible()).toBe(true);
    });
    await test.step('Search for a user', async () => {
        await logInPage.clickSearchInput();
        await logInPage.setSearchInputValue('Velma');
    });
});
