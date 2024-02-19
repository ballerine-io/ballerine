/**
 * BasePage is an abstract class representing the base structure for page objects.
 * It provides common methods and utilities for interacting with pages using Playwright.
 */
import { Locator, Page, Response } from '@playwright/test';
import { Timeout } from '../enums/timeouts.enum';

export class BasePage {
    page: Page;
    public readonly spinners: Locator;
    private inputSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        this.spinners = this.page.locator('app-spinner svg.spinner');
        this.inputSearch = this.page.getByPlaceholder('Search by user info');
    }

    /**
     * Logs in to the application.
     * @returns {Promise<void>} A promise that resolves when the login process is complete.
     */
    async login() {
        await this.page.goto('/en/auth/sign-in');
        await this.waitForPageIsLoaded();
        await this.page.getByLabel('Email').fill(process.env.LOGIN_EMAIL);
        await this.page.getByLabel('Password').fill(process.env.LOGIN_PASSWORD);
        await this.page.getByRole('button', { name: 'Sign In' }).click();
        await this.waitForPageIsLoaded();
    }

    /**
     * Navigates to the specified path, sets local storage based on worksite location ID if not present.
     *
     * @param path - The path to navigate to.
     */
    async navigate(path) {
        await this.page.goto(path);
        // const localStorage = await this.page.evaluate(() => localStorage.getItem('location'));
        // if (localStorage === null) {
        //     await this.setLocalStorage();
        // }
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
     * Use this method to wait until target element includes text that match specified regular expression value.
     * Several tips for usages:
     *   - to match empty string regExpPattern = '^$'
     *   - to match any whitespaces regExpPattern = '\s'
     *   - to match any character 1 or more times regExpPattern = '\.+'
     * @param element target element locator
     * @param regExpPattern regular expression pattern or string value to be used for element text content match
     * @param timeout time slot for waiting of the text value. By default is 1 seconds
     * @returns TRUE if there is such element on the page and it contains specified text value. Otherwise, returns FALSE
     */
    public async waitForFieldIncludesText(
        element: Locator,
        regExpPattern: string,
        timeout: number = 1000
    ): Promise<boolean> {
        const specSymb = ['[', ']', '\\', '^', '$', '.', '|', '?', '*', '+', '(', ')'];
        regExpPattern = regExpPattern
            .split('')
            .map((it) => (specSymb.includes(it) ? '\\'.concat(it) : it))
            .join('');

        const pattern = new RegExp(regExpPattern);
        let doesTextMatch = false;
        for (let i = 0; i < Math.floor(timeout / 100); i++) {
            await this.page.waitForTimeout(100);
            try {
                doesTextMatch = pattern.test(await element.inputValue());
            } catch {
                doesTextMatch = (await element.allTextContents()).some((t) => pattern.test(t));
            }
            if (doesTextMatch) break;
        }
        return doesTextMatch;
    }

    /**
     * Wait for all of visible spinners to disappear
     * @param timeout optional with default value of 1 minute
     */
    async waitForSpinnersDetached(timeout = Timeout.ONE_MINUTE): Promise<void> {
        for (let i = 0; i < timeout; i += 100) {
            await this.page.waitForTimeout(100);
            const spinners = await this.spinners.all();
            const visibleSpinner =
                spinners.length === 0
                    ? []
                    : await Promise.all(
                          spinners.map(async (spinner) => {
                              if (await spinner.isVisible()) return 1;
                          })
                      );
            if (visibleSpinner.length === 0) break;
        }
    }

    /**
     * Scrolling page to the element
     * @param element : Locator
     */
    public async scrollToElement(element: Locator): Promise<void> {
        await element.scrollIntoViewIfNeeded();
    }

    /**
     * Clicks a link, opens a new tab, and returns the new page.
     *
     * @param link - Locator of the link to click.
     * @returns A promise resolving to the new page.
     */
    async clickLinkAndReturnNewTab(link: Locator): Promise<Page> {
        const pagePromise = this.page.context().waitForEvent('page');
        await link.click();
        const newPage = await pagePromise;
        await newPage.bringToFront();
        await newPage.waitForLoadState();
        await this.waitForSpinnersDetached();
        return newPage;
    }

    /**
     * Use this method when records in DB must be at time different from the previous action (DB record) time
     * @param startTime new Date() is the time from which wait for a new minute is started
     */
    async waitForNewMinuteStart(startTime = new Date()) {
        const startMinute = startTime.getMinutes();
        const currentMinute = new Date().getMinutes();
        if (currentMinute === startMinute) {
            await this.page.waitForTimeout((60 - new Date().getSeconds()) * 1000);
        }
    }

    /**
     * Use this method when time of action recorded in DB must be verified
     * @param secondsLeft is the time in seconds to wait for a new minute is started
     * (this time is usually enough to Save action is finished and DB record with time is created)
     */
    async waitForNewMinuteStartAtTheEndOfCurrent(secondsLeft = 10) {
        const currentSeconds = new Date().getSeconds();
        if (60 - currentSeconds <= secondsLeft) {
            await this.page.waitForTimeout((60 - currentSeconds) * 1000);
        }
    }

    /**
     * Wait for page is loaded for both networkidle and domcontentloaded
     */
    async waitForPageIsLoaded(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Wait for element to be clickable
     * @param element target element locator
     */
    async waitForElementToBeClickableByElement(element: Locator): Promise<void> {
        await element.waitFor({ timeout: 30000 });
    }

    /**
     * Use this method to find out whether target element becomes visible in the specified timeout.
     * @param element target element locator
     * @param timeout time slot for waiting of the isVisible status. By default is 5 seconds
     * @returns TRUE if there is such element on the page and it is visible. Otherwise, returns FALSE
     */
    public async isElementAlreadyVisible(element: Locator, timeout: number = 7000): Promise<boolean> {
        for (let i = 0; i < Math.floor(timeout / 100); i++) {
            await this.page.waitForTimeout(100);
            try {
                if (await element.isVisible()) {
                    return true;
                }
            } catch {
                // if target element doesn't have visibility status
                return (await element.count()) !== 0;
            }
        }
        return false;
    }

    /**
     * Usage: Intercepts the given link after actions on the front-end , example: use full link https://api.example.com/api/...
     * @param {string} urlValue - put url what need catch
     * @param {number} codeValue - status code from caught API Response
     * @returns
     */
    async catchResponse(urlValue, codeValue, milliseconds = 40000) {
        return await this.page.waitForResponse(
            (response) => response.url() === `${urlValue}` && response.status() === codeValue,
            { timeout: milliseconds }
        );
    }

    /**
     * Waits for a response that includes a specific URL and has a specific status code.
     * @param urlValue The URL value to check for inclusion in the response URL.
     * @param codeValue The status code to check for in the response.
     * @param milliseconds The maximum number of milliseconds to wait for the response. Default is 40000 milliseconds.
     * @returns A promise that resolves when the response is received.
     */
    async catchIncludesResponse(urlValue: string, codeValue: number, milliseconds: number = 40000): Promise<Response> {
        return await this.page.waitForResponse(
            (response) => response.url().includes(`${urlValue}`) && response.status() === codeValue,
            { timeout: milliseconds }
        );
    }
}
