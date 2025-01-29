import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { ServerProvidersPage } from "../pages/serverProvidersPage";
import { Users, Servers } from "../utils/testData";
import { ServerProvidersDo } from "../utils/secureData";
import * as fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;

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

  // Get the current team ID
  const serversPage = new ServersPage(page);
  currentTeamId = await serversPage.getCurrentTeamId();
});


/**
 * @description
 *    Test Suite for managing DigitalOcean Custom Servers.
 * 
 * @details
 *    This suite covers the following server management actions for DigitalOcean:
 *    - Adding a DigitalOcean Server Provider
 *    - Creating a DigitalOcean Custom Server
 *    - Validating a DigitalOcean Custom Server
 *    - Updating a DigitalOcean Custom Server
 *    - Validating the updated DigitalOcean Custom Server
 *    - Deleting a DigitalOcean Custom Server
 *    - Validating the DigitalOcean Server Provider
 *    - Deleting the DigitalOcean Server Provider
 *
 * @testCases
 *    - [SC006] Add DigitalOcean Server Provider
 *    - [SC007] Create DigitalOcean Custom Server
 *    - [SC008] Validate DigitalOcean Custom Server
 *    - [SC009] Update DigitalOcean Custom Server
 *    - [SC010] Validate Updated DigitalOcean Custom Server
 *    - [SC011] Delete DigitalOcean Custom Server
 *    - [SC012] Validate DigitalOcean Server Provider
 *    - [SC013] Delete DigitalOcean Server Provider
 *
 * @cleanup
 *    Cookies and session data are cleared before and after all tests to maintain test integrity.
 */

test.describe("Servers: Digital-Ocean Custom", () => {
  let serverName: string = Servers.serverName;
  let updatedServerName: string = Servers.updatedServerName;
  let serverId: string = Users.serverId;

  let serverProviderDoName: string = ServerProvidersDo.serverProviderDoName;
  let serverProviderDoApiToken: string = ServerProvidersDo.serverProviderDoApiToken;

  test("[SC006] addServerProvider: Digital Ocean", { tag: ['@ServerProvider', '@DO-Custom'] }, async () => {
    const serverProvidersPage = new ServerProvidersPage(page);
    serverProviderDoName = await serverProvidersPage.addServerProviderDigitalOcean(serverProviderDoName, serverProviderDoApiToken);
    console.log("Server Provider Name: " + serverProviderDoName);
  });

  test("[SC007] createServer: Digital Ocean (@Custom)", { tag: ['@Server', '@DO-Custom', '@Slow-TEST'] }, async () => {
    test.setTimeout(1200 * 1000); 
    const serversPage = new ServersPage(page);
    serverName = await serversPage.createServerDigitalOceanCustom(serverName);
    console.log("Server Name: " + serverName);
  });

  test("[SC008] validateServer: Digital Ocean (@Custom)", { tag: ['@Server', '@DO-Custom'] }, async () => {
    test.setTimeout(60 * 1000);
    const serversPage = new ServersPage(page);
    console.log(await serversPage.validateServerDigitalOceanCustom(serverName));
  });

  test("[SC009] updateServer: Digital Ocean (@Custom)", { tag: ['@Server', '@DO-Custom'] }, async () => {
    test.setTimeout(120 * 1000);
    const serversPage = new ServersPage(page);
    updatedServerName = await serversPage.updateServerDigitalOceanCustom(serverName);
    Servers.updatedServerName = updatedServerName;
    console.log("Updated Server Name: " + updatedServerName);
  });

  test("[SC010] validateUpdatedServer: Digital Ocean (@Custom)", { tag: ['@Server', '@DO-Custom'] }, async () => {
    test.setTimeout(60 * 1000);
    const serversPage = new ServersPage(page);
    console.log(await serversPage.validateUpdatedServerDigitalOceanCustom(updatedServerName));
  });

  test("[SC011] deleteServer: Digital Ocean (@Custom)", { tag: ['@Server', '@DO-Custom'] }, async () => {
    test.setTimeout(60 * 1000);
    const serversPage = new ServersPage(page);
    console.log(await serversPage.deleteServerDigitalOceanCustom(updatedServerName));
  });

  test("[SC012] validateServerProvider: Digital Ocean", { tag: ['@ServerProvider', '@DO'] }, async () => {
    test.setTimeout(60 * 1000);
    const serverProvidersPage = new ServerProvidersPage(page);
    console.log(await serverProvidersPage.validateServerProviderDigitalOcean(serverProviderDoName));
  });

  test("[SC013] deleteServerProvider: Digital Ocean", { tag: ['@ServerProvider', '@DO'] }, async () => {
    test.setTimeout(60 * 1000);
    const serverProvidersPage = new ServerProvidersPage(page);
    console.log(await serverProvidersPage.deleteServerProviderDigitalOcean(serverProviderDoName));
  });
});


// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});