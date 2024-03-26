import { Locator, Page } from "@playwright/test";

export class HomePage {
    page: Page;
    sidePanelToggle: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sidePanelToggle = page.getByRole('button', { name: ' Toggle navigation' });
    }
    async toggleSidePanel() {
        await this.sidePanelToggle.click();
    }

    async gotoMenuPage(menuName: string, submenuName: string) {
        // await this.toggleSidePanel();

        // to find the menu item dynamically
        const menuLocator = this.page.locator('a').filter({ hasText: new RegExp('^' + menuName + '$', 'i') });
        await menuLocator.click();

        const submenuSelector = `//a[span[normalize-space(text()) = "${submenuName}"]]`;
        const submenuLocator = await this.page.waitForSelector(submenuSelector);
        await submenuLocator.click();       
    }
}
