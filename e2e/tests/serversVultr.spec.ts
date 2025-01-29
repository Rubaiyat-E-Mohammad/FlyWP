import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { Users, Sites, } from "../utils/testData";
import { SitesPage } from "../pages/sitesPage";
import { permaServerSite } from "../utils/secureData";

import * as fs from "fs"; // Clear Cookie

let browser: Browser;
let context: BrowserContext;
let page: Page;

/* ------------------------ Test-Data ------------------------ */
let serverName: string = "QA-Server-Vultr";
let currentTeamId: string = Users.currentTeamId;

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
  const serversPage = new ServersPage(page);
  // Get both serverId and currentTeamId
  currentTeamId = await serversPage.getCurrentTeamId();

});

/**
 * @details : Server Management Test Scenarios for Vultr Servers
 * 
 * @testCases : 
 *    1. [SC020] Create vultr Server
 *    2. [SC021] Validate vultr Server
 *    3. [SC022] Delete vultr Server
 */


test.describe("Servers: Vultr", () => {

  /* ------------------------ Servers Scenarios ------------------------ */
  test("[SC020] createServer: Vultr", { tag: ['@Server', '@Vultr', '@Slow-TEST'] }, async () => {
    test.setTimeout(720 * 1000); //6 minutes max Server-Create time
    const serversPage = new ServersPage(page);
    const serverId = (await serversPage.createServerVultr(serverName)).toString();

    console.log("Server ID: " + serverId);
  });

  test("[SC021] validateServer: Vultr", { tag: ['@Server', '@Vultr', '@Slow-TEST'] }, async () => {
    test.setTimeout(60 * 1000);
    const serversPage = new ServersPage(page);
    console.log(await serversPage.validateServerVultr(serverName));
  });

  test("[SC022] deleteServer: Vultr", { tag: ['@Server', '@Vultr', '@Slow-TEST'] }, async () => {
    test.setTimeout(60 * 1000);
    const serversPage = new ServersPage(page);
    console.log(await serversPage.deleteServerVultr(serverName));
  });

});


// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  // Clear cookies
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});