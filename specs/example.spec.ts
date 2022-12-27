import * as fc from "fast-check";
import { VerbosityLevel } from "fast-check";
import { Builder, WebDriver } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";
import { App } from "../app/App";
import { AppModel } from "../model/AppModel";
import { LoginSuccessfullyCommand } from "../commands/LoginSuccessfullyCommand";
import { PeekCartItemsViaInventory } from "../commands/PeekCartItemsViaInventoryCommand";
import { AddItemViaInventoryCommand } from "../commands/AddItemViaInventoryCommand";
import { RemoveItemViaInventoryCommand } from "../commands/RemoveItemViaInventoryCommand";
import { LoginScene } from "../app/scenes/LoginScene";
import * as Oracle from "../oracle/Oracle";

const TimeoutMin = 30;
const TimeoutMs = TimeoutMin * 60 * 1000;
const BaseUrl = "http://localhost:3000";

describe("Sauce demo model", function () {
  let driver: WebDriver;
  let app: App;

  beforeAll(async () => {
    const options = new chrome.Options();
    driver = await new Builder()
      .setChromeOptions(options)
      .forBrowser("chrome")
      .build();

    app = new App(driver, BaseUrl, 5000);
  });

  afterAll(async () => {
    await driver.quit();
  });

  it(
    "Inventory Page add-to-cart/remove, should behave just like add/remove from a set",
    async () => {
      await fc.assert(
        fc
          .asyncProperty(
            fc.commands(
              [
                fc.constantFrom(
                  new LoginSuccessfullyCommand("standard_user", "secret_sauce"),
                  new LoginSuccessfullyCommand("problem_user", "secret_sauce")
                ),
                fc.constant(new PeekCartItemsViaInventory()),
                fc
                  .integer({
                    min: 0,
                    max: Oracle.allItemsNaturalOrder.length - 1,
                  })
                  .map((itemId) => new RemoveItemViaInventoryCommand(itemId)),
                fc
                  .integer({
                    min: 0,
                    max: Oracle.allItemsNaturalOrder.length - 1,
                  })
                  .map((itemId) => new AddItemViaInventoryCommand(itemId)),
              ],
              {
                /* more options here */
              }
            ),
            async (cmds) => {
              const model: AppModel = {
                sessionUsername: undefined,
                cart: new Set<number>(),
                currentSceneId: LoginScene.sceneId,
              };
              const setup = () => ({
                model,
                real: app,
              });
              await fc.asyncModelRun(setup, cmds);
            }
          )
          .beforeEach(async () => {
            await app.robotsScene().actClearState();
            await app.loginScene().fireGoto();
          }),
        {
          /* Paste 'seed' and 'path' from test report. Here's an example:
          seed: -849429225,
          path: "17",
          endOnFailure: true,
          */
          verbose: VerbosityLevel.VeryVerbose,
        }
      );
    },
    TimeoutMs
  );
});
