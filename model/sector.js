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

    vote(decisionIndex) {
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
    }
}

