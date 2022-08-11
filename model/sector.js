// eslint-disable-next-line max-classes-per-file
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i += 1) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
class Sector {
    constructor(name, index, params) {
        this.name = name;
        this.index = index;
        this.params = params;
        this.decisionsMade = [];
    }

    getDecisionsMade(turn) {
        return this.decisionsMade[turn];
    }
}

export class Industri extends Sector {
    constructor(index, params) {
        super("Industri", index, params);
        this.hello = 10;
        this.votesOnDecisions = [0, 0, 0, 0];
    }

    vote(decisionIndex, question) {
        this.votesOnDecisions[decisionIndex] += 1;
        console.log(this.votesOnDecisions);
    }

    resetVotes() {
        this.votesOnDecisions = [0, 0, 0, 0];
    }

    executeVote() {
        const decisionIndex = indexOfMax(this.votesOnDecisions);
        console.log(decisionIndex);
        switch (decisionIndex) {
            case 0: // bio
                this.params.industry_biofy();
                this.decisionsMade.push("satsade på biodrivmedel");
                break;
            case 1: // elektrifiering
                this.params.industry_electrify();
                this.decisionsMade.push("satsade på elektrifiering");
                break;
            case 2: // R&D
                this.params.industry_RnD();
                this.decisionsMade.push("investerade i R&D");
                break;
            case 3: // energieffektivisering
                this.params.industry_increase_energy_efficiency();
                this.decisionsMade.push("investerade i energieffektivisering");
                break;
            default:
                break;
        }
    }

}

export class Policy extends Sector {
    constructor(index, params) {
        super("Policy", index, params);
        this.hello = 10;
        this.co2Vote = [0, 0, 0, 0, 0];
        this.greenPackage = [0, 0, 0];
        this.svk = [0, 0, 0];
    }

    vote(decisionIndex, question) {
        console.log(question, decisionIndex)
        if(question === 0) {
            this.co2Vote[decisionIndex] += 1;
        } else if (question === 1) {
            this.greenPackage[decisionIndex] += 1;
        } else if (question === 2) {
            this.svk[decisionIndex] += 1;
        }
        console.log(this.co2Vote, this.greenPackage, this.svk);
    }

    resetVotes() {
        this.co2Vote = [0, 0, 0, 0, 0];
        this.greenPackage = [0, 0, 0];
        this.svk = [0, 0, 0];
    }

    executeVote() {
        const decisionIndexCo2 = 1 + indexOfMax(this.co2Vote);
        const decisionIndexGreen = 1 + indexOfMax(this.greenPackage);
        const decisionIndexSVK = 1 + indexOfMax(this.svk);

        this.params.policy_change_carbon_price(decisionIndexCo2);
        this.params.policy_green_package(decisionIndexGreen);
        this.params.policy_svk_supply(decisionIndexSVK)

        let decisionString = "";

        if(decisionIndexCo2 === 1) {
            decisionString += "ökade CO2-priset mycket, ";
        } else if (decisionIndexCo2 === 2) {
            decisionString += "ökade CO2-priset lite, ";
        } else if (decisionIndexCo2 === 3) {
            decisionString += "behöll samma CO2-priset, ";
        } else if (decisionIndexCo2 === 4) {
            decisionString += "minskade CO2-priset lite, ";
        } else if (decisionIndexCo2 === 5) {
            decisionString += "minskade CO2-priset mycket, ";
        }

        if(decisionIndexGreen === 1) {
            decisionString += "stort grön paket och";
        }
        else if (decisionIndexGreen === 2) {
            decisionString += "mellan grän paket och";
        }
        else if (decisionIndexGreen === 3) {
            decisionString += "litet grön paket och ";
        }

        if(decisionIndexSVK === 1) {
            decisionString += "byggde ut stamnätet mycket.";
        }
        else if (decisionIndexSVK === 2) {
            decisionString += "byggde ut stamnätet lite.";
        }
        else if (decisionIndexSVK === 3) {
            decisionString += "Behöll samma nivå i stamnätet";
        }

        this.decisionsMade.push(decisionString);






    }

}

export class Elco extends Sector {
    constructor(index, params) {
        super("Elco", index, params);
        this.hello = 10;
        this.votesOnDecisions = [0, 0, 0];
    }

    vote(decisionIndex, question) {
        this.votesOnDecisions[decisionIndex] += 1;
        console.log(this.votesOnDecisions);
    }

    resetVotes() {
        this.votesOnDecisions = [0, 0, 0];
    }

    executeVote() {
        const decisionIndex = 1 + indexOfMax(this.votesOnDecisions);
        this.params.elco_investing(decisionIndex);
        
        if(decisionIndex === 1) {
            this.decisionsMade.push("valde att öka elproduktionen")
        } else if (decisionIndex === 2) {
            this.decisionsMade.push("valde att bibehålla nuvarande elproduktion")
        } else if (decisionIndex === 3) {
            this.decisionsMade.push("valde att minska elproduktionen")
        }
        
    }
}

export class Voter extends Sector {
    constructor(index, params) {
        super("Voter", index, params);
        this.hello = 10;
        this.ratingDec = [0, 0, 0, 0];
    }

    vote(decisionIndex, question) {
        if(question === 0) {
            this.ratingDec[decisionIndex] += 1;
        }
        console.log(this.ratingDec);
    }

    resetVotes() {
        this.ratingDec = [0, 0, 0, 0];
    }

    executeVote() {
        const decisionIndex = indexOfMax(this.ratingDec);

        if(decisionIndex === 0) {
            this.params.voters_rate_policy(0.9);
            this.decisionsMade.push("gav Politikerna en mycket bra rating")
        } else if (decisionIndex === 1) {
            this.params.voters_rate_policy(0.7);
            this.decisionsMade.push("gav Politikerna en bra rating")
        } else if (decisionIndex === 2) {
            this.params.voters_rate_policy(0.4);
            this.decisionsMade.push("gav Politikerna en dålig rating")
        } else if (decisionIndex === 3) {
            this.params.voters_rate_policy(0.2);
            this.decisionsMade.push("gav Politikerna en mycket dålig rating")
        }
    }
}