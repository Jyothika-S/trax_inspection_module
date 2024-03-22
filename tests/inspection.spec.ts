import { PlaywrightTestConfig, expect, test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import loginData from '../test-data/loginData.json'
import { InspLocationPage } from '../pages/inspectionLocation';
import { HomePage } from '../pages/homePage';
import inspectionTestData from '../test-data/inspectionTestData.json'

let inspId : string;
let location: string;

test.beforeEach('Login Test', async ({ page }) => {
    const login = new LoginPage(page);

    await login.gotoLoginPage()
    await login.login(loginData.username, loginData.password)
    await login.verifyRedirection()
});

test('Navigation to Inspection Locations', async ({ page}) => {
    const homePage = new HomePage(page);
    const inspLocation = new InspLocationPage(page);

    await homePage.gotoMenuPage('Inspections', 'Inspection Logs');
    await inspLocation.verifyInspLocPage();
    await inspLocation.inspPage();

    //assertions
    expect(inspLocation.currentURL).toBe(inspectionTestData.inspection_location)
    expect(inspLocation.inspectionLocationsText).toContain('INSPECTION LOCATIONS')
    expect(inspLocation.inspectionLocationsText).not.toBeNull();
    expect(inspLocation.inspIdText).toContain('Inspection #:');
    expect(inspLocation.locationText).toContain('Location:');
    expect(inspLocation.tableHeaderText).toContain('Element Image	Element Name	Rating	Comment With Attachment');
    expect(inspLocation.attachmentCount).toContain('1');
    expect(inspLocation.confirmPopupTitleText).toContain('Follow-up needed?')
    expect(inspLocation.confirmPopupContentText).toContain('Would you like to create a follow-up alert?')
    expect(inspLocation.completeInspYesBtn.isVisible()).toBeTruthy();
    expect(inspLocation.completeInspNoBtn.isVisible()).toBeTruthy();
    expect(inspLocation.currentURL).toBe(inspectionTestData.inspection_location)
    
    



})

