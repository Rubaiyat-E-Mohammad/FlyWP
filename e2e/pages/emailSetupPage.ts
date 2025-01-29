import { Page, BrowserContext, Dialog, expect } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { emailCredentials } from '../utils/secureData';

let context: BrowserContext;

export class EmailSetupPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async connectEmail(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/email`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndClick("//h4[normalize-space(text())='Custom']");
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[1]", emailCredentials.emailFrom);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[2]", emailCredentials.siteName);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[3]", emailCredentials.smtpServer);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[4]", emailCredentials.smtpPort);
        await this.validateAndClick("//input[@id='tls']");
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[5]", emailCredentials.smtpUsername);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[6]", emailCredentials.smtpPassword);
        await this.validateAndClick("//button[normalize-space(text())='Verify Connection and Save Changes']");
        await this.page.waitForLoadState('domcontentloaded');
        await this.assertionValidate("//h3[normalize-space(text())='Email settings are being saved.']");
        await this.assertionValidate("//div[normalize-space(text())='Email configuration has been installed in the server.']");

    }

    async validateEmailSetup(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/email`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.assertionValidate("//button[normalize-space(text())='Update Provider']");
        await this.assertionValidate("//button[normalize-space(text())='Remove Provider']");
        await this.assertionValidate("//h3[text()='Email Sending']/following-sibling::a");
    }

    async sendEmail(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/email`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.validateAndClick("//h3[text()='Email Sending']/following-sibling::a")
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.locator("//input[@id='user_login']").fill('wedevs.testing1@gmail.com');
        await newPage.locator("//input[@id='user_pass']").fill('wedevs.testing1@gmail.com');
        await newPage.locator("//input[@id='wp-submit']").click();
        await newPage.locator("//input[@id='to-email']").fill('tons2468@gmail.com');
        await newPage.locator("//button[normalize-space(text())='Send Test Email']").click();
        await expect(newPage.locator("//p[contains(text(),'Test email has been sent.')]").isVisible).toBeTruthy();
        await newPage.close();
        await this.page.bringToFront();
        await this.assertionValidate("//h3[text()='Email Sending']/following-sibling::a");
    }
    

    async updateEmail(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/email`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndClick("//button[normalize-space(text())='Update Provider']");
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[1]", emailCredentials.emailFrom);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[2]", emailCredentials.updatedSiteName);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[3]", emailCredentials.smtpServer);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[4]", emailCredentials.smtpPort);
        await this.validateAndClick("//input[@id='tls']");
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[5]", emailCredentials.smtpUsername);
        await this.validateAndFillStrings("(//input[contains(@class,'block w-full')])[6]", emailCredentials.smtpPassword);
        await this.validateAndClick("//button[normalize-space(text())='Verify Connection and Save Changes']");
        await this.page.waitForLoadState('domcontentloaded');
        await this.assertionValidate("//h3[normalize-space(text())='Email settings are being saved.']");
        await this.assertionValidate("//div[normalize-space(text())='Email configuration has been updated in the server.']");

    }

    async removeEmail(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/email`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        const dialogHandler = async (dialog: Dialog) => {
            if (dialog.type() === 'confirm') {
                await dialog.accept();
            }
        };
        this.page.on('dialog', dialogHandler);
        await this.validateAndClick("//button[normalize-space(text())='Remove Provider']")
        this.page.off('dialog', dialogHandler);
        await this.assertionValidate("//h3[normalize-space(text())='Email settings are being removed.']");
        await this.assertionValidate("//div[normalize-space(text())='Email configuration removed.']");

    }

}