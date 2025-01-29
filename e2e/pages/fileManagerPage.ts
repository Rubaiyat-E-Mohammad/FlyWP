import { Page, expect } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import fs from 'fs';
import path from 'path';

export class FileManagerPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async createFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Create']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space()='New Folder']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//input[@placeholder='Enter Folder Name']", 'test-folder');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space(text())='test-folder']");
  }

  async validateCreatedFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space(text())='test-folder']");
  }

  async createFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Create']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space()='New File']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//input[@placeholder='Enter File Name']", 'test-file.php');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='test-file.php']");
  }

  async validateCreatedFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='test-file.php']");
  }

  async openfile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='test-file.php']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Open']");
    const response = await this.page.waitForResponse(
      response =>
        response.url().includes(`/site/${siteId}/file-manager/fetch-content?file=test-file.php&path=`) &&
        response.status() === 200,
      { timeout: 10000 } // Wait up to 10 seconds
    );
    await this.assertionValidate("//a[normalize-space(text())='Download File']");
    await this.validateAndClick("//button[normalize-space(text())='Close']");
  }

  async renameFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='test-file.php']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Rename']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//label[normalize-space(text())='New Name']/following::input", 'changed-file.php');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='changed-file.php']");
  }

  async validateRenamedFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='changed-file.php']");
  }

  async downloadFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='changed-file.php']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.evaluate((id) => {
      const link = document.querySelector(`a[href="https://staging-app.flywp.com/site/${id}/file-manager/download?path=%2Fchanged-file.php"]`);
      if (link) {
        link.setAttribute('target', '');
        console.log("Link updated to remove 'target' attribute");
      }
    }, siteId);
    const downloadPath = '../changed-file.php';
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.locator("//a[normalize-space()='Download']").click()
    ]);
    await download.saveAs(downloadPath);
    const fileExists = fs.existsSync(downloadPath);
    expect(fileExists).toBeTruthy();

  }

  async moveFileToFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='changed-file.php']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space()='Move']");
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//label[normalize-space(text())='New Location']/following::input", 'test-folder');
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space()='Move']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);
    await this.validateAndClick("//span[normalize-space(text())='test-folder']");
    await this.page.waitForLoadState('domcontentloaded');
    const response = await this.page.waitForResponse(
      response => response.url().includes(`/site/${siteId}/file-manager/contents?path=%2Ftest-folder`) && response.status() === 200,
      { timeout: 10000 } // Increase timeout
    );
    await this.assertionValidate("//span[normalize-space()='changed-file.php']");
  }

  async zipFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='test-folder']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Compress']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='test-folder.zip']");
  }

  async renameZippedFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='test-folder.zip']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Rename']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//label[normalize-space(text())='New Name']/following::input", 'new-zipped-folder.zip');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='new-zipped-folder.zip']");
  }

  async renameFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='test-folder']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Rename']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//label[normalize-space(text())='New Name']/following::input", 'renamed-folder');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='renamed-folder']");
  }

  async unzipFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='new-zipped-folder.zip']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Extract']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='test-folder']");
  }

  async validateUnzippedFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='test-folder']");
  }

  async deleteZippedFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='new-zipped-folder.zip']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//hr[@role='none']/following-sibling::div[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
  }

  async deleteFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='renamed-folder']");
    await this.page.waitForLoadState('domcontentloaded');
    const response = await this.page.waitForResponse(
      response => response.url().includes(`/site/${siteId}/file-manager/contents?path=%2Frenamed-folder`) && response.status() === 200,
      { timeout: 10000 } // Increase timeout
    );
    await this.validateAndClick("//span[normalize-space()='changed-file.php']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//hr[@role='none']/following-sibling::div[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
  }

  async deleteFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='renamed-folder']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//hr[@role='none']/following-sibling::div[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');

  }

  async deleteUnzippedFolder(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='test-folder']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//hr[@role='none']/following-sibling::div[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
  }

  async uploadFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Create']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space()='Upload File']");
    await this.page.waitForLoadState('domcontentloaded');
    const filePath = '../utils/helloWorld.php';
    await this.page.locator("//input[@type='file']").setInputFiles(path.join(__dirname, filePath));
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForTimeout(5000);
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space()='helloWorld.php']");
  }

  async editFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='helloWorld.php']");
    await this.page.waitForLoadState('domcontentloaded');
    let response = await this.page.waitForResponse(
      response =>
        response.url().includes(`/site/${siteId}/file-manager/fetch-content?file=helloWorld.php&path=`) &&
        response.status() === 200,
      { timeout: 10000 }
    );
    await this.assertionValidate("//div[@class='ace_content']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space()='Update File']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//div[normalize-space(text())='File content updated successfully']");
  }

  async deleteUploadedFile(siteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${siteId}/file-manager`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//span[normalize-space()='helloWorld.php']//..//..//..//td[4]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//hr[@role='none']/following-sibling::div[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
  }

}