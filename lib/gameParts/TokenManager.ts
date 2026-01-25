import { KonvaMap, Token } from "@/lib/konvaMap";
import { socket } from "@/lib/socket";

export class TokenManager {
  map: KonvaMap;
  campaignId: string;
  isDM: boolean;
  playerId: string;
  username: string;
  tokens = new Map<string, Token>();

  constructor(
    map: KonvaMap,
    campaignId: string,
    isDM: boolean,
    playerId: string,
    username: string = "Player",
  ) {
    this.map = map;
    this.campaignId = campaignId;
    this.isDM = isDM;
    this.playerId = playerId;
    this.username = username;
  }

  handleTokenUpdate(data: Token | Token[]) {
    const tokenList = Array.isArray(data) ? data : [data];
    tokenList.forEach((token) => {
      if (this.tokens.has(token.id)) {
        this.tokens.set(token.id, token);
        this.map.updateToken(token.id, token.x, token.y);
      } else {
        this.tokens.set(token.id, token);
        const canDrag = this.isDM || token.id === `token-${this.playerId}`;
        const onDrag = canDrag ? (t: Token) => this.onTokenDrag(t) : undefined;
        this.map.addToken(token, onDrag, this.isDM);
      }
    });
  }

  onTokenDrag(token: Token) {
    if (!this.isDM && token.id !== `token-${this.playerId}`) return;
    socket.emit("token:move", {
      campaignId: this.campaignId,
      token,
      playerId: this.playerId,
    });
  }

  setupPlayerToken() {
    // Check if player token already exists (prevents duplicates on refresh)
    const playerTokenId = `token-${this.playerId}`;
    if (this.tokens.has(playerTokenId)) {
      console.log(`Player token already exists: ${playerTokenId}`);
      return;
    }

    const playerToken: Token = {
      id: playerTokenId,
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
      label: this.username,
      color: "#4ecdc4",
      playerId: this.playerId,
    };

    this.tokens.set(playerToken.id, playerToken);
    this.map.addToken(
      playerToken,
      (updated: Token) => {
        if (updated.id === playerToken.id) {
          this.tokens.set(updated.id, updated);
          socket.emit("token:move", {
            campaignId: this.campaignId,
            token: updated,
            playerId: this.playerId,
          });
        }
      },
      false,
    );

    socket.emit("token:move", {
      campaignId: this.campaignId,
      token: playerToken,
      playerId: this.playerId,
    });
  }

  spawnNPC(
    name: string,
    x: number,
    y: number,
    color: string = "#ffd700",
    icon?: string,
  ) {
    if (!this.isDM) return console.warn("Only DM can spawn NPCs");
    const npcToken: Token = {
      id: `token-npc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x,
      y,
      label: name,
      color,
      playerId: "npc",
      icon,
    };
    this.tokens.set(npcToken.id, npcToken);
    this.map.addToken(
      npcToken,
      (updated: Token) => {
        this.tokens.set(updated.id, updated);
        socket.emit("token:move", {
          campaignId: this.campaignId,
          token: updated,
          playerId: this.playerId,
        });
      },
      true,
    );
    socket.emit("token:move", {
      campaignId: this.campaignId,
      token: npcToken,
      playerId: this.playerId,
    });
  }

  spawnItem(name: string, x: number, y: number, icon?: string) {
    if (!this.isDM) return console.warn("Only DM can spawn items");
    const itemToken: Token = {
      id: `token-item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      x,
      y,
      label: name,
      color: "#4ecdc4",
      playerId: "item",
      icon,
    };
    this.tokens.set(itemToken.id, itemToken);
    this.map.addToken(
      itemToken,
      (updated: Token) => {
        this.tokens.set(updated.id, updated);
        socket.emit("token:move", {
          campaignId: this.campaignId,
          token: updated,
          playerId: this.playerId,
        });
      },
      true,
    );
    socket.emit("token:move", {
      campaignId: this.campaignId,
      token: itemToken,
      playerId: this.playerId,
    });
  }

  deleteToken(tokenId: string) {
    if (!this.isDM) return console.warn("Only DM can delete tokens");
    this.tokens.delete(tokenId);
    this.map.removeToken(tokenId);
    socket.emit("token:delete", {
      campaignId: this.campaignId,
      tokenId,
    });
  }

  setupSocketListeners() {
    socket.on("token:update", (data: Token | Token[]) => {
      this.handleTokenUpdate(data);
    });

    socket.on("token:delete", ({ tokenId }: { tokenId: string }) => {
      this.tokens.delete(tokenId);
      this.map.removeToken(tokenId);
    });
  }
}
