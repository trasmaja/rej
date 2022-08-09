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
        this.subVote = [0, 0, 0];
        this.evVote = [0, 0, 0];
    }

    vote(decisionIndex, question) {
        console.log(question, decisionIndex)
        if(question === 0) {
            this.co2Vote[decisionIndex] += 1;
        } else if (question === 1) {
            this.subVote[decisionIndex] += 1;
        } else if (question === 2) {
            this.evVote[decisionIndex] += 1;
        }
        console.log(this.co2Vote, this.subVote, this.evVote);
    }

    resetVotes() {
        this.co2Vote = [0, 0, 0, 0, 0];
        this.subVote = [0, 0, 0];
        this.evVote = [0, 0, 0];
    }

    executeVote() {
        const decisionIndexCo2 = 1 + indexOfMax(this.co2Vote);
        const decisionIndexSub = 1 + indexOfMax(this.subVote);
        const decisionIndexEv = 1 + indexOfMax(this.evVote);

        this.params.policy_change_carbon_price(decisionIndexCo2);
        this.params.policy_subsidies(decisionIndexSub);
        this.params.policy_ev_premium(decisionIndexEv);

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

        if(decisionIndexSub === 1) {
            decisionString += "TODO, ";
        }
        else if (decisionIndexSub === 2) {
            decisionString += "TODO, ";
        }
        else if (decisionIndexSub === 3) {
            decisionString += "TODO, ";
        }

        if(decisionIndexEv === 1) {
            decisionString += "TODO.";
        }
        else if (decisionIndexEv === 2) {
            decisionString += "TODO.";
        }
        else if (decisionIndexEv === 3) {
            decisionString += "TODO.";
        }

        this.decisionsMade.push(decisionString);






    }

}

export class Stam extends Sector {
    constructor(index, params) {
        super("Stam", index, params);
        this.hello = 10;
        this.votesOnDecisions = [0, 0];
    }

    vote(decisionIndex, question) {
        this.votesOnDecisions[decisionIndex] += 1;
        console.log(this.votesOnDecisions);
    }

    resetVotes() {
        this.votesOnDecisions = [0, 0];
    }

    executeVote() {
        const decisionIndex = 1 + indexOfMax(this.votesOnDecisions);
        this.params.svk_investing(decisionIndex);
        
        if(decisionIndex === 1) {
            this.decisionsMade.push("investerade med hänsyn")
        } else if (decisionIndex === 2) {
            this.decisionsMade.push("blitz-investerade")
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