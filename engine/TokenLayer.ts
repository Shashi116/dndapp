import * as PIXI from "pixi.js";

export class TokenLayer extends PIXI.Container {
  token: PIXI.Graphics;

  constructor() {
    super();
    this.token = new PIXI.Graphics();
    this.token.beginFill(0xff0000);
    this.token.drawCircle(0, 0, 20);
    this.token.endFill();
    this.token.position.set(200, 200);
    this.token.eventMode = "static";
    this.token.cursor = "pointer";
    this.addChild(this.token);
  }
}
