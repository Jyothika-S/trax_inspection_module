import { Locator, Page, expect } from "@playwright/test";

// let inspId : string;
// let location: string;

export class InspLocationPage {
    page: Page;
    sidePanel: Locator;
    inspectionTab: Locator;
    inspLocation: Locator;
    locName: Locator;
    inspNowBtn: Locator;
    inspectionIdElement: Locator;
    locationElement: Locator;
    inspectionId: string;
    location: string;
    commentBox: Locator;
    ratingAirPurifier: Locator;
    ratingMirror: Locator;
    ratingClothes: Locator;
    ratingToilet: Locator;
    ratingConsumables: Locator;
    

    constructor(page: Page) {
        this.page = page;
        this.sidePanel = page.getByRole('button', { name: ' Toggle navigation' })
        this.inspectionTab = page.locator('a').filter({ hasText: /^Inspections$/ })
        this.inspLocation = page.getByRole('link', { name: '● Inspection Locations' })
        this.locName = page.locator('#maincontent > div > div > locationoverview > section.content > div:nth-child(2) > div > div > div > table > tbody > tr > td')
        this.inspNowBtn = page.locator('div').filter({ hasText: /^Inspect Now$/ }).locator('i')
        this.inspectionIdElement = page.locator('#maincontent > div > div > inspection > div > section.content-header.element-header > div > div.col-lg-7.col-sm-12.col-md-6 > span:nth-child(1)')
        this.locationElement = page.locator('#maincontent > div > div > inspection > div > section.content-header.element-header > div > div.col-lg-7.col-sm-12.col-md-6 > span:nth-child(2)')
        this.ratingAirPurifier = page.getByRole('button', { name: '4' })
        this.ratingMirror = page.locator('#mat-button-toggle-9-button');
        this.ratingClothes = page.locator('#mat-button-toggle-15-button')
        this.ratingToilet = page.locator('#mat-button-toggle-18-button')
        this.ratingConsumables = page.getByRole('button', { name: 'Complete', exact: true })
        this.commentBox = page.getByPlaceholder('Place inspection comments here')
    }

    async gotoInspLocationPage(){
        await this.sidePanel.click();
        await this.inspectionTab.click();
        await this.inspLocation.click();
    }

    async verifyInspLocPage(){
        await this.page.waitForURL('https://app.qa.traxinsights.app/#/location-overview');

        const currentURL = this.page.url();
        expect(currentURL).toBe('https://app.qa.traxinsights.app/#/location-overview');

        const inspectionLocationsText = this.page.locator('text=INSPECTION LOCATIONS').first();
        expect(inspectionLocationsText).not.toBeNull();

        // await expect(this.page.locator('th')).toContainText('Location Name');

        // await page.getByRole('cell', { name: 'Automation Test Location' }).click();
        await this.locName.click();
        await this.inspNowBtn.click();
        await this.page.waitForURL('https://app.qa.traxinsights.app/#/inspection');
    }

    async inspPage() {
        await this.page.waitForURL('https://app.qa.traxinsights.app/#/inspection');
        // await expect(this.page.locator('inspection')).toContainText('Inspection #: 142924');
        // await expect(this.page.locator('inspection')).toContainText('Location: Automation Test Location');

        // Extracting Inspection Number
        const inspIdText = await this.inspectionIdElement.innerText();
        this.inspectionId = inspIdText.split(': ')[1];


        // Extracting Location
        const locationText = await this.locationElement.innerText();
        this.location = locationText.split(': ')[1];

        // extracted values in assertions
        await expect(inspIdText).toContain('Inspection #:');
        await expect(locationText).toContain('Location:');

        console.log("ispID: ", this.inspectionId)
        console.log("loc: ", this.location)

        //verify table headers and comment textbox
        await expect(this.page.locator('thead')).toContainText('Element Image');
        await expect(this.page.locator('thead')).toContainText('Element Name');
        await expect(this.page.locator('thead')).toContainText('Rating');
        await expect(this.page.locator('thead')).toContainText('Comment With Attachment');
        expect(await this.commentBox.isVisible()).toBe(true);
        await expect(this.page.getByRole('table')).toContainText('Air Purifier');
        await expect(this.page.getByRole('table')).toContainText('Mirror');
        await expect(this.page.getByRole('table')).toContainText('Clothes & Liquid');
        await expect(this.page.getByRole('table')).toContainText('Toilet and Urinals');
        await expect(this.page.getByRole('table')).toContainText('Consumables');
        //actions
        await this.ratingAirPurifier.click();
        // await this.page.waitForSelector('#scoreFactor_3');
await this.ratingMirror.click();
        await this.ratingClothes.click();
        await this.ratingToilet.click();
        await this.ratingConsumables.click();

        await this.commentBox.click();
        await this.commentBox.fill('testcomment');



        
    }


    

}

