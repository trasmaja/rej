## Server

The server is a [Node.js](https://nodejs.org/) application and is build upon the [Express.js](https://expressjs.com/) web framework.

### Files

As you can see there are quite a few files in this directory, however most of them are configuration files that you don't have to (nor is expected to) understand in order to complete the lab.

The files you should care about are located in the [src](./src/) (source) folder:

**index.js:** This is the entry file and is both the most and least important one. Understanding this file is core to understanding how all the server files work together. However this file also contains most of the boilerplate code you usually have to write in order to get a server such as this one up and running; you very likely don't have to change any of this boilerplate, but it doesn't hurt to understand it.

**model.js:** This is where the data-structures are defined and how the data is related.

**models/\*.model.js:** These files define the models used in [model.js](./src/model.js). For example [room.model.js](./src/models/room.model.js) defines the model used to store chat rooms.

**controllers/\*.controller.js:** These files define what is supposed to happen for API requests and [Socket.IO](https://socket.io/) events related to a specific part of the application. For example [chat.controller.js](./src/controllers/chat.controller.js) handles all requests and events related to the real-time chat.
