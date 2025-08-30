import { Locator, Page } from "@playwright/test";

export default class VerifyEmailPage {
    readonly page: Page;
    readonly header: Locator;
    readonly searchInEmailLink: Locator;
    readonly resendEmailLink: Locator;
    
    
    constructor(page: Page){
        this.page = page;
        this.header = page.getByRole('heading', { name: 'Verify your email' });
        this.searchInEmailLink = page.getByRole('link', { name: 'Search for verify your Ramp' });
        this.resendEmailLink = page.getByRole('button', { name: 'Re-send Email' });
    }

    emailDisplay = (email: string) => this.page.getByText(email);

}