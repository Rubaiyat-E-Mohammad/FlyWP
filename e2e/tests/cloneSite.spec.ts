import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { Users } from "../utils/testData";
import { permaServerSite } from "../utils/secureData";
import { CloneSitePage } from "../pages/cloneSitePage";
import * as fs from "fs"; // Clear Cookie 
import { SitesPage } from "../pages/sitesPage";
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;

let siteName: string = "";
let siteId: string = "";

// BeforeAll hook to complete login
test.beforeAll(async () => {
    // Initialize state file
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
 *  Test Suite for Cloning Sites between @Nginx and @OLS servers. (The numbering of the test cases )
 * 
 * @details
 *  This test suite covers the process of cloning a site between different server types (Nginx and OLS). 
 *  The following combinations are tested:
 *  - Clone from OLS to OLS
 *  - Clone from Nginx to Nginx
 *  - Clone from OLS to Nginx
 *  - Clone from Nginx to OLS
 *
 *  Each test scenario includes the following actions:
 *  - Clone a site to a different server
 *  - Validate the cloned site
 *  - Visit the cloned site
 *  - Delete the cloned site
 *
 * @setup
 *  - Before all tests, login and initialize the browser state.
 *  - Clear cookies and storage state to ensure a clean environment for all tests.
 *
 * @cleanup
 *  - After each test, delete the cloned site to maintain test integrity.
 *  - Reset cookies and storage state to ensure a clean environment for subsequent tests.
 */


// ------------------ OLS SERVER TESTS --------------------
/**
 * @site_type : OLS
 * 
 * @action : Clone Site- OLS to OLS
 * 
 */
test.describe("Clone Site - Ols to Ols", () => {

    test("[CNS009] cloneSite - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        const cloneSitePage = new CloneSitePage(page);
        [siteName, siteId] = await cloneSitePage.cloneSiteToOls(savedData.olsSiteId.toString());
    });

    test("[CNS010] validateClonedSite - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.validateClonedSite(siteName.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS0011] visitClonedSite - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.visitClonedSite(siteName.toString(), permaServerSite.olsSiteTitle, siteId.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS012] deleteClonedSite - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60*1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});

// ------------------ Nginx SERVER TESTS --------------------
/**
 * @site_type : Nginx
 * 
 * @action : Clone Site- Nginx to Nginx
 * 
 */
test.describe("Clone Site - Nginx to Nginx", () => {

    test("[CNS001] cloneSite - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        const cloneSitePage = new CloneSitePage(page);
        [siteName, siteId] = await cloneSitePage.cloneSiteToNginx(savedData.nginxSiteId.toString());
    });

    test("[CNS002] validateClonedSite - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.validateClonedSite(siteName.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS003] visitClonedSite - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.visitClonedSite(siteName.toString(), permaServerSite.nginxSiteTitle, siteId.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS004] deleteClonedSite - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60*1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});

// ------------------ OLS SERVER TESTS --------------------
/**
 * @site_type : OLS
 * 
 * @action : Clone Site- Ols to Nginx
 * 
 */
test.describe("Clone Site - Ols to Nginx", () => {

    test("[CNS013] cloneSite - Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        const cloneSitePage = new CloneSitePage(page);
        [siteName, siteId] = await cloneSitePage.cloneSiteToNginx(savedData.olsSiteId.toString());
    });

    test("[CNS014] validateClonedSite - Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.validateClonedSite(siteName.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS015] visitClonedSite > Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.visitClonedSite(siteName.toString(), permaServerSite.olsSiteTitle, siteId.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS016] deleteClonedSite - Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60*1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});

// ------------------ Nginx SERVER TESTS --------------------
/**
 * @site_type : Nginx
 * 
 * @action : Clone Site- Nginx to OLS
 * 
 */
test.describe("Clone Site - Nginx to OLS", () => {

    test("[CNS005] cloneSite - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        const cloneSitePage = new CloneSitePage(page);
        [siteName, siteId] = await cloneSitePage.cloneSiteToOls(savedData.nginxSiteId.toString());
    });

    test("[CNS006] validateClonedSite - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.validateClonedSite(siteName.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS007] visitClonedSite - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60*1000);
        const cloneSitePage = new CloneSitePage(page);
        if (siteName) {
            await cloneSitePage.visitClonedSite(siteName.toString(), permaServerSite.nginxSiteTitle, siteId.toString());
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNS008] deleteClonedSite - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60*1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});