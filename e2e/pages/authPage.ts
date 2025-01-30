import { expect, Page } from '@playwright/test';
import { BasePage } from './base';
import { Urls, Users } from '../utils/testData';

export class AuthPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }


  //API Get Team-ID
  // User login
  async userLogin(email: string, password: string) {
    const adminEmail = email; // User email
    const adminPassword = password; // User password

    // Visit login page
    await this.page.goto(Urls.baseUrl + '/login', { waitUntil: 'networkidle' });

    // Enter login credentials and submit
    await this.validateAndFillStrings('//input[@type="email"]', adminEmail);
    await this.validateAndFillStrings('//input[@type="password"]', adminPassword);

    // Click the login button
    await this.waitforLocatorAndClick('//button[text()="Log in"]');

    // Make API Call
    // Wait for the specific response that contains the team data
    const response = await this.page.waitForResponse((response) =>
      response.url().includes('/servers') && response.status() === 200
    );

    // Parse the response to extract the current_team_id
    const responseData = await response.json();
    const currentTeamId = responseData.props.user.current_team_id;
    const teamOwnerName = responseData.props.user.name;

    // Store TeamID and TeamOwnerName
    Users.currentTeamId = currentTeamId;
    Users.teamOwnerName = teamOwnerName;

    console.log(`Received Team ID: ${currentTeamId}`);
    console.log(`Received Team ID: ${teamOwnerName}`);

    console.log(`Updated Team ID: ${Users.currentTeamId}`);
    console.log(`Updated Team ID: ${Users.teamOwnerName}`);

    // Wait for the team button to appear to ensure the login was successful
    // const createServer = await this.page.waitForSelector('//button[contains(text(),"Team")]');
    // expect(createServer).toBeTruthy();

    // Store Cookie State
    await this.page.context().storageState({ path: 'state.json' });
  };

  // async validateTeamOwner(){
  //   // Visit Servers page
  //   await Promise.all([
  //     this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' }),
  //   ]);
    
  //   // Get Team owner Name
  //   let teamOwnerName = Users.teamOwnerName;

  //   // Modify the team owner name to create the locator text
  //   const teamLocatorText = `${teamOwnerName.split(" ")[0]}'s Team`;
  //   // Use the locator with the modified text
  //   const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
  //   // Click the team button (with the Modified Locator)
    
  //   const presentTeamLocator = this.page.innerText('//span[@class="inline-flex rounded-md"]//button[@type="button"]');

  //   if (teamLocatorText == presentTeamLocator) {
  //     console.log('Validated name');
  //   } else {
  //     await this.page.click('//span[@class="inline-flex rounded-md"]//button[@type="button"]');
  //     await teamButtonLocator.click();
  //   }
  // };



  // User logout
  async userLogout() {
    // Visit Servers page
    await Promise.all([
      this.page.goto(Urls.baseUrl + '/servers', { waitUntil: 'networkidle' }),
    ]);
    
    const teamOwnerName = Users.teamOwnerName;
    const teamLocatorText = 'FlyDevs';
    
    /**
     * @extra : This is for the team owner name validation (ending with {user}'s Team)
     */
    // const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    // await teamButtonLocator.click();
    // const teamLocatorText = `${teamOwnerName.split(" ")[0]}'s Team`;

    const teamButtonLocator = this.page.locator(`//button[contains(text(),"${teamLocatorText}")]`);
    await teamButtonLocator.click();
    console.log(`Team Owner is: ${teamOwnerName}`);
    console.log(`Team Owner Button is: ${teamButtonLocator}`);

    await this.validateAndClickAny('//button[text()="Log Out"]');

    const loginButton = await this.page.locator('//button[text()="Log in"]');
    expect(loginButton).toBeTruthy();
  }



  // New user registration
  async userRegistration(newUsername: string, newUserEmail: string, newUserPassword: string, newUserConfirmPassword: string) {
    console.log(`Registration-data: ${newUsername}`)
    console.log(`Registration-data: ${newUserEmail}`)
    console.log(`Registration-data: ${newUserPassword}`)
    console.log(`Registration-data: ${newUserConfirmPassword}`)

    // Visit registration page
    await Promise.all([
      this.page.goto(Urls.baseUrl + '/register?secret=flywp-staging-secret-key', { waitUntil: 'networkidle' }),
    ]);
    // Enter registration credentials
    await this.validateAndFillStrings('//input[@id="name"]', newUsername);
    await this.validateAndFillStrings('//input[@id="email"]', newUserEmail);
    await this.validateAndFillStrings('//input[@id="password"]', newUserPassword);
    await this.validateAndFillStrings('//input[@id="password_confirmation"]', newUserConfirmPassword);
    // Complete registration
    await this.validateAndClick('//input[@type="checkbox"]');
    await this.waitforLocatorAndClick('//button[text()="Register"]');
    // Validate registration5000
    const resendVerificationEmail = await this.waitforLocator('//button[text()="Resend Verification Email"]', { timeout: 5000 });
    expect(resendVerificationEmail).toBeTruthy();
    const logoutButton = await this.waitforLocator('//button[text()="Log Out"]', { timeout: 5000 });
    expect(logoutButton).toBeTruthy();
    // Return username
    return [newUserEmail, newUserPassword];

  };


  async validateRegistrationComplete() {

  };

  //Check : YOPMAIL email 
  async yopmailEmailCheck(newUsername: string, newUserEmail: string) {
    console.log(`Yopmail: ${newUsername}`)
    console.log(`Yopmail: ${newUserEmail}`)

    // Check newUser email inbox and Validate
    await Promise.all([
      this.page.goto(Urls.yopmailUrl, { waitUntil: 'networkidle' }),
    ]);
    // Check email inbox
    // Search userInbox
    await this.validateAndFillStrings('//input[@id="login"]', newUserEmail);
    await this.validateAndClick('//button[@class="md"]');
    // Check userEmail - FlyWP
    await this.page.waitForLoadState('domcontentloaded')
    await this.waitforLocatorAndClick('//span[text()="FlyWP Staging"]');
    // Visit Verification link
    let verificationLink = await this.page.getAttribute('//a[contains(text(),"https://staging-app.flywp.com/email/verify/44/2cdbba03ab99bf07536e6cf2e92dafc90eeb5fc6?expires=1714737414&signature=3c3f129b104b05c34d13828b34bb7171f60b06c4802ba315aaca8cd29b040e28")]', 'href');
    if (verificationLink !== null) {
      console.log(verificationLink);
      await this.page.goto(verificationLink);
    } else {
      console.error("Verification link not found.");
    }
    // Validate registration complete
    await this.page.waitForLoadState('domcontentloaded')
    const expirationText = await this.waitforLocator('//span[text()="Your trial will expire"]', { timeout: 5000 });
    expect(expirationText).toBeTruthy();
    const userNameWelcome = await this.page.innerText('//h2[contains(@class,"text-xl font-semibold")]', { timeout: 5000 });
    expect(userNameWelcome).toContain(newUsername);
  };



}
