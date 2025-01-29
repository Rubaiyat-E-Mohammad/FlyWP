import * as fs from 'fs';
import * as path from 'path';

interface ServerSiteData {
    serverId1: string;
    serverId2: string;
    nginxSiteId: string;
    olsSiteId: string;
    nginxSiteId2: string;
    olsSiteId2: string;
    timestamp?: string;
}

export class TestDataManager {
    private filePath: string;
    private static instance: TestDataManager;

    private constructor() {
        this.filePath = path.join(__dirname, 'test-data.json');
        this.initializeDataFile();
    }

    public static getInstance(): TestDataManager {
        if (!TestDataManager.instance) {
            TestDataManager.instance = new TestDataManager();
        }
        return TestDataManager.instance;
    }

    private getInitialData(): ServerSiteData {
        return {
            serverId1: '',
            serverId2: '',
            nginxSiteId: '',
            olsSiteId: '',
            nginxSiteId2: '',
            olsSiteId2: '',
            timestamp: new Date().toISOString()
        };
    }

    private initializeDataFile(): void {
        try {
            if (!fs.existsSync(this.filePath)) {
                const initialData = this.getInitialData();
                fs.writeFileSync(this.filePath, JSON.stringify(initialData, null, 2));
                console.log('Test data file initialized successfully');
            }
        } catch (error) {
            console.error('Error initializing test data file:', error);
            throw error;
        }
    }

    public getData(): ServerSiteData {
        try {
            if (!fs.existsSync(this.filePath)) {
                this.initializeDataFile();
            }

            const fileContent = fs.readFileSync(this.filePath, 'utf-8');
            
            try {
                return JSON.parse(fileContent);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return this.getInitialData();
            }
        } catch (error) {
            console.error('Error reading test data:', error);
            return this.getInitialData();
        }
    }

    public saveData(data: Partial<ServerSiteData>): void {
        try {
            let currentData = this.getData();

            const newData = {
                ...currentData,
                ...data,
                timestamp: new Date().toISOString()
            };

            fs.writeFileSync(this.filePath, JSON.stringify(newData, null, 2));
            console.log('Test data saved successfully:', newData);
        } catch (error) {
            console.error('Error saving test data:', error);
        }
    }

    public verifyRequiredData(requiredFields: (keyof ServerSiteData)[]): void {
        const data = this.getData();
        const missingFields = requiredFields.filter(field => !data[field]);
        if (missingFields.length > 0) {
            throw new Error(`Required test data missing: ${missingFields.join(', ')}`);
        }
    }
}