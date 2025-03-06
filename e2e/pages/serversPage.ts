import { expect, Page } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { faker } from '@faker-js/faker';


export class ServersPage extends BasePage {
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
  }


  async createServerDigitalOceanPartnered(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers/create', { waitUntil: 'networkidle' });

    try {
      await this.validateAndClick('//button[text()="Create Server"]');
    } catch (error) {
      console.log("ERROR: Contact Support to increase limit");
      throw error;
    }

    await this.assertionValidate('//h3[text()="DigitalOcean"]');

    const isServerLocationVisible = await this.page.locator('//label[text()="Server Location"]').isVisible();
    if (isServerLocationVisible) {
      await this.page.selectOption('(//div[@class="mb-4"]//select)[1]', { label: 'Amsterdam 3' });
    } else {
      console.log("Cannot find locator");
    };

    await this.validateAndClick('//table[@class="min-w-full divide-y divide-gray-300"]//tbody//tr[1]');
    await this.validateAndFillStrings('//input[@placeholder="production-server-1"]', serverName);

    await this.validateAndClick('//button[text()="Launch Server"]');
    console.log("Server Launched");

    await this.assertionValidate('//span[text()="Creating"]');

    let serverId = await this.extractServerIdFromRedirect();
    console.log(`[2] Extracted Server ID: ${serverId}`);

    if (!serverId) {
      throw new Error("Failed to extract server ID from redirect URL");
    }

    const maxRetries = 50;
    const delay = 20 * 1000;

    for (let i = 0; i < maxRetries; i++) {
      const statusResponse = await this.page.request.get(`${Urls.baseUrl}/servers/${serverId}/provision-status`);
      const statusData = await statusResponse.json();

      console.log(`Polling Attempt ${i + 1}: Status = ${statusData.status}`);
      if (statusData.status === 'ready') {
        console.log("Server provisioning complete");
        break;
      }
      await this.page.waitForTimeout(delay);
    }

    await this.assertionValidate('//p[text()="No sites found. Start by creating one."]');
    await this.assertionValidate('//button[text()="Create New Site"]');
    console.log("Server Created Successfully");

    serverName = (await this.validateAndGetText("//h2[contains(@class,'font-semibold text-xl')]"))!;

    return serverName;
  };


  async validateServerDigitalOceanPartered(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });
    try {
      expect(this.assertionValidate(`//a[text()="${serverName}"]`)).toBeTruthy();
      return true;
    } catch (error) {
      console.log("Server Not Found. Error:", error);
      return false;
    }
  };


  async updateServerDigitalOceanPartered(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    await this.validateAndClick(`//a[text()="${serverName}"]`);
    await this.assertionValidate(`//a[text()="${serverName}"]`);
    await this.validateAndClick(`//span[normalize-space(text())="Settings"]`);
    await this.assertionValidate(`//input[@value="${serverName}"]`);
    let updatedServerName: string = `${serverName}-${faker.number.int({ min: 100, max: 999 })}`;
    await this.validateAndFillStrings(`//input[@value="${serverName}"]`, updatedServerName);
    await this.validateAndClick('(//div[@class="mr-3"]/following-sibling::button)[1]');

    try {
      const updatedMessageElement = await this.page.innerText('//h3[text()="Server information updated."]');
      console.log('Updated-message: ' + updatedMessageElement);

      expect(updatedMessageElement).toContain('Server information updated.');
    } catch (error) {
      console.log("Server not updated. Error:", error);
    }

    return updatedServerName;
  };


  async validateUpdatedServerDigitalOceanPartered(updatedServerName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    try {
      expect(this.assertionValidate(`//a[text()="${updatedServerName}"]`)).toBeTruthy();
      return true;
    } catch (error) {
      console.log("Server Not created. Error:", error);
      return false;
    }
  };


  async deleteServerDigitalOceanPartered(updatedServerName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    await this.validateAndClickByText(updatedServerName);
    await this.assertionValidate(`//a[text()="${updatedServerName}"]`);
    await this.validateAndClick(`//span[normalize-space(text())="Settings"]`);
    await this.assertionValidate(`//input[@value="${updatedServerName}"]`);
    await this.validateAndClick('//button[contains(text(),"Delete Server")]');
    await this.validateAndFillStrings(`//input[@placeholder="${updatedServerName}"]`, updatedServerName);
    await this.validateAndClick('//button[contains(text(),"Cancel")]/preceding-sibling::button[contains(text(),"Delete Server")]');

    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.waitforLocator('//h3[contains(text(),"Server deleted successfully.")]', { timeout: 30 * 1000 });
      const validateDeletedMessage = await this.page.innerText('//h3[contains(text(),"Server deleted successfully.")]');
      console.log('Deleted-Message: ' + validateDeletedMessage);

      expect(validateDeletedMessage).toContain('Server deleted successfully.');
      return true;
    } catch (error) {
      console.log("Server not deleted. Error: ", error);
      return false;
    }
  };


  async createServerDigitalOceanCustom(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers/create', { waitUntil: 'networkidle' });

    try {
      await this.validateAndClick('//h4[text()="DigitalOcean"]');
    } catch (error) {
      console.log("ERROR: Contact Support to increase limit");
      throw error;
    };

    await this.assertionValidate('//h3[text()="DigitalOcean"]');

    const isServerLocationVisible = await this.page.locator('//label[text()="Server Location"]').isVisible();
    if (isServerLocationVisible) {
      await this.page.selectOption('(//div[@class="mb-4"]//select)[2]', { label: 'Amsterdam 3' });
    } else {
      console.log("Cannot find locator");
    };

    await this.validateAndClick('//table[@class="min-w-full divide-y divide-gray-300"]//tbody//tr[1]');
    await this.validateAndFillStrings('//input[@placeholder="production-server-1"]', serverName);

    await this.validateAndClick('//button[text()="Launch Server"]');
    console.log("Server Launched");

    await this.assertionValidate('//span[text()="Creating"]');

    let serverId = await this.extractServerIdFromRedirect();
    console.log(`[2] Extracted Server ID: ${serverId}`);

    if (!serverId) {
      throw new Error("Failed to extract server ID from redirect URL");
    };

    const maxRetries = 50;
    const delay = 20 * 1000;

    for (let i = 0; i < maxRetries; i++) {
      const statusResponse = await this.page.request.get(`${Urls.baseUrl}/servers/${serverId}/provision-status`);
      const statusData = await statusResponse.json();

      console.log(`Polling Attempt ${i + 1}: Status = ${statusData.status}`);
      if (statusData.status === 'ready') {
        console.log("Server provisioning complete");
        break;
      };

      await this.page.waitForTimeout(delay);
    };

    await this.assertionValidate('//p[text()="No sites found. Start by creating one."]');
    await this.assertionValidate('//button[text()="Create New Site"]');
    console.log("Server Created Successfully");

    return serverName;
  };


  async validateServerDigitalOceanCustom(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    try {
      expect(this.assertionValidate(`//a[text()="${serverName}"]`)).toBeTruthy();
      return true;
    } catch (error) {
      console.log("Server Not Found. Error:", error);
      return false;
    };
  };


  async updateServerDigitalOceanCustom(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    await this.validateAndClick(`//a[text()="${serverName}"]`);
    await this.assertionValidate(`//a[text()="${serverName}"]`);
    await this.validateAndClick(`//span[normalize-space(text())="Settings"]`);
    await this.assertionValidate(`//input[@value="${serverName}"]`);
    let updatedServerName: string = `${serverName}-${faker.number.int({ min: 100, max: 999 })}`;
    await this.validateAndFillStrings(`//input[@value="${serverName}"]`, updatedServerName);
    await this.validateAndClick('(//div[@class="mr-3"]/following-sibling::button)[1]');

    try {
      const updatedMessageElement = await this.page.innerText('//h3[text()="Server information updated."]');
      console.log('Updated-message: ' + updatedMessageElement);

      expect(updatedMessageElement).toContain('Server information updated.');
    } catch (error) {
      console.log("Server not updated. Error:", error);
    };

    return updatedServerName;
  };


  async validateUpdatedServerDigitalOceanCustom(updatedServerName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    try {
      expect(this.assertionValidate(`//a[text()="${updatedServerName}"]`)).toBeTruthy();
      return true;
    } catch (error) {
      console.log("Server Not created. Error:", error);
      return false;
    };
  };


  async deleteServerDigitalOceanCustom(updatedServerName: string) {
    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    await this.validateAndClick(`//a[text()="${updatedServerName}"]`);
    await this.assertionValidate(`//a[text()="${updatedServerName}"]`);
    await this.validateAndClick(`//span[normalize-space(text())="Settings"]`);
    await this.assertionValidate(`//input[@value="${updatedServerName}"]`);
    await this.validateAndClick('//button[contains(text(),"Delete Server")]');
    await this.validateAndFillStrings(`//input[@placeholder="${updatedServerName}"]`, updatedServerName);
    await this.validateAndClick('//button[contains(text(),"Cancel")]/preceding-sibling::button[contains(text(),"Delete Server")]');

    try {
      await this.page.waitForLoadState('domcontentloaded');
      await this.waitforLocator('//h3[contains(text(),"Server deleted successfully.")]', { timeout: 30 * 1000 }); //Wait for 30 sec
      const validateDeletedMessage = await this.page.innerText('//h3[contains(text(),"Server deleted successfully.")]');
      console.log('Deleted-Message: ' + validateDeletedMessage);

      expect(validateDeletedMessage).toContain('Server deleted successfully.');
      return true;
    } catch (error) {
      console.log("Server not deleted. Error: ", error);
      return false;
    };
  };

  async createServerVultr(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers/create', { waitUntil: 'networkidle' });

    try {
      await this.validateAndClick('//h4[normalize-space()="Vultr"]');
    } catch (error) {
      console.log("ERROR: Contact Support to increase limit");
      throw error;
    };

    await this.assertionValidate('//h3[normalize-space()="Vultr"]');

    //await this.page.locator("//select[@id='vultr-size']").selectOption({ index: 1 });

    await this.validateAndFillStrings('//input[@placeholder="production-server-1"]', serverName);

    await this.validateAndClick('//button[text()="Launch Server"]');
    console.log("Server Launched");

    await this.assertionValidate('//span[text()="Creating"]');

    let serverId = await this.extractServerIdFromRedirect();
    console.log(`[2] Extracted Server ID: ${serverId}`);

    if (!serverId) {
      throw new Error("Failed to extract server ID from redirect URL");
    };

    const maxRetries = 50;
    const delay = 20 * 1000;

    for (let i = 0; i < maxRetries; i++) {
      const statusResponse = await this.page.request.get(`${Urls.baseUrl}/servers/${serverId}/provision-status`);
      const statusData = await statusResponse.json();

      console.log(`Polling Attempt ${i + 1}: Status = ${statusData.status}`);
      if (statusData.status === 'ready') {
        console.log("Server provisioning complete");
        break;
      };

      await this.page.waitForTimeout(delay);
    };


    await this.assertionValidate('//p[text()="No sites found. Start by creating one."]');
    await this.assertionValidate('//button[text()="Create New Site"]');
    console.log("Server Created Successfully");


    return serverId;
  }


  async validateServerVultr(serverName: string) {

    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });


    try {

      expect(this.assertionValidate(`//a[text()="${serverName}"]`)).toBeTruthy();

      return true;
    } catch (error) {

      console.log("Server Not Found. Error:", error);

      return false;
    };
  };

  async deleteServerVultr(serverName: string) {

    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });

    await this.validateAndClick(`//a[text()="${serverName}"]`);

    await this.assertionValidate(`//a[text()="${serverName}"]`);

    await this.validateAndClick(`//span[normalize-space(text())="Settings"]`);

    await this.assertionValidate(`//input[@value="${serverName}"]`);

    await this.validateAndClick('//button[contains(text(),"Delete Server")]');
    await this.validateAndFillStrings(`//input[@placeholder="${serverName}"]`, serverName);
    await this.validateAndClick('//button[contains(text(),"Cancel")]/preceding-sibling::button[contains(text(),"Delete Server")]');

    try {

      await this.page.waitForLoadState('domcontentloaded');
      await this.waitforLocator('//h3[contains(text(),"Server deleted successfully.")]', { timeout: 30 * 1000 }); //Wait for 30 sec
      const validateDeletedMessage = await this.page.innerText('//h3[contains(text(),"Server deleted successfully.")]');
      console.log('Deleted-Message: ' + validateDeletedMessage);

      expect(validateDeletedMessage).toContain('Server deleted successfully.');
      return true;
    } catch (error) {
      console.log("Server not deleted. Error: ", error);
      return false;
    };
  };

  async createServerHetzner(serverName: string) {
    await this.page.goto(Urls.baseUrl + '/servers/create', { waitUntil: 'networkidle' });

    try {
      await this.validateAndClick('//h4[normalize-space()="Hetzner"]');
    } catch (error) {
      console.log("ERROR: Contact Support to increase limit");
      throw error;
    };

    await this.assertionValidate('//h3[normalize-space()="Hetzner"]');

    await this.validateAndClick('//table[@class="min-w-full divide-y divide-gray-300"]//tbody//tr[1]');
    await this.validateAndFillStrings('//input[@placeholder="production-server-1"]', serverName);

    await this.validateAndClick('//button[text()="Launch Server"]');
    console.log("Server Launched");

    await this.assertionValidate('//span[text()="Creating"]');

    let serverId = await this.extractServerIdFromRedirect();
    console.log(`[2] Extracted Server ID: ${serverId}`);

    if (!serverId) {
      throw new Error("Failed to extract server ID from redirect URL");
    };

    const maxRetries = 50;
    const delay = 20 * 1000;

    for (let i = 0; i < maxRetries; i++) {
      const statusResponse = await this.page.request.get(`${Urls.baseUrl}/servers/${serverId}/provision-status`);
      const statusData = await statusResponse.json();

      console.log(`Polling Attempt ${i + 1}: Status = ${statusData.status}`);
      if (statusData.status === 'ready') {
        console.log("Server provisioning complete");
        break;
      };

      await this.page.waitForTimeout(delay);
    };

    await this.assertionValidate('//p[text()="No sites found. Start by creating one."]');
    await this.assertionValidate('//button[text()="Create New Site"]');
    console.log("Server Created Successfully");


    return serverId;
  }


  async validateServerHetzner(serverName: string) {

    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });


    try {

      expect(this.assertionValidate(`//a[text()="${serverName}"]`)).toBeTruthy();

      return true;
    } catch (error) {

      console.log("Server Not Found. Error:", error);

      return false;
    };
  };

  async deleteServerHetzner(serverName: string) {

    await this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' });


    await this.validateAndClick(`//a[text()="${serverName}"]`);

    await this.assertionValidate(`//a[text()="${serverName}"]`);

    await this.validateAndClick(`//span[normalize-space(text())="Settings"]`);

    await this.assertionValidate(`//input[@value="${serverName}"]`);

    await this.validateAndClick('//button[contains(text(),"Delete Server")]');
    await this.validateAndFillStrings(`//input[@placeholder="${serverName}"]`, serverName);
    await this.validateAndClick('//button[contains(text(),"Cancel")]/preceding-sibling::button[contains(text(),"Delete Server")]');

    try {

      await this.page.waitForLoadState('domcontentloaded');
      await this.waitforLocator('//h3[contains(text(),"Server deleted successfully.")]', { timeout: 30 * 1000 }); //Wait for 30 sec
      const validateDeletedMessage = await this.page.innerText('//h3[contains(text(),"Server deleted successfully.")]');
      console.log('Deleted-Message: ' + validateDeletedMessage);

      expect(validateDeletedMessage).toContain('Server deleted successfully.');
      return true;
    } catch (error) {
      console.log("Server not deleted. Error: ", error);
      return false;
    };
  };





};
