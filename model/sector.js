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
                break;
            case 1: // elektrifiering
                this.params.industry_electrify();
                break;
            case 2: // R&D
                this.params.industry_RnD();
                break;
            case 3: // energieffektivisering
                this.params.industry_increase_energy_efficiency();
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
        } else if (decisionIndex === 1) {
            this.params.voters_rate_policy(0.7);
        } else if (decisionIndex === 2) {
            this.params.voters_rate_policy(0.4);
        } else if (decisionIndex === 3) {
            this.params.voters_rate_policy(0.2);
        }
    }
}