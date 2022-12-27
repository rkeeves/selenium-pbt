import { AsyncCommand } from "fast-check";
import { App } from "../app/App";
import { InventoryScene } from "../app/scenes/InventoryScene";
import { LoginScene } from "../app/scenes/LoginScene";
import { AppModel } from "../model/AppModel";

export class LoginSuccessfullyCommand
  implements AsyncCommand<AppModel, App, true>
{
  constructor(readonly uname: string, readonly pass: string) {}

  async check(m: Readonly<AppModel>) {
    return (
      m.sessionUsername === undefined && m.currentSceneId === LoginScene.sceneId
    );
  }

  async run(m: AppModel, app: App) {
    // Arrange
    await app.loginScene().assertIsAt();
    // Act
    await app.loginScene().fireTryLogin(this.uname, this.pass);
    // Assert
    await app.inventoryScene().assertIsAt();
    // Update model
    m.sessionUsername = this.uname;
    m.currentSceneId = InventoryScene.sceneId;
  }
  toString(): string {
    return `LoginSuccessfullyCommand{uname=${this.uname}, pass=${this.pass}}`;
  }
}
