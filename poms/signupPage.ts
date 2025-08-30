import { Locator, Page } from "@playwright/test";

export default class SignupPage {
    readonly page: Page;
    readonly emailTextbox: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly startApplicationButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailTextbox = page.getByRole('textbox', { name: 'Work email address' });
        this.firstNameTextbox = page.getByRole('textbox', { name: 'First name (required)' });
        this.lastNameTextbox = page.getByRole('textbox', { name: 'Last name (required)' });
        this.passwordTextbox = page.getByLabel('Choose a password (required)');
        this.startApplicationButton = page.getByRole('button', { name: 'Start application' });
    }

    // Dynamic locators
    errorMessage = (errorMessage: string) => this.page.getByText(errorMessage);

    firstNameErrorMessage = () => this.page.locator('.RyuGridItemRoot-dChSeW', { has: this.page.locator('[name="first_name"]') }).locator('.RyuInputBaseRoot--hasError');
    lastNameErrorMessage = ()  => this.page.locator('.RyuGridItemRoot-dChSeW', { has: this.page.locator('[name="last_name"]') }).locator('.RyuInputBaseRoot--hasError');

    emailErrorIcon = () => this.page.locator('input[name="email"]').locator('xpath=ancestor::div[contains(@class, "RyuInputBaseRoot")]').locator('.RyuIconSvg--alert-octagon');
    firstNameErrorIcon = () => this.page.locator('input[name="first_name"]').locator('xpath=ancestor::div[contains(@class, "RyuInputBaseRoot")]').locator('.RyuIconSvg--alert-octagon');
    lastNameErrorIcon = () => this.page.locator('input[name="last_name"]').locator('xpath=ancestor::div[contains(@class, "RyuInputBaseRoot")]').locator('.RyuIconSvg--alert-octagon');
    passwordErrorIcon = () => this.page.locator('input[name="password"]').locator('xpath=ancestor::div[contains(@class, "RyuInputBaseRoot")]').locator('.RyuIconSvg--alert-octagon');
    
    showPasswordButton = () => this.page.getByRole('button', { name: 'Show password' });
    hidePasswordButton = () => this.page.getByRole('button', { name: 'Hide password' });

    passwordInput = () => this.page.locator('input[name="password"]');

    password12CharactersChecked = () => this.page.getByText('At least 12 characters').locator('.RyuIconSvg--check-square');
    password12CharactersCrossed = () => this.page.getByText('At least 12 characters').locator('.RyuIconSvg--x-square');
    passwordLowercaseChecked = () => this.page.getByText('At least 1 lowercase character').locator('.RyuIconSvg--check-square');
    passwordLowercaseCrossed = () => this.page.getByText('At least 1 lowercase character').locator('.RyuIconSvg--x-square');
    passwordUppercaseChecked = () => this.page.getByText('At least 1 uppercase character').locator('.RyuIconSvg--check-square');
    passwordUppercaseCrossed = () => this.page.getByText('At least 1 uppercase character').locator('.RyuIconSvg--x-square');
    passwordNumberChecked = () => this.page.getByText('At least 1 uppercase character').locator('.RyuIconSvg--check-square');
    passwordNumberCrossed = () => this.page.getByText('At least 1 uppercase character').locator('.RyuIconSvg--x-square');
    passwordNotCommonlyUsedChecked = () => this.page.getByText('Not a commonly used password').locator('.RyuIconSvg--check-square');
    passwordNotCommonlyUsedCrossed = () => this.page.getByText('Not a commonly used password').locator('.RyuIconSvg--x-square');

    // Actions
    async goto() {
        await this.page.goto("/sign-up");
    };
  
    async signupUser({
        email,
        firstName,
        lastName,
        password,
      }: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
      }) {
        await this.enterEmail({ email });
        await this.enterFirstName({ firstName });
        await this.enterLastName({ lastName });
        await this.enterPassword({ password });
        await this.clickStartApplicationButton();
    };

    async enterEmail({
        email
    }: {
        email: string;
    }) {
        await this.emailTextbox.fill(email);
    };

    async enterFirstName ({
        firstName
    }: {
        firstName: string;
    }) {
        await this.firstNameTextbox.fill(firstName);
    };

    async enterLastName ({
        lastName
    }: {
        lastName: string;
    }) {
        await this.lastNameTextbox.fill(lastName);
    };

    async enterPassword ({
        password
    }: {
        password: string;
    }) {
        await this.passwordTextbox.fill(password);
    };

    async hidePassword(){
        await this.hidePasswordButton().click();
    };

    async showPassword(){
        await this.showPasswordButton().click();
    };

    async pressEnter(){
        await this.page.keyboard.press('Enter');
    };

    async clickStartApplicationButton(){
        await this.startApplicationButton.click();
    };

}