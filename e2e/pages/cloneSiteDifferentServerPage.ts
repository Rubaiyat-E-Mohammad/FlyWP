import { Page, BrowserContext } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { permaServerSite } from "../utils/secureData";

let context: BrowserContext;
let siteId: string = '0';

export class CloneSiteDifferentServerPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async cloneSiteToNginx(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/settings`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');

        await this.validateAndClick("//button[normalize-space(text())='Clone']");
        await this.validateAndClick("//p[normalize-space(text())='Clone to Different Server']");
        await this.validateAndClick(`//div[normalize-space(text())='${permaServerSite.server1}']`);
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.validateAndClick("//button[@role='switch']");
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.validateAndClick("//h4[normalize-space(text())='Nginx']");
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
        try {
            // Extract siteId from the redirect URL
            siteId = (await this.extractSiteIdFromRedirect()).toString();
            console.log(`[2] Extracted Site ID: ${siteId}`);
        } catch (error) {
            await this.page.reload();
            siteId = (await this.extractSiteIdFromRedirect()).toString();
            console.log(`[2] Extracted Site ID: ${siteId}`);
        }
        console.log("Site Cloning Started");
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(5000);
        await this.assertionValidate("//p[normalize-space(text())='Cloning complete! You can now access your cloned site on the new server.']");
        await this.validateAndClick("//button[@role='switch']");
        await this.validateAndClick("//label[normalize-space(text())='Automatically delete the site on old server?']/following::input");
        await this.validateAndClick("//button[text()='Confirm']/following-sibling::button");
        try {
            await this.page.locator("//h3[normalize-space(text())='Canceled the source site action.']").waitFor({ timeout: 30000 });
        } catch (error) {
            await this.validateAndClick("//button[text()='Confirm']/following-sibling::button");
            await this.assertionValidate("//h3[normalize-space(text())='Canceled the source site action.']");
        }
        const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
        console.log(siteName);
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        return [siteName, siteId];
    }

    async cloneSiteToOls(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/settings`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');

        await this.validateAndClick("//button[normalize-space(text())='Clone']");
        await this.validateAndClick("//p[normalize-space(text())='Clone to Different Server']");
        await this.validateAndClick(`//div[normalize-space(text())='${permaServerSite.server1}']`);
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.validateAndClick("//button[@role='switch']");
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.validateAndClick("//h4[normalize-space(text())='OpenLiteSpeed']");
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
        try {
            // Extract siteId from the redirect URL
            siteId = (await this.extractSiteIdFromRedirect()).toString();
            console.log(`[2] Extracted Site ID: ${siteId}`);
        } catch (error) {
            await this.page.reload();
            siteId = (await this.extractSiteIdFromRedirect()).toString();
            console.log(`[2] Extracted Site ID: ${siteId}`);
        }
        console.log("Site Cloning Started");
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(5000);
        await this.assertionValidate("//p[normalize-space(text())='Cloning complete! You can now access your cloned site on the new server.']");
        await this.validateAndClick("//button[@role='switch']");
        await this.validateAndClick("//label[normalize-space(text())='Automatically delete the site on old server?']/following::input");
        await this.validateAndClick("//button[text()='Confirm']/following-sibling::button");
        try {
            await this.page.locator("//h3[normalize-space(text())='Canceled the source site action.']").waitFor({ timeout: 30000 });
        } catch (error) {
            await this.validateAndClick("//button[text()='Confirm']/following-sibling::button");
            await this.assertionValidate("//h3[normalize-space(text())='Canceled the source site action.']");
        }
        const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
        console.log(siteName);
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        return [siteName, siteId];
    }

    async validateClonedSite(siteName: string) {
        await this.page.goto(Urls.baseUrl + `/servers`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndClick(`//a[normalize-space(text())='${permaServerSite.server1}']`);
        await this.validateAndClick(`//a[normalize-space(text())='${siteName}']`);
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        await this.validateAndClick("//div[@type='button']");
        await this.assertionValidate("//div[normalize-space(text())='Cloned From']");
    }

    async visitClonedSite(siteName: string, text: string, siteId: string) {
        await this.page.goto(Urls.baseUrl + '/site/' + siteId, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.validateAndClick("//div[@class='py-2']//a[1]")
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(5000);
        await newPage.reload();
        while (true) {
            const isConditionMet = await newPage.locator("//p[@class='wp-block-site-title']//a[1]").textContent() === text;
            if (isConditionMet) {
                break;
            } else {
                await newPage.reload();
            }
        }
        await newPage.close();
        await this.page.bringToFront();
    }

}