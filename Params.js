import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { irr } = require('node-irr')


const annuity = (C, i, n) => C * (i/(1-(1+i)**(-n)));
export default class Params {
    constructor() {
        this.energiConsumption = 1000; // energikonsumtionen
        this.energyBIO = 0; // procent av energikonsumtionen som är BIO
        this.energyEl = 0;  // procent av energikonsumtionen som är EL
        this.energyCO2 = 1; // procent av energikonsumtionen som är CO2
        this.priceEl = 1000; // basvärde
        this.priceBio = 0; // Kostnader som ska uppstå om tight på marknaden
        this.priceDrift = 0; // Kostnader som ska uppstå om tight på marknaden
        this.priceCO2 = 100; // konsant
        this.demandBio = 90;
        this.demandEl = 90;
        this.supplyBio = 100;
        this.supplyEl = 100;
        this.WACC = 0.11;
        
        // EBIT
        this.earnings = 1001200 * 5;
        this.manufacturingCosts = 1001200 * 3;
        this.totalAnnuity = 0;

        this.CAPEX = 1001200;

        // Calcs
        this.cO2EmissionsValue = this.cO2Emissions();
        this.energyCostsValue = this.energyCosts();
        this.EBITValue = this.EBIT();
    }

    cO2Emissions() {
        return 100*this.energyCO2
    }

    energyCosts() {
        const bioPrice = this.energyBIO * (this.priceEl + this.priceBio);
        const elPrice = this.energyEl * (this.priceEl + this.priceDrift);
        const co2Price = this.energyCO2 * (this.priceEl + this.priceCO2);
        const averagePrice = bioPrice + elPrice + co2Price;
        const energyCosts = this.energiConsumption * averagePrice;
        return energyCosts;
    }

    EBIT() {
        const numenator = this.earnings - this.manufacturingCosts - this.energyCosts() - this.totalAnnuity;
        const denomenator = this.earnings;
        const EBIT = numenator / denomenator;
        return EBIT;
    }

    makeIndustryChanges(index) {
        this.supplyBio += 10;
        this.supplyEl += 10;
        console.log("making some changes")
        if(index === 0) { // Investera i bio
            this.energyBIO += 0.2;
            this.energyCO2 -= 0.2;
            this.totalAnnuity += annuity(this.CAPEX, this.WACC, 20);
            this.demandBio += 20;
        } else if (index === 1) { // investeria i el
            this.energyEl += 0.2;
            this.energyCO2 -= 0.2;    
            this.totalAnnuity += annuity(this.CAPEX, this.WACC, 20);
            this.demandEl += 20;
        } else if (index === 2) { // investera i R&D
            this.CAPEX *= 0.8;
        }
        console.log(this.supplyBio, this.demandBio)  
        if(this.supplyBio < this.demandBio) {
            this.priceBio = 100 * (this.demandBio - this.supplyBio);
        } else {
            this.priceBio = 0;
        }
        if(this.supplyEl < this.demandEl) {
            this.priceEl = 100 * (this.demandEl - this.supplyEl);
        }
        else {
            this.priceEl = 0;
        }

        this.cO2EmissionsValue = this.cO2Emissions();
        this.energyCostsValue = this.energyCosts();
        this.EBITValue = this.EBIT();

    }

    getIRR() {
        const data = [-this.CAPEX, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1, 1001200*0.1,]
        const tmp = irr(data);
        return [tmp, tmp, tmp]
    }

    
}