import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { BackupProvidersPage } from "../pages/backupProvidersPage";
import { Users } from "../utils/testData";
import * as fs from "fs"; // Clear Cookie 
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;

/* ------------------------ Test-Data ------------------------ */
let currentTeamId: string = Users.currentTeamId; // Set Server Team ID


// BeforeAll hook to complete login
test.beforeAll(async () => {
  // Initialize state file
  fs.writeFileSync('state.json', JSON.stringify({ cookies: [], origins: [] }));

  // Launch browser, login, and save state
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();

  await new AuthPage(page).userLogin(Users.userEmail, Users.userPassword);
  console.log("Login successful!");

  await page.context().storageState({ path: 'state.json' });
  const serversPage = new ServersPage(page);
  // Get both serverId and currentTeamId
  currentTeamId = await serversPage.getCurrentTeamId();

  savedData = testData.getData();
  //
});

/* ------- Custom S3 ------- */
test.describe("BackupProviders : Custom S3", () => {
  /* ------------------------ Secure-Data ------------------------ */
  let backupProviderCustomS3Name: string;

  /* ------------------------ Backup Providers ------------------------ */
  test("[BKP001] addBackupProvider: Custom S3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    backupProviderCustomS3Name = await backupProvidersPage.addBackupProviderCustomS3(currentTeamId);
    console.log(backupProviderCustomS3Name);
  });

  test("[BKP002] validateBackupProvider: Custom S3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateBackupProvider(backupProviderCustomS3Name, currentTeamId);
  });

  test("[BKP003] connectBackupProvider - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.connectBackupProvider(backupProviderCustomS3Name, savedData.nginxSiteId);
  })

  test("[BKP004] createManualBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.createManualBackup(savedData.nginxSiteId);
  });

  test("[BKP005] validateManualBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateManualBackup(savedData.nginxSiteId);
  });

  test("[BKP006] deleteManualBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteManualBackup(savedData.nginxSiteId);
  });

  test("[BKP007] deleteBackupProvider: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteBackupProvider(currentTeamId);
  });


});

/* ------- Restore Backup ------- */
test.describe.skip("Restore Backup : Custom S3", () => {
  /* ------------------------ Secure-Data ------------------------ */
  let backupProviderCustomS3Name: string; // Set server name from Secure Data

  /* ------------------------ Restore Backup ------------------------ */
  test("[BKR001] addBackupProvider: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    backupProviderCustomS3Name = await backupProvidersPage.addBackupProviderCustomS3(currentTeamId);
    console.log(backupProviderCustomS3Name);
  });

  test("[BKR002] validateBackupProvider: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateBackupProvider(backupProviderCustomS3Name, currentTeamId);
  });

  test("[BKR003] connectBackupProvider - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.connectBackupProvider(backupProviderCustomS3Name, savedData.olsSiteId);
  })

  test("[BKR004] createManualBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.createManualBackup(savedData.olsSiteId);
  });

  test("[BKR005] validateManualBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateManualBackup(savedData.olsSiteId);
  });

  test("[BKR006] restoreBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.restoreManualBackup(savedData.olsSiteId);
  });

  test("[BKR007] validateRestoreBackup - Perma-Site: CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateRestoredBackup(savedData.olsSiteId);
  });

  test("[BKR008] deleteManualBackup - Perma-Site:CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteManualBackup(savedData.olsSiteId);
  });

  test("[BKR009] deleteBackupProvider - CustomS3", { tag: ['@BackupProvider', '@CustomS3'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteBackupProvider(currentTeamId);
  });


});

test.describe("BackupProviders : Cloudflare R2", () => {
  /* ------------------------ Secure-Data ------------------------ */
  let backupProviderCloudflareR2Name: string; // Set server name from Secure Data

  /* ------------------------ Backup Providers ------------------------ */
  test("[BKP008] addBackupProvider: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    backupProviderCloudflareR2Name = await backupProvidersPage.addBackupProviderCloudflareR2(currentTeamId);
    console.log(backupProviderCloudflareR2Name);
  });

  test("[BKP009] validateBackupProvider: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateBackupProvider(backupProviderCloudflareR2Name, currentTeamId);
  });

  test("[BKP010] connectBackupProvider - Perma-Site: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.connectBackupProvider(backupProviderCloudflareR2Name, savedData.olsSiteId);
  })

  test("[BKP011] createManualBackup - Perma-Site: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.createManualBackup(savedData.olsSiteId);
  });

  test("[BKP012] validateManualBackup - Perma-Site: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateManualBackup(savedData.olsSiteId);
  });

  test("[BKP013] deleteManualBackup - Perma-Site: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteManualBackup(savedData.olsSiteId);
  });

  test("[BKP014] deleteBackupProvider: CloudflareR2", { tag: ['@BackupProvider', '@CloudflareR2'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteBackupProviderR2(currentTeamId);
  });
});

test.describe.skip("BackupProviders : Google Drive", () => {
  /* ------------------------ Secure-Data ------------------------ */
  let backupProviderGoogleDriveName: string; // Set server name from Secure Data

  /* ------------------------ Backup Providers ------------------------ */
  test("[BKP015] addBackupProvider: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    backupProviderGoogleDriveName = await backupProvidersPage.addBackupProviderGoogleDrive(currentTeamId);
    console.log(backupProviderGoogleDriveName);
  });

  test("[BKP016] validateBackupProvider: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateBackupProvider(backupProviderGoogleDriveName, currentTeamId);
  });

  test("[BKP017] connectBackupProvider - Perma-Site: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.connectBackupProviderGoogleDrive(backupProviderGoogleDriveName, savedData.olsSiteId);
  })

  test("[BKP018] createManualBackup - Perma-Site: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.createManualBackup(savedData.olsSiteId);
  });

  test("[BKP019] validateManualBackup - Perma-Site: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.validateManualBackup(savedData.olsSiteId);
  });

  test("[BKP020] deleteManualBackup - Perma-Site: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteManualBackup(savedData.olsSiteId);
  });

  test("[BKP022] deleteBackupProvider: Google Drive", { tag: ['@BackupProvider', '@GoogleDrive'] }, async () => {
    const backupProvidersPage = new BackupProvidersPage(page);
    await backupProvidersPage.deleteBackupGoogleDrive(currentTeamId);
  });
});


// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  // Clear cookies
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});