import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { URL } from "../../constants/url";
import { test } from "../../fixtures";
import { ERROR_MESSAGES } from "../../constants/texts";

test.describe("Signup page", () => {

    test.beforeEach(async ({ signupPage }) => {
        await signupPage.goto();
    });

    test("should successfully sign up using correct details", async ({ page, signupPage, verifyEmailPage }) => {
        const email = faker.internet.username() + "@abcdef.com";
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const password = "Password123!123";

        await signupPage.signupUser({ email, firstName, lastName, password });

        // Check if user is redirected successfully
        await expect(page).toHaveURL(URL.verifyEmailPage, { timeout: 20_000 });

        // Check if Verify your email heading is displayed
        await expect(verifyEmailPage.header).toBeVisible();

        // Check if correct email is displayed
        await expect(verifyEmailPage.emailDisplay(email)).toBeVisible();
    });

    test("should redirect to sign in page when email is existing", async ({ page, signupPage, signinPage }) => {
        const email = "aa@aa.com"
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const password = "Password123!123";

        await signupPage.signupUser({ email, firstName, lastName, password });

        // Assert that user is redirected to sign in page
        await expect(page).toHaveURL(URL.signinPage);

        // Assert that email field is populated with correct email
        await expect(signinPage.emailTextbox).toHaveAttribute('value', email);
    });

    test("should display all errors when Start application is clicked without any input", async ({ signupPage }) => {
        await signupPage.clickStartApplicationButton();

        // Assert that all fields have error icons
        await expect(signupPage.emailErrorIcon()).toBeVisible();
        await expect(signupPage.firstNameErrorIcon()).toBeVisible();
        await expect(signupPage.lastNameErrorIcon()).toBeVisible();
        await expect(signupPage.passwordErrorIcon()).toBeVisible();
    });

    const invalidEmails = [
        "usernameonly",
        "usernameonly" + '@',
        "gmail.com",
        "email add@abc.com",
        ".email@email.com",
        "abc..name@email.com",
        "email@add@email.com"
    ];

    for (const email of invalidEmails) {
        test(`should display an error for email with value ${email}`, async ({ signupPage }) => {
            // Enter email
            await signupPage.enterEmail({ email });
            await signupPage.pressEnter();

            // Assert that error message and icon is displayed
            await expect(signupPage.errorMessage(ERROR_MESSAGES.invalidEmail)).toBeVisible();
            await expect(signupPage.emailErrorIcon()).toBeVisible();
        });
    }

    test("should display an error if email is not a business one", async ({ signupPage }) => {
        const email = faker.internet.username() + "@gmail.com";

        await signupPage.enterEmail({ email });
        await signupPage.pressEnter();

        // Assert that error message and icon is displayed
        await expect(signupPage.errorMessage(ERROR_MESSAGES.nonBusinessGmail)).toBeVisible();
        await expect(signupPage.emailErrorIcon()).toBeVisible();
    });

    const validEmails = [
        { title: "leading whitespace", value: `   ${faker.internet.username()}@email.com` },
        { title: "trailing whitespace", value: `${faker.internet.username()}@email.com   ` },
        { title: "special characters", value: `${faker.internet.username()}!!*$%zxxc@email.com` },
        { title: "all uppercase characters", value: `${faker.internet.username()}@email.com`.toUpperCase() }
    ];

    for (const email of validEmails) {
        test(`should accept an email with ${email.title}`, async ({ page, signupPage, verifyEmailPage }) => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const password = "Password123!123";

            await signupPage.signupUser({ email: email.value, firstName, lastName, password });

            // Check if user is redirected successfully
            await expect(page).toHaveURL(URL.verifyEmailPage, { timeout: 20_000 });

            // Check if Verify your email heading is displayed
            await expect(verifyEmailPage.header).toBeVisible();

            // Check if correct email is displayed
            await expect(verifyEmailPage.emailDisplay(email.value)).toBeVisible();
        });
    }


    test("should display an error when email is a long string (300+ characters)", async ({ signupPage }) => {
        const email = `${faker.string.alphanumeric(300)}@email.com`;
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const password = "Password123!123";

        await signupPage.signupUser({ email, firstName, lastName, password });

        await expect(signupPage.errorMessage(ERROR_MESSAGES.genericError)).toBeVisible();
    });


    /*
     *  FIRST NAME AND LAST NAME FIELDS
     */

    const invalidNames = [
        { firstName: "347326256", lastName: "5062719" },
        { firstName: "!$%#%%%", lastName: "(*&#$$" },
        { firstName: "   ", lastName: "     " }
    ];

    for (const name of invalidNames) {
        test(`should not accept names with value ${name.firstName} ${name.lastName}`, async ({ signupPage }) => {
            await signupPage.enterFirstName({ firstName: name.firstName });
            await signupPage.enterLastName({ lastName: name.lastName });
            await signupPage.pressEnter();

            // Assert that error messages and icons are displayed
            await expect(signupPage.errorMessage(ERROR_MESSAGES.firstNameMustContainLetter)).toBeVisible();
            await expect(signupPage.errorMessage(ERROR_MESSAGES.lastNameMustContainLetter)).toBeVisible();
            await expect(signupPage.firstNameErrorIcon()).toBeVisible();
            await expect(signupPage.lastNameErrorIcon()).toBeVisible();
        });
    }

    test("should not accept names that are more than 40 characters long", async ({ signupPage }) => {
        const firstName = faker.string.alpha(41);
        const lastName = faker.string.alpha(41);

        // Enter first and last names
        await signupPage.enterFirstName({ firstName });
        await signupPage.enterLastName({ lastName });
        await signupPage.pressEnter();

        // Assert that correct error messages and icons are displayed for both fields
        await expect(signupPage.errorMessage(ERROR_MESSAGES.firstNameMustBeAtMost40Chars)).toBeVisible();
        await expect(signupPage.errorMessage(ERROR_MESSAGES.lastNameMustBeAtMost40Chars)).toBeVisible();
        await expect(signupPage.firstNameErrorIcon()).toBeVisible();
        await expect(signupPage.lastNameErrorIcon()).toBeVisible();
    });

    test("should accept names that are exactly 40 characters long", async ({ signupPage }) => {
        const firstName = faker.string.alpha(40);
        const lastName = faker.string.alpha(40);

        // Enter first and last names then click Start Application button
        await signupPage.enterFirstName({ firstName });
        await signupPage.enterLastName({ lastName });
        await signupPage.clickStartApplicationButton();

        // Assert that error messages and icons for these two fields are not visible
        await expect(signupPage.firstNameErrorMessage()).not.toBeVisible();
        await expect(signupPage.lastNameErrorMessage()).not.toBeVisible();
        await expect(signupPage.firstNameErrorIcon()).not.toBeVisible();
        await expect(signupPage.lastNameErrorIcon()).not.toBeVisible();
    });

    test("should accept names with alphanumeric and special characters", async ({ signupPage }) => {
        const firstName = `${faker.string.alphanumeric(6)}@!$%^`;
        const lastName = `${faker.string.alphanumeric(6)}@!$%^)(&)`;

        // Enter first and last names then click Start Application button
        await signupPage.enterFirstName({ firstName });
        await signupPage.enterLastName({ lastName });
        await signupPage.clickStartApplicationButton();

        // Assert that error messages for these two fields are not visible
        await expect(signupPage.firstNameErrorMessage()).not.toBeVisible();
        await expect(signupPage.lastNameErrorMessage()).not.toBeVisible();
    });

    /*
     * PASSWORD FIELD
     */

    test("should not accept passwords that don't meet format requirements", async ({ signupPage }) => {
        // Password does not meet uppercase and number requirements
        await signupPage.enterPassword({ password: "passwmrdabcd" });

        // Assert that correct checkboxes are ticked and crossed out
        await expect(signupPage.passwordNumberCrossed()).toBeVisible();
        await expect(signupPage.passwordUppercaseCrossed()).toBeVisible();

        await expect(signupPage.password12CharactersChecked()).toBeVisible();
        await expect(signupPage.passwordLowercaseChecked()).toBeVisible();
        await expect(signupPage.passwordNotCommonlyUsedChecked()).toBeVisible();

        // Assert that alert icon for password is displayed
        await expect(signupPage.passwordErrorIcon()).toBeVisible();


    });

    test("should unmask password when Show password button is clicked", async ({ signupPage }) => {
        const password = faker.internet.password();

        // Add password then click Show password
        await signupPage.enterPassword({ password });
        await signupPage.showPassword();

        // Assert that input is unmasked
        await expect(signupPage.passwordInput()).toHaveAttribute('type', 'text');

        // Click Hide password
        await signupPage.hidePassword();

        // Assert that input is masked
        await expect(signupPage.passwordInput()).toHaveAttribute('type', 'password');
    });

});