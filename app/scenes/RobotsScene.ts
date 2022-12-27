import { WebDriver, until, By } from "selenium-webdriver";

export class RobotsScene {
  private readonly the_url: string;

  static sceneId: string = "robots-txt";

  constructor(
    readonly driver: WebDriver,
    readonly baseUrl: string,
    readonly timeout: number
  ) {
    this.the_url = baseUrl + "/robots.txt";
  }

  async actClearState() {
    await this.driver.navigate().to(this.the_url);
    await this.driver.wait(until.urlIs(this.the_url), this.timeout);
    await this.driver.manage().deleteCookie("session-username");
    await this.driver.executeScript(
      `window.localStorage.removeItem('cart-contents')`
    );
  }
}
