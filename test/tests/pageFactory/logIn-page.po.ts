import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page.po';

export class LogInPage extends BasePage {
    private inputEmail: Locator;
    private inputPassword: Locator;
    private buttonSignIn: Locator;
    private inputSearch: Locator;

    constructor(page: Page) {
        super(page);

        this.inputEmail = this.page.getByLabel('Email');
        this.inputPassword = this.page.getByLabel('Password');
        this.buttonSignIn = this.page.getByRole('button', { name: 'Sign In' });
        this.inputSearch = this.page.getByPlaceholder('Search by user info');
    }

    /**
     * Sets the value of the email input field.
     * @param email - The email to be set in the input field.
     * @returns A promise that resolves once the email is set.
     */
    public async setEmailInput(email: string): Promise<void> {
        await this.inputEmail.fill(email);
    }

    /**
     * Sets the value of the password input field.
     * @param password - The password to be set in the input field.
     * @returns A promise that resolves once the password is set.
     */
    public async setPasswordInput(password: string): Promise<void> {
        await this.inputPassword.fill(password);
    }

    /**
     * Clicks the sign in button.
     * @returns A promise that resolves once the button is clicked.
     */
    public async clickSignInButton(): Promise<void> {
        await this.buttonSignIn.click();
        await this.waitForPageIsLoaded();
    }

    /**
     * Clicks the search input field.
     * @returns A promise that resolves once the input field is clicked.
     */
    public async clickSearchInput(): Promise<void> {
        await this.inputSearch.click();
    }

    /**
     * Checks if the search input is visible.
     * @returns A promise that resolves to a boolean indicating the visibility of the search input.
     */
    public async isSearchInputVisible(): Promise<boolean> {
        await this.inputSearch.waitFor({ state: 'visible' });
        return this.inputSearch.isVisible();
    }

    public async setSearchInputValue(value: string): Promise<void> {
        await this.inputSearch.fill(value);
    }

    /**
     * Clicks on a side menu button.
     * @param buttonName - The name of the button to click.
     * @returns A promise that resolves when the button is clicked.
     */
    public async clickSideMenuButton(buttonName: string): Promise<void> {
        await this.page.getByRole('button', { name: buttonName }).click();
    }

    /**
     * Clicks on a link menu button with the specified name.
     *
     * @param linkName - The name of the link menu button to click.
     * @returns A promise that resolves once the button is clicked.
     */
    public async clickSideMenuLink(linkName: string): Promise<void> {
        await this.page.getByRole('link', { name: linkName, exact: true }).click();
    }

    public async isSideMenuLinkActive(linkName: string): Promise<boolean> {
        return this.page
            .getByRole('link', { name: linkName, exact: true })
            .evaluate((el) => !el.classList.contains('aria-[current=page]'));
        // .getAttribute('class')
        // .then((classes) => classes.includes('aria-[current=page]'))
    }
}
