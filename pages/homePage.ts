import { Locator, Page } from "@playwright/test";

export class HomePage {
    page: Page;
    sidePanelToggle: Locator;
    menuSelector: Locator;
    // submenuSelector: string;
    // submenuLocator: string;

    constructor(page: Page) {
        this.page = page;
        this.sidePanelToggle = page.getByRole('button', { name: ' Toggle navigation' });
        this.menuSelector = page.locator('a')
        // this.submenuSelector = '//a[span[normalize-space(text()) = "${submenuName}"]]'
    }
    async toggleSidePanel() {
        await this.sidePanelToggle.click();
    }

    async gotoMenuPage(menuName: string, submenuName: string) {
        // await this.toggleSidePanel();

        // to find the menu item dynamically
        const menuLocator = this.menuSelector.filter({ hasText: new RegExp('^' + menuName + '$', 'i') });
        await menuLocator.click();

        // if (submenuName) {
        //     const submenuSelector = `//a[span[normalize-space(text()) = "${submenuName}"]]`;
        //     const submenuLocator = await this.page.waitForSelector(submenuSelector);
        //     await submenuLocator.click();
        // }else {
        //     console.log('No submenu provided. Skipping submenu click.');
        // }  
            const submenuSelector = `//a[span[normalize-space(text()) = "${submenuName}"]]`;
    
            try {
                const submenuLocator = await this.page.waitForSelector(submenuSelector, { timeout: 5000 });
                await submenuLocator.click();
            } catch (error) {
                console.log('Submenu not found');
            }
    }
}
