import { Locator, Page } from "@playwright/test";

export default class SigninPage {
    readonly page: Page;
    readonly emailTextbox: Locator;
    readonly continueButton: Locator;
    readonly passwordTextbox: Locator;
    readonly signInButton: Locator;

    constructor(page: Page){
        this.page = page;
        this.emailTextbox = page.getByRole('textbox', { name: 'Email address*' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.passwordTextbox = page.getByRole('textbox', { name: 'Password (required)' })
        this.signInButton = page.getByRole('button', { name: 'Sign in to Ramp' });
    }

    // Dynamic locators
    errorMessage = (errorMessage: string) => this.page.getByText(errorMessage);
    emailErrorIcon = () => this.page.locator('input[name="email"]').locator('xpath=ancestor::div[contains(@class, "RyuInputBaseRoot")]').locator('.RyuIconSvg--alert-octagon');
    passwordErrorIcon = () => this.page.locator('input[name="password"]').locator('xpath=ancestor::div[contains(@class, "RyuInputBaseRoot")]').locator('.RyuIconSvg--alert-octagon');
    
    // Actions
    async goto() {
        await this.page.goto("/sign-in");
    };

    async clickContinue(){
        await this.continueButton.click();
    };

    async clickSignIn(){
        await this.signInButton.click();
    };

    async clickSignUpLink(){
        await this.page.locator('[data-test-id="sign-up-link"]').click();
    };

    async useADifferentEmail(){
        await this.page.locator('[data-test-id="use-a-different-email-link"]').click();
    };

    async resetPassword(){
        await this.page.getByRole('link', { name: 'Reset password' }).click();
    };

    async signinUser({
        email,
        password
    }: {
        email: string,
        password: string
    }) {
        await this.enterEmail({ email });
        await this.clickContinue();
        await this.enterPassword({ password });
        await this.clickSignIn();
    };

    async enterEmail({
        email
    }: {
        email: string;
    }) {
        await this.emailTextbox.fill(email);
    };

    async enterPassword ({
        password
    }: {
        password: string;
    }) {
        await this.passwordTextbox.fill(password);
    };

}