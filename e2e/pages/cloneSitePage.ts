import { Page } from '@playwright/test';
import { BasePage } from './base';
import { Urls } from '../utils/testData';
import { permaServerSite } from "../utils/secureData";

export class CloneSitePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async cloneSiteToNginx(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/settings`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');

        await this.validateAndClick("//button[normalize-space(text())='Clone']");
        await this.validateAndClick("//p[normalize-space(text())='Clone to Current Server']");
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
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        return [siteName, siteId];
    }

    async cloneSiteToOls(siteId: string) {
        await this.page.goto(Urls.baseUrl + `/site/${siteId}/settings`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');

        await this.validateAndClick("//button[normalize-space(text())='Clone']");
        await this.validateAndClick("//p[normalize-space(text())='Clone to Current Server']");
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
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        const siteName: string = (await this.validateAndGetText("//div[@class='py-2']//a[1]"))!;
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        return [siteName, siteId];
    }

    async validateClonedSite(siteName: string) {
        await this.page.goto(Urls.baseUrl + `/servers`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndClick(`//a[normalize-space(text())='${permaServerSite.server1}']`);
        //await this.assertionValidate(`//a[normalize-space(text())='${siteName}']//..//..//span[normalize-space(text())='Cloned']`);
        await this.validateAndClick(`//a[normalize-space(text())='${siteName}']`);
        await this.assertionValidate("//span[normalize-space(text())='HTTPS']//..//..//span[normalize-space(text())='Enabled']");
        await this.validateAndClick("//div[@type='button']");
        await this.assertionValidate("//div[normalize-space(text())='Cloned From']");
    }

    async visitClonedSite(siteName: string, text: string, siteId: string) {
        await this.page.goto(Urls.baseUrl + `/servers`, { waitUntil: 'networkidle' });
        await this.page.waitForLoadState('domcontentloaded');
        await this.validateAndClick(`//a[normalize-space(text())='${permaServerSite.server1}']`);
        await this.validateAndClick(`//a[normalize-space(text())='${siteName}']`);
        await this.page.waitForLoadState('domcontentloaded');
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.validateAndClick("//div[@class='py-2']//a[1]")
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(5000);
        await newPage.reload();
        let maxRetries = 10;
        let retries = 0;
        let flag = true;
        while (flag && retries < maxRetries) {
            try {
                await newPage.waitForSelector(`//p[@class='wp-block-site-title']//a[normalize-space(text())='${text}']`, { timeout: 3000 });
                flag = false;
            } catch (error) {
                retries++;
                if (retries >= maxRetries) {
                    console.log(`Element with text "${text}" not found after ${maxRetries} attempts`);
                }
                await newPage.reload();
            }
        }
        await newPage.close();
        await this.page.bringToFront();
    }

}