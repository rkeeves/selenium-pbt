import { AsyncCommand } from "fast-check";
import { App } from "../app/App";
import { InventoryScene } from "../app/scenes/InventoryScene";
import { AppModel } from "../model/AppModel";

export class RemoveItemViaInventoryCommand
  implements AsyncCommand<AppModel, App, true>
{
  constructor(readonly itemId: number) {}

  async check(m: Readonly<AppModel>) {
    return (
      m.sessionUsername !== undefined &&
      m.currentSceneId === InventoryScene.sceneId &&
      m.cart.has(this.itemId)
    );
  }

  async run(m: AppModel, app: App) {
    // Arrange
    await app.inventoryScene().assertIsAt();
    const inventoryListItem = app
      .inventoryScene()
      .inventoryItemById(this.itemId);
    await inventoryListItem.assertIsPresent();
    await inventoryListItem.assertIsInCart();
    // Act
    await inventoryListItem.fireRemoveFromCart();
    // Assert
    await inventoryListItem.assertIsNotInCart();
    // Update model
    m.cart.delete(this.itemId);
  }
  toString(): string {
    return `RemoveItemViaInventoryCommand{itemId=${this.itemId}}`;
  }
}
