import { test, chromium, Browser, BrowserContext, Page } from "@playwright/test"; 
import { AuthPage } from "../pages/authPage";  
import { SitesPage } from "../pages/sitesPage"; 
import { Users, Sites } from "../utils/testData"; 

import * as fs from "fs";  
import { permaServerSite } from "../utils/secureData"; 

let browser: Browser; 
let context: BrowserContext; 
let page: Page; 

let serverName: string = permaServerSite.server1;  

let siteName: string = Sites.siteName;  
let siteId: string = "";  
let phpVersion7_4: string = Sites.phpVersion7_4; 
let phpVersion8_0: string = Sites.phpVersion8_0; 
let phpVersion8_1: string = Sites.phpVersion8_1; 
let phpVersion8_2: string = Sites.phpVersion8_2; 


// BeforeAll hook to complete login
test.beforeAll(async () => {
  // Clear cookies
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
 *    Test Suite for creating, validating, and deleting sites with @free_domains across different PHP versions (7.4, 8.0, 8.1, 8.2)
 *    on Nginx and OpenLiteSpeed servers.
 *
 * @actions
 *  The following scenarios are covered in this suite:
 *    - Create a site with a free domain on Nginx and OpenLiteSpeed
 *    - Validate the site creation
 *    - Delete the site after validation
 *
 * The tests ensure that the sites are created and removed correctly, and that the different PHP versions (7.4, 8.0, 8.1, 8.2) work
 * as expected with @Nginx and @OpenLiteSpeed servers.
 */

test.describe("Create, Validate and Delete Sites - Free Domain", () => {
  
// ------------------ NGINX SERVER TESTS --------------------

test("[SS001] createSiteFreeDomainNginx - php version: v7.4", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainNginx(serverName, phpVersion7_4); 
    console.log(siteName, siteId); 
  }); 

  test("[SS002] validateSiteFreeDomainNginx - php version: v7.4", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS003] deleteSiteFreeDomainNginx - php version: v7.4", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS004] createSiteFreeDomainNginx - php version: v8.0", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.0', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainNginx(serverName, phpVersion8_0); 
    console.log(siteName, siteId); 
  }); 

  test("[SS005] validateSiteFreeDomainNginx - php version: v8.0", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.0', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS006] deleteSiteFreeDomainNginx - php version: v8.0", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.0', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS007] createSiteFreeDomainNginx - php version: v8.1", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.1', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainNginx(serverName, phpVersion8_1); 
    console.log(siteName, siteId); 
  }); 

  test("[SS008] validateSiteFreeDomainNginx - php version: v8.1", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS009] deleteSiteFreeDomainNginx - php version: v8.1", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  test("[SS010] createSiteFreeDomainNginx - php version: v8.2", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.2', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainNginx(serverName, phpVersion8_2); 
    console.log(siteName, siteId); 
  }); 

  test("[SS011] validateSiteFreeDomainNginx - php version: v8.2", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.2', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS012] deleteSiteFreeDomainNginx - php version: v8.2", { tag: ['@Sites', '@FreeDomain', '@Nginx', '@8.2', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  // ------------------ OPENLITESPEED SERVER TESTS --------------------

  test("[SS013] createSiteFreeDomainOls - php version: v7.4", { tag: ['@Sites', '@FreeDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainOls(serverName, phpVersion7_4); 
    console.log(siteName, siteId); 
  }); 

  test("[SS014] validateSiteFreeDomainOls - php version: v7.4", { tag: ['@Sites', '@FreeDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS015] deleteSiteFreeDomainOls - php version: v7.4", { tag: ['@Sites', '@FreeDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 

  /**
   * @alert :
   *    OLS does not support PHP: v8.0 
   * 
   */
  test("[SS016] createSiteFreeDomainOls - php version: v8.0", { tag: ['@Sites', '@FreeDomain', '@Ols', '@8.0', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainOls(serverName, phpVersion8_0); 
    console.log(siteName, siteId); 
  }); 

  test("[SS017] createSiteFreeDomainOls - php version: v8.1", { tag: ['@Sites', '@FreeDomain', '@Ols', '@8.1', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page); 
    [siteName, siteId] = await sitesPage.createSiteFreeDomainOls(serverName, phpVersion8_1); 
    console.log(siteName, siteId); 
  }); 

  test("[SS018] validateSiteFreeDomainOls - php version: v8.1", { tag: ['@Sites', '@FreeDomain', '@Ols', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.validateSite(siteName, siteId); 
  }); 

  test("[SS019] deleteSiteFreeDomainOls - php version: v8.1", { tag: ['@Sites', '@FreeDomain', '@Ols', '@8.1', '@Slow-TEST'] }, async () => {
    test.setTimeout(60*1000); 
    const sitesPage = new SitesPage(page); 
    await sitesPage.deleteSite(siteName, siteId); 
  }); 
  
  
  // AfterAll hook to clear cookies after all tests have completed
  test.afterAll(async () => {
    fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { }); 
    await browser.close(); 
  }); 

});