import * as PIXI from "pixi.js";
import { createApp } from "./createApp";
import { socket } from "@/lib/socket";

type TokenState = {
  id: string;
  x: number;
  y: number;
};

export class Engine {
  // Pixi
  app!: PIXI.Application;
  stage!: PIXI.Container;

  // Campaign
  campaignId: string;

  tokens: Map<string, PIXI.Graphics> = new Map();

  // Drag state
  dragging: boolean = false;
  dragData: PIXI.FederatedPointerEvent | null = null;
  draggedToken: PIXI.Graphics | null = null;

  // Initialization tracking
  private initPromise: Promise<void>;
  private initialized: boolean = false;

  constructor(container: HTMLElement, campaignId: string) {
    this.campaignId = campaignId;

    // Pixi app
    this.initPromise = this.initializePixi(container);
  }

  // Initialization
  waitForInitialization(): Promise<void> {
    return this.initPromise;
  }

  private async initializePixi(container: HTMLElement) {
    this.app = await createApp(container);
    this.stage = this.app.stage;
    this.initialized = true;

    // Demo token
    this.createToken({
      id: "token-1",
      x: 300,
      y: 300,
    });

    // Join campaign room
    socket.emit("join", this.campaignId);

    // Socket listeners - bind context properly
    socket.on("token:update", this.onRemoteTokenUpdate);
  }

  // Dragable token
  createToken(state: TokenState) {
    const token = new PIXI.Graphics();
    token.beginFill(0xff4444);
    token.drawCircle(0, 0, 20);
    token.endFill();

    token.position.set(state.x, state.y);

    // Pixi v8 interaction
    token.eventMode = "static";
    token.cursor = "pointer";

    token.on("pointerdown", (e) => this.onDragStart(e, token));
    token.on("pointermove", (e) => this.onDragMove(e));
    token.on("pointerup", (e) => this.onDragEnd(e));
    token.on("pointerupoutside", (e) => this.onDragEnd(e));

    this.stage.addChild(token);
    this.tokens.set(state.id, token);
  }

  onDragStart = (e: PIXI.FederatedPointerEvent, token: PIXI.Graphics) => {
    this.dragging = true;
    this.dragData = e;
    this.draggedToken = token;
  };

  onDragMove = (e: PIXI.FederatedPointerEvent) => {
    if (!this.dragging || !this.draggedToken) return;

    const pos = e.getLocalPosition(this.stage);
    this.draggedToken.position.set(pos.x, pos.y);
  };

  onDragEnd = (e: PIXI.FederatedPointerEvent) => {
    if (!this.dragging || !this.draggedToken) return;

    const token = this.draggedToken;

    this.dragging = false;
    this.dragData = null;
    this.draggedToken = null;

    // Emit authoritative move
    socket.emit("token:move", {
      campaignId: this.campaignId,
      token: {
        x: token.x,
        y: token.y,
      },
    });
  };

  onRemoteTokenUpdate = (pos: { x: number; y: number }) => {
    const token = this.tokens.get("token-1");
    if (!token) return;

    token.position.set(pos.x, pos.y);
  };

  destroy() {
    socket.off("token:update", this.onRemoteTokenUpdate);
    if (this.initialized && this.app) {
      this.app.destroy(true, true);
    }
    this.tokens.clear();
  }
}
