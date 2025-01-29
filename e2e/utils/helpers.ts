import fs from 'fs';
import { execSync } from 'child_process';
import { Browser, BrowserContextOptions, Page } from '@playwright/test';

const { LOCAL, SITE_PATH } = process.env;

export const helpers = {
    // replace '_' to space & capitalize first letter of string
    replaceAndCapitalize: (str: string) =>
        str
            .replace('dokan', 'vendor')
            .replace('_', ' ')
            .replace(/^\w{1}/, letter => letter.toUpperCase()),

    // replace '_' to space & capitalize first letter of each word
    replaceAndCapitalizeEachWord: (str: string) => str.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase()),

    // replace '_' to space & lowercase first letter of each word
    replaceAndLowercaseEachWord: (str: string) => str.replace('_', ' ').replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) => letter.toLowerCase()),

    // capitalize
    capitalize: (word: string) => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),

    // returns a random number between min (inclusive) and max (exclusive)
    getRandomArbitrary: (min: number, max: number) => Math.random() * (max - min) + min,

    // returns a random integer number between min (inclusive) and max (exclusive)
    getRandomArbitraryInteger: (min: number, max: number) => Math.floor(Math.random() * (max - min) + min),

    getRandomNumber: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min,

    // random number between 0 and 1000
    randomNumber: () => Math.floor(Math.random() * 1000),

    // random array element
    randomItem: (arr: string | any[]) => arr[Math.floor(Math.random() * arr.length)],

    // remove array element
    removeItem: (arr: any[], removeItem: any) => arr.filter(item => item !== removeItem),

    // get count in array
    getCount: (array: any[], element: any) => array.filter(n => n === element).length,

    // is sub array
    isSubArray: (parentArray: any[], subArray: any[]) => subArray.every(el => parentArray.includes(el)),

    // check if object is empty
    isObjEmpty: (obj: object) => Object.keys(obj).length === 0,

    // string to slug
    slugify(str: string) {
        return (
            str
                .toString() // Cast to string (optional)
                .normalize('NFKD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase() // Convert the string to lowercase letters
                .trim() // Remove whitespace from both sides of a string (optional)
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/[^\w-]+/g, '') // Remove all non-word chars
                // .replace(/\_/g, '-')           		// Replace _ with -
                .replace(/--+/g, '-') // Replace multiple - with single -
                .replace(/-$/g, '')
        ); // Remove trailing -
    },

    // check file existence
    fileExists(filePath: string) {
        return fs.existsSync(filePath);
    },

    // read file
    readFile(filePath: string) {
        return fs.readFileSync(filePath, 'utf8');
    },

    // read json
    readJson(filePath: string) {
        if (fs.existsSync(filePath)) {
            return JSON.parse(this.readFile(filePath));
        } else {
            console.log(`File not found: ${filePath}`);
            return null;
        }
    },

    // read a single json data
    readJsonData(filePath: string, propertyName: string) {
        const data = this.readJson(filePath);
        return data[propertyName];
    },

    // write a single json data
    writeJsonData(filePath: string, property: string, value: string) {
        const jsonData = this.readJson(filePath);
        jsonData[property] = value;
        this.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    },

    // write file
    writeFile(filePath: string, content: string) {
        fs.writeFileSync(filePath, content, { encoding: 'utf8' });
    },

    // delete file
    deleteFile(filePath: string) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    },

    // append file
    appendFile(filePath: string, content: string) {
        fs.appendFileSync(filePath, content, { encoding: 'utf8' });
    },

    // rename file
    renameFile(newFilePath: string, oldFilePath: string) {
        fs.renameSync(newFilePath, oldFilePath);
    },

    // replace data in file
    replaceData(filePath: string, data: string, replaceData: string) {
        const fileData = this.readFile(filePath);
        const updatedData = fileData.replace(data, replaceData);
        this.writeFile(filePath, updatedData);
    },

    // create env
    createEnvVar(key: string, value: string) {
        console.log(`${key}=${value}`);
        const content = '\n' + `${key}=${value}`;
        process.env[key] = value;
        this.appendFile('.env', content); // for local testing
    },

    // append content to .env file
    appendEnv(content: string) {
        content += '\n';
        this.appendFile('.env', content);
    },

    // write env json
    writeEnvJson(property: string, value: string) {
        const filePath = 'utils/data.json';
        let envData: { [key: string]: string } = {};
        if (fs.existsSync(filePath)) {
            envData = this.readJson(filePath);
        }
        envData[property] = value;
        this.writeFile(filePath, JSON.stringify(envData, null, 2));
    },

    async createFolder(folderName: string) {
        try {
            fs.mkdirSync(folderName);
            console.log(`Folder '${folderName}' created successfully.`);
        } catch (error: any) {
            if (error.code === 'EEXIST') {
                console.log(`Folder '${folderName}' already exists.`);
                return;
            } else {
                console.error(`Error creating folder '${folderName}':`, error);
            }
        }
    },

    // create a new page
    async createPage(browser: Browser, options?: BrowserContextOptions | undefined) {
        const browserContext = await browser.newContext(options);
        return browserContext.newPage();
    },

    // close pages
    async closePages(pages: Page[]): Promise<void> {
        for (const page of pages) {
            await page.close();
        }
    },

    // check if cookie is expired
    isCookieValid(filePath: string) {
        const cookies = helpers.readJson(filePath);
        if (!cookies?.cookies) {
            console.log('No cookies found in the file');
            return false;
        }
        const loginCookie = cookies?.cookies.find((cookie: { name: string }) => cookie.name.startsWith('wordpress_logged_in'));
        if (!loginCookie) {
            console.log('No valid login cookie found.');
            return false;
        }
        // console.log(loginCookie);
        const cookieExpiryDate = new Date(loginCookie.expires * 1000);
        console.log('expiry:', cookieExpiryDate.toLocaleDateString('en-CA'));
        const result = cookieExpiryDate > new Date();
        console.log(result);
        return result;
    },

    // rgb (rgb(r, g, b)) to hex (#rrggbb) color
    rgbToHex(rgb: string): string {
        const [r, g, b]: number[] = rgb.match(/\d+/g)!.map(Number);
        return `#${((1 << 24) + (r! << 16) + (g! << 8) + b!).toString(16).slice(1).toUpperCase()}`;
    },

    // hex (#rrggbb) to rgb (rgb(r, g, b)) color
    hexToRgb(hex: string): string {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    },

    // empty object values
    emptyObjectValues: (obj: { [key: string]: any }) => (Object.keys(obj).forEach(key => (obj[key] = '')), obj),

    // is object
    isPlainObject: (value: any) => value !== null && typeof value === 'object' && !Array.isArray(value),

    // deep merge arrays
    deepMergeArrays(targetArray: any[], sourceArray: any[]) {
        if (targetArray.every((item: any) => item instanceof Object && !Array.isArray(item)) && sourceArray.every(item => item instanceof Object && !Array.isArray(item))) {
            const mergedArray = [...targetArray];
            sourceArray.forEach((item: { [key: string]: any }, index: number) => {
                if (index < mergedArray.length && item instanceof Object && !Array.isArray(item)) {
                    mergedArray[index] = this.deepMergeObjects(mergedArray[index], item);
                } else {
                    mergedArray.push(item);
                }
            });
            return mergedArray;
        } else {
            return [...sourceArray];
        }
    },

    // deep merge objects
    deepMergeObjects(target: { [key: string]: any }, source: { [key: string]: any }) {
        const result = { ...target };

        for (const key of Object.keys(source)) {
            if (this.isPlainObject(source[key]) && this.isPlainObject(target[key])) {
                result[key] = this.deepMergeObjects(target[key], source[key]);
            } else if (Array.isArray(source[key]) && Array.isArray(target[key])) {
                result[key] = this.deepMergeArrays(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    },
};
