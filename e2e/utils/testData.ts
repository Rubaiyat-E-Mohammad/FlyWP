import { config as dotenvConfig } from 'dotenv';
dotenvConfig(); // Load environment variables from .env file
import { faker } from '@faker-js/faker';

// Url data
let Urls: {
  baseUrl: string;
  yopmailUrl: string;
} = {
  // Main Site URL
  baseUrl: process.env.APP_URL || 'https://staging-app.flywp.com', // Using 'https://staging-app.flywp.com' as default

  // Yopmail email
  yopmailUrl: 'https://yopmail.com/',
};

// New user data
let newUsername = faker.internet.username();
let newUserPassword = faker.internet.password();

let Users: {
  // User Credentials
  userEmail: string;
  userPassword: string;
  currentTeamId: string;
  serverId: string;
  teamOwnerName: string;
  /**
   *
   *
   */
  // New User Credentials
  newUsername: string;
  newUserEmail: string;
  newUserPassword: string;
  newUserConfirmPassword: string;
} = {
  // User Credentials
  userEmail: process.env.USER_EMAIL || '', // Providing a default value ('') when process.env.USER_EMAIL is undefined
  userPassword: process.env.USER_PASSWORD || '', // Similarly, providing a default value for userPassword
  currentTeamId: '',
  serverId: '',
  teamOwnerName: '',
  /**
   *
   *
   */
  // New User Credentials
  newUsername: newUsername,
  newUserEmail: `${newUsername}@yopmail.com`,
  newUserPassword: newUserPassword,
  newUserConfirmPassword: newUserPassword,
};

// Server data
let Servers: {
  serverName: string;
  updatedServerName: string;
} = {
  serverName: `qa-${faker.internet.domainWord()}`,
  updatedServerName: ``,
};

// Sites data
let Sites: {
  siteName: string;

  phpVersion7_4: string;
  phpVersion8_0: string;
  phpVersion8_1: string;
  phpVersion8_2: string;
} = {
  siteName: '',

  phpVersion7_4: '7.4',
  phpVersion8_0: '8.0',
  phpVersion8_1: '8.1',
  phpVersion8_2: '8.2',
};

/**------------------------------*/
/**-------Export DATA_SET-------*/
/**----------------------------*/
export { Urls, Users, Servers, Sites };
