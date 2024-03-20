import { PlaywrightTestConfig, test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import loginData from '../test-data/loginData.json'
import { InspLocationPage } from '../pages/inspectionLocation';
import { HomePage } from '../pages/homePage';

let inspId : string;
let location: string;

test.beforeEach('Login Test', async ({ page }) => {
    const login = new LoginPage(page);

    await login.gotoLoginPage()
    await login.login(loginData.username, loginData.password)
    await login.verifyRedirection()
});

test('Navigation to Inspection Locations', async ({ page}) => {
    const expectedList = [];
    const actualList = [];
    
    const gotoInspLocation = new HomePage(page);
    const inspLocation = new InspLocationPage(page);

    await gotoInspLocation.gotoInspLocationPage();
    await inspLocation.verifyInspLocPage();
    await inspLocation.inspPage();
})

