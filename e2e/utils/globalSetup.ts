import { FullConfig } from '@playwright/test';
import { TestDataManager } from './testDataManager';

async function globalSetup(config: FullConfig) {
    try {
        // Just initialize the TestDataManager
        TestDataManager.getInstance();
        console.log('Global setup completed successfully');
    } catch (error) {
        console.error('Error in global setup:', error);
        throw error;
    }
}

export default globalSetup;