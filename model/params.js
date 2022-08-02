/* eslint-disable camelcase */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { irr } = require('node-irr')
const prompt = require("prompt-sync")({ sigint: true });

const annuity = (C, i, n) => C * (i / (1 - (1 + i) ** (-n)));
const WACC = 0.1;
class Params {
  constructor() {
    this.industry_energy_consumtion = 100;
    this.industry_electricity_ratio = 0; // between 0-1
    this.industry_bio_ratio = 0; // between 0-1
    this.industry_green_premium = 100 * (this.industry_electricity_ratio + this.industry_bio_ratio);
    this.industry_electricity_CAPEX = 400;
    this.industry_bio_CAPEX = 400;
    this.policy_CAPEX_reduction = 0;
    this.industry_accumulated_annuity = 0;
    this.industry_income = 1000;
    this.industry_manufacturing_cost = 500;

    this.electricity_demand = 100;
    this.bio_demand = 100;
    this.policy_ev_premium_value = 0;
    this.price_carbon_energy = 3;
    this.bio_supply = 100;
    this.transportation_emissions = 1;

    this.electricity_supply = 100;

    this.tax_burden = 0.5;
    this.voters_policy_rating = 0.6;

    this.number_of_blitz_investments_by_stam = 0;

    // variables to be recalculated every turn
    this.industry_carbon_ratio = null;
    this.industry_current_energy_costs = null;
    this.industry_alternative_costs_bio = null;
    this.industry_alternative_costs_electricity = null;
    this.industry_cost_savings_bio = null;
    this.industry_costs_savings_electricity = null;
    this.industry_IRR_bio = null;
    this.industry_IRR_electricity = null;
    this.industry_EBIT_marginal = null;
    this.industry_carbon_emissions = null;

    this.price_electricity = null;
    this.price_bio = null;
    this.national_emissions = null;

    // For first turn
    this.turnCalculations();

  }

  turnCalculations() {
    this.bio_demand += this.policy_ev_premium_value;
    this.industry_carbon_ratio = 1 - this.industry_electricity_ratio - this.industry_bio_ratio;
    this.industry_green_premium = 100 * (this.industry_electricity_ratio + this.industry_bio_ratio);

    this.price_electricity = 1 + 1 * (this.electricity_demand - this.electricity_supply) / this.electricity_demand;
    this.price_bio = 1 + 1 * (this.bio_demand - this.bio_supply) / this.bio_demand;;

    this.industry_current_energy_costs = this.industry_energy_consumtion * ((this.industry_electricity_ratio * this.price_electricity) +
      (this.industry_bio_ratio * this.price_bio) + (this.industry_carbon_ratio * this.price_carbon_energy)) - this.industry_green_premium;


    this.industry_alternative_costs_bio = this.calc_alternative_costs_bio(0, 0.2);

    this.industry_alternative_costs_electricity = this.calc_alternative_costs_bio(0.2, 0);

    this.industry_cost_savings_bio = this.industry_current_energy_costs - this.industry_alternative_costs_bio;
    this.industry_costs_savings_electricity = this.industry_current_energy_costs - this.industry_alternative_costs_electricity;


    const irr_bio_list = [-this.industry_bio_CAPEX + this.policy_CAPEX_reduction];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list.push(this.industry_cost_savings_bio);
    }
    this.industry_IRR_bio = irr(irr_bio_list);

    const irr_electricity_list = [-this.industry_electricity_CAPEX + this.policy_CAPEX_reduction];
    for (let i = 0; i < 19; i += 1) {
      irr_electricity_list.push(this.industry_costs_savings_electricity);
    }
    // console.log(irr_electricity_list);
    // console.log(irr_bio_list);
    this.industry_IRR_electricity = irr(irr_electricity_list);


    const numerator = (this.industry_income - this.industry_manufacturing_cost - this.industry_current_energy_costs - this.industry_accumulated_annuity)
    const denomenator = this.industry_income;
    this.industry_EBIT_marginal = numerator / denomenator;

    this.industry_carbon_emissions = this.industry_carbon_ratio * (this.industry_energy_consumtion / 100);

    this.national_emissions = (this.industry_carbon_emissions + this.transportation_emissions) / 2;


  }

  calc_alternative_costs_bio(el, bio) {
    const new_industry_electricity_ratio = this.industry_electricity_ratio + el;
    const new_industry_bio_ratio = this.industry_bio_ratio + bio; // Now hard coded 20 % but in future function of how much is left calculation
    const new_industry_carbon_ratio = 1 - new_industry_electricity_ratio - new_industry_bio_ratio;
    const new_inudstry_green_premium = 100 * (new_industry_electricity_ratio + new_industry_bio_ratio);

    const cost = this.industry_energy_consumtion * ((new_industry_electricity_ratio * this.price_electricity) +
      (new_industry_bio_ratio * this.price_bio) + (new_industry_carbon_ratio * this.price_carbon_energy)) - new_inudstry_green_premium;

    return cost;
  }

  industry_electrify() {
    this.industry_electricity_ratio += 0.2;
    this.industry_accumulated_annuity += annuity(this.industry_electricity_CAPEX - this.policy_CAPEX_reduction, WACC, 20);
    this.electricity_demand += 20;
  }

  industry_biofy() {
    this.industry_bio_ratio += 0.2;
    this.industry_accumulated_annuity += annuity(this.industry_bio_CAPEX - this.policy_CAPEX_reduction, WACC, 20);
    this.bio_demand += 20;
  }

  // Todo addera oallkoerad mängd till nästa runda
  industry_RnD() {
    this.industry_bio_CAPEX *= 0.85;
    this.industry_electricity_CAPEX *= 0.85;
  }

  industry_increase_energy_efficiency() {
    this.industry_energy_consumtion *= 0.9;
  }

  policy_change_carbon_price(level) {
    if (level === 1) {
      this.price_carbon_energy *= 0.7;
    } else if (level === 2) {
      this.price_carbon_energy *= 0.85;
    } else if (level === 3) {
      this.price_carbon_energy *= 1;
    } else if (level === 4) {
      this.price_carbon_energy *= 1.15;
    } else if (level === 5) {
      this.price_carbon_energy *= 1.3;
    }
  }

  policy_subsidies(level) {
    if (level === 1) {
      this.bio_demand *= 1;
    } else if (level === 2) {
      this.bio_demand *= 0.9;
    } else if (level === 3) {
      this.bio_demand *= 0.8;
    } 
  }

  policy_ev_premium(level) {
    if (level === 1) {
      this.policy_ev_premium_value = 0;
      this.transportation_emissions *= 1;
    } else if (level === 2) {
      this.policy_ev_premium_value = -5;
      this.transportation_emissions *= 0.8;
    } else if (level === 3) {
      this.policy_ev_premium_value = -10;
      this.transportation_emissions *= 0.7;
    } 
  }
  
  svk_investing(level) {
    if(level === 1) {
      this.electricity_supply += 20; // double check so their is oppertunity for supply to be less than demand
    }
    else if (level === 2) {
      this.electricity_supply += 33;
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
      p.policy_change_carbon_price(3);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(1);
      p.industry_electrify();
    } else if (turn === 2) {
      p.policy_change_carbon_price(5);
      p.policy_ev_premium(3);
      p.policy_subsidies(3);
      p.svk_investing(1);
      p.industry_electrify();
    } else if (turn === 3) {
      p.policy_change_carbon_price(3);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(2);
      p.industry_electrify();
    } else if (turn === 4) {
      p.policy_change_carbon_price(3);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(2);
      p.industry_electrify();
    } else if (turn === 5) {
      p.policy_change_carbon_price(3);
      p.policy_ev_premium(2);
      p.policy_subsidies(2);
      p.svk_investing(2);
      p.industry_electrify();
    }
    
    p.turnCalculations();
    console.log(`Turn: ${turn}`);
    console.log(p);
    prompt("Press enter to continue...");
    turn += 1;
  }
}

// test();