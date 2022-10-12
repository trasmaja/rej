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
        // Sum ints in array https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
        const totalVotes = this.votesOnDecisions.reduce((partialSum, a) => partialSum + a, 0);
        let decisionString = "";
        if (totalVotes === 0) {
            this.params.industry_biofy(0.25);
            this.params.industry_electrify(0.25);
            this.params.industry_RnD(0.25);
            this.params.industry_increase_energy_efficiency(0.25);
            decisionString += "25 % biofiering, 25 % elektrifiering, 25 % R&D, 25 % energieffektiviserings."
        } else {
            const percentageBio = this.votesOnDecisions[0] / totalVotes;
            const percentageEl = this.votesOnDecisions[1] / totalVotes;
            const percentageRnD = this.votesOnDecisions[2] / totalVotes;
            const percentageEnergyEfficency = this.votesOnDecisions[3] / totalVotes;

            this.params.industry_biofy(percentageBio);
            this.params.industry_electrify(percentageEl);
            this.params.industry_RnD(percentageRnD);
            this.params.industry_increase_energy_efficiency(percentageEnergyEfficency);
            decisionString += `${Math.floor(percentageBio * 100)} % biofiering, ${Math.floor(percentageEl * 100)} % elektrifiering, ${Math.floor(percentageRnD * 100)} % R&D, ${Math.floor(percentageEnergyEfficency * 100)} % energieffektiviserings.`
        }
        this.decisionsMade.push(decisionString);
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
        if (question === 0) {
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
        // Kan bli delat med noll todo fix later
        // const decisionIndexCo2 = 1 + indexOfMax(this.co2Vote);
        const decisionIndexCo2 = (1 * this.co2Vote[0] + 2 * this.co2Vote[1] + 3 * this.co2Vote[2] + 4 * this.co2Vote[3] + 5 * this.co2Vote[4]) / (this.co2Vote[0] + this.co2Vote[1] + this.co2Vote[2] + this.co2Vote[3] + this.co2Vote[4]);
        // const decisionIndexGreen = 1 + indexOfMax(this.greenPackage);
        const decisionIndexGreen = Math.round((1 * this.greenPackage[0] + 2 * this.greenPackage[1] + 3 * this.greenPackage[2]) / (this.greenPackage[0] + this.greenPackage[1] + this.greenPackage[2]));
        // const decisionIndexSVK = 1 + indexOfMax(this.svk);
        const decisionIndexSVK = (1 * this.svk[0] + 2 * this.svk[1] + 3 * this.svk[2]) / (this.svk[0] + this.svk[1] + this.svk[2])


        this.params.policy_change_carbon_price(decisionIndexCo2);
        this.params.policy_green_package(decisionIndexGreen);
        this.params.policy_svk_supply(decisionIndexSVK)

        let decisionString = "";

        const decisionIndexCo2Rounded = Math.round(decisionIndexCo2)
        if (decisionIndexCo2Rounded === 1) {
            decisionString += "ökade CO2-priset mycket, ";
        } else if (decisionIndexCo2Rounded === 2) {
            decisionString += "ökade CO2-priset lite, ";
        } else if (decisionIndexCo2Rounded === 3) {
            decisionString += "behöll samma CO2-priset, ";
        } else if (decisionIndexCo2Rounded === 4) {
            decisionString += "minskade CO2-priset lite, ";
        } else if (decisionIndexCo2Rounded === 5) {
            decisionString += "minskade CO2-priset mycket, ";
        }

        if (decisionIndexGreen === 1) {
            decisionString += "gav stort grönt giv, ";
        }
        else if (decisionIndexGreen === 2) {
            decisionString += "gav mellan grönt giv, ";
        }
        else if (decisionIndexGreen === 3) {
            decisionString += "gav litet grönt giv, ";
        }

        const decisionIndexSVKRounded = Math.round(decisionIndexSVK)
        if (decisionIndexSVKRounded === 1) {
            decisionString += "byggde ut stamnätet mycket.";
        }
        else if (decisionIndexSVKRounded === 2) {
            decisionString += "byggde ut stamnätet lite.";
        }
        else if (decisionIndexSVKRounded === 3) {
            decisionString += "behöll samma nivå i stamnätet";
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
        // const decisionIndex = 1 + indexOfMax(this.votesOnDecisions);
        const decisionIndex = (1 * this.votesOnDecisions[0] + 2 * this.votesOnDecisions[1] + 3 * this.votesOnDecisions[2]) / (this.votesOnDecisions[0] + this.votesOnDecisions[1] + this.votesOnDecisions[2])
        this.params.elco_investing(decisionIndex);


        if (decisionIndex < 2) {
            this.decisionsMade.push("valde att öka elproduktionen.")
        } else if (decisionIndex >= 2) {
            this.decisionsMade.push("valde att minska elproduktionen.")
        }

    }
}

export class Voter extends Sector {
    constructor(index, params) {
        super("Voter", index, params);
        this.hello = 10;
        this.ratingDec = [0, 0, 0, 0];
        this.carChoice = [0, 0];
        this.votersPriority = [0, 0 ,0];
        this.highestElCar = 0;
    }

    vote(decisionIndex, question) {
        if (question === 0) {
            this.ratingDec[decisionIndex] += 1;
        } else if (question === 1) {
            this.carChoice[decisionIndex] += 1;
        } else if (question === 2) {
            this.votersPriority[decisionIndex] += 1;
        }
    }

    resetVotes() {
        this.ratingDec = [0, 0, 0, 0];
        this.carChoice = [0, 0];
        this.votersPriority = [0, 0 ,0];
    }

    executeVote() {
        // const decisionIndex = indexOfMax(this.ratingDec);
        // Sum ints in array https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
        const totalVotesRating = this.ratingDec.reduce((partialSum, a) => partialSum + a, 0);
        const totalVotesCar = this.carChoice.reduce((partialSum, a) => partialSum + a, 0);
        const votersPriorityChoice = indexOfMax(this.votersPriority);

        let decisionString = "";

        if (totalVotesRating === 0) {
            this.params.voters_rate_policy(0.5);
            decisionString += "gav politkerna ett betyg på 50 %, "
        } else {
            const rating = (1 * this.ratingDec[0] + 0.7 * this.ratingDec[1] + 0.4 * this.ratingDec[2] + 0 * this.ratingDec[3]) / totalVotesRating;
            const roundedRating = Math.round(rating * 100) / 100;
            this.params.voters_rate_policy(roundedRating);
            decisionString += `gav politkerna ett betyg på ${Math.floor(rating * 100)} %, `
        }

        if (totalVotesCar === 0) {
            // Gör inget
            // this.params.voters_electric_car(0)
        } else {
            const electrifyPercentage = this.carChoice[0] / totalVotesCar;
            const roundedPercentage = Math.round(electrifyPercentage * 100) / 100;
            if (roundedPercentage > this.highestElCar) {
                this.highestElCar = roundedPercentage;
            }
            this.params.voters_electric_car(roundedPercentage)
            decisionString += `${Math.floor(this.highestElCar * 100)} % kör elbil, `
        }

        this.params.voters_set_priority(votersPriorityChoice)
        if(votersPriorityChoice === 0) {
            decisionString += "prioriterade sysselsättning."
        } else if (votersPriorityChoice === 1) {
            decisionString += "prioriterade disponibel inkomst."
        } else if (votersPriorityChoice === 2) {
            decisionString += "prioriterade CO2-utsläpp."
        }

        this.decisionsMade.push(decisionString);
    }
}