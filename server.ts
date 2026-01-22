import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();
  const httpServer = createServer(expressApp);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("join", (campaignId) => {
      socket.join(campaignId);
    });

    socket.on("token:move", ({ campaignId, token }) => {
      socket.to(campaignId).emit("token:update", token);
    });
  });

  expressApp.all("*", (req, res) => handle(req, res));

  httpServer.listen(3000, () => {
    console.log("http://localhost:3000");
  });
});
