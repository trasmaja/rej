export default class Params {
    constructor() {
        this.energiConsumption = 1000; // energikonsumtionen
        this.energyBIO = 0; // procent av energikonsumtionen som är BIO
        this.energyEl = 0;  // procent av energikonsumtionen som är EL
        this.energyCO2 = 1; // procent av energikonsumtionen som är CO2
        this.priceEl = 1000; // basvärde
        this.priceBio = 0; // Kostnader som ska uppstå om tight på marknaden
        this.priceDrift = 0; // Kostnader som ska uppstå om tight på marknaden
        this.priceCO2 = 1.2; // konsant
        this.demandBio = 100;
        this.demandEl = 100;
        this.supplyBio = 100;
        this.supplyEl = 100;
        this.WACC = 0.11;
        
        // EBIT
        this.earnings = 100;
        this.manufacturingCosts = 10;
        this.totalAnnuity = 0;

        this.CAPEX = 100;
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

    getData() {
        return {"tmp": this.CAPEX};
    }

    
}