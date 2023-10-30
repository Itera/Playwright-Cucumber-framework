import playwright, { BrowserContextOptions, Page, Browser, BrowserContext, BrowserType } from 'playwright';
import { env } from '../../env/parseEnv';
import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Container, CosmosClient, Database } from '@azure/cosmos';
import { AppConfigurationClient } from '@azure/app-configuration';

export type Screen = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
};

export class ScenarioWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }

  screen!: Screen;
  cosmosClient!: CosmosClient;
  database!: Database;
  container!: Container;
  hostUrl!: string;
  loginPath!: string;
  kartleggingPath!: string;
  page!: Page;

  async init(contextOptions?: BrowserContextOptions): Promise<Screen> {
    await this.screen?.page?.close();
    await this.screen?.context?.close();
    await this.screen?.browser?.close();
    //await this.newDbConnection();

    const browser = await this.newBrowser();
    const context = await browser.newContext(contextOptions);
    //await context.addInitScript({ path: 'node_modules/axe-core/axe.min.js' });
    const page = await context.newPage();
    this.screen = {
      browser,
      context,
      page,
    };

    this.hostUrl = process.env.HOST_URL || '';
    this.loginPath = process.env.LOGIN_PATH || '';
    this.kartleggingPath = process.env.KARTLEGGING_PATH || '';
    this.page = page;

    return this.screen;
  }

  private newBrowser = async (): Promise<Browser> => {
    const automationBrowsers = ['firefox', 'webkit'];
    type AutomationBrowser = (typeof automationBrowsers)[number];
    const automationBrowser = env('UI_AUTOMATION_BROWSER') as AutomationBrowser;

    const browserType: BrowserType = playwright[automationBrowser];
    const browser = await browserType.launch({
      headless: process.env.HEADLESS !== 'false',
      //headless: false,
      args: ['--disable-web-secutiy', '--disable-features=IsolateOrigins, site-per-process'],
    });
    return browser;
  };

 /*  private newDbConnection = async (): Promise<void> => {
    const connection_string = process.env.AZURE_APP_CONFIG_CONNECTION_STRING || '';
    const appConfigClient = new AppConfigurationClient(connection_string);
    const connectionString = await appConfigClient.getConfigurationSetting({
      key: 'ConnectionStrings:CosmosDb',
    });

    if (connectionString?.value == null) {
      console.log('Connection string not found');
      return;
    }

    const databseName = process.env.DATABASE_NAME || 'bosettingskartleggingstjeneste';
    const containerName = process.env.CONTAINER_NAME || 'Personer';

    this.cosmosClient = new CosmosClient(connectionString.value);
    this.database = await this.cosmosClient.database(databseName);
    this.container = await this.database.container(containerName);
    //console.log(connectionString);
  }; */

/*   public Login = async function (page: Page, uname: string, pwd: string): Promise<void> {
    //const loginUrlAction = (process.env.HOST_URL || '') + (process.env.LOGIN_PATH || '');
    const loginUrlAction = process.env.HOST_URL || '';
    await page.goto(loginUrlAction);
    await page.locator('//*[@id="userNameInput"]').fill(uname);
    await page.locator('//*[@id="passwordInput"]').fill(pwd);
    await page.locator('//*[@id="submitButton"]').click();
  }; */
}
setWorldConstructor(ScenarioWorld);
