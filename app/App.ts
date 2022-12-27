import { WebDriver } from "selenium-webdriver";
import { InventoryScene } from "./scenes/InventoryScene";
import { LoginScene } from "./scenes/LoginScene";
import { RobotsScene } from "./scenes/RobotsScene";

export class App {
  private readonly the_robotsScene: RobotsScene;
  private readonly the_loginScene: LoginScene;
  private readonly the_inventoryScene: InventoryScene;

  constructor(
    readonly driver: WebDriver,
    readonly baseUrl: string,
    readonly timeout: number
  ) {
    this.the_robotsScene = new RobotsScene(driver, baseUrl, timeout);
    this.the_loginScene = new LoginScene(driver, baseUrl, timeout);
    this.the_inventoryScene = new InventoryScene(driver, baseUrl, timeout);
  }

  robotsScene() {
    return this.the_robotsScene;
  }

  loginScene() {
    return this.the_loginScene;
  }

  inventoryScene() {
    return this.the_inventoryScene;
  }
}
