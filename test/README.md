# Ballerine e2e tests applications

---

## Table of Contents

-   [Description](#description)
-   [Structure](#structure)
-   [Composition](#composition)
-   [Configuration](#configuration)
-   [Usage](#usage)
-   [Running setup](#running-setup)
-   [Test structure](#test-structure)
-   [Reports](#reports)

### Description

Single repository for tests automation of the CreditOnline project

-   [tests](https://github.com/ballerine-io/ballerine.git/tests) `repository - e2e tests`

### Structure

```console
├───allure-report
│	└───*.html,*.css,*.js,*.json,*.csv
├───allure-results
│	└───*.xml,*.json,*.png
├───playwright-report
│	└───*.html,*.css,*.js,*.json,*.csv
├───node_modules
└───test
    ├───pageFactory
    └───specs
        ├───modules
        │   └───07_systemControl
        │       ├───administrators
        │       └───*
        └───structure
            └───*
- .gitignore
- .eslintrc.json
- .prettierrc
- global-setup.ts
- global-teardown.ts
- LICENSE
- package.json
- package-lock.json
- playwright.config.ts
- readme.md
```

-   "allure-report" and "allure-results" it's folder contains results and reports of our tests runs
-   "playwright-report" it's folder contains results and reports of our tests runs
-   "node_modules" folder contains node.js modules needed to run tests
-   "resources" folder contains files that are needed to test some of the project's functions
-   "test" folder contains folders "pages" and "spec" in which are located: in "pages" there are pageFactory files in which all the repeated testing functions are placed, in "spec" there are structured tests themselves
-   ".gitignore" a file containing the names of files and folders that are excluded from uploading to github
-   ".eslintrc.json" a file containing the settings for the eslint code style checker
-   ".prettierrc" a file containing the settings for the prettier code style checker
-   "global-setup.ts" and "global-teardown.ts" a file containing the settings for the playwright test runner
-   "global-teardown.ts" a file containing the settings for the playwright test runner
-   "playwright.config.ts" a file containing the settings for the playwright test runner
-   "LICENSE" a file containing text of license of project
-   "package.json" the file contains all the basic data for the project, as well as the dependencies necessary to run the project and the test run commands
-   "package-lock.json" the file contains fixed project dependencies for their quick installation.
-   "readme.md" the file contains a description and brief documentation of the project

### Composition

-   [playwright](https://playwright.dev/docs/intro) `playwright`
-   [allure-report](https://docs.qameta.io/allure/) `allure-report`
-   [eslint](https://eslint.org/docs/user-guide/getting-started) `eslint`
-   [cross-env](https://www.npmjs.com/package/cross-env) `cross-env`
-   [prettier](https://prettier.io/docs/en/install.html) `prettier`
-   [husky](https://www.npmjs.com/package/husky) `husky`
-   [axios](https://www.npmjs.com/package/axios) `axios`
-   [qase](https://github.com/qase-tms/qase-javascript) `qase`

### Configuration

Config files contain settings to run tests with different parameters and settings in different browsers.
[Link](https://playwright.dev/docs/test-configuration#basic-configuration) to description config file.
If need to run tests in Chrome, you must use the config in the name of which the word chrome is present, similar to Firefox and Edge.
If you need a hidden mode without showing the browser, you must use a config containing the word headless.
You can set up a common config file for the entire project and separately set up other configs for firefox or for chrome,
the settings in additional configs override the settings in the main config, if there are any, or supplement them.
In the upper link, you can see template how to set up a config file

All test use config file, example you want to run tests in Chrome browser need use in cli

```console
./playwright.config.ts
```

### Usage

Before using the framework, you need to install a [node.js](https://nodejs.org/en/) version of at least 14
and install all the dependencies that are necessary for the full operation of the node.js.

> **WARNING**: Use only LTS version

Also, to create and support allure reports, we need to install [allure-report](https://docs.qameta.io/allure/#_installing_a_commandline) and [Java SE Development Kit](https://www.oracle.com/java/technologies/javase/javase8u211-later-archive-downloads.html)

Check allure and Java is installed

```console
allure --version
```

```console
java --version
```

Download the project from the [repository](https://github.com/ballerine-io/ballerine.git/tests) and open the project folder in the console
and run command "npm install" in console. Wait until all modules are installed.
Bove to folder "test" and run command "npm Install" in console. Wait until all tests are finished.

``console
cd test
npm install

````

After that we can run our tests, example of a simple login page test.

```console
npm run test
````

### Running setup

Scripts reduce the need for tools, hence reducing the number of configuration files
and other things that need to be kept track of. They are very versatile and also allow you to
automate many common tasks. Scripts that can be run to automate tasks in a project.

-   "test" - a simple example that shows how 1 test works is used as an example.
-   "test:headed" - this script runs tests in a visible browser
-   "test:headed:qase" - this script runs tests in a visible browser and sends test results to the qase
-   "test:html-report" - this script run report on the local server
-   "allure:clean" - this script deletes recursively folders with reports and results in allure-report
-   "allure:history" - this script copies run history and trend files for subsequent report generation in allure-report
-   "allure:serve" - this script starts the allure-report virtual server and generates a report in a temporary directory and opens the report page in the browser
-   "allure:generate" - this script generates an allure report for later viewing it in the browser or for deploying it to the gitlab page
-   "config" - this script, depending on the setting of the $TESTS_ENV variable, the script copies the environment settings for the subsequent launch of tests
-   "clean:node" - this script clears the folder with node_modules and also clears the npm cache and reinstall all modules specified in package.json dependencies

```console
"scripts": {
        "test": "npx playwright test",
        "test:headed": "npx playwright test --headed",
        "test:headed:qase": "export QASE_REPORT=1 && npx playwright test --headed",
        "test:html-report": "npx playwright show-report",
        "playwright:clean": "rm -rf playwright-report test-results",
        "test:debug": "npx playwright test --debug",
        "test:code-gen": "npx playwright codegen --output tests/generated.spec.ts",
        "lint": "npx eslint ./tests --fix --color",
        "prettier": "prettier --write --ignore-unknown ./tests",
        "allure:open": "allure open ./allure-report",
        "allure:clean": "rm -rf allure-results allure-report",
        "allure:history": "cp -R allure-report/history allure-results",
        "allure:serve": "npx allure serve allure-results",
        "allure:serve:hi": "npm run allure:history && npx allure serve allure-results",
        "allure:generate:hi": "npm run allure:history && npx allure generate allure-results --clean",
        "allure:generate": "npx allure generate allure-results --clean"
    }
```

Let's take a closer look at what the test launch command consists of.

```console
"test:headed:one": "npx playwright test --headed tests/example.spec.ts"
```

-   "test:headed" - This is the short name of the command (alias) run (npm run + command name)
-   "--headed" - this is a flag that indicates that the browser will be visible during the test run
-   "tests/example.spec.ts" - this is the path to the test file that we want to run

### Test structure

This description is called a specification (or, as they say in everyday life, "spec") and looks like this:

```console
test.describe('two tests', () => {
  test('one', async ({ page }) => {
    // ...
  });

  test('two', async ({ page }) => {
    // ...
  });
});
```

The specification has three main building blocks, which you can see in the example above:

```console
test.describe('two tests', () => {
```

Specifies what exactly we are describing, used to group it blocks. In this case, we are describing a function, "describe" can be nested.

```console
test('one', async ({ page }) => {
    // ...
  });
```

The name of the "test" block describes in human language what the function should do, followed by a test that checks this.

```console
expect(await page.title()).toBe('Example Domain');
```

The code inside "test", if the implementation is correct, should run without errors.
Various functions like assert.\* are used to check if a function does what it is supposed to do. So far,
we are only interested in one of them - assert.equal, which compares its first argument with the second
and throws an error if they are not equal.

<details>
<summary>More detailed information about the test and its structure in TestCase ...</summary>
<h3> What does a test look like what is a test case</h3>

Let's first look at how the documentation for the test case looks like. To begin with, I will give an example of a standard test case for a general understanding of how the test will pass

![testCase](https://i.imgur.com/ViYTYse.png)

<h4>Standard Fields of a Sample Test Case</h4>

There are certain standard fields that need to be considered while preparing a Test case.

<b><i>Test case ID:</b></i> Unique ID is required for each test case. Follow some conventions to indicate the types of the test. For Example, ‘TC_UI_1’ indicating ‘user interface test case #1’.

<b><i>Test priority (Low/Medium/High):</b></i> This is very useful during test execution. Test priorities for business rules and functional test cases can be medium or higher, whereas minor user interface cases can be of a low priority. Testing priorities should always be set by the reviewer.

<b><i>Module Name:</b></i> Mention the name of the main module or the sub-module.

<b><i>Test Designed By:</b></i> Name of the Tester.

<b><i>Test Designed Date:</b></i> Date when it was written.

<b><i>Test Executed By:</b></i> Name of the Tester who executed this test. To be filled only after test execution.

<b><i>Test Execution Date:</b></i> Date when the test was executed.

<b><i>Test Title/Name:</b></i> Test case title. For example, verify the login page with a valid username and password.

<b><i>Test Summary/Description:</b></i> Describe the test objective in brief.

<b><i>Pre-conditions:</b></i> Any prerequisite that must be fulfilled before the execution of this test case. List all the pre-conditions in order to execute this test case successfully.

<b><i>Dependencies:</b></i> Mention any dependencies on other test cases or test requirements.

<b><i>Test Steps:</b></i> List all the test execution steps in detail. Write test steps in the order in which they should be executed. Make sure to provide as many details as you can.

<b><i>Test Data:</b></i> Use of test data as an input for this test case. You can provide different data sets with exact values to be used as an input.

<b><i>Expected Result:</b></i> What should be the system output after test execution? Describe the expected result in detail including the message/error that should be displayed on the screen.

<b><i>Post-condition:</b></i> What should be the state of the system after executing this test case?

<b><i>Actual result:</b></i> The actual test result should be filled after test execution. Describe the system behavior after test execution.

<b><i>Status (Pass/Fail):</b></i> If the actual result is not as per the expected result, then mark this test as failed. Otherwise, update it as passed.

<b><i>Notes/Comments/Questions:</b></i> If there are any special conditions to support the above fields, which can’t be described above or if there are any questions related to expected or actual results then mention them here.

<h3>Here is a description of the login test case with data, now we will describe the same case in our autotests.</h3>

<details><summary>below test code</summary>

```javascript
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';

const mode = process.env.MODE;
const user = process.env.USER_NAME;
const password = process.env.USER_PASS;

//#region //Preparation
test.beforeEach(async ({ page }, testInfo) => {
    // Extend timeout for all tests running this hook by 30 seconds.
    testInfo.setTimeout(testInfo.timeout + 30000);
});
// or
test.beforeAll(async () => {
    // Set timeout for this hook.
    test.setTimeout(60000);
});
//#endregion
test.describe('Navigate to the main page', () => {
    test('has title', async ({ page }) => {
        await test.step('Open the page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Verify title of the page', async () => {
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/Playwright/);
        });
    });
});
```

</details>

At the beginning of the test file, we have imported dependencies and object pages that help us produce tests.

```console
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/dist/playwright';

const mode = process.env.MODE;
const user = process.env.USER_NAME;
const password = process.env.USER_PASS;
```

More about these lines, here we import data from the JASON file, one of them is "env.json" which contains the main settings for launching and they can change on demand, as well as "accounts.json" which contains data for the test, namely for our login test.

```console
import { LoginPage } from '../pageFactory/loginPage';
```

After the imported dependencies, there are selector constants (moved to the file header for more convenient test maintenance) and environment variables, for example
<b>process.env.USER_NAME</b> username it is passed in the command line when running the test <b>export USER_NAME='sample @ email.eu'</b>

```console
const mode = process.env.MODE;
const user = process.env.USER_NAME;
const password = process.env.USER_PASS;
```

Before the test, the name speaks for itself, this code prepares our instance for the test (in our case, it goes to the login page). The block consists of a function named <b>before</b> (executed before all tests, there is also beforeEach , it will be executed
before each "test") followed by a title that contains a brief description of the action, and inside curly braces the action itself.

```console
//#region //Preparation
test.beforeEach(async ({ page }, testInfo) => {
    // Extend timeout for all tests running this hook by 30 seconds.
    testInfo.setTimeout(testInfo.timeout + 30000);
});
// or
test.beforeAll(async () => {
    // Set timeout for this hook.
    test.setTimeout(60000);
});
//#endregion
```

Next comes the "describe" block, its name sounds like a description, this block combines several tests, the title gives a short description of what unites this block and also these blocks can be nested one into another, these blocks can also have inside themselves blocks of such a type as "beforeAll", "afterALL" and the like. Also, at the top of this block, we can place a function that applies only to this block for code refactoring and testing convenience.

The first descriptor block checks the default data from the page - this is either visible input fields, links and buttons, etc.

```console
test.describe('Navigate to the main page', () => {
    test('has title', async ({ page }) => {
        await page.goto('https://playwright.dev/');

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Playwright/);
    });
});
```

The following are two "test" blocks, these are our tests. Let's take a look at them.

The title of the first block contains a description of what this block will test. Steps, stories and futures can also be added to the allure report.

in our first test, we combined the test of two login fields in the login form, this is the username and password field
since we are using a function that checks the visibility of the field and its content , the function is passed the name of the field , its selector, and the text of the field to be checked

The second "test" block checks the box part for visibility and whether it is checked.
In our example the first line checks the checkbox is visible and expects "true" to return the test if returned "true" we had passed the test.
The second line checks if the checkbox is checked expected "false" respectively the test returns "false" and expected passed the test.

```console
    test('has title', async ({ page }) => {
        await page.goto('https://playwright.dev/');

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Playwright/);
    });
```

The second describe block contains functional tests, which we will now also analyze for a better understanding of how they work
We have a similar structure with the first block in which the describe block itself is located,
the functions that are necessary for the correct operation of this block and our tests, as well as the tests themselves in "test" blocks
We can also observe the function in which Allure or port steps are connected for the correct display of reports in the future.

```console
test.describe('Navigate to the main page', () => {
    test('has title', async ({ page }) => {
        await test.step('Open the page', async () => {
            await page.goto('https://playwright.dev/');
        });

        await test.step('Verify title of the page', async () => {
            // Expect a title "to contain" a substring.
            await expect(page).toHaveTitle(/Playwright/);
        });
    });
});
```

</details>

### Reports

**Why do we need reports at all?**

In what cases you may need to store a test report:

-   assessing the current quality of the project based on test coverage and getting answers to the questions: Is testing completed? Is the product ready for release? How fast does development converge to release?
-   obtaining statistics on the defect reproduction frequency;
-   evaluating the effectiveness of tests (how useful is the test and does it find defects?);
-   data exchange between teams, if the roles in the team are separated (for example, developers and testers);
-   stability of tests and functionality in the product (PASS/FAIL rate) over time.

In addition, test data can be used to continuously improve testing itself.
We use the Allure-report, it supports the following formats: JUnit. Extension for Jenkins CI.

**Configuration**

Configure the output directory in your wdio.conf.js file:

```console
export default defineConfig({
    // ...
    reporter: [['allure', {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: true,
    }]],
    // ...
}
```

-   "outputDir" defaults to ./allure-results. After a test run is complete, you will find that this directory has been populated with an .xml file for each spec, plus a number of .txt and .png files and other attachments.
-   "disableWebdriverStepsReporting" - optional parameter(false by default), in order to log only custom steps to the reporter.
-   "issueLinkTemplate" - optional parameter, in order to specify the issue link pattern. Reporter will replace {} placeholder with value specified in addIssue(value) call parameter. Example https: //example.org/issue/{}
-   "tmsLinkTemplate" - optional parameter, in order to specify the tms link pattern. Reporter will replace {} placeholder with value specified in addTestId(value) call parameter. Example https: //example.org/tms/{}
-   "disableWebdriverScreenshotsReporting" - optional parameter(false by default), in order to not attach screenshots to the reporter.
-   "useCucumberStepReporter" - optional parameter (false by default), set it to true in order to change the report hierarchy when using cucumber. Try it for yourself and see how it looks.
-   "disableMochaHooks" - optional parameter (false by default), set it to true in order to not fetch the before/after stacktrace/screenshot/result hooks into the Allure Reporter.
-   "addConsoleLogs" - optional parameter(false by default), set to true in order to attach console logs from step to the reporter.

**Supported Allure API**

-   label(name, value) - assign a custom label to test
-   link(featureName) – assign feature to test
-   story(storyName) – assign user story to test
-   epic(epicName) – assign epic to test
    link to documentation for more information [Allure API](https://www.npmjs.com/package/allure-playwright)

**Usage**

Allure Api can be accessed using:

```console
import { allure } from "allure-playwright";
```

Mocha example

```console
import { test, expect } from "@playwright/test";
import { allure } from "allure-playwright";

test("basic test", async ({ page }, testInfo) => {
  await allure.link("https://playwright.dev", "playwright-site"); // link with name
  await allure.issue("Issue Name", "https://github.com/allure-framework/allure-js/issues/352");
});
```

**Displaying the report**

The results can be consumed by any of the reporting tools offered by Allure. For example:

**_Command-line_**

Install the Allure command-line tool, and process the results directory:

```console
allure generate [allure_output_dir] && allure open
```

This will generate a report (by default in ./allure-report), and open it in your browser.

![](https://webdriver.io/assets/images/allure-bb6c9b036b07594235a5aca5aff5ac43.png)
