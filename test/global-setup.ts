import rimraf from 'rimraf';

/**
 * Performs global setup before running tests.
 * This function deletes the "allure-results" directory.
 * @returns A promise that resolves when the setup is complete.
 */
async function globalSetup(): Promise<void> {
    await new Promise((resolve) => {
        rimraf(`./allure-results`, resolve);
    });
}
export default globalSetup;
