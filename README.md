## 💡 About The Project
This is my first project for automated front-end testing which contains tests for Sign Up and Login pages of a web application, built using Playwright and Typescript. The tests are designed to verify that the sign-up and login functionality works correctly by simulating user interactions.

The project is integrated with GitHub Actions for continuous integration (CI), so smoke test will run automatically on every push or pull request to the repository.

## ⚙️ Installation
### Installation for VSCode
- If using VSCode, follow this guide instead: [Playwright Official Guide](https://playwright.dev/docs/getting-started-vscode)


### Installation
Prerequisites:
- Node.js (>= 22.0.0)
- npm or yarn for package management
- Playwright for browser automation


Steps for installation:
1. Clone the repository:
```
git clone https://github.com/kimmyab/playwright-first-project-ramp.git
cd your-repository-name
```
2. Install dependencies:
```
npm install
# or if you're using yarn
yarn install
```
3. Ensure that Playwright's required browsers are installed
```
npx playwright install
```

## ⚙️ Running the tests
- To run the tests locally, execute the following command in the project root:
```
npx playwright test
```
This will run all the tests in the project, which includes sign up, sign in, as well as the sample tests from Playwright, in headless mode.

- To run specific test file (eg. for signup page) and run it in headed mode, execute this command:
```
npx playwright test signup.spec.ts --headed
```

## 🗂️ Test Structure
- **tests/signup/signup.spec.ts**: Tests for user registration (sign-up) flow, including validation and error handling
- **tests/signin/signin.spec.ts**: Tests for the login (sign-in) process handling invalid credentials

## 📝 Notes
1. No test for real login as this is an actual web application in Production
2. May encounter rate limiting during test execution

## 📘 Future considerations
1. Better structure for scenarios suited for data-driven testing
2. Improve locators if possible
