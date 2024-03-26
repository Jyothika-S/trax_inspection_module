import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

export class InspLogPage {
    page: Page;
    currentURL: string;
    logRow: Locator;
    logRowText: string;

    constructor(page: Page) {
        this.page = page;
        this.logRow = page.locator('#maincontent > div > div > inspectionlog > section.content.col-lg-12.col-md-12.col-sm-12 > div.row > div > div > div > table > tbody:nth-child(2) > tr');
    }

    async gotoInspLogPage() {
        await this.page.waitForURL(inspectionTestData.inspection_log);
        this.currentURL = this.page.url();
    }

    async getLogRowContent() {
        this.logRowText = await this.logRow.innerText();
        console.log('this.logRowText: ', this.logRowText);
    }
}
