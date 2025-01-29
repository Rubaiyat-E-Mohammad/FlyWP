// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
const { SHA, E2E_TEST_RESULT, E2E_COVERAGE } = process.env;

const replace = obj => Object.keys(obj).forEach(key => (typeof obj[key] == 'object' ? replace(obj[key]) : (obj[key] = String(obj[key]))));
const readFile = filePath => (fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : false);

const getTestResult = (suiteName, filePath, coverage) => {
    const testResult = readFile(filePath);
    if (!testResult) {
        console.log(`Test Result File ${filePath.split('/').pop()} does not exist!!`);
        return [];
    }
    replace(testResult);
    const testSummary = [
        suiteName,
        testResult.total_tests,
        testResult.passed,
        testResult.failed,
        testResult.flaky,
        testResult.skipped,
        testResult.suite_duration_formatted,
        coverage,
    ];
    return testSummary;
};


const getCoverageReport = filePath => {
    const coverageReport = readFile(filePath);
    if (!coverageReport) {
        console.log(`Coverage Report File ${filePath.split('/').pop()} does not exists!!`);
        return '';
    }
    return String(coverageReport.coverage);
};

const addSummaryHeadingAndTable = core => {
    const tableHeader = [
        { data: 'Test  :test_tube:', header: true },
        { data: 'Total  :bar_chart:', header: true },
        { data: 'Passed  :white_check_mark:', header: true },
        { data: 'Failed  :rotating_light:', header: true },
        { data: 'Flaky  :construction:', header: true },
        { data: 'Skipped  :next_track_button:', header: true },
        { data: 'Duration  :alarm_clock:', header: true },
        { data: 'Coverage  :checkered_flag:', header: true },
    ];
    const e2eTestResult = getTestResult('E2E Tests', E2E_TEST_RESULT, getCoverageReport(E2E_COVERAGE));
    const commit_sha = SHA ? `Commit SHA: ${SHA}` : '';
    if (e2eTestResult.length > 0) {
        core.summary.addHeading('Tests Summary').addRaw(commit_sha).addBreak().addBreak().addTable([tableHeader, e2eTestResult]);
    }
};

module.exports = async ({ github, context, core }) => {
    await core.summary.clear();
    addSummaryHeadingAndTable(core);
    const summary = core.summary.stringify();
    await core.summary.write();
    return summary;
};