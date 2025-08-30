import { test as base } from "@playwright/test"
import SignupPage from "../poms/signupPage"
import VerifyEmailPage from "../poms/verifyEmailPage";
import SigninPage from "../poms/signinPage";

interface ExtendedFixtures {
    signupPage: SignupPage;
    verifyEmailPage: VerifyEmailPage;
    signinPage: SigninPage;
}

export const test = base.extend<ExtendedFixtures>({
    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    },
    verifyEmailPage: async ({ page }, use) => {
        const verifyEmailPage = new VerifyEmailPage(page);
        await use(verifyEmailPage);
    },
    signinPage: async ({ page }, use) => {
        const signinPage = new SigninPage(page);
        await use(signinPage);
    }
});