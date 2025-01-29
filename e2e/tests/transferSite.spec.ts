import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { Users } from "../utils/testData";
import { permaServerSite } from "../utils/secureData";
import { TransferSitePage } from "../pages/transferSitePage";
import * as fs from "fs"; // Clear Cookie 
import { SitesPage } from "../pages/sitesPage";
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;

// Test Data
let siteName: string = "";
let siteId: string = "";


// BeforeAll hook to complete login
test.beforeAll(async () => {
    fs.writeFileSync('state.json', JSON.stringify({ cookies: [], origins: [] }));

    // Launch browser, login, and save state
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    await new AuthPage(page).userLogin(Users.userEmail, Users.userPassword);
    console.log("Login successful!");

    await page.context().storageState({ path: 'state.json' });

    savedData = testData.getData();
});



/**
 * @description
 *    Test Suite for transferring, validating, visiting, and deleting sites on Nginx and OpenLiteSpeed (OLS) servers.
 *
 * @actions
 *    The following scenarios are covered in this suite:
 *      Nginx Site:
 *      - Transfer an Nginx site to a different server
 *      - Validate the transferred Nginx site
 *      - Visit the transferred Nginx site
 *      - Delete the transferred Nginx site
 *      OLS Site:
 *      - Transfer an OLS site to a different server
 *      - Validate the transferred OLS site
 *      - Visit the transferred OLS site
 *      - Delete the transferred OLS site
 *
 * @servers
 *    The tests target the following server types:
 *      - Nginx
 *      - OpenLiteSpeed (OLS)
 *
 * These tests ensure smooth site transfer, validation, and cleanup for both server types.
 */


// Nginx Site
// Transfer Nginx Site
test.describe("Transfer, validate and visit Nginx site", () => {

    test("[TS001] Transfer Nginx Site", { tag: ['@Nginx', '@transferSite'] }, async () => {
        const transferSite = new TransferSitePage(page);
        [siteName, siteId] = await transferSite.transferSite(savedData.nginxSiteId2);
    });

    test("[TS002] validate Transferred Nginx Site", { tag: ['@Nginx', '@transferSite'] }, async () => {
        test.setTimeout(60 * 1000);
        const transferSite = new TransferSitePage(page);
        if (siteName) {
            await transferSite.validateTransferredSite(siteName);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[TS003] visit Transferred Nginx Site", { tag: ['@Nginx', '@transferSite'] }, async () => {
        test.setTimeout(60 * 1000);
        const transferSite = new TransferSitePage(page);
        if (siteName) {
            await transferSite.visitTransferredSite(siteName, permaServerSite.nginxSiteTitle, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[TS004] delete Transferred Nginx Site", { tag: ['@Nginx', '@transferSite'] }, async () => {
        test.setTimeout(60 * 1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});

// Open LiteSpeed (OLS) Site
// Clone Site to Different server- Ols to Ols
test.describe("Transfer, validate and visit OLS site", () => {

    test("[TS005] Transfer OLS Site", { tag: ['@Ols', '@transferSite'] }, async () => {
        const transferSite = new TransferSitePage(page);
        [siteName, siteId] = await transferSite.transferSite(savedData.olsSiteId2);
    });

    test("[TS006] validate Transferred OLS Site", { tag: ['@Ols', '@transferSite'] }, async () => {
        test.setTimeout(60 * 1000);
        const transferSite = new TransferSitePage(page);
        if (siteName) {
            await transferSite.validateTransferredSite(siteName);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[TS007] visit Transferred OLS Site", { tag: ['@Ols', '@transferSite'] }, async () => {
        test.setTimeout(60 * 1000);
        const transferSite = new TransferSitePage(page);
        if (siteName) {
            await transferSite.visitTransferredSite(siteName, permaServerSite.olsSiteTitle, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[TS008] delete Transferred OLS Site", { tag: ['@Nginx', '@transferSite'] }, async () => {
        test.setTimeout(60 * 1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});