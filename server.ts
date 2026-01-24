import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Store campaign data
const campaigns = new Map<
  string,
  {
    dmId?: string;
    players: Set<string>;
    gameState: any;
    tokens: Map<string, any>; // Track all tokens
  }
>();

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("join", ({ campaignId, isDM, playerId }) => {
      socket.join(campaignId);

      if (!campaigns.has(campaignId)) {
        campaigns.set(campaignId, {
          dmId: isDM ? socket.id : undefined,
          players: new Set(),
          gameState: { tokens: [] },
          tokens: new Map(),
        });
      }

      const campaign = campaigns.get(campaignId)!;
      campaign.players.add(socket.id);

      if (isDM) {
        campaign.dmId = socket.id;
      }

      // Send all existing tokens to the joining player
      const existingTokens = Array.from(campaign.tokens.values());
      if (existingTokens.length > 0) {
        socket.emit("token:update", existingTokens);
        console.log(
          `Sent ${existingTokens.length} existing tokens to ${playerId}`,
        );
      }

      // Notify others of new player
      socket.to(campaignId).emit("player:joined", playerId);
      console.log(`Player ${playerId} joined campaign ${campaignId}`);
    });

    // ---- Token Movement ----
    socket.on("token:move", ({ campaignId, token, playerId }) => {
      const campaign = campaigns.get(campaignId);
      if (campaign) {
        campaign.tokens.set(token.id, token);
      }
      // Broadcast to ALL clients in campaign (including sender)
      io.to(campaignId).emit("token:update", token);
      console.log(`Token moved by ${playerId}:`, token.id);
    });

    // ---- Fog Updates ----
    socket.on("fog:brush", ({ campaignId, x, y, radius }) => {
      socket.to(campaignId).emit("fog:brush", { x, y, radius });
      console.log(`Fog brush at ${x}, ${y}, radius: ${radius}`);
    });

    socket.on("fog:rect", ({ campaignId, x, y, width, height }) => {
      socket.to(campaignId).emit("fog:rect", { x, y, width, height });
      console.log(`Fog rectangle at ${x}, ${y}, size: ${width}x${height}`);
    });

    socket.on("fog:reset", ({ campaignId }) => {
      socket.to(campaignId).emit("fog:reset", {});
      console.log("Fog reset");
    });

    socket.on("token:delete", ({ campaignId, tokenId }) => {
      const campaign = campaigns.get(campaignId);
      if (campaign) {
        campaign.tokens.delete(tokenId);
      }
      socket.to(campaignId).emit("token:delete", { tokenId });
      console.log(`Token deleted: ${tokenId}`);
    });

    // ---- Game State Sync ----
    socket.on("game:state", ({ campaignId, state }) => {
      const campaign = campaigns.get(campaignId);
      if (campaign) {
        campaign.gameState = state;
      }
      socket.to(campaignId).emit("game:state", state);
    });

    socket.on("disconnect", () => {
      // Clean up campaigns
      for (const [campaignId, campaign] of campaigns.entries()) {
        campaign.players.delete(socket.id);
        if (campaign.dmId === socket.id) {
          campaign.dmId = undefined;
        }

        if (campaign.players.size === 0) {
          campaigns.delete(campaignId);
        } else {
          socket.to(campaignId).emit("player:left", socket.id);
        }
      }
      console.log(`Player disconnected: ${socket.id}`);
    });
  });

  expressApp.all("*", (req, res) => handle(req, res));

  httpServer.listen(3000, () => {
    console.log("http://localhost:3000");
  });
});
