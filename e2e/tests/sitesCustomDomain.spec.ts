import { test, chromium, Browser, BrowserContext, Page } from "@playwright/test"; 
import { AuthPage } from "../pages/authPage"; 
import { SitesPage } from "../pages/sitesPage"; 
import { Users, Sites } from "../utils/testData"; 

import * as fs from "fs";  
import { permaServerSite } from "../utils/secureData"; 

let browser: Browser; 
let context: BrowserContext; 
let page: Page; 


// Test Data
let serverName2: string = permaServerSite.server2;    

let siteName: string = Sites.siteName;  
let siteId: string = "";  
let phpVersion7_4: string = Sites.phpVersion7_4; 
let phpVersion8_0: string = Sites.phpVersion8_0; 
let phpVersion8_1: string = Sites.phpVersion8_1; 
let phpVersion8_2: string = Sites.phpVersion8_2; 


// BeforeAll hook to complete login
test.beforeAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { }); 

  // Launch browser, login, and save state
  browser = await chromium.launch(); 
  context = await browser.newContext(); 
  page = await context.newPage(); 

  const authPage = new AuthPage(page); 
  await authPage.userLogin(Users.userEmail, Users.userPassword); 
  console.log("Login successful!"); 
  
  await page.context().storageState({ path: 'state.json' }); 
});  



/**
 * @description 
 *    Test Suite for creating, validating, and deleting sites with @custom_domains on different PHP_versions : (7.4, 8.0, 8.1, 8.2)
 *    across different server configurations (Nginx and OpenLiteSpeed).
 *
 * @actions
 *  The following scenarios are covered in this suite:
 *    - Create a site with a custom domain on Nginx and OpenLiteSpeed
 *    - Validate the site creation
 *    - Delete the site after validation
 *
 * The tests ensure that the sites are created and removed correctly, and that the different PHP versions (7.4, 8.0, 8.1, 8.2) work
 * as expected with @Nginx and @OpenLiteSpeed servers.
 */

test.describe("Create, Validate and Delete Sites - Custom Domain", () => {
  
// ------------------ NGINX SERVER TESTS --------------------

  test("[SS023] createSiteCustomDomainNginx - php version: v7.4", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainNginx(serverName2, phpVersion7_4); 
    console.log(siteName, siteId); 
  }); 

  test("[SS024] validateSiteCustomDomainNginx - php version: v7.4", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS025] deleteSiteCustomDomainNginx - php version: v7.4", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS026] createSiteCustomDomainNginx - php version: v8.0", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.0', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainNginx(serverName2, phpVersion8_0); 
    console.log(siteName, siteId); 
  }); 

  test("[SS027] validateSiteCustomDomainNginx - php version: v8.0", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.0', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS028] deleteSiteCustomDomainNginx - php version: v8.0", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.0', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS029] createSiteCustomDomainNginx - php version: v8.1", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.1', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainNginx(serverName2, phpVersion8_1); 
    console.log(siteName, siteId); 
  }); 

  test("[SS030] validateSiteCustomDomainNginx - php version: v8.1", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS031] deleteSiteCustomDomainNginx - php version: v8.1", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS032] createSiteCustomDomainNginx - php version: v8.2", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.2', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainNginx(serverName2, phpVersion8_2); 
    console.log(siteName, siteId); 
  }); 

  test("[SS033] validateSiteCustomDomainNginx - php version: v8.2", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.2', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS034] deleteSiteCustomDomainNginx - php version: v8.2", { tag: ['@Sites', '@CustomDomain', '@Nginx', '@8.2', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

// ------------------ OPENLITESPEED SERVER TESTS --------------------

  test("[SS035] createSiteCustomDomainOls - php version: v7.4", { tag: ['@Sites', '@CustomDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainOls(serverName2, phpVersion7_4); 
    console.log(siteName, siteId); 
  }); 

  test("[SS036] validateSiteCustomDomainOls - php version: v7.4", { tag: ['@Sites', '@CustomDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS037] deleteSiteCustomDomainOls - php version: v7.4", { tag: ['@Sites', '@CustomDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  /**
   * @alert :
   *    OLS does not support PHP: v8.0 
   * 
   */
  test("[SS038] createSiteCustomDomainOls - php version: v8.0", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.0', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainOls(serverName2, phpVersion8_0); 
    console.log(siteName, siteId); 
  }); 

  test("[SS039] createSiteCustomDomainOls - php version: v8.1", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.1', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainOls(serverName2, phpVersion8_1); 
    console.log(siteName, siteId); 
  }); 

  test("[SS040] validateSiteCustomDomainOls - php version: v8.1", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS041] deleteSiteCustomDomainOls - php version: v8.1", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS042] createSiteCustomDomainOls - php version: v8.2", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.2', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteCustomDomainOls(serverName2, phpVersion8_2); 
    console.log(siteName, siteId); 
  }); 

  test("[SS043] validateSiteCustomDomainOls - php version: v8.2", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.2', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS044] deleteSiteCustomDomainOls - php version: v8.2", { tag: ['@Sites', '@CustomDomain', '@Ols', '@8.2', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

}); 

// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { }); 
  await browser.close(); 
}); 