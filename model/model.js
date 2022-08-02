import { createRequire } from "module";
import Params from './params.js';
import { Industri, Policy } from "./sector.js";

const require = createRequire(import.meta.url);
const Finance = require("tvm-financejs");

class Model {
  constructor() {
    this.financeCalcs = new Finance(); // not used atm
    this.params = new Params();
    this.sectors = [];
    this.addSectors();
    this.currentTurn = 1;
    this.nrOfTurns = 5;

    this.dataForEachTurn = [null, null, null, null, null];
    this.dataForEachTurn[0] = Object.assign(Object.create(this.params), this.params);
    this.state = "playing"; // "playing" or "presenting"

  }

  addSectors() {
    this.sectors.push(new Industri(0, this.params));
    // this.sectors.push(new Policy(1, this.params));
  }



  next() {
    if (this.currentTurn > this.nrOfTurns) {
      return
    }
    if (this.state === "playing") {
      this.executeVotes();
      this.params.turnCalculations();
      this.state = "presenting";
    } else {
      this.currentTurn += 1;
      this.dataForEachTurn[this.currentTurn-1] = Object.assign(Object.create(this.params), this.params);
      this.resetVotes();
      this.state = "playing";
    }
  }

  incomingVote(sector, decisionIndex) {
    const nameToIndex = {
      "Industrimagnat": 0,
    }
    const index = nameToIndex[sector];
    this.sectors[index].vote(decisionIndex);
  }

  resetVotes() {
    this.sectors.forEach(sector => {
      sector.resetVotes();
    }
    )
  }
  
  executeVotes() {
    this.sectors.forEach(sector => {
      sector.executeVote();
    }
    )
  }

  getGameData() {
    const data = {};
    data.turn = this.currentTurn;
    data.state = this.state;
    data.data = this.dataForEachTurn;
    return data;
  }


}

export default new Model();