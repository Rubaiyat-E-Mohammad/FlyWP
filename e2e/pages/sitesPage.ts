import { Page, expect } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { faker } from '@faker-js/faker';
import { permaServerSite } from '../utils/secureData';

let siteId: string = '';
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

  async validateSite(siteName: string, siteId: string) {
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

  async deleteSite(siteName: string, siteId: string) {
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


  /**
   * 
   * @description: 
   *    Sceanrios covering test steps for Sites @Settings : 
   *    
   */


  /**
   * 
   * @param phpVersion 
   * 
   * 
   *  
   */
  async changeSitePhpVersion(siteId: string, phpVersion: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');
    await this.page.waitForLoadState('domcontentloaded');

    await this.page.selectOption('//label[contains(text(),"PHP Version")]//..//..//select', phpVersion);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');

    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedPhpVersion = responseData.props.site.php_version;

    if (updatedPhpVersion !== '8.2') {
      throw new Error(`PHP version was not updated successfully. Expected: 8.2, Got: ${updatedPhpVersion}`);
    }

    const toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    // await toastMessage.waitFor({ timeout: 30000 });
    try {
      await toastMessage.waitFor({ timeout: 20000 });
    } catch (error) {
      await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');
      await toastMessage.waitFor({ timeout: 20000 });
    }
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedPhpVersion;
  };

  async validateSitePhpVersion(siteId: string, updatedPhpVersion: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ]);

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Tools"]')
    await newPage.click('//a[normalize-space(text())="Site Health"]')
    await newPage.click('//a[normalize-space(text())="Info"]');
    await newPage.click('//button[contains(.,"Server")]');


    let phpVersionLocator = await newPage.innerText('//td[text()="PHP version"]/following-sibling::td');

    const phpVersion = phpVersionLocator.split(' ')[0];

    // Compare the extracted PHP version with the version you want to check
    if (phpVersion.startsWith(updatedPhpVersion)) {
      console.log(`PHP version matches: ${phpVersion}`);
    } else {
      console.log(`PHP version does not match. Found: ${phpVersion}`);
    }
  };


  /**
   * 
   * @param memoryLimit 
   * 
   * @param maxExecutionTime
   * 
   */
  async changeSitePhpMemoryLimit(siteId: string, memoryLimit: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');
    await this.page.waitForLoadState('domcontentloaded');

    await this.page.fill('//label[contains(text(),"PHP Memory Limit")]//..//..//input', memoryLimit);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');

    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedMemoryLimit = responseData.props.php.memory;

    if (updatedMemoryLimit.toString() !== memoryLimit) {
      throw new Error(`PHP memory limit was not updated successfully.. Expected: 512MB, Got: ${updatedMemoryLimit}`);
    }

    let toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    await toastMessage.waitFor({ timeout: 10000 });
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedMemoryLimit;
  };

  async validateSitePhpMemoryLimit(siteId: string, updatedMemoryLimit: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ])

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Tools"]')
    await newPage.click('//a[normalize-space(text())="Site Health"]')
    await newPage.click('//a[normalize-space(text())="Info"]');
    await newPage.click('//button[contains(.,"Server")]');

    let memoryLimitLocator = await newPage.innerText('//td[text()="PHP memory limit"]/following-sibling::td');

    const memoryLimit = memoryLimitLocator.split(' ')[0];

    // Compare the extracted PHP version with the version you want to check
    if (memoryLimit.startsWith(updatedMemoryLimit)) {
      console.log(`Memory limit matches: ${memoryLimit}`);
    } else {
      console.log(`Memory limit does not match. Found: ${memoryLimit}`);
    }
  };


  async changeSiteMaxExecutionTime(siteId: string, maxExecutionTime: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');

    await this.page.fill('//label[contains(text(),"Max Execution Time")]//..//..//input', maxExecutionTime);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');

    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedMaxExecutionTime = responseData.props.php.max_exec_time;

    if (updatedMaxExecutionTime.toString() !== maxExecutionTime) {
      throw new Error(`Max execution time was not updated successfully.. Expected: 120 sec, Got: ${updatedMaxExecutionTime}`);
    }

    let toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    await toastMessage.waitFor({ timeout: 10000 });
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedMaxExecutionTime;

  };

  async validateSiteMaxExecutionTime(siteId: string, updatedMaxExecutionTime: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ])

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Tools"]')
    await newPage.click('//a[normalize-space(text())="Site Health"]')
    await newPage.click('//a[normalize-space(text())="Info"]');
    await newPage.click('//button[contains(.,"Server")]');

    let executionTimeLocator = await newPage.innerText('//td[text()="PHP time limit"]/following-sibling::td');

    const executionTime = executionTimeLocator.split(' ')[0];

    // Compare the extracted PHP version with the version you want to check
    if (executionTime.startsWith(updatedMaxExecutionTime)) {
      console.log(`Memory limit matches: ${executionTime}`);
    } else {
      console.log(`Memory limit does not match. Found: ${executionTime}`);
    }
  };

  /**
   * 
   * @param maxFileUploadLimit 
   * 
   * @param maxFileUploadSize
   * 
   * 
   * 
   */
  async changeSiteMaxFileUploadLimit(siteId: string, maxFileUploadLimit: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');

    await this.page.fill('//p[contains(text(),"Maximum number of files that can be uploaded at once.")]//..//..//input', maxFileUploadLimit);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');

    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedMaxFileUploadLimit = responseData.props.php.max_num_uploads;
    console.log(`This is updated: ` + updatedMaxFileUploadLimit);
    console.log(`This is updated to string: ` + updatedMaxFileUploadLimit.toString());
    console.log(`This was sent: ` + maxFileUploadLimit);

    if (updatedMaxFileUploadLimit.toString() !== maxFileUploadLimit) {
      throw new Error(`Max file upload limit was not updated successfully.. Expected: 100, Got: ${updatedMaxFileUploadLimit}`);
    }

    let toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    await toastMessage.waitFor({ timeout: 10000 });
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedMaxFileUploadLimit;

  };

  async validateSiteMaxFileUploadLimit(siteId: string, maxFileUploadLimit: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ])

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Media"]')
    await newPage.click('//a[normalize-space(text())="Add New Media File"]')

    let fileUploadLimitLocator = await newPage.innerText('//p[@class="max-upload-size"]');

    const match = fileUploadLimitLocator.match(/\d+/);
    const fileUploadLimit = match ? match[0] : '0';

    // Compare the extracted PHP version with the version you want to check
    if (fileUploadLimit.startsWith(maxFileUploadLimit)) {
      console.log(`Memory limit matches: ${fileUploadLimit}`);
    } else {
      console.log(`Memory limit does not match. Found: ${fileUploadLimit}`);
    }
  };

  async changeSiteMaxFileUploadSize(siteId: string, maxFileUploadSize: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');

    await this.page.fill('//label[contains(text(),"Max File Upload Size")]//..//..//input', maxFileUploadSize);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');

    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedMaxFileUploadSize = responseData.props.php.upload_size;

    if (updatedMaxFileUploadSize.toString() !== maxFileUploadSize) {
      throw new Error(`Max file upload size was not updated successfully. Expected: 1200 MB, Got: ${updatedMaxFileUploadSize}`);
    }

    let toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    await toastMessage.waitFor({ timeout: 10000 });
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedMaxFileUploadSize;
  };

  async validateSiteMaxFileUploadSize(siteId: string, maxFileUploadSize: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ])

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Tools"]')
    await newPage.click('//a[normalize-space(text())="Site Health"]')
    await newPage.click('//a[normalize-space(text())="Info"]');
    await newPage.click('//button[contains(.,"Server")]');

    let fileUploadSizeLocator = await newPage.innerText('//td[text()="Upload max filesize"]/following-sibling::td');

    const fileUploadSize = fileUploadSizeLocator.split(' ')[0];

    // Compare the extracted PHP version with the version you want to check
    if (fileUploadSize.startsWith(maxFileUploadSize)) {
      console.log(`Memory limit matches: ${fileUploadSize}`);
    } else {
      console.log(`Memory limit does not match. Found: ${fileUploadSize}`);
    }
  };

  /**
   * 
   * @param maxInputTime 
   * 
   * @param maxVars
   * 
   * 
   * 
   */
  async changeSiteMaxInputTime(siteId: string, maxInputTime: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');

    await this.page.fill('//label[contains(text(),"Max Input Time")]//..//..//input', maxInputTime);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');

    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedMaxInputTime = responseData.props.php.max_input_time;

    if (updatedMaxInputTime.toString() !== maxInputTime) {
      throw new Error(`Max input time was not updated successfully. Expected: 180 sec, Got: ${updatedMaxInputTime}`);
    }

    let toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    await toastMessage.waitFor({ timeout: 10000 });
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedMaxInputTime;
  };

  async validateSiteMaxInputTime(siteId: string, maxInputTime: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ])

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Tools"]')
    await newPage.click('//a[normalize-space(text())="Site Health"]')
    await newPage.click('//a[normalize-space(text())="Info"]');
    await newPage.click('//button[contains(.,"Server")]');

    let inputTimeLocator = await newPage.innerText('//td[text()="Max input time"]/following-sibling::td');

    const inputTime = inputTimeLocator.split(' ')[0];

    // Compare the extracted PHP version with the version you want to check
    if (inputTime.startsWith(maxInputTime)) {
      console.log(`Memory limit matches: ${inputTime}`);
    } else {
      console.log(`Memory limit does not match. Found: ${inputTime}`);
    }
  };

  async changeSiteMaxInputVars(siteId: string, maxInputVars: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]');

    await this.page.fill('//label[contains(text(),"Max Input Vars")]//..//..//input', maxInputVars);

    await this.validateAndClick('//button[normalize-space(text())="Save Changes"]');
    // Wait for the response to be successful
    const response = await this.page.waitForResponse((response) =>
      response.url().includes(`/site/${siteId}/settings`) && response.status() === 200
    );
    const responseData = await response.json();
    const updatedMaxInputVars = responseData.props.php.max_input_vars;

    if (updatedMaxInputVars.toString() !== maxInputVars) {
      throw new Error(`Max input vars was not updated successfully. Expected: 1200, Got: ${updatedMaxInputVars}`);
    }

    let toastMessage = this.page.locator('//div[normalize-space(text())="Changes has been updated in the server."]'); // Update with the actual selector for your Toast
    await toastMessage.waitFor({ timeout: 10000 });
    await expect(toastMessage).toHaveText('Changes has been updated in the server.');

    return updatedMaxInputVars;
  };

  async validateSiteMaxInputVars(siteId: string, maxInputVars: string) {
    await this.page.goto(Urls.baseUrl + '/site/' + siteId + '/settings', { waitUntil: 'networkidle' });

    await this.validateAndClick('//button[contains(text(),"PHP Settings")]')

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.validateAndClick('//button[contains(.,"WP Admin")]')
    ])

    expect(newPage.locator('//div[normalize-space(text())="Dashboard"]')).toBeTruthy();

    await newPage.click('//div[normalize-space(text())="Tools"]')
    await newPage.click('//a[normalize-space(text())="Site Health"]')
    await newPage.click('//a[normalize-space(text())="Info"]');
    await newPage.click('//button[contains(.,"Server")]');

    let inputVarsLocator = await newPage.innerText('//td[text()="PHP max input variables"]/following-sibling::td');

    const inputVars = inputVarsLocator.split(' ')[0];

    // Compare the extracted PHP version with the version you want to check
    if (inputVars.startsWith(maxInputVars)) {
      console.log(`Memory limit matches: ${inputVars}`);
    } else {
      console.log(`Memory limit does not match. Found: ${inputVars}`);
    }
  };













};