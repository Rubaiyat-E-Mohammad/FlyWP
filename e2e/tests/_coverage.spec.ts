import { test } from "@playwright/test";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { helpers } from "../utils/helpers";

let executed_tests: string[] = [];

let totalProductFeatures = 0;
let coveredProductFeatures = 0;
let totalPageFeatures = 0;
let coveredPageFeatures = 0;
const coveredFeatures: string[] = [];
const uncoveredFeatures: string[] = [];

test.describe("get e2e test coverage", () => {
  const feature_map = "./features-map/features-map.yml";

  test(`get coverage`, { tag: ["@lite"] }, async () => {
    const filenames = await getFilesInFolder("../summary-report");
    // console.log("filenames:", filenames);

    for (const filename of filenames) {
      executed_tests = helpers.readJson(`./summary-report/${filename}`)?.tests;
    //   console.log("executed_tests:", executed_tests);
      getCoverage(feature_map, `./pw-coverage-report/${filename}`);
    }
  });
});

function getCoverage(filePath: string, outputFile?: string) {
  const obj = yaml.load(fs.readFileSync(filePath, { encoding: "utf-8" }));
  const pages = JSON.parse(JSON.stringify(obj, null, 2));
//   console.log("pages:", pages);

  const coverageReport: {
    [key: string]: any | { [key: string]: any };
  } = {
    total_features: 0,
    total_covered_features: 0,
    coverage: "",
    page_coverage: {},
    covered_features: [],
    uncovered_features: [],
  };

  pages.forEach((page: any) => {
    iterateThroughFeature(page.features);
    const pageCoverage =
      Math.round((coveredPageFeatures / totalPageFeatures) * 100 * 100) / 100;
    if (!Number.isNaN(pageCoverage)) {
      coverageReport.page_coverage[page.page] = pageCoverage;
    }

    // resetting count for the current page
    totalPageFeatures = 0;
    coveredPageFeatures = 0;
  });

  const totalCoverage =
    Math.round((coveredProductFeatures / totalProductFeatures) * 100 * 100) /
    100;
  coverageReport.total_features = totalProductFeatures;
  coverageReport.total_covered_features = coveredProductFeatures;
  coverageReport.coverage = totalCoverage + "%";
  coverageReport.covered_features = coveredFeatures;
  coverageReport.uncovered_features = uncoveredFeatures;

  if (outputFile) {
    if (!fs.existsSync(path.dirname(outputFile))) {
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    }
    fs.writeFileSync(outputFile, JSON.stringify(coverageReport));
  } else {
    console.log("\n total features:", totalProductFeatures);
    console.log("\n total covered features:", coveredProductFeatures);
    console.log("\n total coverage:", totalCoverage + "%");
    console.log("\n page coverage:", coverageReport.page_coverage);
    console.log("\n covered features:", coveredFeatures);
    console.log("\n uncovered features:", uncoveredFeatures);
  }
}

function iterateThroughFeature(feature: any) {
  Object.entries(feature).forEach(([key, value]) => {
    if (typeof value === "object") {
      iterateThroughFeature(feature[key]);
    } else {
      totalPageFeatures++;
      totalProductFeatures++;
      key = key.replace(" [lite]", "");
      if (value && executed_tests.includes(key)) {
        coveredPageFeatures++;
        coveredProductFeatures++;
        coveredFeatures.push(key);
      } else {
        uncoveredFeatures.push(key);
      }
    }
  });
}

async function getFilesInFolder(folderName: string) {
  const directoryPath = path.join(__dirname, folderName); // Join the folder name to the current directory
  const fileNames = await fs.promises.readdir(directoryPath); // Read the directory contents asynchronously
  return fileNames;
}
