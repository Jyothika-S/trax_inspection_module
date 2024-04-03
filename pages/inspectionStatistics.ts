import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"

const baseURL = process.env.BASEURL || "";
export class InspStatisticsPage {
    page: Page;
    currentURL: string;
    selectedTab: Locator;
    startDate:  Locator;
    // startDateInput: any;
    startDateInput: Locator;
    startDateBtn: Locator;
    
 

    constructor(page: Page) {
        this.page = page;
        this.startDateInput = page.locator('#startDate')
        this.startDateBtn = page.locator('//*[@id="maincontent"]/div/div/statisticsdashboard-component/section[2]/div/div/div[1]/div[2]/div[1]/mat-form-field/div/div[1]/div[2]/mat-datepicker-toggle/button');
        
        
    }

    async gotoInspStatisticsPage() {
        await this.page.waitForURL(baseURL + inspectionTestData.inspection_statistics);
        this.currentURL = this.page.url();
    }

    async statisticsTabSelection(tab: string){
        this.selectedTab = this.page.getByRole('button', { name: `${tab}` })
        this.selectedTab.click();
    }

//     async selectCurrentDate() {
//     const currentDate = new Date();
//     // Format current date in format (m/d/yyyy)
//     const month = String(currentDate.getMonth() + 1); // Adding 1 to month since January is 0
//     console.log('month: ',month)
//     const day = String(currentDate.getDate());
//     console.log('day: ',day)
//     const year = currentDate.getFullYear();
//     console.log('year: ',year)
//     await this.startDateBtn.click();
//     // const calander = this.page.getByLabel('April 1,').getByText('1').click();
//     await this.page.getByLabel(`${month} ${day}`).getByText(day).click();

// }
}
