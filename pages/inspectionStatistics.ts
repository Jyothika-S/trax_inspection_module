import { Locator, Page } from "@playwright/test";
import inspectionTestData from "../test-data/inspectionTestData.json"
import { ReusableMethods } from "../utils/reusable-methods";


const baseURL = process.env.BASEURL || "";
export class InspStatisticsPage {
    page: Page;
    currentURL: string;
    selectedTab: Locator;
    startDate:  Locator;
    startDateInput: Locator;
    startDateBtn: Locator;
    completedInspTableTitle: Locator;
    completedInspTableTitleText: string;
    graphElements: string[] = [];
    elementText: string;
    applyBtn: Locator;
 

    constructor(page: Page) {
        this.page = page;
        this.startDateInput = page.locator('#startDate')
        this.startDateBtn = page.locator('//*[@id="maincontent"]/div/div/statisticsdashboard-component/section[2]/div/div/div[1]/div[2]/div[1]/mat-form-field/div/div[1]/div[2]/mat-datepicker-toggle/button');
        this.completedInspTableTitle = page.getByRole('heading', { name: 'Completed Inspections' }).nth(1);
        this.applyBtn = page.getByRole('button', { name: 'Apply' })
    }

    async gotoInspStatisticsPage() {
        await this.page.waitForURL(baseURL + inspectionTestData.urls.inspection_statistics);
        this.currentURL = this.page.url();
    }

    async statisticsTabSelection(tab: string){
        this.selectedTab = this.page.getByRole('button', { name: `${tab}` })
        this.selectedTab.click();
    }

    async verifyCompltedTable() {
        this.completedInspTableTitleText = await this.completedInspTableTitle.innerHTML();
        console.log('completedInspTableTitleText: ',this.completedInspTableTitleText)
    }

    async verifyElementsGraph() {

        for (let i = 1; i <= 5; i++) {
            const xpath = `#elementsInspected > div > div > svg:nth-child(1) > g.cartesianlayer > g > g.xaxislayer-above > g:nth-child(${i}) > text`;
            const elementColumn = this.page.locator(xpath);
            //extracts text within an SVG 
            const extractText = await elementColumn.evaluateHandle((element) => element.textContent);
            this.elementText = await extractText.jsonValue() as string;
            this.graphElements.push(this.elementText.trim());
        }
    
        console.log("Elements in element graph: ", this.graphElements);
    }

    //custom day
    async selectCurrentDate(customDay: number) {
        const reusableMethods = new ReusableMethods();
        const currentDate = await reusableMethods.getCurrentFormattedDate();
        const { month, year } = currentDate;
        console.log('month consoled from pom: ', month);
        console.log('year consoled from pom: ', year);
        console.log('custom day chosen: ', customDay);
        await this.startDateBtn.click();
        //custom day
        const cstmDay = `${month} ${customDay}, ${year}`;
        await this.page.getByLabel(cstmDay).click();
    }

    async applyDate() {
        await this.applyBtn.click();
    }
    
}
