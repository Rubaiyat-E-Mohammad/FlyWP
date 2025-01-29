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
 *    Test Suite for Authentication workflows for an existing user.
 * 
 * @details
 *    This suite verifies the authentication functionality for a user with valid credentials, ensuring both login and logout workflows operate as expected.
 * 
 * @testCases
 *    - [L001] Login: Verify the user can log in with valid email and password.
 *    - [L002] Logout: Validate that the user can log out successfully and the session is cleared.
 * 
 * @cleanup
 *    Session data and cookies are cleared before and after all tests to maintain test integrity.
 */


test.describe("Authentication Workflow", () => {
  const userEmail = Users.userEmail;
  const userPassword = Users.userPassword;

  test("[L001] Login", async () => {
    const authPage = new AuthPage(page);
    await authPage.userLogin(userEmail, userPassword);
  });

  test("[L002] Logout", async () => {
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