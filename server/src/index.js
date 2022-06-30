import betterLogging from "better-logging";
import express from "express";
import expressSession from "express-session";
import socketIOSession from "express-socket.io-session";
import { Server } from "socket.io";
import { createServer } from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import test from "./controllers/test.controller.js";

import model from "./model.js";

const port = 5000;
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
model.init(io, "../model/jsonFiles/beslut.json");

// Handle socket.io connections.
io.on("connection", (socket) => {
  const { session } = socket.handshake;
  session.socketID = socket.id;
  session.save((err) => {
    if (err) console.error(err);
    else console.debug(`Saved socketID: ${session.socketID}`);
  });

  socket.on("tmpSelection", (data) => {
    model.tmpSelect(data);
  });

  socket.on("getTurn", () => {
    socket.emit("getTurnResponse", model.getTurn());
  });


  socket.on("getGameData", () => {
    const gameData = model.getGameDataForCurrentTurn();
    socket.emit("getGameDataResponse", gameData);
  })
  
  
  socket.on("getSectors", () => {
    socket.emit("recieveSectors", model.getSectors());
  });
  

  socket.on("selectSector", sectorName => {
    model.addCountToSector(sectorName)
  })

  socket.on("nextTurn", () => {
    model.nextTurn();
    const gameData = model.getGameDataForCurrentTurn();
    io.emit("getGameDataResponse", gameData);
    io.emit("getTurnResponse", model.getTurn());
  })
  socket.emit("updateGame", model.getGameData())



});

const currentPath = dirname(fileURLToPath(import.meta.url));
const publicPath = join(currentPath, "..", "..", "client", "build");

// Serve static files.
app.use(express.static(publicPath));

// Catch all
app.get('*', (_req, res) => {
  res.sendFile('index.html', { root: publicPath });
});
server.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
