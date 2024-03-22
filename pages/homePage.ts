import { Locator, Page } from "@playwright/test";

export class HomePage {
    page: Page;
    sidePanel: Locator;
    inspectionTab: Locator;
    inspLocation: Locator;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoMenuPage(menuName: string, submenuName: string) {
        const sidePanelToggle = await this.page.getByRole('button', { name: ' Toggle navigation' });
        await sidePanelToggle.click();

        // to find the menu item dynamically
        const menuLocator = this.page.locator('a').filter({ hasText: new RegExp('^' + menuName + '$', 'i') });
        await menuLocator.click();

        const submenuSelector = `//a[span[normalize-space(text()) = "${submenuName}"]]`;
        const submenuLocator = await this.page.waitForSelector(submenuSelector);
        await submenuLocator.click();
    }
}
