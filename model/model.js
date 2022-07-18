import { createRequire } from "module";
import Params from './params.js';
import { Industri, Policy } from "./sector.js";

const require = createRequire(import.meta.url);
const Finance = require("tvm-financejs");
const prompt = require("prompt-sync")({ sigint: true });

class Model {
  constructor() {
    this.financeCalcs = new Finance(); // not used atm
    this.params = new Params();
    this.sectors = [];
    this.addSectors();
    this.currentTurn = 0;
    this.nrOfTurns = 4;

    this.stepInTurn = 0;
    this.totalStepsInTurn = this.sectors.length; // + 1 for end of turn overview state 

  }

  addSectors() {
    this.sectors.push(new Industri(0, this.params));
    this.sectors.push(new Policy(1, this.params));
  }

  next() {
    if (this.currentTurn === this.nrOfTurns) {
      return
    }
    this.stepInTurn += 1;
    if (this.stepInTurn > this.totalStepsInTurn) {
      this.stepInTurn = 0;
      this.currentTurn += 1;
    }
  }

  getStepSector() {
    if (this.stepInTurn === this.totalStepsInTurn) {
      return "In end summary"
    }
    return this.sectors[this.stepInTurn].name;

  }


}

export default new Model();


function test() {
  const m = new Model();
  while (true) {
    console.log(`Turn: ${m.currentTurn}`);
    console.log(`Current focus: ${m.getStepSector()}`);
    prompt("Press enter to continue...");
    m.next();
  }

}

test();