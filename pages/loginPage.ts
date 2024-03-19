import { ElementHandle, Locator, Page, expect } from '@playwright/test';

export class LoginPage {
    page: Page;
    username: Locator;
    password: Locator;
    signInBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.username = page.getByPlaceholder('Email ID');
        this.password = page.getByPlaceholder('Password');
        this.signInBtn = page.getByRole('button', { name: 'Sign In' })
    }

    async gotoLoginPage(){
        await this.page.goto('https://app.qa.traxinsights.app/#/login')
    }
    async login(username: string, password: string){
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signInBtn.click();
    }

    async verifyRedirection(){
        await this.page.waitForURL('https://app.qa.traxinsights.app/#/dashboard');

        const currentURL = this.page.url();
        expect(currentURL).toBe('https://app.qa.traxinsights.app/#/dashboard');
    }
    
}