import { Page, Dialog } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { BackupProvidersCustomS3, BackupProvidersCloudflareR2 } from "../utils/secureData";

export class BackupProvidersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }


  /* -------------------- Custom S3 -------------------- */
  async addBackupProviderCustomS3(currentTeamId: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${currentTeamId}/backups`, { waitUntil: 'networkidle' });

    //Add New Provider
    await this.validateAndClick("//button[normalize-space(text())='Add New Provider']");

    //Custom S3 Provider
    await this.validateAndClick("//h4[normalize-space(text())='Custom (S3 Compatible)']");

    //Insert Provider Name
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[1]", BackupProvidersCustomS3.backupProviderCustomS3Name);

    //Insert Region Name
    await this.validateAndFillStrings("//input[@placeholder='us-east-1']", BackupProvidersCustomS3.backupProviderCustomS3Region);

    //Insert Endpoint
    await this.validateAndFillStrings("//input[@placeholder='https://s3.us-east-1.example.com']", BackupProvidersCustomS3.backupProviderEndpoint);

    //Insert Access Key
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[4]", BackupProvidersCustomS3.backupProviderCustomS3AccessKey);

    //Insert Secret Access Key
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[5]", BackupProvidersCustomS3.backupProviderCustomS3SecretAccessKey);

    //Click Add Provider
    await this.validateAndClick("//button[normalize-space(text())='Add Provider']");

    return BackupProvidersCustomS3.backupProviderCustomS3Name;


  };

  async validateBackupProvider(backupProviderName: string, currentTeamId: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${currentTeamId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.reload();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(5000);
    await this.page.reload();
    await this.assertionValidate(`//div[normalize-space(text())="${backupProviderName}"]`);
  };

  async connectBackupProvider(backupProviderName: string, SiteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${SiteId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Backup Settings']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.locator("(//select[contains(@class,'block w-full')])[1]").selectOption({ index: 0 });
    await this.validateAndFillStrings("//input[@placeholder='my-bucket']", BackupProvidersCustomS3.backupProviderCustomS3Bucket);
    await this.validateAndClick("//button[normalize-space(text())='Save Backup Options']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//h3[normalize-space(text())='Backup settings saved.']");
    await this.assertionValidate("//div[normalize-space(text())='Backup profile installed successfully.']");
  };

  async createManualBackup(SiteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${SiteId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Create Manual Backup']");
    const dialogHandler = async (dialog: Dialog) => {
      if (dialog.type() === 'confirm') {
        await dialog.accept();
      }
    };
    this.page.on('dialog', dialogHandler);
    await this.validateAndClick("//button[normalize-space(text())='Create Manual Backup']");
    this.page.off('dialog', dialogHandler);
    await this.assertionValidate("//h3[normalize-space(text())='Backup started.']");
  }

  async validateManualBackup(SiteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${SiteId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.locator("//span[normalize-space(text())='success']").waitFor({ timeout:30000 });
    } catch (error) {
      await this.page.reload();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1000);
      await this.assertionValidate("//span[normalize-space(text())='failed']");
      console.log("Backup Failed");
    }
  }

  async restoreManualBackup(SiteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${SiteId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("(//div[@data-state='closed'])[3]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndFillStrings("//input[@placeholder='confirm']", 'confirm');
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//button[normalize-space(text())='Restore']");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//h3[normalize-space(text())='The backup will be restored shortly.']");
  }

  async validateRestoredBackup(SiteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${SiteId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//span[normalize-space(text())='Restoring']");
    await this.page.waitForLoadState('domcontentloaded');


  }

  async deleteManualBackup(SiteId: string) {
    await this.page.goto(Urls.baseUrl + `/site/${SiteId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("(//div[@data-state='closed']/following-sibling::div)[2]//button");
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate("//h3[normalize-space(text())='The backup has been deleted.']");
  }



  async deleteBackupProvider(currentTeamId: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${currentTeamId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick(`//div[normalize-space(text())='${BackupProvidersCustomS3.backupProviderCustomS3Name}']//..//..//..//button[normalize-space(text())='Delete']`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
  };


  /* -------------------- Cloudflare R2 -------------------- */
  async addBackupProviderCloudflareR2(currentTeamId: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${currentTeamId}/backups`, { waitUntil: 'networkidle' });

    //Add New Provider
    await this.validateAndClick("//button[normalize-space(text())='Add New Provider']");

    //Custom S3 Provider
    await this.validateAndClick("//h4[normalize-space(text())='Cloudflare R2']");

    //Insert Provider Name
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[1]", BackupProvidersCloudflareR2.backupProviderCloudflareR2Name);

    //Insert Region Name
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[2]", BackupProvidersCloudflareR2.backupProviderAccountId);

    //Insert Access Key
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[3]", BackupProvidersCloudflareR2.backupProviderCloudflareR2AccessKey);

    //Insert Secret Access Key
    await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[4]", BackupProvidersCloudflareR2.backupProviderCloudflareR2SecretAccessKey);

    //Click Add Provider
    await this.validateAndClick("//button[normalize-space(text())='Add Provider']");

    return BackupProvidersCloudflareR2.backupProviderCloudflareR2Name;


  };

  async deleteBackupProviderR2(currentTeamId: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${currentTeamId}/backups`, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick(`//div[text()="${BackupProvidersCloudflareR2.backupProviderCloudflareR2Name}"]//..//..//..//td[contains(@class,'px-6 py-4')]//button`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.validateAndClick("//div[contains(@class,'px-5 py-4')]//button[1]");
  };



}