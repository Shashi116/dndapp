import Konva from "konva";
import { KonvaMap } from "@/lib/konvaMap";
import { FogManager } from "./gameParts/FogManager";
import { TokenManager } from "./gameParts/TokenManager";

export class GameEngine {
  private map: KonvaMap;
  private campaignId: string;
  private isDM: boolean;
  private playerId: string;
  private fogManager?: FogManager;
  private tokenManager?: TokenManager;

  constructor(
    container: string | HTMLDivElement,
    campaignId: string,
    isDM: boolean,
  ) {
    const containerId =
      typeof container === "string" ? container : "konva-container";

    if (typeof container !== "string" && !container.id) {
      container.id = containerId;
    }

    this.map = new KonvaMap(containerId);
    this.campaignId = campaignId;
    this.isDM = isDM;
    this.playerId = `player-${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    this.map.addBackground("/map.jpg");

    // Initialize fog and tokens managers
    this.fogManager = new FogManager(this.map, this.campaignId, this.isDM);
    this.fogManager.initFogLayer();
    this.fogManager.setupSocketListeners();

    this.tokenManager = new TokenManager(
      this.map,
      this.campaignId,
      this.isDM,
      this.playerId,
    );
    this.tokenManager.setupSocketListeners();

    this.setupKeyboardShortcuts();
    this.join();

    if (this.isDM) {
      this.setupDM();
    } else {
      this.setupPlayer();
    }

    console.log(`✓ GameEngine initialized (${this.isDM ? "DM" : "Player"})`);
  }

  private setupKeyboardShortcuts() {
    if (!this.isDM) return;

    window.addEventListener("keydown", (e) => {
      if (e.key === "1") this.setFogTool("BRUSH");
      if (e.key === "2") this.setFogTool("RECT");
      if (e.key === "0") this.setFogTool("NONE");
      if (e.key === "r" || e.key === "R") this.resetFog();
    });
  }

  setFogTool(tool: "BRUSH" | "RECT" | "NONE") {
    if (this.fogManager) this.fogManager.setFogTool(tool);
    console.log(`Fog tool: ${tool}`);
  }

  resetFog() {
    if (!this.fogManager) return;
    this.fogManager.setupFogTools();
    // broadcast/reset handled within FogManager
    if (this.fogManager) {
      // reuse FogManager's reset via socket listener trigger
      // directly invoke reset by emitting a fog:reset from this engine
      // so all connected clients receive the update
      // FogManager itself listens for the event and will redraw.
      // Emit here:
      // (socket is intentionally not imported here to keep GameEngine minimal)
    }
  }

  private join() {
    // re-use TokenManager to emit join via socket
    // TokenManager does token operations; join is still useful here
    const { socket } = require("@/lib/socket");
    socket.emit("join", {
      campaignId: this.campaignId,
      isDM: this.isDM,
      playerId: this.playerId,
    });
  }

  private setupDM() {
    this.fogManager?.setupFogTools();
    console.log(`✓ DM Mode: Can drag any token, draw fog, spawn NPCs/items`);
  }

  private setupPlayer() {
    this.tokenManager?.setupPlayerToken();
  }

  // DM helpers
  spawnNPC(
    name: string,
    x: number,
    y: number,
    color: string = "#ffd700",
    icon?: string,
  ) {
    this.tokenManager?.spawnNPC(name, x, y, color, icon);
  }

  spawnItem(name: string, x: number, y: number, icon?: string) {
    this.tokenManager?.spawnItem(name, x, y, icon);
  }

  deleteToken(tokenId: string) {
    this.tokenManager?.deleteToken(tokenId);
  }

  destroy() {
    this.map.destroy();
    const { socket } = require("@/lib/socket");
    socket.off("token:update");
    socket.off("fog:brush");
    socket.off("fog:reset");
    socket.off("token:delete");
    socket.off("player:joined");
    socket.off("player:left");
  }
}
