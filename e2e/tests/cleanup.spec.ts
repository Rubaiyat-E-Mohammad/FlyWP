import { Browser, BrowserContext, Page, test , chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { Users } from "../utils/testData";
import {permaServerSite} from "../utils/secureData";

import * as fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;

let currentTeamId: string = Users.currentTeamId;

// BeforeAll hook to complete login
test.beforeAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });


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

test.describe("Server Delete: Hetzner & Vultr", () => {

  test("[SC018] deleteServer: Hetzner", { tag: ['@Server', '@Hetzner', '@Slow-TEST'] }, async () => {
    const serversPage = new ServersPage(page);
    console.log(await serversPage.deleteServerHetzner(permaServerSite.server1));
  })

  test("[SC019] deleteServer: Hetzner2", { tag: ['@Server', '@Vultr', '@Slow-TEST'] }, async () => {
    const serversPage = new ServersPage(page);
    console.log(await serversPage.deleteServerHetzner(permaServerSite.server2));
  })


});


// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  // Clear cookies
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});