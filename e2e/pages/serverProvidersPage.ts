import { expect, Page } from '@playwright/test';
import { BasePage } from './base';
import { Urls, Users } from '../utils/testData';

export class ServerProvidersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }


  /* -------------------- DigitalOcean -------------------- */
  async addServerProviderDigitalOcean(serverProviderDoName: string, serverProviderDoApiToken: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${Users.currentTeamId}/server-providers`, { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[text()="Add Provider"]');
    await this.validateAndClick("//h4[normalize-space(text())='DigitalOcean']");
    await this.validateAndFillStrings('//input[@placeholder="Acme Inc."]', serverProviderDoName);
    await this.validateAndFillStrings('//input[@type="password"]', serverProviderDoApiToken);
    await this.validateAndClick('//button[text()="Add Credential"]');
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForSelector(`//div[text()='${serverProviderDoName}']`, { timeout: 20000 });
    } catch (error) {
      const warnMsg = this.page.locator('//p[normalize-space(text())="The key field is required."]');
      if (await warnMsg.isVisible()) {
        await this.validateAndFillStrings('//input[@type="password"]', serverProviderDoApiToken);
        await this.validateAndClick('//button[text()="Add Credential"]');
        await this.assertionValidate(`//div[text()='${serverProviderDoName}']`);
      }
    }
    return serverProviderDoName;
  };

  async validateServerProviderDigitalOcean(serverProviderDoName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;

    const teamLocatorText = `FlyDevs`;
    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();
    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderDoName}"]`);
  };


  async deleteServerProviderDigitalOcean(serverProviderDoName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;
    const teamLocatorText = `FlyDevs`;
    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderDoName}"]`);
    await this.validateAndClick(`//div[text()='${serverProviderDoName}']//..//..//..//td[contains(@class,'px-6 py-4')]//button`);
    await this.validateAndClick('//div[contains(@class,"px-5 py-4")]//button[1]');
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page.locator(`//div[text()='${serverProviderDoName}']`)).not.toBeVisible();
  };




  /* -------------------- Vultr -------------------- */
  async addServerProviderVultr(serverProviderVultrName: string, serverProviderVultrApiToken: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${Users.currentTeamId}/server-providers`, { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[text()="Add Provider"]');
    await this.validateAndClick("//h4[normalize-space(text())='Vultr']");


    await this.validateAndFillStrings('//input[@placeholder="Acme Inc."]', serverProviderVultrName);
    await this.validateAndFillStrings('//input[@type="password"]', serverProviderVultrApiToken);
    await this.page.waitForTimeout(10000);
    await this.validateAndClick('//button[text()="Add Credential"]');
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForSelector(`//div[text()='${serverProviderVultrName}']`, { timeout: 20000 });
    } catch (error) {
      const warnMsg = this.page.locator('//p[normalize-space(text())="The key field is required."]');
      if (await warnMsg.isVisible()) {
        await this.validateAndFillStrings('//input[@type="password"]', serverProviderVultrApiToken);
        await this.validateAndClick('//button[text()="Add Credential"]');
        await this.assertionValidate(`//div[text()='${serverProviderVultrName}']`);
      }
    }

    return serverProviderVultrName;
  };

  async validateServerProviderVultr(serverProviderVultrName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;


    const teamLocatorText = `FlyDevs`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderVultrName}"]`);
  };

  async deleteServerProviderVultr(serverProviderVultrName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;


    const teamLocatorText = `FlyDevs`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderVultrName}"]`);

    await this.validateAndClick(`//div[text()='${serverProviderVultrName}']//..//..//..//td[contains(@class,'px-6 py-4')]//button`);
    await this.validateAndClick('//div[contains(@class,"px-5 py-4")]//button[1]');
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page.locator(`//div[text()='${serverProviderVultrName}']`)).not.toBeVisible();
  };



  /* -------------------- AWS -------------------- */
  async addServerProviderAws(serverProviderAwsName: string, serverProviderAwsAccessKey: string, serverProviderAwsSecretAccessKey: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${Users.currentTeamId}/server-providers`, { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[text()="Add Provider"]');
    await this.validateAndClick('//h4[contains(text(), "AWS")]');


    await this.validateAndFillStrings('//input[@placeholder="Acme Inc."]', serverProviderAwsName);
    await this.validateAndFillStrings('(//div[@class="relative"]//input)[2]', serverProviderAwsAccessKey);
    await this.validateAndFillStrings('(//div[@class="relative"]//input)[3]', serverProviderAwsSecretAccessKey);
    await this.validateAndClick('//button[text()="Add Credential"]');
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertionValidate(`//div[text()='${serverProviderAwsName}']`);

    return serverProviderAwsName;
  }

  async validateServerProviderAWS(serverProviderAwsName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;

    const teamLocatorText = `FlyDevs`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderAwsName}"]`);
  };

  async deleteServerProviderAWS(serverProviderAwsName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;

    const teamLocatorText = `FlyDevs`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');

    await this.assertionValidate(`//div[text()="${serverProviderAwsName}"]`);

    await this.validateAndClick(`//div[text()='${serverProviderAwsName}']//..//..//..//td[contains(@class,'px-6 py-4')]//button`);
    await this.validateAndClick('//div[contains(@class,"px-5 py-4")]//button[1]');
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page.locator(`//div[text()='${serverProviderAwsName}']`)).not.toBeVisible();

  };




  /* -------------------- Akamai -------------------- */
  async addServerProviderAkamai(serverProviderAkamaiName: string, serverProviderAkamaiApiToken: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${Users.currentTeamId}/server-providers`, { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[text()="Add Provider"]');
    await this.validateAndClick("//h4[normalize-space(text())='Vultr']");


    await this.validateAndFillStrings('//input[@placeholder="Acme Inc."]', serverProviderAkamaiName);
    await this.validateAndFillStrings('//input[@type="password"]', serverProviderAkamaiApiToken);

    await this.validateAndClick('//button[text()="Add Credential"]');
    await this.page.waitForLoadState('domcontentloaded');

    await this.assertionValidate(`//div[text()='${serverProviderAkamaiName}']`);

    return serverProviderAkamaiName;

  }

  async validateServerProviderAkamai(serverProviderAkamaiName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });


    const teamOwnerName = Users.teamOwnerName;


    const teamLocatorText = `FlyDevs`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);

    await teamButtonLocator.click();


    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');

    await this.assertionValidate(`//div[text()="${serverProviderAkamaiName}"]`);
  };

  async deleteServerProviderAkamai(serverProviderAkamaiName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });


    const teamOwnerName = Users.teamOwnerName;

    const teamLocatorText = `FlyDevs`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);

    await teamButtonLocator.click();


    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');

    await this.assertionValidate(`//div[text()="${serverProviderAkamaiName}"]`);

    await this.validateAndClick(`//div[text()='${serverProviderAkamaiName}']//..//..//..//td[contains(@class,'px-6 py-4')]//button`);
    await this.validateAndClick('//div[contains(@class,"px-5 py-4")]//button[1]');
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page.locator(`//div[text()='${serverProviderAkamaiName}']`)).not.toBeVisible();

  };

  /* -------------------- Hetzner -------------------- */
  async addServerProviderHetzner(serverProviderHetznerName: string, serverProviderHetznerApiToken: string) {
    await this.page.goto(Urls.baseUrl + `/teams/${Users.currentTeamId}/server-providers`, { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[text()="Add Provider"]');
    await this.validateAndClick('//h4[normalize-space(text())="Hetzner"]');

    await this.validateAndFillStrings('//input[@placeholder="Acme Inc."]', serverProviderHetznerName);
    await this.validateAndFillStrings('//input[@type="password"]', serverProviderHetznerApiToken);
    await this.validateAndClick('//button[text()="Add Credential"]');
    await this.page.waitForLoadState('domcontentloaded');
    try {
      await this.page.waitForSelector(`//div[text()='${serverProviderHetznerName}']`, { timeout: 20000 });
    } catch (error) {
      const warnMsg = this.page.locator('//p[normalize-space(text())="The key field is required."]');
      if (await warnMsg.isVisible()) {
        await this.validateAndFillStrings('//input[@type="password"]', serverProviderHetznerApiToken);
        await this.validateAndClick('//button[text()="Add Credential"]');
        await this.assertionValidate(`//div[normalize-space(text())="${serverProviderHetznerName}"]`);
      }
    }

    return serverProviderHetznerName;
  }

  async validateServerProviderHetzner(serverProviderHetznersName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;

    const teamLocatorText = `FlyDevs`;
    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderHetznersName}"]`);
  };

  async deleteServerProviderHetzner(serverProviderHetznersName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    const teamOwnerName = Users.teamOwnerName;

    const teamLocatorText = `FlyDevs`;
    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();

    await this.validateAndClick('(//a[contains(text(), "Settings")])[1]');
    await this.validateAndClick('//span[text()="Server Providers"]');
    await this.assertionValidate(`//div[text()="${serverProviderHetznersName}"]`);
    await this.validateAndClick(`//div[text()="${serverProviderHetznersName}"]//..//..//..//td[contains(@class,'px-6 py-4')]//button`);
    await this.validateAndClick('//div[contains(@class,"px-5 py-4")]//button[1]');
    await this.page.waitForLoadState('domcontentloaded')
    await expect(this.page.locator(`//div[text()='${serverProviderHetznersName}']`)).not.toBeVisible();
  };



};
