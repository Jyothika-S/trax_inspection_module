import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

const baseURL = process.env.BASEURL || "";
export class InspOverviewPage {
    page: Page;
    currentURL: string;
    venueFilter: Locator;
    venueOption: string;
    applyBtn: Locator;
    venueOptionDropdown: Locator;
    // optionLocator: Locator;
    expandVenue: Locator;
    inspId: Locator;
    inspIdText: string;

    constructor(page: Page) {
        this.page = page;
        this.venueFilter = page.locator('span').filter({ hasText: 'Select Venue' }).first()
        this.venueOptionDropdown = page.locator('ul.item2');
        this.applyBtn = page.getByRole('button', { name: 'Apply' })
        this.inspId = page.locator('#maincontent > div > div > overviewdashboard-component > section.content.col-lg-12.col-md-12.col-sm-12 > div:nth-child(2) > div.col-md-12.venue-section > div.col-md-9 > div > div.col-md-8.expandmaxheight > div > div:nth-child(2) > p:nth-child(3)')
    }

    async gotoInspOverviewPage() {
        await this.page.waitForURL(baseURL + inspectionTestData.urls.inspection_overview);
        this.currentURL = this.page.url();
    }

    async selectVenue(venue: string) {
        this.venueFilter.click();
        const optionLocator = this.venueOptionDropdown.locator(`li div:has-text("${venue}")`).nth(1);
        await optionLocator.click();
        this.applyBtn.click();
    }

    async verifyFilteredInspection(venue: string){
        this.expandVenue = this.page.getByRole('link', { name: `▶ ${venue}` })
        this.expandVenue.click();
        this.inspIdText = await this.inspId.innerHTML();
        console.log("this.inspIdText: ", this.inspIdText)
    }
}
