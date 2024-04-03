import { ElementHandle, Locator, Page, expect } from '@playwright/test';
import inspectionTestData from "../test-data/inspectionTestData.json"


const baseURL = process.env.BASEURL || "";
export class LoginPage {
    page: Page;
    username: Locator;
    password: Locator;
    signInBtn: Locator;
    currentURL: string;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByPlaceholder('Email ID');
        this.password = page.getByPlaceholder('Password');
        this.signInBtn = page.getByRole('button', { name: 'Sign In' })
    }

    async gotoLoginPage(){
        await this.page.goto(baseURL + inspectionTestData.urls.login)
    }
    async login(username: string, password: string){
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInBtn.click();
    }

    async verifyRedirection(){
        await this.page.waitForURL(baseURL + inspectionTestData.urls.home);
        this.currentURL = this.page.url(); 
    }
    
}