import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { Users, Sites, } from "../utils/testData";
import { SitesPage } from "../pages/sitesPage";
import { permaServerSite } from "../utils/secureData";
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

import * as fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;

/* ------------------------ Test-Data ------------------------ */
let serverName: string = permaServerSite.server2;
let currentTeamId: string = Users.currentTeamId;

let siteName: string | number = Sites.siteName;
let siteId: string | number = "";
let phpVersion7_4: string = Sites.phpVersion7_4;

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

/* ------- Servers: DO-Partnered, DO, AWS, Vultr, Akamai, Hetzner, Custom ------- */
/* ------- Servers: DO-Custom ------- */
test.describe("Servers: Hetzner", () => {

  /* ------------------------ Servers Scenarios ------------------------ */
  test("[SC016] createServer: Hetzner2", { tag: ['@Server', '@Hetzner', '@Slow-TEST'] }, async () => {
    test.setTimeout(720 * 1000); 
    const serversPage = new ServersPage(page);
    const serverId = (await serversPage.createServerHetzner(serverName)).toString();

    testData.saveData({
      serverId2: serverId.toString()
    });
    console.log("Server ID: " + serverId);
  });

  test("[SC017] validateServer: Hetzner2", { tag: ['@Server', '@Hetzner', '@Slow-TEST'] }, async () => {
    test.setTimeout(60 * 1000);
    const serversPage = new ServersPage(page);
    console.log(await serversPage.validateServerHetzner(serverName));
  });

  test("[SS049] createPermaSite3", { tag: ['@PermaSite', '@FreeDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page);
    [siteName, siteId] = await sitesPage.createSiteFreeDomainNginx(serverName, phpVersion7_4);
    // Save the site ID
    testData.saveData({
      nginxSiteId2: siteId.toString()
    });
    console.log(siteName, siteId);
  });

  test("[SS050] validatePermaSite3", { tag: ['@PermaSite', '@FreeDomain', '@Nginx', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60 * 1000);
    const sitesPage = new SitesPage(page);

    await sitesPage.validateSite(siteName, siteId);
  });

  test("[SS051] createPermaSite4", { tag: ['@PermaSite', '@FreeDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    const sitesPage = new SitesPage(page);
    [siteName, siteId] = await sitesPage.createSiteFreeDomainOls(serverName, phpVersion7_4);

    testData.saveData({
      olsSiteId2: siteId.toString()
    });
    console.log(siteName, siteId);
  });

  test("[SS052] validatePermaSite4", { tag: ['@PermaSite', '@FreeDomain', '@Ols', '@7.4', '@Slow-TEST'] }, async () => {
    test.setTimeout(60 * 1000);
    const sitesPage = new SitesPage(page);

    await sitesPage.validateSite(siteName, siteId);
  });


});


// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  // Clear cookies
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});