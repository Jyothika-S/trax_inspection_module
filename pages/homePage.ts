import { Locator, Page, expect } from "@playwright/test";

export class HomePage {
    page: Page;
    sidePanel: Locator;
    inspectionTab: Locator;
    inspLocation: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sidePanel = page.getByRole('button', { name: ' Toggle navigation' })
        this.inspectionTab = page.locator('a').filter({ hasText: /^Inspections$/ })
        this.inspLocation = page.getByRole('link', { name: '● Inspection Locations' })
    }

    async gotoInspLocationPage(){
        await this.sidePanel.click();
        await this.inspectionTab.click();
        await this.inspLocation.click();
    }

}