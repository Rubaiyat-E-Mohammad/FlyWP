import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServerProvidersPage } from "../pages/serverProvidersPage";
import { ServerProvidersDo, ServerProvidersVultr, ServerProvidersAws, ServerProvidersAkamai, ServerProvidersHetzner } from "../utils/secureData";
import { Users } from "../utils/testData";
import * as fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;


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
});



/**
 * @description
 *    Test Suite for managing various server providers (DigitalOcean, Vultr, AWS, Akamai, Hetzner).
 * 
 * @details
 *    This suite covers adding, validating, and deleting server providers.
 *    Each provider has its own workflow and unique set of credentials required for testing.
 * 
 * @testCases
 *    - DigitalOcean:
 *      - [SP001] Add Server Provider
 *      - [SP002] Validate Server Provider
 *      - [SP003] Delete Server Provider
 *    - Vultr:
 *      - [SP004] Add Server Provider
 *      - [SP005] Validate Server Provider
 *      - [SP006] Delete Server Provider
 *    - AWS:
 *      - [SP007] Add Server Provider
 *      - [SP008] Validate Server Provider
 *      - [SP009] Delete Server Provider
 *    - Akamai:
 *      - [SP010] Add Server Provider
 *      - [SP011] Validate Server Provider
 *      - [SP012] Delete Server Provider
 *    - Hetzner:
 *      - [SP013] Add Server Provider
 *      - [SP014] Validate Server Provider
 *      - [SP015] Delete Server Provider
 * 
 * @cleanup
 *    Cookies and session data are cleared before and after all tests to maintain test integrity.
 */


// DigitalOcean Server Provider tests
test.describe("ServerProviders : DigitalOcean", () => {
  let serverProviderDoName: string = ServerProvidersDo.serverProviderDoName;
  let serverProviderDoApiToken: string = ServerProvidersDo.serverProviderDoApiToken;

  test("[SP001] addServerProvider: Digital Ocean", { tag: ['@ServerProvider', '@DO'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    serverProviderDoName = await serverProvidersPage.addServerProviderDigitalOcean(serverProviderDoName, serverProviderDoApiToken);
  });

  test("[SP002] validateServerProvider: Digital Ocean", { tag: ['@ServerProvider', '@DO'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.validateServerProviderDigitalOcean(serverProviderDoName);
  });

  test("[SP003] deleteServerProvider: Digital Ocean", { tag: ['@ServerProvider', '@DO'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.deleteServerProviderDigitalOcean(serverProviderDoName);
  });
});

// Hetzner Server Provider tests
test.describe("ServerProviders : Hetzner", () => {
  let serverProviderHetznerName: string = ServerProvidersHetzner.serverProviderHetznerName;
  let serverProviderHetznerApiToken: string = ServerProvidersHetzner.serverProviderHetznerApiToken;

  test("[SP013] addServerProvider: Hetzner", { tag: ['@ServerProvider', '@Hetzner'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    serverProviderHetznerName = await serverProvidersPage.addServerProviderHetzner(serverProviderHetznerName, serverProviderHetznerApiToken);
  });

  test("[SP014] validateServerProvider: Hetzner", { tag: ['@ServerProvider', '@Hetzner'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.validateServerProviderHetzner(serverProviderHetznerName);
  });

  test("[SP015] deleteServerProvider: Hetzner", { tag: ['@ServerProvider', '@Hetzner'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.deleteServerProviderHetzner(serverProviderHetznerName);
  });
});

// Vultr Server Provider tests
test.describe("ServerProviders : Vultr", () => {
  let serverProviderVultrName: string = ServerProvidersVultr.serverProviderVultrName;
  let serverProviderVultrApiToken: string = ServerProvidersVultr.serverProviderVultrApiToken;

  test("[SP004] addServerProvider: Vultr", { tag: ['@ServerProvider', '@Vultr'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    serverProviderVultrName = await serverProvidersPage.addServerProviderVultr(serverProviderVultrName, serverProviderVultrApiToken);
  });

  test("[SP005] validateServerProvider: Vultr", { tag: ['@ServerProvider', '@Vultr'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.validateServerProviderVultr(serverProviderVultrName);
  });

  test("[SP006] deleteServerProvider: Vultr", { tag: ['@ServerProvider', '@Vultr'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.deleteServerProviderVultr(serverProviderVultrName);
  });
});

// AWS Server Provider tests (currently skipped)
test.describe.skip("ServerProviders : AWS", () => {
  let serverProviderAwsName: string = ServerProvidersAws.serverProviderAwsName;
  let serverProviderAwsAccessKey: string = ServerProvidersAws.serverProviderAwsAccessKey;
  let serverProviderAwsSecretAccessKey: string = ServerProvidersAws.serverProviderAwsSecretAccessKey;

  test("[SP007] addServerProvider: AWS", { tag: ['@ServerProvider', '@AWS'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    serverProviderAwsName = await serverProvidersPage.addServerProviderAws(serverProviderAwsName, serverProviderAwsAccessKey, serverProviderAwsSecretAccessKey);
  });

  test("[SP008] validateServerProvider: AWS", { tag: ['@ServerProvider', '@AWS'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.validateServerProviderAWS(serverProviderAwsName);
  });

  test("[SP009] deleteServerProvider: AWS", { tag: ['@ServerProvider', '@AWS'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.deleteServerProviderAWS(serverProviderAwsName);
  });
});

// Akamai Server Provider tests (currently skipped)
test.describe.skip("ServerProviders : Akamai", () => {
  let serverProviderAkamaiName: string = ServerProvidersAkamai.serverProviderAkamaiName; // Set server name from testData
  let serverProviderAkamaiApiToken: string = ServerProvidersAkamai.serverProviderAkamaiApiToken;

  test("[SP010] addServerProvider: Akamai", { tag: ['@ServerProvider', '@Akamai'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    serverProviderAkamaiName = await serverProvidersPage.addServerProviderAkamai(serverProviderAkamaiName, serverProviderAkamaiApiToken);
  });

  test("[SP011] validateServerProvider: Akamai", { tag: ['@ServerProvider', '@Akamai'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.validateServerProviderAkamai(serverProviderAkamaiName);
  });

  test("[SP012] deletServerProvider: Akamai", { tag: ['@ServerProvider', '@Akamai'] }, async () => {
    test.setTimeout(60000);
    const serverProvidersPage = new ServerProvidersPage(page);
    await serverProvidersPage.validateServerProviderAkamai(serverProviderAkamaiName);
  });
});

// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  test.setTimeout(60000);
  fs.writeFileSync('state.json', JSON.stringify({ cookies: [], origins: [] }));
  await browser.close();
});