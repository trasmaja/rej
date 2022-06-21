import { createRequire } from "module";

const require = createRequire(import.meta.url);
const readXlsxFile = require('read-excel-file/node')
const Finance = require("tvm-financejs");

const path = "./src/excelData.xlsx";
const schema = {
  'WACC': {
    prop: 'WACC',
    type: Number,
    required: true
  },
  'CO2-pris': {
    prop: 'cO2pris',
    type: Number,
    required: true
  },
  'CO2-utsläpp per MWh': {
    prop: 'cO2utPerMWh',
    type: Number,
    required: true
  },
  'CO2-skatt per MWh': {
    prop: 'cO2skattPerMWh',
    type: Number,
    required: true
  },
  'Pris ren energi': {
    prop: 'prisRenEnergi',
    type: Number,
    required: true
  },
  'Pris CO2-energi': {
    prop: 'prisCO2Energi',
    type: Number,
    required: true
  },
  'de facto pris CO2-energi': {
    prop: 'deFactoPrisCO2Energi',
    type: Number,
    required: true
  },
  'Differens ren och smutsig energi': {
    prop: 'diffRenOSmutsEnergi',
    type: Number,
    required: true
  },
  'Energikonsumtion': {
    prop: 'energikonsumtion',
    type: Number,
    required: true
  },
  'Andel CO2-energi': {
    prop: 'andelCO2Energi',
    type: Number,
    required: true
  },
  'Start EBIT': {
    prop: 'EBIT',
    type: Number,
    required: true
  },
  'CO2 utsläpp industri': {
    prop: 'totalCO2Industry',
    type: Number,
    required: true
  },
}
class Model {
  constructor() {
    this.financeCalcs = new Finance();
    this.io = undefined;

    // Data innehåller alla datapunkter vi kommer behöva i spelet
    this.data = undefined;

    // Åren vi ska gå igenom
    this.years = [2022, 2025, 2030, 2035, 2040, 2045]
    // Vilket steg spelet är på (0 - 5)
    this.turn = 0;
    this.maxTurn = this.years.length - 1;


    this.industryChoices = {
      "Investera i ny anläggning": {
        "Desc": "Nya anläggningen kommer vara grön ......",
        "IRR": undefined,
        "choiceNumber": 1,
      },
      "Investera i energieffektivitet": {
        "Desc": "Försök minska totala mängden enerig ......",
        "choiceNumber": 2,

      },
      "Investera i R&D": {
        "Desc": "Minska kapitalkostnad ......",
        "choiceNumber": 3,

      }
    }

    // Läs in excel data det första som sker
    this.readExcelFile().then(() => {
      this.initTurn();
    });
  }


  initTurn() {
    this.initIndustrySector();
    console.log(this.industryChoices)
  }

  initIndustrySector() {
    const IRR = this.calcIRRForNewFactory();
    this.industryChoices["Investera i ny anläggning"].IRR = IRR;
  }


  /**
   * Oklart om denna behövs men har kvar för tillfället
   * Initialize the model after its creation.
   * @param {SocketIO.Server} io - The socket.io server instance.
   * @returns {void}
   */
  initIO(io) {
    this.io = io;
  }

  /**
   * Change a param by a factor
   * @param {String} param - Name of the param to change
   * @param {Number} factor - the factor amount of the intended change
   * @returns {void}
   */
  changeParamByFactor(param, factor) {
    this.data[param] *= factor;
  }

  /**
   * set a param to a number
   * @param {String} param - Name of the param to change
   * @param {Number} number - the new value of the param
   * @returns {void}
   */
  setParamToNumber(param, number) {
    this.data[param] = number;
  }

  /**
    * Reads excel file with data 
    * @param {String} path - global constant where the excel file is stored
    * @param {Object} schema - global constant with schema of excel file to properly translate it into json object
    * @returns {void}
    */
  async readExcelFile() {
    const rows = await readXlsxFile(path, { schema });
    console.log("howdy")
    console.log(rows)
    if (rows.errors.length > 0) {
      console.log("ERROR reading data from excel file when initing")
      console.log(rows.errors)
    }
    // eslint-disable-next-line prefer-destructuring
    this.data = rows.rows[0];

  }

  changeWACC(changeFactor) {
    this.data.WACC *= changeFactor;
  }

  changeEnergyConsumtion(changeFactor) {
    this.data.energikonsumtion *= changeFactor;
  }

  changeCO2Ratio(changeFactor) {
    this.data.andelCO2Energi *= changeFactor;
  }

  calcIRRForNewFactory() {
    const { energikonsumtion, andelCO2Energi, deFactoPrisCO2Energi, prisRenEnergi } = this.data;
    const changeFactor = 0.5;

    const currentStateCosts = energikonsumtion * (andelCO2Energi * deFactoPrisCO2Energi + (1 - andelCO2Energi) * prisRenEnergi);
    const AfterInvestmentCosts = energikonsumtion * (andelCO2Energi * changeFactor * deFactoPrisCO2Energi + (1 - andelCO2Energi * changeFactor) * prisRenEnergi);
    const savings = currentStateCosts - AfterInvestmentCosts;

    const values = [-500000, savings, savings, savings, savings];
    const IRR = Math.round(this.financeCalcs.IRR(values) * 100) / 100;
    return IRR;
    // console.log(Math.round(this.financeCalcs.IRR(values) * 100) / 100 * 100);
  }

  nextTurn() {
    if (this.turn + 1 > this.maxTurn) {
      console.log("already on final turn")
      return;
    }
    // Alla beräknignar mellan turnsen här
    // this.calcIRRForNewFactory();
    // this.changeEnergyConsumtion(0.9);

    this.changeParamByFactor("deFactoPrisCO2Energi", 1.2)
    // this.setParamToNumber("WACC", 0.20)

    this.turn += 1;
    this.initTurn();
  }

  getGameData() {
    return { turn: this.turn, year: this.years[this.turn] }
  }


}

export default new Model();
