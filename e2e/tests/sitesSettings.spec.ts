import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { SitesPage } from "../pages/sitesPage";
import { Users, Sites } from "../utils/testData";

import * as fs from "fs"; // Clear Cookie 
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;

/* ------------------------ Test-Data ------------------------ */
let nginxSiteId: string = "";
let olsSiteId: string = "";

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
  nginxSiteId = savedData.nginxSiteId;
  olsSiteId = savedData.olsSiteId;

});



test.describe("Sites Settings - NGINX: PHP Settings", () => {

  // ------------------------ Test-Data ------------------------
  let updatedPhpVersion: string = "8.2";
  let updatedMemoryLimit: string = "512";
  let updatedMaxExecutionTime: string = "120";
  let updatedMaxFileUploadLimit: string = "90";
  let updatedMaxFileUploadSize: string = "1200";
  let updatedMaxInputTime: string = "180";
  let updatedMaxInputVars: string = "1100";

  test("[SSPS001] changePHPSettings: PHP version ", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedPhpVersion = await sitesPage.changeSitePhpVersion(nginxSiteId, updatedPhpVersion);
  });

  test("[SSPS002] validateSite: PHP version", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSitePhpVersion(nginxSiteId, updatedPhpVersion);
  });

  test("[SSPS003] changePHPSettings: PHP Memory Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMemoryLimit = await sitesPage.changeSitePhpMemoryLimit(nginxSiteId, updatedMemoryLimit);
  });

  test("[SSPS004] validateSite: PHP Memory Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSitePhpMemoryLimit(nginxSiteId, updatedMemoryLimit);
  });

  test("[SSPS005] changePHPSettings: Max Execution Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxExecutionTime = await sitesPage.changeSiteMaxExecutionTime(nginxSiteId, updatedMaxExecutionTime);
  });

  test("[SSPS006] validateSite: Max Execution Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxExecutionTime(nginxSiteId, updatedMaxExecutionTime);
  });

  test("[SSPS007] changePHPSettings: Max File Upload Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxFileUploadLimit = await sitesPage.changeSiteMaxFileUploadLimit(nginxSiteId, updatedMaxFileUploadLimit);
  });

  test("[SSPS008] validateSite: Max File Upload Limit", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxFileUploadLimit(nginxSiteId, updatedMaxFileUploadLimit);
  });

  test("[SSPS009] changePHPSettings: Max File Upload Size", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxFileUploadSize = await sitesPage.changeSiteMaxFileUploadSize(nginxSiteId, updatedMaxFileUploadSize);
  });

  test("[SSPS0010] validateSite: Max File Upload Size", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxFileUploadSize(nginxSiteId, updatedMaxFileUploadSize);
  });

  test("[SSPS0011] changePHPSettings: Max Input Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxInputTime = await sitesPage.changeSiteMaxInputTime(nginxSiteId, updatedMaxInputTime);
  });

  test("[SSPS0012] validateSite: Max Input Time", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxInputTime(nginxSiteId, updatedMaxInputTime);
  });

  test("[SSPS0011] changePHPSettings: Max Input Vars", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxInputVars = await sitesPage.changeSiteMaxInputVars(nginxSiteId, updatedMaxInputVars);
  });

  test("[SSPS0012] validateSite: Max Input Vars", { tag: ['@Nginx_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxInputVars(nginxSiteId, updatedMaxInputVars);
  });



});


test.describe.skip("Sites Settings - OLS: PHP Settings", () => {

  // ------------------------ Test-Data ------------------------
  let updatedPhpVersion: string = "8.2";
  let updatedMemoryLimit: string = "512";
  let updatedMaxExecutionTime: string = "120";
  let updatedMaxFileUploadLimit: string = "90";
  let updatedMaxFileUploadSize: string = "1200";
  let updatedMaxInputTime: string = "180";
  let updatedMaxInputVars: string = "1100";

  test("[SSPS0013] changePHPSettings: PHP version ", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedPhpVersion = await sitesPage.changeSitePhpVersion(olsSiteId, updatedPhpVersion);
  });

  test("[SSPS0014] validateSite: PHP version", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSitePhpVersion(olsSiteId, updatedPhpVersion);
  });

  test("[SSPS0015] changePHPSettings: PHP Memory Limit", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMemoryLimit = await sitesPage.changeSitePhpMemoryLimit(olsSiteId, updatedMemoryLimit);
  });

  test("[SSPS0016] validateSite: PHP Memory Limit", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSitePhpMemoryLimit(olsSiteId, updatedMemoryLimit);
  });

  test("[SSPS0017] changePHPSettings: Max Execution Time", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxExecutionTime = await sitesPage.changeSiteMaxExecutionTime(olsSiteId, updatedMaxExecutionTime);
  });

  test("[SSPS0018] validateSite: Max Execution Time", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxExecutionTime(olsSiteId, updatedMaxExecutionTime);
  });

  test("[SSPS0019] changePHPSettings: Max File Upload Limit", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxFileUploadLimit = await sitesPage.changeSiteMaxFileUploadLimit(olsSiteId, updatedMaxFileUploadLimit);
  });

  test("[SSPS0020] validateSite: Max File Upload Limit", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxFileUploadLimit(olsSiteId, updatedMaxFileUploadLimit);
  });

  test("[SSPS0021] changePHPSettings: Max File Upload Size", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxFileUploadSize = await sitesPage.changeSiteMaxFileUploadSize(olsSiteId, updatedMaxFileUploadSize);
  });

  test("[SSPS0022] validateSite: Max File Upload Size", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxFileUploadSize(olsSiteId, updatedMaxFileUploadSize);
  });

  test("[SSPS0023] changePHPSettings: Max Input Time", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxInputTime = await sitesPage.changeSiteMaxInputTime(olsSiteId, updatedMaxInputTime);
  });

  test("[SSPS0024] validateSite: Max Input Time", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxInputTime(olsSiteId, updatedMaxInputTime);
  });

  test("[SSPS0025] changePHPSettings: Max Input Vars", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    updatedMaxInputVars = await sitesPage.changeSiteMaxInputVars(olsSiteId, updatedMaxInputVars);
  });

  test("[SSPS0026] validateSite: Max Input Vars", { tag: ['@OLS_Site', '@PHP_Settings',] }, async () => {
    const sitesPage = new SitesPage(page);
    await sitesPage.validateSiteMaxInputVars(olsSiteId, updatedMaxInputVars);
  });



});