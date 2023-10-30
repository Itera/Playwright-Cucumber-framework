import dotenv from 'dotenv';
import reporter, { Options } from 'cucumber-html-reporter';
import { env } from '../env/parseEnv';

dotenv.config({ path: './env/common.env' });

const htmlOptions: Options = {
  theme: 'bootstrap',
  jsonFile: env('JSON_REPORT_FILE'),
  output: env('HTML_REPORT_FILE'),
  //output: env('HTML_REPORT_FILE').replace(/\.html$/, '.xml'),
  screenshotsDirectory: env('SCREENSHOT_PATH'),
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  launchReport: false,
};
/* // Define options for XML report
const xmlOptions: Options = {
  theme: 'bootstrap',
  jsonFile: env('JSON_REPORT_FILE'),
  output: env('HTML_REPORT_FILE').replace(/\.html$/, '.xml'),
  screenshotsDirectory: env('SCREENSHOT_PATH'),
  storeScreenshots: true,
  reportSuiteAsScenarios: true,
  launchReport: false,
};
// Generate HTML report
reporter.generate(htmlOptions);

// Generate XML report
reporter.generate(xmlOptions);
 */
reporter.generate(htmlOptions);
