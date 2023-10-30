import { Before, After, ITestCaseHookParameter } from '@cucumber/cucumber';
import { env } from '../../env/parseEnv';
import { ScenarioWorld } from './world';

Before(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
    console.log(`🥒 Running cucumber "${scenario.pickle.name}"`);

    const contextOptions = {
        recordVideo: {
            dir: `${env('VIDEO_PATH')}${scenario.pickle.name}`,
        },
    };

    const ready = await this.init(contextOptions);
    return ready;
});

After(async function (this: ScenarioWorld, scenario: ITestCaseHookParameter) {
    const {
        screen: { page, browser },
    } = this;
    const scenarioStatus = scenario.result?.status;
    const fs = require('fs');
    const path = require('path');
    if (scenarioStatus === 'FAILED') { 
        const scenarioName = scenario.pickle.name.replace(/\W+/g, '_');
    const screenshotPath = `${env('SCREENSHOT_PATH')}${scenarioName}.png`;
    const screenshotDirectory = path.dirname(screenshotPath);

    try {
      // Create the directory if it doesn't exist
      fs.mkdirSync(screenshotDirectory, { recursive: true });
      await page.setViewportSize({ width: 1920, height: 1400 });

      const screenshot = await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
      await this.attach(screenshot, 'image/png');
    } catch (error) {
      console.error(`Failed to capture screenshot: ${error}`);
    }

    await browser.close();
    return browser;
    }

    await browser.close();
    return browser;
});


