class Model {
  constructor() {
    this.io = undefined;
    // Åren vi ska gå igenom
    this.years = [2022, 2025, 2030, 2035, 2040, 2045]
    // Vilket steg spelet är på (0 - 5)
    this.turn = 0;
  }

  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  init(io) {
    this.io = io;
  }

  nextTurn() {
    // Alla beräknignar mellan turnsen här

    this.turn += 1;
  }

  getGameData() {
    return { turn: this.turn, year: this.years[this.turn] }
  }

}

export default new Model();
