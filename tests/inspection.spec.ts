import { Page, expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import loginData from '../test-data/loginData.json'
import { InspLocationPage } from '../pages/inspectionLocation';
import { HomePage } from '../pages/homePage';
import { InspLogPage } from '../pages/inspectionLog'
import inspectionTestData from '../test-data/inspectionTestData.json'
import { InspOverviewPage } from '../pages/inspectionOverview';

let inspId : string;
let location: string;
let venue: string;

test.beforeEach('Login Test', async ({page}) => {
    const login = new LoginPage(page);
    await login.gotoLoginPage()
    await login.login(loginData.username, loginData.password)
    await login.verifyRedirection()
});

test('verify Inspection location page', async ({page}) => {
    const homePage = new HomePage(page);
    const inspLocation = new InspLocationPage(page);
    await homePage.toggleSidePanel();
    await homePage.gotoMenuPage('Inspections', 'Inspection Locations');
    await inspLocation.verifyInspLocPage();
    expect(inspLocation.currentURL).toBe(inspectionTestData.inspection_location)
    expect(inspLocation.inspectionLocationsText).toContain('INSPECTION LOCATIONS')
    expect(inspLocation.inspectionLocationsText).not.toBeNull();
    expect(inspLocation.venue).toContainText('● Venue');

    

})

test('Inspection', async ({page}) => {
    const homePage = new HomePage(page);
    const inspLocation = new InspLocationPage(page);
    const inspLogPage = new InspLogPage(page);
    const inspOverviewPage = new InspOverviewPage(page);
//creates new inspection
    await test.step('create new inspection', async () => {
        await homePage.toggleSidePanel();
        await homePage.gotoMenuPage('Inspections', 'Inspection Locations');
        await inspLocation.verifyInspLocPage();
        venue = inspLocation.venueText;
        console.log("venue from spec: ",venue);
        await inspLocation.inspPage();
        //assertions
        expect(inspLocation.inspIdText).toContain('Inspection #:');
        expect(inspLocation.locationText).toContain('Location:');
        expect(inspLocation.tableHeaderText).toContain('Element Image	Element Name	Rating	Comment With Attachment');
        expect(inspLocation.attachmentCount).toContain('1');
        expect(inspLocation.confirmPopupTitleText).toContain('Follow-up needed?')
        expect(inspLocation.confirmPopupContentText).toContain('Would you like to create a follow-up alert?')
        expect(inspLocation.completeInspYesBtn.isVisible()).toBeTruthy();
        expect(inspLocation.completeInspNoBtn.isVisible()).toBeTruthy();
        expect(inspLocation.currentURL).toBe(inspectionTestData.inspection_location)

        inspId = inspLocation.inspectionId;
        location = inspLocation.location;
    })

    //Check if the completed inspection is found in Inspection Log
    await test.step('Check if the completed inspection is found in Inspection Log', async () => {

        // const inspLocation = new InspLocationPage(page);
        // await homePage.toggleSidePanel();
        await homePage.gotoMenuPage('', '');
        await homePage.gotoMenuPage('Inspections', 'Inspection Logs');

        console.log("id from global: ", inspId)
        console.log("loc from global", location)
        await inspLogPage.gotoInspLogPage();
        await inspLogPage.getLogRowContent();

        // Verify if log contains ID and its status - "Complete"
        expect(inspLogPage.logRowText).toContain(inspId);
        expect(inspLogPage.logRowText).toContain('Complete');
    })

    //verify the edit of the created inspection
    await test.step('verify inspection edit', async() => {
        await inspLogPage.verifyEditDetails();
        expect(inspLogPage.inspIdText).toContain(inspId);
        expect(inspLogPage.inspLocText).toContain(location);
    })

    //check if currently completed inspection is found in Inspection Overview
    await test.step('verify Inspection Overview', async() => {
        await homePage.gotoMenuPage('Inspection Overview', ' ');
        await inspOverviewPage.gotoInspOverviewPage();
        console.log("venue printed from overview: ", venue)
        await inspOverviewPage.selectVenue(venue)
        await inspOverviewPage.verifyFilteredInspection(venue)
        expect(inspOverviewPage.inspIdText).toContain(inspId)
    })
})


