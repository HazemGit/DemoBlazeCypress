# Cypress E2E Test Suite - Demoblaze 

## Overview
This project is a Cypress E2E testing suite for the web application https://www.demoblaze.com using:
- Page Object Model (POM)
- Fixtures for test data
- Support for multi-languages and CI integration in the future
- Network intercepts
- Positive and negative login, purchase and essential shopping cart tests, created under a three days release tight deadline

## Prerequisites
- Node.js (20.x, 22.x, >=24.x)
- npm (>=10.1.0), yarn (>=1.22.22) or pnpm (>=8.x)

Full details on the system requirements and how to install are provided [in this link](https://docs.cypress.io/app/get-started/install-cypress#System-requirements). This README assumes the choice of npm from this point on.

## Cypress Installation
```bash
npm install cypress --save-dev
```

## Login to Demoblaze
Before running the tests if you want to use a different user account than mine, please make sure to sign up in Demoblaze and update /fixtures/users.json file with your credentials

## Running the Cypress test suite
Clone this Github repo to your local machine then open your terminal and change directory to where you cloned the project, e.g.:
```bash
cd ~/Dev/Cypress/Demoblaze
```
In your terminal, you have different options of running the test suite as follows:

### Open Launchpad (GUI)
```bash
npx cypress open
```
This will open the Cypress [Launchpad](https://docs.cypress.io/app/core-concepts/open-mode#Launchpad) and allow you to choose which browser to run against, changing options and which testing scenarios to run. This is called open mode and it is best for local development.

### Run in CLI Headless Mode
```bash
npx cypress run
```
This will run the whole test suite using the default configuration as per /cypress.config.js. You can see the test results in your terminal and also see screenshots of the failing ones under /cypress/screenshots folder.

### Environment config
You can override the base URL, for example to run against Demoblaze web application locally (provided you have that). Also handy when running in CI/CD using environment variable to override the default base url (https://www.demoblazex.com/)

```bash
CYPRESS_baseUrl=http://localhost:1234 npx cypress run
```
Notice that the environment variables names need to begin with **CYPRESS_**.

### Running a specific specs file
Run the command with **-spec** followed by the file name, e.g.:
```bash
npx cypress run --spec cypress/e2e/login.cy.js
```
### You can find all the available options in [this link](https://docs.cypress.io/app/references/command-line)

## Included Tests
Under the tight deadline of 3 days, I've done an exploratory testing, a quick risk based analysis for what the core functionality of an e-commerce application, and created the minimum E2E tests that I think the web application shouldn't be released if any of them fail. I've assumed that the current state of the web application is the desired state since there's no requirements documentation available, which is something I wouldn't do in a real life situation. Please see the notes at the end of the README on the existing and potential issues I've discovered in the web application.

### The test suite includes:
**Login tests:** 
- Positive: User can log in with valid credentials
- Negative: User cannot log in with wrong password and gets the correct error message
- Negative: User cannot log in with non-existing account and gets the correct error message

**Purchase tests**
- Positive: User is able to purchases multiple laptops, checking the process from beginning to end. Also checking the confirmation message at the end and the shopping cart is empty after making the purchase
- Positive: The product data is consistent between the homepage and product details page, including product name, description and price
- Positive: The product data is consistent between the product details and shopping cart pages, including product name and price
- Positive: The total price amount is consistent between the shopping cart and the place order pages
- Negative: User cannot purchase without entering a credit card number and gets the correct error message
- Negative: User cannot purchase without entering a name and gets the correct error message

**Shopping cart tests**
- Positive: Confirms that total price of the products is calculated correctly
- Positive: Confirms deleting products from the shopping cart works correctly

## Best Practices Used
### Page Object Model (POM)
When designing the testing framework, I've used POM design pattern and spent the longer time designing the page objects (found under /pages). This effort investment pays off on the long run insuring:
- Maintainability: Changes to UI elements are confined to their page classes. Updating DOM selectors if needed in the future is done in one place (the page object) without touching the tests logic
- Reusability: Page methods can be reused across multiple test cases, minimizing code duplication and follows the DRY principle.
- Readability: Test scripts focus on actions rather than technical implementation details. Someone who's not technical can follow the steps in the tests and check the business logic easily
- Structure: Organizes code, making it easier to manage large-scale automation projects. 

### Fixtures for reusable data
Data like user credentials and the data for valid and invalid users can be updated in one place under /fixtures.

### Localization ready
Although the current web application is currently only in English, it's common that the application supports multiple languages in the future. The test suite is built ready to be extended for that if ever needed. The strings used (e.g. checking for the correct alerts text) are not hardcoded in tests but rather specified in /fixtures/strings/en.json file. If in the future the application added support for another language - for example German - there will be no need to touch the existing tests. Rather make a copy of en.json to de.json, replace the English strings with the German ones, change `lang` variable in the configuration file /cypress.config.js to `de` and the tests will adapt to any new languages automatically, utilizing Cypress command I've added in /commands.js and how the tests were designed. That is also handy if the strings changed in the current english string (common in applications), since there's one place to updates. For those reasons, I've also avoided finding any elements by text, while designing my selectors in the page objects.

### Tests neither depend on specific data nor other tests 
Tests will not break, if the data in the web application was changed as long as there are some products (the tests focus on laptops). Also the tests don't depend on each others, rather every test runs independently in not necessarily in any specific order. That limits flaky tests and follows the test design best practices.

### Network intercepts
A major reason for test instability is API calls that take a longer time to execute than expected. To eliminate the this, I've used `cy.intercept()` for those calls and waited for the responses using a longer timeout interval. That interval can also be updated in slower environments by updating the value of `longCommandsTimeout` in cypress.config.js.

## Important notes on Demoblaze
As mentioned above, I've created the tests based on the current web application state which is OK for the sake of a demo, but in real life, the requirements and the stories should be the sources of truth for what to expect. Those issues I've spotted while doing exploratory testing and writing the tests and in real life scenario, I would discuss those with the team before/while writing the tests:

- There's a bug in the purchase confirmation dialogue: The purchase data shows the previous month rather than the current one (Could be because it was missed that in Javascript, the months are 0 based in getMonth() method). This bug causes the `Purchases multiple laptops beginning to end` test to fail (as it should). If you'd like to skip that check temporarily and make the test continues, please comment the last line in `PlaceOrderPage.assertPurchaseConfirmation(amount)`. I've also added comments in the code for that.
![Wrong month](./images/wrongmonth.png)
- There are country and city fields in the place order form but no street address. And also those fields are not mandatory. Where would those purchased items be delivered to? I would definitely discuss that with the team in a real life scenario.
- The web app allows purchasing without entering the month and year in the Place order form, which I assume for credit card expiry. The error message in the alert also mentions only the missing credit card number, so I assume it's by design. In most real life apps, credit card number is not enough without the card expiry data, so I would double check the requirements document and if needed, I would discuss with the team and add tests for checking those as well.
- The web application doesn't check credit card format while purchasing
- I've noticed that User can make a purchase without logging in, I went along with it when designing the tests but I would confirm that with the requirements and the team and add a test for that if needed, in a real life scenario.
- Some elements in the html file of the application are not the best, when it comes to what options for selectors I can write to locate them. Again, in real life scenario, I would talk to the developers to add better ones for those, eg. `id` or  `data-testid` attributes. There are also elements with repeated `id` attribute (e.g. the left side column categories links in the home page all have `id="itemc"` which makes the html invalid and I can't use those ids as selectors). I've tried to find the best available options in those cases, without depending on strings (will break with localization) or using fragile and slower XPath selectors. With the current test framework design, it's easy to update the selectors in one place on the top of the page object file, once they're enhanced in the application under test.
