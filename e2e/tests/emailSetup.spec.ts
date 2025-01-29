import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { Users } from "../utils/testData";
import * as fs from "fs"; // Clear Cookie 
import { EmailSetupPage } from "../pages/emailSetupPage";
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;


// BeforeAll hook to complete login
test.beforeAll(async () => {
    fs.writeFileSync('state.json', JSON.stringify({ cookies: [], origins: [] }));

    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    await new AuthPage(page).userLogin(Users.userEmail, Users.userPassword);
    console.log("Login successful!");

    await page.context().storageState({ path: 'state.json' });
    savedData = testData.getData();
});


/**
 * Test suite for Email Setup @Custom_SMTP functionality on Perma-Site @Nginx and @OLS servers.
 * The tests cover connecting, validating, sending a test email, updating, and removing email settings.
 * It runs tests for both the Nginx and Ols server types.
 * 
 * The following actions are tested:
 * - Connect to email @Custom_SMTP
 * - Validate email connection
 * - Send a test email
 * - Update email settings
 * - Remove email settings
 *
 * This test suite runs after logging into the system and clearing the cookies after the tests are completed.
 */



test.describe("Email Setup (Custom-SMTP) - Nginx", () => {
    test("[ES001] connectEmail - Perma-Site: Nginx > CustomEmail", { tag: ['@Email', '@Nginx'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.connectEmail(savedData.nginxSiteId.toString());
    });

    test("[ES002] validateConnectEmail - Perma-Site: Nginx > CustomEmail", { tag: ['@Email', '@Nginx'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.validateEmailSetup(savedData.nginxSiteId.toString());
    });

    test("[ES003] sendTestEmail - Perma-Site: Nginx > CustomEmail", { tag: ['@Email', '@Nginx'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.sendEmail(savedData.nginxSiteId.toString());
    });

    test("[ES004] updateEmail - Perma-Site: Nginx > CustomEmail", { tag: ['@Email', '@Nginx'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.updateEmail(savedData.nginxSiteId.toString());
    });

    test("[ES005] removeEmail - Perma-Site: Nginx > CustomEmail", { tag: ['@Email', '@Nginx'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.removeEmail(savedData.nginxSiteId.toString());
    });
});

test.describe("Email Setup (Custom-SMTP) - Ols", () => {
    test("[ES006] connectEmail - Perma-Site: Ols > CustomEmail", { tag: ['@Email', '@OLS'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.connectEmail(savedData.olsSiteId.toString());
    });

    test("[ES007] validateConnectEmail - Perma-Site: Ols > CustomEmail", { tag: ['@Email', '@OLS'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.validateEmailSetup(savedData.olsSiteId.toString());
    });

    test("[ES008] sendTestEmail - Perma-Site: Ols > CustomEmail", { tag: ['@Email', '@OLS'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.sendEmail(savedData.olsSiteId.toString());
    });

    test("[ES009] updateEmail - Perma-Site: Ols > CustomEmail", { tag: ['@Email', '@OLS'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.updateEmail(savedData.olsSiteId.toString());
    });

    test("[ES010] removeEmail - Perma-Site: Ols > CustomEmail", { tag: ['@Email', '@OLS'] }, async () => {
        const emailSetupPage = new EmailSetupPage(page);
        await emailSetupPage.removeEmail(savedData.olsSiteId.toString());
    });
});

// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
    fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
    await browser.close();
});