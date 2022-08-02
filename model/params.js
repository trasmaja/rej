/* eslint-disable camelcase */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { irr } = require('node-irr')
const prompt = require("prompt-sync")({ sigint: true });

const annuity = (C, i, n) => C * (i / (1 - (1 + i) ** (-n)));
const WACC = 0.1;
class Params {
  constructor() {
    this.turns_to_go = 6;

    // Industry variables 
    this.ind_turn_ratio = null; // tells how much to replace current turn

    this.ind_energy_consumtion = 100;
    this.ind_ratio_el = 0; // between 0-1
    this.ind_ratio_bio = 0; // between 0-1
    this.ind_ratio_carbon = null; // "null" indicates it is a dependent variable
    this.ind_CAPEX_base_el = 3000; // cost of reinvesting 100 % of capital
    this.ind_CAPEX_base_bio = 3000; 

    this.ind_CAPEX_turn_el = 3000; // cost of investment a given turn
    this.ind_CAPEX_turn_bio = 3000;
    this.ind_annuity = 0; // accumulated annuity
    this.ind_income = 1000; 
    this.ind_cost_other = 500; // costs independent of chosen energy
    this.ind_cost_energy = null; // current cost of energy
    this.ind_premium = null; // green premium paid to companies
    
    this.ind_IRR_bio = null; // these are the ones shown to player
    this.ind_IRR_el = null;
    this.ind_EBIT_marginal = null;
    this.ind_emissions = null;

    // Policy and market variables
    this.pol_ev_premium = 0;
    this.pol_price_carbon = 3;
    this.pol_CAPEX_reduction = 0; // # of times policy has used subsidies, maybe wont use this
    this.transportation_emissions = 1; // emissions from transport sector

    this.demand_el = 100;
    this.demand_bio = 100;
    this.supply_bio = 100;
   
    this.price_el = null;
    this.price_bio = null;
    this.total_emissions = null;

    // Electric grid (SVK) variables
    this.supply_el = 100;


    // Voter variables
    this.voters_tax_burden = 0.5; 
    this.svk_tax_penalty = null; // if SVK has over constructed 
    this.voters_economy = null; 
    this.voters_rating = 0.6;
    this.voters_displacement = 0; // if displaced by ruthless investment by SVK
    

    // For first turn, determines all dependent values
    this.basicTurnCalculations();
    this.calcIrr();

  }

  basicTurnCalculations() {
    /*Recalibrates the values of all dependent variables*/
    this.turns_to_go -= 1;

    if (this.supply_el - this.demand_el > 30) {
      this.svk_tax_penalty = 0.05;
    } else {
        this.svk_tax_penalty = 0;
    }
    this.voters_economy = this.svk_tax_penalty + this.voters_tax_burden; 


    this.demand_bio += this.pol_ev_premium;
    this.price_el = 1 + 1 * (this.demand_el - this.supply_el) / this.demand_el;
    this.price_bio = Math.max(0.5, 1 + 1 * (this.demand_bio - this.supply_bio) / this.demand_bio);

    this.ind_IRR_bio = []; // reset the previous IRRs 
    this.ind_IRR_el = [];
    this.ind_ratio_carbon = 1 - this.ind_ratio_el - this.ind_ratio_bio;
    this.ind_premium = 100 * (this.ind_ratio_el + this.ind_ratio_bio);
    this.ind_CAPEX_turn_el = this.ind_CAPEX_base_el * this.ind_turn_ratio;
    this.ind_CAPEX_turn_bio = this.ind_CAPEX_base_bio * this.ind_turn_ratio;

    this.ind_turn_ratio = this.ind_ratio_carbon / this.turns_to_go; 
    this.ind_CAPEX_turn_bio = 
    this.ind_CAPEX_turn_el = 

    this.ind_cost_energy = this.ind_energy_consumtion * ((this.ind_ratio_el * this.price_el) +
      (this.ind_ratio_bio * this.price_bio) + (this.ind_ratio_carbon * this.pol_price_carbon)) - this.ind_premium;

    const numerator = (this.ind_income - this.ind_cost_other - this.ind_cost_energy - this.ind_annuity)
    const denomenator = this.ind_income;
    this.ind_EBIT_marginal = numerator / denomenator;

    this.ind_emissions = this.ind_ratio_carbon * (this.ind_energy_consumtion / 100);

    this.total_emissions = (this.ind_emissions + this.transportation_emissions) / 2;
    
    
  }

  calcIrr() {
    /*Calculates the IRRs*/
    const alt_energy_savings_bio = this.calc_alt_energy_cost_savings(0, this.ind_turn_ratio)
    const alt_energy_savings_el = this.calc_alt_energy_cost_savings(this.ind_turn_ratio, 0)
 
    const ind_savings_bio_low = alt_energy_savings_bio.shift();
    const ind_savings_bio_mid = alt_energy_savings_bio.shift();
    const ind_savings_bio_high = alt_energy_savings_bio.shift();
 
    const ind_savings_el_low = alt_energy_savings_el.shift();
    const ind_savings_el_mid = alt_energy_savings_el.shift();
    const ind_savings_el_high = alt_energy_savings_el.shift();

 
    // kanske går att formulera på nåt mer effektivt sätt:
    const irr_bio_list_low = [-this.ind_CAPEX_turn_bio + this.pol_CAPEX_reduction];
     for (let i = 0; i < 19; i += 1) {
       irr_bio_list_low.push(ind_savings_bio_low);
    }
    const irr_bio_list_mid = [-this.ind_CAPEX_turn_bio + this.pol_CAPEX_reduction];
       for (let i = 0; i < 19; i += 1) {
         irr_bio_list_mid.push(ind_savings_bio_mid);
    }
    const irr_bio_list_high = [-this.ind_CAPEX_turn_bio + this.pol_CAPEX_reduction];
       for (let i = 0; i < 19; i += 1) {
         irr_bio_list_high.push(ind_savings_bio_high);
    }
    const irr_el_list_low = [-this.ind_CAPEX_turn_el + this.pol_CAPEX_reduction];
     for (let i = 0; i < 19; i += 1) {
       irr_el_list_low.push(ind_savings_el_low);
    }
    const irr_el_list_mid = [-this.ind_CAPEX_turn_el + this.pol_CAPEX_reduction];
     for (let i = 0; i < 19; i += 1) {
       irr_el_list_mid.push(ind_savings_el_mid);
    }
    const irr_el_list_high = [-this.ind_CAPEX_turn_el + this.pol_CAPEX_reduction];
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



  calc_alt_energy_cost_savings(el, bio) {
    /*Gives an alternative cost structure based on current market values*/
    const alt_ind_ratio_el = this.ind_ratio_el + el;
    const alt_ind_ratio_bio = this.ind_ratio_bio + bio; // Now hard coded 20 % but in future function of how much is left calculation
    const alt_ind_ratio_carbon = 1 - alt_ind_ratio_el - alt_ind_ratio_bio;
    const alt_ind_premium = 100 * (alt_ind_ratio_el + alt_ind_ratio_bio);

    // alternative costs three scenarios
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
    this.ind_ratio_el += this.ind_turn_ratio;
    this.ind_annuity += annuity(this.ind_CAPEX_turn_el - this.pol_CAPEX_reduction, WACC, 20);
    this.demand_el += 20;
  }

  industry_biofy() {
    this.ind_ratio_bio += this.ind_turn_ratio;
    this.ind_annuity += annuity(this.ind_CAPEX_turn_bio - this.pol_CAPEX_reduction, WACC, 20);
    this.demand_bio += 20;
  }

  // Todo addera oallkoerad mängd till nästa runda
  industry_RnD() {
    this.ind_CAPEX_base_bio *= 0.85;
    this.ind_CAPEX_base_el *= 0.85;
  }

  industry_increase_energy_efficiency() {
    this.ind_energy_consumtion *= 0.9;
  }

  policy_change_carbon_price(level) {
    if (level === 1) {
      this.pol_price_carbon *= 0.7;
      this.voters_tax_burden *= 0.7;
    } else if (level === 2) {
      this.pol_price_carbon *= 0.85;
      this.voters_tax_burden *= 0,85
    } else if (level === 3) {
      this.pol_price_carbon *= 1;
      this.voters_tax_burden *= 1;
    } else if (level === 4) {
      this.pol_price_carbon *= 1.15;
      this.voters_tax_burden *= 1.15;
    } else if (level === 5) {
      this.pol_price_carbon *= 1.3;
      this.voters_tax_burden *= 1,3;
    }
  }

  policy_subsidies(level) {
    if (level === 1) {
      this.demand_bio *= 1;
    } else if (level === 2) {
      this.demand_bio *= 0.9;
    } else if (level === 3) {
      this.demand_bio *= 0.8;
    } 
  }

  policy_ev_premium(level) {
    if (level === 1) {
      this.pol_ev_premium = 0;
      this.transportation_emissions *= 1;
    } else if (level === 2) {
      this.pol_ev_premium = -5;
      this.transportation_emissions *= 0.8;
    } else if (level === 3) {
      this.pol_ev_premium = -10;
      this.transportation_emissions *= 0.7;
    } 
  }
  
  svk_investing(level) {
    if(level === 1) {
      this.supply_el += 20; // double check so their is oppertunity for supply to be less than demand
    }
    else if (level === 2) {
      this.supply_el += 33;
      this.voters_displacement += 1
    }
  }

  voters_rate_policy(new_rating) {
    this.voters_rating = new_rating;
  }


}

export default Params;

function test() {
  const p = new Params();

  let turn = 1;
  console.log(p);
  while (true) {
    if(turn === 1) {
      p.policy_change_carbon_price(5);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(1);
      p.industry_RnD();
    } else if (turn === 2) {
      p.policy_change_carbon_price(5);
      p.policy_ev_premium(3);
      p.policy_subsidies(3);
      p.svk_investing(1);
      p.industry_RnD();
    } else if (turn === 3) {
      p.policy_change_carbon_price(5);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(2);
      p.industry_electrify();
    } else if (turn === 4) {
      p.policy_change_carbon_price(5);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(2);
      p.industry_electrify();
    } else if (turn === 5) {
      p.policy_change_carbon_price(5);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(2);
      p.industry_electrify();
    } else{
      break;
    }
    
    p.basicTurnCalculations();
    p.calcIrr();
    console.log(`Turn: ${turn}`);
    console.log(p);
    prompt("Press enter to continue...");
    turn += 1;
    

  }
}

// test();