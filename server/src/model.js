
import { createRequire } from "module";
import Game from './GameEngine.js';

const require = createRequire(import.meta.url);
const Finance = require("tvm-financejs");


class Model {
  constructor() {
    this.financeCalcs = new Finance(); // not used atm
    this.io = undefined;
    this.game = new Game();
  }



  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  init(io) {
    this.io = io;
  }


}

export default new Model();
