import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page.po';

export class LogInPage extends BasePage {
    private inputEmail: Locator;
    private inputPassword: Locator;
    private buttonSignIn: Locator;
    private errorMessage: Locator;
    private noticeEmailInput: Locator;

    constructor(page: Page) {
        super(page);

        this.inputEmail = this.page.getByLabel('Email');
        this.inputPassword = this.page.getByLabel('Password');
        this.buttonSignIn = this.page.getByRole('button', { name: 'Sign In' });
        this.errorMessage = this.page.locator('div[role="alert"]');
        this.noticeEmailInput = this.page.locator('[name="email"] + p[id*="form-item-message"]');
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
     * Checks if the error message is visible.
     * @returns A promise that resolves to a boolean indicating whether the error message is visible.
     */
    public async isErrorMessageVisible(): Promise<boolean> {
        await this.errorMessage.waitFor({ state: 'visible' });
        return this.errorMessage.isVisible();
    }

    /**
     * Checks if the notice message for the email input is visible.
     * @returns A promise that resolves to a boolean indicating whether the notice message is visible.
     */
    public async isNoticeEmailInputVisible(): Promise<boolean> {
        await this.noticeEmailInput.waitFor({ state: 'visible' });
        return this.noticeEmailInput.isVisible();
    }
}
