import { WebDriver, until, By } from "selenium-webdriver";
import * as Oracle from "../../oracle/Oracle";

export class InventoryListItem {
  private readonly by_add: By;
  private readonly by_remove: By;

  constructor(
    readonly driver: WebDriver,
    readonly timeout: number,
    readonly by_root: By,
    readonly itemId: number
  ) {
    const testNickname = Oracle.allItemsNaturalOrder[this.itemId].testNickname;
    this.by_add = By.css(`button[data-test='add-to-cart-${testNickname}']`);
    this.by_remove = By.css(`button[data-test='remove-${testNickname}']`);
  }

  async assertIsPresent() {
    await this.driver.wait(until.elementLocated(this.by_root), this.timeout);
  }

  async assertIsInCart() {
    await this.driver.wait(until.elementLocated(this.by_remove), this.timeout);
  }

  async fireAddToCart() {
    await this.driver
      .wait(until.elementLocated(this.by_add), this.timeout)
      .click();
  }

  async assertIsNotInCart() {
    await this.driver.wait(until.elementLocated(this.by_add), this.timeout);
  }

  async fireRemoveFromCart() {
    await this.driver
      .wait(until.elementLocated(this.by_remove), this.timeout)
      .click();
  }
}
