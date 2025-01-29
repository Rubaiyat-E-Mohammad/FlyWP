import { Page } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { permaServerSite } from "../utils/secureData";

export class TransferSitePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async transferSite(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/settings`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');

        await this.validateAndClick("//button[normalize-space(text())='Transfer']");
        await this.validateAndClick(`//div[normalize-space(text())='${permaServerSite.server1}']`);
        await this.validateAndClick("//button[normalize-space(text())='Next']");
        await this.assertionValidate("//h3[normalize-space(text())='Creating Site...']");
        try {
 
            siteId = (await this.extractSiteIdFromRedirect()).toString();
            console.log(`[2] Extracted Site ID: ${siteId}`);
        } catch (error) {
            await this.page.reload();
            siteId = (await this.extractSiteIdFromRedirect()).toString();
            console.log(`[2] Extracted Site ID: ${siteId}`);
        }
        console.log("Site Transfering Started");
        
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(5000);
        await this.assertionValidate("//p[normalize-space(text())='Transfer successful! Your site has been moved to the new server.']");
        await this.validateAndClick("//button[@role='switch']");
        await this.validateAndClick("//label[normalize-space(text())='Automatically delete the site on old server?']/following::input");
        await this.validateAndClick("//button[text()='Confirm']/following-sibling::button");
        try {
            await this.assertionValidate("//h3[normalize-space(text())='Canceled the source site action.']");
        } catch (error) {
            await this.validateAndClick("//button[text()='Confirm']/following-sibling::button");
            await this.assertionValidate("//h3[normalize-space(text())='Canceled the source site action.']");
        }
        const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
        console.log(siteName);
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        return [siteName, siteId];
    }

    async validateTransferredSite(siteName: string) {
        await this.page.goto(Urls.baseUrl + `/servers`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndClick(`//a[normalize-space(text())='${permaServerSite.server1}']`);
        await this.validateAndClick(`//a[normalize-space(text())='${siteName}']`);
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        await this.validateAndClick("//div[@type='button']");
    }

    async visitTransferredSite(siteName: string, text: string, siteId: string) {
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