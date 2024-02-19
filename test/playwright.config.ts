import { defineConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests/specs',
    /* Maximum time one test can run for. */
    timeout: 60 * 1000,
    //Global Setup to run before all tests
    globalSetup: './global-setup',
    //Global Teardown to run after all tests
    // globalTeardown: `./global-teardown`,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Run tests in files in parallel */
    //fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : 1,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI
        ? [
              ['junit', { outputFile: 'junit-report/junit-report.xml', open: 'never' }],
              ['html', { open: 'never' }],
              ['allure-playwright'],
              ['list']
          ]
        : [
              ['list'],
              ['allure-playwright'],
              ['html', { open: 'never' }],
              [
                  'playwright-qase-reporter',
                  {
                      mode: 'testops',
                      apiToken: process.env.QASE_TOKEN,
                      projectCode: 'TODO',
                      runComplete: true,
                      sendScreenshot: true,
                      basePath: 'https://api.qase.io/v1',
                      logging: true,
                      uploadAttachments: true
                  }
              ]
          ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time to each action. */
        actionTimeout: 30 * 1000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.BASE_URL || 'http://localhost:5137',
        viewport: { width: 1920, height: 1080 },
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: process.env.CI ? 'on-first-retry' : 'on',
        screenshot: process.env.CI ? 'only-on-failure' : 'on',
        video: process.env.CI ? 'retain-on-failure' : 'on',

        /* Set the timezone for the browser context */
        //timezoneId: process.env.CI ? 'UTC' : process.env.TIMEZONE_ID || 'UTC',
        headless: process.env.CI ? true : false
    },

    /* Configure projects for major browsers */
    projects: [
        // {
        //     name: 'setup',
        //     use: {
        //         headless: true
        //     },
        //     testMatch: 'auth.setup.spec.ts'
        // },
        // {
        //     name: 'Chrome',
        //     // dependencies: ['setup'],
        //     use: {
        //         storageState: './tests/auth/defaultStorageState.json',
        //         channel: 'chrome'
        //     }
        // },
        {
            name: 'Chrome',
            // dependencies: ['setup'],
            use: {
                // Configure the browser to use.
                browserName: 'chromium',

                //Chrome Browser Config
                channel: 'chrome',

                //Browser height and width
                // viewport: { width: 1920, height: 1080 },
                ignoreHTTPSErrors: true,

                //Enable File Downloads in Chrome
                acceptDownloads: true,
                storageState: './tests/auth/defaultStorageState.json',

                //Slows down execution by ms
                launchOptions: {
                    args: [
                        '--start-maximized',
                        '--disable-web-security',
                        '--no-sandbox',
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--window-size=1900,1000',
                        '--allow-insecure-localhost',
                        '--ignore-certificate-error'
                    ],
                    slowMo: 50
                }
            }
        }
    ]

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
