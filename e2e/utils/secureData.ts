import { config as dotenvConfig } from "dotenv";
dotenvConfig(); // Load environment variables from .env file
import { faker } from "@faker-js/faker";

//ServerProviders data
//Digital Ocean
let ServerProvidersDo: {
  serverProviderDoName: string;
  serverProviderDoApiToken: string;
} = {
  serverProviderDoName: `do-sp-qa-${faker.number.int(100)}`,
  serverProviderDoApiToken: process.env.DO_TOKEN || "",
};

//Vultr
let ServerProvidersVultr: {
  serverProviderVultrName: string;
  serverProviderVultrApiToken: string;
} = {
  serverProviderVultrName: `vultr-sp-qa-${faker.number.int(100)}`,
  serverProviderVultrApiToken: process.env.VULTR_TOKEN || "",
};

//AWS
let ServerProvidersAws: {
  serverProviderAwsName: string;
  serverProviderAwsAccessKey: string;
  serverProviderAwsSecretAccessKey: string;
} = {
  serverProviderAwsName: `aws-sp-qa-${faker.number.int(100)}`,
  serverProviderAwsAccessKey: process.env.AWS_ACCESS_KEY || "",
  serverProviderAwsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

//Akamai
let ServerProvidersAkamai: {
  serverProviderAkamaiName: string;
  serverProviderAkamaiApiToken: string;
} = {
  serverProviderAkamaiName: `akamai-sp-qa-${faker.number.int(100)}`,
  serverProviderAkamaiApiToken: process.env.AKAMAI_TOKEN || "",
};

//Hetzner
let ServerProvidersHetzner: {
  serverProviderHetznerName: string;
  serverProviderHetznerApiToken: string;
} = {
  serverProviderHetznerName: `Hetzner-sp-qa-${faker.number.int(100)}`,
  serverProviderHetznerApiToken: process.env.HETZNER_TOKEN || "",
};

//BackupProviders data
//Custom S3
let BackupProvidersCustomS3: {
  backupProviderCustomS3Name: string;
  backupProviderEndpoint: string;
  backupProviderCustomS3AccessKey: string;
  backupProviderCustomS3SecretAccessKey: string;
  backupProviderCustomS3Bucket: string;
  backupProviderCustomS3Region: string;
} = {
  backupProviderCustomS3Name: `custom-s3-qa`,
  backupProviderCustomS3Region: process.env.S3_REGION || "de-fra",
  backupProviderEndpoint:
    process.env.S3_ENDPOINT || "https://p4r6.fra.idrivee2-24.com",
  backupProviderCustomS3AccessKey: process.env.S3_ACCESS_KEY || "",
  backupProviderCustomS3SecretAccessKey: process.env.S3_SECRET_KEY || "",
  backupProviderCustomS3Bucket: process.env.S3_BUCKET || "qa-bucket-frankfurt",
};

//Cloudflare R2
let BackupProvidersCloudflareR2: {
  backupProviderCloudflareR2Name: string;
  backupProviderAccountId: string;
  backupProviderCloudflareR2AccessKey: string;
  backupProviderCloudflareR2SecretAccessKey: string;
  backupProviderCloudflareR2Bucket: string;
} = {
  backupProviderCloudflareR2Name: `custom-r2-qa`,
  backupProviderAccountId: "55dc0a2b467d8e1d6eb3822ad43b5e4d",
  backupProviderCloudflareR2AccessKey: "511c3d6df02fce5ee38dfa23fe642f09",
  backupProviderCloudflareR2SecretAccessKey:
    "9c0c204829bca94c244942f4dd23425d4b6d02c437afa14998566fbb9fbf58de",
  backupProviderCloudflareR2Bucket: "qa-bucket-la",
};

let permaServerSite: { 
  server1: string;
  server2:string;
  nginxSiteTitle: string;
  olsSiteTitle: string;
} = {
  // server1: process.env.PERMANENT_SERVER_NAME1 || 'QA-Automation1',
  // server2: process.env.PERMANENT_SERVER_NAME2 || 'QA-Automation2',
  // serverId1: process.env.PERMANENT_SERVER_ID1 || "697",
  // serverId2: process.env.PERMANENT_SERVER_ID2 || "698",
  // nginxSiteId: process.env.PERMANENT_NGINX_SITE_ID || "2841",
  // olsSiteId: process.env.PERMANENT_OLS_SITE_ID || "2843",
  // nginxSiteId2: process.env.PERMANENT_NGINX_SITE_ID2 || "3533",
  // olsSiteId2: process.env.PERMANENT_OLS_SITE_ID2 || "3534",
  // nginxSiteTitle: process.env.PERMANENT_NGINX_SITE_TITLE || "test-site-nginx",
  // olsSiteTitle: process.env.PERMANENT_OLS_SITE_TITLE || "test-site-ols",
  server1: 'QA-Automation1',
  server2: 'QA-Automation2',
  nginxSiteTitle: 'test-site-nginx',
  olsSiteTitle: 'test-site-ols',
};

let emailCredentials:{
  emailFrom:string;
  siteName:string;
  updatedSiteName:string;
  smtpServer:string;
  smtpPort:string;
  smtpUsername:string;
  smtpPassword:string;
} = {
  emailFrom: 'wedevs.testing1@gmail.com',
  siteName: 'Test-Site',
  updatedSiteName: 'Updated-Site',
  smtpServer: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUsername: 'rubaiyat.mohammad@wedevs.com',  
  smtpPassword: 'cdjs cdnt txba mzcm',
};

/**------------------------------*/
/**-------Export DATA_SET-------*/
/**----------------------------*/
export {
  ServerProvidersDo,
  ServerProvidersVultr,
  ServerProvidersAws,
  ServerProvidersAkamai,
  ServerProvidersHetzner,
  BackupProvidersCustomS3,
  BackupProvidersCloudflareR2,
  permaServerSite,
  emailCredentials,
};