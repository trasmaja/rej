/* eslint-disable camelcase */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { irr } = require('node-irr')
const prompt = require("prompt-sync")({ sigint: true });

const annuity = (C, i, n) => C * (i / (1 - (1 + i) ** (-n)));
const WACC = 0.1;
class Params {
  constructor() {
    this.turn = 0;
    this.turns_to_go = 6; // playable turns + 1

    // Industry variables 
    this.ind_turn_ratio = null; // tells how much dirty industry to replace the current turn
    this.ind_lateness_penalty_factor = null;

    /* ^penalty if forced to replace too much capital too quickly, late movers disadvantage - 
    replacing 100 % with one turn to go comes at a cost. Kicks in when turn ratio > 25 % */
    this.ind_energy_consumtion = 100;
    this.ind_ratio_el = 0; // between 0-1
    this.ind_ratio_bio = 0; // between 0-1
    this.ind_ratio_energieff = 0; // some emissions can be cut by using energy more effective
    this.ind_ratio_carbon = 1; // starts with 100 %
    this.ind_CAPEX_base_el = 3000 / 0.9; // cost of reinvesting 100 % of capital
    this.ind_CAPEX_base_bio = 2000 / 0.9;
    this.ind_CAPEX_turn_el = null; // cost of investment a given turn
    this.ind_CAPEX_turn_bio = null;
    this.ind_annuity = 0; // accumulated annuity from investments
    this.ind_income = 1000; // the 
    this.ind_cost_other = 700; // costs independent of chosen energy
    this.ind_cost_energy = null; // current cost of energy
    this.ind_premium_factor = 75;
    this.ind_RnD = 0; // # of times RnD has been used
    this.ind_premium = null; // green premium paid to companies

    this.ind_IRR_bio = null; // the following parameters are shown to player
    this.ind_IRR_el = null;
    this.ind_EBIT_margin = null;
    this.ind_emissions = null;

    // Policy and bio variables
    this.pol_price_carbon = 2;
    /* Twice the price of el: With a CO2-price of 550 kr/ton and emissions of 0.85 kr/kWh, that gives rise to a cost of 
    0.4675 kr/kWh for the carbon emissions alone. It's difficult to find what the industry pays for electricity but we've assumed it is 
    roughly within the same ball park. Here the CO2 cost and the cost of a underlying energysorce is combined into one variable. 
    That's why we chose two times the price as a first approximation of the cost ratios. */
    this.pol_CAPEX_reduction = 0;

    this.demand_bio = 100;
    this.supply_bio = 100;

    this.price_bio = null;
    this.total_emissions = null;

    // Electric company and electric grid variables
    this.supply_el = 100;
    this.svk_cap = 140;
    this.svk_cap_next = [0, 0];
    this.usable_supply_el = null;
    this.demand_el_ind = 100;
    this.demand_el_cars = 0;
    this.total_demand_el = null;
    this.price_el = null;

    this.elco_excess_supply = 0;
    this.elco_income = null;
    this.elco_cost = null;
    this.elco_EBIT_margin = null;

    // Voter variables
    this.voters_rating = 0.6;
    this.transportation_emissions = 1; // emissions from transports

    this.voters_income = null;
    this.voters_costs_other = (11480 - 3050 - 810) * 12; // från Swedbanks uppskattade levnadsårskostnader minus el och bil
    this.voters_carbon_burden = null; // cost of emitting for consumers
    this.voters_tax_rate = 0.35;
    this.svk_tax_penalty = null; // if SVK has over constructed 
    this.voters_tax_burden = null; // tax burden for voters from subsedies
    this.voters_el_consumtion = 15000; // kWh/year
    this.voters_el_burden = null; 
    this.voters_cost_car = null;
    this.voters_dis_income = null; // income minus taxes
    this.voters_dis_income_after_expenses = null; // income minus taxes and other basic expenses

    // For first turn, determines all dependent values

    this.basicTurnCalculations();
    this.calcIrr();
    this.calcVoter();

  }


  // Turn calculations
  basicTurnCalculations() {
    /* Recalibrates the values of some dependent variables */
    this.turn += 1;
    this.turns_to_go -= 1;

    // Market variables
    if (4 * this.price_el > this.price_bio) {
      this.demand_bio += 10; // adds some market demand from things outside the model such as heavy transports
    }
    this.total_demand_el = this.demand_el_cars + this.demand_el_ind;
    this.price_bio = Math.max(0.5, 1 + 4 * (this.demand_bio - this.supply_bio) / this.demand_bio);

    
    // electric company variables
    this.svk_cap += this.svk_cap_next.shift()
    this.usable_supply_el = this.supply_el > this.svk_cap ? this.svk_cap : this.supply_el;

    this.price_el = Math.max(0.1, 1 + 0.25 * (this.total_demand_el - this.usable_supply_el) / this.total_demand_el);

    this.elco_excess_supply = 2 * (Math.max(this.supply_el - this.svk_cap, 0));
    this.elco_income = Math.log(1.1 * (this.total_demand_el * this.price_el)); // gjort en ln-transformation bara för att EBIT inte skulle bli så volatil
    this.elco_cost = Math.log(1 * (this.usable_supply_el + this.elco_excess_supply));
    this.elco_EBIT_margin = (this.elco_income - this.elco_cost) / this.elco_income + 0.08;



    // Industry variables
    this.ind_ratio_carbon = 1 - this.ind_ratio_el - this.ind_ratio_bio - this.ind_ratio_energieff;
    this.ind_premium = this.ind_premium_factor * (this.ind_ratio_el + this.ind_ratio_bio);
    this.ind_turn_ratio = this.ind_ratio_carbon / this.turns_to_go;
    this.ind_lateness_penalty_factor = 2 * Math.max(this.ind_turn_ratio + 0.75, 1) - 1 // applies a penalty when when turn ratio > 0.25
    this.ind_CAPEX_base_el *= 0.9; 
    this.ind_CAPEX_base_bio *= 0.9; 
    this.ind_CAPEX_turn_el = this.ind_CAPEX_base_el * this.ind_turn_ratio * this.ind_lateness_penalty_factor;
    this.ind_CAPEX_turn_bio = this.ind_CAPEX_base_bio * this.ind_turn_ratio * this.ind_lateness_penalty_factor;
    this.ind_cost_energy = this.ind_energy_consumtion * ((this.ind_ratio_el * this.price_el) +
      (this.ind_ratio_bio * this.price_bio) + (this.ind_ratio_carbon * this.pol_price_carbon)) - this.ind_premium;
    this.ind_EBIT_margin = (this.ind_income - this.ind_cost_other - this.ind_cost_energy - this.ind_annuity) / this.ind_income;
    this.ind_emissions = this.ind_ratio_carbon * (this.ind_energy_consumtion / 100);

    // Voters variables
    this.voters_income = 325000 * (0.95 + this.ind_EBIT_margin); // yearly income. 0.95 because we imagine industry fires people at 5 % EBIT-margin
    this.svk_tax_penalty = this.total_demand_el + 40 < this.svk_cap ? 0.05 : 0; // if 
    this.voters_tax_burden = this.voters_income * (this.voters_tax_rate + this.svk_tax_penalty); // tax burden for voters from subsedies
    this.voters_carbon_burden = null; // cost of emitting for consumers
    this.voters_el_burden = this.price_el * this.voters_el_consumtion;
    this.voters_cost_car = this.transportation_emissions * this.pol_price_carbon; // todo a lot better
    
    this.voters_dis_income = (this.voters_income - this.voters_tax_burden);
    this.voters_dis_income_after_expenses = (this.voters_income - this.voters_costs_other 
      - this.voters_tax_burden - this.voters_el_burden - this.voters_cost_car);
    console.log(this.voters_dis_income - 137760)


    // Policy variables
    this.total_emissions = (this.ind_emissions + this.transportation_emissions) / 2;

  }

  calcIrr() {
    /* Calculates the IRRs */
    this.ind_IRR_bio = []; // overwrites previous IRRs
    this.ind_IRR_el = [];

    const alt_energy_savings_bio = this.calc_alt_energy_cost_savings(0, this.ind_turn_ratio)
    const alt_energy_savings_el = this.calc_alt_energy_cost_savings(this.ind_turn_ratio, 0)

    const ind_savings_bio_low = alt_energy_savings_bio.shift();
    const ind_savings_bio_mid = alt_energy_savings_bio.shift();
    const ind_savings_bio_high = alt_energy_savings_bio.shift();

    const ind_savings_el_low = alt_energy_savings_el.shift();
    const ind_savings_el_mid = alt_energy_savings_el.shift();
    const ind_savings_el_high = alt_energy_savings_el.shift();

    const irr_bio_list_low = [-this.ind_CAPEX_turn_bio + this.pol_CAPEX_reduction * this.ind_CAPEX_turn_bio];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list_low.push(ind_savings_bio_low);
    }
    const irr_bio_list_mid = [-this.ind_CAPEX_turn_bio + this.pol_CAPEX_reduction * this.ind_CAPEX_turn_bio];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list_mid.push(ind_savings_bio_mid);
    }
    const irr_bio_list_high = [-this.ind_CAPEX_turn_bio + this.pol_CAPEX_reduction * this.ind_CAPEX_turn_bio];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list_high.push(ind_savings_bio_high);
    }
    const irr_el_list_low = [-this.ind_CAPEX_turn_el + this.pol_CAPEX_reduction * this.ind_CAPEX_turn_el];
    for (let i = 0; i < 19; i += 1) {
      irr_el_list_low.push(ind_savings_el_low);
    }
    const irr_el_list_mid = [-this.ind_CAPEX_turn_el + this.pol_CAPEX_reduction * this.ind_CAPEX_turn_el];
    for (let i = 0; i < 19; i += 1) {
      irr_el_list_mid.push(ind_savings_el_mid);
    }
    const irr_el_list_high = [-this.ind_CAPEX_turn_el + this.pol_CAPEX_reduction * this.ind_CAPEX_turn_el];
    for (let i = 0; i < 19; i += 1) {
      irr_el_list_high.push(ind_savings_el_high);
    }

    this.ind_IRR_bio.push(irr(irr_bio_list_low));
    this.ind_IRR_bio.push(irr(irr_bio_list_mid));
    this.ind_IRR_bio.push(irr(irr_bio_list_high));
    this.ind_IRR_el.push(irr(irr_el_list_low));
    this.ind_IRR_el.push(irr(irr_el_list_mid));
    this.ind_IRR_el.push(irr(irr_el_list_high));
  }

  calcVoter() {
    /* An attempt to give a value of voters economic satisfaction */
    
  }




  // Industry functions
  calc_alt_energy_cost_savings(el, bio) {
    /* Gives an alternative cost structure based on current market values */
    const alt_ind_ratio_el = this.ind_ratio_el + el;
    const alt_ind_ratio_bio = this.ind_ratio_bio + bio;
    const alt_ind_ratio_carbon = 1 - alt_ind_ratio_el - alt_ind_ratio_bio;
    const alt_ind_premium = this.ind_premium_factor * (alt_ind_ratio_el + alt_ind_ratio_bio);

    // alternative costs three scenarios depending on CO2-cost
    const alt_cost_low = this.ind_energy_consumtion * ((alt_ind_ratio_el * this.price_el) +
      (alt_ind_ratio_bio * this.price_bio) + (alt_ind_ratio_carbon * this.pol_price_carbon * 0.7)) - alt_ind_premium;

    const alt_cost_mid = this.ind_energy_consumtion * ((alt_ind_ratio_el * this.price_el) +
      (alt_ind_ratio_bio * this.price_bio) + (alt_ind_ratio_carbon * this.pol_price_carbon)) - alt_ind_premium;

    const alt_cost_high = this.ind_energy_consumtion * ((alt_ind_ratio_el * this.price_el) +
      (alt_ind_ratio_bio * this.price_bio) + (alt_ind_ratio_carbon * this.pol_price_carbon * 1.3)) - alt_ind_premium;

    // current composition three CO2 scenarios
    const cost_low = this.ind_energy_consumtion * ((this.ind_ratio_el * this.price_el) +
      (this.ind_ratio_bio * this.price_bio) + (this.ind_ratio_carbon * this.pol_price_carbon * 0.7)) - this.ind_premium;

    const cost_high = this.ind_energy_consumtion * ((this.ind_ratio_el * this.price_el) +
      (this.ind_ratio_bio * this.price_bio) + (this.ind_ratio_carbon * this.pol_price_carbon * 1.3)) - this.ind_premium;


    const savings_low = cost_low - alt_cost_low
    const savings_mid = this.ind_cost_energy - alt_cost_mid
    const savings_high = cost_high - alt_cost_high


    return [savings_low, savings_mid, savings_high];
  }

  industry_electrify() {
    /** Electrifies a proportion of previously dirty industry */
    this.ind_ratio_el += this.ind_turn_ratio;
    this.ind_annuity += annuity(this.ind_CAPEX_turn_el - this.pol_CAPEX_reduction * this.ind_CAPEX_turn_el, WACC, 20);
    this.demand_el_ind += 2 * this.ind_turn_ratio * this.ind_energy_consumtion;
  }

  industry_biofy() {
    /** Exchanges dirty industrial processes with ones that rely on bio fuel */
    this.ind_ratio_bio += this.ind_turn_ratio;
    this.ind_annuity += annuity(this.ind_CAPEX_turn_bio - this.pol_CAPEX_reduction * this.ind_CAPEX_turn_bio, WACC, 20);
    this.demand_bio += this.ind_turn_ratio * this.ind_energy_consumtion;
  }

  industry_RnD() {
    /* Reduces future CAPEX requirements */
    this.ind_CAPEX_base_bio *= (1 - 1 / (7 + 7 * this.ind_RnD ** 2)) // just some function that makes the marginal utility of this function decrease
    this.ind_CAPEX_base_el *= (1 - 1 / (7 + 7 * this.ind_RnD ** 2))
    this.ind_RnD += 1;
  }

  industry_increase_energy_efficiency() {
    /* Makes processes more effifiant and reduces industrial energy use */
    this.ind_energy_consumtion *= 0.9;
    this.ind_ratio_energieff += 0.05;
  }



  // Policy functions
  policy_change_carbon_price(level) {
    /* Constructs a tree of possible carbon prices which the player can ascend */
    if (level === 1) {
      this.pol_price_carbon *= 1.3;
    } else if (level === 2) {
      this.pol_price_carbon *= 1.15;
    } else if (level === 3) {
      this.pol_price_carbon *= 1;
    } else if (level === 4) {
      this.pol_price_carbon *= 0.85;
    } else if (level === 5) {
      this.pol_price_carbon *= 0.7;
    }
  }

  // Nya kombinerade sub och ev premie
  policy_green_package(level) {
    if (level === 1) {
      this.pol_CAPEX_reduction = 0.2;
      this.voters_tax_burden = 0.5;
      // todo nåt med elbilar
    } else if (level === 2) {
      this.pol_CAPEX_reduction = 0.1;
      this.voters_tax_burden = 0.25;
  
    } else if (level === 3) {
      this.pol_CAPEX_reduction = 0;
      this.voters_tax_burden = 0;

    }
  }

  // politics change svk nätet
  policy_svk_supply(level) {
    if (level === 1) {
      this.svk_cap_next.push(40);
    } else if (level === 2) {
      this.svk_cap_next.push(20);
    } else if (level === 3) {
      this.svk_cap_next.push(0);
    }
  }


  // SVK functions 
  elco_investing(level) {
    if (level === 1) {
      this.supply_el += 40; // double check so their is oppertunity for supply to be less than demand
    }
    else if (level === 2) {
      this.supply_el += 0; 
    } else if (level === 3) {
      this.supply_el -= 20; 
    }
  }


  // Voters functions
  voters_rate_policy(new_rating) {
    this.voters_rating = new_rating;
  }

  voters_electric_car(procentage) {
    /** Kanske kan modifieras så att den inte kan bli mindre än det största värde den tagit */
    this.transportation_emissions = 1 - procentage;
    this.demand_el_cars = 30 * (1 - this.transportation_emissions); // 30 TWh since thats roughly what it would take to electrify all cars
  }

}

export default Params;


function test() {
  const p = new Params();
  console.log(p);
  while (p.turns_to_go > 0) {
    const carbon = parseInt(prompt("Välj CO2-pris 1-5 där 3 är oförändrat och 1 höjer det mycket: "), 10)
    p.policy_change_carbon_price(carbon)
    const sub = parseInt(prompt("Välj nivå 1-3 (från ambitiös till inget) för en grön giv till företag och privatpersoner: "), 10)
    p.policy_green_package(sub)
    const tak = parseInt(prompt("Välj investeringsnivå för stamnät 1-3: "), 10)
    p.policy_svk_supply(tak)
    const el = parseInt(prompt("Välj investeringsnivå för elbolag, höj (1), behåll (2), eller minska (3): "), 10)
    p.elco_investing(el)
    const ind = parseInt(prompt("Industrin - 1: Elektrifiering, 2: Biofiering, 3: RnD, 4: Energieffektivisering: "), 10)
    if (ind === 1) {
      p.industry_electrify()
    } else if (ind === 2) {
      p.industry_biofy()
    } else if (ind === 3) {
      p.industry_RnD()
    } else if (ind === 4) {
      p.industry_increase_energy_efficiency()
    }
    // const vote = parseFloat(prompt("Voters vote [0, 1]: "))
    // p.voters_rate_policy(vote)
    const car = parseFloat(prompt("Hur många procent köper elbil? [0, 1]? "))
    p.voters_electric_car(car)

    p.basicTurnCalculations();
    p.calcIrr();
    p.calcVoter();
    console.log(p);

  }
}

test();

