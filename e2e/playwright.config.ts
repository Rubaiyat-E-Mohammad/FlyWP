import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import { faker } from '@faker-js/faker';


const config: PlaywrightTestConfig = {
    testDir: "./tests",

    timeout: 1800 * 1000, // 6 minutes
    expect: {

        timeout: 30 * 1000, // 30 seconds
    },
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 0 : 0,
    workers: process.env.CI ? 4 : 4, // Use 4 workers in CI, 4 locally
    reporter: process.env.CI
        ? [
            ["blob", { outputDir: `./blob-report-${faker.string.nanoid(5)}` }],
            ["list", { printSteps: true }],
            ["html", { outputFolder: "./playwright-report", open: "never" }],
            ['./utils/summaryReporter.ts', { outputFile: `./summary-report/results-${faker.string.nanoid(5)}.json` }],  // Ensure path and output file match
        ]
        : [
            ["html", { outputFolder: "./playwright-report", open: "never" }],
        ],
    use: {
        actionTimeout: 0,
        trace: process.env.CI ? "off" : "retain-on-failure",
        headless: true, 
        viewport: { width: 1280, height: 720 },
        screenshot: "only-on-failure",
        video: "on",

    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                storageState: "state.json",
            },
        },
        {
            name: 'preShard',
            testMatch: [
                'tests/serversVultr.spec.ts',
                'tests/serversHetzner.spec.ts',
                'tests/serversHetzner2.spec.ts',
            ]
        },
        {
            name: 'shard1',
            testMatch: [
                'tests/serversDOPartnered.spec.ts',
                'tests/sitesCustomDomain.spec.ts',
                'tests/sitesFreeDomain.spec.ts',
                'tests/fileManager.spec.ts',
            ]
        },
        {
            name: 'shard2',
            testMatch: [
                'tests/serversDOCustom.spec.ts',
                'tests/cloneSite.spec.ts',
                'tests/cloneSiteDifferentServer.spec.ts',
                'tests/backupProviders.spec.ts',
            ]
        },
        {
            name: 'shard3',
            testMatch: [
                'tests/transferSite.spec.ts',
                'tests/emailSetup.spec.ts',
                'tests/login.spec.ts',
                'tests/sitesSettings.spec.ts',
            ]
        },
        {
            name: 'shard4',
            testMatch: [
                'tests/sitesSettings.spec.ts',
            ]
        },
        {
            name: 'postShard',
            testMatch: [
                'tests/serverProviders.spec.ts',
                'tests/registration.spec.ts',
                'tests/cleanup.spec.ts',
            ]
        },
        {
            name: 'coverage',
            testMatch: [
                'tests/_coverage.spec.ts'
            ]
        },
    ],
    outputDir: 'test-results/',
    globalSetup: require.resolve('./utils/globalSetup.ts'),
};
export default config;