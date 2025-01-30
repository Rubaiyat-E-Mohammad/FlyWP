import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { SitesPage } from "../pages/sitesPage";
import { Users, Sites } from "../utils/testData";
import { permaServerSite } from "../utils/secureData";

import * as fs from "fs"; // Clear Cookie 
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;

/* ------------------------ Test-Data ------------------------ */
let siteId: string = "";

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
  siteId = savedData.nginxSiteId;

});



test.describe("Sites Settings -  NGINX", () => {

  // ------------------------ Test-Data ------------------------
  let updatedPhpVersion: string = "8.2";
  let updatedMemoryLimit: string = "512";
  let updatedMaxExecutionTime: string = "120";
  let updatedMaxFileUploadLimit: string = "90";
  let updatedMaxFileUploadSize: string = "1200";
  let updatedMaxInputTime: string = "180";
  let updatedMaxInputVars: string = "1100";

  test("[SSPS001] changePHPSettings: PHP version", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedPhpVersion = await sitesPage.changeSitePhpVersion(siteId, updatedPhpVersion);
  });

  test("[SSPS002] validateSite: PHP version", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSitePhpVersion(siteId, updatedPhpVersion);
  });

  test("[SSPS003] changePHPSettings: PHP Memory Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMemoryLimit = await sitesPage.changeSitePhpMemoryLimit(siteId, updatedMemoryLimit);
  });

  test("[SSPS004] validateSite: PHP Memory Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSitePhpMemoryLimit(siteId, updatedMemoryLimit);
  });

  test("[SSPS005] changePHPSettings: Max Execution Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxExecutionTime = await sitesPage.changeSiteMaxExecutionTime(siteId, updatedMaxExecutionTime);
  });

  test("[SSPS006] validateSite: Max Execution Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxExecutionTime(siteId, updatedMaxExecutionTime);
  });

  test("[SSPS007] changePHPSettings: Max File Upload Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxFileUploadLimit = await sitesPage.changeSiteMaxFileUploadLimit(siteId, updatedMaxFileUploadLimit);
  });

  test("[SSPS008] validateSite: Max File Upload Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxFileUploadLimit(siteId, updatedMaxFileUploadLimit);
  });

  test("[SSPS009] changePHPSettings: Max File Upload Size", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxFileUploadSize = await sitesPage.changeSiteMaxFileUploadSize(siteId, updatedMaxFileUploadSize);
  });

  test("[SSPS0010] validateSite: Max File Upload Size", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxFileUploadSize(siteId, updatedMaxFileUploadSize);
  });

  test("[SSPS0011] changePHPSettings: Max Input Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxInputTime = await sitesPage.changeSiteMaxInputTime(siteId, updatedMaxInputTime);
  });

  test("[SSPS0012] validateSite: Max Input Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxInputTime(siteId, updatedMaxInputTime);
  });

  test("[SSPS0011] changePHPSettings: Max Input Vars", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxInputVars = await sitesPage.changeSiteMaxInputVars(siteId, updatedMaxInputVars);
  });

  test("[SSPS0012] validateSite: Max Input Vars", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxInputVars(siteId, updatedMaxInputVars);
  });



});

