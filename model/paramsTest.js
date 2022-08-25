/* eslint-disable camelcase */
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { irr } = require('node-irr')
const prompt = require("prompt-sync")({ sigint: true });

const annuity = (C, i, n) => C * (i / (1 - (1 + i) ** (-n))); // annuity function for industry money lending
const WACC = 0.1;
const mycket = 2.5;
const lite = (1 + mycket) / 2;
class Params {
  constructor() {
    this.turn = 0;
    this.turns_to_go = 6; // playable turns + 1

    // Industry variables 
    this.ind_turn_ratio = null; // tells how much dirty industry to replace the current turn
    this.ind_lateness_penalty_factor = null;
    /* ^penalty if forced to replace too much capital too quickly, late movers disadvantage - 
    replacing 100 % with one turn to go comes at a cost. Kicks in when turn ratio > 25 % */
    this.ind_energy_consumtion = null;
    this.ind_CAPEX_base_el = 2000 / 0.95; // cost of reinvesting 100 % of capital
    this.ind_CAPEX_base_bio = 2000 / 0.95;
    this.ind_CAPEX_turn_el = null; // cost of investment a given turn
    this.ind_CAPEX_turn_bio = null;
    this.ind_annuity = 0; // accumulated annuity from investments
    this.ind_income = 1000; 
    this.ind_cost_other = 700; // costs independent of energy structure
    this.ind_cost_el = null;
    this.ind_cost_bio = null;
    this.ind_cost_carbon = null;
    this.ind_sum = null;
    this.ind_cost_energy = null; // current cost of energy
    this.ind_premium = null; // green premium paid to companies
    this.ind_cost_emissions = null;
    this.ind_premium_factor = 0.5;
    this.ind_RnD = 0; // # of times RnD has been used
    
    this.ind_carbon_demand_2019 = 27; // TWh 
    this.ind_demand_carbon_ind = null; // TWh 
    this.ind_emissions_2019 = 15; // miljoner ton CO2-ekvivalenter
    this.ind_co2_reduction_factor = 1; // starts with 100 %
    
    this.ind_ratio_carbon = null;
    this.ind_ratio_el = null;
    this.ind_ratio_bio = null;

    this.ind_IRR_bio = null; // the following parameters are shown to player
    this.ind_IRR_el = null;
    this.ind_EBIT_margin = null;
    
    // Policy and bio variables
    this.price_carbon = 2; // kan vara ganska mycket för högt jämfört med idag men funkar bra för modellen
    this.price_carbon_energy = 20/9; // 20kr per liter (bensin) och 9 kWh per liter ger ett pris per kWh

    this.pol_CAPEX_reduction_factor = 1;
    this.pol_el_car_reduction_factor = 1; 
    
    this.demand_bio_ind = 55; // nästan uteslutande från pappersmassaindustrin om vi förstått det rätt
    this.demand_bio_other = 90;
    this.supply_bio = 140;
    
    this.price_bio = null;
    this.emissions_ind = null;
    this.emissions_transport = null; // emissions from transports
    this.emissions_total = null;
    
    // Electric company and electric grid variables
    this.supply_el_cap = 175;
    this.supply_el_cap_next = [0, 0];
    this.supply_el_potential = 130;
    this.demand_el_ind = 50;

    this.demand_el_cars = 0;
    this.demand_el_society = 90; // will be roughy constant during period so here constant
    
    this.demand_el_total = null;
    this.supply_el_usable = null;
    this.price_el = null;

    this.elco_income = null;
    this.elco_cost = null;
    this.elco_EBIT_margin = null;

    // Voter variables
    this.voters_rating = 0.6;
    this.transportation_emissions_2019 = 10; // miljoner ton CO2-ekvivalenter
    this.transportation_emissions_red = 1; 
    
    this.voters_income = null;
    this.voters_costs_other = (11480 - 3050 - 810); // Swedbanks uppskattade nödvändiga levnadsmånadskostnader minus el och bil
    this.voters_carbon_burden = null; // cost of emitting for consumers
    this.voters_tax_rate = 0.35;
    this.voters_svk_tax_penalty = null; // if SVK has over constructed 
    this.voters_tax_burden = null; // tax burden for voters from subsedies
    this.voters_el_consumtion = 15000 / 12; // kWh/month
    this.voters_cost_el = null; 
    
    this.voters_cost_car_el = null;
    this.voters_cost_car_gas = null;
  
    this.voters_dis_income = null; // income minus taxes
    this.voters_dis_income_after_expenses = null; // income minus taxes and other basic expenses
    this.voters_dis_income_after_expenses_car_el = null;
    this.voters_dis_income_after_expenses_car_gas = null;

    // For first turn, determines all dependent values

    this.basicTurnCalculations();
    this.calcIrr();
    this.calcCarCosts();

  }


  // Turn calculations
  basicTurnCalculations() {
    /* Recalibrates the values of some dependent variables */
    this.turn += 1;
    this.turns_to_go -= 1;

    // Market variables
    if (2 * this.price_el > this.price_bio) {
      this.demand_bio_other += 5; // adds some market demand from things outside the model such as heavy transports
    } else {
      this.demand_bio_other-=5;
    }
    this.price_bio = Math.max(0.5, 1 + (this.demand_bio_ind + this.demand_bio_other - this.supply_bio) / this.demand_bio_ind);
    this.demand_el_society += 6;
    this.demand_el_total = this.demand_el_society + this.demand_el_cars + this.demand_el_ind;


    // electric company variables
    this.supply_el_cap += this.supply_el_cap_next.shift()
    this.supply_el_usable = this.supply_el_potential > this.supply_el_cap ? this.supply_el_cap : this.supply_el_potential;

    const x = 1 + 1 * (this.demand_el_total - this.supply_el_usable) / this.demand_el_total;
    console.log(x)
    this.price_el = x < 0.896 ? 0.05 * x + 0.5 : 6*x**2 - 7*x +2; // test på en mer realistisk prisfunktion (hockeyklubba-funktion) men den blir kanske för volatil
    
    // this.price_el = Math.max(0.1, 1 + 5 * (this.demand_el_total - this.supply_el_usable) / this.demand_el_total); // ursprungliga prisekvationen

    this.elco_income = Math.log(2 * (this.demand_el_total * this.price_el));
    this.elco_cost = Math.log(1 * this.supply_el_potential);
    this.elco_EBIT_margin = 0.08 + (this.elco_income - this.elco_cost) / this.elco_income;



    // Industry variables
    this.ind_demand_carbon_ind = this.ind_carbon_demand_2019 * this.ind_co2_reduction_factor;
    this.ind_energy_consumtion = this.demand_el_ind + this.demand_bio_ind + this.ind_demand_carbon_ind;

    this.ind_ratio_el = this.demand_el_ind / this.ind_energy_consumtion;
    this.ind_ratio_bio = this.demand_bio_ind / this.ind_energy_consumtion;
    this.ind_ratio_carbon = this.ind_demand_carbon_ind / this.ind_energy_consumtion;

    this.ind_premium = this.ind_premium_factor * (this.demand_el_ind + this.demand_bio_ind);
    this.ind_turn_ratio = this.ind_co2_reduction_factor / this.turns_to_go;
    this.ind_lateness_penalty_factor = 2 * Math.max(this.ind_turn_ratio + 0.75, 1) - 1 // applies a penalty when when turn ratio > 0.25
    this.ind_CAPEX_base_el *= 0.95; // technical advances outside of the model
    this.ind_CAPEX_base_bio *= 0.95;
    this.ind_CAPEX_turn_el = this.ind_CAPEX_base_el * this.ind_turn_ratio * this.ind_lateness_penalty_factor;
    this.ind_CAPEX_turn_bio = this.ind_CAPEX_base_bio * this.ind_turn_ratio * this.ind_lateness_penalty_factor;
    
    this.emissions_ind = this.ind_co2_reduction_factor * this.ind_emissions_2019;
    this.ind_cost_emissions = this.emissions_ind * this.price_carbon
    
    this.ind_cost_el = this.demand_el_ind * this.price_el; // just interesting parameters to see
    this.ind_cost_bio = this.demand_bio_ind * this.price_bio;
    this.ind_cost_carbon = this.ind_demand_carbon_ind * this.price_carbon_energy;
    this.ind_sum = this.ind_cost_el + this.ind_cost_bio + this.ind_cost_carbon; // same as cost of energy
    
    this.ind_cost_energy = this.ind_energy_consumtion * ((this.ind_ratio_el * this.price_el) + (this.ind_ratio_bio * this.price_bio) 
    + (this.ind_ratio_carbon * this.price_carbon_energy)); 
    // this.ind_cost_energy = (this.demand_el_ind * this.price_el + this.demand_bio_ind * this.price_bio + this.ind_carbon_demand * this.price_carbon_energy 
    //   + this.ind_emissions * this.price_carbon - this.ind_premium);

    this.ind_EBIT_margin = (this.ind_income - this.ind_cost_other - this.ind_cost_energy - this.ind_cost_emissions 
      + this.ind_premium - this.ind_annuity) / this.ind_income;

    // Voters variables
    this.voters_income = 325000 / 12 * (0.95 + this.ind_EBIT_margin); // yearly income. 0.95 because we imagine industry fires people at 5 % EBIT-margin
    this.voters_svk_tax_penalty = this.demand_el_total + 45 <= this.supply_el_cap ? 0.05 : 0; 
    this.voters_tax_burden = this.voters_income * (this.voters_tax_rate + this.voters_svk_tax_penalty); // tax burden for voters from subsedies
    this.voters_carbon_burden = 0.1 * this.price_carbon; // cost of emitting for consumers
    this.voters_cost_el = this.price_el * this.voters_el_consumtion; 
        
    this.voters_dis_income = (this.voters_income - this.voters_tax_burden);
    this.voters_dis_income_after_expenses = (this.voters_dis_income - this.voters_costs_other * (0.8 + this.voters_carbon_burden * this.ind_co2_reduction_factor)
      - this.voters_cost_el);
    console.log(0.8 + this.voters_carbon_burden * this.ind_co2_reduction_factor);
    
    // Policy variables
    this.emissions_transport = this.transportation_emissions_red * this.transportation_emissions_2019; // emissions from transports
    this.emissions_total = this.emissions_ind + this.emissions_transport;

  }

  calcIrr() {
    /* Calculates the IRRs */
    this.ind_IRR_bio = []; // overwrites previous IRRs
    this.ind_IRR_el = [];

    const alt_energy_savings_bio = this.calc_alt_energy_cash_flows(0, this.ind_turn_ratio)
    const alt_energy_savings_el = this.calc_alt_energy_cash_flows(this.ind_turn_ratio, 0)

    const ind_savings_bio_low = alt_energy_savings_bio.shift();
    const ind_savings_bio_mid = alt_energy_savings_bio.shift();
    const ind_savings_bio_high = alt_energy_savings_bio.shift();

    const ind_savings_el_low = alt_energy_savings_el.shift();
    const ind_savings_el_mid = alt_energy_savings_el.shift();
    const ind_savings_el_high = alt_energy_savings_el.shift();

    const irr_bio_list_low = [-this.ind_CAPEX_turn_bio * this.pol_CAPEX_reduction_factor];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list_low.push(ind_savings_bio_low);
    }
    const irr_bio_list_mid = [-this.ind_CAPEX_turn_bio * this.pol_CAPEX_reduction_factor];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list_mid.push(ind_savings_bio_mid);
    }
    const irr_bio_list_high = [-this.ind_CAPEX_turn_bio * this.pol_CAPEX_reduction_factor];
    for (let i = 0; i < 19; i += 1) {
      irr_bio_list_high.push(ind_savings_bio_high);
    }
    const irr_el_list_low = [-this.ind_CAPEX_turn_el * this.pol_CAPEX_reduction_factor];
    for (let i = 0; i < 19; i += 1) {
      irr_el_list_low.push(ind_savings_el_low);
    }
    const irr_el_list_mid = [-this.ind_CAPEX_turn_el * this.pol_CAPEX_reduction_factor];
    for (let i = 0; i < 19; i += 1) {
      irr_el_list_mid.push(ind_savings_el_mid);
    }
    const irr_el_list_high = [-this.ind_CAPEX_turn_el * this.pol_CAPEX_reduction_factor];
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

  calcCarCosts() {
    /** Cost of having a gasoline vs an electric car */
    const driving = 1500/12; // mil i månaden
    const l_per_mil = 0.5; // liter/mil
    const kWh_per_mil = 1.5; // kWh/mil

    const gas_price = 15 + 3 * this.price_carbon; // kr per liter
    const el_price = this.price_el; // kr per kWh
    
    const cost_driving_el = el_price * kWh_per_mil * driving;
    const cost_driving_gas = gas_price * l_per_mil * driving;
    
    const car_el = this.pol_el_car_reduction_factor * (2000*1.45 + 360 + 380 + 80 + 33 + 125); // cheap leasing cost + tires + taxes
    const car_gas = 1500 + 360 + 380 + 80 + 33 + 125; // värdeminskning (lååågt räknat) + försäkring + service + skatt + besiktning + däck
    
    const cost_el = car_el + cost_driving_el;
    const cost_gas = car_gas + cost_driving_gas;
    
    // console.log('gas_price ', gas_price)
    // console.log('cost_driving_el ', cost_driving_el)
    // console.log('cost_driving_gas ', cost_driving_gas)
    // console.log('car_el ', car_el)
    // console.log('car_gas ', car_gas)
    // console.log('cost_el ', cost_el)
    // console.log('cost_gas ', cost_gas)
    
    this.voters_cost_car_el = cost_el;
    this.voters_cost_car_gas = cost_gas;

    this.voters_dis_income_after_expenses_car_el = this.voters_dis_income_after_expenses - this.voters_cost_car_el
    this.voters_dis_income_after_expenses_car_gas = this.voters_dis_income_after_expenses - this.voters_cost_car_gas 
  }

  // Industry functions
  calc_alt_energy_cash_flows(el, bio) {
    /* Gives an alternative cost structure based on current market values */
    
    const alt_demand_el_ind = this.demand_el_ind + el * 100;
    const alt_demand_bio_ind = this.demand_bio_ind + bio * 100;
    const alt_demand_carbon = this.ind_carbon_demand_2019 * (this.ind_co2_reduction_factor - el - bio);
    const alt_emissions = this.ind_emissions_2019 * (this.ind_co2_reduction_factor - el - bio);
    const alt_ind_premium = this.ind_premium_factor * (alt_demand_el_ind + alt_demand_bio_ind);
    const alt_energy_consumtion = alt_demand_el_ind + alt_demand_bio_ind + alt_demand_carbon;

    const alt_ratio_el = alt_demand_el_ind / alt_energy_consumtion;
    const alt_ratio_bio = alt_demand_bio_ind / alt_energy_consumtion;
    const alt_ratio_carbon = alt_demand_carbon / alt_energy_consumtion; 

    const premium = this.ind_premium * (1 + (alt_energy_consumtion - this.ind_energy_consumtion)/this.ind_energy_consumtion);

    // alternative costs three scenarios depending on CO2-cost
    const alt_cost_low = alt_energy_consumtion * ((alt_ratio_el * this.price_el) + (alt_ratio_bio * this.price_bio) 
    + (alt_ratio_carbon * this.price_carbon_energy)) + alt_emissions * this.price_carbon / mycket - alt_ind_premium; 

    const alt_cost_mid = alt_energy_consumtion * ((alt_ratio_el * this.price_el) + (alt_ratio_bio * this.price_bio) 
    + (alt_ratio_carbon * this.price_carbon_energy)) + alt_emissions * this.price_carbon - alt_ind_premium; 

    const alt_cost_high = alt_energy_consumtion * ((alt_ratio_el * this.price_el) + (alt_ratio_bio * this.price_bio) 
    + (alt_ratio_carbon * this.price_carbon_energy)) + alt_emissions * this.price_carbon * mycket - alt_ind_premium; 

    // current composition three CO2 scenarios
    const cost_low = alt_energy_consumtion * ((this.ind_ratio_el * this.price_el) + (this.ind_ratio_bio * this.price_bio) 
    + (this.ind_ratio_carbon * this.price_carbon_energy)) + this.emissions_ind * this.price_carbon / mycket - premium; 
    
    const cost_mid = alt_energy_consumtion * ((this.ind_ratio_el * this.price_el) + (this.ind_ratio_bio * this.price_bio) 
    + (this.ind_ratio_carbon * this.price_carbon_energy)) + this.emissions_ind * this.price_carbon  - premium; 

    const cost_high = alt_energy_consumtion * ((this.ind_ratio_el * this.price_el) + (this.ind_ratio_bio * this.price_bio) 
    + (this.ind_ratio_carbon * this.price_carbon_energy)) + this.emissions_ind * this.price_carbon * mycket - premium; 

    console.log(1 + (alt_energy_consumtion - this.ind_energy_consumtion)/this.ind_energy_consumtion)

    const low = cost_low - alt_cost_low
    const mid = cost_mid - alt_cost_mid
    const high = cost_high - alt_cost_high
    
    console.log(cost_low, ' - ', alt_cost_low, ' = ', low)
    console.log(cost_mid, ' - ', alt_cost_mid, ' = ', mid)
    console.log(cost_high, ' - ', alt_cost_high, ' = ', high)
    console.log(alt_ind_premium - premium)

    return [low, mid, high];
  }

  industry_electrify(procentage) {
    /** Electrifies a proportion of previously dirty industry */

    this.ind_co2_reduction_factor -= procentage * this.ind_turn_ratio;
    this.ind_annuity += annuity(procentage * this.ind_CAPEX_turn_el * this.pol_CAPEX_reduction_factor, WACC, 20);
    this.demand_el_ind += this.ind_turn_ratio * procentage * 100;
    
    // this.ind_income += this.ind_income * (1 + (this.ind_turn_ratio * procentage * 100) / this.ind_energy_consumtion) - this.ind_income
    this.ind_income += 0;


    console.log(procentage * this.ind_turn_ratio, annuity(procentage * this.ind_CAPEX_turn_el * this.pol_CAPEX_reduction_factor, WACC, 20),
    this.ind_turn_ratio * procentage * 100, (1 + (this.ind_turn_ratio * procentage * 100) / this.ind_energy_consumtion))
  
  }

  industry_biofy(procentage) {
    /** Exchanges dirty industrial processes with ones that rely on bio fuel */
    this.ind_co2_reduction_factor -= procentage * this.ind_turn_ratio;
    this.ind_annuity += annuity(procentage * this.ind_CAPEX_turn_bio * this.pol_CAPEX_reduction_factor, WACC, 20);
    this.demand_bio_ind += this.ind_turn_ratio * procentage * 100;

    // this.ind_income += this.ind_income * (1 + (this.ind_turn_ratio * procentage * 100) / this.ind_energy_consumtion) - this.ind_income
    this.ind_income += 0;

    
    console.log(procentage * this.ind_turn_ratio, annuity(procentage * this.ind_CAPEX_turn_bio *  this.pol_CAPEX_reduction_factor, WACC, 20), 
    this.ind_turn_ratio * procentage * 100, (1 + (this.ind_turn_ratio * procentage * 100) / this.ind_energy_consumtion))
  
  }

  industry_RnD(procentage) {
    /* Reduces future CAPEX requirements */
    this.ind_CAPEX_base_bio *= (1 - 1 * procentage / (5 + 1 * (procentage * this.ind_RnD) ** 2)) // just some function that makes the marginal utility of this function decrease
    this.ind_CAPEX_base_el *= (1 - 1 * procentage / (5 + 1 * (procentage * this.ind_RnD) ** 2))
    
    console.log((1 - 1 * procentage / (5 + 2 * (procentage * this.ind_RnD) ** 2)))
    this.ind_RnD += procentage * 1;
  
  }

  industry_increase_energy_efficiency(procentage) {
    /* Makes processes more effifiant and reduces industrial energy use */
    this.demand_el_ind *= 0.9** procentage;
    this.demand_bio_ind *= 0.9** procentage;
    this.ind_co2_reduction_factor *= 0.9**procentage;
    console.log(0.9**procentage)
  }



  // Policy functions
  policy_change_carbon_price(level) {
    /* Constructs a tree of possible carbon prices which the player can make her way through */
    if (level === 1) {
      this.price_carbon *= mycket;
    } else if (level === 2) {
      this.price_carbon *= lite;
    } else if (level === 3) {
      this.price_carbon *= 1;
    } else if (level === 4) {
      this.price_carbon /= lite;
    } else if (level === 5) {
      this.price_carbon /= mycket;
    }
  }

  // Nya kombinerade sub och ev premie
  policy_green_package(level) {
    if (level === 1) {
      this.pol_CAPEX_reduction_factor = 0.8;
      this.pol_el_car_reduction_factor = 0.8;
      this.voters_tax_burden = 0.5;
      // todo nåt med elbilar
    } else if (level === 2) {
      this.pol_CAPEX_reduction_factor = 0.9;
      this.pol_el_car_reduction_factor = 0.9;
      this.voters_tax_burden = 0.25;

    } else if (level === 3) {
      this.pol_CAPEX_reduction_factor = 1;
      this.pol_el_car_reduction_factor = 1;
      this.voters_tax_burden = 0;

    }
  }

  // politics change svk nätet
  policy_svk_supply(level) {
    if (level === 1) {
      this.supply_el_cap_next.push(40);
    } else if (level === 2) {
      this.supply_el_cap_next.push(20);
    } else if (level === 3) {
      this.supply_el_cap_next.push(0);
    }
  }


  // SVK functions 
  elco_investing(level) {
    if (level === 1) {
      this.supply_el_potential += 40; // double check so their is oppertunity for supply to be less than demand
    }
    else if (level === 2) {
      this.supply_el_potential += 0; 
    } else if (level === 3) {
      this.supply_el_potential -= 20; 
    }
  }


  // Voters functions
  voters_rate_policy(new_rating) {
    this.voters_rating = new_rating;
  }

  voters_electric_car(procentage) {
    /** Kanske kan modifieras så att den inte kan bli mindre än det största värde den tagit */
    if (1 - procentage < this.transportation_emissions_red) {
      this.transportation_emissions_red = 1 - procentage;
      this.demand_el_cars = 30 * (1 - this.transportation_emissions_red); // 30 TWh since thats roughly what it would take to electrify all cars
        }
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

    const indel = parseFloat(prompt("Elektrifiering av industrin andel denna runda: "), 10)
    p.industry_electrify(indel)
    const indbio = parseFloat(prompt("Biofiering av Industrin andel denna runda: "), 10)
    p.industry_biofy(indbio)
    const indrnd = parseFloat(prompt("Hur mycket effort läggs på rnd: "), 10)
    p.industry_RnD(indrnd)
    const indee = parseFloat(prompt("Hur mycket effort läggs på energieffektivisering: "), 10)
    p.industry_increase_energy_efficiency(indee)
    // const vote = parseFloat(prompt("Voters vote [0, 1]: "))
    // p.voters_rate_policy(vote)
    const car = parseFloat(prompt("Vilken andel köper elbil? "), 10)
    p.voters_electric_car(car)


    p.basicTurnCalculations();
    p.calcIrr();
    p.calcCarCosts();
    console.log(p);

  }
}

test();
