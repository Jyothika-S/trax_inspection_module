import { Locator, Page, expect } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

// let inspId : string;
// let location: string;

export class InspLocationPage {
    page: Page;
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
    attachmentPopupBtn: Locator;
    attachmentBtn: Locator;
    imgUpload: Locator;
    attachmentComments: Locator;
    attachmentSaveBtn: Locator;
    completeInspBtn: Locator;
    completeInspYesBtn: Locator;
    completeInspNoBtn: Locator;


    constructor(page: Page) {
        this.page = page;
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
        this.attachmentPopupBtn = page.getByRole('button', { name: '' }).first()
        this.attachmentBtn = page.getByRole('button', { name: '+ Add Attachments' })
        this.imgUpload = page.locator('input[name="file_1"]')
        this.attachmentComments = page.getByPlaceholder('Comments', { exact: true })
        this.attachmentSaveBtn = page.getByRole('button', { name: 'Save' })
        this.completeInspBtn = page.getByRole('button', { name: 'Complete Inspection' })
        this.completeInspYesBtn = page.getByRole('button', { name: 'Yes' })
        this.completeInspNoBtn = page.getByRole('button', { name: 'No' })
    }

    async verifyInspLocPage(){
        await this.page.waitForURL(inspectionTestData.inspection_location);

        const currentURL = this.page.url();
        expect(currentURL).toBe(inspectionTestData.inspection_location);

        const inspectionLocationsText = this.page.locator('text=INSPECTION LOCATIONS').first();
        expect(inspectionLocationsText).not.toBeNull();

        // await expect(this.page.locator('th')).toContainText('Location Name');

        // await page.getByRole('cell', { name: 'Automation Test Location' }).click();
        await this.locName.click();
        await this.inspNowBtn.click();
        await this.page.waitForURL(inspectionTestData.inspection);
    }

    async inspPage() {
        await this.page.waitForURL(inspectionTestData.inspection);
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
        await this.ratingMirror.click();
        await this.ratingClothes.click();
        await this.ratingToilet.click();
        await this.ratingConsumables.click();
        await this.commentBox.click();
        await this.commentBox.fill('testcomment');

        //add attachment
        await this.attachmentPopupBtn.click();
        await this.attachmentBtn.click();
        await this.imgUpload.setInputFiles('uploadItems/sampleFile.jpeg');
        await this.attachmentComments.fill('test comment');
        await this.attachmentSaveBtn.click();
        await expect(this.page.getByRole('table')).toContainText('1');

        //complete inspection part
        await this.completeInspBtn.click();
        await expect(this.page.getByRole('heading')).toContainText('Follow-up needed?');
        await expect(this.page.getByRole('paragraph')).toContainText('Would you like to create a follow-up alert?');
        await expect(this.completeInspYesBtn).toBeVisible();
        await expect(this.completeInspNoBtn).toBeVisible();
        await this.completeInspNoBtn.click();
        await this.page.waitForURL(inspectionTestData.inspection_location);
        const currentURL = this.page.url();
        await expect(currentURL).toBe(inspectionTestData.inspection_location);
     
    }

}
