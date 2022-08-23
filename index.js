import betterLogging from "better-logging";
import express from "express";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import { Server } from "socket.io";
import { createServer } from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import test from "./controllers/test.controller.js";

import Model from "./model/model.js";

const port = process.env.PORT || 8080;
const app = express(); // Create express app.
const server = createServer(app);
const io = new Server(server); // Create socket.io app.

const { Theme } = betterLogging;
betterLogging(console, {
  color: Theme.green,
});

// Enable debug output.
console.logLevel = 4;

// Enhance log messages with timestamps etc.
app.use(
  betterLogging.expressMiddleware(console, {
    ip: { show: true, color: Theme.green.base },
    method: { show: true, color: Theme.green.base },
    header: { show: false },
    path: { show: true },
    body: { show: true },
  })
);

/*
This is a middleware that parses the body of the request into a javascript object.
It's basically just replacing the body property like this:
req.body = JSON.parse(req.body)
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConf = expressSession({
  secret: "Super secret! Shh! Do not tell anyone...",
  resave: true,
  saveUninitialized: true,
});

// Configure session management.
app.use(sessionConf);
io.use(
  socketIOSession(sessionConf, {
    autoSave: true,
    saveUninitialized: true,
  })
);

// Bind REST controllers to /api/*.
app.use("/api", test.router);

// Initialize model.
// model.init(io);
// Handle socket.io connections.
const players = {};
let model = new Model();

io.on("connection", (socket) => {
  const { session } = socket.handshake;
  session.socketID = socket.id;
  session.save((err) => {
    if (err) console.error(err);
    else console.debug(`Saved socketID: ${session.socketID}`);
  });

  players[session.socketID] = model.getSectorForPlayer();
  io.emit("adminGameData", model.getGameData());

  socket.on("vote", (data) => {
    // data={ sector: "industry", decisionIndex: 0 }
    console.log("voted")
    console.log(data)
    model.incomingVote(data.sector, data.decisionIndex, data.question);
  })

  socket.on("getAdminGameData", () => {
    socket.emit("adminGameData", model.getGameData());
  })

  socket.on("getGameData", () => {
    socket.emit("gameData", model.getGameData());
  })

  socket.on("resetGame", () => {
    model = null;
    model = new Model();
    io.emit("gameData", model.getGameData());
    io.emit("adminGameData", model.getGameData());
  })

  socket.on("endTurn", () => {
    if (model.state === "playing") {
      model.next();
      io.emit("gameData", model.getGameData());
      io.emit("adminGameData", model.getGameData());
    }
  })

  socket.on("startTurn", () => {
    if (model.state === "presenting") {
      model.next();
      io.emit("gameData", model.getGameData());
      io.emit("adminGameData", model.getGameData());
    }
  })

  socket.on("getPlayerSector", () => {
    socket.emit("playerSector", players[session.socketID]);
  })

  socket.on("disconnect", () => {
    console.log("disconnected")
    model.removePlayerSector(players[session.socketID]);
    delete players[session.socketID];
    io.emit("adminGameData", model.getGameData());
  })

});

const currentPath = dirname(fileURLToPath(import.meta.url));
const publicPath = join(currentPath, "client", "build");

// Serve static files.
app.use(express.static(publicPath));

// Catch all
app.get('*', (_req, res) => {
  res.sendFile('index.html', { root: publicPath });
});
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
