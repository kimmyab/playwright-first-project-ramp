import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { URL } from "../../constants/url";
import { test } from "../../fixtures";
import { ERROR_MESSAGES } from "../../constants/texts";

test.describe("Sign in page", () => {

    test.beforeEach(async ({ signinPage }) => {
        await signinPage.goto();
    });

    test("should not proceed if email is not provided", async ({ signinPage }) => {
        await signinPage.clickContinue();

        // Assert that error icon is displayed
        await expect(signinPage.emailErrorIcon()).toBeVisible();
    });

    test("should redirect to 'Get started for free' sign up page when link is clicked", async ({ page, signinPage }) => {
        // Click sign up link
        await signinPage.clickSignUpLink();

        // Expect new page to have correct url
        const newPage = await page.waitForEvent('popup');
        await newPage.waitForLoadState();
        await expect(newPage).toHaveURL(URL.getStartedPage);
    });

    test("should not accept email with more than 1 consecutive dots", async ({ signinPage }) => {
        await signinPage.enterEmail({ email: "email..add@google.com" });
        await signinPage.clickContinue();

        // Assert error message and icon are displayed
        await expect(signinPage.errorMessage(ERROR_MESSAGES.invalidEmail)).toBeVisible();
        await expect(signinPage.emailErrorIcon()).toBeVisible();
    });

    test("should not accept an email that starts with a dot", async ({ signinPage }) => {
        await signinPage.enterEmail({ email: ".email@company.com" });
        await signinPage.clickContinue();

        // Assert error message and icon are displayed
        await expect(signinPage.errorMessage(ERROR_MESSAGES.invalidEmail)).toBeVisible();
        await expect(signinPage.emailErrorIcon()).toBeVisible();
    });

    const validEmails = [
        { title: "leading whitespace", value: `   ${faker.internet.username()}@email.com` },
        { title: "trailing whitespace", value: `${faker.internet.username()}@email.com   ` },
        { title: "special characters", value: `${faker.internet.username()}!!*$%zxxc@email.com` },
        { title: "all uppercase characters", value: `${faker.internet.username()}@email.com`.toUpperCase() }
    ];

    for (const email of validEmails) {
        test(`should accept an email with ${email.title}`, async ({ signinPage }) => {
            await signinPage.enterEmail({ email: email.value });
            await signinPage.clickContinue();

            // Check if no error is displayed
            await expect(signinPage.emailErrorIcon()).not.toBeVisible();

            // Check if email is displayed
            await expect(signinPage.emailTextbox).toHaveAttribute('value', email.value.trim());
        });
    }

    test("should not sign in a non-existing user", async ({ signinPage }) => {
        const email = `${faker.internet.username()}@smdaa.com`;
        const password = "password";

        // Sign in user and assert that error message is displayed
        await signinPage.signinUser({ email, password });
        await expect(signinPage.errorMessage(ERROR_MESSAGES.emailPasswordNotRecognized)).toBeVisible();
    });

    test("should not sign in an existing user with incorrect password", async ({ signinPage }) => {
        const email = "aa@aa.com";
        const password = "password0029";
        
        // Sign in user and assert that error message is displayed
        await signinPage.signinUser({ email, password });
        await expect(signinPage.errorMessage(ERROR_MESSAGES.emailPasswordNotRecognized)).toBeVisible();
    });

    test("should be able to change email when user clicks 'Use a different email' link", async ({ signinPage }) => {
        let email = `${faker.internet.username()}@smdaa.com`;

        await signinPage.enterEmail({ email });
        await signinPage.clickContinue();
        
        // Email displayed is correct
        await expect(signinPage.emailTextbox).toHaveAttribute('value', email);

        // User clicks the 'Use a different email' link
        await signinPage.useADifferentEmail();
        await expect(signinPage.continueButton).toBeVisible();

        // Enter a new email
        email = `${faker.internet.username()}@abcdme.com`;
        await signinPage.enterEmail({ email });
        await signinPage.clickContinue();

        // Assert that new email is displayed
        await expect(signinPage.emailTextbox).toHaveAttribute('value', email);
    });

    test("should redirect to Forgot Password page when 'Reset password' link is clicked", async ({ page, signinPage }) => {
        const email = `${faker.internet.username()}@smdaa.com`;
        
        // Enter email
        await signinPage.enterEmail({ email });
        await signinPage.clickContinue();

        // Reset password
        await signinPage.resetPassword();

        // Assert that user is redirected to the correct page
        await expect(page).toHaveURL(URL.forgotPasswordPage);
    });

    test("should not sign in when user doesn't enter a password", async ({ signinPage }) => {
        const email = `${faker.internet.username()}@smdaa.com`;

        // Enter email
        await signinPage.enterEmail({ email });
        await signinPage.clickContinue();

        // Click sign in and assert that error icon is displayed
        await signinPage.clickSignIn();
        await expect(signinPage.passwordErrorIcon()).toBeVisible();
    });

        // const invalidEmails = [
    //     "usernameonly",
    //     "usernameonly" + '@',
    //     "gmail.com",
    //     "email add@abc.com",
    //     ".email@email.com",
    //     "abc..name@email.com",
    //     "email@add@email.com"
    // ];

});