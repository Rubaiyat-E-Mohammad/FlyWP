import { Browser, BrowserContext, Page, test, chromium } from "@playwright/test";
import { AuthPage } from "../pages/authPage";
import { Users } from "../utils/testData";
import * as fs from "fs";

let browser: Browser;
let context: BrowserContext;
let page: Page;


// Setup and clear cookies before all tests
test.beforeAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', () => { });
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});



/**
 * @description
 *    Test Suite for User Registration and Authentication workflows.
 * 
 * @details
 *    This suite covers the following scenarios for user registration and authentication:
 *    - User registration using valid details (username, email, password).
 *    - Email verification of the newly registered user.
 *    - Login validation for the newly registered user.
 *    - Logout validation to ensure proper session termination.
 *
 * @testCases
 *    - [R001] User Registration: Register a new user with valid details.
 *    - [R002] User Registration Verification: Verify the new user's email address.
 *    - [R003] New User Login Validation: Ensure the new user can log in successfully.
 *    - [R004] New User Logout Validation: Ensure the new user can log out successfully.
 *
 * @cleanup
 *    Cookies and session data are cleared before and after all tests to maintain test integrity.
 */


test.describe.skip("User Registration and Authentication", () => {
  const newUsername = Users.newUsername;
  let newUserEmail = Users.newUserEmail;
  let newUserPassword = Users.newUserPassword;
  const newUserConfirmPassword = Users.newUserConfirmPassword;

  test("[R001] User Registration", async () => {
    const authPage = new AuthPage(page);
    const [regNewUserEmail, regNewUserPassword] = await authPage.userRegistration(newUsername, newUserEmail, newUserPassword, newUserConfirmPassword);
    newUserEmail = regNewUserEmail; // Update newUserEmail
    newUserPassword = regNewUserPassword; // Update newUserPassword
  });

  test("[R002] User Registration Verification", async () => {
    const authPage = new AuthPage(page);
    await authPage.yopmailEmailCheck(newUsername, newUserEmail);
  });

  test("[R003] New User Login Validation", async () => {
    const authPage = new AuthPage(page);
    await authPage.userLogin(newUserEmail, newUserPassword);
  });

  test("[R004] New User Logout Validation", async () => {
    const authPage = new AuthPage(page);
    await authPage.userLogout();
    fs.writeFile('state.json', '{"cookies":[],"origins": []}', () => { });
  });
});


// AfterAll hook to clear cookies after all tests have completed
test.afterAll(async () => {
  fs.writeFile('state.json', '{"cookies":[],"origins": []}', () => { });
  await browser.close();
});