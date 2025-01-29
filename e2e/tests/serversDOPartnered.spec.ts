import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { Users, Servers } from "../utils/testData";
import * as fs from "fs"; // Clear Cookie

let browser: Browser;
let context: BrowserContext;
let page: Page;


// Test Data
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
  
  // Get Current Team ID
  const serversPage = new ServersPage(page);
  currentTeamId = await serversPage.getCurrentTeamId();
});



/**
 * @details : Server Management Test Scenarios for DigitalOcean Partnered Servers
 * 
 * @testCases : 
 *    1. [SC001] Create DigitalOcean Partnered Server
 *    2. [SC002] Validate DigitalOcean Partnered Server
 *    3. [SC003] Update DigitalOcean Partnered Server
 *    4. [SC004] Validate Updated DigitalOcean Partnered Server
 *    5. [SC005] Delete DigitalOcean Partnered Server
 */


test.describe("Servers : Digital-Ocean Partnered", () => {
  // Test Data
  let serverName: string = Servers.serverName; // Set server name from testData
  let updatedServerName: string = Servers.updatedServerName; // Set server name from testData
  let serverId: string = Users.serverId; // Set Server Team ID

  /* ------------------------ Servers Scenarios ------------------------ */
  test("[SC001] createServer: Digital Ocean (@Partnered)", { tag: ['@Server', '@DigitalOcean-Partnered', '@Slow-TEST'] }, async () => {
    test.setTimeout(1200 * 1000); //10 minutes max Server-Create time
    const serversPage = new ServersPage(page);
    serverName = await serversPage.createServerDigitalOceanPartnered(serverName);
    console.log("Server Name: " + serverName);
  });

  test("[SC002] validateServer: Digital Ocean (@Partnered)", { tag: ['@Server', '@DigitalOcean-Partnered'] }, async () => {
    const serversPage = new ServersPage(page);
    console.log(await serversPage.validateServerDigitalOceanPartered(serverName));
  });

  test("[SC003] updateServer: Digital Ocean (@Partnered)", { tag: ['@Server', '@DigitalOcean-Partnered'] }, async () => {
    const serversPage = new ServersPage(page);
    updatedServerName = await serversPage.updateServerDigitalOceanPartered(serverName);

    Servers.updatedServerName = updatedServerName;
    console.log("Updated Server Name: " + updatedServerName);
  });

  test("[SC004] validateUpdatedServer: Digital Ocean (@Partnered)", { tag: ['@Server', '@DigitalOcean-Partnered'] }, async () => {
    const serversPage = new ServersPage(page);
    console.log(await serversPage.validateUpdatedServerDigitalOceanPartered(updatedServerName));
  });

  test("[SC005] deleteServer: Digital Ocean (@Partnered)", { tag: ['@Server', '@DigitalOcean-Partnered'] }, async () => {
    const serversPage = new ServersPage(page);
    console.log(await serversPage.deleteServerDigitalOceanPartered(updatedServerName));
  });

});

// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});