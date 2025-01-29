import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { Users } from "../utils/testData";
import { permaServerSite } from "../utils/secureData";
import { CloneSiteDifferentServerPage } from "../pages/cloneSiteDifferentServerPage";
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
 *  Test Suite for cloning sites to different servers (Nginx and OLS).
 * 
 * @details
 *  Test suite for cloning sites to different servers (Nginx and OLS).
 *  - It tests the cloning process, validation, site visit, and deletion on both Nginx and OLS servers.
 *  
 * The following server combinations are tested:
 *  - Clone from Nginx to Nginx
 *  - Clone from OLS to OLS
 *  - Clone from Nginx to OLS
 *  - Clone from OLS to Nginx
 *
 * The test suite includes the following actions:
 *  - Clone a site to a different server
 *  - Validate the cloned site
 *  - Visit the cloned site
 *  - Delete the cloned site
 *
 * @cleanup
 *    Cookies and session data are cleared before and after all tests to maintain test integrity.
 */


// ------------------ Nginx SERVER TESTS --------------------
/**
 * @site_type : Nginx
 * 
 * @action : Clone Site to Different server- Nginx to Nginx
 * 
 */
test.describe("Clone Site to Different server- Nginx to Nginx", () => {

    test("[CNSDS001] cloneSiteToDifferentServer - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx', '@CloneSiteDifferentServer'] }, async () => {
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        [siteName, siteId] = await cloneSiteDifferentServer.cloneSiteToNginx(savedData.nginxSiteId2);
    });

    test("[CNSDS002] validateClonedSiteToDifferentServer - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx', '@CloneSiteDifferentServer'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.validateClonedSite(siteName);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS003] visitClonedSiteToDifferentServer - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx', '@CloneSiteDifferentServer'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.visitClonedSite(siteName, permaServerSite.nginxSiteTitle, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS004] deleteClonedSiteToDifferentServer - Perma-Site: Nginx to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60 * 1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
})

// ------------------ OLS SERVER TESTS --------------------
/**
 * @site_type : Ols
 * 
 * @action : Clone Site to Different server- Ols to Ols
 */
test.describe("Clone Site to Different server- Ols to Ols", () => {

    test("[CNSDS009] cloneSiteToDifferentServer - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        [siteName, siteId] = await cloneSiteDifferentServer.cloneSiteToOls(savedData.olsSiteId2);
    });

    test("[CNSDS010] validateClonedSiteToDifferentServer - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.validateClonedSite(siteName);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS011] visitClonedSiteToDifferentServer - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.visitClonedSite(siteName, permaServerSite.olsSiteTitle, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS012] deleteClonedSiteToDifferentServer - Perma-Site: Ols to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60 * 1000);
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
 * @action : Clone Site to Different server- Nginx to Ols
 */
test.describe("Clone Site to Different server- Nginx to OLS", () => {

    test("[CNSDS005] cloneSiteToDifferentServer - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        [siteName, siteId] = await cloneSiteDifferentServer.cloneSiteToOls(savedData.nginxSiteId2);
    });

    test("[CNSDS006] validateClonedSiteToDifferentServer - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.validateClonedSite(siteName);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS007] visitClonedSiteToDifferentServer - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.visitClonedSite(siteName, permaServerSite.nginxSiteTitle, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS008] deleteClonedSiteToDifferentServer - Perma-Site: Nginx to Ols", { tag: ['@CloneSite', '@Ols'] }, async () => {
        test.setTimeout(60 * 1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
})


// ------------------ OLS SERVER TESTS --------------------
/**
 * @site_type : Ols
 * 
 * @action : Clone Site to Different server- Ols to Nginx
 */
test.describe("Clone Site to Different server- Ols to Nginx", () => {

    test("[CNSDS013] cloneSiteToDifferentServer - Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx', '@CloneSiteDifferentServer'] }, async () => {
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        [siteName, siteId] = await cloneSiteDifferentServer.cloneSiteToNginx(savedData.olsSiteId2);
    });

    test("[CNSDS014] validateClonedSiteToDifferentServer - Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx', '@CloneSiteDifferentServer'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.validateClonedSite(siteName);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS015] visitCreatedCloneSiteDifferentServer > Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx', '@CloneSiteDifferentServer'] }, async () => {
        test.setTimeout(60 * 1000);
        const cloneSiteDifferentServer = new CloneSiteDifferentServerPage(page);
        if (siteName) {
            await cloneSiteDifferentServer.visitClonedSite(siteName, permaServerSite.olsSiteTitle, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });

    test("[CNSDS016] deleteClonedSiteToDifferentServer - Perma-Site: Ols to Nginx", { tag: ['@CloneSite', '@Nginx'] }, async () => {
        test.setTimeout(60 * 1000);
        const sitesPage = new SitesPage(page);
        if (siteName) {
            await sitesPage.deleteSite(siteName, siteId);
        } else {
            throw new Error("siteName is null");
        }
    });
});