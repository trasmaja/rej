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

    executeVote(turn) {
        console.log("##########")
        console.log(turn)
        // Sum ints in array https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
        const totalVotes = this.votesOnDecisions.reduce((partialSum, a) => partialSum + a, 0);
        let decisionString = "beslutsfördelning: ";

        // Write over first turn voting to preprogrammed choice

        if (totalVotes === 0) {
            let percentageBio = 0.25;
            let percentageEl = 0.25;
            let percentageRnD = 0.25;
            let percentageEnergyEfficency = 0.25;
            // Write over first turn voting to preprogrammed choice
            if (turn === 1) {
                percentageBio = 0
                percentageEl = 0.1
                percentageRnD = 0.5
                percentageEnergyEfficency = 0.4
            }
            this.params.industry_biofy(percentageBio);
            this.params.industry_electrify(percentageEl);
            this.params.industry_RnD(percentageRnD);
            this.params.industry_increase_energy_efficiency(percentageEnergyEfficency);
            decisionString += `${Math.floor(percentageBio * 100)} % biodrivmedel, ${Math.floor(percentageEl * 100)} % elektrifiering, ${Math.floor(percentageRnD * 100)} % R&D, ${Math.floor(percentageEnergyEfficency * 100)} % energieffektivisering.`
        } else {
            let percentageBio = this.votesOnDecisions[0] / totalVotes;
            let percentageEl = this.votesOnDecisions[1] / totalVotes;
            let percentageRnD = this.votesOnDecisions[2] / totalVotes;
            let percentageEnergyEfficency = this.votesOnDecisions[3] / totalVotes;

            // Write over first turn voting to preprogrammed choice
            if (turn === 1) {
                percentageBio = 0
                percentageEl = 0.1
                percentageRnD = 0.5
                percentageEnergyEfficency = 0.4
            }

            this.params.industry_biofy(percentageBio);
            this.params.industry_electrify(percentageEl);
            this.params.industry_RnD(percentageRnD);
            this.params.industry_increase_energy_efficiency(percentageEnergyEfficency);
            decisionString += `${Math.floor(percentageBio * 100)} % biodrivmedel, ${Math.floor(percentageEl * 100)} % elektrifiering, ${Math.floor(percentageRnD * 100)} % R&D, ${Math.floor(percentageEnergyEfficency * 100)} % energieffektivisering.`
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

    executeVote(turn) {
        // Kan bli delat med noll todo fix later
        // const decisionIndexCo2 = 1 + indexOfMax(this.co2Vote);
        let decisionIndexCo2;
        if ((this.co2Vote[0] + this.co2Vote[1] + this.co2Vote[2] + this.co2Vote[3] + this.co2Vote[4]) === 0) {
            decisionIndexCo2 = 2;
        } else {
            decisionIndexCo2 = (1 * this.co2Vote[0] + 2 * this.co2Vote[1] + 3 * this.co2Vote[2] + 4 * this.co2Vote[3] + 5 * this.co2Vote[4]) / (this.co2Vote[0] + this.co2Vote[1] + this.co2Vote[2] + this.co2Vote[3] + this.co2Vote[4]);
        }
        // const decisionIndexGreen = 1 + indexOfMax(this.greenPackage);
        let decisionIndexGreen;
        if ((this.greenPackage[0] + this.greenPackage[1] + this.greenPackage[2]) === 0) {
            decisionIndexGreen = 2;
        } else {
            decisionIndexGreen = Math.round((1 * this.greenPackage[0] + 2 * this.greenPackage[1] + 3 * this.greenPackage[2]) / (this.greenPackage[0] + this.greenPackage[1] + this.greenPackage[2]));
        }
        // const decisionIndexSVK = 1 + indexOfMax(this.svk);
        let decisionIndexSVK;
        if ((this.svk[0] + this.svk[1] + this.svk[2]) === 0) {
            decisionIndexSVK = 2;
        } else {
            decisionIndexSVK = (1 * this.svk[0] + 2 * this.svk[1] + 3 * this.svk[2]) / (this.svk[0] + this.svk[1] + this.svk[2])
        }
        if (turn === 1) {
            decisionIndexCo2 = 2;
            decisionIndexGreen = 2;
            decisionIndexSVK = 2;
        }

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
            decisionString += "behöll samma CO2-pris, ";
        } else if (decisionIndexCo2Rounded === 4) {
            decisionString += "minskade CO2-priset lite, ";
        } else if (decisionIndexCo2Rounded === 5) {
            decisionString += "minskade CO2-priset mycket, ";
        }

        if (decisionIndexGreen === 1) {
            decisionString += "gjorde en stor satsning på gröna subventioner ";
        }
        else if (decisionIndexGreen === 2) {
            decisionString += "gjorde en måttlig satsning på gröna subventioner ";
        }
        else if (decisionIndexGreen === 3) {
            decisionString += "gjorde ingen satsning på gröna subventioner ";
        }

        const decisionIndexSVKRounded = Math.round(decisionIndexSVK)
        if (decisionIndexSVKRounded === 1) {
            decisionString += "och byggde ut stamnätet mycket.";
        }
        else if (decisionIndexSVKRounded === 2) {
            decisionString += "och byggde ut stamnätet lite.";
        }
        else if (decisionIndexSVKRounded === 3) {
            decisionString += "och behöll samma nivå i stamnätet";
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

    executeVote(turn) {
        // const decisionIndex = 1 + indexOfMax(this.votesOnDecisions);
        let decisionIndex;
        if ((this.votesOnDecisions[0] + this.votesOnDecisions[1] + this.votesOnDecisions[2]) === 0) {
            decisionIndex = 1.4;
        } else {
            decisionIndex = (1 * this.votesOnDecisions[0] + 2 * this.votesOnDecisions[1] + 3 * this.votesOnDecisions[2]) / (this.votesOnDecisions[0] + this.votesOnDecisions[1] + this.votesOnDecisions[2])
        }

        if (turn === 1) {
            decisionIndex = 1.4;
        }
        this.params.elco_investing(decisionIndex);

        if (decisionIndex < 1.5) {
            this.decisionsMade.push("valde att öka elproduktionen mycket.")
        } else if (decisionIndex >= 1.5 && decisionIndex < 2) {
            this.decisionsMade.push("valde att öka elproduktionen lite.")
        } else if (decisionIndex === 2) {
            this.decisionsMade.push("valde att behålla nuvarande elproduktion.")
        } else if (decisionIndex > 2 && decisionIndex < 2.5) {
            this.decisionsMade.push("valde att minska elproduktionen lite.")
        } else if (decisionIndex >= 2.5) {
            this.decisionsMade.push("valde att minska elproduktionen mycket.")
        }
    }
}

export class Voter extends Sector {
    constructor(index, params) {
        super("Voter", index, params);
        this.hello = 10;
        this.ratingDec = [0, 0, 0, 0];
        this.carChoice = [0, 0];
        this.votersPriority = [0, 0, 0];
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
        this.votersPriority = [0, 0, 0];
    }

    executeVote(turn) {
        // const decisionIndex = indexOfMax(this.ratingDec);
        // Sum ints in array https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
        const totalVotesRating = this.ratingDec.reduce((partialSum, a) => partialSum + a, 0);
        const totalVotesCar = this.carChoice.reduce((partialSum, a) => partialSum + a, 0);
        let votersPriorityChoice = indexOfMax(this.votersPriority);


        let decisionString = "";

        if (totalVotesRating === 0) {
            if (turn === 1) {
                this.params.voters_rate_policy(0.6); // Ska matcha ovanstående if sats
                decisionString += "förtroende för politikerna är 60 %, "
            } else {
                this.params.voters_rate_policy(0.5);
                decisionString += "förtroende för politikerna är 50 %, "
            }

        } else {
            const rating = (1 * this.ratingDec[0] + 0.7 * this.ratingDec[1] + 0.4 * this.ratingDec[2] + 0 * this.ratingDec[3]) / totalVotesRating;
            let roundedRating = Math.round(rating * 100) / 100;
            if (turn === 1) {
                roundedRating = 0.6
            }
            this.params.voters_rate_policy(roundedRating);
            decisionString += `förtroende för politikerna är ${Math.floor(roundedRating * 100)} %, `
        }

        if (totalVotesCar === 0) {
            if (turn === 1) {
                const roundedPercentage = 0.15
                if (roundedPercentage > this.highestElCar) {
                    this.highestElCar = roundedPercentage;
                }
                this.params.voters_electric_car(roundedPercentage)
                decisionString += `${Math.floor(this.highestElCar * 100)} % kör elbil `
            }


        } else {
            const electrifyPercentage = this.carChoice[0] / totalVotesCar;
            let roundedPercentage = Math.round(electrifyPercentage * 100) / 100;
            if (turn === 1) {
                roundedPercentage = 0.15
            }
            if (roundedPercentage > this.highestElCar) {
                this.highestElCar = roundedPercentage;
            }
            this.params.voters_electric_car(roundedPercentage)
            decisionString += `${Math.floor(this.highestElCar * 100)} % kör elbil `
        }

        if (turn === 1) {
            votersPriorityChoice = 0;
        }
        this.params.voters_set_priority(votersPriorityChoice)
        if (votersPriorityChoice === 0) {
            decisionString += "och deras viktigaste fråga är arbetslösheten."
        } else if (votersPriorityChoice === 1) {
            decisionString += "och deras viktigaste fråga är deras disponibla inkomst."
        } else if (votersPriorityChoice === 2) {
            decisionString += "och deras viktigaste fråga är CO2-utsläppen."
        }

        this.decisionsMade.push(decisionString);
    }
}