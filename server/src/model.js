
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const Finance = require("tvm-financejs");
const fs = require('fs');

class Model {
  constructor() {
    this.financeCalcs = new Finance(); // not used atm
    this.io = undefined;

    // Data innehåller alla datapunkter vi kommer behöva i spelet
    this.data = undefined;

    // Åren vi ska gå igenom
    this.years = [2022, 2025, 2030, 2035, 2040, 2045]
    // Vilket steg spelet är på (0 - 5)
    this.turn = 0;
    this.maxTurn = this.years.length - 1;
    this.industryChoice = undefined;
    this.policyChoice = undefined;
    this.code = "";
    this.hasChosen = false;
    this.underliningData = undefined;
    this.allData = [{}, {}, {}, {}, {}, {}];
  }



  /**
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @param {String} pathToBeslutJson - The socket.io server instance.
   * @returns {void}
   */
  init(io, pathToBeslutJson) {
    this.io = io;
    this.readTurnData(pathToBeslutJson);
    this.readUnderliningData();
  }

  readUnderliningData() {
    for (let i = 0; i < 6; i += 1) {
      const tmpJson = JSON.parse(fs.readFileSync(`../model/jsonFiles/turn${i}.json`, 'utf8'));
      console.log(i)
      tmpJson.forEach((row) => {
        this.allData[i][row.key.value] = row;
      })
    }
    if(this.turn === 0) {
    this.underliningData = this.allData[0]["-1"];
    } else {
      this.underliningData = this.allData[this.turn][this.code];
    }
    console.log(this.underliningData)
    // this.underliningData = JSON.parse(fs.readFileSync(`../model/jsonFiles/turn${this.turn}.json`, 'utf8'));
    // console.log(this.underliningData)
    // if(this.turn != 0) {

    // }
  }

  readTurnData(pathToBeslutJson) {
    this.data = JSON.parse(fs.readFileSync(pathToBeslutJson, 'utf8'));
  }

  getTurn() {
    return [this.turn, this.years[this.turn]];
  }


  addCountToSector(sectorName) {
    this.sectors.forEach((sector, index) => {
      if (sector.name === sectorName) {
        this.sectors[index].count += 1;
      }
    })
  }

  getSectorCount(sectorName) {
    this.sectors.forEach((sector, index) => {
      if (sector.name === sectorName) {
        return this.sectors[index].count;
      }
      return null
    })
  }

  tmpSelect(data) {
    if (this.hasChosen) {
      return
    }
    if (data.sector === "Industry") {
      this.industryChoice = data.decision;
    } else if (data.sector === "Policy") {
      this.policyChoice = data.decision;
    }

    if (this.industryChoice && this.policyChoice) {
      this.code += this.industryChoice + this.policyChoice;
      this.hasChosen = true;
    }
    console.log("partner")
    console.log(data)
    console.log(this.hasChosen)
    console.log(this.industryChoice)
    console.log(this.policyChoice)
    console.log(this.code)
  }

  getSectors() {
    return this.sectors
  }

  nextTurn() {
    if (this.turn + 1 > this.maxTurn) {
      console.log("already on final turn")
      return;
    }
    this.turn += 1;
    this.hasChosen = false;
    this.industryChoice = undefined;
    this.policyChoice = undefined;
    this.readUnderliningData();
  }

  getGameDataForCurrentTurn() {
    return {gameData: this.data[this.turn] , metaData: this.underliningData}
  }

  getGameData() {
    return { turn: this.turn, year: this.years[this.turn] }
  }


}

export default new Model();
