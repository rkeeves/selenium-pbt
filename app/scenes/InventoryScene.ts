import { WebDriver, until, By } from "selenium-webdriver";
import * as Oracle from "../../oracle/Oracle";
import { InventoryListItem } from "../components/InventoryListItem";

export class InventoryScene {
  static sceneId: string = "inventory-page";

  private readonly the_url: string;

  constructor(
    readonly driver: WebDriver,
    readonly baseUrl: string,
    readonly timeout: number
  ) {
    this.the_url = baseUrl + "/inventory.html";
  }

  inventoryItemById(itemId: number) {
    return new InventoryListItem(
      this.driver,
      this.timeout,
      By.xpath(
        `//div[text()='${Oracle.allItemsNaturalOrder[itemId].name}']/ancestor::div[@class='inventory_item']`
      ),
      itemId
    );
  }

  async assertIsAt() {
    await this.driver.wait(until.urlIs(this.the_url), this.timeout);
  }
}
