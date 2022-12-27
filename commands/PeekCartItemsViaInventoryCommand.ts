import { AsyncCommand } from "fast-check";
import { LogicalOrCoalescingAssignmentOperator } from "typescript";
import { App } from "../app/App";
import { InventoryScene } from "../app/scenes/InventoryScene";
import { AppModel } from "../model/AppModel";
import * as Oracle from "../oracle/Oracle";

export class PeekCartItemsViaInventory
  implements AsyncCommand<AppModel, App, true>
{
  constructor() {}

  async check(m: Readonly<AppModel>) {
    return (
      m.sessionUsername !== undefined &&
      m.currentSceneId === InventoryScene.sceneId
    );
  }

  async run(m: AppModel, app: App) {
    // Arrange
    const inventoryScene = app.inventoryScene();
    await inventoryScene.assertIsAt();

    // Act
    // Assert
    for (const itemData of Oracle.allItemsNaturalOrder) {
      const inventoryListItem = inventoryScene.inventoryItemById(itemData.id);
      await inventoryListItem.assertIsPresent();
      if (m.cart.has(itemData.id)) {
        await inventoryListItem.assertIsInCart();
      } else {
        await inventoryListItem.assertIsNotInCart();
      }
    }
    // Update model
  }
  toString(): string {
    return `PeekCartItemsViaInventory{}`;
  }
}
