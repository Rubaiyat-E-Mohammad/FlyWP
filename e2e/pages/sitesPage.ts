import { Page, expect } from '@playwright/test'; 
import { BasePage } from './base'; 
import { Urls } from '../utils/testData'; 
import { faker } from '@faker-js/faker'; 
import { permaServerSite } from '../utils/secureData';
 
let siteId: Number | string = 0; 
export class SitesPage extends BasePage { 
  constructor(page: Page) { 
    super(page);
  }

  
  async getCurrentTeamId() {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    if (await this.page.locator('//a[text()="Create Server"]').isVisible()) {
      await this.validateAndClick('//a[text()="Create Server"]');
    }
    else if (await this.page.locator('//a[text()="Create New Server"]').isVisible()) {
      await this.validateAndClick('//a[text()="Create New Server"]');
    }
    else {
      console.log("Neither 'Create Server' nor 'Create New Server' button is found.");
    }

    const response = await this.page.waitForResponse((response) =>
      response.url().includes('/servers/create') && response.status() === 200
    );
    const responseData = await response.json();
    const currentTeamId = responseData.props.user.current_team_id;
    console.log(`Current Team ID: ${currentTeamId}`);

    return currentTeamId;
  };


  async createSiteFreeDomainNginx(serverName: string, phpVersion: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');

    await this.validateAndClickByText(serverName);
    await this.validateAndClick('//button[normalize-space(text())="Create New Site"]');
    await this.assertionValidate('//h1[normalize-space(text())="Create Site"]');
    await this.validateAndClick('//h3[normalize-space(text())="Instant Site"]');

    const validateTestDomain = await this.page.locator('//h3[normalize-space(text())="About Test Domains"]').isVisible();

    await this.validateAndClick("//button[normalize-space(text())='Next']"); 
    await this.validateAndClickByText("Nginx"); 
    await this.page.locator("//select[contains(@class,'block w-full')]").selectOption({ value: phpVersion }); 
    await this.validateAndClick("//button[normalize-space(text())='Next']"); 
    await this.validateAndFillStrings("//input[@placeholder='My Awesome Site']", permaServerSite.nginxSiteTitle); 
    await this.validateAndFillStrings("//input[@placeholder='you@example.com']", 'wedevs.testing1@gmail.com'); 
    await this.validateAndFillStrings("//input[@placeholder='username']", faker.internet.username()); 
    await this.validateAndFillStrings("//input[@placeholder='password']", 'wedevs.testing1@gmail.com'); 
    await this.validateAndClick("(//button[@role='switch'])[2]"); 
    await this.page.waitForTimeout(1000); 
    await this.validateAndClick('//button[normalize-space(text())="Create Site"]'); 

    try {
      await this.page.locator("//h3[normalize-space(text())='Creating Site...']").waitFor({ timeout: 10000 });
      expect(this.page.locator("//h3[normalize-space(text())='Creating Site...']").isVisible).toBeTruthy()
    } catch (error) {
      await this.validateAndClick("//button[normalize-space(text())='Create Site']");
      await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
    }
    console.log("Site Creation Started");

    try {
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    } catch (error) {
      await this.page.reload();
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
    const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
    await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");

    return [siteName, siteId];

  };

  async createSiteFreeDomainOls(serverName: string, phpVersion: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');

    await this.validateAndClickByText(serverName);
    await this.validateAndClick('//button[normalize-space(text())="Create New Site"]');
    await this.assertionValidate('//h1[normalize-space(text())="Create Site"]');
    await this.validateAndClick('//h3[normalize-space(text())="Instant Site"]');

    const validateTestDomain = await this.page.locator('//h3[normalize-space(text())="About Test Domains"]').isVisible();

    await this.validateAndClick("//button[normalize-space(text())='Next']");
    await this.validateAndClickByText("OpenLiteSpeed");
    try {
      await this.page.locator("//select[contains(@class,'block w-full')]").selectOption({ value: phpVersion }, { timeout: 2000 });
    } catch (error) {
      return ['OLS does not support PHP version: ', phpVersion];
    }
    await this.validateAndClick("//button[normalize-space(text())='Next']"); 
    await this.validateAndFillStrings("//input[@placeholder='My Awesome Site']", permaServerSite.olsSiteTitle); 
    await this.validateAndFillStrings("//input[@placeholder='you@example.com']", 'wedevs.testing1@gmail.com'); 
    await this.validateAndFillStrings("//input[@placeholder='username']", faker.internet.username()); 
    await this.validateAndFillStrings("//input[@placeholder='password']", 'wedevs.testing1@gmail.com'); 
    await this.validateAndClick("(//button[@role='switch'])[2]"); 
    await this.page.waitForTimeout(1000); 
    await this.validateAndClick("//button[normalize-space(text())='Create Site']"); 

    try {
      await this.page.locator("//h3[normalize-space(text())='Creating Site...']").waitFor({ timeout: 10000 });
      expect(this.page.locator("//h3[normalize-space(text())='Creating Site...']").isVisible).toBeTruthy()
    } catch (error) {
      await this.validateAndClick("//button[normalize-space(text())='Create Site']");
      await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
    }

    console.log("Site Creation Started");

    try {
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    } catch (error) {
      await this.page.reload();
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
    const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
    await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");

    return [siteName, siteId];
  };



  async createSiteCustomDomainNginx(serverName: string, phpVersion: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');

    await this.validateAndClickByText(serverName);
    await this.validateAndClick('//button[normalize-space(text())="Create New Site"]');
    await this.assertionValidate('//h1[normalize-space(text())="Create Site"]');
    await this.validateAndClick('//h3[normalize-space(text())="Instant Site"]');
    await this.validateAndClick("//button[@role='switch']");

    const validateTestDomain = await this.page.locator('//h3[normalize-space(text())="About Test Domains"]').isHidden();

    await this.validateAndFillStrings("//input[@placeholder='domain.com']", "qa-automation-nginx-" + faker.number.int(4) + faker.lorem.words(1) + "-" + "remt.fly");
    await this.validateAndClick("(//input[@type='checkbox'])[1]");
    await this.validateAndClick("//button[normalize-space(text())='Next']");
    await this.validateAndClickByText("Nginx");
    await this.page.locator("//select[contains(@class,'block w-full')]").selectOption({ value: phpVersion });
    await this.validateAndClick("//button[normalize-space(text())='Next']");
    await this.validateAndFillStrings("//input[@placeholder='My Awesome Site']", permaServerSite.nginxSiteTitle);
    await this.validateAndFillStrings("//input[@placeholder='you@example.com']", 'wedevs.testing1@gmail.com');
    await this.validateAndFillStrings("//input[@placeholder='username']", faker.internet.username());
    await this.validateAndFillStrings("//input[@placeholder='password']", 'wedevs.testing1@gmail.com');
    await this.validateAndClick("(//button[@role='switch'])[2]");
    await this.page.waitForTimeout(1000);
    await this.validateAndClick("//button[normalize-space(text())='Create Site']");

    try {
      await this.page.locator("//h3[normalize-space(text())='Creating Site...']").waitFor({ timeout: 10000 });
      expect(this.page.locator("//h3[normalize-space(text())='Creating Site...']").isVisible).toBeTruthy()
    } catch (error) {
      await this.validateAndClick("//button[normalize-space(text())='Create Site']");
      await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
    }

    console.log("Site Creation Started");

    try {
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    } catch (error) {
      await this.page.reload();
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');

    const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
    await this.assertionValidate("//p[contains(text(),'We were unable to install the certificate')]");

    return [siteName, siteId];
  };


  async createSiteCustomDomainOls(serverName: string, phpVersion: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');

    await this.validateAndClickByText(serverName);
    await this.validateAndClick('//button[normalize-space(text())="Create New Site"]');
    await this.assertionValidate('//h1[normalize-space(text())="Create Site"]');
    await this.validateAndClick('//h3[normalize-space(text())="Instant Site"]');
    await this.validateAndClick("//button[@role='switch']");

    const validateTestDomain = await this.page.locator('//h3[normalize-space(text())="About Test Domains"]').isHidden();

    await this.validateAndFillStrings("//input[@placeholder='domain.com']", "qa-automation-ols-" + faker.number.int(4) + faker.lorem.words(1) + "-" + "remt.fly");
    await this.validateAndClick("(//input[@type='checkbox'])[1]");
    await this.validateAndClick("//button[normalize-space(text())='Next']");
    await this.validateAndClickByText("OpenLiteSpeed");

    try {
      await this.page.locator("//select[contains(@class,'block w-full')]").selectOption({ value: phpVersion }, { timeout: 2000 });
    } catch (error) {
      return ['OLS does not support PHP version: ', phpVersion];
    }

    await this.validateAndClick("//button[normalize-space(text())='Next']");
    await this.validateAndFillStrings("//input[@placeholder='My Awesome Site']", permaServerSite.olsSiteTitle);
    await this.validateAndFillStrings("//input[@placeholder='you@example.com']", 'wedevs.testing1@gmail.com');
    await this.validateAndFillStrings("//input[@placeholder='username']", faker.internet.username());
    await this.validateAndFillStrings("//input[@placeholder='password']", 'wedevs.testing1@gmail.com');
    await this.validateAndClick("(//button[@role='switch'])[2]");
    await this.page.waitForTimeout(1000);
    await this.validateAndClick("//button[normalize-space(text())='Create Site']");

    try {
      await this.page.locator("//h3[normalize-space(text())='Creating Site...']").waitFor({ timeout: 10000 });
      expect(this.page.locator("//h3[normalize-space(text())='Creating Site...']").isVisible).toBeTruthy()
    } catch (error) {
      await this.validateAndClick("//button[normalize-space(text())='Create Site']");
      await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
    }

    console.log("Site Creation Started");

    try {
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    } catch (error) {
      await this.page.reload();
      siteId = (await this.extractSiteIdFromRedirect()).toString();
      console.log(`[2] Extracted Site ID: ${siteId}`);
    }


    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');

    const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;

    return [siteName, siteId]; 
  };

  async validateSite(siteName: string | number, siteId: string | number) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId, { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');

    const validatedSiteName = await this.validateAndGetText("//div[@class='py-2']//a[1]");
    if (validatedSiteName === siteName) {
      let flag: boolean = true;
      console.log(`Site created: ${flag}`);
    } else {
      let flag: boolean = false;
      console.log(`Site created: ${flag}`);
    }

  };

  async deleteSite(siteName: string | number, siteId: string | number) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });
    await this.page.waitForLoadState('domcontentloaded');

    await this.validateAndClick("//div[@class='mt-5']//button[1]");
    await this.page.waitForTimeout(2000);

    const modifiedUrl = siteName.toString().replace(".xyz", ".");

    await this.page.getByPlaceholder(modifiedUrl).fill(siteName.toString());
    await this.validateAndClick('//button[contains(text(),"Cancel")]/preceding-sibling::button[contains(text(),"Delete Site")]');

    let response = await this.page.waitForResponse(
      response =>
        response.url().includes(`/site/${siteId}`) && response.status() === 303
    );
    await this.page.waitForTimeout(6000);
    try {
      await expect(this.page.locator(`//a[normalize-space(text())='${siteName}']//..//..//..//..//span[normalize-space(text())='Deleting']`)).not.toBeVisible();
      console.log(`Site ${siteName} deleted successfully`);
    } catch (error) {
      console.log(`Site ${siteName} deletion failed`);
    }
  
  };


}