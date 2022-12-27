import { WebDriver, until, By } from "selenium-webdriver";
import { byTestId } from "../../auxiliary/selenium/ByTestId";

export class LoginScene {
  static sceneId: string = "login-page";

  private readonly the_url: string;
  private readonly by_uname: By;
  private readonly by_pass: By;
  private readonly by_submit: By;

  constructor(
    readonly driver: WebDriver,
    readonly baseUrl: string,
    readonly timeout: number
  ) {
    this.the_url = baseUrl + "/";
    this.by_uname = byTestId("username");
    this.by_pass = byTestId("password");
    this.by_submit = byTestId("login-button");
  }

  async assertIsAt() {
    await this.driver.wait(until.urlIs(this.the_url), this.timeout);
  }

  async fireGoto() {
    await this.driver.navigate().to(this.the_url);
    await this.driver.wait(until.urlIs(this.the_url), this.timeout);
  }

  async fireTryLogin(uname: string, pass: string) {
    await this.driver.findElement(this.by_uname).sendKeys(uname);
    await this.driver.findElement(this.by_pass).sendKeys(pass);
    await this.driver.findElement(this.by_submit).click();
  }
}
