import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { ServersPage } from "../pages/serversPage";
import { FileManagerPage } from "../pages/fileManagerPage";
import { Users } from "../utils/testData";
import * as fs from "fs";
import { TestDataManager } from '../utils/testDataManager';
const testData = TestDataManager.getInstance();

let savedData: any;
let browser: Browser;
let context: BrowserContext;
let page: Page;


// Test Data
let currentTeamId: string = Users.currentTeamId;


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
  const serversPage = new ServersPage(page);

  // Get Current Team ID
  currentTeamId = await serversPage.getCurrentTeamId();

  savedData = testData.getData();
});



/**
 * @description
 *    Test Suite for File Manager Actions.
 * 
 * @details
 *    This suite performs various file management actions (create, validate, edit, delete, move, zip, unzip) on both Nginx and OLS server sites. It ensures that the file management operations behave as expected for different file types and folders.
 * 
 * @testCases
 *    - [FM001] createNewFolder: Verify that a new folder can be created on a site.
 *    - [FM002] validateCreatedNewFolder: Validate that the newly created folder exists.
 *    - [FM003] createNewFile: Create a new file on the server.
 *    - [FM004] validateCreatedNewFile: Validate that the created file is present.
 *    - [FM005] openCreatedNewFile: Ensure that the new file can be opened.
 *    - [FM006] renameCreatedNewFile: Rename the newly created file and verify.
 *    - [FM007] validateRenamedFile: Verify that the file has been renamed successfully.
 *    - [FM008] downloadRenamedFile: Ensure the renamed file can be downloaded.
 *    - [FM009] moveCreatedNewFileToCreatedNewFolder: Move a file to a folder and verify.
 *    - [FM010] zipCreatedFolder: Zip the created folder and verify.
 *    - [FM011] renameZippedFolder: Rename the zipped folder and verify.
 *    - [FM012] renameCreatedFolder: Rename the folder and verify.
 *    - [FM013] unZipFolder: Unzip the folder and verify the contents.
 *    - [FM014] validateUnZipFolder: Validate the unzipped folder contents.
 *    - [FM015] deleteNewZippedFolder: Delete the newly zipped folder and verify.
 *    - [FM016] deleteNewCreatedFile: Delete the newly created file and verify.
 *    - [FM017] deleteNewCreatedFolder: Delete the newly created folder and verify.
 *    - [FM018] uploadNewFile: Upload a new file to the server and verify.
 *    - [FM019] editUploadedNewFile: Edit an uploaded file and verify.
 *    - [FM020] deletedUploadedNewFile: Delete an uploaded file and verify.
 *    - [FM021] deleteUnzippedFolder: Delete an unzipped folder and verify.
 * 
 * @cleanup
 *    Session data and cookies are cleared before and after all tests to maintain test integrity.
 */


// ------------------ File Manager: Nginx Server Tests --------------------
test.describe("File Manager Actions: Nginx", () => {
  test("[FM001] createNewFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.createFolder(savedData.nginxSiteId.toString());
  })

  test("[FM002] validateCreatedNewFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateCreatedFolder(savedData.nginxSiteId.toString());
  })

  test("[FM003] createNewFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.createFile(savedData.nginxSiteId.toString());
  })

  test("[FM004] validateCreatedNewFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateCreatedFile(savedData.nginxSiteId.toString());
  })

  test("[FM005] openCreatedNewFile - Perma-Site: Nginx  ", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.openfile(savedData.nginxSiteId.toString());
  })

  test("[FM006] renameCreatedNewFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.renameFile(savedData.nginxSiteId.toString());
  })

  test("[FM007] validateRenamedFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateRenamedFile(savedData.nginxSiteId.toString());
  })

  test("[FM008] downloadRenamedFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.downloadFile(savedData.nginxSiteId.toString());
  })

  test("[FM009] moveCreatedNewFileToCreatedNewFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.moveFileToFolder(savedData.nginxSiteId.toString());
  })

  test("[FM010] zipCreatedFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.zipFolder(savedData.nginxSiteId.toString());
  })

  test("[FM011] renameZippedFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.renameZippedFolder(savedData.nginxSiteId.toString());
  })

  test("[FM012] renameCreatedFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.renameFolder(savedData.nginxSiteId.toString());
  })

  test("[FM013] unZipFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.unzipFolder(savedData.nginxSiteId.toString());
  })

  test("[FM014] validateUnZipFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateUnzippedFolder(savedData.nginxSiteId.toString());
  })

  test("[FM015] deleteNewZippedFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteZippedFolder(savedData.nginxSiteId.toString());
  })

  test("[FM016] deleteNewCreatedFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteFile(savedData.nginxSiteId.toString());
  })

  test("[FM017] deleteNewCreatedFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteFolder(savedData.nginxSiteId.toString());
  })

  test("[FM018] uploadNewFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.uploadFile(savedData.nginxSiteId.toString());
  })

  test("[FM019] editUploadedNewFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.editFile(savedData.nginxSiteId.toString());
  })

  test("[FM020] deletedUploadedNewFile - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteUploadedFile(savedData.nginxSiteId.toString());
  })

  test("[FM021] deleteUnzippedFolder - Perma-Site: Nginx", { tag: ['@FileManager', '@Nginx'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteUnzippedFolder(savedData.nginxSiteId.toString());
  })

})


// ------------------ File Manager: OLS Server Tests --------------------
test.describe("File Manager Actions: OLS ", () => {
  test("[FM022] createNewFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.createFolder(savedData.olsSiteId.toString());
  })

  test("[FM023] validateCreatedNewFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateCreatedFolder(savedData.olsSiteId.toString());
  })

  test("[FM024] createNewFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.createFile(savedData.olsSiteId.toString());
  })

  test("[FM025] validateCreatedNewFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateCreatedFile(savedData.olsSiteId.toString());
  })

  test("[FM026] openCreatedNewFile - Perma-Site: Ols ", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.openfile(savedData.olsSiteId.toString());
  })

  test("[FM027] renameCreatedNewFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.renameFile(savedData.olsSiteId.toString());
  })

  test("[FM028] validateRenamedFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateRenamedFile(savedData.olsSiteId.toString());
  })

  test("[FM029] downloadRenamedFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.downloadFile(savedData.olsSiteId.toString());
  })

  test("[FM030] moveCreatedNewFileToCreatedNewFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.moveFileToFolder(savedData.olsSiteId.toString());
  })

  test("[FM031] zipCreatedFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.zipFolder(savedData.olsSiteId.toString());
  })

  test("[FM032] renameZippedFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.renameZippedFolder(savedData.olsSiteId.toString());
  })

  test("[FM033] renameCreatedFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.renameFolder(savedData.olsSiteId.toString());
  })

  test("[FM034] unZipFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.unzipFolder(savedData.olsSiteId.toString());
  })

  test("[FM035] validateUnZipFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.validateUnzippedFolder(savedData.olsSiteId.toString());
  })

  test("[FM036] deleteNewZippedFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteZippedFolder(savedData.olsSiteId.toString());
  })

  test("[FM037] deleteNewCreatedFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteFile(savedData.olsSiteId.toString());
  })

  test("[FM038] deleteNewCreatedFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteFolder(savedData.olsSiteId.toString());
  })

  test("[FM039] uploadNewFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.uploadFile(savedData.olsSiteId.toString());
  })

  test("[FM040] editUploadedNewFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.editFile(savedData.olsSiteId.toString());
  })

  test("[FM041] deletedUploadedNewFile - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteUploadedFile(savedData.olsSiteId.toString());
  })

  test("[FM042] deleteUnzippedFolder - Perma-Site: Ols", { tag: ['@FileManager', '@OLS'] }, async () => {
    const fileManagerPage = new FileManagerPage(page);
    await fileManagerPage.deleteUnzippedFolder(savedData.olsSiteId.toString());
  })

})

// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', function () { });
  await browser.close();
});