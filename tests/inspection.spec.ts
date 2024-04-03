import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import loginData from '../test-data/loginData.json'
import { InspLocationPage } from '../pages/inspectionLocation';
import { HomePage } from '../pages/homePage';
import { InspLogPage } from '../pages/inspectionLog'
import inspectionTestData from '../test-data/inspectionTestData.json'
import { InspOverviewPage } from '../pages/inspectionOverview';
import { InspStatisticsPage } from '../pages/inspectionStatistics';

let inspId : string;
let location: string;
let venue: string;
const baseURL = process.env.BASEURL || "";

test('Inspection Workflow: Login, Create, Verify Details', async ({page}) => {
    const login = new LoginPage(page);
    const homePage = new HomePage(page);
    const inspLocation = new InspLocationPage(page);
    const inspLogPage = new InspLogPage(page);
    const inspOverviewPage = new InspOverviewPage(page);
    const inspStatisticsPage = new InspStatisticsPage(page);

    //login to application
    await test.step('Login to application', async () => {
        await login.gotoLoginPage()
        await login.login(loginData.username, loginData.password)
        await login.verifyRedirection()
    })

    //Inspection location page verification
    await test.step('Verify inspection location page', async () => {
        await homePage.toggleSidePanel();
        await homePage.gotoMenuPage('Inspections', 'Inspection Locations');
        await inspLocation.verifyInspLocPage();
        expect(inspLocation.currentURL).toBe(baseURL + inspectionTestData.inspection_location)
        expect(inspLocation.inspectionLocationsText).toContain('INSPECTION LOCATIONS')
        expect(inspLocation.inspectionLocationsText).not.toBeNull();
        expect(inspLocation.venue).toContainText('● Venue');
        venue = inspLocation.venueText;
        console.log("venue from spec: ",venue);
    
    })

    //creates new inspection
    await test.step('Create new inspection', async () => {
        await inspLocation.inspPage();
        //assertions
        expect.soft(inspLocation.inspIdText).toContain('Inspection #:');
        expect.soft(inspLocation.locationText).toContain('Location:');
        expect.soft(inspLocation.tableHeaderText).toContain('Element Image	Element Name	Rating	Comment With Attachment');
        expect.soft(inspLocation.attachmentCount).toContain('1');
        expect.soft(inspLocation.confirmPopupTitleText).toContain('Follow-up needed?')
        expect.soft(inspLocation.confirmPopupContentText).toContain('Would you like to create a follow-up alert?')
        expect.soft(inspLocation.completeInspYesBtn.isVisible()).toBeTruthy();
        expect.soft(inspLocation.completeInspNoBtn.isVisible()).toBeTruthy();
        expect(inspLocation.currentURL).toBe(baseURL + inspectionTestData.inspection_location)

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
        expect.soft(inspLogPage.logRowText).toContain(inspId);
        expect.soft(inspLogPage.logRowText).toContain('Complete');
    })

    //verify the edit of the created inspection
    await test.step('Verifying if the details are present on the inspection\'s edit page', async() => {
        await inspLogPage.verifyEditDetails();
        expect(inspLogPage.inspIdText).toContain(inspId);
        expect(inspLogPage.inspLocText).toContain(location);
    })

    //check if currently completed inspection is found in Inspection Overview
    await test.step('Verifying if the details are present on the inspection\'s overview page', async() => {
        await homePage.gotoMenuPage('Inspection Overview', ' ');
        await inspOverviewPage.gotoInspOverviewPage();
        console.log("venue printed from overview: ", venue)
        await inspOverviewPage.selectVenue(venue)
        await inspOverviewPage.verifyFilteredInspection(venue)
        expect.soft(inspOverviewPage.inspIdText).toContain(inspId)
    })

    //verify inspection tab in statistics
    await test.step('Verifying the details in the statistics page', async() => {
        await homePage.gotoMenuPage('Statistics', ' ');
        await inspStatisticsPage.gotoInspStatisticsPage();
        await inspStatisticsPage.statisticsTabSelection('Inspection')
        // await inspStatisticsPage.selectCurrentDate();
    })
})


